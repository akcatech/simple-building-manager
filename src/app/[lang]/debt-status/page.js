'use client'
import { useState, useEffect } from 'react'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useAuth } from '@/hooks/useAuth'
import { useTranslations } from 'next-intl'
import Spinner from '@/app/components/Spinner'
import { Container, Typography, List, ListItem, ListItemText, Card, CardContent, Box } from '@mui/material'

export default function DebtStatus() {
  const { user, loading } = useAuth()
  const [debts, setDebts] = useState([])
  const t = useTranslations('DebtStatus')

  useEffect(() => {
    if (!user) return

    const fetchDebts = async () => {
      const q = query(collection(db, 'debts'), where('userId', '==', user.uid))
      const querySnapshot = await getDocs(q)
      setDebts(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))
    }

    fetchDebts()
  }, [user])

  if (loading) return <Spinner />
  if (!user) return <div>Please log in</div>

  const totalDebt = debts.reduce((total, debt) => total + parseFloat(debt.amount), 0)

  return (
    <Container maxWidth='md'>
      <Typography variant='h4' component='h1' gutterBottom>
        {t('debtStatus')}
      </Typography>
      <Typography variant='h5' component='h2' gutterBottom>
        {t('totalDebt')}:
        <Box
          component='span'
          sx={{
            fontSize: '2rem',
            fontWeight: 'bold',
            color: 'error.main',
            ml: 1
          }}
        >
          {t('currencySymbol')}
          {totalDebt}
        </Box>
      </Typography>
      <List sx={{ width: '100%' }}>
        {debts.map(debt => (
          <ListItem key={debt.id} sx={{ width: '100%', p: 0 }}>
            <Card
              variant='outlined'
              sx={{
                width: '100%',
                mb: 2
              }}
            >
              <CardContent>
                <ListItemText primary={debt.month} secondary={`${t('currencySymbol')}${debt.amount}`} />
              </CardContent>
            </Card>
          </ListItem>
        ))}
      </List>
    </Container>
  )
}
