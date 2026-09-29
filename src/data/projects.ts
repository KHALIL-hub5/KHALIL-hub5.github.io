import type { ComponentType } from 'react'
import shots from './project-screens.generated.json'
import { FindWorkerConcept } from '../components/showroom/khdamli-web/FindWorkerConcept'
import { RequestsConcept } from '../components/showroom/khdamli-web/RequestsConcept'
import { SignInConcept } from '../components/showroom/khdamli-web/SignInConcept'

export interface Screen {
  name: string
  src?: string
  concept?: boolean
  component?: ComponentType
  width: number
  height: number
}

export interface ShowroomTheme {
  page: string
  text: string
  muted: string
  panel: string
  line: string
  accent: string
  accentAlt: string
  button: string
  stage: string
  grid: string
}

export type ProjectCategory = 'Web' | 'Mobile' | 'AI' | 'Networking'
export type ProjectIcon = 'smartphone' | 'healthcare' | 'bot' | 'server' | 'network'
export type RepositoryStatus = 'available' | 'private' | 'coming-soon'

export interface ProjectRecord {
  id: 'kh' | 'ml' | 'un' | 'swarm' | 'networking'
  title: string
  description: string
  technologies: string[]
  categories: ProjectCategory[]
  icon: ProjectIcon
  status: RepositoryStatus
  repoUrl?: string
  liveUrl?: string
  image?: string
  featured?: boolean
  name?: string
  tagline?: string
  audience?: string
  stack?: string
  repoStatus?: 'public' | 'private' | 'soon'
  palette?: {
    primary: string
    secondary: string
    surface: string
    colors: string[]
    dark: ShowroomTheme
    light: ShowroomTheme
  }
  emblem?: 'house' | 'crescent' | 'cap'
  labels?: string[]
  web?: Screen[]
  mobile?: Screen[]
  edge?: string
}

export type Project = ProjectRecord & {
  id: 'kh' | 'ml' | 'un'
  name: string
  tagline: string
  audience: string
  stack: string
  repoStatus: 'public' | 'private' | 'soon'
  palette: NonNullable<ProjectRecord['palette']>
  emblem: 'house' | 'crescent' | 'cap'
  labels: string[]
  web: Screen[]
  mobile: Screen[]
  edge: string
}

function isShowroomProject(project: ProjectRecord): project is Project {
  return (
    (project.id === 'kh' || project.id === 'ml' || project.id === 'un') &&
    project.name !== undefined &&
    project.tagline !== undefined &&
    project.audience !== undefined &&
    project.stack !== undefined &&
    project.repoStatus !== undefined &&
    project.palette !== undefined &&
    project.emblem !== undefined &&
    project.labels !== undefined &&
    project.web !== undefined &&
    project.mobile !== undefined &&
    project.edge !== undefined
  )
}

const khWeb: Screen[] = [
  { name: 'Sign in', concept: true, component: SignInConcept, width: 1000, height: 625 },
  { name: 'Find a worker', concept: true, component: FindWorkerConcept, width: 1000, height: 625 },
  { name: 'Requests', concept: true, component: RequestsConcept, width: 1000, height: 625 },
]

