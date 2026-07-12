export async function writeText(destination: string, value: string) {
  if (destination === "-") process.stdout.write(value)
  else await Bun.write(destination, value)
}
