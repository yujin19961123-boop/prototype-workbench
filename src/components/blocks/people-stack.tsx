import { Avatar, AvatarFallback, AvatarGroup, AvatarGroupCount } from '@/components/ui/avatar'

export type PersonSample = { id: string; name: string; initials: string }
export function PeopleStack({ people, limit = 3 }: { people: PersonSample[]; limit?: number }) {
  const visible = people.slice(0, Math.max(1, Math.floor(limit)))
  return <AvatarGroup role="group" aria-label={`参与者，共 ${people.length} 人`} className="-space-x-1.5 *:data-[slot=avatar]:ring-card">{visible.map((person, index) => <Avatar key={person.id} size="sm" title={person.name} aria-label={person.name}><AvatarFallback className={`${index % 2 ? 'bg-avatar-blue' : 'bg-avatar-green'} text-micro text-white`}>{person.initials}</AvatarFallback></Avatar>)}{people.length > visible.length && <AvatarGroupCount className="size-6 text-micro" aria-label={`另有 ${people.length-visible.length} 人`}>+{people.length-visible.length}</AvatarGroupCount>}</AvatarGroup>
}
