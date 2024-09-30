import { VITE_STRAPI_KEY, VITE_STRAPI_API } from '$env/static/private';

type FAQ = {
  Titel: string
  FAQ: Array<{id: number, Vraag: string, Antwoord: string}>
}
const headers = {
  Authorization: `Bearer ${VITE_STRAPI_KEY}`
}
export const load = async () => {
  return await fetch(`${VITE_STRAPI_API}/faq/?populate=*`, { headers })
    .then(res => res.json())
    .then(content => {
      return content.data.attributes as FAQ
    })
}