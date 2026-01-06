import { spawn } from 'child_process'
import { resolve } from 'path'

type Body = {
  url?: string
}

type VideoQuality = {
  formatId: string
  ext: string
  height: number
  fps?: number
}

type AudioQuality = {
  formatId: string
  ext: string
  abr?: number
}
const cache = new Map<string, { t: number; v: any }>()
const TTL = 5 * 60 * 1000

export default defineEventHandler(async (e) => {
  const { url } = await readBody<Body>(e)
  if (!url) throw createError({ statusCode: 400, statusMessage: 'URL required' })

  const yt = resolve('bin', process.platform === 'win32' ? 'yt-dlp.exe' : 'yt-dlp')

  const c = cache.get(url)
  if (c && Date.now() - c.t < TTL) return c.v

  const data = await new Promise<any>((res, rej) => {
    const p = spawn(
      yt,
      [
        '--dump-single-json',
        '--skip-download',
        '--no-playlist',
        '--no-warnings',
        '--quiet',
        '--no-check-certificates',
        '--no-call-home',
        '--force-ipv4',
        url,
      ],
      {
        windowsHide: true,
      },
    )

    let out = ''
    let err = ''

    p.stdout.on('data', (d) => (out += d))
    p.stderr.on('data', (d) => (err += d))

    p.on('error', rej)
    p.on('close', (c) => {
      if (c !== 0) rej(new Error(err || 'yt-dlp failed'))
      else res(JSON.parse(out))
    })
  })

  const thumbnail =
    data.thumbnail || (Array.isArray(data.thumbnails) ? data.thumbnails.at(-1)?.url : null)

  const videos: VideoQuality[] = []
  const audios: AudioQuality[] = []

  for (const f of data.formats || []) {
    if (f.vcodec !== 'none' && f.height) {
      videos.push({
        formatId: f.format_id,
        ext: f.ext,
        height: f.height,
        fps: f.fps,
      })
    }

    if (f.vcodec === 'none' && f.acodec !== 'none') {
      audios.push({
        formatId: f.format_id,
        ext: f.ext,
        abr: f.abr,
      })
    }
  }

  const uniq = <T, K extends keyof T>(arr: T[], k: K) =>
    Array.from(new Map(arr.map((i) => [i[k], i])).values())

  const result = {
    title: data.title,
    thumbnail,
    videoQualities: uniq(videos, 'height').sort((a, b) => b.height - a.height),
    audioQualities: uniq(audios, 'abr').sort((a, b) => (b.abr || 0) - (a.abr || 0)),
  }
  cache.set(url, { t: Date.now(), v: result })

  return result
})
