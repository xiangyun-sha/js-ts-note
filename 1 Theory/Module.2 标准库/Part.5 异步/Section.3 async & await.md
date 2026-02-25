# async/await

[TOC]

---

`async/await` 是 ES2017（ES8）引入的用于简化 Promise 使用的语法糖。它让我们能够以近乎同步的方式编写异步代码，同时保留 Promise 的强大功能和组合能力。`async/await` 建立在 Promise 之上，使异步代码更易读、更易调试，并且避免了复杂的 Promise 链式调用。

---

## 1. 概述

### 1.1 为什么需要 async/await？

尽管 Promise 极大地改善了回调地狱问题，但链式调用在处理复杂业务逻辑时仍可能显得冗长，且错误处理不够直观。`async/await` 将异步代码写成同步形式，提升了可读性，并让错误处理回归到熟悉的 `try/catch` 结构。

```javascript
// 使用 Promise 链
function getData() {
  return fetch('/user')
    .then(response => response.json())
    .then(user => fetch(`/posts/${user.id}`))
    .then(response => response.json())
    .catch(err => console.error(err));
}

// 使用 async/await
async function getData() {
  try {
    const userResponse = await fetch('/user');
    const user = await userResponse.json();
    const postsResponse = await fetch(`/posts/${user.id}`);
    const posts = await postsResponse.json();
    return posts;
  } catch (err) {
    console.error(err);
  }
}
```

### 1.2 核心思想

- `async` 关键字声明一个函数为异步函数，使其自动返回一个 Promise。
- `await` 关键字用于等待一个 Promise 解决（fulfilled），并返回其值；如果 Promise 被拒绝（rejected），则抛出异常。

---

## 2. async 函数

### 2.1 定义

在函数声明、函数表达式、箭头函数或对象方法前加上 `async` 关键字，该函数就变成了异步函数。

```javascript
// 函数声明
async function foo() {}

// 函数表达式
const bar = async function() {};

// 箭头函数
const baz = async () => {};

// 对象方法
const obj = {
  async method() {}
};

// 类方法
class MyClass {
  async myMethod() {}
}
```

### 2.2 返回值

- 如果 `async` 函数显式返回一个非 Promise 值，该值会被自动包装成 `Promise.resolve(value)`。
- 如果返回一个 Promise，则直接返回该 Promise。
- 如果函数体内抛出异常，则返回一个被拒绝的 Promise。

```javascript
async function fn1() {
  return 42;
}
fn1().then(console.log); // 42

async function fn2() {
  throw new Error('Oops');
}
fn2().catch(err => console.log(err.message)); // Oops
```

### 2.3 执行顺序

`async` 函数体内的代码是同步执行的，直到遇到第一个 `await`。`await` 之后的代码会被推迟到微任务队列中执行。

```javascript
async function test() {
  console.log('1');
  await Promise.resolve();
  console.log('2');
}
console.log('3');
test();
console.log('4');
// 输出顺序：3, 1, 4, 2
```

---

## 3. await 表达式

### 3.1 语法

`await` 后面通常跟一个 Promise 对象。它也可以跟任何值，此时该值会被隐式转换为 `Promise.resolve(value)`。

```javascript
async function example() {
  const result1 = await Promise.resolve(123); // result1 = 123
  const result2 = await 456;                   // result2 = 456（等价于 await Promise.resolve(456)）
}
```

### 3.2 执行机制

- 当遇到 `await` 时，`async` 函数的执行会暂停，并将控制权交还给调用者。
- `await` 等待的 Promise 解决后，函数的执行会从暂停处恢复，并将 Promise 的值作为 `await` 表达式的返回值。
- 如果等待的 Promise 被拒绝，则 `await` 表达式会抛出异常，可以通过 `try/catch` 捕获。

### 3.3 只能在 async 函数内使用

`await` 关键字只能在 `async` 函数内部使用（除了 ES2022 的顶层 await）。在普通函数中使用会引发语法错误。

