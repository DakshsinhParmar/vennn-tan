import { createFileRoute } from '@tanstack/react-router'
import { LifebuoyIcon } from '@phosphor-icons/react'
import { PageHeader } from '@/components/layout/page-header'
import { PostCard } from '@/components/feed/post-card'
import { Button } from '@/components/ui/button'
import { toastManager } from '@/components/ui/toast'
import { container, layout, spacing, icon } from '@/lib/design'
import type { UserPostRole } from '@/lib/types'

export const Route = createFileRoute('/home')({
  component: HomePage,
})

const CURRENT_USER_ID = 'current-user'

// Reusing demo data from profile for the "global feed" simulation
// All variants: image+desc, image only, no image+desc, no image+no desc
const DEMO_POSTS = [
  // === OWN POSTS (owner menu: Edit/Delete) ===
  // 1. With image + description
  {
    id: 1,
    title: 'Looking for a co-founder for a new AI startup',
    description:
      'I have a solid idea for an AI-powered platform that will revolutionize how small businesses handle customer service.',
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
  // 2. With image, no description
  {
    id: 2,
    title: 'Sharing my latest research on LLMs',
    description: '',
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
  // 3. No image, with description
  {
    id: 6,
    title: 'Discussion: Future of No-Code Tools',
    description:
      'I believe no-code tools are becoming increasingly sophisticated. What are your thoughts on their impact on traditional development roles?',
    role: ['Product', 'Discussion'],
    image: '',
    user: {
      id: CURRENT_USER_ID,
      name: 'Sarah Chen',
      initials: 'SC',
      avatar:
        'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&auto=format&fit=crop&q=60',
    },
  },
  // 4. No image, no description (minimal)
  {
    id: 8,
    title: 'Quick question: Best React state management library in 2024?',
    description: '',
    role: undefined,
    image: '',
    user: {
      id: CURRENT_USER_ID,
      name: 'Sarah Chen',
      initials: 'SC',
      avatar:
        'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&auto=format&fit=crop&q=60',
    },
  },

  // === OTHER USERS' POSTS (guest menu: Repost/Share) ===
  // 5. Other user - with image + description
  {
    id: 3,
    title: 'Looking for designers to collaborate on a new project',
    description:
      'We are building an innovative design system for enterprise applications. Looking for experienced designers.',
    role: ['Designer', 'UI/UX'],
    image:
      'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&auto=format&fit=crop&q=60',
    user: {
      id: 'user-other-1',
      name: 'Alex Rivera',
      initials: 'AR',
      avatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=60',
    },
  },
  // 6. Other user - with image only
  {
    id: 7,
    title: 'Just updated my portfolio with new case studies!',
    description: '',
    role: ['Design'],
    image:
      'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop&q=60',
    user: {
      id: 'user-other-2',
      name: 'Maria Garcia',
      initials: 'MG',
      avatar:
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=60',
    },
  },
  // 7. Other user - no image, with description
  {
    id: 9,
    title: 'Need a React Native developer for a 3-month contract',
    description:
      'We are building a mobile app for our e-commerce platform and need an experienced React Native developer.',
    role: ['Developer'],
    image: '',
    user: {
      id: 'user-other-3',
      name: 'David Park',
      initials: 'DP',
      avatar:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=60',
    },
  },
  // 8. Other user - no image, no description
  {
    id: 10,
    title: 'Anyone interested in joining a weekend hackathon?',
    description: '',
    role: undefined,
    image: '',
    user: {
      id: 'user-other-4',
      name: 'Taylor Kim',
      initials: 'TK',
      avatar:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=60',
    },
  },
]

function HomePage() {
  const handleDeletePost = (postId: string | number) => {
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
      {/* Mobile-only Header */}
      <PageHeader
        className="sm:hidden"
        titleSuffix={
          <span className="tracking-tighter font-semibold text-xl">vennn</span>
        }
      >
        <Button
          variant="ghost"
          size="icon"
          render={
            <a
              href="https://vennn.featurebase.app/"
              target="_blank"
              rel="noopener noreferrer"
            />
          }
        >
          <LifebuoyIcon className={icon.md} weight="regular" />
        </Button>
      </PageHeader>

      {/* Feed Content */}
      <div className={`mt-4 ${spacing.section.items}`}>
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
              variant="feed"
              userRole={userRole}
              onDelete={() => handleDeletePost(post.id)}
            />
          )
        })}
      </div>
    </div>
  )
}
