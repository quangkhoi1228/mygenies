import { twMerge } from "tailwind-merge";
import { clsx, type ClassValue } from "clsx";
import { Ref, forwardRef, type ElementType, type ComponentPropsWithRef } from "react";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Forward ref utility
export function fr<T extends HTMLElement, P extends object>(
  component: (props: P, ref: Ref<T>) => JSX.Element | null
) {
  const wrapped = forwardRef<T, P>(component as any);
  wrapped.displayName = component.name || "ForwardRefComponent";
  return wrapped;
}

// Styled element utility
export function se<T extends ElementType>(Tag: T, ...classNames: ClassValue[]) {
  type Props = ComponentPropsWithRef<T> & { className?: string };

  const Component = forwardRef<React.Ref<T>, Props>(({ className, ...props }, ref) => (
    <Tag ref={ref} className={cn(...classNames, className)} {...(props as any)} />
  ));

  Component.displayName =
    typeof Tag === "string" ? Tag[0].toUpperCase() + Tag.slice(1) : "CustomComponent";

  return Component;
}
