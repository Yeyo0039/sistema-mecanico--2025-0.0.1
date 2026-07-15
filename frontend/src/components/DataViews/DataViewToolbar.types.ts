export type ToolbarView = 'table' | 'cards' | 'list'

export type ToolbarFilterType = 'select' | 'text' | 'number' | 'date' | 'checkbox'

export interface ToolbarAction {
  id: string

  label: string

  icon?: string
}

export interface ToolbarFilter {
  id: string

  type: ToolbarFilterType

  label: string

  items?: unknown[]
}

export interface ToolbarConfig {
  title?: string

  search?: boolean

  actions?: ToolbarAction[]

  filters?: ToolbarFilter[]

  views?: ToolbarView[]
}
