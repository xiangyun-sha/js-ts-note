# 函数

[TOC]

---

函数是结构化编程的核心构件。它允许我们将一段可重复使用的代码块封装起来，通过名称调用，从而提升代码的模块化、可读性和可维护性。JavaScript 中的函数极为灵活，既支持传统的声明式定义，也支持表达式、箭头函数等多种形式，并且函数本身也是一等公民，可以像变量一样传递和操作。

本章将系统介绍 JavaScript 中函数的概念、定义方式、参数处理、返回值、作用域，以及高阶函数、闭包等进阶特性，并给出编写高质量函数的最佳实践。

---

## 1. 函数概述

**函数**是一段具有特定功能的代码块，通过函数名可以调用执行。函数可以接收输入（参数），并返回输出（返回值）。使用函数的主要好处：

- **代码复用**：避免重复编写相同逻辑。
- **模块化**：将复杂任务拆分为小单元，便于理解和测试。
- **抽象**：隐藏实现细节，只暴露调用接口。

在 JavaScript 中，函数是**对象**的一种特殊类型，因此可以拥有属性和方法，也可以作为变量赋值、作为参数传递、作为返回值。

---

## 2. 函数定义

### 2.1 函数声明

使用 `function` 关键字声明一个命名函数，语法如下：

```javascript
function 函数名(参数1, 参数2, ...) {
  // 函数体
  return 返回值; // 可选
}
```

**示例**：

```javascript
function greet(name) {
  return `Hello, ${name}!`;
}
console.log(greet('Alice')); // Hello, Alice!
```

**特点**：

- 函数声明会被**提升**（hoisting），即可以在声明之前调用。
- 必须有函数名。

### 2.2 函数表达式

将匿名函数赋值给一个变量，称为函数表达式。

```javascript
const 变量名 = function(参数1, 参数2, ...) {
  // 函数体
};
```

**示例**：

```javascript
const add = function(a, b) {
  return a + b;
};
console.log(add(3, 5)); // 8
```

**特点**：

- 不会提升，必须先定义后使用。
- 函数名可省略（匿名函数），但也可以指定函数名（用于递归或调试）。
- 函数表达式可以作为立即执行函数（IIFE）的基础。

### 2.3 箭头函数（ES6）

箭头函数提供了一种更简洁的写法，并且不绑定自己的 `this`、`arguments`、`super` 等。

```javascript
const 变量名 = (参数1, 参数2, ...) => {
  // 函数体
};
```

如果只有一个参数，圆括号可省略；如果函数体只有一条返回语句，花括号和 `return` 也可省略。

**示例**：

```javascript
const square = x => x * x;
console.log(square(4)); // 16

const sum = (a, b) => a + b;
console.log(sum(2, 3)); // 5

const log = () => console.log('Hello');
log();
```

**特点**：

- 语法简洁。
- 没有自己的 `this`，继承外层作用域的 `this`（在回调函数中尤其有用）。
- 不能用作构造函数，不能使用 `new`。
- 没有 `arguments` 对象，但可以使用剩余参数代替。

### 2.4 立即执行函数表达式（IIFE）

定义后立即执行的函数表达式，常用于创建独立作用域，避免变量污染。

```javascript
(function() {
  let msg = 'IIFE';
  console.log(msg);
})();

// 箭头函数形式的 IIFE
(() => {
  console.log('arrow IIFE');
})();
```

---

## 3. 参数

### 3.1 形参与实参

- **形参**（parameter）：定义函数时列出的参数变量。
- **实参**（argument）：调用函数时实际传入的值。

JavaScript 对参数数量不做严格检查：

- 如果实参多于形参，多余实参可通过 `arguments` 或剩余参数访问。
- 如果实参少于形参，缺失的形参值为 `undefined`。

### 3.2 默认参数（ES6）

可以为形参指定默认值，当实参为 `undefined` 时生效。

```javascript
function greet(name = 'Guest') {
  console.log(`Hello, ${name}`);
}
greet();       // Hello, Guest
greet('Bob');  // Hello, Bob
```

