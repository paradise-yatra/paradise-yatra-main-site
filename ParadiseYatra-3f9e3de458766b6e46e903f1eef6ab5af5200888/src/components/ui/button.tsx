import React from "react";

import { Slot } from "@radix-ui/react-slot";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
  | "default"
  | "outline"
  | "ghost"
  | "secondary"
  | "admin-primary"
  | "admin-secondary"
  | "admin-outline";
  size?: "default" | "sm" | "lg" | "icon";
  children: React.ReactNode;
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className = "",
      variant = "default",
      size = "default",
      children,
      asChild = false,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";
    const baseClasses =
      "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 cursor-pointer";

    const variantClasses = {
      default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
      outline:
        "border-input shadow-sm hover:bg-accent hover:text-accent-foreground",
      ghost: "hover:bg-accent hover:text-accent-foreground",
      secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
      "admin-primary":
        "bg-blue-600 text-white hover:bg-blue-700 border border-blue-600",
      "admin-secondary":
        "bg-gray-600 text-white hover:bg-gray-700 border border-gray-600",
      "admin-outline":
        "bg-transparent text-white border border-white/30 hover:bg-white/10 hover:border-white/50",
    };

    const sizeClasses = {
      default: "h-10 px-4 py-2",
      sm: "h-9 rounded-md px-3",
      lg: "h-11 rounded-md px-8",
      icon: "h-10 w-10",
    };

    const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

    return (
      <Comp className={classes} ref={ref} {...props}>
        {children}
      </Comp>
    );
  }
);

Button.displayName = "Button";

export { Button };
