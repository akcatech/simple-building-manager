'use client'

import { usePathname } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { MenuItem, Select } from '@mui/material'

const LanguageSwitcher = () => {
  const router = useRouter()
  const pathname = usePathname()
  const languages = [
    { code: 'en', name: 'English' },
    { code: 'tr', name: 'Türkçe' }
  ]

  const currentLang = pathname.split('/')[1]

  const handleChange = event => {
    const newLang = event.target.value
    const newPathname = `/${newLang}${pathname.substring(currentLang.length + 1)}`
    router.push(newPathname)
  }

  return (
    <Select
      value={currentLang}
      onChange={handleChange}
      variant='outlined'
      sx={{
        color: 'white',
        backgroundColor: 'primary.main',
        border: 'none',
        outline: 'none',
        '& fieldset': {
          border: 'none'
        }
      }}
    >
      {languages.map(lang => (
        <MenuItem key={lang.code} value={lang.code}>
          {lang.name}
        </MenuItem>
      ))}
    </Select>
  )
}

export default LanguageSwitcher
