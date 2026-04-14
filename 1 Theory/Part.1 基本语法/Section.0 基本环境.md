# 基本环境

[TOC]

---

JavaScript 是一门**跨平台**的编程语言，最初设计用于在浏览器中为网页添加交互，如今已能运行在服务器、桌面应用、移动端等多种环境。要开始编写和运行 JavaScript 代码，首先需要了解其运行环境及基本工具。本章将介绍两大主流环境：**浏览器环境** 和 **Node.js 环境**，以及相关的开发工具。

---

## 1. 浏览器环境

浏览器是 JavaScript 最传统的运行环境。几乎所有现代浏览器都内置了 JavaScript 引擎（如 Chrome 的 V8、Firefox 的 SpiderMonkey），可以解析和执行 JavaScript 代码。

### 1.1 在 HTML 中引入 JavaScript

在浏览器中运行 JS，通常需要将代码嵌入到 HTML 页面中。有三种常见方式：

- **内联脚本**：使用 `<script>` 标签直接在 HTML 中编写 JS 代码。

  ```html
  <!DOCTYPE html>
  <html>
  <head>
    <title>示例</title>
  </head>
  <body>
    <script>
      console.log('Hello, browser!');
    </script>
  </body>
  </html>
  ```

- **外部脚本**：将 JS 代码单独保存为 `.js` 文件，然后通过 `<script src="...">` 引入。

  ```html
  <script src="app.js"></script>
  ```

- **事件属性**（不推荐）：在 HTML 标签的属性中直接编写 JS，如 `onclick="alert('click')"`。

**建议**：将 `<script>` 标签放在 `</body>` 闭合标签之前，以确保 DOM 元素已加载完毕；或使用 `defer` 或 `async` 属性控制加载行为。

### 1.2 浏览器开发者工具

现代浏览器内置了强大的开发者工具，用于调试、分析和测试代码。以 Chrome 为例，打开方式：

- 按 `F12` 或 `Ctrl+Shift+I`（Windows/Linux） / `Cmd+Option+I`（Mac）。
- 右键点击页面任意位置，选择“检查”。

常用面板：

| 面板            | 用途                                             |
| --------------- | ------------------------------------------------ |
| **Elements**    | 查看和修改 DOM 元素、CSS 样式。                  |
| **Console**     | 执行 JS 代码、查看日志输出、调试信息。           |
| **Sources**     | 查看所有源文件，设置断点，逐步调试代码。         |
| **Network**     | 监控网络请求，查看资源加载情况。                 |
| **Performance** | 分析页面性能，找出瓶颈。                         |
| **Application** | 管理存储（Cookie、LocalStorage、IndexedDB 等）。 |

### 1.3 浏览器调试器

调试是定位和修复错误的关键技能。Chrome 开发者工具的 **Sources** 面板提供了完整的调试功能：

- **设置断点**：在代码行号上单击，即可添加断点。当代码执行到该行时会暂停，此时可以查看变量、调用栈等。
- **单步执行**：暂停后，可以使用“步过”、“步入”、“步出”按钮逐行执行代码，观察程序状态变化。
- **查看变量**：在右侧“Scope”面板中查看当前作用域内的变量值，也可将鼠标悬停在代码变量上查看。
- **监视表达式**：在“Watch”面板中添加表达式，实时跟踪其值。
- **调用栈**：查看当前断点处的函数调用链，有助于理解程序执行流程。

**示例**：在以下代码中设置断点，观察循环过程。

```javascript
function sum(n) {
  let total = 0;
  for (let i = 1; i <= n; i++) {
    total += i; // 在此处设置断点
  }
  return total;
}
sum(5);
```

除了断点调试，**`console.log()`** 是最简单直接的调试手段，可以在控制台输出变量值或提示信息。

```javascript
console.log('当前值:', value);
console.dir(object); // 以可交互形式显示对象
console.table(array); // 以表格形式显示数组或对象
```

---

## 2. IDE 插件 —— VS Code Live Server

编写 JavaScript 代码通常需要一个代码编辑器。**Visual Studio Code（VS Code）** 是目前最流行的轻量级编辑器之一，它拥有丰富的插件生态系统。对于浏览器环境开发，**Live Server** 是一个非常实用的插件。

### 2.1 安装 Live Server

