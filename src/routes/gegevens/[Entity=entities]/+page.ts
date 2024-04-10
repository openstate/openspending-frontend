import type { SourceType } from '../../../Types.js';

export async function load({ params }) {
  let entity: SourceType = 'Gemeenten'
  switch (params.Entity) {
    case 'Gemeenten':
    case 'Provincies':
    case 'GemeenschappelijkeRegelingen':
    case 'Waterschappen':
      entity = params.Entity
      break

  }
	return {entity};
}
