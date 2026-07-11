<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import menu from '@/config/sideMenuConfig'

const route = useRoute()
const router = useRouter()
</script>

<template>
  <aside class="sidebar">
    <div class="sidebar-logo"><h2>CRM</h2><span>Panel Administrativo</span></div>
    <nav class="sidebar-menu">
      <button v-for="item in menu" :key="item.path" type="button" class="menu-item"
        :class="{ active: route.path === item.path }" @click="router.push(item.path)">
        <span class="icon">{{ item.icon }}</span><span>{{ item.title }}</span>
      </button>
    </nav>
    <div class="sidebar-footer"><button class="logout">Cerrar sesión</button></div>
  </aside>
</template>

<style scoped>
.sidebar { width: 260px; min-height: 100vh; display: flex; flex-direction: column; background: var(--color-surface); border-right: 1px solid var(--color-border); }
.sidebar-logo { padding: 2rem; border-bottom: 1px solid var(--color-border); }.sidebar-logo h2 { margin: 0; color: var(--color-primary); }.sidebar-logo span { color: var(--color-text-secondary); font-size: .9rem; }
.sidebar-menu { flex: 1; display: flex; flex-direction: column; gap: .5rem; padding: 1rem; }.menu-item { display: flex; align-items: center; gap: 1rem; padding: .9rem 1rem; border-radius: 10px; color: var(--color-primary); transition: .25s; }.menu-item:hover { background: rgba(255,255,255,.05); }.menu-item.active { background: var(--color-primary); color: white; }.icon { width: 22px; text-align: center; font-size: 1.2rem; }.sidebar-footer { padding: 1rem; border-top: 1px solid var(--color-border); }.logout { width: 100%; padding: .9rem; border: none; border-radius: 8px; cursor: pointer; background: #dc2626; color: white; }
</style>
