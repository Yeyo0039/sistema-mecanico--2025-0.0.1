<script setup lang="ts">
import { ref } from 'vue'
import BaseInput from '../ui/BaseInput.vue'
import BaseButton from '../ui/BaseButton.vue'

defineProps<{
  title: string
  subtitle?: string
}>()

const search = ref('')
</script>

<template>
  <header class="dashboard-header">
    <div class="header-left">
      <h1>
        {{ title }}
      </h1>

      <p v-if="subtitle">
        {{ subtitle }}
      </p>
    </div>

    <div class="header-right">
      <div class="search">
        <BaseInput v-model="search" label="" placeholder="Buscar..." />
      </div>

      <BaseButton icon="bell" variant="primary" />

      <BaseButton icon="user" variant="primary" />
    </div>
  </header>
</template>
<style>
.dashboard-header {
  display: flex;

  justify-content: space-between;

  align-items: center;

  padding: 1.5rem 2rem;

  background: var(--color-surface);

  border-bottom: 1px solid var(--color-border);
}

.header-left {
  display: flex;

  flex-direction: column;

  gap: 0.3rem;
}

.header-right {
  display: flex;

  align-items: center;

  gap: 1rem;
}

.search {
  width: 280px;
}

h1 {
  margin: 0;

  font-size: 1.7rem;

  font-weight: 700;
}

p {
  margin: 0;

  color: var(--color-text-secondary);
}
</style>
