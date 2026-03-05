import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { ArrowDown } from 'lucide-react';
import { Menu, MenuItem, Trigger, Wrapper } from './DropDown.styles';

export type DropDownOption = {
  value: number;
  label: string;
};

type DropDownProps = {
  value: number;
  options: DropDownOption[];
  onChange: (value: number) => void;
};

export const DropDown = ({ value, options, onChange }: DropDownProps) => {
  const [open, setOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const instanceId = useId();
  const menuId = `dropdown-menu-${instanceId}`;
  const triggerId = `dropdown-trigger-${instanceId}`;

  const selectedLabel = options.find((o) => o.value === value)?.label ?? String(value);
  const selectedIndex = options.findIndex((o) => o.value === value);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (open && focusedIndex >= 0) {
      itemRefs.current[focusedIndex]?.focus();
    }
  }, [open, focusedIndex]);

  const openMenu = useCallback((startIndex?: number) => {
    setOpen(true);
    setFocusedIndex(startIndex ?? Math.max(0, selectedIndex));
  }, [selectedIndex]);

  const closeMenu = useCallback((returnFocus = true) => {
    setOpen(false);
    setFocusedIndex(-1);
    if (returnFocus) triggerRef.current?.focus();
  }, []);

  const selectOption = useCallback((option: DropDownOption) => {
    onChange(option.value);
    closeMenu();
  }, [onChange, closeMenu]);

  const handleTriggerKeyDown = useCallback((e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
      case 'ArrowUp':
      case 'Enter':
      case ' ':
        e.preventDefault();
        openMenu(e.key === 'ArrowUp' ? options.length - 1 : undefined);
        break;
    }
  }, [openMenu, options.length]);

  const handleMenuKeyDown = useCallback((e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex((prev) => (prev + 1) % options.length);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex((prev) => (prev - 1 + options.length) % options.length);
        break;
      case 'Home':
        e.preventDefault();
        setFocusedIndex(0);
        break;
      case 'End':
        e.preventDefault();
        setFocusedIndex(options.length - 1);
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (focusedIndex >= 0) selectOption(options[focusedIndex]);
        break;
      case 'Escape':
        e.preventDefault();
        closeMenu();
        break;
      case 'Tab':
        closeMenu(false);
        break;
    }
  }, [options, focusedIndex, selectOption, closeMenu]);

  return (
    <Wrapper ref={wrapperRef}>
      <Trigger
        ref={triggerRef}
        type="button"
        id={triggerId}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls={menuId}
        aria-label="Select option"
        onClick={() => (open ? closeMenu() : openMenu())}
        onKeyDown={handleTriggerKeyDown}
      >
        <span>{selectedLabel}</span>
        <ArrowDown size={24} />
      </Trigger>
      <Menu
        id={menuId}
        $isOpen={open}
        role="listbox"
        aria-labelledby={triggerId}
        aria-activedescendant={
          open && focusedIndex >= 0
            ? `${menuId}-option-${focusedIndex}`
            : undefined
        }
        onKeyDown={handleMenuKeyDown}
      >
        {options.map((option, index) => (
          <MenuItem
            key={String(option.value)}
            id={`${menuId}-option-${index}`}
            ref={(el) => { itemRefs.current[index] = el; }}
            role="option"
            aria-selected={option.value === value}
            $focused={index === focusedIndex}
            type="button"
            tabIndex={index === focusedIndex ? 0 : -1}
            onClick={() => selectOption(option)}
          >
            {option.label}
          </MenuItem>
        ))}
      </Menu>
    </Wrapper>
  );
};
