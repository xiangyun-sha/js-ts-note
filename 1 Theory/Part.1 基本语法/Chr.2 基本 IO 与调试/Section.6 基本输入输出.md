# 基本输入输出

[TOC]

---

程序通常需要与用户或外部系统进行交互：接收数据（输入）和呈现结果（输出）。JavaScript 的运行环境（浏览器和 Node.js）提供了不同的输入输出机制。本章将介绍最基础的输入输出方法，帮助你编写能与用户简单交互的程序。

---

## 1. 输出

输出是将程序的运行结果或信息展示给用户的过程。在不同的环境中，输出方式有所不同。

### 1.1 浏览器环境中的输出

#### `console.log()`

最常用的输出方式，用于在浏览器的开发者工具控制台打印信息。它接受任意多个参数，并将它们依次输出。

```javascript
console.log('Hello, world!');
console.log('答案：', 42);
console.log('对象：', { name: 'Alice' });
```

除了 `console.log`，还有 `console.info`、`console.warn`、`console.error` 等方法，它们会在控制台中以不同样式显示。

```javascript
console.warn('警告信息');
console.error('错误信息');
```

#### `alert()`

`alert` 函数会在浏览器中弹出一个模态对话框，显示指定的消息，并等待用户点击“确定”按钮。它会阻塞代码执行，直到用户关闭对话框。

```javascript
alert('欢迎访问我的网站！');
```

#### `document.write()`

`document.write` 可以将内容直接写入 HTML 文档中。如果在页面加载完成后调用，会覆盖整个页面内容，因此通常仅用于教学示例或在页面渲染期间动态插入内容。

```javascript
document.write('<h1>动态标题</h1>');
```

**注意**：实际开发中很少使用 `document.write`，更推荐使用 DOM 操作方法（如 `innerHTML`、`appendChild`）来更新页面内容。

### 1.2 Node.js 环境中的输出

#### `console.log()`

在 Node.js 中，`console.log` 将信息输出到标准输出流（stdout），默认显示在终端中。

```javascript
console.log('Hello, Node.js!');
console.log('当前时间：', new Date());
```

#### `process.stdout.write()`

`process.stdout.write` 是更底层的输出方法，它不会自动添加换行符，允许更精细地控制输出。

```javascript
process.stdout.write('请输入你的名字：');
```

### 1.3 格式化输出

JavaScript 支持多种方式格式化字符串输出：

- **模板字符串（ES6）**：使用反引号 `` ` `` 和 `${}` 嵌入变量或表达式。

  ```javascript
  let name = 'Alice';
  console.log(`Hello, ${name}!`); // Hello, Alice!
  ```

- **`console.log` 的格式化占位符**：支持类似 C 语言的 `%d`、`%s`、`%j` 等。

  ```javascript
  console.log('%s 今年 %d 岁', 'Bob', 25); // Bob 今年 25 岁
  console.log('%j', { foo: 'bar' }); // {"foo":"bar"}  JSON 格式
  ```

- **字符串拼接**：使用 `+` 运算符。

  ```javascript
  console.log('Hello, ' + name + '!');
  ```

推荐使用模板字符串，它更直观且易于阅读。

---

## 2. 输入

输入是程序从外部获取数据的过程。浏览器和 Node.js 提供了不同的输入方式。

### 2.1 浏览器环境中的输入

#### `prompt()`

`prompt` 函数弹出一个对话框，显示提示信息，并等待用户输入文本。它返回用户输入的字符串（如果用户点击取消，则返回 `null`）。

```javascript
let userName = prompt('请输入你的名字：');
if (userName) {
  console.log('你好，' + userName);
} else {
  console.log('用户取消了输入');
}
```

**注意**：`prompt` 同样会阻塞代码执行，直到用户响应。

#### `confirm()`

`confirm` 弹出一个带有“确定”和“取消”按钮的对话框，返回布尔值（`true` 表示确定，`false` 表示取消）。

```javascript
let isSure = confirm('你确定要删除吗？');
if (isSure) {
  // 执行删除操作
}
```

#### 表单输入（简介）

在实际网页应用中，更常见的输入方式是通过 HTML 表单（`<input>`、`<textarea>` 等）结合事件监听获取用户输入。这涉及 DOM 操作，将在后续章节详细讲解。这里仅展示一个简单示例：

```html
<input type="text" id="nameInput" placeholder="输入名字">
<button id="submitBtn">提交</button>
<script>
  document.getElementById('submitBtn').onclick = function() {
    let name = document.getElementById('nameInput').value;
    alert('你好，' + name);
  };
