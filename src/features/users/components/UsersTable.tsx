import { ActionIcon } from '@mantine/core'
import { DataTable } from 'mantine-datatable'

import { useUsersStore } from '../store/usersStore'

export function UsersTable() {
  const { users, isLoading, removeUser } = useUsersStore()

  return (
    <DataTable
      records={users}
      fetching={isLoading}
      minHeight={200}
      columns={[
        { accessor: 'id', title: 'ID', width: 70 },
        { accessor: 'name', title: 'Name' },
        { accessor: 'email', title: 'Email' },
        { accessor: 'role', title: 'Role', width: 120 },
        {
          accessor: 'actions',
          title: '',
          width: 60,
          render: (row) => (
            <ActionIcon
              color="red"
              variant="subtle"
              size="sm"
              onClick={() => removeUser(row.id)}
              aria-label={`Remove ${row.name}`}
            >
              ✕
            </ActionIcon>
          ),
        },
      ]}
      withTableBorder
      borderRadius="sm"
      striped
      highlightOnHover
      noRecordsText="No users found"
    />
  )
}
