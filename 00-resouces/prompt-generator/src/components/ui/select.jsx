import React, { useState } from 'react';
import { clsx } from 'clsx';

export const Select = ({ onValueChange, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState('');

  const handleSelect = (value) => {
    setSelectedValue(value);
    setIsOpen(false);
    if (onValueChange) {
      onValueChange(value);
    }
  };

  return (
    <div className="relative">
      {React.Children.map(children, child => {
        if (child.type === SelectTrigger) {
          return React.cloneElement(child, { 
            onClick: () => setIsOpen(!isOpen),
            selectedValue 
          });
        }
        if (child.type === SelectContent && isOpen) {
          return React.cloneElement(child, { 
            onSelect: handleSelect,
            onClose: () => setIsOpen(false)
          });
        }
        return null;
      })}
    </div>
  );
};

export const SelectTrigger = ({ className, children, onClick, selectedValue }) => (
  <button
    className={clsx(
      "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
      "placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
      "disabled:cursor-not-allowed disabled:opacity-50",
      className
    )}
    onClick={onClick}
  >
    {children}
  </button>
);

export const SelectValue = ({ placeholder }) => (
  <span className="text-muted-foreground">{placeholder}</span>
);

export const SelectContent = ({ className, children, onSelect, onClose }) => (
  <div
    className={clsx(
      "absolute top-full left-0 right-0 z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md",
      className
    )}
  >
    {React.Children.map(children, child => 
      React.cloneElement(child, { onSelect })
    )}
  </div>
);

export const SelectItem = ({ className, children, value, onSelect }) => (
  <button
    className={clsx(
      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none",
      "focus:bg-accent focus:text-accent-foreground hover:bg-accent hover:text-accent-foreground",
      className
    )}
    onClick={() => onSelect && onSelect(value)}
  >
    {children}
  </button>
); 