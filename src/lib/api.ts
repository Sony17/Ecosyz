export async function json<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const errorText = await res.text()
    throw new Error(errorText || `HTTP ${res.status}: ${res.statusText}`)
  }
  return res.json()
}

export async function copy(text: string) {
  await navigator.clipboard.writeText(text)
}