const portfolioProjects: ProjectRecord[] = [
  {
    id: 'kh',
    title: 'KHdamli',
    description: 'An employment marketplace connecting clients in Algeria with tradespeople, from plumbers to repair workers.',
    technologies: ['React Native', 'TypeScript'],
    categories: ['Mobile'],
    icon: 'smartphone',
    status: 'private',
    featured: true,
    name: 'KHdamli',
    tagline: 'An employment marketplace connecting clients in Algeria with tradespeople.',
    audience: 'Clients looking for a plumber, builder or repair worker, and the tradespeople who take the jobs.',
    stack: 'React Native, TypeScript',
    repoStatus: 'private',
    palette: {
      primary: '#4d8577',
      secondary: '#f5a300',
      surface: '#0d1b1c',
      colors: ['#4d8577', '#f5a300', '#0d1b1c'],
      dark: {
        page: '#0a1a19',
        text: '#e8f2ef',
        muted: '#9ab5b0',
        panel: '#0f2624',
        line: '#21403c',
        accent: '#78b8a8',
        accentAlt: '#f5a300',
        button: '#3b6e62',
        stage: '#0c2724',
        grid: '#5fb5a5',
      },
      light: {
        page: '#f3f7f5',
        text: '#20302c',
        muted: '#536760',
        panel: '#ffffff',
        line: '#d8e3df',
        accent: '#3f7367',
        accentAlt: '#a96900',
        button: '#3f7367',
        stage: '#eaf1ee',
        grid: '#4d8577',
      },
    },
    emblem: 'house',
    labels: ['React Native', 'Worker or client', 'Cash · Baridimob · CCP'],
    web: khWeb,
    mobile: shots.kh_mobile,
    edge: '#2f6f63',
  },
  {
    id: 'ml',
    title: 'MediLink-DZ',
    description: 'A web platform bringing together Algerian healthcare information: medicines, practices, pharmacies, rentals, and patients.',
    technologies: ['Web platform'],
    categories: ['Web'],
    icon: 'healthcare',
    status: 'available',
    name: 'MediLink DZ',
    tagline: 'A web platform bringing together Algerian healthcare information.',
    audience: 'Patients, doctors, pharmacists and administrators, all in one healthcare platform for Algeria.',
    stack: 'Web application',
    repoUrl: 'https://github.com/KHALIL-hub5/MediLink-DZ',
    repoStatus: 'public',
    palette: {
      primary: '#006b3c',
      secondary: '#2f6bf0',
      surface: '#f3f8f2',
      colors: ['#006b3c', '#00a35c', '#2f6bf0'],
      dark: {
        page: '#04180f',
        text: '#e7f4ec',
        muted: '#97bba6',
        panel: '#082a1a',
        line: '#14472d',
        accent: '#00a35c',
        accentAlt: '#2f6bf0',
        button: '#006b3c',
        stage: '#05231a',
        grid: '#4ad19a',
      },
      light: {
        page: '#f0f7f2',
        text: '#173326',
        muted: '#4e6958',
        panel: '#ffffff',
        line: '#d0e2d5',
        accent: '#006b3c',
        accentAlt: '#2f6bf0',
        button: '#006b3c',
        stage: '#e9f3eb',
        grid: '#188553',
      },
    },
    emblem: 'crescent',
    labels: ['Patient · Doctor · Pharmacist · Admin', 'AI health assistant', 'Telehealth'],
    web: shots.ml_web,
    mobile: shots.ml_mobile,
    edge: '#0b6b3e',
  },
  {
    id: 'un',
    title: 'ALIAS',
    description: 'A campus management platform built with a microservices architecture; I led the risk analysis in a team of 9.',
    technologies: ['Microservices', 'Risk analysis'],
    categories: ['Web'],
    icon: 'server',
    status: 'coming-soon',
    name: 'ALIAS · UNIVENT',
    tagline: 'A campus management platform built with a microservices architecture.',
    audience: 'Students, event organizers and the university administration, part of the ALIAS campus platform.',
    stack: 'Microservices architecture',
    repoStatus: 'soon',
    palette: {
      primary: '#27ae72',
      secondary: '#e8a33a',
      surface: '#faf6f1',
      colors: ['#27ae72', '#1f9a62', '#e8a33a'],
      dark: {
        page: '#14231c',
        text: '#edf5ee',
        muted: '#afc1b3',
        panel: '#1c3026',
        line: '#344c3c',
        accent: '#27ae72',
        accentAlt: '#e8a33a',
        button: '#146d47',
        stage: '#17291f',
        grid: '#5aa585',
      },
      light: {
        page: '#f3ede2',
        text: '#1b2a22',
        muted: '#5a6b60',
        panel: '#fbf7ef',
        line: '#dcd2bf',
        accent: '#16764f',
        accentAlt: '#a56a0b',
        button: '#146d47',
        stage: '#f8f3ea',
        grid: '#39835e',
      },
    },
    emblem: 'cap',
    labels: ['Organizer hub', 'Live student view', 'Proposal lifecycle'],
    web: shots.un_web,
    mobile: shots.un_mobile,
    edge: '#1f9a62',
  },
]

export { portfolioProjects }
export const projects: Project[] = portfolioProjects.filter(isShowroomProject)
