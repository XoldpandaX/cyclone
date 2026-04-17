import { useEffect } from 'react'

import { Stack } from '@mantine/core'

import { UsersTable, useUsersStore } from '@/features/users'
import { Button } from '@/shared/components/Button/Button'
import type { User } from '@/shared/types'

import styles from './UsersPage.module.scss'

const MOCK_USERS: User[] = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'Admin' },
  { id: 2, name: 'Bob Smith', email: 'bob@example.com', role: 'Editor' },
  { id: 3, name: 'Carol White', email: 'carol@example.com', role: 'Viewer' },
]

let nextId = MOCK_USERS.length + 1

export function UsersPage() {
  const { setUsers, addUser, setLoading } = useUsersStore()

  useEffect(() => {
    setLoading(true)
    const timer = setTimeout(() => {
      setUsers(MOCK_USERS)
      setLoading(false)
    }, 800)
    return () => clearTimeout(timer)
  }, [setUsers, setLoading])

  const handleAddUser = () => {
    addUser({
      id: nextId++,
      name: `User ${nextId}`,
      email: `user${nextId}@example.com`,
      role: 'Viewer',
    })
  }

  return (
    <div className={styles['container']}>
      <div className={styles['header']}>
        <h1 className={styles['title']}>Users</h1>
        <Button onClick={handleAddUser}>Add User</Button>
      </div>
      <Stack gap="md">
        <UsersTable />
      </Stack>
    </div>
  )
}
