import { t } from '@/modules/YOLI/injector';

describe('YOLI Module - Internationalization', () => {
    it('should return correct translation for Spanish', () => {
        // common.close in es.json is "Cerrar"
        expect(t('common.close', 'es')).toBe('Cerrar');
    });

    it('should return correct translation for English', () => {
        // common.close in en.json is "Close"
        expect(t('common.close', 'en')).toBe('Close');
    });

    it('should handle nested keys', () => {
        // header.aria.open_menu in en.json is "Open menu"
        expect(t('header.aria.open_menu', 'en')).toBe('Open menu');
    });

    it('should return the key if translation is not found', () => {
        expect(t('non.existent.key', 'en')).toBe('non.existent.key');
    });

    it('should default to Spanish if language is not supported', () => {
        expect(t('common.close', 'fr')).toBe('Cerrar');
    });
});
