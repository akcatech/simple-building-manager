'use client'
import { useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { useRouter } from 'next/navigation'
import { auth } from '@/lib/firebase'
import { useTranslations } from 'next-intl'
import { Button, TextField, Typography, Container, Alert } from '@mui/material'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
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

  return (
    <Container maxWidth='xs'>
      <Typography variant='h4' component='h1' gutterBottom>
        {t('title')}
      </Typography>
      {error && <Alert severity='error'>{error}</Alert>}
      <form onSubmit={handleLogin}>
        <TextField
          required
          label={t('emailLabel')}
          type='email'
          fullWidth
          margin='normal'
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <TextField
          required
          label={t('passwordLabel')}
          type='password'
          fullWidth
          margin='normal'
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <Button type='submit' variant='contained' color='primary' fullWidth>
          {t('loginButton')}
        </Button>
      </form>
    </Container>
  )
}
