<script setup lang="ts">
const props = defineProps<{
  label: string
  placeholder?: string

  modelValue?: File | null

  readonly?: boolean
  disabled?: boolean
  required?: boolean

  variant?: 'default' | 'edit' | 'new'

  error?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: File | null): void
}>()

function handleFile(event: Event) {
  const target = event.target as HTMLInputElement

  const file = target.files?.[0] ?? null

  emit('update:modelValue', file)
}
</script>

<template>
  <div class="base-dropbox">
    <label class="dropbox-label">
      {{ label }}
    </label>

    <label class="dropbox-container">
      <input
        class="dropbox-input"
        type="file"
        :required="required"
        :disabled="disabled"
        :readonly="readonly"
        @change="handleFile"
      />

      <div class="dropbox-content">
        <p>Arrastra una imagen o haz click aquí</p>

        <small> PNG · JPG · JPEG · WEBP </small>
      </div>
    </label>

    <span v-if="error" class="dropbox-error">
      {{ error }}
    </span>
  </div>
</template>

<style scoped>
.base-dropbox {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.dropbox-label {
  font-size: 0.9rem;
  font-weight: 600;
}

.dropbox-container {
  display: flex;
  justify-content: center;
  align-items: center;

  min-height: 220px;

  border: 2px dashed var(--color-border);
  border-radius: 12px;

  cursor: pointer;

  transition: 0.2s ease;
}

.dropbox-container:hover {
  border-color: var(--color-primary);
}

.dropbox-content {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  text-align: center;
}

.dropbox-content p {
  margin: 0;
}

.dropbox-content small {
  opacity: 0.7;
}

.dropbox-input {
  display: none;
}

.dropbox-error {
  color: red;
  font-size: 0.8rem;
}
</style>
