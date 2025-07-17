// src/types/table.ts - Fixed types
export type TableVariant = 'default' | 'striped' | 'bordered'
export type TableRowVariant = 'default' | 'success' | 'warning' | 'danger' | 'info'

export interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  children: React.ReactNode
  variant?: TableVariant
}

export interface TableHeaderProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  children: React.ReactNode
}

export interface TableBodyProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  children: React.ReactNode
  striped?: boolean
}

export interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  children: React.ReactNode
  variant?: TableRowVariant
  selected?: boolean
}

export interface TableHeadProps extends React.HTMLAttributes<HTMLTableCellElement> {
  children: React.ReactNode
  sortable?: boolean
}

export interface TableCellProps extends React.HTMLAttributes<HTMLTableCellElement> {
  children: React.ReactNode
}