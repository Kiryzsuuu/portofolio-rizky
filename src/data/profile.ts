export const profile = {
  name: 'Rizky Fadhillah',
  headline: 'Undergraduate IT Student, AI Engineer, Web Developer, Cloud & DevOps Enthusiast',
  location: 'Depok, Jawa Barat',
  photo: '/profile.jpg',
  email: 'maskiryz23@gmail.com',
  phone: '081296502240',
  summary:
    "I'm Rizky Fadhillah, a student of the Information Technology Study Program at Telkom University with strong enthusiasm for exploring technology. I'm always open to learning new things both independently and collaboratively, and highly motivated to broaden my horizons and enhance my skills in system development, networking, and other digital technologies.",
  about:
    "I also have professional experience as an AI Engineer Intern at SoftwareOne Indonesia, where I worked on an Interactive Call Agent project and gained hands-on experience applying artificial intelligence solutions to real-world business needs.",
  personalData: {
    placeAndDateOfBirth: 'Depok, 23 Februari 2005',
    gender: 'Male',
    status: 'Single',
    citizenship: 'Indonesia',
  },
  currentFocus: ['Artificial Intelligence', 'Cloud Computing (Azure/AWS)', 'DevOps', 'System Development'],
  stackHighlights: ['Artificial Intelligence', 'Microsoft Azure', 'AWS', 'Azure DevOps', 'Azure Cosmos DB', 'Technical Support'],
  skills: [
    {
      title: 'AI',
      items: ['Artificial Intelligence (AI)'],
    },
    {
      title: 'Cloud & DevOps',
      items: ['Microsoft Azure', 'Amazon Web Service (AWS)', 'Azure DevOps Services', 'Azure Cosmos DB'],
    },
    {
      title: 'Other',
      items: ['Technical Support', 'Mobile Application Design', 'Networking (learning)'],
    },
  ],
  projects: [
    {
      name: 'CineWave — Streaming Platform',
      description:
        'Netflix-style streaming platform with authentication, movie catalog, watchlist, and interactive UI, deployed on Azure App Service.',
      tech: ['Laravel', 'PHP', 'Blade', 'Tailwind CSS', 'Alpine.js', 'Vite', 'MongoDB'],
      link: 'https://github.com/Kiryzsuuu/CineWave',
    },
    {
      name: 'Cinemox — Cinema Booking System',
      description:
        'Full-featured cinema booking web app with OTP email verification, JWT auth, seat booking, email confirmation (barcode/QR), and admin dashboard.',
      tech: [
        'Java',
        'Spring Boot',
        'Spring Security (JWT)',
        'MongoDB',
        'Spring Mail',
        'ZXing',
        'HTML/CSS/JavaScript',
        'Chart.js',
      ],
      link: 'https://github.com/kiryzsuuu/cinemox',
    },
    {
      name: 'CStress — Stress Consultation + Face Tracking',
      description:
        'Non-medical early consultation chat for stress level with topic/summary insights, connected with real-time local face tracking.',
      tech: [
        'React',
        'TypeScript',
        'Vite',
        'FastAPI',
        'OpenCV',
        'MediaPipe',
        'SSE Streaming',
        'WebSocket',
        'OpenAI API',
      ],
      link: 'https://github.com/kiryzsuuu/cstress',
    },
    {
      name: 'Interactive Call Agent — SoftwareOne Indonesia',
      description:
        'Interactive voice AI agent integrated with WhatsApp Business API and Microsoft Bookings, including PDF menu upload + OCR and a monitoring dashboard.',
      tech: [
        'LiveKit Agents',
        'OpenAI Realtime API',
        'Python',
        'FastAPI',
        'Next.js',
        'TypeScript',
        'WhatsApp Business API',
        'Microsoft Graph Bookings API',
        'OCR (Tesseract)',
      ],
      link: 'https://github.com/Kiryzsuuu/Call-Agent',
    },
    {
      name: 'Portfolio Website',
      description: 'My personal portfolio website built with modern web tooling and smooth UI motion.',
      tech: ['React', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Vite'],
      link: 'https://github.com/Kiryzsuuu/portofolio-rizky',
    },
    {
      name: 'Digital Transformation in Aviation Education — PPI Curug',
      description: 'Project focused on digital transformation in aviation education.',
      tech: ['Digital Transformation'],
      link: '',
    },
    {
      name: 'Village and UMKM Website Development — Cikasungka Village',
      description: 'Website development project for village and UMKM needs.',
      tech: ['Web Development'],
      link: '',
    },
  ],
  experience: [
    {
      role: 'AI Engineer Intern',
      company: 'SoftwareOne Indonesia',
      period: '2025',
      highlights: [
        'Worked on an Interactive Call Agent project.',
        'Applied AI solutions to real-world business needs.',
        'Gained hands-on experience in practical AI implementation.',
      ],
    },
  ],
  education: [
    {
      school: 'S1 Telkom University',
      period: '2023 — Present',
    },
    {
      school: 'SMA Al-Azhar 19 Ciracas',
      period: '2020 — 2023',
    },
    {
      school: 'MTS PKP JIS',
      period: '2017 — 2020',
    },
    {
      school: 'SD Negeri Mekarsari 2',
      period: '2011 — 2017',
    },
  ],
  links: {
    github: 'https://github.com/Kiryzsuuu/portofolio-rizky',
    linkedin: 'https://www.linkedin.com/in/rizky-fadhillah-7646b7349',
    instagram: 'https://instagram.com/kiryz_su',
    cvPdf: '/cv-rizky-fadhillah.pdf',
  },
} as const
