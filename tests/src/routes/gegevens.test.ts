//
// NOTE: the tests in this file need the API to be up and running in dev mode
//
import { describe, it } from 'vitest';
import { TEST_DOMAIN } from '../lib/utils/requests';
import { getDocumentForPath, testSelectorPresent, testSum } from '../lib/utils/xpath';

describe ('gegevens for 2 sources', () => {
  // Solves bugs discovered in february 2026:
  //   - if 2 sources were displayed, and the first source contained a value for `0` for some of the subcategories,
  //     these subcategories were not shown even if the second source had a non-zero value. Specific example for 2024: first source Hoorn,
  //     second source Gouda). The totals for the parent categories showed correct values, but the sum of the subcategories did not add up
  //     to the total for Gouda.
  //   - when solving the above bug, it was found that when combining data from different sources subcategories from the second source
  //     ended up with the wrong subcategories from the first source because the `data` structure in sources was accessed using indices
  //     instead of IDs
  const pathBoth = `${TEST_DOMAIN}/gegevens/Gemeenten/per/hoofdfunctie/hoorn/2024/begroting/gouda/2024/begroting/open/0|0.1`
  const pathHoornOnly = `${TEST_DOMAIN}/gegevens/Gemeenten/per/hoofdfunctie/hoorn/2024/begroting/open/0|0.1`
  const pathGoudaOnly = `${TEST_DOMAIN}/gegevens/Gemeenten/per/hoofdfunctie/gouda/2024/begroting/open/0|0.1`

  const categoryGoudaOnly = "Ingeleend personeel"
  const categoryHoornOnly = "Overige verrekeningen"
  const categoryBoth = "Overige goederen en diensten"
  let root: Document = new Document()

  const testCategoryPresent = (category: string, present: boolean,
                               amount: string = '', position: number = 0,
                               secondAmount: string = '', secondPosition: number = 0) => {
    const selector = `//div[contains(@class, "col-11") and contains(text(), "${category}")]`
    testSelectorPresent(root, selector, present)

    if (amount){
      const selector2 = `${selector}/ancestor::td/following-sibling::td[position()=${position}]/span[contains(@class, "currency") and contains(text(), "${amount}")]`
      testSelectorPresent(root, selector2, present)
    }

    if (secondAmount){
      const selector2 = `${selector}/ancestor::td/following-sibling::td[position()=${secondPosition}]/span[contains(@class, "currency") and contains(text(), "${secondAmount}")]`
      testSelectorPresent(root, selector2, present)
    }
  }

  it('correctly shows all categories if some only present for one of the sources', async () => {
    root = await getDocumentForPath(pathBoth)
    testCategoryPresent(categoryHoornOnly, true, '37', 3)
    testCategoryPresent(categoryGoudaOnly, true, '18', 4)
    testCategoryPresent(categoryBoth, true, '969', 3,  '1.181', 4)
  })

  it('correctly shows categories for Hoorn', async () => {
    root = await getDocumentForPath(pathHoornOnly)
    testCategoryPresent(categoryHoornOnly, true, '37', 2)
    testCategoryPresent(categoryGoudaOnly, false)
    testCategoryPresent(categoryBoth, true, '969', 2)
  })

  it('correctly shows categories for Gouda', async () => {
    root = await getDocumentForPath(pathGoudaOnly)
    testCategoryPresent(categoryGoudaOnly, true, '18', 2)
    testCategoryPresent(categoryHoornOnly, false)
    testCategoryPresent(categoryBoth, true, '1.181', 2)
  })
})

