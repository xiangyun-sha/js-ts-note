# String

[TOC]

---

`String` 是 JavaScript 中用于表示和操作文本字符串的内置构造函数。字符串是原始数据类型之一，但在需要时 JavaScript 会自动将字符串原始值包装为 `String` 对象，从而可以调用其方法。`String` 提供了丰富的实例方法用于文本处理（如查找、替换、截取、转换等），以及一些实用的静态方法。理解 `String` 及其方法是日常 JavaScript 开发的基础。

本章将全面介绍 `String` 构造函数、静态方法、实例方法、模板字符串的使用，并提供大量的示例和最佳实践。

---

## 1. 概述

在 JavaScript 中，字符串是不可变的序列，由 16 位 Unicode 字符组成。字符串可以用三种方式创建：

- **字符串字面量**：使用单引号 `'`、双引号 `"` 或反引号 `` ` ``（模板字符串）。
- **`String` 函数**：作为普通函数调用，将任意值转换为字符串。
- **`new String()` 构造函数**：很少使用，会创建一个 `String` 对象（而不是原始值）。

```javascript
const str1 = 'hello';           // 字符串原始值
const str2 = "world";            // 字符串原始值
const str3 = `hello ${str2}`;    // 模板字符串，支持插值
const str4 = String(123);        // "123"（原始值）
const str5 = new String('test'); // String 对象，不推荐使用
```

虽然字符串是原始类型，但当访问字符串的属性或方法时，JavaScript 内部会临时将字符串原始值包装成 `String` 对象，从而可以调用 `String.prototype` 上的方法。这个过程称为“自动装箱”。

```javascript
console.log('abc'.length); // 3，临时创建 String 对象
```

**注意**：`new String('test')` 创建的是对象，与原始字符串 `'test'` 类型不同，且使用 `==` 相等性比较时容易混淆，应避免使用。

---

## 2. String 构造函数

### 语法

```javascript
new String(value)
String(value)
```

- **`String(value)`**（作为普通函数）：将 `value` 转换为字符串原始值并返回。如果不传参数，返回空字符串 `""`。
- **`new String(value)`**（作为构造函数）：返回一个 `String` 对象，其内部包含转换后的字符串值。

**示例**：

```javascript
String(123);        // "123"
String(true);       // "true"
String(null);       // "null"
String(undefined);  // "undefined"
String({ a: 1 });   // "[object Object]"

