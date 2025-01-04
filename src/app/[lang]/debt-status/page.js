'use client'
import { useState, useEffect } from 'react'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useAuth } from '@/hooks/useAuth'
import { useTranslations } from 'next-intl'
import Spinner from '@/app/components/Spinner'
import { Container, Typography, List, ListItem, ListItemText, Card, CardContent } from '@mui/material'

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
    <Container>
      <Typography variant='h4' component='h1' gutterBottom>
        {t('debtStatus')}
      </Typography>
      <Typography variant='h5' component='h2' gutterBottom>
        {t('totalDebt')}: {t('currencySymbol')}
        {totalDebt}
      </Typography>
      <List>
        {debts.map(debt => (
          <ListItem key={debt.id}>
            <Card variant='outlined' style={{ width: '100%', marginBottom: '1rem' }}>
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
