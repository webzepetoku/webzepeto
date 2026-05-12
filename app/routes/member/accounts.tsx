// app/routes/member/accounts.tsx
import { createRoute } from 'honox/factory'
import AccountManager from '../../islands/AccountManager'

export default createRoute((c) => {
  return c.render(
    <>
      {/* Merender komponen dinamis pengelola akun Zepeto */}
      <AccountManager />
    </>
  )
})
