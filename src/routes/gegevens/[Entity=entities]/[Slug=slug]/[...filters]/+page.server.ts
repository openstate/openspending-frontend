import type { PageServerLoad } from './$types.js';
import { readFileSync } from 'node:fs';

const readChanges = () => {
  const json = readFileSync('src/lib/data/gemeentelijke_herindelingen.json', 'utf-8')
  return JSON.parse(json)
}

const municipalityChanges = readChanges()

export const load: PageServerLoad = async ({ locals }) => {
  return { session: locals.session.data, municipalityChanges: municipalityChanges }
}