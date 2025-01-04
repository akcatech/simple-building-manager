'use client'

import React from 'react'
import {
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Container,
  Box,
  Button
} from '@mui/material'
import { Home, Campaign, CurrencyLira, People, Summarize } from '@mui/icons-material'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import config from '@/config/config'
import LanguageSwitcher from './LanguageSwitcher'

const drawerWidth = 240

export default function AdminLayout({ children }) {
  const params = useParams()
  const { user, logout } = useAuth()
  const lang = params.lang || 'tr'
  const t = useTranslations('Menu')
  const f = useTranslations('Footer')
  const h = useTranslations('Header')

  const menuItems = [
    {
      text: t('home'),
      icon: <Home />,
      path: '/dashboard',
      roles: ['user', 'admin']
    },
    {
      text: t('announcements'),
      icon: <Campaign />,
      path: '/announcements',
      roles: ['user', 'admin']
    },
    {
      text: t('debtStatus'),
      icon: <CurrencyLira />,
      path: '/debt-status',
      roles: ['user', 'admin']
    },
    {
      text: t('debtManagement'),
      icon: <Summarize />,
      path: '/admin/debts',
      roles: ['admin']
    },
    {
      text: t('announcementManagement'),
      icon: <Campaign />,
      path: '/admin/announcements',
      roles: ['admin']
    },
    {
      text: t('userManagement'),
      icon: <People />,
      path: '/admin/users',
      roles: ['admin']
    }
  ]

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position='fixed' sx={{ zIndex: theme => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant='h6' noWrap component='div'>
            {config.appName}
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <LanguageSwitcher />
          <Button color='inherit' onClick={logout}>
            {h('logout')}
          </Button>
        </Toolbar>
      </AppBar>
      <Drawer
        variant='permanent'
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: 'border-box'
          }
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            {menuItems.map(
              item =>
                item.roles.includes(user?.role) && (
                  <Link
                    href={`/${lang}${item.path}`}
                    key={item.text}
                    locale={lang}
                    passHref
                    style={{ textDecoration: 'none', color: 'inherit' }}
                  >
                    <ListItem button>
                      <ListItemIcon>{item.icon}</ListItemIcon>
                      <ListItemText primary={item.text} />
                    </ListItem>
                  </Link>
                )
            )}
          </List>
        </Box>
      </Drawer>
      <Box component='main' sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Container>{children}</Container>
        <Box component='footer' sx={{ mt: 'auto', py: 2, textAlign: 'center' }}>
          <Typography variant='body2' color='text.secondary'>
            © {new Date().getFullYear()} {config.appName} {f('allRightsReserved')}
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}
