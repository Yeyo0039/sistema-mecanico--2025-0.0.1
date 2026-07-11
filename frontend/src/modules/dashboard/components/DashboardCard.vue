<script setup lang="ts">
defineProps<{ title: string; value?: string | number; subtitle?: string; icon?: string }>()
</script>
<template><section class="card"><header class="card-header"><div><h3>{{ title }}</h3><small v-if="subtitle">{{ subtitle }}</small></div><span v-if="icon" class="card-icon">{{ icon }}</span></header><div class="card-body"><h2 v-if="value">{{ value }}</h2><slot /></div></section></template>
<style scoped>
.card { background:var(--color-surface); border:1px solid var(--color-border); border-radius:18px; padding:1.4rem; display:flex; flex-direction:column; gap:1rem; }.card-header { display:flex; justify-content:space-between; align-items:center; }.card-header h3,.card-body h2 { margin:0; }.card-header small { display:block; margin-top:.35rem; color:var(--color-text-secondary); }.card-icon { width:46px; height:46px; border-radius:12px; display:grid; place-items:center; font-size:1.4rem; background:rgba(37,99,235,.15); }.card-body h2 { font-size:2rem; color:white; }
</style>
