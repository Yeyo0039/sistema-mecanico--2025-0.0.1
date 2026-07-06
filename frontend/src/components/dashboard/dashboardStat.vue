<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    title?: string
    subtitle?: string
    variant?: 'card' | 'table' | 'alert'
  }>(),
  {
    variant: 'card',
  },
)
</script>

<template>
  <section class="panel" :class="`panel-${variant}`">
    <header v-if="title || subtitle" class="panel-header">
      <div>
        <h3>{{ title }}</h3>

        <p v-if="subtitle">
          {{ subtitle }}
        </p>
      </div>

      <slot name="actions" />
    </header>

    <div class="panel-body">
      <slot />
    </div>

    <footer v-if="$slots.footer" class="panel-footer">
      <slot name="footer" />
    </footer>
  </section>
</template>

<style scoped>
.panel {
  display: flex;
  flex-direction: column;

  background: #171d33;

  border: 1px solid rgba(0, 170, 255, 0.15);

  border-radius: 18px;

  overflow: hidden;

  box-shadow: 0 0 18px rgba(0, 180, 255, 0.06);

  transition: 0.25s;
}

.panel:hover {
  border-color: #00bfff;
  box-shadow: 0 0 25px rgba(0, 191, 255, 0.18);
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;

  padding: 1.2rem 1.5rem;

  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.panel-header h3 {
  margin: 0;

  color: white;
}

.panel-header p {
  margin-top: 0.3rem;

  color: #8ea5d8;

  font-size: 0.9rem;
}

.panel-body {
  padding: 1.5rem;
}

.panel-footer {
  padding: 1rem 1.5rem;

  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.panel-alert {
  border-left: 4px solid #00bfff;
}

.panel-table .panel-body {
  padding: 0;
}
</style>
