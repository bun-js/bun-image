export async function writeText(destination: string, value: string) {
  if (destination === "-") process.stdout.write(value);
  else await Bun.write(destination, value);
}

export async function writeBytes(bytes: Promise<Uint8Array>) {
  process.stdout.write(await bytes);
}
