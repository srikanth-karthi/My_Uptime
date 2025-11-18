import { MaintenanceConfig, PageConfig, WorkerConfig } from './types/config'

const pageConfig: PageConfig = {
  title: "My Status Page",
  links: [
    { link: 'https://github.com/srikanth-karthi', label: 'Github' },
    { link: 'https://www.linkedin.com/in/srikanth-karthikeyan/', label: 'LinkedIn' },

  ],
  group: {
    '🌐 Public': [
      'portfolio_site',
      'ai_portfolio',
      'blogs_health',
      'links_site',
      'notes_site',
      'terminal_site',
      'art_site',
    ],
  },
}

const workerConfig: WorkerConfig = {
  kvWriteCooldownMinutes: 300,
  monitors: [
        {
      id: 'portfolio_site',
      name: 'Portfolio',
      method: 'GET',
      target: 'https://srikanthkarthi.tech/',
      expectedCodes: [200],
      timeout: 3000,
      statusPageLink: 'https://srikanthkarthi.tech/',
    },
    {
      id: 'ai_portfolio',
      name: 'AI Portfolio',
      method: 'GET',
      target: 'https://ai.srikanthkarthi.tech/',
      expectedCodes: [200],
      timeout: 3000,
      statusPageLink: 'https://ai.srikanthkarthi.tech/',
    },
    {
      id: 'blogs_health',
      name: 'Blogs',
      method: 'GET',
      target: 'https://blogs.srikanthkarthi.tech/api/health',
      expectedCodes: [200],
      timeout: 3000,
      statusPageLink: 'https://blogs.srikanthkarthi.tech/api/health',
    },
    {
      id: 'links_site',
      name: 'Links',
      method: 'GET',
      target: 'https://links.srikanthkarthi.tech/',
      expectedCodes: [200],
      timeout: 3000,
      statusPageLink: 'https://links.srikanthkarthi.tech/',
    },
    {
      id: 'notes_site',
      name: 'Notes',
      method: 'GET',
      target: 'https://notes.srikanthkarthi.tech/',
      expectedCodes: [200],
      timeout: 3000,
      statusPageLink: 'https://notes.srikanthkarthi.tech/',
    },
    {
      id: 'terminal_site',
      name: 'Shell',
      method: 'GET',
      target: 'https://terminal.srikanthkarthi.tech/',
      expectedCodes: [200],
      timeout: 3000,
      statusPageLink: 'https://terminal.srikanthkarthi.tech/',
    },
     {
      id: 'art_site',
      name: 'Art',
      method: 'GET',
      target: 'https://art.srikanthkarthi.tech/',
      expectedCodes: [200],
      timeout: 3000,
      statusPageLink: 'https://art.srikanthkarthi.tech/',
    },
    

  ],
  notification: {
    appriseApiServer: 'https://apprise.example.com/notify',
    recipientUrl: 'tgram://bottoken/ChatID',
    timeZone: 'Asia/Kolkata',
    gracePeriod: 5,
  },
  callbacks: {
    onStatusChange: async (
      env: any,
      monitor: any,
      isUp: boolean,
      timeIncidentStart: number,
      timeNow: number,
      reason: string
    ) => {
      
    },
    onIncident: async (
      env: any,
      monitor: any,
      timeIncidentStart: number,
      timeNow: number,
      reason: string
    ) => {
      
    },
  },
}

const maintenances: MaintenanceConfig[] = [
  
  {
    monitors: ['ai_portfolio'],
    title: 'Planned Maintenance',
    body: 'Performing updates on AI Portfolio',
   start: '2025-09-14T21:00:00+05:30',
end:   '2025-09-15T21:00:00+05:30',

    color: 'yellow',
  },
]

export { pageConfig, workerConfig, maintenances }
