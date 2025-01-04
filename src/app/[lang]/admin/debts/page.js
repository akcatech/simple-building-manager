'use client'

import { useState, useEffect } from 'react'
import { collection, getDocs, addDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useAuth } from '@/hooks/useAuth'
import {
  Container,
  Typography,
  TextField,
  Button,
  MenuItem,
  Tab,
  Tabs,
  Box,
  Card,
  CardContent,
  Grid2
} from '@mui/material'

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { useRouter, usePathname } from 'next/navigation'
import dayjs from 'dayjs'
import 'dayjs/locale/tr'
import Spinner from '@/app/components/Spinner'
import { useTranslations } from 'next-intl'
import { notify } from '@/util/utility'

export default function AdminDebts() {
  const t = useTranslations('DebtManagement')
  const m = useTranslations('Messages')
  const { user, loading } = useAuth()
  const [debts, setDebts] = useState([])
  const [users, setUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [newDebt, setNewDebt] = useState({
    userId: '',
    amount: '',
    month: dayjs()
  })
  const [tabIndex, setTabIndex] = useState(0)
  const [searchTerm, setSearchTerm] = useState({ method: '', value: '' })
  const router = useRouter()
  const pathname = usePathname()
  const currentLang = pathname.split('/')[1]

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      router.push('/')
      return
    }

    const fetchDebtsAndUsers = async () => {
      if (user && user.role === 'admin') {
        const querySnapshot = await getDocs(collection(db, 'debts'))
        setDebts(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))

        const usersSnapshot = await getDocs(collection(db, 'users'))
        setUsers(usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))
      }
    }

    fetchDebtsAndUsers()
  }, [user, loading, router])

  useEffect(() => {
    if (currentLang === 'tr') {
      dayjs.locale('tr')
    } else {
      dayjs.locale('en')
    }
  }, [currentLang])

  const handleAddDebt = async e => {
    e.preventDefault()
    if (!newDebt.userId || !newDebt.amount) {
      notify(m('fillAllFields'), 'error')
      return
    }
    if (user && user.role === 'admin') {
      await addDoc(collection(db, 'debts'), {
        ...newDebt,
        month: newDebt.month.format('YYYY-MM')
      })
      setNewDebt({ userId: '', amount: '', month: dayjs() })
    }
  }

  const handleChange = e => {
    const { name, value } = e.target
    setNewDebt({ ...newDebt, [name]: value })
  }

  const handleTabChange = (event, newIndex) => {
    setTabIndex(newIndex)
  }

  const handleUserSelection = (method, value) => {
    setSearchTerm({ method, value })
    const foundUser = users.find(user => {
      if (method === 'email') {
        return user.email === value
      } else if (method === 'apartmentNumber') {
        return user.apartmentNo === value
      }
      return false
    })
    setSelectedUser(foundUser || null)
  }

  const filteredDebts = debts.filter(debt => debt.userId === selectedUser?.id)

  if (loading) return <Spinner />
  if (!user || user.role !== 'admin') return null

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Container>
        <Typography variant='h4' component='h1' gutterBottom>
          {t('debtManagement')}
        </Typography>

        <Tabs value={tabIndex} onChange={handleTabChange}>
          <Tab label={t('addDebt')} />
          <Tab label={t('listDebt')} />
        </Tabs>

        <Grid2 container spacing={2}>
          <Box hidden={tabIndex !== 0}>
            <form onSubmit={handleAddDebt} style={{ marginBottom: '2rem' }}>
              <TextField
                select
                label={t('user')}
                name='userId'
                value={newDebt.userId}
                onChange={handleChange}
                fullWidth
                margin='normal'
              >
                {users.map(u => (
                  <MenuItem key={u.id} value={u.id}>
                    {u.email}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label={t('amount')}
                name='amount'
                value={newDebt.amount}
                onChange={handleChange}
                fullWidth
                margin='normal'
                type='number'
              />
              <DatePicker
                sx={{ mt: 2 }}
                label={t('date')}
                views={['year', 'month']}
                value={newDebt.month}
                onChange={newValue => setNewDebt({ ...newDebt, month: newValue })}
                fullWidth
                renderInput={params => <TextField {...params} margin='normal' />}
              />
              <Grid2 item>
                <Button type='submit' variant='contained' color='primary' style={{ marginTop: '1rem' }}>
                  {t('addDebt')}
                </Button>
              </Grid2>
            </form>
          </Box>
        </Grid2>

        <Box hidden={tabIndex !== 1}>
          <Typography variant='h6' gutterBottom>
            {t('selectUser')}
          </Typography>
          <TextField
            select
            label={t('userSearchMode')}
            value={searchTerm.method}
            onChange={e => handleUserSelection(e.target.value, searchTerm.value)}
            fullWidth
            margin='normal'
          >
            <MenuItem value='email'>{t('userSearchModeEmail')}</MenuItem>
            <MenuItem value='apartmentNumber'>{t('userSearchModeDoorNumber')}</MenuItem>
          </TextField>

          <TextField
            label={t('searchTerm')}
            value={searchTerm.value}
            onChange={e => handleUserSelection(searchTerm.method, e.target.value)}
            fullWidth
            margin='normal'
            disabled={!searchTerm.method}
          />

          <Grid2 container spacing={2}>
            {filteredDebts.map(debt => (
              <Grid2 item xs={12} sm={6} md={4} key={debt.id}>
                <Card>
                  <CardContent>
                    <Typography variant='h6'>{selectedUser?.email}</Typography>
                    <Typography variant='body1'>
                      {t('doorNumber')}: {selectedUser?.apartmentNo}
                    </Typography>
                    <Typography variant='body1'>
                      {t('debt')}: {debt.amount} TL
                    </Typography>
                    <Typography variant='body1'>
                      {t('date')}: {debt.month}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid2>
            ))}
          </Grid2>
        </Box>
      </Container>
    </LocalizationProvider>
  )
}
