const openDir = async (): Promise<FileSystemDirectoryHandle> => {
  return window.showDirectoryPicker({ mode: 'read' })
}

export default openDir
