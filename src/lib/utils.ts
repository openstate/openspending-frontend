export const ucfirst = (value: string) => value.substring(0, 1).toLocaleUpperCase() + value.substring(1)
export const currency = (ammount: number | null | undefined, code: string = '€') => ammount === 0 || !ammount ? '-' : (code + ' ' + ammount.toLocaleString())
