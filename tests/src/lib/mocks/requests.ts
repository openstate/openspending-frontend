import type { Cookies, RequestEvent } from '@sveltejs/kit';
import type { Session } from 'svelte-kit-cookie-session';
import { vi } from 'vitest';
import type { SessionData } from '../../../../src/Types';
import { sessionFromEvent } from '../../../../src/utils';

vi.mock('../../../../src/utils');

export function mockCookies(): Cookies {
  return {
    get: vi.fn(),
    getAll: vi.fn(),
    set: vi.fn(),
    delete: vi.fn(),
    serialize: vi.fn()
  };
}

export function mockRequestEvent(path: string, session?: Session<SessionData>): RequestEvent {
  const url = "http://localhost" + path;
  const event = {
    cookies: mockCookies(),
    fetch: vi.fn(),
    getClientAddress: vi.fn(),
    locals: {session: mockUserSession()},
    params: {},
    platform: undefined,
    request: new Request(url),
    route: {
      id: null
    },
    setHeaders: vi.fn(),
    url: new URL(url),
    isDataRequest: false,
    isSubRequest: false
  };
  return event;
}

export function mockGuestUserSessionData(): SessionData {
  return {Token: "", TTL: 60, Role: undefined};
}

export function mockSourceUserSessionData(): SessionData {
  return {Token: "a token", TTL: 60, Role: "source"};
}

export function mockNormalUserSessionData(): SessionData {
  return {Token: "a token", TTL: 60, Role: "user"};
}

export function mockAdminUserSessionData(): SessionData {
  return {Token: "a token", TTL: 60, Role: "admin"};
}

function mockUserSession(): Session<SessionData> {
  const expiry_date = new Date();
  expiry_date.setDate(expiry_date.getDate() + 5);

  return {
    data: mockGuestUserSessionData(),
    expires: expiry_date,
    update: vi.fn(),
    set: vi.fn(),
    refresh: vi.fn(),
    destroy: vi.fn()
  };
}

export function mockRequest(path: string, sessionData: SessionData) {
  // It was not possible to pass `sessionData` via `data` in `mockUserSession`, so we have to separately
  // mock `sessionFromEvent`
  vi.mocked(sessionFromEvent).mockReturnValue(sessionData);

  const session = mockUserSession();
  return {
    event: mockRequestEvent(path, session),
    resolve: vi.fn()
  };
}
