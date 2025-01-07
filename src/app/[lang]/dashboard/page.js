'use client'

import { Grid2, Typography, Card, CardContent, Container } from '@mui/material'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { useEffect } from 'react'
import { useTranslations } from 'next-intl'
import config from '@/config/config'

export default function Dashboard() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const t = useTranslations('Dashboard')

  useEffect(() => {
    if (!loading && !user) {
      router.push('/tr/login')
    }
  }, [loading, user, router])

  if (loading) {
    return <Typography>Loading...</Typography>
  }

  if (!user) {
    return null
  }

  return (
    <Container maxWidth='md'>
      <Grid2 container spacing={3}>
        <Grid2 item xs={12}>
          <Card sx={{ width: '100%', mb: 3 }}>
            <CardContent>
              <Typography variant='h4' component='h1' gutterBottom>
                {t('welcome', { name: `${user?.firstName || ''} ${user?.lastName || ''}`.trim() })}
              </Typography>
              <Typography variant='body1'>{t('userMsg', { appName: config.appName })}</Typography>
            </CardContent>
          </Card>
        </Grid2>

        {user?.role === 'admin' && (
          <Grid2 item xs={12}>
            <Card sx={{ width: '100%' }}>
              <CardContent>
                <Typography variant='h5' component='h2' gutterBottom>
                  {t('adminWelcome')}
                </Typography>
                <Typography variant='body1'>{t('adminMsg')}</Typography>
              </CardContent>
            </Card>
          </Grid2>
        )}
      </Grid2>
    </Container>
  )
}
