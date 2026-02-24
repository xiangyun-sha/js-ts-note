# 语句与流程控制

[TOC]

---

程序是由一系列语句（Statement）组成的，每条语句执行一个特定的操作。流程控制（Flow Control）则决定了这些语句的执行顺序。通过流程控制，我们可以让程序根据条件选择不同的执行路径，或者重复执行某段代码，从而实现复杂的逻辑。

本章将系统介绍 JavaScript 中的各类语句，包括表达式语句、块语句、条件语句、循环语句、跳转语句等，并探讨语句与表达式的区别。掌握这些内容，你就能灵活控制程序的执行流程。

---

## 1. 表达式语句

**表达式语句**（Expression Statement）是最简单的语句，它由一个表达式加上末尾的分号组成。表达式执行后会计算出一个值，但这个值通常被丢弃（除非表达式有副作用）。

常见的表达式语句包括：

- 赋值语句

  ```javascript
  let x = 5;      // 赋值表达式后加分号构成语句
  x = x + 1;
  ```

- 函数调用

  ```javascript
  console.log('Hello');   // 函数调用表达式作为语句
  ```

- 自增/自减

  ```javascript
  counter++;
  ```

**注意**：单独的纯值表达式（如 `5;` 或 `'hello';`）也是合法的语句，但不会产生任何效果，通常没有实际意义。

---

## 2. 块语句

**块语句**（Block Statement）使用一对花括号 `{}` 将多条语句组合在一起，形成一个复合语句。块语句在语法上可以出现在任何需要单条语句的地方，常用于条件语句、循环语句中。

```javascript
{
  let a = 1;
  console.log(a);
  a++;
}
```

块语句有两个重要特点：

- **作用域**：使用 `let` 和 `const` 在块内声明的变量，其作用域仅限于该块内部（块级作用域）。`var` 声明的变量不受块级作用域限制，仍属于函数作用域或全局作用域。
- **返回值**：块语句本身不返回值，但可以作为其他语句的一部分。

**示例**：

```javascript
if (true) {
  let msg = 'Inside block';
  console.log(msg);
}
// console.log(msg); // 报错：msg is not defined
```

---

## 3. 条件语句

条件语句根据表达式的布尔值决定是否执行某段代码。

### 3.1 `if` 语句

`if` 语句是最基本的条件语句，语法如下：

```javascript
if (condition) {
  // 条件为真时执行的语句
} else {
  // 条件为假时执行的语句（可选）
}
```

其中 `condition` 可以是任何表达式，JavaScript 会将其隐式转换为布尔值（真值/假值）。

**示例**：

```javascript
let age = 18;
if (age >= 18) {
  console.log('成年人');
} else {
  console.log('未成年人');
}
```

可以嵌套使用，但建议使用 `else if` 处理多分支：

```javascript
let score = 85;
if (score >= 90) {
  console.log('优秀');
} else if (score >= 60) {
  console.log('及格');
} else {
  console.log('不及格');
}
```

### 3.2 `switch` 语句

`switch` 语句用于根据一个表达式的值，跳转到对应的 `case` 分支执行。适合处理多个离散值的匹配。

```javascript
switch (expression) {
  case value1:
    // 当 expression === value1 时执行
    break;
  case value2:
    // 当 expression === value2 时执行
    break;
  default:
    // 如果没有匹配的 case，执行这里（可选）
}
```

**关键点**：

- 使用严格相等 `===` 进行比较。
- 每个 `case` 后通常要加 `break`，否则会继续执行后续 `case` 的代码（称为“fall through”），直到遇到 `break` 或 `switch` 结束。
- `default` 可以放在任何位置，但习惯放在最后。

**示例**：

```javascript
let day = 3;
switch (day) {
  case 1:
    console.log('星期一');
    break;
  case 2:
    console.log('星期二');
    break;
  case 3:
    console.log('星期三');
    break;
  default:
    console.log('其他');
}
```

**利用 fall through**：
有时故意省略 `break` 可以让多个 `case` 共享同一段代码。

