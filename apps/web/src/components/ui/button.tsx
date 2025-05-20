import * as React from "react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

const Button = React.forwardRef<
  HTMLButtonElement,
  ButtonProps
>(({ className, variant, size, ...props }, ref) => {
  // Basic styling for now, can be expanded with cva or similar
  const baseStyles = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50";
  // Variant styles (simplified)
  let variantStyles = "";
  switch (variant) {
    case "outline":
      variantStyles = "border border-input bg-transparent shadow-sm hover:bg-accent hover:text-accent-foreground";
      break;
    // Add other variants as needed
    default:
      variantStyles = "bg-primary text-primary-foreground shadow hover:bg-primary/90";
      break;
  }
  // Size styles (simplified)
  let sizeStyles = "h-9 px-4 py-2";
  if (size === "icon") {
    sizeStyles = "h-9 w-9";
  }

  return (
    <button
      className={`${baseStyles} ${variantStyles} ${sizeStyles} ${className}`}
      ref={ref}
      {...props}
    />
  );
});
Button.displayName = "Button";

export { Button }; 