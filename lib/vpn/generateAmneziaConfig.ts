export function generateAmneziaConfig(baseConfig: string) {
  const awgFields = new Map([
    ['Jc', '1'],
    ['Jmin', '1'],
    ['Jmax', '1'],
    ['S1', '0'],
    ['S2', '0'],
    ['H1', '1'],
    ['H2', '2'],
    ['H3', '3'],
    ['H4', '4'],
  ])

  const lines = baseConfig.replace(/\r\n/g, '\n').trim().split('\n')
  const result: string[] = []
  let section: 'interface' | 'peer' | 'other' = 'other'
  let interfaceInsertAt = -1
  const existing = new Set<string>()

  for (const line of lines) {
    const trimmed = line.trim()

    if (/^\[Interface\]$/i.test(trimmed)) {
      section = 'interface'
      interfaceInsertAt = result.length + 1
      result.push(line)
      continue
    }

    if (/^\[Peer\]$/i.test(trimmed)) {
      section = 'peer'
      result.push(line)
      continue
    }

    if (/^\[.+\]$/.test(trimmed)) {
      section = 'other'
      result.push(line)
      continue
    }

    const key = trimmed.split('=')[0]?.trim()
    if (key && awgFields.has(key)) {
      existing.add(key)
      if (section === 'interface') {
        result.push(`${key} = ${awgFields.get(key)}`)
      }
      continue
    }

    result.push(line)
  }

  const missingFields = Array.from(awgFields.entries())
    .filter(([key]) => !existing.has(key))
    .map(([key, value]) => `${key} = ${value}`)

  if (missingFields.length && interfaceInsertAt >= 0) {
    result.splice(interfaceInsertAt, 0, ...missingFields)
  }

  return `${result.join('\n')}\n`
}
