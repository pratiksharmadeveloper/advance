// src/components/ui/Table.tsx - Fixed exports
import React from 'react'
import { clsx } from '@/lib/utils'

// Main Table Component
interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  children: React.ReactNode
  variant?: 'default' | 'striped' | 'bordered'
}

const Table = React.forwardRef<HTMLTableElement, TableProps>(
  ({ children, variant = 'default', className, ...props }, ref) => {
    const baseStyles = 'min-w-full divide-y divide-gray-200'
    
    const variantStyles = {
      default: 'bg-white',
      striped: 'bg-white',
      bordered: 'bg-white border border-gray-200'
    }

    return (
      <div className="overflow-x-auto">
        <table
          ref={ref}
          className={clsx(
            baseStyles,
            variantStyles[variant],
            className
          )}
          {...props}
        >
          {children}
        </table>
      </div>
    )
  }
)

Table.displayName = 'Table'

// Table Header Component
interface TableHeaderProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  children: React.ReactNode
}

const TableHeader = React.forwardRef<HTMLTableSectionElement, TableHeaderProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <thead
        ref={ref}
        className={clsx('bg-gray-50', className)}
        {...props}
      >
        {children}
      </thead>
    )
  }
)

TableHeader.displayName = 'TableHeader'

// Table Body Component
interface TableBodyProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  children: React.ReactNode
  striped?: boolean
}

const TableBody = React.forwardRef<HTMLTableSectionElement, TableBodyProps>(
  ({ children, className, striped = false, ...props }, ref) => {
    return (
      <tbody
        ref={ref}
        className={clsx(
          'bg-white divide-y divide-gray-200',
          striped && '[&>tr:nth-child(even)]:bg-gray-50',
          className
        )}
        {...props}
      >
        {children}
      </tbody>
    )
  }
)

TableBody.displayName = 'TableBody'

// Table Row Component
interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  children: React.ReactNode
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info'
  selected?: boolean
}

const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ children, variant = 'default', selected = false, className, ...props }, ref) => {
    const variantStyles = {
      default: 'hover:bg-gray-50',
      success: 'bg-green-50 hover:bg-green-100',
      warning: 'bg-yellow-50 hover:bg-yellow-100',
      danger: 'bg-red-50 hover:bg-red-100',
      info: 'bg-blue-50 hover:bg-blue-100'
    }

    return (
      <tr
        ref={ref}
        className={clsx(
          'transition-colors',
          variantStyles[variant],
          selected && 'bg-blue-50 hover:bg-blue-100',
          className
        )}
        {...props}
      >
        {children}
      </tr>
    )
  }
)

TableRow.displayName = 'TableRow'

// Table Head Cell Component
interface TableHeadProps extends React.HTMLAttributes<HTMLTableCellElement> {
  children: React.ReactNode
  sortable?: boolean
}

const TableHead = React.forwardRef<HTMLTableCellElement, TableHeadProps>(
  ({ children, sortable = false, className, ...props }, ref) => {
    return (
      <th
        ref={ref}
        className={clsx(
          'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider',
          sortable && 'cursor-pointer hover:bg-gray-100 select-none',
          className
        )}
        {...props}
      >
        <div className="flex items-center space-x-1">
          <span>{children}</span>
          {sortable && (
            <span className="text-gray-400">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </span>
          )}
        </div>
      </th>
    )
  }
)

TableHead.displayName = 'TableHead'

// Table Cell Component
interface TableCellProps extends React.HTMLAttributes<HTMLTableCellElement> {
  children: React.ReactNode
}

const TableCell = React.forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <td
        ref={ref}
        className={clsx(
          'px-6 py-4 whitespace-nowrap text-sm text-gray-900',
          className
        )}
        {...props}
      >
        {children}
      </td>
    )
  }
)

TableCell.displayName = 'TableCell'

// IMPORTANT: Export all components properly
export default Table
export { TableHeader, TableBody, TableRow, TableHead, TableCell }