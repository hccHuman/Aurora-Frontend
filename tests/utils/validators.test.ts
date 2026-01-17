import * as validators from '@/utils/validators';

describe('Validators Utility', () => {
    describe('isNotEmpty', () => {
        it('should return true for non-empty strings', () => {
            expect(validators.isNotEmpty('hello')).toBe(true);
            expect(validators.isNotEmpty(' a ')).toBe(true);
        });
        it('should return false for empty or whitespace strings', () => {
            expect(validators.isNotEmpty('')).toBe(false);
            expect(validators.isNotEmpty('  ')).toBe(false);
            expect(validators.isNotEmpty(null)).toBe(false);
            expect(validators.isNotEmpty(undefined)).toBe(false);
        });
    });

    describe('validateEmail', () => {
        it('should return true for valid emails', () => {
            expect(validators.validateEmail('test@example.com')).toBe(true);
            expect(validators.validateEmail('user.name@domain.co.uk')).toBe(true);
        });
        it('should return false for invalid emails', () => {
            expect(validators.validateEmail('test@example')).toBe(false);
            expect(validators.validateEmail('@example.com')).toBe(false);
            expect(validators.validateEmail('test example.com')).toBe(false);
        });
    });

    describe('validatePassword', () => {
        it('should return true for secure passwords', () => {
            expect(validators.validatePassword('Aurora123!')).toBe(true);
        });
        it('should return false for insecure passwords', () => {
            expect(validators.validatePassword('weak')).toBe(false);
            expect(validators.validatePassword('NoSpecialChar123')).toBe(false);
            expect(validators.validatePassword('no-uppercase123!')).toBe(false);
            expect(validators.validatePassword('NO-LOWERCASE123!')).toBe(false);
        });
    });

    describe('validateIBAN', () => {
        it('should validate correct IBANs with spaces', () => {
            expect(validators.validateIBAN('ES21 0000 0000 0000 0000 0000')).toBe(true);
        });
        it('should return false for invalid IBANs', () => {
            expect(validators.validateIBAN('1234')).toBe(false);
        });
    });

    describe('validatePrice', () => {
        it('should return true for positive numbers', () => {
            expect(validators.validatePrice(10)).toBe(true);
            expect(validators.validatePrice(0)).toBe(true);
        });
        it('should return false for negative numbers or NaN', () => {
            expect(validators.validatePrice(-5)).toBe(false);
            expect(validators.validatePrice(NaN)).toBe(false);
        });
    });
});