1. 打开 VS Code，点击左侧活动栏的扩展图标（或按 `Ctrl+Shift+X`）。
2. 在搜索框中输入“Live Server”，找到由 **Ritwick Dey** 开发的插件，点击“安装”。

### 2.2 使用 Live Server

安装完成后，在 HTML 文件上右键单击，选择 **“Open with Live Server”**，即可启动一个本地开发服务器，并自动在浏览器中打开页面。

- **自动刷新**：当你修改并保存 HTML、CSS 或 JS 文件时，浏览器页面会自动刷新，实时显示更改效果。
- **本地服务器**：Live Server 启动的是一个真正的 HTTP 服务器，可以处理 AJAX 请求、加载外部资源等，避免了使用 `file://` 协议可能出现的跨域或资源加载问题。
- **端口配置**：默认使用 `5500` 端口，可在 VS Code 设置中修改。

Live Server 极大地提升了前端开发效率，是初学者和专业人士的常用工具。

---

## 3. Node.js 环境

Node.js 是一个基于 Chrome V8 引擎的 JavaScript 运行时，使得 JavaScript 可以脱离浏览器运行在服务器端或本地计算机上。它提供了文件系统操作、网络通信、进程管理等功能，让 JavaScript 成为一门通用的后端语言。

### 3.1 安装 Node.js

访问 [Node.js 官网](https://nodejs.org/)，下载并安装 **LTS（长期支持）版本**。安装完成后，打开命令行（终端），输入以下命令验证是否成功：

```bash
node -v   # 查看 Node.js 版本
npm -v    # 查看 npm（Node 包管理器）版本
```

### 3.2 运行 JavaScript 文件

创建一个 `.js` 文件，例如 `hello.js`：

```javascript
console.log('Hello, Node.js!');
```

在命令行中切换到文件所在目录，执行：

```bash
node hello.js
```

控制台将输出 `Hello, Node.js!`。

### 3.3 Node.js 全局对象

在浏览器环境中，全局对象是 `window`；而在 Node.js 中，全局对象是 `global`。但两者都提供了 `console`、`setTimeout` 等常用 API。

Node.js 还提供了许多核心模块，如：

- `fs`：文件系统操作
- `http`：创建 HTTP 服务器
- `path`：处理文件路径
- `os`：获取操作系统信息

示例：创建一个简单的 HTTP 服务器

```javascript
const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello World\n');
});

server.listen(3000, () => {
  console.log('Server running at http://localhost:3000/');
});
```

### 3.4 npm —— Node 包管理器

npm 是 Node.js 的默认包管理工具，用于安装、分享和管理依赖包。常用命令：

- `npm init`：初始化项目，生成 `package.json` 文件。
- `npm install <package-name>`：安装指定包，并记录到 `package.json` 的依赖中。
- `npm install -g <package-name>`：全局安装包（通常用于命令行工具）。
- `npm run <script>`：执行 `package.json` 中定义的脚本。

**示例**：安装一个流行的工具库 `lodash`

```bash
npm install lodash
```

然后在代码中引入：

```javascript
const _ = require('lodash');
console.log(_.chunk([1, 2, 3, 4], 2)); // [[1, 2], [3, 4]]
```

---

## 4. 其他环境与工具

除了浏览器和 Node.js，JavaScript 还可以运行在其他环境中，例如：

- **Deno**：一个由 Node.js 原作者开发的新的运行时，内置 TypeScript 支持，安全性更高。
- **Bun**：一个快速的全能工具包，包含运行时、包管理器、打包器等。
- **Electron**：用于构建跨平台桌面应用，结合了 Node.js 和 Chromium。
- **React Native** / **Weex**：用于构建移动端原生应用，使用 JavaScript 编写。

但对于初学者，掌握浏览器和 Node.js 环境已经足够打下坚实基础。

---

## 小结

- **浏览器环境** 是 JavaScript 的传统阵地，通过 `<script>` 标签引入代码，使用开发者工具进行调试和性能分析。Live Server 插件可以大幅提升开发体验。
- **Node.js 环境** 让 JavaScript 走向后端，提供了丰富的核心模块和 npm 生态系统，适合构建服务器端应用和命令行工具。

理解这两种基本环境的差异和共性，是深入学习 JavaScript 的第一步。后续章节将在此基础上，逐步展开语法、数据结构、函数等核心概念的学习。
