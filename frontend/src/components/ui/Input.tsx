import React from 'react'
import { clsx } from '@/lib/utils'
import { InputProps, InputSize, InputVariant } from '@/types/input'

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ 
    label,
    error,
    helperText,
    leftIcon,
    rightIcon,
    size = 'md',
    variant = 'default',
    className,
    disabled,
    required,
    ...props 
  }, ref) => {
    
    const baseStyles = 'block w-full rounded-md border-gray-300 shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-0'
    
    const variantStyles: Record<InputVariant, string> = {
      default: 'border-gray-300 focus:border-blue-500 focus:ring-blue-500',
      error: 'border-red-300 focus:border-red-500 focus:ring-red-500',
      success: 'border-green-300 focus:border-green-500 focus:ring-green-500'
    }
    
    const sizeStyles: Record<InputSize, string> = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-3 py-2 text-sm',
      lg: 'px-4 py-3 text-base'
    }
    
    const disabledStyles = 'disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed'
    
    // Determine the current variant
    const currentVariant = error ? 'error' : variant
    
    return (
      <div className="w-full">
        {/* Label */}
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        
        {/* Input Container */}
        <div className="relative">
          {/* Left Icon */}
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-400">
                {leftIcon}
              </span>
            </div>
          )}
          
          {/* Input Field */}
          <input
            ref={ref}
            className={clsx(
              baseStyles,
              variantStyles[currentVariant],
              sizeStyles[size],
              disabledStyles,
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              className
            )}
            disabled={disabled}
            {...props}
          />
          
          {/* Right Icon */}
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-400">
                {rightIcon}
              </span>
            </div>
          )}
        </div>
        
        {/* Helper Text or Error Message */}
        {(helperText || error) && (
          <p className={clsx(
            'mt-1 text-sm',
            error ? 'text-red-600' : 'text-gray-500'
          )}>
            {error || helperText}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input