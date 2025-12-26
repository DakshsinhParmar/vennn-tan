import { HammerIcon, UsersIcon } from '@phosphor-icons/react'
import { Link } from '@tanstack/react-router'
import {
  Timeline,
  TimelineItem,
  TimelineHeader,
  TimelineTitle,
  TimelineContent,
  TimelineSeparator,
  TimelineIndicator,
} from '@/components/ui/timeline'

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
      'Designed the UI/UX for a carbon footprint tracker app that helps users monitor their daily emissions.',
      'Created interactive prototypes in Figma regarding the layout and user flow.',
      'Conducted user testing sessions to gather feedback on the initial design concepts.',
    ],
  },
  {
    id: 4,
    date: 'December 2024',
    project: 'Robotics Club Website & Member Portal Redesign Project',
    role: 'Full Stack',
    type: 'build',
    state: 'incomplete', // incomplete
    contributions: [
      'Revamping the club website with a new member portal.',
      'Integrating payment gateway for membership fees.',
      'Migrating the legacy database to a modern cloud infrastructure.',
    ],
  },
]

export function CollaborationWrap() {
  return (
    <div className="w-full max-w-xl mx-auto py-4">
      <Timeline>
        {COLLABORATIONS.map((collab) => (
          <TimelineItem key={collab.id} step={collab.id}>
            <TimelineHeader className="flex justify-between items-center min-h-9">
              <TimelineSeparator />
              <div className="flex flex-col flex-1 min-w-0">
                <TimelineTitle className="leading-none pt-1">
                  <div className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      {collab.postId ? (
                        <Link
                          to="/post/$id"
                          params={{ id: collab.postId.toString() }}
                          className="font-semibold text-base cursor-pointer line-clamp-2 leading-normal text-foreground/90"
                        >
                          {collab.project}
                        </Link>
                      ) : (
                        <span className="font-semibold text-base line-clamp-2 leading-normal text-foreground/90">
                          {collab.project}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-col gap-0 text-xs">
                      <span className="text-muted-foreground font-normal leading-tight line-clamp-1">
                        {collab.role}
                      </span>
                      <span className="text-[10px] text-muted-foreground/60 leading-none pt-0.5">
                        {collab.date}
                      </span>
                    </div>
                  </div>
                </TimelineTitle>
              </div>

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
            </TimelineHeader>

            <TimelineContent className="mt-4 rounded-lg border text-foreground bg-muted/20 overflow-hidden">
              <div className="flex flex-col divide-y divide-border">
                {collab.contributions.map((contribution, idx) => (
                  <div key={idx} className="px-4 py-3">
                    <p className="text-[15px] leading-relaxed">
                      {contribution}
                    </p>
                  </div>
                ))}
              </div>
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
    </div>
  )
}
