import { apiPythonGet } from '../../../../utils'

type PollAnswer = {
  AnswerId: number,
  ResponseId: number,
  QuestionNumber: number,
  Answer?: string
}

type PollResponse = {
  ResponseId: number,
  RespondedOn: string,
  Answers: PollAnswer[]
}

export async function load({ data }) {
  const session = data.session

  const responses: PollResponse[] = await apiPythonGet(`/poll_answers/feedback_2026`, session.Token)
    .then(res => res.json())
  return { responses }
}