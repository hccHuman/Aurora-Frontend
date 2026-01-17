import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'jotai';
import AccessibilityMenu from '@/components/tsx/AccessibilityMenu/AccessibilityMenu';
import { accessibilityManager } from '@/modules/LUCIA/accessibility-manager/accessibility-manager';

describe('E2E: Accessibility Persistence', () => {
    beforeEach(() => {
        localStorage.clear();
        document.documentElement.className = '';
        // Reset accessibility manager state manually if needed, 
        // but since it's a singleton we can just toggle back.
        accessibilityManager.setAaaMode(false);
        accessibilityManager.setEpilepsySafe(false);
        accessibilityManager.setFocusMode(false);
    });

    it('should enable AAA mode and verify it persists in the DOM', async () => {
        const { rerender } = render(
            <Provider>
                <AccessibilityMenu lang="en" />
            </Provider>
        );

        // Open menu
        const toggleBtn = screen.getByLabelText(/Accessibility menu/i);
        fireEvent.click(toggleBtn);

        // Enable AAA Mode
        const aaaBtn = screen.getByText(/Master WCAG 2.1 AAA/i);
        fireEvent.click(aaaBtn);

        // Verify class is added to documentElement
        expect(document.documentElement.classList.contains('mode-aaa')).toBe(true);
        expect(localStorage.getItem('mode-aaa')).toBe('true');

        // Simulate Navigation by re-rendering the component
        // The manager should initialize from localStorage
        rerender(
            <Provider>
                <AccessibilityMenu lang="en" />
            </Provider>
        );

        expect(document.documentElement.classList.contains('mode-aaa')).toBe(true);
    });

    it('should enable Epilepsy Safe mode and verify logic', () => {
        render(
            <Provider>
                <AccessibilityMenu lang="en" />
            </Provider>
        );

        fireEvent.click(screen.getByLabelText(/Accessibility menu/i));
        fireEvent.click(screen.getByText(/Anti-Epilepsy Mode/i));

        expect(document.documentElement.classList.contains('mode-epilepsy')).toBe(true);
        expect(localStorage.getItem('mode-epilepsy')).toBe('true');
    });
});
