'use client'

import { Typography, Card, CardContent, Grid2, Container } from '@mui/material'
import { useAuth } from '@/hooks/useAuth'
import config from '@/config/config'
import { useTranslations } from 'next-intl'

export default function Home() {
  const { user } = useAuth()
  const t = useTranslations('Dashboard')

  return (
    <Container maxWidth='md'>
      <Grid2 container spacing={3}>
        <Grid2 item xs={12}>
          <Card sx={{ width: '100%', mb: 3 }}>
            <CardContent>
              <Typography variant='h4' component='h1' gutterBottom>
                {t('welcome', { name: user?.email })}
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
