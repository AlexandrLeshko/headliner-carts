import { useEffect, useRef, useState } from 'react';
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
  const wrapperRef = useRef<HTMLDivElement>(null);

  const selectedLabel = options.find((o) => o.value === value)?.label ?? String(value);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const menuId = 'dropdown-menu';

  return (
    <Wrapper ref={wrapperRef}>
      <Trigger
        type="button"
        id="menu-button"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls={menuId}
        aria-label="Select option"
        onClick={() => setOpen(!open)}
      >
        <span>{selectedLabel}</span>
        <ArrowDown size={24} />
      </Trigger>
      <Menu
        id={menuId}
        isOpen={open}
        role="listbox"
        aria-labelledby="menu-button"
      >
        {options.map((option) => (
          <MenuItem
            key={String(option.value)}
            role="option"
            aria-selected={option.value === value}
            type="button"
            onClick={() => {
              onChange(option.value);
              setOpen(false);
            }}
          >
            {option.label}
          </MenuItem>
        ))}
      </Menu>
    </Wrapper>
  );
};
