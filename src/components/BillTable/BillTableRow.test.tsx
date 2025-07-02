import { render, screen, fireEvent } from '@testing-library/react';
import BillTableRow from './BillTableRow';
import type { Bill } from '../../types/bill';
import { vi } from 'vitest';

describe('BillTableRow', () => {
  const bill: Bill = {
    id: '1',
    billNo: 'B001',
    billType: 'Public',
    billStatus: 'Enacted',
    sponsor: 'John Doe',
    title_en: 'Test Bill EN',
    title_ga: 'Test Bill GA',
  };

  const mockIsFavorite = vi.fn();
  const mockToggleFavorite = vi.fn();
  const mockOnRowClick = vi.fn();

  beforeEach(() => {
    mockIsFavorite.mockClear();
    mockToggleFavorite.mockClear();
    mockOnRowClick.mockClear();
  });

  test('renders bill data correctly', () => {
    mockIsFavorite.mockReturnValue(false);

    render(
      <table>
        <tbody>
          <BillTableRow
            bill={bill}
            index={0}
            isFavorite={mockIsFavorite}
            toggleFavorite={mockToggleFavorite}
            onRowClick={mockOnRowClick}
          />
        </tbody>
      </table>
    );

    expect(screen.getByText('B001')).toBeInTheDocument();
    expect(screen.getByText('Public')).toBeInTheDocument();
    expect(screen.getByText('Enacted')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  test('calls onRowClick when row is clicked', () => {
    mockIsFavorite.mockReturnValue(false);

    render(
      <table>
        <tbody>
          <BillTableRow
            bill={bill}
            index={0}
            isFavorite={mockIsFavorite}
            toggleFavorite={mockToggleFavorite}
            onRowClick={mockOnRowClick}
          />
        </tbody>
      </table>
    );

    fireEvent.click(screen.getByText('B001'));
    expect(mockOnRowClick).toHaveBeenCalledWith(bill);
  });

  test('calls toggleFavorite when favorite button is clicked', () => {
    mockIsFavorite.mockReturnValue(false);

    render(
      <table>
        <tbody>
          <BillTableRow
            bill={bill}
            index={0}
            isFavorite={mockIsFavorite}
            toggleFavorite={mockToggleFavorite}
            onRowClick={mockOnRowClick}
          />
        </tbody>
      </table>
    );

    const favoriteButton = screen.getByRole('button', {
      name: /Add to favorites/i,
    });

    fireEvent.click(favoriteButton);
    expect(mockToggleFavorite).toHaveBeenCalledWith(bill);
  });
});