new String('hello'); // String {'hello'}（对象）
```

通常，我们直接使用字符串字面量，很少显式调用 `String` 函数，除非需要将其他类型明确转换为字符串。

---

## 3. 静态方法

### 3.1 `String.fromCharCode(num1, ..., numN)`

返回由指定的 UTF-16 代码单元序列创建的字符串。参数是一个或多个介于 0 到 65535 之间的整数。

```javascript
String.fromCharCode(65, 66, 67); // "ABC"
String.fromCharCode(9731);       // "☃"
```

### 3.2 `String.fromCodePoint(num1, ..., numN)`（ES6）

返回由指定的代码点序列创建的字符串。可以处理大于 0xFFFF 的 Unicode 字符（如 emoji）。

```javascript
String.fromCodePoint(9731, 9733, 9842); // "☃★♲"
String.fromCodePoint(128512);            // "😀"
```

### 3.3 `String.raw`（ES6）

标签函数，用于获取模板字符串的原始字符串形式（不处理转义序列）。

```javascript
const path = String.raw`C:\Users\name`; // 反斜杠不被转义
console.log(path); // "C:\Users\name"
```

---

## 4. 实例属性

### `length`

返回字符串的长度（字符数）。注意对于超出基本多文种平面的字符（如 emoji），它被视为两个代码单元，但 `length` 仍然按 UTF-16 代码单元计数。

```javascript
'hello'.length; // 5
'😀'.length;    // 2（因为 emoji 占用两个代码单元）
```

---

## 5. 实例方法

所有字符串实例都继承自 `String.prototype`，拥有以下常用方法（按功能分类）。

### 5.1 访问字符

#### `charAt(index)`

返回指定索引位置的字符（字符串）。

```javascript
'hello'.charAt(1); // "e"
```

#### `charCodeAt(index)`

返回指定索引处字符的 UTF-16 代码单元值（0–65535）。

```javascript
'hello'.charCodeAt(1); // 101
```

#### `codePointAt(index)`（ES6）

返回指定索引处字符的 Unicode 代码点值（可处理大于 0xFFFF 的字符）。

```javascript
'😀'.codePointAt(0); // 128512
```

#### `at(index)`（ES2022）

返回指定索引位置的字符，支持负索引（从末尾倒数）。

```javascript
'hello'.at(1);  // "e"
'hello'.at(-1); // "o"
```

### 5.2 查找与检查

#### `indexOf(searchString, position)`

返回 `searchString` 首次出现的索引，从 `position` 开始搜索；如果未找到返回 -1。

```javascript
'hello world'.indexOf('o');  // 4
'hello world'.indexOf('o', 5); // 7
```

#### `lastIndexOf(searchString, position)`

从后向前搜索，返回最后一次出现的索引。

```javascript
'hello world'.lastIndexOf('o'); // 7
```

#### `includes(searchString, position)`（ES6）

判断是否包含子串，返回布尔值。

```javascript
'hello world'.includes('world'); // true
'hello'.includes('o', 3);        // false（从索引3开始）
```

#### `startsWith(searchString, position)`（ES6）

判断字符串是否以指定子串开头。

```javascript
'hello'.startsWith('he');   // true
'hello'.startsWith('lo', 3); // true（从索引3开始）
```

#### `endsWith(searchString, position)`（ES6）

判断字符串是否以指定子串结尾。可选 `position` 表示视为字符串的长度。

```javascript
'hello'.endsWith('lo');      // true
'hello'.endsWith('he', 2);   // true（考虑前2个字符 "he"）
```

### 5.3 提取子串

#### `slice(beginIndex, endIndex)`

返回从 `beginIndex` 到 `endIndex`（不包括）的子串。支持负索引。

```javascript
'hello world'.slice(0, 5);   // "hello"
'hello world'.slice(-5);     // "world"
```

#### `substring(beginIndex, endIndex)`

类似 `slice`，但不支持负索引，且会将负数视为 0，且自动调整参数顺序（如果 `beginIndex > endIndex` 则交换）。

```javascript
'hello world'.substring(0, 5);   // "hello"
'hello world'.substring(6, 0);   // "hello"（自动交换）
```

#### `substr(start, length)`（已废弃）

返回从 `start` 开始指定长度的子串。已不推荐使用，建议用 `slice` 代替。

### 5.4 字符串转换

#### `toLowerCase()` / `toUpperCase()`

返回转换为小写/大写的新字符串。

```javascript
'Hello'.toLowerCase(); // "hello"
'Hello'.toUpperCase(); // "HELLO"
```

#### `toLocaleLowerCase(locale?)` / `toLocaleUpperCase(locale?)`

根据特定区域设置转换大小写（如土耳其语的点i问题）。

```javascript
'İstanbul'.toLocaleLowerCase('tr'); // "istanbul"
```

#### `normalize(form)`（ES6）

返回字符串的 Unicode 标准化形式（`'NFC'`、`'NFD'`、`'NFKC'`、`'NFKD'`）。用于处理重音符号等组合字符。

```javascript
const str = '\u00E9';            // "é" (NFC)
const norm = str.normalize('NFD'); // "é"（分解为 e + 重音）
```

### 5.5 连接与填充

#### `concat(str1, str2, ...)`

连接多个字符串，返回新字符串（不改变原字符串）。通常直接用 `+` 或模板字符串更简洁。

```javascript
'hello'.concat(' ', 'world'); // "hello world"
```

#### `padStart(targetLength, padString?)`（ES2017）

从开头填充至指定长度。`padString` 默认为空格。

```javascript
'5'.padStart(3, '0'); // "005"
'hello'.padStart(10, '*'); // "*****hello"
```

#### `padEnd(targetLength, padString?)`（ES2017）

从末尾填充。

```javascript
'5'.padEnd(3, '0'); // "500"
```

#### `repeat(count)`（ES6）

返回将原字符串重复 `count` 次的新字符串。

```javascript
'ha'.repeat(3); // "hahaha"
```

### 5.6 修剪空白

#### `trim()`

移除字符串两端空白字符（空格、制表符、换行等）。

```javascript
'  hello  '.trim(); // "hello"
```

#### `trimStart()` / `trimLeft()`（ES2019）

移除开头空白。

#### `trimEnd()` / `trimRight()`（ES2019）

移除末尾空白。

```javascript
'  hello  '.trimStart(); // "hello  "
'  hello  '.trimEnd();   // "  hello"
```

### 5.7 拆分与匹配

#### `split(separator, limit)`

使用指定的分隔符将字符串拆分为数组。`separator` 可以是字符串或正则表达式。

```javascript
'a,b,c'.split(',');      // ["a", "b", "c"]
'hello'.split('');       // ["h", "e", "l", "l", "o"]
'2025-02-24'.split('-'); // ["2025", "02", "24"]
```

#### `match(regexp)`

使用正则表达式匹配字符串。返回匹配结果数组，如果没有匹配则返回 `null`。若正则带有 `g` 标志，返回所有匹配项。

```javascript
'hello 123 world'.match(/\d+/);   // ["123"]
'hello 123 world 456'.match(/\d+/g); // ["123", "456"]
```

#### `matchAll(regexp)`（ES2020）

返回一个迭代器，包含所有匹配结果（包括捕获组）。要求正则必须有 `g` 标志。

```javascript
const str = 'test1 test2 test3';
const regex = /t(e)(st)(\d)/g;
for (const match of str.matchAll(regex)) {
  console.log(match[0], match[1], match[2], match[3]);
}
// test1 e st 1
// test2 e st 2
// test3 e st 3
```

#### `search(regexp)`

返回第一个匹配正则表达式的索引，否则返回 -1。

```javascript
'hello world'.search(/world/); // 6
```

#### `replace(regexp|substr, newSubstr|function)`

替换匹配的子串。可以接受字符串或正则表达式。如果第一个参数是字符串，只替换第一个匹配项。要替换所有，使用正则的 `g` 标志或 `replaceAll`。

```javascript
'hello world'.replace('world', 'JS');  // "hello JS"
'hello hello'.replace(/hello/g, 'hi'); // "hi hi"
```

`replace` 的第二个参数可以是函数，用于动态生成替换内容。

#### `replaceAll(pattern, replacement)`（ES2021）

替换所有匹配项，`pattern` 可以是字符串或正则（必须带 `g` 标志）。

```javascript
'hello hello'.replaceAll('hello', 'hi'); // "hi hi"
```

### 5.8 比较

#### `localeCompare(compareString, locales?, options?)`

返回一个数字，指示原字符串在排序顺序中是否在比较字符串之前、之后或相同。常用于自定义排序。

```javascript
'a'.localeCompare('b'); // -1（或负数）
'b'.localeCompare('a'); // 1（或正数）
'a'.localeCompare('a'); // 0
```

可以指定区域设置和选项，如忽略大小写、重音等。

### 5.9 其他

#### `toString()` / `valueOf()`

返回字符串原始值（对于 `String` 对象，提取其内部值）。

```javascript
const strObj = new String('test');
strObj.valueOf(); // "test"
strObj.toString(); // "test"
```

#### `[Symbol.iterator]`（ES6）

字符串可迭代，支持 `for...of` 循环和展开运算符。迭代器按 Unicode 码点遍历，可以正确处理大于 0xFFFF 的字符。

```javascript
for (const ch of '😀') {
  console.log(ch); // "😀"（正确输出，而不是拆分成两个代理对）
}
[...'😀']; // ["😀"]
```

---

## 6. 模板字符串

ES6 引入的模板字符串（使用反引号 `` ` ``）提供了更强大的字符串处理能力：

