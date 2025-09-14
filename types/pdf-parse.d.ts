declare module 'pdf-parse' {
  const pdfParse: (buffer: Buffer | Uint8Array, options?: any) => Promise<{ text: string }>
  export default pdfParse
}
