import { createFileRoute } from '@tanstack/react-router'
import { ComponentLibrary } from '@/features/component-library'

export const Route = createFileRoute('/_authenticated/component-library/')({
  component: ComponentLibrary,
})