```javascript
function bad() {
  await Promise.resolve(); // SyntaxError
}
```

---

## 4. 错误处理

### 4.1 try/catch 捕获错误

使用传统的 `try/catch` 块可以捕获 `await` 表达式中 Promise 的拒绝。

```javascript
async function fetchData() {
  try {
    const response = await fetch('https://api.example.com/data');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('请求失败:', error);
    // 可以选择重新抛出或返回默认值
  }
}
```

### 4.2 多个 await 的异常处理

如果多个 `await` 连续出现，任何一个被拒绝都会导致整个函数停止，并进入 `catch` 块。

```javascript
async function sequential() {
  try {
    const a = await step1();
    const b = await step2(a);
    const c = await step3(b);
    return c;
  } catch (error) {
    // 任何一步出错都会进入这里
  }
}
```

如果希望部分失败不影响其他步骤，可以使用 `try/catch` 包裹单个 `await`。

### 4.3 不使用 try/catch 的错误处理

`async` 函数返回一个 Promise，因此也可以附加 `.catch()` 来处理错误。

```javascript
async function risky() {
  const result = await mightFail();
  return result;
}
risky().catch(error => {
  console.error('出错了:', error);
});
```

但为了代码清晰，通常建议在函数内部使用 `try/catch`。

---

## 5. 并发执行

### 5.1 错误地顺序等待

如果多个异步操作没有依赖关系，但写成顺序 `await`，会导致不必要的等待时间。

```javascript
// 低效：两个请求串行执行
async function fetchBoth() {
  const user = await fetchUser();
  const posts = await fetchPosts(); // 等待 fetchUser 完成后才发起
  return { user, posts };
}
```

### 5.2 使用 Promise.all 并发

正确的做法是同时发起请求，然后使用 `Promise.all` 等待所有完成。

```javascript
// 高效：并发执行
async function fetchBoth() {
  const userPromise = fetchUser();
  const postsPromise = fetchPosts();
  const [user, posts] = await Promise.all([userPromise, postsPromise]);
  return { user, posts };
}
```

### 5.3 Promise.allSettled / any / race

类似地，可以使用其他 Promise 组合方法处理不同并发需求。

```javascript
async function getFirstSuccess() {
  const result = await Promise.any([fetchFromA(), fetchFromB()]);
  return result;
}
```

---

## 6. 循环中的 async/await

### 6.1 for 循环中的顺序执行

在 `for`、`while` 等循环中，可以使用 `await` 实现顺序迭代，但注意这会串行执行。

```javascript
async function processItems(items) {
  const results = [];
  for (const item of items) {
    const result = await asyncProcess(item); // 等待前一个完成才继续
    results.push(result);
  }
  return results;
}
```

### 6.2 并发循环

如果循环内的迭代不需要顺序执行，应使用 `Promise.all` 并发执行。

```javascript
async function processItems(items) {
  const promises = items.map(item => asyncProcess(item));
  const results = await Promise.all(promises);
  return results;
}
```

### 6.3 forEach 与 await 的陷阱

`Array.prototype.forEach` 不支持 `await`，因为它不会等待异步操作完成。

```javascript
// 错误：forEach 中的 await 不会等待
async function bad(items) {
  items.forEach(async item => {
    await asyncProcess(item); // 不会等待，forEach 立即返回
  });
  console.log('完成'); // 可能早于 asyncProcess 完成
}
```

应该使用 `for...of` 或 `Promise.all` 替代。

---

## 7. 顶层 await（ES2022）

在 ES2022 之前，`await` 只能在 `async` 函数内使用。ES2022 引入了**顶层 await**，允许在模块的顶层直接使用 `await`。

```javascript
// 在 ES 模块中
const response = await fetch('https://api.example.com/data');
const data = await response.json();
export default data;
```

- 顶层 await 只能在 ES 模块中使用（通过 `<script type="module">` 或在 Node.js 中启用 `"type": "module"`）。
- 它会导致模块等待异步操作完成后再执行依赖该模块的其他模块。
- 简化了模块初始化时的异步加载。

