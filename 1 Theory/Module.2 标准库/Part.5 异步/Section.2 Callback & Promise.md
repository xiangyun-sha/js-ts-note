# 回调函数与 Promise

[TOC]

---

回调函数和 Promise 是 JavaScript 中处理异步操作的两种核心模式。回调函数是最早的异步实现方式，而 Promise 是 ES6 引入的更优雅的解决方案，旨在解决回调地狱问题，并提供更强大的错误处理和组合能力。理解两者的关系与差异，是掌握现代 JavaScript 异步编程的关键。

---

## 1. 回调函数（Callback Function）

### 1.1 什么是回调函数？

**回调函数**是指作为参数传递给另一个函数，并在某个时刻被“调回来”执行的函数。在 JavaScript 中，函数是一等公民，因此可以轻松地传递函数作为参数。

```javascript
function greet(name, callback) {
  console.log('Hello, ' + name);
  callback(); // 调用回调
}
greet('Alice', function() {
  console.log('回调执行完毕');
});
```

### 1.2 回调的常见使用场景

- **异步操作**：如定时器、网络请求、文件读写（Node.js）。
- **事件处理**：如 DOM 元素的事件监听。
- **高阶函数**：如数组的 `forEach`、`map`、`filter` 等。

```javascript
// 异步回调示例
setTimeout(() => {
  console.log('延迟执行');
}, 1000);

// 事件回调
button.addEventListener('click', () => {
  console.log('按钮被点击');
});
```

### 1.3 回调地狱（Callback Hell）

当多个异步操作需要依次执行时，就会出现多层嵌套的回调，导致代码难以阅读和维护，俗称“回调地狱”或“金字塔噩梦”。

```javascript
getUser(userId, (user) => {
  getPosts(user.id, (posts) => {
    getComments(posts[0].id, (comments) => {
      console.log(comments);
    });
  });
});
```

### 1.4 回调的缺点

- **可读性差**：嵌套层次深，代码横向增长。
- **错误处理困难**：每个回调都需要单独处理错误，且错误容易在链中丢失。
- **控制反转**：将控制权交给被调用函数，信任问题（信任回调会被调用、不会多次调用等）。
- **并发处理复杂**：同时等待多个异步操作时，需要手动计数。

---

## 2. Promise

### 2.1 什么是 Promise？

**Promise** 是 ES6 引入的用于表示异步操作最终完成或失败的对象。它是一个代理，代表一个可能现在、将来或永远不可用的值。Promise 提供统一的 API，使得异步代码可以像同步代码一样组合和错误处理。

### 2.2 Promise 的状态

一个 Promise 对象有三种状态：

- **pending（进行中）**：初始状态，既未完成也未拒绝。
- **fulfilled（已成功）**：操作成功完成。
- **rejected（已失败）**：操作失败。

状态只能从 pending 变为 fulfilled 或 rejected，且一旦改变便不可逆转。

### 2.3 创建 Promise

使用 `new Promise` 构造函数，传入一个执行器函数（executor），该函数接收两个参数：`resolve` 和 `reject`，分别用于将状态改为 fulfilled 或 rejected。

```javascript
const promise = new Promise((resolve, reject) => {
  // 异步操作
  setTimeout(() => {
    const success = true;
    if (success) {
      resolve('操作成功');
    } else {
      reject(new Error('操作失败'));
    }
  }, 1000);
});
```

### 2.4 使用 Promise：`then`、`catch`、`finally`

- **`then(onFulfilled, onRejected)`**：添加成功和失败的回调，返回一个新的 Promise。
- **`catch(onRejected)`**：添加失败的回调，相当于 `then(null, onRejected)`。
- **`finally(onFinally)`**：无论成功或失败都会执行的回调，不接收参数，返回原 Promise 以便继续链式调用。

```javascript
promise
  .then(result => {
    console.log('成功:', result);
  })
  .catch(error => {
    console.error('失败:', error);
  })
  .finally(() => {
    console.log('操作结束');
  });
```

### 2.5 链式调用

`then` 和 `catch` 都返回新的 Promise，因此可以链式调用，解决了回调地狱问题。

```javascript
getUser(userId)
  .then(user => getPosts(user.id))
  .then(posts => getComments(posts[0].id))
  .then(comments => {
    console.log(comments);
  })
  .catch(error => {
    console.error('出错了', error);
  });
```

链式中，每个 `then` 都可以返回一个值（被包装成 resolved Promise）或一个新的 Promise，实现数据传递和异步串联。

### 2.6 错误处理

Promise 的错误具有“冒泡”特性，可以在链尾统一捕获，无需每个步骤单独处理。

```javascript
doSomething()
  .then(result => doSomethingElse(result))
  .then(newResult => doThirdThing(newResult))
  .catch(error => console.error('任何一步出错都会到这里'));
```

### 2.7 静态方法

Promise 提供了多个静态方法用于处理多个 Promise 实例。

