# 异步迭代与异步循环

[TOC]

---

异步迭代（Async Iteration）是 ECMAScript 2018（ES9）引入的特性，它扩展了迭代器协议以支持异步数据源。当我们需要处理分页 API、流式数据、文件逐行读取或任何按需产生异步结果的场景时，异步迭代提供了一种优雅且直观的方式。本章将深入介绍异步迭代器、`for await...of` 循环以及异步生成器函数，帮助你高效地处理异步数据序列。

---

## 1. 为什么需要异步迭代？

传统的同步迭代器适用于已经存在内存中的数据集合（如数组、Map、Set）。然而，在实际开发中，数据往往是逐步到达的：

- 从网络分页获取用户列表，每次请求返回一页。
- 逐行读取一个大文件，每行可能需要异步读取。
- 监听实时数据流（如 WebSocket、事件源）。

如果使用 Promise 和递归处理，代码会变得复杂且难以维护。异步迭代器正是为了解决这类问题而设计的，它允许我们像处理同步集合一样自然地处理异步数据源。

```javascript
// 同步迭代
for (const item of array) {
  console.log(item);
}

// 异步迭代（想象中）
for await (const chunk of stream) {
  console.log(chunk);
}
```

---

## 2. 异步迭代器与异步可迭代对象

### 2.1 核心协议

异步迭代器协议与同步迭代器协议类似，但关键方法 `next()` 返回的是一个 `Promise`，该 Promise 解析为 `{ value, done }` 对象。

| 协议       | 同步                                         | 异步                                                  |
| ---------- | -------------------------------------------- | ----------------------------------------------------- |
| 迭代器     | 对象具有 `next()` 方法返回 `{ value, done }` | 对象具有 `next()` 方法返回 `Promise<{ value, done }>` |
| 可迭代对象 | 对象具有 `Symbol.iterator` 方法返回迭代器    | 对象具有 `Symbol.asyncIterator` 方法返回异步迭代器    |

### 2.2 实现自定义异步可迭代对象

通过实现 `[Symbol.asyncIterator]` 方法，我们可以创建自定义的异步可迭代对象。

```javascript
const asyncIterable = {
  [Symbol.asyncIterator]() {
    let count = 0;
    return {
      next() {
        if (count < 3) {
          return new Promise(resolve => {
            setTimeout(() => resolve({ value: count++, done: false }), 1000);
          });
        }
        return Promise.resolve({ done: true });
      }
    };
  }
};

// 使用 for await...of 消费
(async () => {
  for await (const num of asyncIterable) {
    console.log(num); // 依次输出 0, 1, 2（每隔1秒）
  }
})();
```

### 2.3 内置异步可迭代对象

某些 JavaScript 内置对象已经实现了异步迭代器，例如：

- **`ReadableStream`**（浏览器中的流）
- **`Node.js` 的 `Readable` 流**（通过 `stream.Readable` 的 `Symbol.asyncIterator`）

```javascript
// Node.js 中逐行读取文件
import { createReadStream } from 'fs';
import { createInterface } from 'readline';

const rl = createInterface({
  input: createReadStream('file.txt'),
  crlfDelay: Infinity
});

for await (const line of rl) {
  console.log(line);
}
```

---

## 3. `for await...of` 循环

### 3.1 语法

`for await...of` 用于遍历异步可迭代对象。它只能在 `async` 函数或模块顶层（支持顶层 await）中使用。

```javascript
for await (const variable of asyncIterable) {
  // 每次迭代会等待 Promise 解析
}
```

### 3.2 执行流程

每次循环都会等待当前 `next()` 返回的 Promise 完成，然后取出 `value` 赋值给变量。如果 Promise 被拒绝，循环会抛出异常，可以用 `try/catch` 捕获。

```javascript
async function process() {
  try {
    for await (const value of asyncIterable) {
      console.log(value);
    }
  } catch (err) {
    console.error('迭代出错', err);
  }
}
```

### 3.3 与普通 `for...of` 的区别

| 特性     | `for...of`       | `for await...of`                 |
| -------- | ---------------- | -------------------------------- |
| 适用对象 | 同步可迭代对象   | 异步可迭代对象                   |
| 等待机制 | 不等待，直接取值 | 每次迭代等待 Promise 完成        |
| 使用环境 | 任何函数         | 必须在 async 函数或顶层 await 中 |

