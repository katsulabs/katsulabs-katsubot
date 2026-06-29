import { useState } from 'react'
import { ChatPage } from './components/ChatPage'
import { LoginPage } from './components/LoginPage'
import { isAuthenticated, logout } from './lib/auth'

export function App() {
  const [authed, setAuthed] = useState(isAuthenticated)

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
