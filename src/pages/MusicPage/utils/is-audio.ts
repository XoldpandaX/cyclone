const AUDIO_EXTENSIONS = ['.mp3', '.mpeg', '.flac', '.wav', '.aac', '.m4a', '.ogg', '.oga', '.opus']
const isAudio = (name: string) => AUDIO_EXTENSIONS.some((ext) => name.toLowerCase().endsWith(ext))

export default isAudio
