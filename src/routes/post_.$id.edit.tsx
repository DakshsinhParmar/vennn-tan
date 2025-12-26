import { createFileRoute, useNavigate } from '@tanstack/react-router'
import type { PostFormData } from '@/lib/form'
import { PageHeader } from '@/components/layout/page-header'
import { Button } from '@/components/ui/button'
import { PostForm, UnsavedChangesDialog } from '@/components/forms'
import { container } from '@/lib/design'
import { SparkleIcon, CoffeeIcon } from '@phosphor-icons/react'
import { toastManager } from '@/components/ui/toast'
import { useFormPage } from '@/hooks/use-form-page'

export const Route = createFileRoute('/post_/$id/edit')({
  component: EditPostPage,
})

// Mock post data - in real app this would come from API based on the id param
const MOCK_POST_DATA: PostFormData = {
  postType: 'build',
  availability: 'specific',
  title: 'Looking for a co-founder for a new AI startup',
  description:
    'I have a solid idea for an AI-powered platform that will revolutionize how small businesses handle customer service. Looking for a technical co-founder who shares my vision and has experience with machine learning and scalable systems.',
  images: [
    'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&auto=format&fit=crop&q=60',
  ],
  tags: ['AI', 'Startup', 'Machine Learning', 'SaaS'],
  links: [
    { url: 'https://github.com' },
    { url: 'https://linkedin.com' },
    { url: 'https://docs.google.com' },
  ],
  roles: [{ role: 'Co-founder' }, { role: 'CTO' }],
}

function EditPostPage() {
  const { id } = Route.useParams()
  const navigate = useNavigate()

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
        console.log('Post updated:', { id, ...data })
      }
      toastManager.add({
        type: 'success',
        title: 'Post updated',
        description: 'Your post was updated successfully.',
      })
      navigate({ to: '/post/$id', params: { id } })
    },
    onError: () => {
      toastManager.add({
        type: 'error',
        title: 'Failed to update post',
        description: 'Please try again.',
        priority: 'high',
      })
    },
  })

  return (
    <div className={`mx-auto w-full ${container.maxWidth.md} min-h-full`}>
      <PageHeader
        title="Edit Post"
        showBackButton
        titleSuffix={
          <span
            className="inline-flex items-center text-muted-foreground"
            title={MOCK_POST_DATA.postType === 'build' ? 'Build' : 'Social'}
          >
            {MOCK_POST_DATA.postType === 'build' ? (
              <SparkleIcon weight="fill" className="size-4" />
            ) : (
              <CoffeeIcon weight="fill" className="size-4" />
            )}
          </span>
        }
        primaryAction={
          <Button onClick={triggerSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save'}
          </Button>
        }
      />
      <div className="py-4">
        <PostForm
          mode="edit"
          initialValues={MOCK_POST_DATA}
          onSubmit={handleSubmit}
          formRef={formRef}
          isSubmitting={isSubmitting}
          onDirtyChange={handleDirtyChange}
        />

        <UnsavedChangesDialog
          open={blocker.status === 'blocked'}
          onKeepEditing={blocker.reset}
          onDiscard={blocker.proceed}
          description="You have unsaved changes. Are you sure you want to leave? Your changes will not be saved."
        />
      </div>
    </div>
  )
}
