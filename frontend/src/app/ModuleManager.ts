import { nextTick, shallowRef, type Component } from 'vue'
import { ModuleRegistry, type ModuleName } from './ModuleRegistry'

type AppModule = {
  Page: Component
  afterMount?: () => void | Promise<void>
  destroy?: () => void | Promise<void>
}

const activeName = shallowRef<ModuleName | null>(null)
const activeModule = shallowRef<AppModule | null>(null)

async function open(name: ModuleName) {
  if (activeName.value === name) return

  await activeModule.value?.destroy?.()
  activeModule.value = null
  activeName.value = null

  const nextModule: AppModule = ModuleRegistry[name]
  activeModule.value = nextModule
  activeName.value = name
  await nextTick()
  await nextModule.afterMount?.()
}

async function close() {
  await activeModule.value?.destroy?.()
  activeModule.value = null
  activeName.value = null
}

export function useModuleManager() {
  return { activeName, activeModule, open, close }
}
