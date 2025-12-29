import { HammerIcon, UsersIcon } from '@phosphor-icons/react'
import { Link } from '@tanstack/react-router'
import {
  Timeline,
  TimelineItem,
  TimelineHeader,
  TimelineContent,
  TimelineSeparator,
  TimelineIndicator,
} from '@/components/ui/timeline'
import { ItemRow } from '@/components/shared'

interface Collaboration {
  id: number
  date: string
  project: string
  role: string
  type: 'build' | 'socialize'
  state: 'complete' | 'incomplete'
  contributions: string[]
  postId?: number
}

const COLLABORATIONS: Collaboration[] = [
  {
    id: 1,
    date: 'October 2024',
    project: 'AI Study Group',
    role: 'Lead',
    type: 'socialize',
    state: 'complete',
    postId: 1,
    contributions: [
      'Organized weekly sessions on transformer architectures.',
      'Facilitated group discussions and hands-on workshops.',
    ],
  },
  {
    id: 2,
    date: 'July 2024',
    project: 'Campus Safewalk App',
    role: 'Frontend Dev',
    type: 'build',
    state: 'complete',
    postId: 2,
    contributions: [
      'Built the map interface and SOS feature using React Native.',
    ],
  },
  {
    id: 3,
    date: 'March 2024',
    project:
      'GreenTech Hackathon: Building Sustainable Solutions for Urban Environments',
    role: 'Designer',
    type: 'build',
    state: 'complete',
    contributions: [
      'Designed the UI/UX for a carbon footprint tracker app.',
      'Created interactive prototypes in Figma.',
      'Conducted user testing sessions.',
    ],
  },
  {
    id: 4,
    date: 'December 2024',
    project: 'Robotics Club Website Redesign',
    role: 'Full Stack',
    type: 'build',
    state: 'incomplete',
    contributions: [
      'Revamping the club website with a new member portal.',
      'Integrating payment gateway for membership fees.',
    ],
  },
]

export function CollaborationWrap() {
  return (
    <div className="w-full py-2">
      <Timeline>
        {COLLABORATIONS.map((collab) => (
          <TimelineItem key={collab.id} step={collab.id}>
            <TimelineHeader>
              <TimelineSeparator />
              <TimelineIndicator className="border-none bg-muted">
                {collab.type === 'build' ? (
                  <HammerIcon
                    weight="fill"
                    className="size-4 text-muted-foreground"
                  />
                ) : (
                  <UsersIcon
                    weight="fill"
                    className="size-4 text-muted-foreground"
                  />
                )}
              </TimelineIndicator>
              <ItemRow
                left={null}
                primary={
                  collab.postId ? (
                    <Link
                      to="/post/$id"
                      params={{ id: collab.postId.toString() }}
                      className="font-medium text-sm leading-tight cursor-pointer line-clamp-2"
                    >
                      {collab.project}
                    </Link>
                  ) : (
                    <span className="font-medium text-sm leading-tight line-clamp-2">
                      {collab.project}
                    </span>
                  )
                }
                secondary={collab.role}
                tertiary={collab.date}
                className="flex-1"
              />
            </TimelineHeader>
            <TimelineContent className="mt-2 rounded-lg border bg-card/50 overflow-hidden">
              <div className="flex flex-col divide-y divide-border/50">
                {collab.contributions.map((contribution, idx) => (
                  <p
                    key={idx}
                    className="px-3 py-2.5 text-sm leading-relaxed text-foreground/90"
                  >
                    {contribution}
                  </p>
                ))}
              </div>
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
    </div>
  )
}
