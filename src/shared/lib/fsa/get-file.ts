import type { Nullable } from '@/shared/types/maybe'
import verifyPermission from './vrify-permision'

const resolveFileHandle = async (
  root: FileSystemDirectoryHandle,
  pathSegments: string[],
  fileName: string,
): Promise<Nullable<File>> => {
  const verified = await verifyPermission(root, { readWrite: false })
  if (!verified) return null

  let dir: FileSystemDirectoryHandle = root
  for (const segment of pathSegments) {
    dir = await dir.getDirectoryHandle(segment)
  }

  const handle = await dir.getFileHandle(fileName)
  return handle.getFile()
}

export default resolveFileHandle
