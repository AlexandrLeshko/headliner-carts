import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '@emotion/react';
import { DropDown } from './index';
import { theme } from '../../../theme';

const options = [
  { value: 5, label: '5' },
  { value: 10, label: '10' },
  { value: 20, label: '20' },
];

const renderDropDown = (value = 10, onChange = vi.fn()) =>
  render(
    <ThemeProvider theme={theme}>
      <DropDown value={value} options={options} onChange={onChange} />
    </ThemeProvider>,
  );

describe('DropDown', () => {
  describe('rendering', () => {
    it('shows selected value label in trigger', () => {
      renderDropDown(10);
      const trigger = screen.getByRole('button', { name: 'Select option' });
      expect(trigger).toHaveTextContent('10');
    });

    it('renders trigger with aria attributes', () => {
      renderDropDown();
      const trigger = screen.getByRole('button', { name: 'Select option' });
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
      expect(trigger).toHaveAttribute('aria-haspopup', 'listbox');
    });

    it('menu is hidden by default', () => {
      renderDropDown();
      const menu = screen.getByRole('listbox', { hidden: true });
      expect(menu).not.toBeVisible();
    });
  });

  describe('mouse interaction', () => {
    it('opens menu on trigger click', async () => {
      const user = userEvent.setup();
      renderDropDown();
      await user.click(screen.getByRole('button', { name: 'Select option' }));
      expect(screen.getByRole('listbox')).toBeVisible();
    });

    it('closes menu on second trigger click', async () => {
      const user = userEvent.setup();
      renderDropDown();
      const trigger = screen.getByRole('button', { name: 'Select option' });
      await user.click(trigger);
      await user.click(trigger);
      expect(screen.getByRole('listbox', { hidden: true })).not.toBeVisible();
    });

    it('calls onChange and closes on option click', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      renderDropDown(10, onChange);
      await user.click(screen.getByRole('button', { name: 'Select option' }));
      await user.click(screen.getByRole('option', { name: '20' }));
      expect(onChange).toHaveBeenCalledWith(20);
      expect(screen.getByRole('listbox', { hidden: true })).not.toBeVisible();
    });
  });

  describe('keyboard navigation', () => {
    it('opens menu with ArrowDown and focuses first option', async () => {
      const user = userEvent.setup();
      renderDropDown(10);
      screen.getByRole('button', { name: 'Select option' }).focus();
      await user.keyboard('{ArrowDown}');
      expect(screen.getByRole('listbox')).toBeVisible();
    });

    it('opens menu with Enter', async () => {
      const user = userEvent.setup();
      renderDropDown();
      screen.getByRole('button', { name: 'Select option' }).focus();
      await user.keyboard('{Enter}');
      expect(screen.getByRole('listbox')).toBeVisible();
    });

    it('opens menu with Space', async () => {
      const user = userEvent.setup();
      renderDropDown();
      screen.getByRole('button', { name: 'Select option' }).focus();
      await user.keyboard(' ');
      expect(screen.getByRole('listbox')).toBeVisible();
    });

    it('navigates options with ArrowDown', async () => {
      const user = userEvent.setup();
      renderDropDown(5);
      screen.getByRole('button', { name: 'Select option' }).focus();
      await user.keyboard('{ArrowDown}');
      const firstOption = screen.getAllByRole('option')[0];
      expect(firstOption).toHaveFocus();
      await user.keyboard('{ArrowDown}');
      const secondOption = screen.getAllByRole('option')[1];
      expect(secondOption).toHaveFocus();
    });

    it('navigates options with ArrowUp', async () => {
      const user = userEvent.setup();
      renderDropDown();
      screen.getByRole('button', { name: 'Select option' }).focus();
      await user.keyboard('{ArrowUp}');
      const lastOption = screen.getAllByRole('option')[options.length - 1];
      expect(lastOption).toHaveFocus();
    });

    it('wraps around from last to first with ArrowDown', async () => {
      const user = userEvent.setup();
      renderDropDown(20);
      screen.getByRole('button', { name: 'Select option' }).focus();
      // opens at selected index (2)
      await user.keyboard('{ArrowDown}');
      // 2→0
      await user.keyboard('{ArrowDown}');
      const firstOption = screen.getAllByRole('option')[0];
      expect(firstOption).toHaveFocus();
    });

    it('selects focused option with Enter', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      renderDropDown(10, onChange);
      screen.getByRole('button', { name: 'Select option' }).focus();
      // opens at selected index (1, value=10)
      await user.keyboard('{ArrowDown}');
      // selects currently focused (index 1, value=10)
      await user.keyboard('{Enter}');
      expect(onChange).toHaveBeenCalledWith(10);
    });

    it('selects option with Space', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      renderDropDown(10, onChange);
      screen.getByRole('button', { name: 'Select option' }).focus();
      await user.keyboard('{ArrowDown}');
      await user.keyboard(' ');
      expect(onChange).toHaveBeenCalled();
    });

    it('closes menu with Escape and returns focus to trigger', async () => {
      const user = userEvent.setup();
      renderDropDown();
      const trigger = screen.getByRole('button', { name: 'Select option' });
      trigger.focus();
      await user.keyboard('{ArrowDown}');
      expect(screen.getByRole('listbox')).toBeVisible();
      await user.keyboard('{Escape}');
      expect(screen.getByRole('listbox', { hidden: true })).not.toBeVisible();
      expect(trigger).toHaveFocus();
    });

    it('jumps to first option with Home', async () => {
      const user = userEvent.setup();
      renderDropDown(20);
      screen.getByRole('button', { name: 'Select option' }).focus();
      await user.keyboard('{ArrowDown}');
      await user.keyboard('{ArrowDown}');
      await user.keyboard('{Home}');
      const firstOption = screen.getAllByRole('option')[0];
      expect(firstOption).toHaveFocus();
    });

    it('jumps to last option with End', async () => {
      const user = userEvent.setup();
      renderDropDown(5);
      screen.getByRole('button', { name: 'Select option' }).focus();
      await user.keyboard('{ArrowDown}');
      await user.keyboard('{End}');
      const lastOption = screen.getAllByRole('option')[options.length - 1];
      expect(lastOption).toHaveFocus();
    });
  });

  describe('aria attributes', () => {
    it('marks selected option with aria-selected', () => {
      renderDropDown(10);
      const allOptions = screen.getAllByRole('option', { hidden: true });
      expect(allOptions[1]).toHaveAttribute('aria-selected', 'true');
      expect(allOptions[0]).toHaveAttribute('aria-selected', 'false');
    });

    it('sets aria-expanded to true when open', async () => {
      const user = userEvent.setup();
      renderDropDown();
      const trigger = screen.getByRole('button', { name: 'Select option' });
      await user.click(trigger);
      expect(trigger).toHaveAttribute('aria-expanded', 'true');
    });
  });
});
