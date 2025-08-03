import React from 'react';

interface CollapsibleProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

function Collapsible({ open, onOpenChange, children, ...props }: CollapsibleProps) {
  return (
    <div data-slot="collapsible" {...props}>
      {children}
    </div>
  );
}

interface CollapsibleTriggerProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

function CollapsibleTrigger({ children, className, onClick, ...props }: CollapsibleTriggerProps) {
  return (
    <button
      type="button"
      className={className}
      onClick={onClick}
      data-slot="collapsible-trigger"
      {...props}
    >
      {children}
    </button>
  );
}

interface CollapsibleContentProps {
  children: React.ReactNode;
  className?: string;
}

function CollapsibleContent({ children, className, ...props }: CollapsibleContentProps) {
  return (
    <div
      className={className}
      data-slot="collapsible-content"
      {...props}
    >
      {children}
    </div>
  );
}

export { Collapsible, CollapsibleTrigger, CollapsibleContent };
