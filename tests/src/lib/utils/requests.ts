export const TEST_DOMAIN = 'http://localhost:5173'
export const ADMIN_USERNAME = 'test_admin_user@openstate.eu'
export const KRIMPENERWAARD_USERNAME = 'test_krimpenerwaard_user@openstate.eu'
export const DEWOLDEN_USERNAME = 'test_dewolden_user@openstate.eu'

export const loginUser = async(username: string) => {
  const headers = new Headers()
  headers.append("Origin", TEST_DOMAIN)
  headers.append("Content-Type", "application/x-www-form-urlencoded")
  const response = await fetch(`${TEST_DOMAIN}/login`, {
    method: 'POST',
    headers: headers,
    body: new URLSearchParams({username: username, wachtwoord: 'for_testing_only'}).toString()
  })
  return response.headers.getSetCookie()[0]
}
