import React from 'react';
import { clsx } from 'clsx';

export const Card = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={clsx(
      "rounded-lg border bg-card text-card-foreground shadow-sm",
      className
    )}
    {...props}
  />
));

export const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={clsx("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
));

export const CardTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={clsx(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
));

export const CardContent = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={clsx("p-6 pt-0", className)} {...props} />
)); 