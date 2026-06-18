import type { Localized } from './i18n'

export type { Localized }

export type Project = {
  _id?: string
  name: string
  description: Localized
  tech: string[]
  link: string
  image: string
  order: number
}

export type Experience = {
  _id?: string
  role: string
  company: string
  period: string
  highlights: string[]
  order: number
}

export type Education = {
  _id?: string
  school: string
  period: string
  order: number
}

export type SkillGroup = {
  _id?: string
  title: string
  items: string[]
  order: number
}

export type Settings = {
  name: string
  headline: Localized
  location: string
  photo: string
  email: string
  phone: string
  summary: Localized
  about: Localized
  personalData: {
    placeAndDateOfBirth: string
    gender: string
    status: string
    citizenship: string
  }
  stackHighlights: string[]
  links: {
    github: string
    linkedin: string
    instagram: string
    cvPdf: string
  }
  site: {
    accent: string
    defaultLang: 'en' | 'id'
    sections: {
      about: boolean
      skills: boolean
      projects: boolean
      experience: boolean
      education: boolean
      contact: boolean
    }
  }
}

export type Content = {
  settings: Settings
  projects: Project[]
  experience: Experience[]
  education: Education[]
  skills: SkillGroup[]
}

export const COLLECTIONS = ['projects', 'experience', 'education', 'skills'] as const
export type CollectionName = (typeof COLLECTIONS)[number]
