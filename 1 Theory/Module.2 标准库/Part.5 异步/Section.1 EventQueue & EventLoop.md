# 事件队列与事件循环

[TOC]

---

`Event Queue`（事件队列）和 `Event Loop`（事件循环）是 JavaScript 异步编程模型的核心机制。尽管它们不是可以直接调用的 API，但理解它们的工作原理是掌握 JavaScript 执行顺序、避免常见陷阱以及编写高效异步代码的关键。本章将深入剖析事件循环的运作机制、任务分类（宏任务与微任务）以及在不同环境（浏览器/Node.js）中的实现差异。

---

## 1. 概述

### 1.1 为什么需要事件循环？

JavaScript 是**单线程**的，这意味着它同一时间只能执行一个任务 。如果所有任务都是同步的，那么一个耗时操作（如网络请求、文件读取）就会阻塞整个线程，导致页面卡死。为了解决这个问题，JavaScript 引入了**异步**机制，而事件循环就是协调同步任务与异步任务执行的幕后核心 。

### 1.2 核心概念

- **调用栈（Call Stack）**：函数执行的地方，遵循后进先出（LIFO）原则 。
- **堆（Heap）**：对象被分配在堆中，是一个非结构化的内存区域 。
- **任务队列（Task Queue）**：存放待处理的异步任务回调。根据任务类型，又分为**宏任务队列**和**微任务队列** 。
- **事件循环（Event Loop）**：一个不断运行的循环，负责检查调用栈是否为空，并将队列中的任务推入调用栈执行 。

```javascript
// 事件循环的简化模型
while (queue.waitForMessage()) {
  queue.processNextMessage();
}
```

---

## 2. 任务分类：宏任务与微任务

事件循环中的任务分为两大类：**宏任务（MacroTask）** 和 **微任务（MicroTask）** 。

### 2.1 宏任务（MacroTask）

宏任务是由宿主环境（浏览器或 Node.js）发起的任务。每次事件循环只从宏任务队列中取出**一个**任务执行 。

| 环境    | 常见宏任务                                                                                               |
| ------- | -------------------------------------------------------------------------------------------------------- |
| 浏览器  | `setTimeout`、`setInterval`、`setImmediate`（非标准）、I/O、UI 交互事件、`postMessage`、`MessageChannel` |
| Node.js | `setTimeout`、`setInterval`、`setImmediate`、I/O 操作                                                    |

### 2.2 微任务（MicroTask）

微任务是由 JavaScript 引擎自身发起的任务。在当前宏任务执行完毕后、下一个宏任务开始之前，会清空整个微任务队列 。

| 环境    | 常见微任务                                                           |
| ------- | -------------------------------------------------------------------- |
| 浏览器  | `Promise.then/catch/finally`、`MutationObserver`、`queueMicrotask()` |
| Node.js | `process.nextTick`、`Promise.then`                                   |

---

## 3. 浏览器中的事件循环

### 3.1 执行过程

浏览器的事件循环遵循以下顺序 ：

1. **执行当前宏任务**：从宏任务队列中取出**一个**任务执行（通常是整个 `<script>` 代码块作为第一个宏任务）。
2. **执行所有微任务**：检查微任务队列，并依次执行队列中的**所有**微任务。如果在执行微任务的过程中产生了新的微任务，则继续执行，直到微任务队列清空。
3. **更新渲染**（如果需要）：浏览器可能会进行 UI 渲染。
4. **从宏任务队列中取下一个任务**：重复以上步骤。

```javascript
// 事件循环伪代码
while (true) {
  // 1. 执行一个宏任务
  macroTask = macroTaskQueue.shift();
  macroTask();

  // 2. 清空所有微任务
  while (microTaskQueue.length > 0) {
    microTask = microTaskQueue.shift();
    microTask();
  }

  // 3. 可能进行 UI 渲染
  if (needRender) {
    render();
  }
}
```

### 3.2 示例分析

```javascript
console.log('1'); // 同步代码

setTimeout(() => {
  console.log('2'); // 宏任务
}, 0);

Promise.resolve().then(() => {
  console.log('3'); // 微任务
});

console.log('4'); // 同步代码

// 输出顺序：1, 4, 3, 2
```

执行过程 ：

- 当前宏任务（整个 `<script>`）开始执行，输出 `1` 和 `4`。
- 遇到 `setTimeout`，将其回调加入宏任务队列。
- 遇到 `Promise.then`，将其回调加入微任务队列。
- 当前宏任务执行完毕，开始清空微任务队列，输出 `3`。
- 从宏任务队列取出下一个任务（`setTimeout` 回调），输出 `2`。

### 3.3 嵌套任务的执行

```javascript
Promise.resolve().then(() => {
  console.log('1');
  setTimeout(() => {
    console.log('2');
  });
  Promise.resolve().then(() => {
    console.log('3');
    setTimeout(() => {
      console.log('4');
    });
  });
});
console.log('5');
setTimeout(() => {
  console.log('6');
  Promise.resolve().then(() => {
    console.log('7');
  });
});
// 输出：5, 1, 3, 6, 7, 2, 4 
```

关键点：微任务中产生的微任务会在同一轮循环中执行，而宏任务中产生的微任务会在该宏任务执行完毕后立即执行（在下一个宏任务之前）。

---

## 4. Node.js 中的事件循环

Node.js 的事件循环由 **libuv** 库实现，分为多个阶段，每个阶段都有自己的队列 。

