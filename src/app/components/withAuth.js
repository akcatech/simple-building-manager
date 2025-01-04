import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../hooks/useAuth'
import { useLocale } from 'next-intl'

const withAuth = WrappedComponent => {
  return props => {
    const { user, loading } = useAuth()
    const router = useRouter()
    const locale = useLocale()

    useEffect(() => {
      if (!loading && !user) {
        router.push(`/${locale}/login`)
      }
    }, [user, loading, router, locale])

    if (loading) {
      return <div>Loading...</div>
    }

    if (!user) {
      return null
    }

    return <WrappedComponent {...props} />
  }
}

export default withAuth
