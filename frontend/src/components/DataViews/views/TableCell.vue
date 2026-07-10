<script setup>
const props = defineProps({
  row: {
    type: Object,
    required: true,
  },
  column: {
    type: Object,
    required: true,
  },
})
</script>

<template>
  <td class="dv-cell">
    {{ props.row[props.column.field] }}
  </td>
</template>

<style scoped>
.dv-cell {
  padding: 12px;
  border-bottom: 1px solid #13db6da1;
  font-size: 14px;
}
</style>
