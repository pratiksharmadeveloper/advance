import React from 'react'
import { clsx } from '@/lib/utils'
import { CardProps, CardHeaderProps, CardContentProps, CardFooterProps, CardVariant, CardPadding } from '@/types/card'

// Main Card Component
const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ children, variant = 'default', padding = 'md', className, ...props }, ref) => {
    const baseStyles = 'bg-white rounded-lg'
    
    const variantStyles: Record<CardVariant, string> = {
      default: 'shadow',
      outlined: 'border border-gray-200',
      elevated: 'shadow-lg'
    }
    
    const paddingStyles: Record<CardPadding, string> = {
      none: '',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8'
    }

    return (
      <div
        ref={ref}
        className={clsx(
          baseStyles,
          variantStyles[variant],
          paddingStyles[padding],
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'

// Card Header Component
const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ children, action, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={clsx(
          'flex items-center justify-between pb-4',
          action ? 'mb-4 border-b border-gray-200' : 'mb-4',
          className
        )}
        {...props}
      >
        <div className="flex-1">
          {typeof children === 'string' ? (
            <h3 className="text-lg font-semibold text-gray-900">{children}</h3>
          ) : (
            children
          )}
        </div>
        {action && (
          <div className="flex-shrink-0 ml-4">
            {action}
          </div>
        )}
      </div>
    )
  }
)

CardHeader.displayName = 'CardHeader'

// Card Content Component
const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={clsx('', className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)

CardContent.displayName = 'CardContent'

// Card Footer Component
const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={clsx(
          'pt-4 mt-4 border-t border-gray-200',
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

CardFooter.displayName = 'CardFooter'

// Export all components
export default Card
export { CardHeader, CardContent, CardFooter }