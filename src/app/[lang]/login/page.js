'use client'
import { useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { useRouter } from 'next/navigation'
import { auth } from '@/lib/firebase'
import { sendPasswordResetEmail } from 'firebase/auth'
import { useTranslations } from 'next-intl'
import {
  Button,
  TextField,
  Typography,
  Container,
  Alert,
  Card,
  CardContent,
  CardActions,
  Box,
  Link,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material'
import { notify } from '@/util/utility'
import config from '@/config/config'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [resetEmail, setResetEmail] = useState('')
  const router = useRouter()
  const t = useTranslations('Login')

  const handleLogin = async e => {
    e.preventDefault()
    try {
      await signInWithEmailAndPassword(auth, email, password)
      router.push('/')
    } catch (error) {
      console.error('Login error:', error)
      setError(t('loginError'))
    }
  }

  const handleDialogSubmit = async () => {
    if (!resetEmail || !/\S+@\S+\.\S+/.test(resetEmail)) {
      notify(m('incorrectEmail'), 'error')
      return
    }
    try {
      await sendPasswordResetEmail(auth, resetEmail)
      setDialogOpen(false)
      notify(t('resetSuccess'), 'success')
    } catch (error) {
      console.error('Password reset error:', error)
      notify('Password reset error', 'error')
    }
  }

  return (
    <Container
      maxWidth='xs'
      sx={{
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        minHeight: '100vh',
        flexDirection: 'column',
        paddingTop: 8
      }}
    >
      <Typography variant='h5' align='center' gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
        {config.appName}
      </Typography>
      <Card sx={{ width: '100%', boxShadow: 3, borderRadius: 2 }}>
        <CardContent>
          <Typography variant='h4' component='h1' gutterBottom align='center' sx={{ fontWeight: 'bold', mb: 2 }}>
            {t('title')}
          </Typography>
          {error && (
            <Alert severity='error' sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <form onSubmit={handleLogin}>
            <TextField
              required
              label={t('emailLabel')}
              type='email'
              fullWidth
              margin='normal'
              value={email}
              onChange={e => setEmail(e.target.value)}
              sx={{ borderRadius: 1 }}
            />
            <TextField
              required
              label={t('passwordLabel')}
              type='password'
              fullWidth
              margin='normal'
              value={password}
              onChange={e => setPassword(e.target.value)}
              sx={{ borderRadius: 1 }}
            />
            <CardActions sx={{ mt: 2, justifyContent: 'center' }}>
              <Button
                type='submit'
                variant='contained'
                color='primary'
                fullWidth
                sx={{
                  paddingY: 1.2,
                  borderRadius: 3,
                  backgroundColor: '#1976d2',
                  '&:hover': {
                    backgroundColor: '#1565c0'
                  }
                }}
              >
                {t('loginButton')}
              </Button>
            </CardActions>
          </form>
        </CardContent>
        <Box
          sx={{
            textAlign: 'center',
            mt: 2,
            mb: 2,
            fontSize: '0.875rem',
            color: 'text.secondary'
          }}
        >
          <Link component='button' variant='body2' underline='none' onClick={() => setDialogOpen(true)}>
            {t('forgotPassword')}
          </Link>
        </Box>
      </Card>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>{t('forgotPassword')}</DialogTitle>
        <DialogContent>
          <TextField
            required
            label={t('emailLabel')}
            type='email'
            fullWidth
            margin='normal'
            value={resetEmail}
            onChange={e => setResetEmail(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} color='secondary' variant='outlined'>
            {t('cancel')}
          </Button>
          <Button onClick={handleDialogSubmit} color='primary' variant='contained'>
            {t('send')}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}