```javascript
let grade = 'B';
switch (grade) {
  case 'A':
  case 'B':
  case 'C':
    console.log('及格');
    break;
  case 'D':
  case 'F':
    console.log('不及格');
    break;
  default:
    console.log('无效成绩');
}
```

---

## 4. 循环语句

循环语句用于重复执行一段代码，直到满足某个条件。

### 4.1 `while` 循环

`while` 循环在每次迭代前检查条件，如果条件为真，则执行循环体。

```javascript
while (condition) {
  // 循环体
}
```

**示例**：输出 0 到 4

```javascript
let i = 0;
while (i < 5) {
  console.log(i);
  i++;
}
```

### 4.2 `do...while` 循环

`do...while` 循环至少执行一次循环体，然后再检查条件。

```javascript
do {
  // 循环体
} while (condition);
```

**示例**：

```javascript
let j = 0;
do {
  console.log(j);
  j++;
} while (j < 5);
```

### 4.3 `for` 循环

`for` 循环将初始化、条件判断和更新语句集中在一起，语法清晰。

```javascript
for (initialization; condition; afterthought) {
  // 循环体
}
```

**示例**：

```javascript
for (let i = 0; i < 5; i++) {
  console.log(i);
}
```

### 4.4 `for...in` 循环

`for...in` 循环用于遍历对象的**可枚举属性**（包括原型链上的可枚举属性）。它迭代的是属性名（键）。

```javascript
const person = { name: 'Alice', age: 30 };
for (let key in person) {
  console.log(key, person[key]); // 输出 name Alice, age 30
}
```

**注意**：

- 不建议用 `for...in` 遍历数组，因为它会遍历数组的非数字属性和原型链上的属性，且迭代顺序不保证。
- 如果只想遍历对象自身的属性，可配合 `hasOwnProperty` 使用。

### 4.5 `for...of` 循环（ES6）

`for...of` 循环用于遍历**可迭代对象**（如数组、字符串、Map、Set 等）的值，而不是键。

```javascript
const arr = [10, 20, 30];
for (let value of arr) {
  console.log(value); // 10, 20, 30
}

const str = 'hello';
for (let char of str) {
  console.log(char); // h e l l o
}
```

`for...of` 是遍历数组和类数组对象的首选方式，简洁且安全。

---

## 5. 跳转语句

跳转语句用于改变程序的正常执行顺序，跳转到指定位置。

### 5.1 `break`

`break` 语句用于立即退出当前所在的循环或 `switch` 语句，程序继续执行循环或 `switch` 之后的代码。

```javascript
for (let i = 0; i < 10; i++) {
  if (i === 5) {
    break; // 当 i 等于 5 时退出循环
  }
  console.log(i); // 输出 0,1,2,3,4
}
```

### 5.2 `continue`

`continue` 语句用于跳过当前循环迭代的剩余代码，直接进入下一次迭代。

```javascript
for (let i = 0; i < 5; i++) {
  if (i === 2) {
    continue; // 跳过 i=2 时的输出
  }
  console.log(i); // 输出 0,1,3,4
}
```

### 5.3 `return`

`return` 语句只能在函数体内使用，用于终止函数执行并返回一个值。如果函数没有 `return`，则返回 `undefined`。

```javascript
function add(a, b) {
  return a + b; // 返回结果，函数结束
  console.log('不会执行'); // 这一行永远不会执行
}
```

### 5.4 `throw`

`throw` 语句用于抛出一个用户自定义的异常，常与 `try...catch` 配合使用。

```javascript
function divide(a, b) {
  if (b === 0) {
    throw new Error('除数不能为零');
  }
  return a / b;
}
```

---

## 6. 其他语句

### 6.1 空语句

空语句由一个单独的分号表示，表示什么也不做。通常用于需要一条语句但逻辑上无需操作的场合，例如 `for` 循环的空循环体。

```javascript
for (let i = 0; i < 10; i++); // 空循环，什么也不做
```

**注意**：容易误用，建议加注释说明意图。

### 6.2 `debugger` 语句

