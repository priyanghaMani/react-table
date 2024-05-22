
import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import DefaultColumnFilter from './DefaultColumnFilter';

const mockColumn = {
    filterValue: [],
    setFilter: jest.fn(),
    Header: 'Test Header',
    preFilteredRows: [
        { values: { id: '1', testColumn: 'Value 1' } },
        { values: { id: '2', testColumn: 'Value 2' } },
        { values: { id: '3', testColumn: 'Value 3' } },
    ],
    id: 'testColumn',
};
const mockOnSearch = jest.fn();

describe('DefaultColumnFilter', () => {
    test('renders correctly', () => {
        render(<DefaultColumnFilter column={mockColumn} onSearch={mockOnSearch} />);
        expect(screen.getByRole('button')).toBeInTheDocument();
    });

    test('opens popover on icon click', () => {
        render(<DefaultColumnFilter column={mockColumn} onSearch={mockOnSearch} />);
        fireEvent.click(screen.getByRole('button'));
        expect(screen.getByRole('presentation')).toBeInTheDocument();
    });

    test('interacts with checkboxes', () => {
        render(<DefaultColumnFilter column={mockColumn} onSearch={mockOnSearch} />);
        fireEvent.click(screen.getByRole('button'));
        const checkboxes = screen.getAllByRole('checkbox');
        fireEvent.click(checkboxes[0]);
        expect(checkboxes[0]).toBeChecked();
        fireEvent.click(checkboxes[0]);
        expect(checkboxes[0]).not.toBeChecked();
    });

    test('resets selected values on reset button click', () => {
        render(<DefaultColumnFilter column={mockColumn} onSearch={mockOnSearch} />);
        fireEvent.click(screen.getByRole('button'));
        const checkboxes = screen.getAllByRole('checkbox');
        fireEvent.click(checkboxes[0]);
        fireEvent.click(screen.getByText('Reset'));
        expect(mockOnSearch).toHaveBeenCalledWith('testColumn', []);
        expect(checkboxes[0]).not.toBeChecked();
    });
});
