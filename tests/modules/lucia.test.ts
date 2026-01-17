import { themeManager } from '@/modules/LUCIA/theme-manager/theme-manager';
import { cvdManager } from '@/modules/LUCIA/cvd-manager/cvd-manager';
import type { CvdMode } from '@/modules/LUCIA/cvd-manager/cvd-manager';
import { accessibilityManager } from '@/modules/LUCIA/accessibility-manager/accessibility-manager';

describe('LUCIA Module - Accessibility and UI Managers', () => {
  // Setup for mocks
  beforeEach(() => {
    // Clear localStorage
    localStorage.clear();
    jest.clearAllMocks();

    // Reset document classes
    document.documentElement.className = '';

    // Mock matchMedia
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // Deprecated
        removeListener: jest.fn(), // Deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });

    // Mock startViewTransition
    Object.defineProperty(document, 'startViewTransition', {
      writable: true,
      value: jest.fn().mockImplementation((cb) => {
        cb();
        return { ready: Promise.resolve(), finished: Promise.resolve(), updateCallbackDone: Promise.resolve() };
      }),
    });

    // Mock document.documentElement.animate
    document.documentElement.animate = jest.fn().mockReturnValue({ finished: Promise.resolve() });
  });

  describe('ThemeManager', () => {
    it('should initialize with default light theme', () => {
      expect(themeManager.getTheme()).toBe('light');
    });

    it('should toggle theme correctly', async () => {
      const initialTheme = themeManager.getTheme();
      const expectedTheme = initialTheme === 'light' ? 'dark' : 'light';

      await themeManager.toggleTheme();

      expect(themeManager.getTheme()).toBe(expectedTheme);
      expect(localStorage.getItem('theme')).toBe(expectedTheme);
    });

    it('should apply dark class to document when theme is dark', async () => {
      // Ensure we start at light
      if (themeManager.getTheme() === 'dark') {
        await themeManager.toggleTheme();
      }

      await themeManager.toggleTheme();
      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });

    it('should dispatch theme-changed event', async () => {
      const dispatchSpy = jest.spyOn(window, 'dispatchEvent');
      await themeManager.toggleTheme();

      expect(dispatchSpy).toHaveBeenCalled();
      const event = dispatchSpy.mock.calls.find(call => (call[0] as any).type === 'theme-changed')?.[0] as any;
      expect(event).toBeDefined();
      expect(event.detail).toBeDefined();
    });

    it('should update registered icons when theme changes', () => {
      const mockIcon = { id: 'test-icon', name: 'test-image' };
      const mockImg = document.createElement('img');
      mockImg.id = mockIcon.id;
      document.body.appendChild(mockImg);

      themeManager.registerIcons([mockIcon]);

      // Check if initial theme applied
      const currentTheme = themeManager.getTheme();
      expect(mockImg.src).toContain(`/assets/Icons/${currentTheme}/test-image.png`);

      document.body.removeChild(mockImg);
    });
  });

  describe('CvdManager', () => {
    it('should set and apply CVD mode', () => {
      const mode: CvdMode = 'cvd-protanopia';
      cvdManager.setCvdMode(mode);

      expect(cvdManager.getCvdMode()).toBe(mode);
      expect(localStorage.getItem('cvd-mode')).toBe(mode);
      expect(document.documentElement.classList.contains(mode)).toBe(true);
    });

    it('should remove previous CVD classes when changing mode', () => {
      cvdManager.setCvdMode('cvd-protanopia');
      cvdManager.setCvdMode('cvd-deuteranopia');

      expect(document.documentElement.classList.contains('cvd-protanopia')).toBe(false);
      expect(document.documentElement.classList.contains('cvd-deuteranopia')).toBe(true);
    });

    it('should dispatch cvd-changed event', () => {
      const dispatchSpy = jest.spyOn(window, 'dispatchEvent');
      cvdManager.setCvdMode('cvd-tritanopia');

      expect(dispatchSpy).toHaveBeenCalled();
      const event = dispatchSpy.mock.calls.find(call => (call[0] as any).type === 'cvd-changed')?.[0] as any;
      expect(event).toBeDefined();
      expect(event.detail).toBe('cvd-tritanopia');
    });
  });

  describe('AccessibilityManager', () => {
    it('should set epilepsy safe mode', () => {
      accessibilityManager.setEpilepsySafe(true);
      expect(accessibilityManager.isEpilepsySafe()).toBe(true);
      expect(localStorage.getItem('mode-epilepsy')).toBe('true');
      expect(document.documentElement.classList.contains('mode-epilepsy')).toBe(true);
    });

    it('should set focus mode', () => {
      accessibilityManager.setFocusMode(true);
      expect(accessibilityManager.isFocusMode()).toBe(true);
      expect(localStorage.getItem('mode-adhd')).toBe('true');
      expect(document.documentElement.classList.contains('mode-adhd')).toBe(true);
    });

    it('should set AAA mode', () => {
      accessibilityManager.setAaaMode(true);
      expect(accessibilityManager.isAaaMode()).toBe(true);
      expect(localStorage.getItem('mode-aaa')).toBe('true');
      expect(document.documentElement.classList.contains('mode-aaa')).toBe(true);
    });

    it('should remove classes when disabled', () => {
      accessibilityManager.setEpilepsySafe(false);
      accessibilityManager.setFocusMode(false);
      accessibilityManager.setAaaMode(false);

      expect(document.documentElement.classList.contains('mode-epilepsy')).toBe(false);
      expect(document.documentElement.classList.contains('mode-adhd')).toBe(false);
      expect(document.documentElement.classList.contains('mode-aaa')).toBe(false);
    });

    it('should dispatch accessibility-changed event', () => {
      const dispatchSpy = jest.spyOn(window, 'dispatchEvent');
      accessibilityManager.setFocusMode(true);

      expect(dispatchSpy).toHaveBeenCalled();
      const event = dispatchSpy.mock.calls.find(call => (call[0] as any).type === 'accessibility-changed')?.[0] as any;
      expect(event).toBeDefined();
      expect(event.detail).toEqual({ type: 'adhd', value: true });
    });
  });
});

// Helper for event matching
const objectContaining = (obj: any) => expect.objectContaining(obj);

