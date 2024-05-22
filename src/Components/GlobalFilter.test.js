import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import GlobalFilter from './GlobalFilter';

describe('GlobalFilter', () => {
    it('renders input with placeholder and value', () => {
        const { getByPlaceholderText, getByDisplayValue } = render(<GlobalFilter globalFilter="test" />);
        const input = getByPlaceholderText('Search all columns...');
        expect(input).toBeInTheDocument();
        expect(getByDisplayValue('test')).toBeInTheDocument();
    });

    it('calls setGlobalFilter on input change', () => {
        const setGlobalFilterMock = jest.fn();
        const { getByPlaceholderText } = render(<GlobalFilter globalFilter="" setGlobalFilter={setGlobalFilterMock} />);
        const input = getByPlaceholderText('Search all columns...');
        fireEvent.change(input, { target: { value: 'example' } });
        expect(setGlobalFilterMock).toHaveBeenCalledWith('example');
    });
});
