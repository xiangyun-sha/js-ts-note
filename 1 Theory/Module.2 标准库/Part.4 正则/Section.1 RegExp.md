# RegExp

[TOC]

---

`RegExp` 是 JavaScript 中用于处理正则表达式的内置对象。正则表达式是一种强大的文本模式匹配工具，可用于字符串的搜索、替换、提取和验证。`RegExp` 对象封装了正则表达式模式，并提供了执行匹配操作的方法。理解 `RegExp` 及其与字符串方法的配合，是高效处理文本的基础。

---

## 1. 概述

### 1.1 什么是正则表达式？

正则表达式（Regular Expression）是一种描述字符模式的表达式。它由普通字符（如字母、数字）和特殊字符（元字符）组成，用于匹配字符串中符合特定规则的子串。常见的应用场景包括：

- 表单验证（邮箱、手机号、密码强度）
- 文本搜索与替换
- 日志分析与数据提取
- 语法高亮与词法分析

### 1.2 RegExp 对象

JavaScript 中的正则表达式通过 `RegExp` 对象表示。每个 `RegExp` 实例包含一个模式（pattern）和若干标志（flags），用于控制匹配行为。

---

## 2. 创建 RegExp

有两种方式创建正则表达式对象：**字面量**和**构造函数**。

### 2.1 字面量方式

使用两个斜杠 `/` 包裹模式，后跟可选标志。这是最常用、最简洁的方式。

```javascript
const regex1 = /abc/i;      // 匹配 "abc"，忽略大小写
const regex2 = /^\d+$/g;    // 匹配全数字字符串，全局匹配
```

### 2.2 构造函数方式

`new RegExp(pattern, flags)` 接收两个字符串参数：模式字符串和标志字符串。这种方式允许动态创建正则表达式。

```javascript
const pattern = '\\d+';     // 注意反斜杠需要转义
const flags = 'g';
const regex3 = new RegExp(pattern, flags); // 等价于 /\d+/g
```

**区别**：

- 字面量写法在脚本加载时编译，效率更高。
- 构造函数在运行时编译，适用于动态生成模式（如用户输入）。
- 构造函数中，模式字符串内的反斜杠需要转义（例如 `\\d` 表示数字）。

### 2.3 特殊字符转义

在构造函数中，由于模式是字符串，反斜杠本身需要转义。例如要匹配 `\d`，需写成 `"\\d"`。而在字面量中直接写 `\d` 即可。

```javascript
// 字面量
const r1 = /\d+/;

// 构造函数
const r2 = new RegExp('\\d+');
```

---

## 3. 实例属性

每个 `RegExp` 实例都拥有以下属性：

| 属性 | 描述 | 示例 |
|------|------|------|
| `source` | 返回正则表达式的模式字符串（不包括斜杠和标志）。 | `/abc/i.source` → `"abc"` |
| `flags` | 返回正则表达式的标志字符串（ES6+）。 | `/abc/gi.flags` → `"gi"` |
| `global` | 是否设置了 `g` 标志。 | `boolean` |
| `ignoreCase` | 是否设置了 `i` 标志。 | `boolean` |
| `multiline` | 是否设置了 `m` 标志。 | `boolean` |
| `dotAll` | 是否设置了 `s` 标志（ES2018）。使 `.` 匹配所有字符（包括换行）。 | `boolean` |
| `unicode` | 是否设置了 `u` 标志（ES6）。启用 Unicode 模式。 | `boolean` |
| `sticky` | 是否设置了 `y` 标志（ES6）。启用粘性匹配，仅从 `lastIndex` 位置开始匹配。 | `boolean` |
| `lastIndex` | 下一次匹配开始的位置。仅在 `g` 或 `y` 标志下使用，可读写。 | `number` |

**示例**：

```javascript
const re = /foo/gi;
console.log(re.source);      // "foo"
console.log(re.flags);        // "gi"
console.log(re.global);       // true
console.log(re.ignoreCase);   // true
console.log(re.lastIndex);    // 0（可修改）
```

---

## 4. 实例方法

### 4.1 `exec(str)`

在字符串 `str` 中执行匹配搜索。返回一个结果数组或 `null`。如果正则具有 `g` 或 `y` 标志，则更新 `lastIndex` 属性。

