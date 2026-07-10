<script setup lang="ts">
const props = defineProps<{
  menuItems?: Array<{
    path: string
    title: string
    icon: string
    roles: number[]
  }>
  activeModule?: string
}>()

const emit = defineEmits<{
  (event: 'change-module', value: string): void
}>()

function selectModule(path: string) {
  emit('change-module', path)
}
</script>

<template>
  <aside class="sidebar">
    <div class="sidebar-logo">
      <h2>CRM</h2>
      <span>Panel Administrativo</span>
    </div>

    <nav class="sidebar-menu">
      <button
        v-for="item in props.menuItems"
        :key="item.path"
        type="button"
        class="menu-item"
        :class="{
          active:
            props.activeModule === item.path.replace('/', '') ||
            (!props.activeModule && item.path === '/dashboard'),
        }"
        @click="selectModule(item.path)"
      >
        <span class="icon">
          {{ item.icon }}
        </span>

        <span>
          {{ item.title }}
        </span>
      </button>
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

  color: var(--color-primary);

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