describe ('totalen van gegevens', () => {
  describe ('voor 1 gemeente', () => {
    const pathDeWoldenBegroting = `${TEST_DOMAIN}/gegevens/Gemeenten/per/hoofdfunctie/de-wolden/2024/begroting`
    const pathDeWoldenQ1 = `${TEST_DOMAIN}/gegevens/Gemeenten/per/hoofdfunctie/de-wolden/2024/Q1`
    const pathDeWoldenQ2 = `${TEST_DOMAIN}/gegevens/Gemeenten/per/hoofdfunctie/de-wolden/2024/Q2`
    const pathDeWoldenQ3 = `${TEST_DOMAIN}/gegevens/Gemeenten/per/hoofdfunctie/de-wolden/2024/Q3`
    const pathDeWoldenQ4 = `${TEST_DOMAIN}/gegevens/Gemeenten/per/hoofdfunctie/de-wolden/2024/Q4`
    const pathDeWoldenRealisatie = `${TEST_DOMAIN}/gegevens/Gemeenten/per/hoofdfunctie/de-wolden/2024/realisatie`
    let root: Document = new Document()

    describe ('Begroting', () => {
      it('has the correct total for Baten', async () => {
        root = await getDocumentForPath(pathDeWoldenBegroting)
        testSum(root, 'Baten', 4)
      })

      it('has the correct total for Lasten', async () => {
        root = await getDocumentForPath(pathDeWoldenBegroting)
        testSum(root, 'Lasten', 5)
      })
    })

    describe ('Q1', () => {
      it('has the correct total for Baten', async () => {
        root = await getDocumentForPath(pathDeWoldenQ1)
        testSum(root, 'Baten', 4)
      })

      it('has the correct total for Lasten', async () => {
        root = await getDocumentForPath(pathDeWoldenQ1)
        testSum(root, 'Lasten', 5)
      })
    })

    describe ('Q2', () => {
      it('has the correct total for Baten', async () => {
        root = await getDocumentForPath(pathDeWoldenQ2)
        testSum(root, 'Baten', 4)
      })

      it('has the correct total for Lasten', async () => {
        root = await getDocumentForPath(pathDeWoldenQ2)
        testSum(root, 'Lasten', 5)
      })
    })

    describe ('Q3', () => {
      it('has the correct total for Baten', async () => {
        root = await getDocumentForPath(pathDeWoldenQ3)
        testSum(root, 'Baten', 4)
      })

      it('has the correct total for Lasten', async () => {
        root = await getDocumentForPath(pathDeWoldenQ3)
        testSum(root, 'Lasten', 5)
      })
    })

    describe ('Q4', () => {
      it('has the correct total for Baten', async () => {
        root = await getDocumentForPath(pathDeWoldenQ4)
        testSum(root, 'Baten', 4)
      })

      it('has the correct total for Lasten', async () => {
        root = await getDocumentForPath(pathDeWoldenQ4)
        testSum(root, 'Lasten', 5)
      })
    })

    describe ('Realistatie', () => {
      it('has the correct total for Baten', async () => {
        root = await getDocumentForPath(pathDeWoldenRealisatie)
        testSum(root, 'Baten', 4)
      })

      it('has the correct total for Lasten', async () => {
        root = await getDocumentForPath(pathDeWoldenRealisatie)
        testSum(root, 'Lasten', 5)
      })
    })
  })

  describe ('voor 2 gemeenten', () => {
    const pathBegroting = `${TEST_DOMAIN}/gegevens/Gemeenten/per/hoofdfunctie/de-wolden/2024/begroting/gouda/2024/begroting`
    let root: Document = new Document()

    describe ('Begroting', () => {
      it('has the correct total for Baten', async () => {
        root = await getDocumentForPath(pathBegroting)
        testSum(root, 'Baten', 4) // De Wolden
        testSum(root, 'Baten', 4, {"summariesRow": "2", "amountsColumn": "5"}) // Gouda
      })

      it('has the correct total for Lasten', async () => {
        root = await getDocumentForPath(pathBegroting)
        testSum(root, 'Lasten', 5, {"amountsColumn": "6"}) // De Wolden
        testSum(root, 'Lasten', 5, {"summariesRow": "2", "amountsColumn": "7"}) // Gouda
      })
    })
  })
})