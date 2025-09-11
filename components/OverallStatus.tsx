import { MaintenanceConfig, MonitorTarget } from '@/types/config'
import { Center, Container, Title } from '@mantine/core'
import { IconCircleCheck, IconAlertCircle } from '@tabler/icons-react'
import { useEffect, useState } from 'react'
import MaintenanceAlert from './MaintenanceAlert'
import { pageConfig } from '@/uptime.config'

function useWindowVisibility() {
  const [isVisible, setIsVisible] = useState(true)
  useEffect(() => {
    const handleVisibilityChange = () => setIsVisible(document.visibilityState === 'visible')
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [])
  return isVisible
}

export default function OverallStatus({
  state,
  maintenances,
  monitors,
}: {
  state: { overallUp: number; overallDown: number; lastUpdate: number }
  maintenances: MaintenanceConfig[]
  monitors: MonitorTarget[]
}) {
  let group = pageConfig.group
  let groupedMonitor = (group && Object.keys(group).length > 0) || false

  let statusString = ''
  let icon = <IconAlertCircle style={{ width: 80, height: 80, color: '#dc2626', strokeWidth: 1.5 }} />
  if (state.overallUp === 0 && state.overallDown === 0) {
    statusString = 'No data yet'
  } else if (state.overallUp === 0) {
    statusString = 'All systems not operational'
  } else if (state.overallDown === 0) {
    statusString = 'All systems operational'
    icon = <IconCircleCheck style={{ width: 80, height: 80, color: '#16a34a', strokeWidth: 1.5 }} />
  } else {
    statusString = `Some systems not operational (${state.overallDown} out of ${
      state.overallUp + state.overallDown
    })`
  }

  const [openTime] = useState(Math.round(Date.now() / 1000))
  const [currentTime, setCurrentTime] = useState(Math.round(Date.now() / 1000))
  const isWindowVisible = useWindowVisibility()

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isWindowVisible) return
      if (currentTime - state.lastUpdate > 300 && currentTime - openTime > 30) {
        window.location.reload()
      }
      setCurrentTime(Math.round(Date.now() / 1000))
    }, 1000)
    return () => clearInterval(interval)
  })

  const now = new Date()
  let filteredMaintenances: (Omit<MaintenanceConfig, 'monitors'> & { monitors?: MonitorTarget[] })[] =
    maintenances
      .filter((m) => now >= new Date(m.start) && (!m.end || now <= new Date(m.end)))
      .map((maintenance) => ({
        ...maintenance,
        monitors: maintenance.monitors?.map(
          (monitorId) => monitors.find((mon) => monitorId === mon.id)!
        ),
      }))

  return (
    <Container size="md" mt="xl" px="md">
      <Center mb="xl" style={{ padding: '2rem 0' }}>
        <div style={{ 
          padding: '1.5rem', 
          borderRadius: '50%', 
          backgroundColor: state.overallDown === 0 ? 'rgba(22, 163, 74, 0.1)' : 'rgba(220, 38, 38, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {icon}
        </div>
      </Center>
      <Title 
        style={{ 
          textAlign: 'center',
          fontSize: 'clamp(1.75rem, 5vw, 3rem)',
          marginBottom: '1.5rem',
          fontWeight: 600,
          letterSpacing: '-0.02em'
        }} 
        order={1}
      >
        {statusString}
      </Title>
      <Title 
        style={{ 
          textAlign: 'center', 
          color: '#6b7280',
          fontSize: 'clamp(0.875rem, 2.5vw, 1.125rem)',
          fontWeight: 400,
          marginBottom: '2rem'
        }} 
        order={5}
      >
        Last updated on:{' '}
        {`${new Date(state.lastUpdate * 1000).toLocaleString()} (${
          currentTime - state.lastUpdate
        } sec ago)`}
      </Title>

      {filteredMaintenances.map((maintenance, idx) => (
        <MaintenanceAlert
          key={idx}
          maintenance={maintenance}
          style={{ maxWidth: groupedMonitor ? '897px' : '865px' }}
        />
      ))}
    </Container>
  )
}
