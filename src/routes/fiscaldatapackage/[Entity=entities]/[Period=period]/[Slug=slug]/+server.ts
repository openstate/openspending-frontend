import { error, type RequestHandler } from "@sveltejs/kit"
import { apiGet } from "../../../../../utils"

export const GET: RequestHandler = async ({ params, locals }) => {
  const session = locals.session.data

  let json
  let contentType: string = ''
  let contentDisposition: string = ''
  await apiGet(`/fiscaldatapackage/${params.Entity}/${params.Period}/${params.Slug}/datapackage.json`, session.Token)
    .then(res => {
      if (!res.ok) throw error(404)
      json = res.body
      contentType = res.headers.get('content-type') || ''
      contentDisposition = res.headers.get('content-disposition') || ''
    })

  return new Response(
    json,
    {
      status: 200,
      headers: {
      "Content-Type" : contentType,
      "Content-Disposition": contentDisposition
      }
    }
  )
}