默认参数还可以是表达式，并且可以引用前面的参数。

### 3.3 剩余参数（ES6）

使用 `...` 语法将多余的实参收集为一个数组。

```javascript
function sum(prefix, ...numbers) {
  return prefix + numbers.reduce((acc, cur) => acc + cur, 0);
}
console.log(sum('总和：', 1, 2, 3, 4)); // 总和：10
```

剩余参数必须放在参数列表的最后。

### 3.4 `arguments` 对象

在非箭头函数内部，可以使用 `arguments` 对象访问所有传入的实参。它是一个类数组对象，但不是真正的数组。

```javascript
function logArgs() {
  for (let i = 0; i < arguments.length; i++) {
    console.log(arguments[i]);
  }
}
logArgs('a', 'b', 'c'); // a b c
```

在现代开发中，建议优先使用剩余参数，因为它返回真正的数组，且语义更清晰。

### 3.5 按值传递与按引用传递

JavaScript 中，参数传递都是**按值传递**，但对于对象，传递的值是对象的引用（指针）。因此：

- 如果函数内部修改了基本类型参数，不会影响外部变量。
- 如果函数内部修改了对象参数的属性，会影响外部对象。

```javascript
function change(obj, num) {
  obj.name = 'Bob'; // 影响外部
  num = 100;        // 不影响外部
}
let person = { name: 'Alice' };
let x = 10;
change(person, x);
console.log(person.name); // Bob
console.log(x);           // 10
```

---

## 4. 返回值

函数可以使用 `return` 语句返回一个值。如果没有 `return`，函数默认返回 `undefined`。

- `return` 会立即终止函数执行。
- 可以返回任何类型的值，包括对象、函数等。

```javascript
function createMultiplier(factor) {
  return function(number) {
    return number * factor;
  };
}
const double = createMultiplier(2);
console.log(double(5)); // 10
```

---

## 5. 作用域与函数

每个函数都会创建一个新的作用域。函数内部用 `var`、`let`、`const` 声明的变量，只在函数内部可访问（闭包情况除外）。

- **局部变量**：在函数内部声明，外部无法访问。
- **全局变量**：在函数外部声明，函数内部可以访问（除非被同名局部变量遮蔽）。

```javascript
let global = 'global';
function test() {
  let local = 'local';
  console.log(global); // 可访问
  console.log(local);  // 可访问
}
test();
console.log(local); // 报错：local is not defined
```

**作用域链**：当访问一个变量时，JavaScript 会从当前作用域开始向上查找，直到全局作用域。这决定了函数可以访问哪些外部变量。

关于作用域的更多细节，请参阅前文“作用域与作用域链”。

---

## 6. 高阶函数

**高阶函数**是指至少满足以下条件之一的函数：

- 接受一个或多个函数作为参数。
- 返回一个函数。

JavaScript 中的许多数组方法（如 `map`、`filter`、`reduce`）就是高阶函数的典型应用。

```javascript
// 接受函数作为参数
function operateOnArray(arr, operation) {
  return arr.map(operation);
}
const numbers = [1, 2, 3];
const doubled = operateOnArray(numbers, n => n * 2);
console.log(doubled); // [2, 4, 6]

// 返回一个函数
function createGreeting(greetingWord) {
  return function(name) {
    return `${greetingWord}, ${name}!`;
  };
}
const sayHi = createGreeting('Hi');
console.log(sayHi('Alice')); // Hi, Alice!
```

高阶函数使代码更抽象、更灵活，是函数式编程的重要基础。

---

## 7. 回调函数

**回调函数**是指作为参数传递给另一个函数，并在某个时刻被调用的函数。它是处理异步操作（如事件、定时器、网络请求）的常用方式。

```javascript
function fetchData(callback) {
  setTimeout(() => {
    const data = { id: 1, name: 'Alice' };
    callback(data);
  }, 1000);
}

fetchData((data) => {
  console.log('收到数据：', data);
});
```

