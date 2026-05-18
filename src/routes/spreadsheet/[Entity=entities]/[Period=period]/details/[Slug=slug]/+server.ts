import { error, type RequestHandler } from "@sveltejs/kit"
import { apiPythonGet } from "../../../../../../utils"

export const GET: RequestHandler = async ({ params, locals }) => {
  const session = locals.session.data

  let excel
  let contentType: string = ''
  let contentDisposition: string = ''
  await apiPythonGet(`/detaildata/spreadsheet/${params.Entity}/${params.Period}/${params.Slug}`, session.Token)
    .then(res => {
      if (!res.ok) throw error(404)
      excel = res.body
      contentType = res.headers.get('content-type') || ''
      contentDisposition = res.headers.get('content-disposition') || ''
    })

  return new Response(
    excel,
    {
      status: 200,
      headers: {
      "Content-Type" : contentType,
      "Content-Disposition": contentDisposition
      }
    }
  )
}