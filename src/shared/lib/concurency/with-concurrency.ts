import pLimit from 'p-limit'
// https://www.npmjs.com/package/p-limit

const withConcurrency = async <T>(
  items: AsyncIterable<T> | T[],
  concurrency: number,
  fn: (item: T) => Promise<void>,
): Promise<void> => {
  const limit = pLimit(concurrency)
  const promises: Promise<void>[] = []

  for await (const item of items) {
    promises.push(limit(() => fn(item)))
  }

  await Promise.all(promises)
}

export default withConcurrency
