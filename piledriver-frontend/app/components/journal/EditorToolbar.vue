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
        @click="editor.chain().focus().toggleBold().run()"
      />
      <UButton
        :variant="editor.isActive('italic') ? 'solid' : 'outline'"
        label="Italic"
        @click="editor.chain().focus().toggleItalic().run()"
      />
      <UButton
        :variant="editor.isActive('strike') ? 'solid' : 'outline'"
        label="Strike"
        @click="editor.chain().focus().toggleStrike().run()"
      />
      <UButton
        :variant="editor.isActive('code') ? 'solid' : 'outline'"
        label="Strike"
        @click="editor.chain().focus().toggleCode().run()"
      />
    </UButtonGroup>

    <UButtonGroup>
      <UButton
        :variant="editor.isActive('heading', { level: 1 }) ? 'solid' : 'outline'"
        label="H1"
        @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
      />
      <UButton
        :variant="editor.isActive('heading', { level: 2 }) ? 'solid' : 'outline'"
        label="H2"
        @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
      />
      <UButton
        :variant="editor.isActive('heading', { level: 3 }) ? 'solid' : 'outline'"
        label="H3"
        @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
      />
    </UButtonGroup>

    <UButtonGroup>
      <UButton
        :variant="editor.isActive('bulletList') ? 'solid' : 'outline'"
        label="⦁ List"
        @click="editor.chain().focus().toggleBulletList().run()"
      />
      <UButton
        :variant="editor.isActive('orderedList') ? 'solid' : 'outline'"
        label="# List"
        @click="editor.chain().focus().toggleOrderedList().run()"
      />
    </UButtonGroup>

    <UButton
      :variant="editor.isActive('blockquote') ? 'solid' : 'outline'"
      label="Blockquote"
      @click="editor.chain().focus().toggleBlockquote().run()"
    />

    <UButton
      :variant="editor.isActive('codeBlock') ? 'solid' : 'outline'"
      label="Code Block"
      @click="editor.chain().focus().toggleCodeBlock().run()"
    />
  </div>
  <div v-else />
</template>
