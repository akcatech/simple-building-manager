'use client'

import { useEffect, useState } from 'react'
import { collection, query, orderBy, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Container, Typography, Divider, Grid2, Card, CardContent, CardHeader } from '@mui/material'
import { useTranslations } from 'next-intl'

export default function AnnouncementsList() {
  const t = useTranslations('Announcement')
  const [announcements, setAnnouncements] = useState([])

  useEffect(() => {
    const fetchAnnouncements = async () => {
      const q = query(collection(db, 'announcements'), orderBy('date', 'desc'))
      const querySnapshot = await getDocs(q)
      const announcementsList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setAnnouncements(announcementsList)
    }

    fetchAnnouncements()
  }, [])

  return (
    <Container maxWidth='md'>
      <Typography variant='h4' component='h1' gutterBottom>
        {t('title')}
      </Typography>
      <Grid2 container spacing={3} sx={{ width: '100%' }}>
        {announcements.map(announcement => (
          <Grid2 item xs={12} key={announcement.id} sx={{ width: '100%' }}>
            <Card sx={{ width: '100%' }}>
              <CardHeader
                title={
                  <Typography variant='h6' component='div'>
                    {announcement.title}
                  </Typography>
                }
              ></CardHeader>
              <CardContent>
                <Typography color='textSecondary' variant='body2'>
                  {t('date')}: {announcement.date} - {t('createdBy')}: {announcement.createdBy}
                </Typography>
                <Typography variant='body2' color='textSecondary' sx={{ mt: 4 }}>
                  {announcement.content}
                </Typography>
              </CardContent>
              <Divider />
            </Card>
          </Grid2>
        ))}
      </Grid2>
    </Container>
  )
}
