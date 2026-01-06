export default defineEventHandler(async (event) => {
  const removeTrail = (url: string) => {
    const i = url.indexOf('&list')
    return i === -1 ? url : url.substring(0, i)
  }

  const q = getQuery(event)
  if (typeof q.url === 'string') {
    q.url = removeTrail(q.url)
  }

  if (event.method === 'POST') {
    const b = await readBody<any>(event)
    if (b?.url && typeof b.url === 'string') {
      b.url = removeTrail(b.url)
      event.context.body = b
    }
  }
})
