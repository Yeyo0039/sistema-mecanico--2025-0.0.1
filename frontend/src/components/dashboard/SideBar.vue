<script setup lang="ts">
import { RouterLink, useRoute } from 'vue-router'

import menu from '@/config/sideMenuConfig'
import { hasPermission } from '@/composables/utils/permissions'

// Temporal.
// Luego vendrá del AuthStore.
const userRole = 1

const route = useRoute()

const visibleMenu = menu.filter((item) => hasPermission(userRole, item.roles))
</script>

<template>
  <aside class="sidebar">
    <div class="sidebar-logo">
      <h2>CRM</h2>
      <span>Panel Administrativo</span>
    </div>

    <nav class="sidebar-menu">
      <RouterLink
        v-for="item in visibleMenu"
        :key="item.path"
        :to="item.path"
        class="menu-item"
        :class="{ active: route.path === item.path }"
      >
        <span class="icon">
          {{ item.icon }}
        </span>

        <span>
          {{ item.title }}
        </span>
      </RouterLink>
    </nav>

    <div class="sidebar-footer">
      <button class="logout">Cerrar sesión</button>
    </div>
  </aside>
</template>

<style scoped>
.sidebar {
  width: 260px;
  min-height: 100vh;

  display: flex;
  flex-direction: column;

  background: var(--color-surface);
  border-right: 1px solid var(--color-border);
}

.sidebar-logo {
  padding: 2rem;
  border-bottom: 1px solid var(--color-border);
}

.sidebar-logo h2 {
  margin: 0;
  color: var(--color-primary);
}

.sidebar-logo span {
  color: var(--color-text-secondary);
  font-size: 0.9rem;
}

.sidebar-menu {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 1rem;

  padding: 0.9rem 1rem;

  border-radius: 10px;

  text-decoration: none;

  color: var(--color-text);

  transition: 0.25s;
}

.menu-item:hover {
  background: rgba(255, 255, 255, 0.05);
}

.menu-item.active {
  background: var(--color-primary);
  color: white;
}

.icon {
  width: 22px;
  text-align: center;
  font-size: 1.2rem;
}

.sidebar-footer {
  padding: 1rem;
  border-top: 1px solid var(--color-border);
}

.logout {
  width: 100%;
  padding: 0.9rem;

  border: none;
  border-radius: 8px;

  cursor: pointer;

  background: #dc2626;
  color: white;
}

.logout:hover {
  background: #b91c1c;
}
</style>
