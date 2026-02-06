import { cn } from "@/lib/utils";
import { InputHTMLAttributes, forwardRef } from "react";

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string | boolean;
};

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, id, ...props }, ref) => {
    const hasError = Boolean(error);
    const errorMessage = typeof error === "string" ? error : undefined;
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    const inputElement = (
      <input
        id={inputId}
        type={type}
        className={cn(
          "flex h-12 w-full rounded-lg border bg-white px-4 py-2 text-sm",
          "placeholder:text-text-muted",
          "focus-visible:outline-none focus-visible:ring-2",
          "disabled:cursor-not-allowed disabled:opacity-50",
          hasError
            ? "border-red-500 focus-visible:ring-red-500"
            : "border-primary-100 focus-visible:ring-primary",
          className
        )}
        ref={ref}
        {...props}
      />
    );

    if (label) {
      return (
        <div className="w-full">
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-text-primary mb-1.5 block"
          >
            {label}
          </label>
          {inputElement}
          {errorMessage && (
            <p className="text-sm text-red-600 mt-1">{errorMessage}</p>
          )}
        </div>
      );
    }

    return (
      <>
        {inputElement}
        {errorMessage && (
          <p className="text-sm text-red-600 mt-1">{errorMessage}</p>
        )}
      </>
    );
  }
);

Input.displayName = "Input";

export default Input;
