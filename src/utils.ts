import type { RequestEvent } from "@sveltejs/kit";
import { get } from 'svelte/store';
import { api } from './stores';
import type { FormQuestionType, SubmitFormResultType } from "./Types";

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

export async function submitForm(event: Event, questions: FormQuestionType[], capToken: string): Promise<SubmitFormResultType> {
  event.stopPropagation()
  event.preventDefault()

  for (const q of questions) {
    q.validate?.()
  }
  const notAllValid = questions.map((q) => q.valid).includes(false)
  if (notAllValid) {
    return {valid: false, success: true}
  }

  // TODO Spinner show and hide
  let answers = questions.map((q, index) => ({
    'QuestionNumber': index + 1,
    'Answer': q.answer
  }))
  let body = {
    answers: answers,
    capToken: capToken
  }
  return await apiPost('/polls/feedback_2026', undefined, {
    body: JSON.stringify(body)
  }).then(async res => {
    if (!res.ok) {
      const body = await res.json()
      return {valid: true, success: false, message: `Kon data niet opslaan (API fout ${body.error})`}
    }
    return {valid: true, success: true}
  })
  .catch(e => {
    return {valid: true, success: false, message: `Er is iets misgegaan:\n${(e as Error).message}`}
  })
}