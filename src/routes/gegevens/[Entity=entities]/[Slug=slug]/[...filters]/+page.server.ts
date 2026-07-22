import type { PageServerLoad } from './$types.js';
import { readFileSync } from 'node:fs';

const readChanges = (path: string) => {
  const json = readFileSync(path, 'utf-8')
  return JSON.parse(json)
}

const municipalityChanges = readChanges('src/lib/data/gemeentelijke_herindelingen.json')
const waterschappenChanges = readChanges('src/lib/data/waterschappen_herindelingen.json')
const sourceChanges = Object.assign({}, municipalityChanges, waterschappenChanges)

export const load: PageServerLoad = async ({ locals }) => {
  return {
    session: locals.session.data,
    sourceChanges: sourceChanges
  }
}