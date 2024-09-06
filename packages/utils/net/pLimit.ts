import { invariant } from "@transquant/utils";
/**
 * @param concurrency
 * 并发控制
 */

type Fn = (...args: any) => Promise<unknown>;

const pLimit = (concurrency: number = Number.POSITIVE_INFINITY) => {
  if (
    !(
      (Number.isInteger(concurrency) ||
        concurrency === Number.POSITIVE_INFINITY) &&
      concurrency > 0
    )
  ) {
    invariant(false, "Expected `concurrency` to be a number from 1 and up");
  }

  const queue: Fn[] = [];
  let activeCount = 0;

  const next = () => {
    activeCount--;

    if (queue.length > 0) {
      queue.shift()!();
    }
  };

  const run = async (
    fn: Fn,
    resolve: (value: Promise<unknown>) => void,
    ...args: any
  ) => {
    activeCount++;

    const result = (async () => fn(...args))();

    resolve(result);

    try {
      await result;
    } catch {
      invariant(
        false,
        "Unexpected error occurred during asynchronous function execution"
      );
    }

    next();
  };

  const enqueue = (
    fn: Fn,
    resolve: (value: Promise<unknown>) => void,
    ...args: any
  ) => {
    queue.push(run.bind(null, fn, resolve, ...args));

    (async () => {
      await Promise.resolve();

      if (activeCount < concurrency && queue.length > 0) {
        queue.shift()!();
      }
    })();
  };

  const generator = (fn: Fn, ...args: any) => {
    return new Promise((resolve) => {
      enqueue(fn, resolve, ...args);
    });
  };

  Object.defineProperties(generator, {
    activeCount: {
      get: () => activeCount,
    },
    pendingCount: {
      get: () => queue.length,
    },
    clearQueue: {
      value: () => {
        queue.length = 0;
      },
    },
  });

  return generator;
};

export default pLimit;

/**
* 示例
  const limit = pLimit(2);

  function asyncFun(value: string, delay: number) {
    return new Promise((resolve) => {
      console.log(`start ${value}`);
      setTimeout(() => resolve(value), delay);
    });
  }

  (async function () {
    const arr = [
      limit(() => asyncFun("aaa", 2000)),
      limit(() => asyncFun("bbb", 3000)),
      limit(() => asyncFun("ccc", 1000)),
      limit(() => asyncFun("ccc", 1000)),
      limit(() => asyncFun("ccc", 1000)),
    ];

    const result = await Promise.all(arr);
    console.log(result);
  })();
 */
