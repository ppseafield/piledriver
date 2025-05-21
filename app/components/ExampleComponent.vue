<script setup lang="ts">
const words = ['one', 'two', 'three']
const index = ref<number>(0)
const cycleText = () => {
  if (index.value < words.length - 1) {
    index.value++
  } else {
    index.value = 0
  }
}
</script>
<template>
  <div>
    <p>Example Component: {{ words[index] }}</p>
    <button type="button" @click="cycleText">
      Cycle Text
    </button>
  </div>
</template>