| 方法                                    | 描述                                                                    |
| --------------------------------------- | ----------------------------------------------------------------------- |
| `Promise.resolve(value)`                | 返回一个以给定值 resolved 的 Promise 对象。                             |
| `Promise.reject(reason)`                | 返回一个以给定原因 rejected 的 Promise 对象。                           |
| `Promise.all(iterable)`                 | 所有 Promise 成功则返回所有结果的数组；任一失败则返回第一个失败的原因。 |
| `Promise.allSettled(iterable)` (ES2020) | 等待所有 Promise 完成（无论成功或失败），返回每个结果的状态和值/原因。  |
| `Promise.race(iterable)`                | 返回第一个完成的 Promise（无论是成功还是失败）。                        |
| `Promise.any(iterable)` (ES2021)        | 返回第一个成功的 Promise；如果全部失败，则返回 AggregateError。         |

```javascript
// 并发执行多个异步操作，等待所有完成
Promise.all([fetchUser(), fetchPosts()])
  .then(([user, posts]) => {
    console.log(user, posts);
  })
  .catch(error => {
    console.error('至少一个操作失败', error);
  });

// 等待所有完成（包括失败）
Promise.allSettled([fetchUser(), fetchPosts()])
  .then(results => {
    results.forEach(result => {
      if (result.status === 'fulfilled') {
        console.log('成功:', result.value);
      } else {
        console.log('失败:', result.reason);
      }
    });
  });
```

### 2.8 Promise 与微任务

Promise 的回调（`then`、`catch`、`finally`）属于**微任务**（microtask）。这意味着在当前宏任务执行完后、下一个宏任务开始前，会清空所有微任务。这解释了为什么 Promise 的回调比 `setTimeout` 的宏任务执行得更早。

```javascript
setTimeout(() => console.log('宏任务'), 0);
Promise.resolve().then(() => console.log('微任务'));
console.log('同步');
// 输出顺序：同步 -> 微任务 -> 宏任务
```

---

## 3. 回调 vs Promise

| 维度         | 回调                               | Promise                       |
| ------------ | ---------------------------------- | ----------------------------- |
| **可读性**   | 嵌套深，难以阅读                   | 链式调用，扁平化结构          |
| **错误处理** | 每个回调内单独处理，容易遗漏       | 统一 `catch`，错误冒泡        |
| **信任问题** | 控制反转，需信任库不会多次调用回调 | 状态不可逆，保证只调用一次    |
| **并发控制** | 需要手动计数或使用第三方库         | 内置 `Promise.all`、`race` 等 |
| **组合能力** | 弱，手动嵌套                       | 强，可链式组合                |
| **调试**     | 堆栈信息不清晰                     | 较好的堆栈跟踪（但仍需改进）  |

---

## 4. 将回调转换为 Promise

在实际开发中，许多旧版 API 仍使用回调模式（如 Node.js 的 `fs.readFile`）。可以通过手动封装或使用 `util.promisify`（Node.js）将其转换为 Promise。

### 4.1 手动封装

```javascript
function readFilePromise(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, 'utf8', (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
}
```

### 4.2 `util.promisify`（Node.js）

Node.js 内置的 `util.promisify` 可以将遵循 Node.js 回调风格（错误优先）的函数转换为 Promise 版本。

```javascript
const { promisify } = require('util');
const readFile = promisify(fs.readFile);
readFile('file.txt', 'utf8').then(data => console.log(data));
```

---

## 5. async/await：Promise 的语法糖

ES2017 引入了 `async/await`，它基于 Promise，提供了更接近同步代码的编写方式。

- **`async function`**：声明一个异步函数，它总是返回一个 Promise。
- **`await`**：等待一个 Promise 完成，并返回其 fulfilled 值；只能在 `async` 函数内部使用。

```javascript
async function process() {
  try {
    const user = await getUser(userId);
    const posts = await getPosts(user.id);
    const comments = await getComments(posts[0].id);
    console.log(comments);
  } catch (error) {
    console.error('出错了', error);
  }
}
```

`async/await` 使异步代码看起来像同步代码，但仍保持非阻塞特性。

---

## 6. 最佳实践

### 6.1 优先使用 Promise 和 async/await

除非需要极低延迟的极端情况，否则应使用 Promise 或 async/await 提高代码可读性和可维护性。

### 6.2 始终处理错误

在 Promise 链末尾添加 `catch`，或在 async 函数中使用 `try/catch`。

### 6.3 避免不必要的 Promise 构造函数

如果已有 Promise 返回的函数，直接链式调用，不要再用 `new Promise` 包裹，这被称为“Promise 反模式”。

```javascript
// 反模式
function bad() {
  return new Promise((resolve, reject) => {
    fs.readFile('file.txt', (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
}
// 更好的方式：使用 promisify 或直接返回 Promise
```

### 6.4 并发使用 `Promise.all`，串行使用 `await`

需要同时发起多个独立异步操作时，使用 `Promise.all` 提高效率；需要顺序依赖时，使用 `await` 依次执行。

### 6.5 在循环中谨慎使用 `await`

如果循环内的异步操作不需要顺序执行，应使用 `Promise.all` 并发执行，避免因串行等待而降低性能。

---

## 小结

- **回调函数** 是 JavaScript 异步编程的基础，但容易导致回调地狱和错误处理困难。
- **Promise** 通过统一的状态管理和链式调用，显著改善了异步代码的可读性和错误处理能力，并提供了强大的并发工具。
- **async/await** 是基于 Promise 的语法糖，使异步代码更加简洁直观。

掌握这些模式，你就能应对各种异步场景，编写出清晰、健壮的 JavaScript 代码。下一节将深入介绍更高级的异步迭代和异步生成器。