回调函数也可能导致“回调地狱”（多层嵌套），现代 JavaScript 中常用 Promise 和 async/await 解决。

---

## 8. 闭包

**闭包**是指函数与其词法环境的组合。当一个内部函数引用了外部函数的变量，并且被外部函数返回或在其他地方引用时，就形成了闭包。闭包让这些变量得以保留，即使外部函数已经执行完毕。

```javascript
function counter() {
  let count = 0;
  return function() {
    count++;
    return count;
  };
}
const increment = counter();
console.log(increment()); // 1
console.log(increment()); // 2
```

**闭包的常见用途**：

- 创建私有变量（模拟封装）。
- 实现函数工厂（如上例的 `createMultiplier`）。
- 在回调中保持状态（如事件处理）。

**注意事项**：闭包会占用内存，因为被引用的变量不会被垃圾回收。在不需要时应解除引用以避免内存泄漏。

---

## 9. 纯函数与副作用

**纯函数**是指满足以下条件的函数：

- 相同的输入永远得到相同的输出。
- 没有副作用（不修改外部状态，不执行 I/O 操作等）。

```javascript
// 纯函数
function add(a, b) {
  return a + b;
}

// 非纯函数（有副作用）
let total = 0;
function addToTotal(value) {
  total += value;
  return total;
}
```

纯函数的好处：可预测、易测试、适合并发执行。在函数式编程中，鼓励使用纯函数。

---

## 10. 递归

**递归**是指函数调用自身的一种技巧。递归通常用于解决可以分解为相似子问题的问题，如树遍历、阶乘、斐波那契数列等。

```javascript
function factorial(n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}
console.log(factorial(5)); // 120
```

递归需要有**基线条件**（终止条件）和**递归条件**（调用自身）。深度递归可能导致栈溢出，应谨慎使用或考虑尾递归优化（但 JavaScript 引擎对尾递归支持有限）。

---

## 11. 最佳实践

### 11.1 函数单一职责

一个函数只做一件事，并做好。这有助于复用和测试。

### 11.2 命名清晰

函数名应以动词开头，准确描述其功能（如 `getUser`、`sendEmail`）。布尔值函数常用 `is`、`has`、`can` 开头（如 `isValid`）。

### 11.3 参数不宜过多

参数过多（超过 3 个）时，考虑使用对象参数，并配合解构。

```javascript
// 不推荐
function createUser(name, age, email, address, phone) { ... }

// 推荐
function createUser({ name, age, email, address, phone }) { ... }
```

### 11.4 尽早返回

使用早期 `return` 减少嵌套，提高可读性。

```javascript
function process(user) {
  if (!user) return;
  if (!user.isActive) return;
  // 继续处理...
}
```

### 11.5 避免修改外部状态

除非必要，尽量不要在函数内部修改传入的参数或全局变量，以减少副作用。

### 11.6 使用默认参数代替条件赋值

```javascript
// 不推荐
function greet(name) {
  name = name || 'Guest';
  ...
}

// 推荐
function greet(name = 'Guest') { ... }
```

### 11.7 箭头函数与普通函数的选用

- 对于简短的、不涉及自身 `this` 的回调，优先使用箭头函数。
- 需要动态 `this` 或作为构造函数时，使用普通函数。
- 对象方法中，如果需要访问对象自身的属性，使用普通函数（或 ES6 简洁方法）。

---

## 小结

函数是 JavaScript 中组织代码的核心机制。本章我们学习了：

- 函数的多种定义方式：声明、表达式、箭头函数。
- 参数的灵活处理：默认值、剩余参数、`arguments`。
- 返回值与作用域。
- 高阶函数、回调函数、闭包的概念与应用。
- 纯函数、递归等进阶主题。
- 编写高质量函数的最佳实践。

熟练掌握函数，你就能写出更模块化、更易维护的代码，并为后续学习函数式编程、异步编程打下坚实基础。下一节我们将探讨数据结构，了解如何组织和操作更复杂的数据。
