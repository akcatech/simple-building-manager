'use client'

import { CircularProgress, Box } from '@mui/material'

const Spinner = () => {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        zIndex: 9999
      }}
    >
      <Box
        sx={{
          position: 'relative',
          display: 'inline-flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: 100,
          height: 100
        }}
      >
        <CircularProgress
          variant='determinate'
          value={100}
          size={100}
          thickness={4}
          sx={{
            color: '#e0e0e0'
          }}
        />
        <CircularProgress
          variant='indeterminate'
          disableShrink
          size={100}
          thickness={4}
          sx={{
            color: '#3f51b5',
            animationDuration: '800ms',
            position: 'absolute',
            left: 0
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize: 16,
            fontWeight: 'bold',
            color: '#3f51b5'
          }}
        >
          loading...
        </Box>
      </Box>
    </Box>
  )
}

export default Spinner