返回的数组包含：

- 索引 `0`：完整匹配的字符串。
- 索引 `1` 开始：捕获组（如果有）。
- 另外两个额外属性：
  - `index`：匹配到的子串在原字符串中的起始索引。
  - `input`：原始字符串。

```javascript
const re = /(foo)(bar)?/g;
const str = 'foobar foo';
let match;
while ((match = re.exec(str)) !== null) {
  console.log(`Found ${match[0]} at ${match.index}`);
  console.log(`Group1: ${match[1]}, Group2: ${match[2]}`);
}
// Found foobar at 0, Group1: foo, Group2: bar
// Found foo at 7, Group1: foo, Group2: undefined
```

**注意**：当使用 `g` 标志时，通常循环调用 `exec` 直到返回 `null`。

### 4.2 `test(str)`

测试字符串 `str` 是否匹配正则表达式。返回布尔值。如果带有 `g` 标志，也会更新 `lastIndex`。

```javascript
const re = /\d/;
console.log(re.test('abc123')); // true
console.log(re.test('abc'));    // false
```

### 4.3 `toString()`

返回表示正则表达式的字符串，形式为 `"/pattern/flags"`。

```javascript
const re = /abc/gim;
console.log(re.toString()); // "/abc/gim"
```

---

## 5. 正则表达式语法

正则表达式由普通字符和元字符组成。下面列出常用语法（JavaScript 支持）。

### 5.1 字符类

| 语法 | 描述 |
|------|------|
| `[abc]` | 匹配方括号内的任意一个字符。 |
| `[^abc]` | 匹配不在方括号内的任意一个字符。 |
| `[a-z]` | 匹配 a 到 z 范围内的任意一个字符。 |
| `.` | 匹配除换行符外的任意单个字符（若加 `s` 标志则包括换行）。 |
| `\d` | 匹配数字，等价于 `[0-9]`。 |
| `\D` | 匹配非数字，等价于 `[^0-9]`。 |
| `\w` | 匹配单词字符（字母、数字、下划线），等价于 `[A-Za-z0-9_]`。 |
| `\W` | 匹配非单词字符。 |
| `\s` | 匹配空白字符（空格、制表符、换行等）。 |
| `\S` | 匹配非空白字符。 |

### 5.2 量词

| 语法 | 描述 |
|------|------|
| `*` | 匹配前一个表达式 0 次或多次。 |
| `+` | 匹配前一个表达式 1 次或多次。 |
| `?` | 匹配前一个表达式 0 次或 1 次。 |
| `{n}` | 匹配恰好 n 次。 |
| `{n,}` | 匹配至少 n 次。 |
| `{n,m}` | 匹配 n 到 m 次。 |

默认情况下，量词是**贪婪**的，即尽可能匹配更多字符。在量词后加 `?` 可使其变为**非贪婪**（惰性），尽可能匹配少。

```javascript
'12345'.match(/\d{2,3}/);   // ["123"]（贪婪）
'12345'.match(/\d{2,3}?/);  // ["12"]（非贪婪）
```

### 5.3 位置断言

| 语法 | 描述 |
|------|------|
| `^` | 匹配字符串的开头。 |
| `$` | 匹配字符串的结尾。 |
| `\b` | 匹配单词边界。 |
| `\B` | 匹配非单词边界。 |
| `(?=...)` | 正向先行断言，后面必须跟指定模式。 |
| `(?!...)` | 负向先行断言，后面不能跟指定模式。 |
| `(?<=...)` | 正向后行断言（ES2018），前面必须是指定模式。 |
| `(?<!...)` | 负向后行断言（ES2018），前面不能是指定模式。 |

```javascript
// 先行断言：匹配后面跟着 'cat' 的 'my'
const re = /my(?= cat)/;
re.test('my cat'); // true
re.test('my dog'); // false
```

### 5.4 分组与反向引用

| 语法 | 描述 |
|------|------|
| `(pattern)` | 捕获组，将匹配的内容存入分组。 |
| `(?:pattern)` | 非捕获组，仅用于分组但不捕获。 |
| `\1`, `\2` | 反向引用，在模式中引用之前捕获的分组。 |

```javascript
// 匹配重复单词
const re = /\b(\w+)\s+\1\b/;
re.test('hello hello'); // true

// 非捕获组
const re2 = /(?:https?):\/\/\S+/;
```

