import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../i18n/config';
import { RulesReference } from './RulesReference';

describe('RulesReference', () => {
  beforeEach(() => {
    render(
      <I18nextProvider i18n={i18n}>
        <RulesReference />
      </I18nextProvider>
    );
  });

  it('should not show rules dialog initially', () => {
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('should show rules dialog when help button is clicked', () => {
    const helpButton = screen.getByRole('button', { name: /rules/i });
    fireEvent.click(helpButton);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('should display all scoring categories', () => {
    const helpButton = screen.getByRole('button', { name: /rules/i });
    fireEvent.click(helpButton);

    // Get all category cells in the table
    const dialog = screen.getByRole('dialog');
    expect(within(dialog).getByText('Cards')).toBeInTheDocument();
    expect(within(dialog).getByText('Coins')).toBeInTheDocument();
    expect(within(dialog).getByText('Seven of Coins')).toBeInTheDocument();
    expect(within(dialog).getByText('Sweeps')).toBeInTheDocument();
    expect(within(dialog).getByText('Prime')).toBeInTheDocument();
  });

  it('should show primiera values table', () => {
    const helpButton = screen.getByRole('button', { name: /rules/i });
    fireEvent.click(helpButton);

    // Find the primiera values section
    const dialog = screen.getByRole('dialog');
    const primieraSection = within(dialog).getByText('Card Values for Primiera').closest('div');
    expect(primieraSection).toBeInTheDocument();

    // Check each card value in the primiera table
    const values = [
      { card: '7', value: '21' },
      { card: '6', value: '18' },
      { card: '1', value: '16' },
      { card: '5', value: '15' },
      { card: '4', value: '14' },
      { card: '3', value: '13' },
      { card: '2', value: '12' }
    ];

    values.forEach(({ card, value }) => {
      const row = within(primieraSection!).getByRole('row', { name: new RegExp(`${card}.*${value}`) });
      expect(row).toBeInTheDocument();
    });
  });

  it('should close dialog when close button is clicked', async () => {
    const helpButton = screen.getByRole('button', { name: /rules/i });
    fireEvent.click(helpButton);
    
    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);
    
    // Wait for animation to complete
    await new Promise(resolve => setTimeout(resolve, 300));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('should update content when language changes', async () => {
    const helpButton = screen.getByRole('button', { name: /rules/i });
    fireEvent.click(helpButton);

    await i18n.changeLanguage('it');
    expect(screen.getByRole('dialog')).toHaveTextContent(/Regole della Scopa/i);

    await i18n.changeLanguage('en');
    expect(screen.getByRole('dialog')).toHaveTextContent(/Scopa Rules/i);
  });
});