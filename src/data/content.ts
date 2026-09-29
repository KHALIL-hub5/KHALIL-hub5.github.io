import { portfolioProjects } from './projects'
import type { ProjectCategory, ProjectRecord } from './projects'

export type { ProjectCategory, ProjectIcon, RepositoryStatus } from './projects'

export interface SocialProfile {
  url?: string
  status: 'available' | 'coming-soon'
}

export type Project = ProjectRecord

export const content = {
  name: 'Khalil Djaidja',
  monogram: 'KD',
  title: 'Full-Stack Web & Mobile Developer',
  tagline:
    'I build useful digital products and explore the systems that keep them connected — from mobile apps to the network layer.',
  navigation: [
    { label: 'About', href: '#about' },
    { label: 'Experience', href: '#experience' },
    { label: 'Projects', href: '#projects' },
    { label: 'Contact', href: '#contact' },
  ],
  heroCopy: {
    greeting: 'Hello, I’m',
    projectAction: 'View projects',
    cvAction: 'Download CV',
    githubAction: 'Find me on GitHub',
    locationLabel: 'Scroll to explore',
    sectionMarker: '01 — 06',
    codeStatus: 'Available for what’s next',
  },
  heroImage: {
    src: '/khalil-profile.png',
    alt: 'Khalil Djaidja seated in an office wearing a dark suit',
    caption: 'Full-stack developer',
  },
  location: 'Algiers, Algeria',
  education: '4th-year Computer Science student at ESI Algiers',
  graduation: 'Expected 2027',
  availability: 'Available for freelance work and internships',
  about: [
    'I’m Khalil, a computer science student and developer based in Algiers. I enjoy taking ideas from a rough brief to a useful, well-crafted product.',
    'My work spans full-stack web development, mobile apps, and hands-on networking. I’m especially interested in AI, cybersecurity, and the infrastructure behind reliable software.',
  ],
  aboutSection: {
    eyebrow: 'A little about me',
    title: 'Curious by nature. Builder by choice.',
    collaborationLink: 'More about working together',
    facts: ['Studying', 'Based in', 'Languages'],
  },
  languages: ['French', 'English', 'Algerian Arabic (Darija)'],
  skillsSection: {
    eyebrow: 'Tools of the trade',
    title: 'A versatile toolkit.',
    description: 'From the interface to the infrastructure, these are the tools and technologies I work with.',
    interestsLabel: 'Currently curious about',
  },
  interests: ['Artificial intelligence', 'Cybersecurity', 'Computer networks'],
  skills: [
    {
      category: 'Languages',
      items: ['C++', 'JavaScript', 'TypeScript', 'HTML'],
    },
    {
      category: 'Web & mobile',
      items: ['React', 'React Native', 'Node.js', 'Express', 'NestJS'],
    },
    {
      category: 'Data & tools',
      items: ['Prisma', 'PostgreSQL', 'Linux'],
    },
    {
      category: 'Networking & security',
      items: ['OSPF', 'BGP', 'MPLS concepts', 'SSH', 'FTP', 'CTF challenges'],
    },
  ],
  experience: [
    {
      role: 'Network Engineering Intern',
      organization: 'Algérie Télécom',
      location: 'Direction Générale, Algiers',
      dates: '[dates]',
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
      organization: 'Sonatrach Béraki',
      location: 'Béraki, Algeria',
      dates: '[dates]',
      highlights: [
        'Built Gestion Formations, a training management system replacing an Excel-based process.',
        'The system warns about scheduling conflicts and tracks requested and completed trainings.',
      ],
      repoUrl: 'https://github.com/KHALIL-hub5/gestion-formations',
    },
    {
      role: 'Intern',
      organization: 'Sonatrach Boumerdès — Laboratories Division',
      location: 'Boumerdès, Algeria',
      dates: '[dates]',
      highlights: [],
      project: 'Gestion Maintenance',
      projectDescriptionStatus: 'coming-soon',
      repoStatus: 'coming-soon',
    },
  ],
  experienceSection: {
    eyebrow: 'Where I’ve learned',
    title: 'Experience in practice.',
    description: 'Learning by building, collaborating, and getting close to the systems behind the work.',
    repositoryLink: 'View project repository',
    repositoryComingSoon: 'Repository coming soon',
    projectDescriptionComingSoon: 'Project description coming soon',
  },
  projectsSection: {
    eyebrow: 'Selected work',
    title: 'Things I’ve helped bring to life.',
    description: 'A selection of product, AI, and networking work — with more in progress.',
    moreProjectsLabel: 'Small experiments & more',
    moreOnGithub: 'More on GitHub',
    githubAction: 'GitHub',
    filterGroupLabel: 'Filter projects by category',
    allFilter: 'All',
    repositoryStatus: {
      private: 'Code on request',
      comingSoon: 'Repository coming soon',
    },
  },
  projectCategories: ['Web', 'Mobile', 'AI', 'Networking'] satisfies ProjectCategory[],
  projects: portfolioProjects,
  moreProjects: [
    { title: 'expense-tracker-react', href: 'https://github.com/KHALIL-hub5/expense-tracker-react' },
    { title: 'Alamin-Portfolio', href: 'https://github.com/KHALIL-hub5/Alamin-Portfolio' },
    { title: 'Poject1', href: 'https://github.com/KHALIL-hub5/Poject1' },
  ],
  contact: {
    email: 'khalildjaidja510@gmail.com',
    emailHref: 'mailto:khalildjaidja510@gmail.com',
    github: 'https://github.com/KHALIL-hub5',
    linkedin: { url: undefined, status: 'coming-soon' } satisfies SocialProfile,
    upwork: { url: undefined, status: 'coming-soon' } satisfies SocialProfile,
  },
  contactSection: {
    eyebrow: 'Have a project in mind?',
    title: 'Let’s make something useful.',
    description: 'Open to freelance work, internships, and good conversations about software, AI, or networks.',
    action: 'Get in touch',
    emailLabel: 'Email:',
    githubLabel: 'GitHub',
    linkedinLabel: 'LinkedIn',
    upworkLabel: 'Upwork',
    profileComingSoon: 'Profile link coming soon',
  },
  footer: {
    attribution: 'Designed & built by',
    githubLabel: 'GitHub',
    backToTop: 'Back to top',
  },
  meta: {
    description:
      'Khalil Djaidja is a full-stack web and mobile developer and computer science student based in Algiers, Algeria, with interests in AI, cybersecurity, and networking.',
    siteUrl: 'https://khalil-hub5.github.io/',
  },
} as const