### 5.5 修饰符（标志）

| 标志 | 描述 |
|------|------|
| `g` | 全局匹配，查找所有匹配而非在第一个匹配后停止。 |
| `i` | 忽略大小写。 |
| `m` | 多行模式，`^` 和 `$` 匹配每行的开头和结尾。 |
| `s` | dotAll 模式（ES2018），让 `.` 匹配包括换行符在内的所有字符。 |
| `u` | Unicode 模式（ES6），正确处理 Unicode 码点，支持 `\p{...}` 转义。 |
| `y` | 粘性匹配（ES6），仅从 `lastIndex` 位置开始匹配。 |

**示例**：

```javascript
/^foo/m.test('bar\nfoo');   // true（m 标志使 ^ 匹配行首）
/./s.test('\n');             // true（s 标志使 . 匹配换行）
/\p{Script=Han}/u.test('中'); // true（u 标志启用 Unicode 属性转义）
```

---

## 6. 字符串方法中使用正则

许多字符串方法接受正则表达式作为参数，实现强大的文本处理。

| 方法 | 描述 | 示例 |
|------|------|------|
| `match(regexp)` | 返回匹配结果数组。若使用 `g` 标志，返回所有完整匹配；否则返回与 `exec` 相同的数组。 | `'abc123'.match(/\d+/);` → `['123']` |
| `matchAll(regexp)` (ES2020) | 返回一个迭代器，包含所有匹配的详细信息（包括捕获组）。要求正则必须有 `g` 标志。 | `const matches = [...'ab a'.matchAll(/a/g)];` |
| `search(regexp)` | 返回第一个匹配的索引，否则返回 -1。 | `'hello'.search(/l/);` → `2` |
| `replace(regexp, replacement)` | 用替换内容替换匹配的子串。支持特殊替换模式（如 `$1` 引用捕获组）。 | `'hello world'.replace(/(\w+)\s+(\w+)/, '$2 $1');` → `'world hello'` |
| `replaceAll(regexp, replacement)` (ES2021) | 替换所有匹配，要求正则必须带 `g` 标志。 | `'a b a'.replaceAll(/a/g, 'x');` → `'x b x'` |
| `split(regexp)` | 用正则作为分隔符拆分字符串。 | `'1,2,3'.split(/,/);` → `['1','2','3']` |

**重要**：当使用 `replace` 或 `replaceAll` 时，`replacement` 可以是函数，用于动态生成替换字符串。

```javascript
'价格: 100元'.replace(/\d+/, match => match * 2); // "价格: 200元"
```

---

## 7. 标志详解

### 7.1 `g`（全局匹配）

使正则表达式在字符串中查找所有匹配，而不仅限于第一个。影响 `exec`、`match`、`replace` 等方法的行为。

### 7.2 `i`（忽略大小写）

匹配时不区分字母大小写。

### 7.3 `m`（多行模式）

使 `^` 和 `$` 不仅匹配整个字符串的开头和结尾，还匹配每行的开头（紧接换行符之后）和结尾（紧接换行符之前）。

### 7.4 `s`（dotAll，ES2018）

使 `.` 元字符匹配包括换行符（`\n`、`\r`）在内的任何单个字符。没有此标志时，`.` 不匹配换行。

### 7.5 `u`（Unicode，ES6）

- 将模式视为 Unicode 码点序列，而非 UTF-16 代码单元。
- 启用 `\p{...}` 和 `\P{...}` 转义（匹配 Unicode 属性）。
- 正确处理大于 `\uFFFF` 的字符（如 emoji）。
- 同时修正量词作用于码点而非代码单元。

```javascript
/^.$/.test('😀');       // false，因为 😀 占两个代码单元
/^.$/u.test('😀');      // true，u 标志使其正确匹配
/\p{Emoji}/u.test('😀'); // true
```

### 7.6 `y`（粘性匹配，ES6）

与 `g` 类似，但只从 `lastIndex` 指定的位置开始匹配，并且匹配失败时不会向前扫描。`lastIndex` 仅在匹配成功时更新。常用于词法分析。

```javascript
const re = /a/y;
re.lastIndex = 2;
'a a a'.match(re); // null，因为索引2处不是 'a'
```

