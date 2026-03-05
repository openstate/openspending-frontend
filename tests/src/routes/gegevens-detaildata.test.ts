//
// NOTE: the tests in this file need the API to be up and running in dev mode
//       The data of 2024 must be loaded, including detaildata, and only the
//       detaildata of De Wolden must be published
//
import { describe, it } from 'vitest';
import { ADMIN_USERNAME, DEWOLDEN_USERNAME, getDocumentForPath, KRIMPENERWAARD_USERNAME, TEST_DOMAIN, testSelectorPresent } from '../lib/utils/requests';

describe ('overzicht detaildata', () => {
  let root: Document = new Document()
  const overzichtPath = `${TEST_DOMAIN}/gegevens/detaildata`

  const testSourcePresent = (source: string, present: boolean) => {
    const selector = `//td[text()="${source}"]/following-sibling::td[position()=1]/a[contains(text(), "2024")]`
    testSelectorPresent(root, selector, present)
  }

  it('shows only published sources with detaildata when not logged in', async () => {
    root = await getDocumentForPath(overzichtPath)
    testSourcePresent("De Wolden", true)
    testSourcePresent("Hoogeveen", false)
    testSourcePresent("Krimpenerwaard", false)
  })

  it('shows all sources with detaildata to admin user', async () => {
    root = await getDocumentForPath(overzichtPath, {username: ADMIN_USERNAME})
    testSourcePresent("De Wolden", true)
    testSourcePresent("Hoogeveen", true)
    testSourcePresent("Krimpenerwaard", true)
  })

  it('shows own sources with unpublished detaildata to source user', async () => {
    root = await getDocumentForPath(overzichtPath, {username: KRIMPENERWAARD_USERNAME})
    testSourcePresent("De Wolden", true)
    testSourcePresent("Hoogeveen", false)
    testSourcePresent("Krimpenerwaard", true)
  })
})

