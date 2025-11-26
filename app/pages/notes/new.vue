<script setup lang="ts">
import { v7 as uuid } from 'uuid'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import type { CheckboxGroupItem, CheckboxGroupValue } from "@nuxt/ui"
import type { Task } from "#shared/types/database/tasks"

defineI18nRoute({
  paths: {
    en: '/notes/new',
    de: '/tagebuch/neu'
  }
})

definePageMeta({
  middleware: 'auth'
})

const { t } = useI18n()
const localePath = useLocalePath()
</script>

<template>
  <p>new note</p>
</template>