---

## 8. ES2018+ 新特性

### 8.1 命名捕获组

允许为捕获组指定名称，使代码更清晰。语法：`(?<name>pattern)`。在结果中可通过 `groups` 属性访问。

```javascript
const re = /(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/;
const match = '2025-02-25'.exec(re);
console.log(match.groups.year);  // '2025'
console.log(match.groups.month); // '02'
```

在 `replace` 中可以用 `$<name>` 引用命名组。

```javascript
'2025-02-25'.replace(re, '$<month>/$<day>/$<year>'); // "02/25/2025"
```

### 8.2 后行断言

前面已介绍，`(?<=...)` 正向后行断言，`(?<!...)` 负向后行断言。它们允许基于前面的内容进行匹配。

```javascript
// 匹配以 "foo" 开头的单词
/(?<=foo)bar/.test('foobar'); // true
/(?<!foo)bar/.test('xbar');   // true
```

### 8.3 正则表达式中的 Unicode 属性转义

在 `u` 标志下，使用 `\p{Property}` 匹配具有特定 Unicode 属性的字符，`\P{Property}` 匹配不具有该属性的字符。

```javascript
/\p{Script=Greek}/u.test('π'); // true
/\p{White_Space}/u.test(' ');  // true
```

---

## 9. 注意事项与最佳实践

### 9.1 `lastIndex` 与全局匹配的陷阱

当使用带有 `g` 或 `y` 标志的正则表达式时，`lastIndex` 属性会在 `exec` 和 `test` 调用后自动更新。如果不小心复用同一个正则对象，可能会产生意外结果。

```javascript
const re = /a/g;
console.log(re.test('a')); // true
console.log(re.test('a')); // false！因为 lastIndex 已经移到了1
```

**解决方案**：

- 每次使用后手动重置 `lastIndex = 0`。
- 避免复用同一个带 `g` 标志的正则对象，或每次使用前重新创建。

### 9.2 正则表达式的性能

- 复杂的正则可能导致**灾难性回溯**（Catastrophic Backtracking），尤其是嵌套量词。应避免类似 `(a+)+` 的模式。
- 尽量使用字符类而不是交替（`|`）提高效率。
- 对于简单的字符串操作，使用字符串方法（如 `includes`、`startsWith`）可能更快。

### 9.3 动态创建正则时的转义

当从用户输入构建正则时，必须对用户输入进行转义，防止注入或语法错误。

```javascript
function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
const userInput = '*.js';
const safePattern = new RegExp('^' + escapeRegExp(userInput));
```

### 9.4 正则表达式的静态属性

`RegExp` 构造函数有一些静态属性（如 `RegExp.$1`、`RegExp.input` 等），用于存储最近一次匹配的信息。但这些属性已不推荐使用，且在严格模式下可能不可用。应避免依赖它们。

### 9.5 优先使用 `matchAll` 而非循环 `exec`

当需要获取所有匹配的详细信息（包括捕获组）时，`matchAll` 返回迭代器，更简洁且避免了 `lastIndex` 陷阱。

```javascript
const re = /(a)(b)/g;
const str = 'ab ab';
for (const match of str.matchAll(re)) {
  console.log(match[0], match[1], match[2]);
}
```

### 9.6 测试正则表达式的工具

在编写复杂正则时，推荐使用在线工具（如 regex101.com）进行调试，它们会解释匹配步骤，帮助发现性能问题。

### 9.7 注意 Unicode 字符的处理

对于包含中文、emoji 等字符的字符串，务必使用 `u` 标志，以确保 `.`、量词、字符类按码点正确处理。

---

## 10. 总结

`RegExp` 是 JavaScript 文本处理的利器。本章涵盖了：

- 正则表达式的两种创建方式。
- 实例属性与标志的含义。
- 实例方法 `exec`、`test` 的使用。
- 正则语法速查表（字符类、量词、断言、分组）。
- 字符串方法中的正则应用。
- ES6+ 新特性（`u`、`y`、命名捕获组、后行断言、Unicode 属性转义）。
- 最佳实践和常见陷阱。

掌握 `RegExp`，你就能高效地完成各种文本匹配、提取和转换任务。在实际开发中，合理运用正则表达式可以大幅提升代码的简洁性和表达能力。
