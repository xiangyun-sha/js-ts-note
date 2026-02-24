# 模块化

[TOC]

---

随着 JavaScript 应用规模不断扩大，将代码分割为独立、可复用的模块变得至关重要。模块化不仅帮助开发者组织代码、避免命名冲突，还能管理依赖关系，提升可维护性和可测试性。本章将系统介绍 JavaScript 模块化的演变历程、主流规范（CommonJS、AMD、ES6 模块）以及现代开发中的最佳实践。

---

## 1. 模块化概述

### 1.1 什么是模块化？

模块化是指将程序拆分为多个功能独立的文件（模块），每个模块负责特定的功能，并通过明确的接口与其他模块交互。每个模块都有自己的作用域，不会污染全局环境。

### 1.2 模块化的好处

- **封装**：模块内部实现细节对外隐藏，只暴露必要接口。
- **复用**：一个模块可以在多个项目中重复使用。
- **依赖管理**：明确声明依赖关系，避免手动管理脚本加载顺序。
- **命名空间**：避免全局变量冲突。
- **可维护性**：代码分而治之，便于理解和修改。

### 1.3 JavaScript 模块化发展历程

JavaScript 诞生之初主要用于简单的页面交互，没有内置模块系统。随着应用复杂度增加，社区和标准组织先后提出了多种模块化方案：

- **全局变量 + 命名空间**：简单但易冲突。
- **IIFE 模式**：利用闭包模拟私有作用域。
- **CommonJS**：Node.js 采用的同步模块规范。
- **AMD**：浏览器环境下的异步模块规范。
- **UMD**：兼容 CommonJS 和 AMD 的通用模式。
- **ES6 模块**：ECMAScript 2015 引入的语言级模块系统，成为未来标准。

---

## 2. 早期的模块化方案

### 2.1 全局变量与命名空间

最初，开发者将代码直接写在全局，通过命名空间减少冲突。

```javascript
// math.js
var MATH = MATH || {};
MATH.add = function(a, b) { return a + b; };

// app.js
console.log(MATH.add(2, 3)); // 5
```

缺点：仍可能冲突，且依赖关系不明确。

### 2.2 IIFE 模块模式

立即执行函数表达式（IIFE）利用函数作用域创建私有变量，并返回一个对象作为公共接口。

```javascript
// math.js
var MATH = (function() {
  const PI = 3.14; // 私有变量
  function add(a, b) { return a + b; }
  function multiply(a, b) { return a * b; }
  return { add, multiply };
})();

// app.js
console.log(MATH.add(2, 3));
console.log(MATH.PI); // undefined
```

这种模式称为**揭示模块模式**（Revealing Module Pattern），是早期模块化的基础。

### 2.3 依赖注入

通过将依赖作为参数传入，进一步解耦。

```javascript
var MATH = (function(dep) {
  // 使用 dep
})(dependency);
```

这些手动管理方式在大规模项目中仍显不足，于是社区规范应运而生。

---

## 3. CommonJS 规范

CommonJS 最初旨在让 JavaScript 在服务器端运行，其模块系统被 Node.js 采用并广泛使用。

### 3.1 核心概念

- 每个文件是一个模块，拥有独立作用域。
- 通过 `module.exports` 导出模块接口。
- 通过 `require` 同步加载依赖模块。

### 3.2 导出

```javascript
// math.js
const PI = 3.14;
function add(a, b) { return a + b; }
module.exports = { add, PI };
// 或 exports.add = add; (exports 是 module.exports 的引用)
```

### 3.3 导入

```javascript
// app.js
const math = require('./math.js');
console.log(math.add(2, 3)); // 5
console.log(math.PI); // 3.14
```

### 3.4 特点

- **同步加载**：适用于服务器，文件在本地磁盘，加载快。
- **运行时**：`require` 可以在任意位置调用（甚至条件语句中）。
- **值拷贝**：对于基本类型，导出的是值的拷贝；对于引用类型，导出的是引用（但修改模块内部变量不影响已加载的值，除非重新 `require`）。

```javascript
// counter.js
let count = 0;
module.exports = { count, increment: () => count++ };

// app.js
const { count, increment } = require('./counter');
increment();
console.log(count); // 0，因为 count 是值的拷贝
```

### 3.5 缓存机制

Node.js 会缓存已加载的模块，第二次 `require` 同一模块时直接返回缓存版本。

---

## 4. AMD 规范

异步模块定义（AMD）专为浏览器环境设计，解决同步加载可能阻塞页面渲染的问题。

### 4.1 核心 API

- `define(id?, dependencies?, factory)`：定义模块。
- `require([dependencies], callback)`：异步加载依赖。

### 4.2 示例（使用 RequireJS）

```javascript
// math.js
define([], function() {
  const PI = 3.14;
  function add(a, b) { return a + b; }
  return { add, PI };
});

// app.js
require(['./math'], function(math) {
  console.log(math.add(2, 3));
});
```

### 4.3 特点

- **异步加载**：适合浏览器，不阻塞页面。
- **依赖前置**：在定义模块时声明依赖，便于分析。
- **回调函数**：依赖加载完成后执行工厂函数。

AMD 曾在浏览器端盛行，但语法较繁琐，逐渐被 ES6 模块替代。

---

## 5. ES6 模块

ECMAScript 2015（ES6）正式将模块系统纳入语言标准，成为 JavaScript 官方模块解决方案。目前所有现代浏览器和 Node.js 均支持。

### 5.1 核心语法

#### 导出

```javascript
// math.js
export const PI = 3.14;
export function add(a, b) { return a + b; }
export default function multiply(a, b) { return a * b; } // 默认导出
```

#### 导入

