<script setup lang="ts">
import type { Editor } from '@tiptap/vue-3'

const { editor } = defineProps<{
  editor: Editor | undefined
}>()
</script>

<template>
  <div
    v-if="editor !== undefined"
    class="flex items-center space-x-2"
  >
    <UButtonGroup>
      <UButton
        :variant="editor.isActive('bold') ? 'solid' : 'outline'"
        label="Bold"
        @click="editor.chain().toggleBold().run()"
      />
      <UButton
        :variant="editor.isActive('italic') ? 'solid' : 'outline'"
        label="Italic"
        @click="editor.chain().toggleItalic().run()"
      />
      <UButton
        :variant="editor.isActive('strike') ? 'solid' : 'outline'"
        label="Strike"
        @click="editor.chain().toggleStrike().run()"
      />
      <UButton
        :variant="editor.isActive('code') ? 'solid' : 'outline'"
        label="Strike"
        @click="editor.chain().toggleCode().run()"
      />
    </UButtonGroup>

    <UButtonGroup>
      <UButton
        :variant="editor.isActive('heading', { level: 1 }) ? 'solid' : 'outline'"
        label="H1"
      />
      <UButton
        :variant="editor.isActive('heading', { level: 2 }) ? 'solid' : 'outline'"
        label="H2"
      />
      <UButton
        :variant="editor.isActive('heading', { level: 3 }) ? 'solid' : 'outline'"
        label="H3"
      />
    </UButtonGroup>

    <UButtonGroup>
      <UButton
        :variant="editor.isActive('bulletList') ? 'solid' : 'outline'"
        label="⦁ List"
      />
      <UButton
        :variant="editor.isActive('orderedList') ? 'solid' : 'outline'"
        label="# List"
      />
    </UButtonGroup>

    <UButton
      :variant="editor.isActive('blockquote') ? 'solid' : 'outline'"
      label="Blockquote"
    />

    <UButton
      :variant="editor.isActive('codeBlock') ? 'solid' : 'outline'"
      label="Code Block"
    />
  </div>
  <div v-else />
</template>
