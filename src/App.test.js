import App from './App.jsx';
import { render } from '@testing-library/react';
import { act } from 'react';

test('test App', async () => {
    await act(async () => {
        global.fetch = jest.fn(() => Promise.resolve({ json: () => Promise.resolve([]) }));
        render(<App />);
    });
});