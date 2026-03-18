import { expect } from 'vitest';
import { DOMParser } from '@xmldom/xmldom'
import xpath from 'xpath';
import { loginUser } from './requests';

export const domParserErrors = (_msg: string) => {}

export const getDocumentForPath = async (path: string, options: {
  username?: string,
  status?: number
  } = {}) => {
  const headers = new Headers()
  if (options.username) {
    const cookie = await loginUser(options.username)
    headers.set("Cookie", cookie)
  }
  const response = await fetch(path, {headers: headers});
  expect(response.status).toBe(options.status || 200);
  const text = await response.text()
  return new DOMParser({errorHandler: {warning: domParserErrors, error: domParserErrors, fatalError: domParserErrors}}).parseFromString(text)
}

export const testSelectorPresent = (root: Document, selector: string, present: boolean) => {
  const nExpected = present ? 1 : 0
  const rows = xpath.select(selector, root) as Node[]
  expect(rows?.length).toBe(nExpected)
}

export const extractNumber = (root: Document, selector: string) => {
  return (xpath.select(selector, root) as Node[])
    .map((n) => {
      const s = n.nodeValue?.replace(/\./g, '').replace('€&nbsp;', '')
      return Number(s)
    })[0]
}

export const testSum = (root: Document, sumFor: 'Baten' | 'Lasten', column: number, options?: {[id: string]: string}) => {
  const amountsTable = '//table[contains(@class, "amounts")]'
  const summariesTable = '//table[contains(@class, "summaries")]'
  if (options === undefined) options = {}

  // Sum the amounts
  let selector = `${amountsTable}/tbody/tr`
  const numberOfRows = (xpath.select(selector, root) as Node[]).length
  let summedAmounts = 0
  for (let i = 1; i<=numberOfRows; i++) {
    selector = `${amountsTable}/tbody/tr[${i}]/child::*[${options["amountsColumn"] || column}]/span/text()`
    const amount = extractNumber(root, selector)
    summedAmounts += amount
  }

  // Check against sum in table footer
  selector = `${amountsTable}/tfoot/tr[1]/child::*[${options["amountsTotalColumn"] || options["amountsColumn"] || column}]/span/text()`
  let tableAmount = extractNumber(root, selector)
  expect(tableAmount).toEqual(summedAmounts)

  // Check against total in summaries table
  if (!options["skipSummariesCheck"]) {
    selector = `${summariesTable}/tbody/tr[${options["summariesRow"] || 1}]/child::*[${options["amountsTotalColumn"] || column}]/span/text()`
    tableAmount = extractNumber(root, selector)
    expect(tableAmount).toEqual(summedAmounts)

    // Sanity check on column heading in summaries table
    selector = `${summariesTable}/thead/tr[1]/child::*[${column}]/text()`
    const columnText = (xpath.select(selector, root) as Node[])[0].textContent
    expect(columnText).toEqual(sumFor)
  } else {
    // Sanity check on column heading in amounts table
    selector = `${amountsTable}/thead/tr[1]/child::*[${column}]/text()`
    const columnText = (xpath.select(selector, root) as Node[])[0].textContent
    expect(columnText).toEqual(sumFor)
  }
}
