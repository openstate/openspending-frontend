import { VITE_STRAPI_KEY, VITE_STRAPI_API } from '$env/static/private';
import { marked } from 'marked'
type Content = {
  Titel: string
  Inleiding: string
  Inhoud: string
}
const headers = {
  Authorization: `Bearer ${VITE_STRAPI_KEY}`
}
export const load = async () => {
  return await fetch(`${VITE_STRAPI_API}/data/?populate=*`, { headers })
    .then(res => res.json())
    .then(content => content.data.attributes as Content)
    .then(async content => {
      return {...content, 
        Inleiding: await marked.parse(content.Inleiding),
        Inhoud: await marked.parse(content.Inhoud),
      }
    })
}