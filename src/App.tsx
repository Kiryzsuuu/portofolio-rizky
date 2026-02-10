import { motion, useReducedMotion } from 'framer-motion'
import { profile } from './data/profile'

function classNames(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(' ')
}

function App() {
  const reduceMotion = useReducedMotion()

  const initials = profile.name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')

  const reveal = {
    hidden: { opacity: 0, y: 14 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <div className="relative min-h-dvh overflow-hidden px-3 py-3 sm:px-4 sm:py-4">
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-60" />
      <div className="pointer-events-none absolute inset-0 mask-fade">
        <div className="absolute -top-24 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-sky-500/15 blur-3xl" />
        <div className="absolute top-24 -left-24 h-[440px] w-[440px] rounded-full bg-fuchsia-500/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-[520px] w-[520px] rounded-full bg-emerald-500/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl rounded-3xl border border-slate-200/80 bg-white/55">
        <header className="sticky top-3 z-20 rounded-t-3xl border-b border-slate-200/80 bg-white/70 backdrop-blur sm:top-4">
          <div className="flex items-center justify-between px-4 py-3">
            <a href="#top" className="font-semibold tracking-tight">
              {profile.name}
            </a>
            <nav className="hidden gap-6 text-base text-slate-700 md:flex">
              <a className="hover:text-slate-950" href="#about">
                About
              </a>
              <a className="hover:text-slate-950" href="#skills">
                Skills
              </a>
              <a className="hover:text-slate-950" href="#projects">
                Projects
              </a>
              <a className="hover:text-slate-950" href="#experience">
                Experience
              </a>
              <a className="hover:text-slate-950" href="#education">
                Education
              </a>
              <a className="hover:text-slate-950" href="#contact">
                Contact
              </a>
            </nav>
            <div className="flex items-center gap-2">
              {profile.links.github ? (
                <a
                  className="rounded-lg border border-slate-200 bg-white/60 px-3 py-2 text-base text-slate-900 hover:bg-white"
                  href={profile.links.github}
                  target="_blank"
                  rel="noreferrer"
                >
                  GitHub
                </a>
              ) : null}
              <a
                className="rounded-lg bg-sky-600 px-3 py-2 text-base font-medium text-white hover:bg-sky-500"
                href={profile.links.cvPdf}
                target="_blank"
                rel="noreferrer"
              >
                Download CV
              </a>
            </div>
          </div>
        </header>

        <main id="top" className="px-4 pb-14 pt-8 sm:pt-10 md:pb-16 md:pt-12">
          <motion.section
            initial={reduceMotion ? undefined : 'hidden'}
            animate={reduceMotion ? undefined : 'visible'}
            variants={reveal}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="relative"
          >
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-3 py-1 text-sm text-slate-700">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                {profile.location} · Open to opportunities
              </div>

              <h1 className="mt-4 text-balance text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
                <span className="bg-gradient-to-r from-slate-950 to-slate-600 bg-clip-text text-transparent">
                  {profile.headline}
                </span>
              </h1>
              <p className="mt-5 max-w-2xl text-pretty text-base leading-relaxed text-slate-700 sm:text-lg">
                {profile.summary}
              </p>
            </div>

            {profile.photo ? (
              <div className="shrink-0 self-start md:self-center">
                <div className="relative h-36 w-36 overflow-hidden rounded-full border border-slate-200 bg-white/70 shadow-sm md:h-44 md:w-44">
                  <div className="absolute inset-0 flex items-center justify-center text-3xl font-semibold tracking-tight text-slate-700 md:text-4xl">
                    {initials}
                  </div>
                  <img
                    src={profile.photo}
                    alt={profile.name}
                    className="relative h-full w-full object-cover"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.style.opacity = '0'
                    }}
                  />
                </div>
              </div>
            ) : null}
          </div>

          <div className="mt-7 flex flex-wrap gap-3">
            <a
              className="rounded-xl bg-slate-900 px-4 py-2.5 text-base font-medium text-white hover:bg-slate-800"
              href="#projects"
            >
              View Projects
            </a>
            <a
              className="rounded-xl border border-slate-200 bg-white/60 px-4 py-2.5 text-base font-medium text-slate-900 hover:bg-white"
              href={profile.links.linkedin}
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn
            </a>
            <a
              className="rounded-xl border border-slate-200 bg-white/60 px-4 py-2.5 text-base font-medium text-slate-900 hover:bg-white"
              href={`mailto:${profile.email}`}
            >
              Email Me
            </a>
          </div>

          <div className="mt-10 flex flex-wrap gap-2">
            {profile.stackHighlights.map((item) => (
              <span
                key={item}
                className="rounded-full border border-slate-200 bg-white/70 px-3 py-1 text-sm text-slate-700"
              >
                {item}
              </span>
            ))}
          </div>
          </motion.section>

        <Section id="about" title="About">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="md:col-span-2">
              <p className="text-slate-700 leading-relaxed">{profile.summary}</p>
              <p className="mt-4 text-slate-700 leading-relaxed">{profile.about}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white/60 p-5">
              <div className="text-base font-semibold text-slate-900">Personal Data</div>
              <dl className="mt-3 space-y-2 text-base">
                <div className="flex justify-between gap-3">
                  <dt className="text-slate-500">Birth</dt>
                  <dd className="text-slate-900 text-right">{profile.personalData.placeAndDateOfBirth}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-slate-500">Gender</dt>
                  <dd className="text-slate-900">{profile.personalData.gender}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-slate-500">Status</dt>
                  <dd className="text-slate-900">{profile.personalData.status}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-slate-500">Citizenship</dt>
                  <dd className="text-slate-900">{profile.personalData.citizenship}</dd>
                </div>
              </dl>
            </div>
          </div>
        </Section>

        <Section id="skills" title="Skills">
          <div className="grid gap-4 md:grid-cols-2">
            {profile.skills.map((group) => (
              <div key={group.title} className="rounded-2xl border border-slate-200 bg-white/60 p-5">
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
        </Section>

        <Section id="projects" title="Projects">
          <div className="grid gap-4 md:grid-cols-2">
            {profile.projects.map((project) => (
              <motion.article
                key={project.name}
                initial={reduceMotion ? undefined : { opacity: 0, y: 12 }}
                whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="group rounded-2xl border border-slate-200 bg-white/60 p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-lg font-semibold text-slate-900">{project.name}</div>
                    <div className="mt-1 text-base text-slate-700">{project.description}</div>
                  </div>
                  {project.link ? (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-lg border border-slate-200 bg-white/60 px-3 py-2 text-base text-slate-900 hover:bg-white"
                    >
                      {project.link.includes('github.com') ? 'Repo' : 'Live'}
                    </a>
                  ) : null}
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.tech.map((t) => (
                    <span
                      key={t}
                      className={classNames(
                        'rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-sm text-slate-700',
                      )}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </motion.article>
            ))}
          </div>
        </Section>

        <Section id="experience" title="Experience">
          <div className="grid gap-4">
            {profile.experience.map((exp) => (
              <motion.div
                key={exp.company + exp.role}
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
        </Section>

        <Section id="education" title="Education">
          <div className="grid gap-3">
            {profile.education.map((edu) => (
              <div key={edu.school} className="rounded-2xl border border-slate-200 bg-white/60 p-5">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <div className="text-base font-semibold text-slate-900">{edu.school}</div>
                  <div className="text-sm text-slate-500">{edu.period}</div>
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section id="contact" title="Contact">
          <div className="rounded-2xl border border-slate-200 bg-white/60 p-6">
            <div className="text-slate-700">Want to build something together?</div>
            <div className="mt-4 flex flex-wrap gap-3">
              <a
                className="rounded-xl bg-sky-600 px-4 py-2.5 text-base font-medium text-white hover:bg-sky-500"
                href={`mailto:${profile.email}`}
              >
                Email: {profile.email}
              </a>
              <a
                className="rounded-xl border border-slate-200 bg-white/60 px-4 py-2.5 text-base font-medium text-slate-900 hover:bg-white"
                href={`tel:${profile.phone}`}
              >
                Phone: {profile.phone}
              </a>
              <a
                className="rounded-xl border border-slate-200 bg-white/60 px-4 py-2.5 text-base font-medium text-slate-900 hover:bg-white"
                href={profile.links.linkedin}
                target="_blank"
                rel="noreferrer"
              >
                LinkedIn
              </a>
              {profile.links.instagram ? (
                <a
                  className="rounded-xl border border-slate-200 bg-white/60 px-4 py-2.5 text-base font-medium text-slate-900 hover:bg-white"
                  href={profile.links.instagram}
                  target="_blank"
                  rel="noreferrer"
                >
                  Instagram
                </a>
              ) : null}
              {profile.links.github ? (
                <a
                  className="rounded-xl border border-slate-200 bg-white/60 px-4 py-2.5 text-base font-medium text-slate-900 hover:bg-white"
                  href={profile.links.github}
                  target="_blank"
                  rel="noreferrer"
                >
                  GitHub
                </a>
              ) : null}
            </div>
          </div>
        </Section>

          <footer className="mt-14 text-center text-sm text-slate-500">
            © {new Date().getFullYear()} {profile.name}. Built with React + Vite.
          </footer>
        </main>
      </div>
    </div>
  )
}

function Section({
  id,
  title,
  children,
}: {
  id: string
  title: string
  children: React.ReactNode
}) {
  const reduceMotion = useReducedMotion()
  return (
    <motion.section
      id={id}
      initial={reduceMotion ? undefined : { opacity: 0, y: 14 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="scroll-mt-20 mt-10 md:scroll-mt-24 md:mt-14"
    >
      <div className="mb-4 flex items-center gap-3 md:mb-5">
        <div className="h-px flex-1 bg-slate-200" />
        <h2 className="text-base font-semibold tracking-wide text-slate-900">{title}</h2>
        <div className="h-px flex-1 bg-slate-200" />
      </div>
      {children}
    </motion.section>
  )
}

export default App
