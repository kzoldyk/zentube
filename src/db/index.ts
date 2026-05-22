import { getCloudflareContext } from "@opennextjs/cloudflare"
import { drizzle } from "drizzle-orm/d1"
import * as schema from "@/db/schema"

type D1Binding = Parameters<typeof drizzle>[0]

export async function getDb() {
  const { env } = await getCloudflareContext({ async: true })
  return drizzle(env.DB as D1Binding, { schema })
}

export { schema }
