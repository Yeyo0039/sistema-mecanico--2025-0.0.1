import { shallowRef } from 'vue'
import { ModuleRegistry } from './ModuleRegistry.ts'

const currentModule = shallowRef(ModuleRegistry.dashboard)

function open(name: keyof typeof ModuleRegistry) {
  currentModule.value = ModuleRegistry[name]
}

function refresh(name?: keyof typeof ModuleRegistry) {
  if (name) {
    currentModule.value = ModuleRegistry[name]

    return
  }

  const actual = currentModule.value

  currentModule.value = null as any

  requestAnimationFrame(() => {
    currentModule.value = actual
  })
}

function close() {
  currentModule.value = null as any
}

export function useWorkspace() {
  return {
    currentModule,

    open,

    refresh,

    close,
  }
}
