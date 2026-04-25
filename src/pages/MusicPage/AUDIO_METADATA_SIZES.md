# Audio Metadata Header Sizes

Why 256KB is a safe slice size for reading audio metadata without loading the full file.

| Format     | Tag Location                    | Typical Size (no cover) | Max Realistic | Spec                                                                                                       |
| ---------- | ------------------------------- | ----------------------- | ------------- | ---------------------------------------------------------------------------------------------------------- |
| MP3        | ID3v2 at byte 0                 | 1–30 KB                 | ~128 KB       | [ID3v2.4 spec](https://id3.org/id3v2.4.0-structure)                                                        |
| FLAC       | Metadata blocks from byte 4     | 1–50 KB                 | ~100 KB       | [FLAC format spec](https://xiph.org/flac/format.html)                                                      |
| OGG Vorbis | Comment header in first packets | 1–10 KB                 | ~20 KB        | [Vorbis I spec §5](https://xiph.org/vorbis/doc/Vorbis_I_spec.html)                                         |
| M4A / AAC  | `moov` atom (when faststart)    | 10–50 KB                | ~150 KB       | [MP4 Registration Authority](https://mp4ra.org/) / [ISO 14496-12](https://www.iso.org/standard/83102.html) |
| WAV        | `INFO` chunk in RIFF header     | < 1 KB                  | ~5 KB         | [RIFF spec](https://www.iana.org/assignments/media-types/audio/wav)                                        |
| AIFF       | `NAME`/`AUTH`/`ANNO` chunks     | < 1 KB                  | ~5 KB         | [AIFF spec](https://www-mmsp.ece.mcgill.ca/Documents/AudioFormats/AIFF/Docs/AIFF-1.3.pdf)                  |

256 KB covers the worst realistic case (~150 KB for M4A) with a comfortable margin.
Cover art is skipped via `skipCovers: true`, which is the main driver of large tag sizes.
If the slice yields no `title` or `artist`, the scanner falls back to reading the full file.