describe ('detaildata data',  () => {
  let root: Document = new Document()

  const testDataPresent = async (present: boolean, category: string, baten: string, lasten: string) => {
    if (!present) {
      const selector = `//h1[contains(text(), "Niet geautoriseerd")]`
      testSelectorPresent(root, selector, true)
      return
    }
    const selector = `//td[contains(text(), '${category}')]`
    testSelectorPresent(root, selector, present)
    let text = baten == '-' ? baten : `€&nbsp;${baten}`
    let selector2 = `${selector}/following-sibling::td[position()=1]/span[contains(@class, "currency") and contains(text(), "${text}")]`
    testSelectorPresent(root, selector2, present)
    text = lasten == '-' ? lasten : `€&nbsp;${lasten}`
    selector2 = `${selector}/following-sibling::td[position()=2]/span[contains(@class, "currency") and contains(text(), "${text}")]`
    testSelectorPresent(root, selector2, present)
  }

  describe ('published detaildata gemeente level 1',  () => {
    let level1Path = `${TEST_DOMAIN}/gegevens/Gemeenten/details/de-wolden/45067NED`

    const testDataLevel1Present = async (present: boolean) => {
      await testDataPresent(present, "Verkeer, vervoer en waterstaat", "4.76", "148.991")
    }

    it('shows data to admin user', async () => {
      root = await getDocumentForPath(level1Path, {username: ADMIN_USERNAME})
      await testDataLevel1Present(true)
    })

    it('shows data to source user belonging to same source', async () => {
      root = await getDocumentForPath(level1Path, {username: DEWOLDEN_USERNAME})
      await testDataLevel1Present(true)
    })

    it('shows data to source user belonging to different source', async () => {
      root = await getDocumentForPath(level1Path, {username: KRIMPENERWAARD_USERNAME})
      await testDataLevel1Present(true)
    })

    it('shows data when not logged in', async () => {
      root = await getDocumentForPath(level1Path)
      await testDataLevel1Present(true)
    })
  })

  describe ('unpublished detaildata gemeente level 1',  () => {
    let level1Path = `${TEST_DOMAIN}/gegevens/Gemeenten/details/krimpenerwaard/45067NED`

    const testDataLevel1Present = async (present: boolean) => {
      await testDataPresent(present, "Verkeer, vervoer en waterstaat", "1.170.715", "1.928.660")
    }

    it('shows data to admin user', async () => {
      root = await getDocumentForPath(level1Path, {username: ADMIN_USERNAME})
      await testDataLevel1Present(true)
    })

    it('shows data to source user belonging to same source', async () => {
      root = await getDocumentForPath(level1Path, {username: KRIMPENERWAARD_USERNAME})
      await testDataLevel1Present(true)
    })

    it('does not show data to source user belonging to different source', async () => {
      root = await getDocumentForPath(level1Path, {username: DEWOLDEN_USERNAME, status: 403})
      await testDataLevel1Present(false)
    })


    it('does not show data when not logged in', async () => {
      root = await getDocumentForPath(level1Path, {status: 403})
      await testDataLevel1Present(false)
    })
  })

  describe ('published detaildata gemeente level 2',  () => {
    let level2Path = `${TEST_DOMAIN}/gegevens/Gemeenten/details/de-wolden/45067NED/2024X001/kostenplaats/categorie=3/grootboek=/kostenplaats=#C3`

    const testDataLevel2Present = async (present: boolean) => {
      await testDataPresent(present, "Onderhouden wegen", "2.035", "14.204")
    }

    it('shows data to admin user', async () => {
      root = await getDocumentForPath(level2Path, {username: ADMIN_USERNAME})
      await testDataLevel2Present(true)
    })

    it('shows data to source user belonging to same source', async () => {
      root = await getDocumentForPath(level2Path, {username: DEWOLDEN_USERNAME})
      await testDataLevel2Present(true)
    })

    it('shows data to source user belonging to different source', async () => {
      root = await getDocumentForPath(level2Path, {username: KRIMPENERWAARD_USERNAME})
      await testDataLevel2Present(true)
    })

    it('shows data when not logged in', async () => {
      root = await getDocumentForPath(level2Path)
      await testDataLevel2Present(true)
    })
  })

  describe ('unpublished detaildata gemeente level 2',  () => {
    let level2Path = `${TEST_DOMAIN}/gegevens/Gemeenten/details/krimpenerwaard/45067NED/2024X001/kostenplaats/categorie=3/grootboek=/kostenplaats=#C3`

    const testDataLevel2Present = async (present: boolean) => {
      await testDataPresent(present, "wegen, straten, pleinen groot onderhoud", "1.153.068", "1.289.938")
    }

    it('shows data to admin user', async () => {
      root = await getDocumentForPath(level2Path, {username: ADMIN_USERNAME})
      await testDataLevel2Present(true)
    })

    it('shows data to source user belonging to same source', async () => {
      root = await getDocumentForPath(level2Path, {username: KRIMPENERWAARD_USERNAME})
      await testDataLevel2Present(true)
    })

    it('does not show data to source user belonging to different source', async () => {
      root = await getDocumentForPath(level2Path, {username: DEWOLDEN_USERNAME, status: 403})
      await testDataLevel2Present(false)
    })

    it('does not show data when not logged in', async () => {
      root = await getDocumentForPath(level2Path, {status: 403})
      await testDataLevel2Present(false)
    })
  })

  describe ('published detaildata gemeente level 3',  () => {
    let level3Path = `${TEST_DOMAIN}/gegevens/Gemeenten/details/de-wolden/45067NED/2024X001/kostenplaats/categorie=3/grootboek=/kostenplaats=3|4021000000#C3K4021000000`

    const testDataLevel3Present = async (present: boolean) => {
      await testDataPresent(present, "Electriciteitsverbruik", "-", "618")
    }

    it('shows data to admin user', async () => {
      root = await getDocumentForPath(level3Path, {username: ADMIN_USERNAME})
      await testDataLevel3Present(true)
    })

    it('shows data to source user belonging to same source', async () => {
      root = await getDocumentForPath(level3Path, {username: DEWOLDEN_USERNAME})
      await testDataLevel3Present(true)
    })

    it('shows data to source user belonging to different source', async () => {
      root = await getDocumentForPath(level3Path, {username: KRIMPENERWAARD_USERNAME})
      await testDataLevel3Present(true)
    })

    it('shows data when not logged in', async () => {
      root = await getDocumentForPath(level3Path)
      await testDataLevel3Present(true)
    })
  })

  describe ('unpublished detaildata gemeente level 3',  () => {
    let level3Path = `${TEST_DOMAIN}/gegevens/Gemeenten/details/krimpenerwaard/45067NED/2024X001/kostenplaats/categorie=3/grootboek=/kostenplaats=3|621010#C3K621010`

    const testDataLevel3Present = async (present: boolean) => {
      await testDataPresent(present, "leges ondergrondse infrastructuur", "27.298", "-")
    }

    it('shows data to admin user', async () => {
      root = await getDocumentForPath(level3Path, {username: ADMIN_USERNAME})
      await testDataLevel3Present(true)
    })

    it('shows data to source user belonging to same source', async () => {
      root = await getDocumentForPath(level3Path, {username: KRIMPENERWAARD_USERNAME})
      await testDataLevel3Present(true)
    })

    it('does not show data to source user belonging to different source', async () => {
      root = await getDocumentForPath(level3Path, {username: DEWOLDEN_USERNAME, status: 403})
      await testDataLevel3Present(false)
    })

    it('does not show data when not logged in', async () => {
      root = await getDocumentForPath(level3Path, {status: 403})
      await testDataLevel3Present(false)
    })
  })
})