</script>
```

### 2.2 Node.js 环境中的输入

Node.js 运行在命令行环境中，没有浏览器那样的弹窗。常用的输入方式是通过标准输入流（stdin）读取用户输入。

#### 使用 `readline` 模块（简单方式）

Node.js 内置的 `readline` 模块提供了逐行读取输入的能力。

```javascript
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('请输入你的名字：', (answer) => {
  console.log(`你好，${answer}！`);
  rl.close(); // 关闭接口
});
```

- `rl.question` 方法显示提示信息，并通过回调函数获取用户输入。
- 输入是异步的，回调函数在用户输入完成后执行。

#### 使用 `process.stdin` 事件（底层）

`process.stdin` 是一个可读流，可以通过监听 `data` 事件获取输入。

```javascript
process.stdin.setEncoding('utf8');
console.log('请输入内容（输入 exit 退出）：');

process.stdin.on('data', (chunk) => {
  let input = chunk.trim();
  if (input === 'exit') {
    process.stdin.emit('end'); // 触发 end 事件
  } else {
    console.log(`你输入了：${input}`);
  }
});

process.stdin.on('end', () => {
  console.log('输入结束');
  process.exit();
});
```

这种方法更灵活，但需要自行处理缓冲、换行等问题，通常使用 `readline` 更为便捷。

#### 命令行参数输入

Node.js 程序可以通过 `process.argv` 获取启动时的命令行参数。

```javascript
// 执行命令：node app.js Alice 25
console.log(process.argv);
// 输出数组，前两个元素是 node 路径和脚本路径，后续是参数
let name = process.argv[2];
let age = process.argv[3];
console.log(`姓名：${name}，年龄：${age}`);
```

---

## 3. 标准输入输出流的概念

在操作系统层面，每个进程都默认拥有三个标准数据流：

- **标准输入（stdin）**：通常指键盘输入。
- **标准输出（stdout）**：通常指终端屏幕输出。
- **标准错误（stderr）**：用于输出错误信息，也输出到屏幕，但可以与 stdout 分开重定向。

在 Node.js 中：

- `process.stdin` 对应标准输入。
- `process.stdout` 对应标准输出。
- `process.stderr` 对应标准错误。

`console.log` 实际上是将信息写入 `process.stdout`，并自动添加换行符；`console.error` 写入 `process.stderr`。

理解这些概念有助于编写更灵活的脚本，例如将输出重定向到文件或与其他程序进行管道通信。

---

## 4. 简单示例：猜数字游戏

结合输入输出，我们可以编写一个简单的猜数字游戏（浏览器版）：

```html
<script>
  const secret = Math.floor(Math.random() * 100) + 1;
  let guess;

  while (true) {
    guess = prompt('猜一个数字（1-100）：');
    if (guess === null) {
      alert('游戏结束');
      break;
    }
    guess = Number(guess);
    if (isNaN(guess) || guess < 1 || guess > 100) {
      alert('请输入有效的数字（1-100）');
    } else if (guess < secret) {
      alert('太小了');
    } else if (guess > secret) {
      alert('太大了');
    } else {
      alert('恭喜你，猜对了！');
      break;
    }
  }
</script>
```

Node.js 版本（使用 `readline`）：

```javascript
const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

const secret = Math.floor(Math.random() * 100) + 1;

function ask() {
  rl.question('猜一个数字（1-100）：', (answer) => {
    if (answer === 'exit') {
      console.log('游戏结束');
      rl.close();
      return;
    }
    const guess = Number(answer);
    if (isNaN(guess) || guess < 1 || guess > 100) {
      console.log('请输入有效的数字（1-100）');
      ask();
    } else if (guess < secret) {
      console.log('太小了');
      ask();
    } else if (guess > secret) {
      console.log('太大了');
      ask();
    } else {
      console.log('恭喜你，猜对了！');
      rl.close();
    }
  });
}

ask();
```

---

## 5. 小结与练习

### 本章重点

- **输出**：`console.log`、`alert`、`document.write`（浏览器）；`console.log`、`process.stdout.write`（Node.js）。
- **输入**：`prompt`、`confirm`、表单（浏览器）；`readline`、`process.stdin`、`process.argv`（Node.js）。
- 格式化输出：模板字符串、占位符。
- 理解标准输入输出流的概念。

### 练习建议

1. 编写一个程序，询问用户姓名和年龄，然后输出“你好，[姓名]，你明年将[年龄+1]岁”。
2. 在浏览器中实现一个简单的计算器，使用 `prompt` 获取两个数字和运算符，然后显示计算结果。
3. 在 Node.js 中编写一个脚本，接受两个命令行参数（数字），输出它们的和。
4. 尝试使用 `process.stdout.write` 实现一个进度条效果（动态更新同一行输出）。

掌握基本的输入输出后，你的程序就能真正与用户“对话”了。下一节我们将学习基本调试技巧，帮助你查找和修复代码中的错误。
