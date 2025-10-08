"use client";

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface SelectProps {
  children: React.ReactNode;
  value?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
}

const Select = React.forwardRef<HTMLDivElement, SelectProps>(
  ({ children, value, onValueChange, disabled, ...props }, ref) => {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (ref && typeof ref === 'object' && ref.current && !ref.current.contains(event.target as Node)) {
          setIsOpen(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (selectedValue: string) => {
      onValueChange?.(selectedValue);
      setIsOpen(false);
    };

    // Filter out non-DOM props to avoid React warnings
    const domProps = Object.fromEntries(
      Object.entries(props).filter(([key]) => 
        !key.startsWith('on') && 
        !['isOpen', 'setIsOpen', 'onSelect', 'handleSelect'].includes(key)
      )
    );

    return (
      <div
        className={`relative ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        ref={ref}
        {...domProps}
      >
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            // Only pass setIsOpen to SelectTrigger components
            if (child.type === SelectTrigger) {
              return React.cloneElement(child as React.ReactElement<SelectTriggerProps>, {
                isOpen,
                setIsOpen,
                handleSelect: handleSelect,
                value,
                disabled
              });
            }
            // For other components, only pass necessary props
            if (child.type === SelectContent) {
              return React.cloneElement(child as React.ReactElement<SelectContentProps>, {
                isOpen,
                handleSelect: handleSelect
              });
            }
            // For other components, don't pass any additional props
            return child;
          }
          return child;
        })}
      </div>
    );
  }
);

Select.displayName = 'Select';

interface SelectTriggerProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> {
  children: React.ReactNode;
  isOpen?: boolean;
  setIsOpen?: (open: boolean) => void;
  handleSelect?: (value: string) => void;
  disabled?: boolean;
  value?: string;
}

const SelectTrigger = React.forwardRef<HTMLButtonElement, SelectTriggerProps>(
  ({ className = '', children, isOpen, setIsOpen, disabled, handleSelect, ...props }, ref) => {
    const baseClasses = 'flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50';
    
    return (
      <button
        className={`${baseClasses} ${className}`}
        ref={ref}
        onClick={() => setIsOpen?.(!isOpen)}
        disabled={disabled}
        type="button"
        {...props}
      >
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            // Pass the value prop to SelectValue components
            if (child.type === SelectValue) {
              return React.cloneElement(child as React.ReactElement<SelectValueProps>, {
                value: props.value
              });
            }
            return child;
          }
          return child;
        })}
        <ChevronDown className={`h-4 w-4 opacity-50 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
    );
  }
);

SelectTrigger.displayName = 'SelectTrigger';

interface SelectValueProps {
  placeholder?: string;
  children?: React.ReactNode;
  value?: string;
}

const SelectValue = React.forwardRef<HTMLSpanElement, SelectValueProps>(
  ({ placeholder, children, value, ...props }, ref) => {
    
    return (
      <span
        className="block truncate"
        ref={ref}
        {...props}
      >
        {value || children || placeholder}
      </span>
    );
  }
);

SelectValue.displayName = 'SelectValue';

interface SelectContentProps {
  children: React.ReactNode;
  isOpen?: boolean;
  handleSelect?: (value: string) => void;
  className?: string;
}

const SelectContent = React.forwardRef<HTMLDivElement, SelectContentProps>(
  ({ className = '', children, isOpen, handleSelect, ...props }, ref) => {
    if (!isOpen) return null;

    
    const baseClasses = 'absolute top-full left-0 right-0 z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md mt-1 max-h-60 overflow-auto';
    
    return (
      <div
        className={`${baseClasses} ${className}`}
        ref={ref}
        onScroll={(e) => e.stopPropagation()}
        onWheel={(e) => e.stopPropagation()}
        {...props}
      >
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            // Only pass handleSelect to SelectItem components
            if (child.type === SelectItem) {
              return React.cloneElement(child as React.ReactElement<SelectItemProps>, {
                handleSelect
              });
            }
            // For other components, don't pass handleSelect
            return child;
          }
          return child;
        })}
      </div>
    );
  }
);

SelectContent.displayName = 'SelectContent';

interface SelectItemProps {
  children: React.ReactNode;
  value: string;
  handleSelect?: (value: string) => void;
  className?: string;
}

const SelectItem = React.forwardRef<HTMLDivElement, SelectItemProps>(
  ({ className = '', children, value, handleSelect, ...props }, ref) => {
    
    const baseClasses = 'relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50';
    
    const handleItemSelect = (e: React.MouseEvent | React.TouchEvent) => {
      e.preventDefault();
      e.stopPropagation();
      handleSelect?.(value);
    };
    
    return (
      <div
        className={`${baseClasses} ${className}`}
        ref={ref}
        onClick={handleItemSelect}
        onMouseDown={handleItemSelect}
        onTouchEnd={handleItemSelect}
        role="option"
        aria-selected={false}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleSelect?.(value);
          }
        }}
        {...props}
      >
        {children}
      </div>
    );
  }
);

SelectItem.displayName = 'SelectItem';

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem };