export async function writeBytes(bytes: Promise<Uint8Array>) {
  process.stdout.write(await bytes)
}
