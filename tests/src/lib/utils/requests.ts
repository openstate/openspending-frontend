import { expect } from 'vitest';
import { DOMParser } from '@xmldom/xmldom'
import xpath from 'xpath';

export const TEST_DOMAIN = 'http://localhost:5173'
export const ADMIN_USERNAME = 'test_admin_user@openstate.eu'
export const KRIMPENERWAARD_USERNAME = 'test_krimpenerwaard_user@openstate.eu'
export const DEWOLDEN_USERNAME = 'test_dewolden_user@openstate.eu'

export const domParserErrors = (_msg: string) => {}

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

export const getDocumentForPath = async (path: string, options: {
  username?: string,
  status?: number
  } = {}) => {
  const headers = new Headers()
  if (options.username) {
    const cookie = await loginUser(options.username)
    headers.set("Cookie", cookie)
  }
  const response = await fetch(path, {headers: headers});
  expect(response.status).toBe(options.status || 200);
  const text = await response.text()
  return new DOMParser({errorHandler: {warning: domParserErrors, error: domParserErrors, fatalError: domParserErrors}}).parseFromString(text)
}

export const testSelectorPresent = (root: Document, selector: string, present: boolean) => {
  const nExpected = present ? 1 : 0
  const rows = xpath.select(selector, root) as Node[]
  expect(rows?.length).toBe(nExpected)
}
