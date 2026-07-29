import type { SelectOptionSource } from '@/types/forms'

export type ToolbarView = 'table' | 'cards' | 'list'

export type ToolbarFilterType = 'select' | 'text' | 'number' | 'date' | 'checkbox'

export interface ToolbarAction {
  id: string
  label: string
  icon?: string
}

export interface ToolbarFilter {
  id: string
  label: string
  type: ToolbarFilterType

  items?: SelectOptionSource[]
}

export interface ToolbarConfig {
  title?: string
  search?: boolean

  actions?: ToolbarAction[]

  filters?: ToolbarFilter[]

  views?: ToolbarView[]
}

export interface ToolbarFilterPayload {
  id: string
  value: string | number | boolean | null
}
