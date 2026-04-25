import { type IAudioMetadata, parseBuffer } from 'music-metadata'

const tryParseAudio = async (track: Blob, mimeType: string): Promise<IAudioMetadata> => {
  const buffer = await track.arrayBuffer()
  return parseBuffer(new Uint8Array(buffer), { mimeType }, { skipCovers: true })
}

export default tryParseAudio
