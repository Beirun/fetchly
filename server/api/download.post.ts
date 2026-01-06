import { spawn } from 'child_process'
import { tmpdir } from 'os'
import { join, resolve } from 'path'
import { createReadStream, unlinkSync, readdirSync, mkdirSync } from 'fs'
import { randomUUID } from 'crypto'

type Body = {
  url?: string
  type?: 'video' | 'audio'
  format?: string
  quality?: string // video: height (1080,720); audio: 0-9
}

export default defineEventHandler(async (e) => {
  const { url, type = 'video', format, quality } = await readBody<Body>(e)
  if (!url) throw createError({ statusCode: 400, statusMessage: 'URL required' })

  const id = randomUUID()
  const dir = join(tmpdir(), id)
  mkdirSync(dir)

  const yt = resolve('bin', process.platform === 'win32' ? 'yt-dlp.exe' : 'yt-dlp')
  const ffmpeg = resolve('bin', process.platform === 'win32' ? 'ffmpeg.exe' : 'ffmpeg')

  const isAudio = type === 'audio'
  const ext = format || (isAudio ? 'mp3' : 'mp4')

  const out = join(dir, '%(title)s.%(ext)s')

  const args = isAudio
    ? [
        url,
        '-x',
        '--audio-format',
        ext,
        '--audio-quality',
        quality || '0',
        '--ffmpeg-location',
        ffmpeg,
        '-o',
        out,
        '--no-playlist',
      ]
    : [
        url,
        '-f',
        quality ? `bv[height<=${quality}]+ba/b[height<=${quality}]` : 'bv*+ba/b',
        '--merge-output-format',
        ext,
        '--ffmpeg-location',
        ffmpeg,
        '-o',
        out,
        '--no-playlist',
      ]

  await new Promise<void>((res, rej) => {
    const p = spawn(yt, args, { windowsHide: true })
    p.on('error', rej)
    p.on('close', (c) => (c === 0 ? res() : rej(new Error('yt-dlp failed'))))
  })

  const files = readdirSync(dir)
  if (!files.length) throw createError({ statusCode: 500, statusMessage: 'File not created' })

  const fileName = files[0]
  const filePath = join(dir, fileName)

  setHeader(e, 'Content-Type', isAudio ? `audio/${ext}` : `video/${ext}`)
  setHeader(e, 'Content-Disposition', `attachment; filename="${fileName}"`)

  const s = createReadStream(filePath)
  s.on('close', () => unlinkSync(filePath))
  return sendStream(e, s)
})
