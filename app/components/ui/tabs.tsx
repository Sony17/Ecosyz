'use client';

import * as React from 'react';
import { cn } from '../../../src/lib/ui';

// Helper for type-safe forwarded refs
type TabsRef = React.ElementRef<'div'>;
type TabsProps = React.ComponentPropsWithoutRef<'div'> & {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
};

// Main Tabs container
const Tabs = React.forwardRef<TabsRef, TabsProps>(
  ({ className, value, defaultValue, onValueChange, ...props }, ref) => {
    const [tabValue, setTabValue] = React.useState(value || defaultValue || '');
    
    React.useEffect(() => {
      if (value !== undefined && value !== tabValue) {
        setTabValue(value);
      }
    }, [value, tabValue]);
    
    const handleValueChange = React.useCallback(
      (newValue: string) => {
        setTabValue(newValue);
        onValueChange?.(newValue);
      },
      [onValueChange]
    );
    
    const contextValue = React.useMemo(
      () => ({ value: tabValue, onValueChange: handleValueChange }),
      [tabValue, handleValueChange]
    );
    
    return (
      <TabsContext.Provider value={contextValue}>
        <div
          ref={ref}
          className={cn('w-full', className)}
          {...props}
        />
      </TabsContext.Provider>
    );
  }
);

Tabs.displayName = 'Tabs';

// Context for Tabs state management
type TabsContextValue = {
  value: string;
  onValueChange: (value: string) => void;
};

const TabsContext = React.createContext<TabsContextValue | undefined>(
  undefined
);

function useTabsContext() {
  const context = React.useContext(TabsContext);
  if (!context) {
    throw new Error('Tabs components must be used within a Tabs provider');
  }
  return context;
}

// TabsList component
type TabsListRef = React.ElementRef<'div'>;
type TabsListProps = React.ComponentPropsWithoutRef<'div'>;

const TabsList = React.forwardRef<TabsListRef, TabsListProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center rounded-md bg-zinc-800/50 p-1',
        className
      )}
      {...props}
    />
  )
);

TabsList.displayName = 'TabsList';

// TabsTrigger component
type TabsTriggerRef = React.ElementRef<'button'>;
type TabsTriggerProps = React.ComponentPropsWithoutRef<'button'> & {
  value: string;
};

const TabsTrigger = React.forwardRef<TabsTriggerRef, TabsTriggerProps>(
  ({ className, value, ...props }, ref) => {
    const { value: selectedValue, onValueChange } = useTabsContext();
    const isSelected = selectedValue === value;
    
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
          isSelected
            ? 'bg-zinc-900/90 text-zinc-200 shadow-sm'
            : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50',
          className
        )}
        onClick={() => onValueChange(value)}
        data-state={isSelected ? 'active' : 'inactive'}
        {...props}
      />
    );
  }
);

TabsTrigger.displayName = 'TabsTrigger';

// TabsContent component
type TabsContentRef = React.ElementRef<'div'>;
type TabsContentProps = React.ComponentPropsWithoutRef<'div'> & {
  value: string;
};

const TabsContent = React.forwardRef<TabsContentRef, TabsContentProps>(
  ({ className, value, ...props }, ref) => {
    const { value: selectedValue } = useTabsContext();
    const isSelected = selectedValue === value;
    
    if (!isSelected) return null;
    
    return (
      <div
        ref={ref}
        className={cn(
          'mt-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          className
        )}
        data-state={isSelected ? 'active' : 'inactive'}
        {...props}
      />
    );
  }
);

TabsContent.displayName = 'TabsContent';

export { Tabs, TabsList, TabsTrigger, TabsContent };