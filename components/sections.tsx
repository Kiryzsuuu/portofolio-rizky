'use client'

import Link from 'next/link'
import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { HiSparkles } from 'react-icons/hi2'
import {
  FaArrowRight,
  FaAws,
  FaCodeBranch,
  FaDatabase,
  FaEnvelope,
  FaGithub,
  FaInstagram,
  FaLinkedin,
  FaMicrosoft,
} from 'react-icons/fa6'
import { MdSupportAgent } from 'react-icons/md'
import { tr, ui } from '@/lib/i18n'
import type { Content, Education, Experience, Project, Settings, SkillGroup } from '@/lib/types'
import { useLang } from './LanguageProvider'

function cx(...v: Array<string | false | null | undefined>) {
  return v.filter(Boolean).join(' ')
}

function highlightIcon(label: string) {
  const key = label.trim().toLowerCase()
  if (key === 'artificial intelligence' || key === 'ai') return HiSparkles
  if (key === 'microsoft azure' || key === 'azure') return FaMicrosoft
  if (key === 'aws' || key.includes('amazon')) return FaAws
  if (key === 'azure devops' || key === 'devops') return FaCodeBranch
  if (key === 'azure cosmos db' || key === 'cosmos db') return FaDatabase
  if (key === 'technical support' || key === 'support') return MdSupportAgent
  return null
}

export function PageTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  const reduceMotion = useReducedMotion()
  return (
    <motion.div
      initial={reduceMotion ? undefined : { opacity: 0, y: 12 }}
      animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="mb-8"
    >
      <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">{title}</h1>
      {subtitle ? <p className="mt-2 max-w-2xl text-slate-600">{subtitle}</p> : null}
      <div className="mt-4 h-1 w-16 rounded-full bg-gradient-to-r from-sky-500 to-indigo-500" />
    </motion.div>
  )
}

export function PageHeader({
  which,
}: {
  which: 'about' | 'projects' | 'experience' | 'education' | 'contact'
}) {
  const { lang } = useLang()
  return <PageTitle title={tr(ui.nav[which], lang)} />
}

export function Hero({ settings, projects }: { settings: Settings; projects: Project[] }) {
  const { lang } = useLang()
  const reduceMotion = useReducedMotion()

  const initials = settings.name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('')

  return (
    <section className="relative">
      <motion.div
        initial={reduceMotion ? undefined : { opacity: 0, y: 14 }}
        animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between"
      >
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-3 py-1 text-sm text-slate-700">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            {settings.location} · {tr(ui.badge.open, lang)}
          </div>
          <h1 className="mt-4 text-balance text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
            <span className="bg-gradient-to-r from-slate-950 via-slate-800 to-slate-500 bg-clip-text text-transparent">
              {tr(settings.headline, lang)}
            </span>
          </h1>
          <p className="mt-5 max-w-2xl text-pretty text-base leading-relaxed text-slate-700 sm:text-lg">
            {tr(settings.summary, lang)}
          </p>
        </div>

        {settings.photo ? (
          <div className="shrink-0 self-start md:self-center">
            <div className="relative rounded-full bg-gradient-to-br from-sky-400 via-indigo-400 to-fuchsia-400 p-[3px] shadow-lg shadow-indigo-500/20">
              <div className="relative h-36 w-36 overflow-hidden rounded-full border border-white/60 bg-white md:h-44 md:w-44">
                <div className="absolute inset-0 flex items-center justify-center text-3xl font-semibold tracking-tight text-slate-700 md:text-4xl">
                  {initials}
                </div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={settings.photo}
                  alt={settings.name}
                  className="relative h-full w-full object-cover"
                  onError={(e) => {
                    ;(e.currentTarget as HTMLImageElement).style.opacity = '0'
                  }}
                />
              </div>
            </div>
          </div>
        ) : null}
      </motion.div>

      <div className="mt-7 flex flex-wrap gap-3">
        <Link
          className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-base font-medium text-white shadow-sm transition-transform hover:-translate-y-0.5 hover:bg-slate-800"
          href="/projects"
        >
          {tr(ui.actions.viewProjects, lang)}
          <FaArrowRight aria-hidden className="h-3.5 w-3.5" />
        </Link>
        <a
          className="rounded-xl border border-slate-200 bg-white/60 px-4 py-2.5 text-base font-medium text-slate-900 transition-colors hover:bg-white"
          href={settings.links.linkedin}
          target="_blank"
          rel="noreferrer"
        >
          LinkedIn
        </a>
        <Link
          className="rounded-xl border border-slate-200 bg-white/60 px-4 py-2.5 text-base font-medium text-slate-900 transition-colors hover:bg-white"
          href="/contact"
        >
          <span className="inline-flex items-center gap-2">
            <FaEnvelope aria-hidden className="h-4 w-4" />
            {tr(ui.actions.email, lang)}
          </span>
        </Link>
      </div>

      <div className="mt-10 flex flex-wrap gap-2">
        {settings.stackHighlights.map((item) => {
          const Icon = highlightIcon(item)
          return (
            <span
              key={item}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-3 py-1 text-sm text-slate-700 transition-colors hover:border-sky-300 hover:bg-white"
            >
              {Icon ? <Icon aria-hidden className="h-4 w-4 text-sky-600" /> : null}
              <span>{item}</span>
            </span>
          )
        })}
      </div>

      {projects.length ? (
        <div className="mt-12">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold tracking-wide text-slate-900">
              {tr(ui.nav.projects, lang)}
            </h2>
            <Link href="/projects" className="text-sm font-medium text-sky-600 hover:text-sky-500">
              {tr(ui.actions.viewProjects, lang)} →
            </Link>
          </div>
          <ProjectsGrid projects={projects.slice(0, 4)} />
        </div>
      ) : null}
    </section>
  )
}

