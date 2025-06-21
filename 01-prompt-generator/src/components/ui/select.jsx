import React, { useState, useRef, useEffect, useCallback } from 'react';
import { clsx } from 'clsx';

export const Select = ({ onValueChange, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState('');
  const [triggerRect, setTriggerRect] = useState(null);
  const triggerRef = useRef(null);
  const contentRef = useRef(null);

  const handleClickOutside = useCallback((event) => {
    if (
      isOpen &&
      triggerRef.current &&
      contentRef.current &&
      !triggerRef.current.contains(event.target) &&
      !contentRef.current.contains(event.target)
    ) {
      setIsOpen(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen, handleClickOutside]);

  const handleSelect = useCallback((value) => {
    setSelectedValue(value);
    setIsOpen(false);
    if (onValueChange) {
      onValueChange(value);
    }
  }, [onValueChange]);

  const toggleOpen = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setTriggerRect(rect);
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [isOpen]);

  return (
    <div className="relative">
      {React.Children.map(children, child => {
        if (child.type === SelectTrigger) {
          return React.cloneElement(child, { 
            onClick: toggleOpen,
            ref: triggerRef
          });
        }
        if (child.type === SelectContent && isOpen) {
          return React.cloneElement(child, { 
            onSelect: handleSelect,
            triggerRect,
            ref: contentRef
          });
        }
        return null;
      })}
    </div>
  );
};

export const SelectTrigger = React.forwardRef(({ className, children, onClick }, ref) => {
  const handleClick = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onClick) {
      onClick(e);
    }
  }, [onClick]);

  return (
    <button
      ref={ref}
      type="button"
      className={clsx(
        "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
        "placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      onClick={handleClick}
    >
      {children}
    </button>
  );
});
SelectTrigger.displayName = 'SelectTrigger';

export const SelectValue = ({ placeholder }) => (
  <span className="text-muted-foreground">{placeholder}</span>
);

export const SelectContent = React.forwardRef(({ className, children, onSelect, triggerRect }, ref) => {
  if (!triggerRect) return null;

  const contentStyle = {
    top: triggerRect.bottom + 4,
    left: triggerRect.left,
    width: triggerRect.width,
    backgroundColor: 'var(--doom-bg-secondary)',
    borderColor: 'var(--doom-orange)',
    boxShadow: '0 0 20px rgba(255, 102, 0, 0.5)'
  };

  return (
    <div
      ref={ref}
      className={clsx(
        "fixed z-[9999] max-h-60 overflow-y-auto rounded-md border shadow-lg",
        className
      )}
      style={contentStyle}
    >
      {React.Children.map(children, child => 
        React.cloneElement(child, { onSelect })
      )}
    </div>
  );
});
SelectContent.displayName = 'SelectContent';

export const SelectItem = ({ className, children, value, onSelect }) => {
  const handleClick = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onSelect) {
      onSelect(value);
    }
  }, [onSelect, value]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      e.stopPropagation();
      handleClick(e);
    }
  }, [handleClick]);

  return (
    <div
      role="option"
      tabIndex={0}
      className={clsx(
        "relative flex w-full cursor-pointer select-none items-center py-3 px-4 text-sm outline-none transition-colors",
        "text-green-400 hover:bg-orange-600 hover:text-black focus:bg-orange-600 focus:text-black",
        "border-b border-gray-700 last:border-b-0",
        className
      )}
      style={{
        fontFamily: 'Orbitron, monospace',
        fontWeight: '600',
        letterSpacing: '1px'
      }}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      {children}
    </div>
  );
}; 