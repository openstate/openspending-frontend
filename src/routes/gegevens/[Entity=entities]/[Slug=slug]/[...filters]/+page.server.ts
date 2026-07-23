import { apiPythonGet } from '../../../../../utils.js';
import type { PageServerLoad } from './$types.js';

const getRenamings = async (path: string) => {
  const renamings = await apiPythonGet(path, '')
    .then(async res => {
      if (res.ok) return await res.json()
      else return {}
    })
    .catch(e => {return {}})
  return renamings
}

const municipalityChanges = await getRenamings('/bronnen/Gemeenten/herindelingen')
const waterschappenChanges = await getRenamings('/bronnen/Waterschappen/herindelingen')
const sourceChanges = Object.assign({}, municipalityChanges, waterschappenChanges)

export const load: PageServerLoad = async ({ locals }) => {
  return {
    session: locals.session.data,
    sourceChanges: sourceChanges
  }
}