export function AboutView({ settings, skills }: { settings: Settings; skills: SkillGroup[] }) {
  const { lang } = useLang()
  const translateValue = (value: string) =>
    ui.values[value] ? tr(ui.values[value], lang) : value

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <div className="md:col-span-2">
        <p className="leading-relaxed text-slate-700">{tr(settings.summary, lang)}</p>
        <p className="mt-4 leading-relaxed text-slate-700">{tr(settings.about, lang)}</p>

        {skills.length ? (
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {skills.map((group) => (
              <div key={group._id || group.title} className="rounded-2xl border border-slate-200 bg-white/60 p-5">
                <div className="text-base font-semibold text-slate-900">{group.title}</div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {group.items.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-sm text-slate-700"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </div>

      <div className="h-fit rounded-2xl border border-slate-200 bg-white/60 p-5">
        <div className="text-base font-semibold text-slate-900">{tr(ui.personal.title, lang)}</div>
        <dl className="mt-3 space-y-2 text-base">
          <Row label={tr(ui.personal.birth, lang)} value={settings.personalData.placeAndDateOfBirth} />
          <Row label={tr(ui.personal.gender, lang)} value={translateValue(settings.personalData.gender)} />
          <Row label={tr(ui.personal.status, lang)} value={translateValue(settings.personalData.status)} />
          <Row
            label={tr(ui.personal.citizenship, lang)}
            value={translateValue(settings.personalData.citizenship)}
          />
        </dl>
      </div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="text-slate-500">{label}</dt>
      <dd className="text-right text-slate-900">{value}</dd>
    </div>
  )
}

export function ProjectsGrid({ projects }: { projects: Project[] }) {
  const { lang } = useLang()
  const reduceMotion = useReducedMotion()

  return (
    <div className="grid gap-5 sm:grid-cols-2">
      {projects.map((project) => {
        const projInitials = project.name
          .replace(/[—-].*$/, '')
          .trim()
          .split(' ')
          .filter(Boolean)
          .slice(0, 2)
          .map((p) => p[0]?.toUpperCase())
          .join('')
        return (
          <motion.article
            key={project._id || project.name}
            initial={reduceMotion ? undefined : { opacity: 0, y: 12 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white/60 transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-900/10"
          >
            <div className="relative h-36 overflow-hidden border-b border-slate-200/80 bg-gradient-to-br from-sky-100 via-indigo-100 to-fuchsia-100">
              {project.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={project.image}
                  alt={project.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <span className="bg-gradient-to-br from-slate-700 to-slate-400 bg-clip-text text-4xl font-bold tracking-tight text-transparent">
                    {projInitials}
                  </span>
                </div>
              )}
            </div>
            <div className="flex flex-1 flex-col p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="text-lg font-semibold text-slate-900">{project.name}</div>
                {project.link ? (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noreferrer"
                    className="shrink-0 rounded-lg border border-slate-200 bg-white/60 px-3 py-1.5 text-sm text-slate-900 transition-colors hover:bg-white"
                  >
                    {project.link.includes('github.com') ? tr(ui.actions.repo, lang) : tr(ui.actions.live, lang)}
                  </a>
                ) : null}
              </div>
              <p className="mt-1 text-base text-slate-700">{tr(project.description, lang)}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {project.tech.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-sm text-slate-700"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </motion.article>
        )
      })}
    </div>
  )
}

export function ExperienceList({ experience }: { experience: Experience[] }) {
  const reduceMotion = useReducedMotion()
  return (
    <div className="grid gap-4">
      {experience.map((exp) => (
        <motion.div
          key={exp._id || exp.company + exp.role}
          initial={reduceMotion ? undefined : { opacity: 0, y: 12 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="rounded-2xl border border-slate-200 bg-white/60 p-5"
        >
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <div>
              <div className="text-base font-semibold text-slate-900">{exp.role}</div>
              <div className="text-base text-slate-700">{exp.company}</div>
            </div>
            <div className="text-sm text-slate-500">{exp.period}</div>
          </div>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-base text-slate-700">
            {exp.highlights.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
        </motion.div>
      ))}
    </div>
  )
}

export function EducationList({ education }: { education: Education[] }) {
  return (
    <div className="grid gap-3">
      {education.map((edu) => (
        <div key={edu._id || edu.school} className="rounded-2xl border border-slate-200 bg-white/60 p-5">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <div className="text-base font-semibold text-slate-900">{edu.school}</div>
            <div className="text-sm text-slate-500">{edu.period}</div>
          </div>
        </div>
      ))}
    </div>
  )
}

export function ContactView({ settings }: { settings: Settings }) {
  const { lang } = useLang()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const subject = encodeURIComponent(`Portfolio contact from ${name || 'someone'}`)
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`)
    window.location.href = `mailto:${settings.email}?subject=${subject}&body=${body}`
    setSent(true)
    window.setTimeout(() => setSent(false), 4000)
  }

  const inputClass =
    'w-full rounded-xl border border-slate-200 bg-white/70 px-3.5 py-2.5 text-base text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-sky-400 focus:ring-2 focus:ring-sky-200'

  return (
    <div className="grid gap-5 md:grid-cols-2">
      <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white/60 p-6">
        <div className="space-y-3">
          <Field label={tr(ui.contact.formName, lang)}>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={tr(ui.contact.formNamePh, lang)}
              className={inputClass}
            />
          </Field>
          <Field label={tr(ui.contact.formEmail, lang)}>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={tr(ui.contact.formEmailPh, lang)}
              className={inputClass}
            />
          </Field>
          <Field label={tr(ui.contact.formMessage, lang)}>
            <textarea
              required
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={tr(ui.contact.formMessagePh, lang)}
              className={cx(inputClass, 'resize-y')}
            />
          </Field>
        </div>
        <button
          type="submit"
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-sky-600 px-4 py-2.5 text-base font-medium text-white shadow-sm transition-colors hover:bg-sky-500"
        >
          <FaEnvelope aria-hidden className="h-4 w-4" />
          {tr(ui.contact.send, lang)}
        </button>
        {sent ? <p className="mt-3 text-center text-sm text-emerald-600">{tr(ui.contact.sent, lang)}</p> : null}
      </form>

      <div className="h-fit rounded-2xl border border-slate-200 bg-white/60 p-6">
        <div className="text-slate-700">{tr(ui.contact.heading, lang)}</div>
        <div className="mt-1 text-sm text-slate-500">{tr(ui.contact.or, lang)}</div>
        <div className="mt-4 flex flex-col gap-3">
          <ContactLink href={`mailto:${settings.email}`} icon={<FaEnvelope className="h-4 w-4" />} label={settings.email} />
          {settings.links.linkedin ? (
            <ContactLink href={settings.links.linkedin} icon={<FaLinkedin className="h-4 w-4" />} label="LinkedIn" external />
          ) : null}
          {settings.links.instagram ? (
            <ContactLink href={settings.links.instagram} icon={<FaInstagram className="h-4 w-4" />} label="Instagram" external />
          ) : null}
          {settings.links.github ? (
            <ContactLink href={settings.links.github} icon={<FaGithub className="h-4 w-4" />} label="GitHub" external />
          ) : null}
        </div>
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-slate-600">{label}</label>
      {children}
    </div>
  )
}

function ContactLink({
  href,
  icon,
  label,
  external,
}: {
  href: string
  icon: React.ReactNode
  label: string
  external?: boolean
}) {
  return (
    <a
      className="rounded-xl border border-slate-200 bg-white/60 px-4 py-2.5 text-base font-medium text-slate-900 transition-colors hover:bg-white"
      href={href}
      {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
    >
      <span className="inline-flex items-center gap-2">
        {icon}
        {label}
      </span>
    </a>
  )
}

export function SiteFooter({ content }: { content: Content }) {
  const { lang } = useLang()
  return (
    <footer className="mt-14 text-center text-sm text-slate-500">
      © {new Date().getFullYear()} {content.settings.name}. {tr(ui.footer.built, lang)}
    </footer>
  )
}
