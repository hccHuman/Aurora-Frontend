import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Paginator from '@/components/tsx/Paginator/Paginator';

describe('System: Paginator', () => {
    const mockOnPageChange = jest.fn();

    beforeEach(() => {
        mockOnPageChange.mockClear();
    });

    it('should disable previous button on first page', () => {
        render(<Paginator initialPage={1} totalPages={5} onPageChange={mockOnPageChange} lang="en" />);

        const prevButton = screen.getByLabelText(/Go to previous page/i);
        expect(prevButton).toBeDisabled();
    });

    it('should call onPageChange when next is clicked', () => {
        render(<Paginator initialPage={1} totalPages={5} onPageChange={mockOnPageChange} lang="en" />);

        const nextButton = screen.getByLabelText(/Go to next page/i);
        fireEvent.click(nextButton);

        expect(mockOnPageChange).toHaveBeenCalledWith(2);
    });

    it('should disable next button on last page', () => {
        render(<Paginator initialPage={5} totalPages={5} onPageChange={mockOnPageChange} lang="en" />);

        const nextButton = screen.getByLabelText(/Go to next page/i);
        expect(nextButton).toBeDisabled();
    });

    it('should display correct page info', () => {
        render(<Paginator initialPage={3} totalPages={10} onPageChange={mockOnPageChange} lang="en" />);

        // "3 of 10" (localized in en.json pagination.of is "of")
        expect(screen.getByText(/3\s*of\s*10/i)).toBeDefined();
    });
});
