export type ExperienceStatus = 'upcoming' | 'ongoing' | 'finished'

export interface ExperienceRecord {
  role: string
  organization: string
  location: string
  startDate: string
  endDate: string
  dates: string
  accessibleDates: string
  duration: string
  highlights: string[]
  repoUrl?: string
  project?: string
  projectDescriptionStatus?: 'coming-soon'
  repoStatus?: 'coming-soon'
}

export function formatExperienceDate(isoDate: string) {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${isoDate}T00:00:00Z`))
}

export function formatExperienceRange(startDate: string, endDate: string) {
  const start = formatExperienceDate(startDate)
  const end = formatExperienceDate(endDate)
  return `${start.replace(` ${start.slice(-4)}`, '')} - ${end}`
}

export function formatExperienceAccessibleRange(startDate: string, endDate: string) {
  const format = (isoDate: string) => new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${isoDate}T00:00:00Z`))
  return `${format(startDate)} to ${format(endDate)}`
}

export function formatExperienceDuration(startDate: string, endDate: string) {
  const start = Date.parse(`${startDate}T00:00:00Z`)
  const end = Date.parse(`${endDate}T00:00:00Z`)
  const days = Math.round((end - start) / 86400000) + 1
  return days >= 28 && days <= 31 ? 'about 1 month' : `${days} days`
}

export function getExperienceStatus(startDate: string, endDate: string, today = new Date().toISOString().slice(0, 10)): ExperienceStatus {
  if (today < startDate) return 'upcoming'
  if (today > endDate) return 'finished'
  return 'ongoing'
}

const experienceEntries = [
  {
    role: 'Network Engineering Intern',
    organization: 'Algérie Télécom',
    location: 'Direction Générale, Algiers',
    startDate: '2026-09-01',
    endDate: '2026-09-30',
    highlights: [
      'Worked in a team of 2, supervised by Mr. Rayane Selmati.',
      'Configured OSPFv2 on PE and core routers so all loopbacks were reachable.',
      'Built eBGP sessions between loopbacks in different Autonomous Systems using ebgp-multihop, then analysed best-path selection.',
      'Implemented BGP Anycast, advertising one prefix from several data centers via route-maps.',
      'Simulated data-center and link failures on a test topology to validate automatic failover.',
    ],
  },
  {
    role: 'Software Development Intern',
    organization: 'Gestion de formation (Sonatrach)',
    location: 'Béraki, Algeria',
    startDate: '2026-09-15',
    endDate: '2026-10-15',
    highlights: [
      'Built Gestion Formations, a training management system replacing an Excel-based process.',
      'The system warns about scheduling conflicts and tracks requested and completed trainings.',
    ],
    repoUrl: 'https://github.com/KHALIL-hub5/gestion-formations',
  },
  {
    role: 'Intern',
    organization: 'Sonatrach Boumerdès (maintenance site)',
    location: 'Boumerdès, Algeria',
    startDate: '2026-09-15',
    endDate: '2026-10-15',
    highlights: [],
    project: 'Gestion Maintenance',
    projectDescriptionStatus: 'coming-soon' as const,
    repoStatus: 'coming-soon' as const,
  },
]

export const experience = experienceEntries.map((entry): ExperienceRecord => ({
  ...entry,
  dates: formatExperienceRange(entry.startDate, entry.endDate),
  accessibleDates: formatExperienceAccessibleRange(entry.startDate, entry.endDate),
  duration: formatExperienceDuration(entry.startDate, entry.endDate),
}))
