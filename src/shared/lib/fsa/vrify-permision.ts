const verifyPermission = async (
  handle: FileSystemDirectoryHandle,
  { readWrite = false }: { readWrite?: boolean } = {},
): Promise<boolean> => {
  const opts: FileSystemHandlePermissionDescriptor = { mode: readWrite ? 'readwrite' : 'read' }
  return (await handle.queryPermission(opts)) === 'granted' || (await handle.requestPermission(opts)) === 'granted'
}

export default verifyPermission
