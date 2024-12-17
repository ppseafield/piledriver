export type UUID = string
export type Timestamp = string

// Missing export from @nuxt/ui
export type FormSubmitEvent<T> = SubmitEvent & { data: T }
