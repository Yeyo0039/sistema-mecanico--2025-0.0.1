<script setup lang="ts">
import { useWorkspace } from './workSpaceManager.ts'

const workspace = useWorkspace()
</script>

<template>
  <div class="workspace">
    <component v-if="workspace.currentModule" :is="workspace.currentModule" />
  </div>
</template>
