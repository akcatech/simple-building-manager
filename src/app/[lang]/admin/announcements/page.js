'use client'

import { useState, useEffect } from 'react'
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Divider
} from '@mui/material'
import { collection, addDoc, query, getDocs, deleteDoc, doc, orderBy } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useAuth } from '@/hooks/useAuth'
import { Delete as DeleteIcon } from '@mui/icons-material'
import { useTranslations } from 'next-intl'
import { notify } from '@/util/utility'

export default function AddAndListAnnouncements() {
  const { user } = useAuth()
  const t = useTranslations('AnnouncementManagement')
  const m = useTranslations('Messages')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [date, setDate] = useState('')
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

  const handleSubmit = async e => {
    e.preventDefault()

    if (!title || !content || !date) {
      notify(m('fillAllFields'), 'error')
      return
    }

    try {
      await addDoc(collection(db, 'announcements'), {
        title,
        content,
        date,
        createdBy: user.email,
        createdAt: new Date()
      })

      setAnnouncements(prev => [{ title, content, date, createdBy: user.email, id: Math.random() }, ...prev])
      setTitle('')
      setContent('')
      setDate('')
    } catch (error) {
      console.error(m('genericError'), error)
    }
  }

  const handleDelete = async id => {
    try {
      await deleteDoc(doc(db, 'announcements', id))
      setAnnouncements(announcements.filter(announcement => announcement.id !== id))
    } catch (error) {
      console.error(m('genericError'), error)
    }
  }

  return (
    <Container maxWidth='sm'>
      <Typography variant='h4' component='h1' gutterBottom>
        {t('announcementManagement')}
      </Typography>

      <Box component='form' onSubmit={handleSubmit} mb={4}>
        <TextField
          label={t('title')}
          fullWidth
          margin='normal'
          slotProps={{ inputLabel: { shrink: true } }}
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <TextField
          label={t('content')}
          fullWidth
          margin='normal'
          multiline
          slotProps={{ inputLabel: { shrink: true } }}
          rows={4}
          value={content}
          onChange={e => setContent(e.target.value)}
        />
        <TextField
          label={t('date')}
          type='date'
          fullWidth
          margin='normal'
          slotProps={{ inputLabel: { shrink: true } }}
          value={date}
          onChange={e => setDate(e.target.value)}
        />
        <Button type='submit' variant='contained' color='primary' fullWidth>
          {t('addAnnouncement')}
        </Button>
      </Box>

      <Typography variant='h5' component='h2' gutterBottom>
        {t('previousAnnouncements')}
      </Typography>
      <List>
        {announcements.map(announcement => (
          <div key={announcement.id}>
            <ListItem>
              <ListItemText
                primary={announcement.title}
                secondary={`${t('date')} ${announcement.date} - ${t('createdBy')}: ${announcement.createdBy}`}
              />
              <IconButton edge='end' aria-label='delete' onClick={() => handleDelete(announcement.id)}>
                <DeleteIcon />
              </IconButton>
            </ListItem>
            <Typography variant='body2' color='textSecondary'>
              {announcement.content}
            </Typography>
            <Divider />
          </div>
        ))}
      </List>
    </Container>
  )
}