---

## 4. 异步生成器函数

异步生成器函数是生成器函数和异步函数的结合，它同时使用 `async function*` 声明。调用异步生成器函数会返回一个异步迭代器。

### 4.1 基本语法

```javascript
async function* asyncGenerator() {
  let i = 0;
  while (i < 3) {
    // 可以 await 其他异步操作
    await new Promise(resolve => setTimeout(resolve, 1000));
    yield i++; // yield 的值会被包装成 Promise
  }
}

// 使用
(async () => {
  for await (const num of asyncGenerator()) {
    console.log(num); // 每隔1秒输出 0, 1, 2
  }
})();
```

### 4.2 特性

- 内部可以同时使用 `await` 和 `yield`。
- `yield` 的值会被自动包装成 `Promise.resolve()`。
- 返回值是一个异步迭代器，其 `next()` 方法返回 Promise。
- 可以用 `return` 提前结束，并设置最终 `value`。

### 4.3 与普通生成器的对比

| 特性           | 普通生成器        | 异步生成器                 |
| -------------- | ----------------- | -------------------------- |
| 声明           | `function*`       | `async function*`          |
| next 返回值    | `{ value, done }` | `Promise<{ value, done }>` |
| 内部可用 await | 否                | 是                         |
| 消费方式       | `for...of`        | `for await...of`           |

---

## 5. 错误处理

### 5.1 在 `for await...of` 循环中捕获错误

```javascript
async function safeProcess(asyncIterable) {
  try {
    for await (const value of asyncIterable) {
      console.log(value);
    }
  } catch (error) {
    console.error('迭代过程出错:', error);
  }
}
```

### 5.2 在异步生成器内部处理错误

```javascript
async function* resilientGenerator() {
  let i = 0;
  while (i < 5) {
    try {
      // 模拟可能失败的操作
      if (i === 2) throw new Error('出错了');
      yield i;
    } catch (err) {
      console.error('生成器内部捕获:', err);
      // 可以选择继续或终止
      yield '错误已处理';
    } finally {
      i++;
    }
  }
}
```

### 5.3 向生成器注入错误

通过调用 `throw()` 方法可以向生成器内部注入错误，这会影响 `for await...of` 的行为。

---

## 6. 实际应用示例

### 6.1 分页 API 数据获取

```javascript
async function* fetchPaginatedData(apiUrl, pageSize = 10) {
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const response = await fetch(`${apiUrl}?page=${page}&limit=${pageSize}`);
    const data = await response.json();
    if (data.items.length === 0) {
      hasMore = false;
    } else {
      for (const item of data.items) {
        yield item;
      }
      page++;
    }
  }
}

// 使用
(async () => {
  for await (const user of fetchPaginatedData('/api/users')) {
    console.log(user.name);
  }
})();
```

### 6.2 逐行读取大文件（Node.js）

```javascript
import { createReadStream } from 'fs';
import { createInterface } from 'readline';

async function* readLines(filePath) {
  const rl = createInterface({
    input: createReadStream(filePath),
    crlfDelay: Infinity
  });

  for await (const line of rl) {
    yield line;
  }
}

(async () => {
  for await (const line of readLines('huge.log')) {
    console.log('处理行:', line);
  }
})();
```

### 6.3 实时数据流（WebSocket）

```javascript
async function* createMessageStream(wsUrl) {
  const ws = new WebSocket(wsUrl);
  const messageQueue = [];
  let resolveCurrent = null;

  ws.onmessage = (event) => {
    if (resolveCurrent) {
      resolveCurrent(event.data);
      resolveCurrent = null;
    } else {
      messageQueue.push(event.data);
    }
  };

  try {
    while (true) {
      if (messageQueue.length > 0) {
        yield messageQueue.shift();
      } else {
        const nextMessage = await new Promise(resolve => {
          resolveCurrent = resolve;
        });
        yield nextMessage;
      }
    }
  } finally {
    ws.close();
  }
}

// 使用
for await (const msg of createMessageStream('wss://example.com')) {
  console.log('收到:', msg);
}
```

---

## 7. 并发控制与性能

### 7.1 异步迭代天然串行

