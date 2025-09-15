import { MaintenanceConfig, PageConfig, WorkerConfig } from './types/config'

const pageConfig: PageConfig = {
  title: "My Status Page",
  links: [
    { link: 'https://github.com/srikanth-karthi', label: 'Github' },
    { link: 'https://www.linkedin.com/in/srikanth-karthikeyan/', label: 'LinkedIn' },

  ],
  group: {
    '🌐 Public': [
      'ai_portfolio',
      'blogs_health',
      'links_site',
      'notes_site',
      'portfolio_site',
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
      target: 'https://srikanth.fun/',
      expectedCodes: [200],
      timeout: 3000,
      statusPageLink: 'https://srikanth.fun/',
    },
    {
      id: 'ai_portfolio',
      name: 'AI Portfolio',
      method: 'GET',
      target: 'https://ai.srikanth.fun/',
      expectedCodes: [200],
      timeout: 3000,
      statusPageLink: 'https://ai.srikanth.fun/',
    },
    {
      id: 'blogs_health',
      name: 'Blogs',
      method: 'GET',
      target: 'https://blogs.srikanth.fun/api/health',
      expectedCodes: [200],
      timeout: 3000,
      statusPageLink: 'https://blogs.srikanth.fun/api/health',
    },
    {
      id: 'links_site',
      name: 'Links',
      method: 'GET',
      target: 'https://links.srikanth.fun/',
      expectedCodes: [200],
      timeout: 3000,
      statusPageLink: 'https://links.srikanth.fun/',
    },
    {
      id: 'notes_site',
      name: 'Notes',
      method: 'GET',
      target: 'https://notes.srikanth.fun/',
      expectedCodes: [200],
      timeout: 3000,
      statusPageLink: 'https://notes.srikanth.fun/',
    },
    {
      id: 'terminal_site',
      name: 'Shell',
      method: 'GET',
      target: 'https://terminal.srikanth.fun/',
      expectedCodes: [200],
      timeout: 3000,
      statusPageLink: 'https://terminal.srikanth.fun/',
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
end:   '2025-09-15T21:00:00+05:30'

    color: 'yellow',
  },
]

export { pageConfig, workerConfig, maintenances }
