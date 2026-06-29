import { useEffect, useState } from 'react'
import { ChatPage } from './components/ChatPage'
import { LoginPage } from './components/LoginPage'
import { isAuthenticated, logout } from './lib/auth'
import { setUnauthorizedHandler } from './lib/api'

export function App() {
  const [authed, setAuthed] = useState(isAuthenticated)

  useEffect(() => {
    setUnauthorizedHandler(() => setAuthed(false))
    return () => setUnauthorizedHandler(null)
  }, [])

  if (!authed) {
    return <LoginPage onSuccess={() => setAuthed(true)} />
  }

  return (
    <ChatPage
      onLogout={() => {
        logout({ reload: false })
        setAuthed(false)
      }}
    />
  )
}
