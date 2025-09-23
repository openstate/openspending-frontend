import { describe, it, expect, vi } from 'vitest';
import { isRedirect } from '@sveltejs/kit';
import { mockAdminUserSessionData, mockRequest, mockGuestUserSessionData, mockNormalUserSessionData } from '../lib/mocks/requests';
import { handle } from '../../../src/hooks.server';

describe ('beheer page', () => {
	const path = '/beheer';

  it('redirects to login if not logged in', async () => {
    let { event, resolve } = mockRequest(path, mockGuestUserSessionData());

		await expect(handle({ event, resolve })).rejects.toSatisfy((response) => {
			return isRedirect(response) && response.location == '/login';
		});
    expect(resolve).not.toHaveBeenCalled;
  });

  it('redirects to login?noAdmin when logged in as normal user', async() => {
    let { event, resolve } = mockRequest(path, mockNormalUserSessionData());

		await expect(handle({ event, resolve })).rejects.toSatisfy((response) => {
			return isRedirect(response) && response.location == '/login?noAdmin';
		});
    expect(resolve).not.toHaveBeenCalled;
  });

  it('resolves when logged in as admin user', async() => {
    let { event, resolve } = mockRequest(path, mockAdminUserSessionData());

		await expect(handle({ event, resolve })).resolves.toEqual(undefined);
    expect(resolve).toHaveBeenCalled;
  });
});

describe ('login page', () => {
  const path = '/login';

  it('resolves when not logged in', async () => {
    let { event, resolve } = mockRequest(path, mockGuestUserSessionData());

    await handle({ event, resolve });
    expect(resolve).toHaveBeenCalled;
  });

  it('resolves when logged in as normal user', async () => {
    let { event, resolve } = mockRequest(path, mockNormalUserSessionData());

    await handle({ event, resolve });
    expect(resolve).toHaveBeenCalled;
  });

  it('resolves when logged in as admin user', async () => {
    let { event, resolve } = mockRequest(path, mockNormalUserSessionData());

    await handle({ event, resolve });
    expect(resolve).toHaveBeenCalled;
  });
});

describe ('gegevens page', () => {
  const path = '/gegevens/Gemeenten/per/hoofdfunctie/zoeterwoude/2024/begroting';

  it('resolves if not logged in', async () => {
    let { event, resolve } = mockRequest(path, mockGuestUserSessionData());

    await handle({ event, resolve });
    expect(resolve).toHaveBeenCalled;
  });

  it('resolves when logged in as normal user', async () => {
    let { event, resolve } = mockRequest(path, mockNormalUserSessionData());

    await handle({ event, resolve });
    expect(resolve).toHaveBeenCalled;
  });

  it('resolves when logged in as admin user', async () => {
    let { event, resolve } = mockRequest(path, mockNormalUserSessionData());

    await handle({ event, resolve });
    expect(resolve).toHaveBeenCalled;
  });
});
