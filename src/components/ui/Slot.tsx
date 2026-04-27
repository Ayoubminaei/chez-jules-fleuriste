import * as React from "react";

type SlotProps = React.HTMLAttributes<HTMLElement> & {
  children?: React.ReactNode;
};

export const Slot = React.forwardRef<HTMLElement, SlotProps>(
  ({ children, ...props }, ref) => {
    if (!React.isValidElement(children)) return null;
    const child = children as React.ReactElement<Record<string, unknown>>;
    const childProps = child.props;
    const merged: Record<string, unknown> = { ...childProps, ...props, ref };
    if (props.className || childProps.className) {
      merged.className = [childProps.className, props.className]
        .filter(Boolean)
        .join(" ");
    }
    return React.cloneElement(child, merged);
  },
);
Slot.displayName = "Slot";