`for await...of` 每次迭代会等待当前项处理完毕后才请求下一项。这在某些场景下是期望的（如需要顺序处理），但如果处理每个项本身是异步且相互独立，串行可能导致效率低下。

### 7.2 并发处理

如果希望并发处理多个异步项，可以使用 `Promise.all` 和缓冲区技术。

```javascript
async function processConcurrently(asyncIterable, concurrency = 3) {
  const iterator = asyncIterable[Symbol.asyncIterator]();
  const workers = new Array(concurrency).fill(iterator).map(async (it) => {
    const results = [];
    while (true) {
      const { value, done } = await it.next();
      if (done) break;
      // 处理 value
      const processed = await expensiveTask(value);
      results.push(processed);
    }
    return results;
  });

  const allResults = await Promise.all(workers);
  return allResults.flat();
}
```

但这种模式较为复杂，通常需要引入专门的库或自定义实现。

### 7.3 背压（Backpressure）

当生产者速度远快于消费者时，异步迭代器天然支持背压，因为消费者每次通过 `await` 拉取数据，生产者需要等待消费者请求才会产生下一项。

---

## 8. 与同步迭代的互操作

### 8.1 将同步可迭代对象转换为异步

可以使用异步生成器简单包装：

```javascript
async function* toAsyncIterable(syncIterable) {
  for (const item of syncIterable) {
    yield item; // 自动包装为 Promise
  }
}

for await (const item of toAsyncIterable([1, 2, 3])) {
  console.log(item);
}
```

### 8.2 将异步可迭代对象转换为数组

使用 `Array.fromAsync`（ES2023，提案阶段）或手动收集：

```javascript
// 手动收集
async function collect(asyncIterable) {
  const results = [];
  for await (const value of asyncIterable) {
    results.push(value);
  }
  return results;
}

// 使用 Array.fromAsync（如果支持）
const array = await Array.fromAsync(asyncIterable);
```

---

## 9. 注意事项与最佳实践

### 9.1 确保迭代器正确关闭

如果提前退出循环（如使用 `break`、`return` 或抛出错误），JavaScript 引擎会调用迭代器的 `return()` 方法（如果存在），允许进行清理操作（如关闭文件、WebSocket）。

```javascript
async function* withCleanup() {
  try {
    // 生产数据
    yield 1;
    yield 2;
  } finally {
    console.log('清理资源');
  }
}

(async () => {
  for await (const val of withCleanup()) {
    if (val === 2) break; // 触发 finally
  }
})();
```

### 9.2 避免在异步生成器中执行耗时同步操作

异步生成器的主要目的是处理异步任务，如果在内部执行大量同步计算，会阻塞事件循环。应将同步计算移出或使用 `setImmediate` / `queueMicrotask` 分割。

### 9.3 使用 `for await...of` 替代递归

之前常用递归处理异步流，现在优先使用 `for await...of`，代码更简洁且不易出错。

### 9.4 注意顶层 `for await...of`

在 ES 模块中，可以直接使用 `for await...of` 而不需要包裹在 async 函数中（依赖顶层 await 支持）。

```javascript
// 在 ES 模块中
for await (const line of readLines('file.txt')) {
  console.log(line);
}
```

### 9.5 性能考量

异步迭代的每次循环都有微小的开销（Promise 调度），但对于大多数 I/O 密集型任务可以忽略。如果性能极其敏感，可以考虑使用回调或事件流。

---

## 小结

异步迭代为处理异步数据序列提供了统一且优雅的抽象。通过 `for await...of` 循环、`Symbol.asyncIterator` 协议和异步生成器函数，我们可以像操作同步集合一样自然地消费分页数据、文件流、实时消息等。掌握这一特性，将使你在面对复杂异步流时更加得心应手。

| 概念                   | 作用                                                    |
| ---------------------- | ------------------------------------------------------- |
| `Symbol.asyncIterator` | 定义异步可迭代对象                                      |
| 异步迭代器             | 具有返回 Promise 的 `next()` 方法的对象                 |
| `for await...of`       | 消费异步可迭代对象的循环语法                            |
| `async function*`      | 生成异步迭代器的函数，内部可同时使用 `await` 和 `yield` |

下一节我们将深入探讨异步迭代的高级应用，包括如何与现有库集成以及构建自己的异步数据管道。
