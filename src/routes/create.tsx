import { createFileRoute } from '@tanstack/react-router'
import type { PostFormData } from '@/lib/form'
import { PageHeader } from '@/components/layout/page-header'
import { Button } from '@/components/ui/button'
import { PostForm, UnsavedChangesDialog } from '@/components/forms'
import { container } from '@/lib/design'
import { toastManager } from '@/components/ui/toast'
import { useFormPage } from '@/hooks/use-form-page'

export const Route = createFileRoute('/create')({
  component: CreatePage,
})

function CreatePage() {
  const {
    formRef,
    isSubmitting,
    handleDirtyChange,
    handleSubmit,
    triggerSubmit,
    blocker,
  } = useFormPage<PostFormData>({
    onSubmit: async (data) => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      if (import.meta.env.DEV) {
        console.log('Post created:', data)
      }
      toastManager.add({
        type: 'success',
        title: 'Post created',
        description: 'Your post was created successfully.',
      })
    },
  })

  return (
    <div className={`mx-auto w-full ${container.maxWidth.md} min-h-full`}>
      <PageHeader title="Create Post">
        <Button onClick={triggerSubmit} disabled={isSubmitting}>
          {isSubmitting ? 'Posting...' : 'Post'}
        </Button>
      </PageHeader>
      <div className="pt-4">
        <PostForm
          mode="create"
          onSubmit={handleSubmit}
          formRef={formRef}
          onCancel={() => window.history.back()}
          isSubmitting={isSubmitting}
          onDirtyChange={handleDirtyChange}
        />

        <UnsavedChangesDialog
          open={blocker.status === 'blocked'}
          onKeepEditing={blocker.reset}
          onDiscard={blocker.proceed}
          description="You have unsaved changes. Are you sure you want to leave? Your post will not be saved."
        />
      </div>
    </div>
  )
}
