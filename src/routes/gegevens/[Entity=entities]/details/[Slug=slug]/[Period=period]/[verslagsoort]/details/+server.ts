import { json, type RequestHandler } from '@sveltejs/kit';
import { apiGet } from '../../../../../../../../utils';

export const GET: RequestHandler = async ({ params, locals }) => {
  const session = locals.session.data

  const url = `/detaildata/${params.Entity}/${params.Slug}/${params.Period}/${params.verslagsoort}.json`
  return await apiGet(url, session.Token)
  .then(async (res) => {
    if (!res.ok) {
      const message = `Kon data niet ophalen (API fout ${res.status} ${res.statusText})`
      return json({success: false, error: message})
    }
    const contentDisposition = res.headers.get('content-disposition')
    const responseOptions: ResponseInit = {}
    if (contentDisposition) {
      responseOptions['headers'] = {'content-disposition': contentDisposition}
    }
    return json(await res.json(), responseOptions)
  })
  .catch((e) => {
    return json({success: false, error: `Er is iets misgegaan:\n${(e as Error).message}`})
  })
}