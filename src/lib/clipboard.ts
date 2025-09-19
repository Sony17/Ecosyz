export async function copy(text: string) {
  await navigator.clipboard.writeText(text)
}