### 4.1 六大阶段

```bash
   ┌───────────────────────────┐
┌─>│           timers          │ 执行 setTimeout/setInterval 回调
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │     pending callbacks     │ 执行延迟到下一次循环的 I/O 回调
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │       idle, prepare       │ 仅内部使用
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐      ┌───────────────┐
│  │           poll            │<─────┤  incoming:   │ 获取新的 I/O 事件
│  └─────────────┬─────────────┘      │   connections │
│  ┌─────────────┴─────────────┐      └───────────────┘
│  │           check           │ 执行 setImmediate 回调
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
└──┤      close callbacks      │ 执行 close 事件回调
   └───────────────────────────┘
```

### 4.2 微任务的处理

Node.js 中的微任务分为两个队列 ：

- **Next Tick Queue**：`process.nextTick` 的回调，优先级最高。
- **Other Microtask Queue**：`Promise.then` 等。

在每个阶段之间，Node.js 会清空这两个微任务队列，且先清空 Next Tick Queue，再清空 Other Microtask Queue。

### 4.3 Node.js 与浏览器的差异

| 特性           | 浏览器                 | Node.js                   |
| -------------- | ---------------------- | ------------------------- |
| 宏任务队列     | 一个队列               | 多个队列（每个阶段一个）  |
| 微任务队列     | 一个队列               | 两个队列（nextTick 优先） |
| 执行时机       | 每个宏任务后清空微任务 | 每个阶段后清空微任务      |
| `setImmediate` | 不支持                 | 支持，属于 check 阶段     |

**Node 11.x 后的变化**：Node 11 修改了行为，`setTimeout`、`setImmediate` 等宏任务在执行一个回调后就会检查并执行微任务队列，使行为更接近浏览器 。

---

## 5. 特殊 API 的处理

### 5.1 `requestAnimationFrame`

`requestAnimationFrame`（简称 rAF）既不属于宏任务也不属于微任务。它的回调会在**下次浏览器渲染之前**执行，位于微任务之后、渲染之前 。常用于动画。

执行顺序：宏任务 → 微任务 → requestAnimationFrame → 渲染 → 下一个宏任务

### 5.2 `queueMicrotask`

ES6 提供的 `queueMicrotask` 方法允许开发者手动向微任务队列添加任务。

```javascript
queueMicrotask(() => {
  console.log('这是一个微任务');
});
```

### 5.3 `process.nextTick`（Node.js）

`process.nextTick` 虽然也是异步，但它并不属于事件循环的任何一个阶段，而是在每个阶段之间立即执行，优先级高于 Promise 。

```javascript
process.nextTick(() => {
  console.log('nextTick'); // 最先执行
});
Promise.resolve().then(() => {
  console.log('promise'); // 其次执行
});
```

---

## 6. 常见陷阱与最佳实践

### 6.1 `setTimeout` 的延迟不准确

`setTimeout` 的第二个参数表示**最小延迟时间**，而非确切执行时间 。如果队列中有其他任务，实际执行时间可能更晚。

```javascript
const start = Date.now();
setTimeout(() => {
  console.log(`实际延迟: ${Date.now() - start}ms`);
}, 100);
// 如果前面有耗时任务，实际延迟可能大于 100ms
```

### 6.2 零延迟并不立即执行

`setTimeout(callback, 0)` 意味着将回调加入宏任务队列，等待当前执行栈和微任务队列清空后才执行 。

### 6.3 避免微任务阻塞

由于微任务会在同一轮循环中清空，如果微任务中不断产生新的微任务，会导致宏任务永远无法执行，造成页面卡死。

```javascript
function loop() {
  Promise.resolve().then(loop); // 永远不会执行宏任务
}
loop();
```

### 6.4 使用 `setTimeout` 拆分长任务

如果一个任务执行时间过长，会阻塞用户交互。可以将其拆分为多个宏任务 。

```javascript
// 长任务
for (let i = 0; i < 1e9; i++) { /* ... */ }

// 拆分为多个小块
let i = 0;
function processChunk() {
  const chunkSize = 1000;
  for (let j = 0; j < chunkSize && i < 1e9; j++, i++) {
    // 处理
  }
  if (i < 1e9) {
    setTimeout(processChunk, 0); // 让出主线程
  }
}
processChunk();
```

### 6.5 理解 `async/await` 的微任务特性

`await` 后面的代码相当于 `Promise.then` 中的回调，属于微任务 。

```javascript
async function test() {
  console.log('1');
  await Promise.resolve();
  console.log('2'); // 微任务
}
test();
console.log('3');
// 输出：1, 3, 2
```

---

## 7. 总结

| 概念             | 描述                                           |
| ---------------- | ---------------------------------------------- |
| **调用栈**       | 执行同步代码的地方                             |
| **宏任务队列**   | 存放 `setTimeout`、I/O、UI 事件等回调          |
| **微任务队列**   | 存放 `Promise.then`、`MutationObserver` 等回调 |
| **事件循环**     | 不断检查调用栈，协调任务执行的机制             |
| **浏览器模型**   | 每个宏任务后清空所有微任务                     |
| **Node.js 模型** | 多个宏任务阶段，每个阶段后清空微任务           |

理解事件循环和任务队列，是掌握 JavaScript 异步编程的基石。在实际开发中，合理利用微任务和宏任务的执行顺序，可以避免许多难以排查的 bug，并优化应用性能。