- **字符串插值**：`${expression}` 嵌入表达式。
- **多行字符串**：直接写换行。
- **标签模板**：通过标签函数处理模板字符串。

```javascript
const name = 'Alice';
const age = 30;
const greeting = `Hello, ${name}! You are ${age} years old.`;
console.log(greeting);
```

**标签模板示例**：

```javascript
function highlight(strings, ...values) {
  return strings.reduce((result, str, i) => {
    return `${result}${str}<mark>${values[i] || ''}</mark>`;
  }, '');
}
const name = 'Alice';
const message = highlight`Hello, ${name}!`;
console.log(message); // Hello, <mark>Alice</mark>!
```

---

## 7. Unicode 与编码问题

JavaScript 内部使用 UTF-16 编码。大多数常用字符用一个 16 位代码单元表示，但某些字符（如 emoji、生僻汉字）需要两个代码单元（代理对）。这导致 `length` 属性可能不反映用户感知的字符数，且部分方法（如 `charAt`）可能返回不完整的字符。

**处理策略**：

- 使用 `Array.from(str)` 或 `[...str]` 按 Unicode 码点分割。
- 使用 `for...of` 循环遍历字符。
- 使用正则的 `u` 标志启用 Unicode 模式。
- 使用 `codePointAt` 和 `String.fromCodePoint` 处理码点。

