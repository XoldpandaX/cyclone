import pLimit from 'p-limit'
// https://www.npmjs.com/package/p-limit

const withConcurrency = async <T>(
  items: T[],
  concurrency: number,
  fn: (item: T) => Promise<void>,
): Promise<void> => {
  const limit = pLimit(concurrency)
  return Promise.all(items.map((item) => limit(() => fn(item)))).then(() => {})
}

export default withConcurrency
