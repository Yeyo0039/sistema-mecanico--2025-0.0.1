<script setup lang="ts">
defineProps<{
  title: string
  value?: string | number
  subtitle?: string
  icon?: string
}>()
</script>

<template>
  <section class="card">
    <header class="card-header">
      <div>
        <h3>{{ title }}</h3>

        <small v-if="subtitle">
          {{ subtitle }}
        </small>
      </div>

      <span v-if="icon" class="card-icon">
        {{ icon }}
      </span>
    </header>

    <div class="card-body">
      <h2 v-if="value">
        {{ value }}
      </h2>

      <slot />
    </div>
  </section>
</template>

<style scoped>
.card {
  background: var(--color-surface);

  border: 1px solid var(--color-border);
  border-radius: 18px;

  padding: 1.4rem;

  display: flex;
  flex-direction: column;
  gap: 1rem;

  transition: 0.25s;
}

.card:hover {
  border-color: var(--color-primary);
  transform: translateY(-2px);

  box-shadow: 0 0 25px rgba(37, 99, 235, 0.18);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h3 {
  margin: 0;
  font-size: 1rem;
}

.card-header small {
  display: block;
  margin-top: 0.35rem;

  color: var(--color-text-secondary);
}

.card-icon {
  width: 46px;
  height: 46px;

  border-radius: 12px;

  display: flex;
  justify-content: center;
  align-items: center;

  font-size: 1.4rem;

  background: rgba(37, 99, 235, 0.15);
}

.card-body h2 {
  margin: 0;

  font-size: 2rem;
  font-weight: 700;

  color: white;
}
</style>
