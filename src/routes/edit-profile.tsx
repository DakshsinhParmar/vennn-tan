import { createFileRoute, useNavigate } from '@tanstack/react-router'
import type { ProfileFormData } from '@/lib/form'
import { PageHeader } from '@/components/layout/page-header'
import { Button } from '@/components/ui/button'
import { EditProfileForm, UnsavedChangesDialog } from '@/components/forms'
import { container } from '@/lib/design'
import { toastManager } from '@/components/ui/toast'
import { useFormPage } from '@/hooks/use-form-page'

export const Route = createFileRoute('/edit-profile')({
  component: EditProfilePage,
})

function EditProfilePage() {
  const navigate = useNavigate()

  const {
    formRef,
    isSubmitting,
    handleDirtyChange,
    handleSubmit,
    triggerSubmit,
    blocker,
  } = useFormPage<ProfileFormData>({
    onSubmit: async (data) => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))
      if (import.meta.env.DEV) {
        console.log('Profile updated:', data)
      }
      toastManager.add({
        type: 'success',
        title: 'Profile updated',
        description: 'Your changes have been saved.',
      })
      navigate({ to: '/profile' })
    },
  })

  // Demo initial values - in real app, fetch from user data
  const initialValues: Partial<ProfileFormData> = {
    name: 'Sarah Chen',
    profileImage:
      'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&auto=format&fit=crop&q=60',
    intent: ['build'],
    links: [
      { url: 'https://sarahchen.com' },
      { url: 'https://github.com/sarahchen' },
    ],
  }

  return (
    <div className={`mx-auto w-full ${container.maxWidth.md} min-h-full`}>
      <PageHeader title="Edit Profile" showBackButton>
        <Button onClick={triggerSubmit} disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save'}
        </Button>
      </PageHeader>
      <div className="py-4">
        <EditProfileForm
          formRef={formRef}
          onSubmit={handleSubmit}
          initialValues={initialValues}
          onDirtyChange={handleDirtyChange}
          isSubmitting={isSubmitting}
        />

        <UnsavedChangesDialog
          open={blocker.status === 'blocked'}
          onKeepEditing={blocker.reset}
          onDiscard={blocker.proceed}
        />
      </div>
    </div>
  )
}
