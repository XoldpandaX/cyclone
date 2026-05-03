interface ICheckCompatibilityResult {
  compatible: boolean
  isMobile: boolean
}

export const checkCompatibilityUseCase = (): ICheckCompatibilityResult => {
  const isMobile =
    (navigator as Navigator & { userAgentData?: { mobile: boolean } }).userAgentData?.mobile ??
    /Mobi|Android/i.test(navigator.userAgent)

  return {
    isMobile,
    compatible: 'showDirectoryPicker' in window && !isMobile,
  }
}