`debugger` 语句用于在代码中设置断点。当浏览器开发者工具打开时，执行到该语句会自动暂停，方便调试。

```javascript
function test() {
  let x = 1;
  debugger; // 在此处暂停
  x++;
}
```

### 6.3 标签语句

标签语句用于为一段代码添加标识符，通常与 `break` 或 `continue` 配合，用于跳出多层嵌套循环。

```javascript
outer: for (let i = 0; i < 3; i++) {
  for (let j = 0; j < 3; j++) {
    if (i === 1 && j === 1) {
      break outer; // 跳出外层循环
    }
    console.log(`i=${i}, j=${j}`);
  }
}
```

标签在实际开发中较少使用，过度使用可能影响可读性。

---

## 7. 语句与表达式的区别

理解语句与表达式的区别对于正确编写 JavaScript 代码至关重要。

- **表达式**（Expression）是一个可以计算出一个值的代码单元。例如：`5`、`x + y`、`fn()`、`true ? 'a' : 'b'`。表达式可以出现在任何需要值的地方（如赋值右侧、函数参数、条件判断等）。
- **语句**（Statement）是执行某个操作的完整指令。例如：`let x = 5;`、`if (cond) { ... }`、`return;`。语句通常以分号结尾（但分号并非必需，取决于代码风格和 ASI 规则）。

**关键区别**：表达式可以放在语句中，但语句不能放在表达式内部（除非是函数表达式等特殊情况）。例如，不能在赋值右侧使用 `if` 语句，但可以使用条件运算符（三元表达式）。

**示例**：

```javascript
// 合法：赋值右侧是表达式
let result = 2 + 3 * 4;

// 不合法：赋值右侧不能是语句
let invalid = if (true) { 5 }; // 语法错误

// 合法：函数表达式（表达式）可以包含语句块
let func = function() { return 5; };
```

---

## 8. 最佳实践

### 8.1 使用括号增强可读性

即使语法允许省略某些括号，也建议在复杂条件或循环中加上括号，使意图更清晰。

```javascript
// 推荐
if ((age >= 18 && hasID) || isVIP) {
  // ...
}
```

### 8.2 避免深层次嵌套

过多的嵌套会使代码难以阅读和维护。可以通过尽早返回、提取函数等方式简化。

```javascript
// 不推荐
function process(user) {
  if (user) {
    if (user.isActive) {
      if (user.age >= 18) {
        // ...
      }
    }
  }
}

// 推荐
function process(user) {
  if (!user) return;
  if (!user.isActive) return;
  if (user.age < 18) return;
  // ...
}
```

### 8.3 使用 `===` 而不是 `==`

在条件判断中，始终使用严格相等，避免因隐式类型转换导致的意外。

### 8.4 循环中的变量声明

在 `for` 循环的初始化部分使用 `let` 声明计数器，确保其作用域仅限于循环内部。

### 8.5 谨慎使用 `switch` fall-through

除非有意为之，否则每个 `case` 后都应加上 `break`，并在有意 fall-through 的地方添加注释。

### 8.6 避免空语句的误用

空语句容易让人困惑，如果必须使用，应添加注释说明。

---

## 小结

本章详细介绍了 JavaScript 中的各类语句及其流程控制机制：

- **表达式语句**：由表达式加分号构成，是最基本的操作单元。
- **块语句**：用 `{}` 组合多条语句，形成块级作用域。
- **条件语句**：`if...else` 和 `switch` 用于根据条件选择执行路径。
- **循环语句**：`while`、`do...while`、`for`、`for...in`、`for...of` 用于重复执行代码。
- **跳转语句**：`break`、`continue`、`return`、`throw` 用于改变执行顺序。
- **其他语句**：空语句、`debugger`、标签语句等特殊用途。
- **语句与表达式**：理解了它们的区别，避免语法错误。

掌握这些语句，你就能够控制程序的执行流程，实现各种复杂的业务逻辑。在后续的函数、对象等章节中，这些基础将被反复运用。下一节我们将学习基本输入输出，让程序与用户交互。
