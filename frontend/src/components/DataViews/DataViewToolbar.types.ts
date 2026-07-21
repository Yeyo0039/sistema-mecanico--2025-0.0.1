export type ToolbarView = 'table' | 'cards' | 'list'

export type ToolbarFilterType = 'select' | 'text' | 'number' | 'date' | 'checkbox'

export interface ToolbarAction {
  id: string
  label: string
  icon?: string
}

export interface ToolbarFilterItem {
  value: string | number | boolean | null
  label: string
}

export interface ToolbarFilter {
  id: string
  type: ToolbarFilterType
  label: string
  items?: ToolbarFilterItem[]
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
