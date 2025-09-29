import type { RequestEvent } from "@sveltejs/kit";
import { get } from 'svelte/store';
import { api } from './stores';

export function sessionFromEvent(event: RequestEvent) {
  return event.locals.session.data;
};

export function apiUrl() {
  return get(api)
}

export async function apiGet(path: string, token: string) {
  const headers: Record<string, string> = {
    'authorization': token
  }
  const options = { headers: headers }

  return await fetch(get(api) + path, options)
}

export async function apiPost(path: string, token: string | undefined, options: Record<string, any> = {}) {
  const headers: Record<string, string> = {
    'content-type': 'application/json'
  }
  if (token) headers['authorization'] = token

  options['headers'] = headers
  options['method'] = 'POST'

  return await fetch(get(api) + path, options)
}

export async function apiDelete(path: string, token: string) {
  const headers: Record<string, string> = {
    'authorization': token
  }
  const options = {
    headers: headers,
    method: 'DELETE'
  }

  return await fetch(get(api) + path, options)
}

