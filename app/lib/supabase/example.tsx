import { createClient } from './server'
import { cookies } from 'next/headers'

export default async function Page() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { data: users } = await supabase.from('users').select()

  return (
    <ul>
      {users?.map((user) => (
        <li key={user.id}>{user.email}</li>
      ))}
    </ul>
  )
}