```javascript
const str = '😀';
console.log(str.length);        // 2
console.log([...str].length);   // 1
```

---

## 8. 使用示例

### 8.1 字符串反转

```javascript
function reverseString(str) {
  return [...str].reverse().join('');
}
reverseString('hello'); // "olleh"
```

### 8.2 判断回文

```javascript
function isPalindrome(str) {
  const clean = str.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
  return clean === [...clean].reverse().join('');
}
isPalindrome('A man, a plan, a canal: Panama'); // true
```

### 8.3 统计字符出现次数

```javascript
function countChar(str, char) {
  return [...str].filter(c => c === char).length;
}
countChar('hello world', 'l'); // 3
```

### 8.4 截断字符串并添加省略号

```javascript
function truncate(str, maxLength, suffix = '...') {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - suffix.length) + suffix;
}
truncate('This is a long sentence', 10); // "This is a..."
```

### 8.5 转义 HTML

```javascript
function escapeHTML(str) {
  return str.replace(/[&<>"']/g, function(match) {
    const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
    return map[match];
  });
}
escapeHTML('<script>alert("xss")</script>');
// "&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;"
```

### 8.6 驼峰命名转短横线

```javascript
function camelToKebab(str) {
  return str.replace(/([A-Z])/g, '-$1').toLowerCase();
}
camelToKebab('backgroundColor'); // "background-color"
```

---

## 9. 最佳实践与注意事项

### 9.1 字符串是不可变的

所有字符串方法都返回新字符串，不会修改原字符串。

### 9.2 避免使用 `new String()`

始终使用字符串字面量或 `String(value)`，避免产生对象类型的字符串，以免混淆。

### 9.3 使用模板字符串代替字符串拼接

模板字符串更清晰、易读，且支持多行。

### 9.4 处理 Unicode 时注意代理对

使用 `for...of` 或 `Array.from` 遍历字符，确保正确处理 emoji 等特殊字符。

### 9.5 正则中使用 `u` 标志

当处理包含代理对的字符串时，在正则表达式后加上 `u` 标志，使正则正确匹配码点而非代码单元。

### 9.6 性能考虑

在循环中拼接大量字符串时，应使用数组收集片段，最后用 `join` 连接，或使用 `StringBuilder` 模式，避免产生大量中间字符串。

```javascript
// 低效
let result = '';
for (let i = 0; i < 1000; i++) {
  result += i + ',';
}
// 高效
const parts = [];
for (let i = 0; i < 1000; i++) {
  parts.push(i);
}
const result = parts.join(',');
```

### 9.7 注意 `trim` 的空白定义

`trim` 移除的空白包括空格、制表符、换行等，但不包括不断空格（`\u00A0`），可使用正则 `\s` 匹配所有空白。

### 9.8 优先使用现代方法

- 用 `includes` 代替 `indexOf !== -1`。
- 用 `startsWith` / `endsWith` 代替正则或切片。
- 用 `replaceAll` 代替带 `g` 正则的 `replace`（当替换字符串时）。

### 9.9 字符串与正则结合时注意转义

如果要在正则中动态包含用户输入的字符串，需先对特殊字符进行转义。

```javascript
function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
```

---

## 小结

`String` 是 JavaScript 中处理文本的核心工具。本章详细介绍了：

- 字符串的创建方式与不可变性
- 静态方法：`fromCharCode`、`fromCodePoint`、`raw`
- 常用实例方法：访问、查找、截取、转换、填充、修剪、匹配等
- 模板字符串与标签模板
- Unicode 编码处理
- 丰富的使用示例和最佳实践

掌握 `String` 的方法，将让你在处理用户输入、数据格式化、文本分析等任务时更加得心应手。在后续的标准库章节中，我们将继续学习 `Number`、`Array` 等其他核心内置对象。
