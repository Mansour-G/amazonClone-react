import { useEffect, useState } from 'react'
import { Provider } from 'react-redux'
import { store } from '../app/store'
import { SessionProvider } from "next-auth/react"
import '../styles/globals.css'

const MyApp = ({ Component, pageProps, session }) => {
  const [showChild, setShowChild] = useState(false)

  useEffect(() => {
    setShowChild(true)
  }, [])

  if (!showChild) {
    return null
  }

  return (
    <SessionProvider session={session}>
      <Provider store={store}>
        <Component {...pageProps} />
      </Provider>
    </SessionProvider>
  )
}

export default MyApp
