<script setup lang="ts">
import { computed, ref, watch } from 'vue'

const props = defineProps<{
  label: string
  placeholder?: string

  modelValue?: File | string | null

  readonly?: boolean
  disabled?: boolean
  required?: boolean

  variant?: 'default' | 'edit' | 'new'

  error?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: File | string | null): void
}>()

const previewUrl = ref<string | null>(null)

function handleFile(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0] ?? null

  if (file) {
    previewUrl.value = URL.createObjectURL(file)
  } else {
    previewUrl.value = null
  }

  emit('update:modelValue', file)
}

function setPreviewFromValue(value: File | string | null | undefined) {
  if (value instanceof File) {
    previewUrl.value = URL.createObjectURL(value)
    return
  }

  if (typeof value === 'string' && value.trim()) {
    previewUrl.value = value
    return
  }

  previewUrl.value = null
}

watch(
  () => props.modelValue,
  (value) => {
    setPreviewFromValue(value)
  },
  { immediate: true },
)

const hasPreview = computed(() => Boolean(previewUrl.value))
</script>

<template>
  <div class="base-dropbox">
    <label class="dropbox-label">
      {{ label }}
    </label>

    <label class="dropbox-container" :class="{ 'has-preview': hasPreview }">
      <input
        class="dropbox-input"
        type="file"
        :required="required"
        :disabled="disabled"
        :readonly="readonly"
        @change="handleFile"
      />

      <div v-if="hasPreview" class="preview-wrapper">
        <img :src="previewUrl || ''" alt="Preview de imagen" />
      </div>

      <div v-else class="dropbox-content">
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

.preview-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: 12px;
}

.preview-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.dropbox-container.has-preview {
  padding: 0.5rem;
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
