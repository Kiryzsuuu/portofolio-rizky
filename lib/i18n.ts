export type Lang = 'en' | 'id'

export type Localized = { en: string; id: string }

export function tr(value: Localized | string, lang: Lang): string {
  return typeof value === 'string' ? value : value[lang]
}

export const ui = {
  nav: {
    home: { en: 'Home', id: 'Beranda' },
    about: { en: 'About', id: 'Tentang' },
    skills: { en: 'Skills', id: 'Keahlian' },
    projects: { en: 'Projects', id: 'Proyek' },
    experience: { en: 'Experience', id: 'Pengalaman' },
    education: { en: 'Education', id: 'Pendidikan' },
    contact: { en: 'Contact', id: 'Kontak' },
  },
  badge: {
    open: { en: 'Open to opportunities', id: 'Terbuka untuk peluang' },
  },
  actions: {
    downloadCv: { en: 'Download CV', id: 'Unduh CV' },
    viewProjects: { en: 'View Projects', id: 'Lihat Proyek' },
    email: { en: 'Email', id: 'Email' },
    repo: { en: 'Repo', id: 'Repo' },
    live: { en: 'Live', id: 'Live' },
    preview: { en: 'Preview', id: 'Pratinjau' },
    viewDetails: { en: 'View details', id: 'Lihat detail' },
    backToProjects: { en: 'Back to projects', id: 'Kembali ke proyek' },
  },
  project: {
    overview: { en: 'Overview', id: 'Ringkasan' },
    goal: { en: 'Goal', id: 'Tujuan' },
    duration: { en: 'Build time', id: 'Lama pengerjaan' },
    role: { en: 'Role', id: 'Peran' },
    year: { en: 'Year', id: 'Tahun' },
    techStack: { en: 'Tech stack', id: 'Teknologi' },
    gallery: { en: 'Gallery', id: 'Galeri' },
  },
  personal: {
    title: { en: 'Personal Data', id: 'Data Pribadi' },
    birth: { en: 'Birth', id: 'Kelahiran' },
    gender: { en: 'Gender', id: 'Jenis Kelamin' },
    status: { en: 'Status', id: 'Status' },
    citizenship: { en: 'Citizenship', id: 'Kewarganegaraan' },
  },
  values: {
    Male: { en: 'Male', id: 'Laki-laki' },
    Single: { en: 'Single', id: 'Lajang' },
    Indonesia: { en: 'Indonesia', id: 'Indonesia' },
  } as Record<string, Localized>,
  contact: {
    heading: {
      en: 'Want to build something together?',
      id: 'Ingin membangun sesuatu bersama?',
    },
    formName: { en: 'Name', id: 'Nama' },
    formEmail: { en: 'Email', id: 'Email' },
    formMessage: { en: 'Message', id: 'Pesan' },
    formNamePh: { en: 'Your name', id: 'Nama kamu' },
    formEmailPh: { en: 'you@example.com', id: 'kamu@contoh.com' },
    formMessagePh: {
      en: 'Tell me about your project or idea...',
      id: 'Ceritakan tentang proyek atau idemu...',
    },
    send: { en: 'Send message', id: 'Kirim pesan' },
    sent: {
      en: 'Opening your email app...',
      id: 'Membuka aplikasi email kamu...',
    },
    or: { en: 'or reach me directly', id: 'atau hubungi langsung' },
  },
  footer: {
    built: { en: 'Built with React + Vite.', id: 'Dibuat dengan React + Vite.' },
  },
} as const
