export function match(value: string) {
  return value.match(/^([a-z\-0-9]+)(\|[a-z\-0-9]+)*$/)
}
