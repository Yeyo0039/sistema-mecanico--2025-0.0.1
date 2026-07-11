<script setup lang="ts">
import { computed, onBeforeUnmount, watch } from 'vue'
import { useRoute } from 'vue-router'
import AppLayout from '@/layouts/AppLayout.vue'
import { useModuleManager } from '@/app/ModuleManager'
import type { ModuleName } from '@/app/ModuleRegistry'

const route = useRoute()
const manager = useModuleManager()
const moduleName = computed(() => route.meta.module as ModuleName)
const currentPage = computed(() => manager.activeModule.value?.Page ?? null)

watch(moduleName, async (name) => { await manager.open(name) }, { immediate: true })
onBeforeUnmount(() => { void manager.close() })
</script>

<template>
  <AppLayout><div class="workspace"><component :is="currentPage" :key="manager.activeName" /></div></AppLayout>
</template>
