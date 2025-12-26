import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { ProfileInfo } from '@/components/profile/profile-info'
import { PageHeader } from '@/components/layout/page-header'
import { CollaborationWrap } from '@/components/profile/collaboration-wrap'
import { Button } from '@/components/ui/button'
import { PostCard } from '@/components/feed/post-card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toastManager } from '@/components/ui/toast'
import { container, spacing, element, layout } from '@/lib/design'
import type { UserPostRole } from '@/lib/types'

export const Route = createFileRoute('/profile')({
  component: ProfilePage,
})

// Current logged-in user ID (in real app, this would come from auth context)
const CURRENT_USER_ID = 'current-user'

const DEMO_USER = {
  id: CURRENT_USER_ID,
  name: 'Sarah Chen',
  initials: 'SC',
  avatar:
    'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&auto=format&fit=crop&q=60',
  intent: ['build', 'socialize'],
  links: [
    { url: 'https://sarahchen.dev' },
    { url: 'https://github.com/sarahchen' },
    { url: 'https://linkedin.com/in/sarahchen' },
  ],
}

const DEMO_POSTS = [
  {
    id: 1,
    title: 'Looking for a co-founder for a new AI startup',
    role: ['Co-founder', 'CTO'],
    image:
      'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&auto=format&fit=crop&q=60',
    user: {
      id: CURRENT_USER_ID,
      name: 'Sarah Chen',
      initials: 'SC',
      avatar:
        'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&auto=format&fit=crop&q=60',
    },
  },
  {
    id: 2,
    title: 'Sharing my latest research on LLMs',
    role: undefined,
    image:
      'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop&q=60',
    user: {
      id: CURRENT_USER_ID,
      name: 'Sarah Chen',
      initials: 'SC',
      avatar:
        'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&auto=format&fit=crop&q=60',
    },
  },
  {
    id: 3,
    title: 'Looking for designers to collaborate on a new project',
    role: ['Designer', 'UI/UX'],
    image:
      'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&auto=format&fit=crop&q=60',
    user: {
      id: CURRENT_USER_ID,
      name: 'Sarah Chen',
      initials: 'SC',
      avatar:
        'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&auto=format&fit=crop&q=60',
    },
  },
]

function ProfilePage() {
  const navigate = useNavigate()

  const handleDeletePost = (postId: string | number) => {
    // In real app, this would call an API to delete the post
    toastManager.add({
      type: 'success',
      title: 'Post deleted',
      description: 'Your post has been deleted.',
    })
    console.log('Delete post:', postId)
  }

  return (
    <div
      className={`w-full ${container.maxWidth.md} mx-auto ${layout.page.bottomPadding}`}
    >
      <PageHeader title="Profile" className="mb-8">
        <Button onClick={() => navigate({ to: '/edit-profile' })}>Edit</Button>
      </PageHeader>

      {/* Profile Info */}
      <ProfileInfo user={DEMO_USER} className="mb-6" />

      {/* Tabs Section */}
      <Tabs defaultValue="posts" className="w-full">
        <TabsList
          variant="underline"
          className={`${element.tabList} rounded-none bg-transparent mb-6 border-b`}
        >
          <TabsTrigger value="posts" className={element.tabTrigger}>
            Posts
          </TabsTrigger>
          <TabsTrigger value="collaborations" className={element.tabTrigger}>
            Collaborations
          </TabsTrigger>
        </TabsList>

        <TabsContent value="posts">
          <div className={spacing.section.items}>
            {DEMO_POSTS.map((post) => {
              const userRole: UserPostRole =
                post.user.id === CURRENT_USER_ID ? 'owner' : 'viewer'
              return (
                <PostCard
                  key={post.id}
                  id={post.id}
                  title={post.title}
                  role={post.role}
                  image={post.image}
                  user={post.user}
                  variant="profile"
                  userRole={userRole}
                  onDelete={() => handleDeletePost(post.id)}
                />
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="collaborations">
          <CollaborationWrap />
        </TabsContent>
      </Tabs>
    </div>
  )
}
