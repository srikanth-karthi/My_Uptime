import { MaintenanceConfig, PageConfig, WorkerConfig } from './types/config'

const pageConfig: PageConfig = {
  title: "My Status Page",
  links: [
    { link: 'https://ai.srikanth.fun/', label: 'AI Portfolio' },
    { link: 'https://blogs.srikanth.fun/api/health', label: 'Blogs' },
    { link: 'https://links.srikanth.fun/', label: 'Links' },
    { link: 'https://notes.srikanth.fun/', label: 'Notes' },
    { link: 'https://srikanth.fun/', label: 'Portfolio' },
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
  kvWriteCooldownMinutes: 3,
  monitors: [
    {
      id: 'ai_portfolio',
      name: 'AI Portfolio',
      method: 'GET',
      target: 'https://ai.srikanth.fun/',
      expectedCodes: [200],
      timeout: 10000,
      statusPageLink: 'https://ai.srikanth.fun/',
    },
    {
      id: 'blogs_health',
      name: 'Blogs Health Endpoint',
      method: 'GET',
      target: 'https://blogs.srikanth.fun/api/health',
      expectedCodes: [200],
      timeout: 10000,
      statusPageLink: 'https://blogs.srikanth.fun/api/health',
    },
    {
      id: 'links_site',
      name: 'Links Site',
      method: 'GET',
      target: 'https://links.srikanth.fun/',
      expectedCodes: [200],
      timeout: 10000,
      statusPageLink: 'https://links.srikanth.fun/',
    },
    {
      id: 'notes_site',
      name: 'Notes Site',
      method: 'GET',
      target: 'https://notes.srikanth.fun/',
      expectedCodes: [200],
      timeout: 10000,
      statusPageLink: 'https://notes.srikanth.fun/',
    },
    {
      id: 'portfolio_site',
      name: 'Portfolio Site',
      method: 'GET',
      target: 'https://srikanth.fun/',
      expectedCodes: [200],
      timeout: 10000,
      statusPageLink: 'https://srikanth.fun/',
    },
  ],
  notification: {
    // Example setup: replace with your Apprise API or notification config
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
      // Add your custom code for status change here if needed
    },
    onIncident: async (
      env: any,
      monitor: any,
      timeIncidentStart: number,
      timeNow: number,
      reason: string
    ) => {
      // Add your custom code for ongoing incident here if needed
    },
  },
}

const maintenances: MaintenanceConfig[] = [
  
  // {
  //   monitors: ['ai_portfolio', 'blogs_health'],
  //   title: 'Planned Maintenance',
  //   body: 'Performing updates on AI Portfolio and Blogs services',
  //   start: '2025-09-10T00:00:00+05:30',
  //   end: '2025-09-10T04:00:00+05:30',
  //   color: 'yellow',
  // },
]

export { pageConfig, workerConfig, maintenances }