```javascript
// app.js
import multiply, { PI, add } from './math.js'; // 混合导入
console.log(add(2, 3));
console.log(multiply(2, 3));
```

也可以重命名：

```javascript
import { add as sum } from './math.js';
```

导入所有：

```javascript
import * as math from './math.js';
console.log(math.PI);
```

### 5.2 特点

- **静态结构**：`import` 和 `export` 只能在顶层使用，不可在条件语句中。这有利于编译时静态分析（如 tree shaking）。
- **异步加载**：浏览器中 `<script type="module">` 默认延迟执行，且模块依赖会自动加载。
- **实时绑定**：导入的是值的**动态只读引用**，模块内部变化会反映在导入处（类似引用，但不可修改导入值）。

```javascript
// counter.js
export let count = 0;
export function increment() { count++; }

// app.js
import { count, increment } from './counter.js';
increment();
console.log(count); // 1，实时更新
```

### 5.3 动态导入

ES2020 引入了 `import()` 函数，返回 Promise，允许按需加载模块。

```javascript
button.addEventListener('click', async () => {
  const module = await import('./dialog.js');
  module.show();
});
```

动态导入常用于路由懒加载、条件加载等场景。

### 5.4 在浏览器中使用

```html
<script type="module" src="app.js"></script>
```

模块脚本默认启用严格模式，且作用域隔离，不会污染全局。

### 5.5 在 Node.js 中使用

Node.js 从 12 版本开始正式支持 ES6 模块。有两种方式：

1. 将文件扩展名设为 `.mjs`。
2. 在 `package.json` 中设置 `"type": "module"`，此时 `.js` 文件会被视为 ES 模块。

```json
{
  "type": "module"
}
```

Node.js 中可以使用 `import` 加载 CommonJS 模块（有限制），反之 CommonJS 不能通过 `require` 加载 ES 模块（需用动态 `import()`）。

---

## 6. 模块打包工具

尽管现代浏览器原生支持 ES6 模块，但在生产环境中，我们仍需要打包工具，原因包括：

- 将众多模块合并为少量文件，减少 HTTP 请求。
- 转译非标准语法（如 TypeScript、JSX）或降级语法（ES5）。
- 处理资源文件（图片、CSS 等）。
- 优化代码（压缩、tree shaking、代码分割）。

### 6.1 主流打包工具

- **Webpack**：功能强大，配置灵活，生态丰富。
- **Rollup**：专注于 ES 模块打包，生成更纯净的代码，适合库开发。
- **Parcel**：零配置，开箱即用，适合快速原型。
- **esbuild**：极速打包，基于 Go 编写，被 Vite 等工具采用。

### 6.2 打包原理简述

打包工具会从入口文件开始，解析模块依赖图，将每个模块包装成函数，最后生成一个自执行函数（或一组文件），在运行时通过模块映射管理依赖。

---

## 7. 现代模块化实践

### 7.1 使用 ES6 模块作为默认选择

无论是浏览器还是 Node.js，都应优先使用 ES6 模块，享受静态分析和 tree shaking 的好处。

### 7.2 结合 TypeScript

TypeScript 支持 ES6 模块语法，编译时可根据配置生成不同模块格式（CommonJS、AMD、ES6 等）。推荐在 `tsconfig.json` 中设置 `"module": "ESNext"` 或 `"ES6"`，并使用打包工具进行最终构建。

### 7.3 树摇（Tree Shaking）

利用 ES6 模块的静态结构，打包工具可以移除未被使用的导出，减小打包体积。开发时应避免有副作用的导入（如 `import './style.css'` 需特殊标记），并开启生产模式。

### 7.4 代码分割

通过动态 `import()` 将应用拆分为多个 chunk，按需加载，提升首屏性能。

```javascript
// 路由懒加载示例
const Home = () => import('./Home.vue');
```

### 7.5 处理循环依赖

应尽量避免循环依赖。若无法避免，需理解模块加载机制（CommonJS 返回未完成对象，ES6 模块实时绑定可能有助于解决，但仍应重构）。

### 7.6 库开发注意事项

如果开发一个供他人使用的库，应考虑输出多种模块格式（CommonJS、ES6、UMD），方便不同环境使用。Rollup 或 Webpack 均可帮助生成多种格式。

---

## 8. 总结与最佳实践

| 特性     | CommonJS                     | AMD                  | ES6 模块               |
| -------- | ---------------------------- | -------------------- | ---------------------- |
| 适用环境 | 服务器（Node.js）            | 浏览器（异步）       | 浏览器 + 服务器        |
| 加载方式 | 同步                         | 异步                 | 静态（可异步动态导入） |
| 语法     | `require` / `module.exports` | `define` / `require` | `import` / `export`    |
| 静态分析 | 不支持（运行时）             | 不支持               | 支持（编译时）         |
| 动态导入 | 支持（`require` 可条件调用） | 支持                 | `import()` 异步        |
| 值绑定   | 基本类型值拷贝，引用类型共享 | -                    | 动态只读引用           |

**最佳实践**：

1. **新项目优先选择 ES6 模块**，配合打包工具使用。
2. **Node.js 项目**若使用 ES6 模块，需设置 `"type": "module"`，或使用 `.mjs` 扩展名。
3. **避免循环依赖**，如果出现，考虑重构设计。
4. **利用 tree shaking 和代码分割**优化生产构建。
5. **库开发者**应输出多种格式（ESM、CJS、UMD），并确保 `package.json` 正确配置 `main`、`module`、`exports` 字段。

模块化是大型项目的基础，掌握其演变和规范，能让你更自如地组织代码，提升开发效率和应用性能。下一节我们将学习内存调用相关内容，深入理解 JavaScript 的执行机制。
