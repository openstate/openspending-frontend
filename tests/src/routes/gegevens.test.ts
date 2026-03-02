//
// NOTE: the tests in this file need the API to be up and running in dev mode
//
import { describe, it, expect } from 'vitest';
import xpath from 'xpath';
import { DOMParser } from '@xmldom/xmldom'

describe ('gegevens for 2 sources', () => {
  // Solves bugs discovered in february 2026:
  //   - if 2 sources were displayed, and the first source contained a value for `0` for some of the subcategories,
  //     these subcategories were not shown even if the second source had a non-zero value. Specific example for 2024: first source Hoorn,
  //     second source Gouda). The totals for the parent categories showed correct values, but the sum of the subcategories did not add up
  //     to the total for Gouda.
  //   - when solving the above bug, it was found that when combining data from different sources subcategories from the second source
  //     ended up with the wrong subcategories from the first source because the `data` structure in sources was accessed using indices
  //     instead of IDs
  const pathBoth = 'http://localhost:5173/gegevens/Gemeenten/per/hoofdfunctie/hoorn/2024/begroting/gouda/2024/begroting/open/0|0.1'
  const pathHoornOnly = 'http://localhost:5173/gegevens/Gemeenten/per/hoofdfunctie/hoorn/2024/begroting/open/0|0.1'
  const pathGoudaOnly = 'http://localhost:5173/gegevens/Gemeenten/per/hoofdfunctie/gouda/2024/begroting/open/0|0.1'

  const errorFunction = (_msg: string) => {}
  const categoryGoudaOnly = "Ingeleend personeel"
  const categoryHoornOnly = "Overige verrekeningen"
  const categoryBoth = "Overige goederen en diensten"
  let root: Document = new Document()

  const getDocumentForPath = async (path: string) => {
    const response = await fetch(path);
    expect(response.status).toBe(200);
    const text = await response.text()
    return new DOMParser({errorHandler: {warning: errorFunction, error: errorFunction, fatalError: errorFunction}}).parseFromString(text)
  }

  const testCategoryPresent = (category: string, present: boolean) => {
    const nExpected = present ? 1 : 0
    const rows = xpath.select(`//div[contains(@class, "col-11") and contains(text(), "${category}")]`, root) as Node[]
    expect(rows?.length).toBe(nExpected)
  }

  it('correctly shows all categories if some only present for one of the sources', async () => {
    root = await getDocumentForPath(pathBoth)
    testCategoryPresent(categoryGoudaOnly, true)
    testCategoryPresent(categoryHoornOnly, true)
    testCategoryPresent(categoryBoth, true)
  })

  it('correctly shows categories for Hoorn', async () => {
    root = await getDocumentForPath(pathHoornOnly)
    testCategoryPresent(categoryHoornOnly, true)
    testCategoryPresent(categoryGoudaOnly, false)
    testCategoryPresent(categoryBoth, true)
  })

  it('correctly shows categories for Gouda', async () => {
    root = await getDocumentForPath(pathGoudaOnly)
    testCategoryPresent(categoryGoudaOnly, true)
    testCategoryPresent(categoryHoornOnly, false)
    testCategoryPresent(categoryBoth, true)
  })
})