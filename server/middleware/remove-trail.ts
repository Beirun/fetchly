export default defineEventHandler(async (e) => {
  const removeTrail = (url: string) => {
    const i = url.indexOf('&list')
    return i === -1 ? url : url.substring(0, i)
  }

  const q = getQuery(e)
  if (typeof q.url === 'string') {
    q.url = removeTrail(q.url)
  }

  if (e.method === 'POST') {
    const b = await readBody<any>(e)
    if (b?.url && typeof b.url === 'string') {
      b.url = removeTrail(b.url)
      e.context.body = b
    }
  }
})
