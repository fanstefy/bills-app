import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SearchInput from './SearchInput';
import { vi } from 'vitest';

describe('SearchInput component', () => {
  let mockOnSearch: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockOnSearch = vi.fn();
  });

  test('renders input with correct label and focuses on mount', () => {
    render(<SearchInput onSearch={mockOnSearch} />);

    const input = screen.getByLabelText(/Search By Bill Type \/ No/i);
    expect(input).toBeInTheDocument();
    expect(input).toHaveFocus();
  });

  test('updates input value immediately and calls onSearch after debounce', async () => {
    render(<SearchInput onSearch={mockOnSearch} />);

    const input = screen.getByLabelText(/Search By Bill Type \/ No/i);
    fireEvent.change(input, { target: { value: 'Test' } });

    expect(input).toHaveValue('Test');

    // Should not be called immediately
    expect(mockOnSearch).not.toHaveBeenCalled();

    // Wait for debounce
    await waitFor(
      () => {
        expect(mockOnSearch).toHaveBeenCalledWith('Test');
      },
      { timeout: 1000 }
    );
  });

  test('debounces multiple rapid changes', async () => {
    render(<SearchInput onSearch={mockOnSearch} />);

    const input = screen.getByLabelText(/Search By Bill Type \/ No/i);

    fireEvent.change(input, { target: { value: 'T' } });
    fireEvent.change(input, { target: { value: 'Test' } });

    await waitFor(
      () => {
        expect(mockOnSearch).toHaveBeenCalledWith('Test');
        expect(mockOnSearch).toHaveBeenCalledTimes(1);
      },
      { timeout: 1000 }
    );
  });
});