---

## 8. async/await 与 thenable

`await` 不仅可以等待 Promise，还可以等待任何**thenable**对象（即具有 `then` 方法的对象）。这允许与旧式异步库互操作。

```javascript
const thenable = {
  then(resolve, reject) {
    setTimeout(() => resolve('完成'), 1000);
  }
};
async function test() {
  const result = await thenable; // 有效
  console.log(result); // 完成
}
```

---

## 9. 性能与注意事项

### 9.1 性能开销

`async/await` 本质上仍是 Promise，额外的开销微乎其微，可以忽略不计。与手写 Promise 链相比，可读性的提升远大于微小的性能差异。

### 9.2 避免不必要的串行

如前所述，注意区分串行与并行的需求，使用 `Promise.all` 提高效率。

### 9.3 错误处理完整性

确保每个可能失败的 `await` 都被捕获，否则错误会传播到函数返回的 Promise，可能导致未处理的拒绝。

### 9.4 调试体验

`async/await` 使异步代码在调用栈中表现得像同步代码，调试时更容易定位问题。现代开发者工具对 `async/await` 的支持很好。

### 9.5 与旧版回调的集成

对于基于回调的 API，可以先将其 Promise 化（例如使用 `util.promisify`），然后使用 `await`。

---

## 10. 示例实战

### 10.1 获取用户及其好友

```javascript
async function getUserWithFriends(userId) {
  try {
    const user = await fetchUser(userId);
    const friendPromises = user.friendIds.map(id => fetchUser(id));
    const friends = await Promise.all(friendPromises);
    return { ...user, friends };
  } catch (error) {
    console.error('获取用户或好友失败', error);
    throw error; // 重新抛出以便调用者处理
  }
}
```

### 10.2 带超时的请求

```javascript
function fetchWithTimeout(url, timeout = 5000) {
  return Promise.race([
    fetch(url),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('请求超时')), timeout)
    )
  ]);
}

async function loadData() {
  try {
    const response = await fetchWithTimeout('/api/data');
    const data = await response.json();
    return data;
  } catch (err) {
    console.error('加载失败:', err);
  }
}
```

### 10.3 重试机制

```javascript
async function fetchWithRetry(url, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (err) {
      if (i === maxRetries - 1) throw err;
      console.log(`第 ${i + 1} 次失败，重试...`);
    }
  }
}
```

---

## 11. 与 Promise 的对比总结

| 特性         | Promise                  | async/await                        |
| ------------ | ------------------------ | ---------------------------------- |
| **语法**     | 链式调用                 | 同步风格                           |
| **错误处理** | `.catch()`               | `try/catch`                        |
| **组合**     | `Promise.all`、`race` 等 | 结合 `await` 和 `Promise` 静态方法 |
| **条件分支** | 需在 then 中写 if-else   | 自然的 if-else                     |
| **循环**     | 需要递归或 `Promise.all` | `for` 循环 + `await`               |
| **调试**     | 调用栈复杂               | 调用栈清晰                         |
| **返回值**   | Promise                  | 普通值（函数返回 Promise）         |

`async/await` 是 Promise 的语法糖，并未取代 Promise，而是让 Promise 的使用更加方便。

---

## 小结

- **`async` 函数**：声明一个异步函数，返回 Promise。
- **`await` 表达式**：暂停函数执行，等待 Promise 解决，返回结果或抛出异常。
- **错误处理**：使用 `try/catch` 捕获异步错误。
- **并发**：用 `Promise.all` 等结合 `await` 实现并发。
- **循环**：注意 `forEach` 的陷阱，优先用 `for...of` 或 `Promise.all`。
- **顶层 await**：在模块顶层直接使用 `await`。

掌握 `async/await` 将使你的异步代码简洁、直观且易于维护。它是现代 JavaScript 开发中不可或缺的工具。
