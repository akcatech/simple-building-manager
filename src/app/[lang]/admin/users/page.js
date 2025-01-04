'use client'

import React, { useEffect, useState } from 'react'
import { collection, setDoc, deleteDoc, doc, getDocs, query, orderBy, serverTimestamp } from 'firebase/firestore'
import { createUserWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth'
import { db, auth } from '@/lib/firebase'
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  Grid2,
  Stack,
  InputAdornment,
  IconButton
} from '@mui/material'
import { Search, Clear } from '@mui/icons-material'
import { useTranslations } from 'next-intl'
import { notify } from '@/util/utility'

const UsersPage = () => {
  const [users, setUsers] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [newUser, setNewUser] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    apartmentNo: '',
    email: '',
    password: ''
  })
  const [editingUser, setEditingUser] = useState(null)
  const m = useTranslations('Messages')
  const u = useTranslations('Users')

  const fetchUsers = async () => {
    const currentUser = auth.currentUser
    if (!currentUser) {
      notify('Oturum açılması gerekiyor', 'error')
      return
    }

    try {
      const usersCollection = collection(db, 'users')
      const userSnapshot = await getDocs(query(usersCollection, orderBy('lastName')))
      const usersList = userSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setUsers(usersList)
      setFilteredUsers(usersList)
    } catch (error) {
      console.error('Kullanıcıları getirme hatası:', error)
      notify('Kullanıcıları getirirken hata oluştu', 'error')
    }
  }

  const handleEditUser = user => {
    setEditingUser(user)
    setNewUser({
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      apartmentNo: user.apartmentNo,
      email: user.email,
      password: ''
    })
  }

  const handleUpdateUser = async () => {
    if (!editingUser) return

    try {
      const userRef = doc(db, 'users', editingUser.id)
      await updateDoc(userRef, {
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        phone: newUser.phone,
        apartmentNo: newUser.apartmentNo,
        email: newUser.email
      })
      setEditingUser(null)
      setNewUser({
        firstName: '',
        lastName: '',
        phone: '',
        apartmentNo: '',
        email: '',
        password: ''
      })
      fetchUsers()
      notify('Kullanıcı güncellendi', 'success')
    } catch (error) {
      console.error(m('genericError'), error)
      notify(error.message, 'error')
    }
  }

  const handleDeleteUser = async userId => {
    try {
      await deleteDoc(doc(db, 'users', userId))
      fetchUsers()

      notify('Kullanıcı silindi', 'success')
    } catch (error) {
      console.error(m('genericError'), error)
      notify(error.message, 'error')
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleAddUser = async () => {
    if (!newUser.email || !newUser.password || !newUser.phone || !newUser.apartmentNo) {
      notify(m('fillAllFields'), 'error')
      return
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, newUser.email, newUser.password)
      const user = userCredential.user

      await setDoc(doc(db, 'users', user.uid), {
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        phone: newUser.phone,
        apartmentNo: newUser.apartmentNo,
        email: newUser.email,
        role: 'user',
        uid: user.uid,
        createdAt: serverTimestamp()
      })

      await sendPasswordResetEmail(auth, newUser.email)
      notify(m('userCreateMsg'), 'success')

      // Reset form and refresh users
      setNewUser({
        firstName: '',
        lastName: '',
        phone: '',
        apartmentNo: '',
        email: '',
        password: ''
      })

      fetchUsers()
    } catch (error) {
      console.error('Kullanıcı oluşturma hatası:', error)
      if (error.code === 'auth/email-already-in-use') {
        notify('Bu email zaten kullanımda', 'error')
      } else if (error.code === 'auth/weak-password') {
        notify('Şifre çok zayıf', 'error')
      } else {
        notify(error.message, 'error')
      }
    }
  }

  const handleSearch = term => {
    const filtered = users.filter(
      user =>
        user.firstName.toLowerCase().includes(term.toLowerCase()) ||
        user.lastName.toLowerCase().includes(term.toLowerCase()) ||
        user.email.toLowerCase().includes(term.toLowerCase()) ||
        user.phone.includes(term)
    )
    setSearchTerm(term)
    setFilteredUsers(filtered)
  }

  const clearSearch = () => {
    setSearchTerm('')
    setFilteredUsers(users)
  }

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant='h4' component='h1' gutterBottom>
        {u('userManagement')}
      </Typography>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant='h6' sx={{ mb: 2 }}>
            {editingUser ? u('editUser') : u('addUser')}
          </Typography>
          <Stack spacing={2}>
            <TextField
              label={u('name')}
              fullWidth
              value={newUser.firstName}
              onChange={e => setNewUser({ ...newUser, firstName: e.target.value })}
            />
            <TextField
              label={u('surname')}
              fullWidth
              value={newUser.lastName}
              onChange={e => setNewUser({ ...newUser, lastName: e.target.value })}
            />
            <TextField
              label={u('telephone')}
              fullWidth
              value={newUser.phone}
              onChange={e => setNewUser({ ...newUser, phone: e.target.value })}
            />
            <TextField
              label={u('flatNumber')}
              fullWidth
              value={newUser.apartmentNo}
              onChange={e => setNewUser({ ...newUser, apartmentNo: e.target.value })}
            />
            <TextField
              label={u('email')}
              fullWidth
              value={newUser.email}
              onChange={e => setNewUser({ ...newUser, email: e.target.value })}
            />
            <TextField
              label={u('password')}
              type='password'
              fullWidth
              value={newUser.password}
              onChange={e => setNewUser({ ...newUser, password: e.target.value })}
            />
            <Button variant='contained' fullWidth onClick={editingUser ? handleUpdateUser : handleAddUser}>
              {editingUser ? u('update') : u('add')}
            </Button>
          </Stack>
        </CardContent>
      </Card>

      <TextField
        fullWidth
        variant='outlined'
        label={u('searchUser')}
        value={searchTerm}
        onChange={e => handleSearch(e.target.value)}
        sx={{ mb: 2 }}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position='start'>
                <Search />
              </InputAdornment>
            ),
            endAdornment: searchTerm && (
              <InputAdornment position='end'>
                <IconButton onClick={clearSearch}>
                  <Clear />
                </IconButton>
              </InputAdornment>
            )
          }
        }}
      />

      <Grid2 container spacing={2}>
        {filteredUsers.map(user => (
          <Grid2 item xs={12} sm={6} md={4} key={user.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant='h6'>{`${user.firstName} ${user.lastName}`}</Typography>
                <Typography color='textSecondary'>
                  {u('telephone')}: {user.phone}
                </Typography>
                <Typography color='textSecondary'>
                  {u('flatNumber')}: {user.apartmentNo}
                </Typography>
                <Typography color='textSecondary'>
                  {u('email')}: {user.email}
                </Typography>
              </CardContent>
              <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between' }}>
                <Button variant='contained' color='primary' onClick={() => handleEditUser(user)}>
                  {u('edit')}
                </Button>
                <Button variant='contained' color='secondary' onClick={() => handleDeleteUser(user.id)}>
                  {u('delete')}
                </Button>
              </Box>
            </Card>
          </Grid2>
        ))}
      </Grid2>
    </Box>
  )
}

export default UsersPage
