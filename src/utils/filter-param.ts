export function filterEmptyParams(params: any): any {
  if (typeof params !== 'object') {
    return params
  }

  if (Array.isArray(params)) {
    return params.filter(filterEmptyParams)
  }

  const filteredParams: any = {}

  for (const key in params) {
    const value = params[key]

    if (
      value !== null &&
      value !== undefined &&
      value !== '' &&
      (!Array.isArray(value) || value.length > 0)
    ) {
      filteredParams[key] = filterEmptyParams(value)
    }
  }

  return filteredParams
}
