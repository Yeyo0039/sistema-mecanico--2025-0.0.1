<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import menu from '@/config/sideMenuConfig'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

const route = useRoute()
const search = ref('')
const item = computed(() => menu.find((entry) => entry.path === route.path))
const title = computed(() => item.value?.title ?? 'Sistema mecánico')
const subtitle = computed(() => item.value ? `Gestión de ${item.value.title.toLowerCase()}` : '')
</script>

<template>
  <header class="dashboard-header"><div class="header-left"><h1>{{ title }}</h1><p v-if="subtitle">{{ subtitle }}</p></div><div class="header-right"><div class="search"><BaseInput v-model="search" label="" placeholder="Buscar..." /></div><BaseButton icon="bell" /><BaseButton icon="user" /></div></header>
</template>

<style scoped>
.dashboard-header { display:flex; justify-content:space-between; align-items:center; padding:1.5rem 2rem; background:var(--color-surface); border-bottom:1px solid var(--color-border); }.header-left { display:flex; flex-direction:column; gap:.3rem; }.header-right { display:flex; align-items:center; gap:1rem; }.search { width:280px; }h1,p { margin:0; }h1 { font-size:1.7rem; }p { color:var(--color-text-secondary); }
</style>
