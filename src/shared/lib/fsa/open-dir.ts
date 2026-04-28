const openDir = async (): Promise<FileSystemDirectoryHandle> => {
  return window.showDirectoryPicker({ mode: 'readwrite', startIn: 'music' })
}

export default openDir
