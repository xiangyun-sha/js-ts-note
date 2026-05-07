# 数据结构

[TOC]

---

数据结构是计算机存储、组织数据的方式，它决定了数据的访问效率、修改方式以及表达能力的强弱。在 JavaScript 中，数据结构主要依托于对象（Object）和数组（Array），并辅以 ES6 新增的 Map、Set 等。理解这些内置数据结构以及引用类型的概念，是编写高效、可维护代码的关键。

本章将深入介绍 JavaScript 中的各种数据结构，重点阐述引用数据类型的特性（如存储方式、赋值行为、可变性），并探讨如何在不同场景下选择合适的数据结构。

---

## 1. 数据结构概述

**数据结构** 是指数据元素之间的关系以及对这些元素进行操作的方法。程序本质上是在处理数据，选择合适的数据结构可以：

- **提高效率**：例如数组的随机访问很快，但插入删除较慢；链表的插入删除很快，但查找较慢。
- **简化算法**：合适的数据结构能让算法表达更清晰。
- **增强可读性**：用对象表达实体比用多个散落变量更符合人的思维。

JavaScript 作为高级语言，内置了多种数据结构，同时也允许开发者通过组合实现更复杂的结构（如栈、队列、树等）。

---

## 2. 数据类型回顾：原始类型与引用类型

在深入学习数据结构之前，需要明确 JavaScript 中的两大类数据类型：

### 2.1 原始类型（Primitive Types）

- **种类**：`string`、`number`、`boolean`、`undefined`、`null`、`symbol`、`bigint`。
- **特点**：
  - 值本身是不可变的（例如字符串的某个字符不能直接修改）。
  - 变量直接存储值，赋值时是**值拷贝**。
  - 比较时比较的是值（严格相等）。

### 2.2 引用类型（Reference Types）

- **种类**：对象（Object）、数组（Array）、函数（Function）、日期（Date）、正则（RegExp）以及所有通过 `new` 创建的对象。
- **特点**：
  - 值是存储在堆内存中的对象，变量存储的是指向该对象的**引用（地址）**。
  - 赋值时是**引用拷贝**，即多个变量可能指向同一个对象。
  - 比较时比较的是引用（是否指向同一个对象），而不是内容。

理解引用类型的行为是正确使用数据结构的基石。

---

## 3. 引用类型详解

### 3.1 对象（Object）

对象是最基本的引用类型，用于存储键值对集合。键通常是字符串（或 Symbol），值可以是任何类型。

```javascript
const person = {
  name: 'Alice',
  age: 30,
  greet() {
    console.log(`Hello, I'm ${this.name}`);
  }
};
```

**特性**：

- 属性可以通过点号（`.`）或方括号（`[]`）访问。
- 属性可以动态添加、修改或删除（`delete`）。
- 对象是可变的：修改属性会影响所有引用该对象的变量。

### 3.2 数组（Array）

数组是一种特殊的对象，用于存储有序列表。数组的键是数字索引，并拥有内置的方法（如 `push`、`pop`、`map` 等）。

```javascript
const colors = ['red', 'green', 'blue'];
colors.push('yellow'); // 添加元素
console.log(colors[0]); // 'red'
```

数组也是引用类型，因此赋值给另一个变量时，两者指向同一个数组。

### 3.3 函数（Function）

函数在 JavaScript 中也是对象，可以拥有属性和方法，并且可以作为值传递。

```javascript
function add(a, b) { return a + b; }
add.description = '加法函数'; // 给函数添加属性
```

函数引用类型的特点同样适用：将函数赋值给另一个变量，它们引用同一个函数。

### 3.4 其他内置引用类型

- **Date**：日期对象。
- **RegExp**：正则表达式对象。
- **Map、Set、WeakMap、WeakSet**：ES6 引入的专用数据结构（见后文）。
- 通过构造函数创建的对象：`new Number(5)`（虽然不推荐使用包装对象）。

---

## 4. 常见数据结构及其操作

### 4.1 对象（Object）作为字典/哈希表

对象最适合表示**键值对集合**，键通常是字符串，值可以是任意类型。

**常用操作**：

```javascript
const dict = {};

// 添加/修改属性
dict.key1 = 'value1';
dict['key2'] = 'value2';

// 访问
console.log(dict.key1); // 'value1'
console.log(dict['key2']); // 'value2'

// 检查属性是否存在
console.log('key1' in dict); // true
console.log(dict.hasOwnProperty('key1')); // true

// 删除属性
delete dict.key1;

// 遍历
for (let key in dict) {
  console.log(key, dict[key]);
}
Object.keys(dict).forEach(key => console.log(key, dict[key]));
```

**注意**：对象作为字典时，键会被转换为字符串（Symbol 除外），因此数字键 `1` 和字符串 `'1'` 是等效的。此外，对象原型链上的属性也可能被遍历到（需用 `hasOwnProperty` 过滤）。

### 4.2 数组（Array）作为列表/栈/队列

数组是**有序集合**，适合存储按顺序访问的数据。

**常用操作**：

```javascript
const arr = [1, 2, 3];

// 添加/删除末尾
arr.push(4);      // [1,2,3,4]
arr.pop();        // [1,2,3]

// 添加/删除开头
arr.unshift(0);   // [0,1,2,3]
arr.shift();      // [1,2,3]

// 查找
arr.indexOf(2);   // 1
arr.includes(2);  // true
arr.find(x => x > 1); // 2（返回第一个满足条件的元素）
arr.findIndex(x => x > 1); // 1

// 迭代
arr.forEach((item, index) => console.log(index, item));
const doubled = arr.map(x => x * 2); // [2,4,6]
const evens = arr.filter(x => x % 2 === 0); // [2]

// 合并/切片
const arr2 = [4,5];
const combined = arr.concat(arr2); // [1,2,3,4,5]
const slice = arr.slice(1, 3); // [2,3]

// 排序与反转
arr.sort((a,b) => a - b); // 升序
arr.reverse();

// 栈/队列模拟
// 栈：push/pop
// 队列：push/shift（但 shift 效率低，可考虑使用双端队列或索引模拟）
```

**注意**：数组的 `shift` 和 `unshift` 会重新排列索引，性能较 `push`/`pop` 差。若需要高效队列，可使用链表或双端队列实现。

### 4.3 Map（映射）

ES6 引入的 `Map` 是另一种键值对集合，与对象相比有以下特点：

- 键可以是任意类型（包括对象、函数）。
- 键值对顺序按插入顺序排列。
- 可以直接获取大小（`size` 属性）。
- 性能优于对象在频繁增删键值对的场景。

```javascript
const map = new Map();
const keyObj = { id: 1 };
const keyFunc = () => {};

map.set('name', 'Alice');
map.set(keyObj, 'object value');
map.set(keyFunc, 'function value');

console.log(map.get('name')); // 'Alice'
console.log(map.has(keyObj)); // true
console.log(map.size); // 3

// 遍历
map.forEach((value, key) => console.log(key, value));
for (let [key, value] of map) {
  console.log(key, value);
}

// 删除
map.delete(keyObj);
map.clear(); // 清空
```

**适用场景**：需要非字符串键、需要保持插入顺序、或需要频繁增删时，优先使用 `Map`。

### 4.4 Set（集合）

`Set` 用于存储**唯一值**的集合，值可以是任何类型。它自动去除重复项。

```javascript
const set = new Set([1, 2, 3, 3, 4]); // {1,2,3,4}
set.add(5);
set.add(1); // 忽略，已存在
console.log(set.has(2)); // true
console.log(set.size); // 5

// 遍历
set.forEach(value => console.log(value));
for (let value of set) {
  console.log(value);
}

// 删除
set.delete(3);
set.clear();
```

**适用场景**：数组去重、判断元素是否存在、交集/并集/差集运算（可结合数组方法）。

### 4.5 WeakMap 与 WeakSet

`WeakMap` 和 `WeakSet` 是“弱引用”版本的 `Map` 和 `Set`，它们对键（或值）的引用是弱引用，不影响垃圾回收。因此它们不可遍历，也没有 `size` 属性。

- **WeakMap**：键必须是对象，当键对象被垃圾回收后，对应的键值对会自动移除。
- **WeakSet**：值必须是对象，当值对象被回收后，自动移除。

主要用于存储与对象关联的额外数据，且希望不影响对象生命周期（如 DOM 节点的元数据）。

```javascript
let user = { name: 'Alice' };
const wm = new WeakMap();
wm.set(user, 'some data');

// 当 user = null 后，user 对象会被回收，wm 中的对应项自动消失（不可观测）
```

---

## 5. 引用类型的特性深入

### 5.1 存储与赋值

- **原始类型**：存储在栈内存中，变量直接持有值。
- **引用类型**：值存储在堆内存中，变量持有的是堆内存地址（引用）。

```javascript
let a = 5;
let b = a; // 值拷贝，a 和 b 独立
b = 10;
console.log(a); // 5

let obj1 = { count: 5 };
let obj2 = obj1; // 引用拷贝，指向同一对象
obj2.count = 10;
console.log(obj1.count); // 10
```

### 5.2 比较

- **原始类型**：比较值是否相等。
- **引用类型**：比较引用是否指向同一对象（内容相同但不同对象返回 `false`）。

```javascript
console.log(5 === 5); // true
console.log({} === {}); // false，两个不同的对象
console.log([] === []); // false

const arr1 = [1,2];
const arr2 = arr1;
console.log(arr1 === arr2); // true
```

### 5.3 可变性

引用类型是可变的，即可以通过引用修改对象的内容，而不改变引用本身。

```javascript
const obj = { name: 'Alice' };
obj.name = 'Bob'; // 允许，对象内容改变
// obj = { name: 'Charlie' }; // 错误，不能重新赋值常量
```

原始类型是不可变的，看似修改其实是重新赋值。

```javascript
let str = 'hello';
str[0] = 'H'; // 无效，字符串不可变
console.log(str); // 'hello'
str = 'Hello'; // 重新赋值，指向新字符串
```

---

## 6. 拷贝问题：浅拷贝与深拷贝

由于引用类型的赋值是引用拷贝，有时我们需要创建一个内容相同但独立的新对象，这就是拷贝。

### 6.1 浅拷贝（Shallow Copy）

浅拷贝只复制对象的第一层属性，如果属性值是引用类型，则复制的是引用，新旧对象共享该引用。

**实现方式**：

- 对象：`Object.assign({}, obj)`、展开运算符 `{...obj}`
- 数组：`Array.from(arr)`、`[...arr]`、`arr.slice()`

```javascript
const original = { a: 1, b: { c: 2 } };
const shallowCopy = { ...original };

shallowCopy.a = 100; // 修改基本类型，不影响原对象
shallowCopy.b.c = 200; // 修改引用类型，原对象也受影响
console.log(original.b.c); // 200
```

### 6.2 深拷贝（Deep Copy）

深拷贝递归复制所有层级，得到一个完全独立的对象。

**实现方式**：

- **`JSON.parse(JSON.stringify(obj))`**：简单但有限制（不能处理函数、undefined、Symbol、循环引用）。
- **递归手动实现**：处理各种类型。
- **使用结构化克隆**：`structuredClone()`（现代浏览器和 Node.js 17+ 支持）。
- **第三方库**：`lodash.cloneDeep`。

```javascript
// 使用 structuredClone
const deepCopy = structuredClone(original);
deepCopy.b.c = 300;
console.log(original.b.c); // 200，不受影响

// 手动深拷贝简易示例（不完整）
function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(deepClone);
  const cloned = {};
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key]);
    }
  }
  return cloned;
}
```

**注意**：深拷贝可能引起性能问题，且需处理循环引用和特殊对象（如 Date、RegExp）。实际开发中按需使用。

---

## 7. 选择合适的数据结构

不同数据结构各有优劣，应根据场景选择：

| 数据结构            | 适用场景                                       | 优点                        | 缺点                                         |
| ------------------- | ---------------------------------------------- | --------------------------- | -------------------------------------------- |
| **对象**            | 表示实体（属性固定）、字典（键为字符串）       | 使用方便，属性访问快        | 键只能是字符串/Symbol，顺序无保证（ES5之前） |
| **数组**            | 有序列表、栈、队列                             | 随机访问快，方法丰富        | 插入/删除中间元素慢（O(n)）                  |
| **Map**             | 键值对集合，键可以是任意类型，需要保持插入顺序 | 键类型灵活，性能好，有 size | 无法用点号访问，语法稍复杂                   |
| **Set**             | 唯一值集合，去重，判断存在                     | 自动去重，查找快            | 无序，无法通过索引访问                       |
| **WeakMap/WeakSet** | 与对象关联的私有数据，避免内存泄漏             | 不影响垃圾回收              | 不可遍历，无 size                            |

此外，对于更复杂的需求，可以自行封装**栈、队列、链表、树**等数据结构，利用数组或对象实现。

---

## 8. 最佳实践与注意事项

### 8.1 避免直接修改引用导致意外

当函数接收引用类型参数时，若修改其内容，会影响外部。若不想改变原对象，应进行拷贝。

```javascript
function appendItem(arr, item) {
  arr.push(item); // 会修改原数组
}s
function appendItemSafe(arr, item) {
  return [...arr, item]; // 返回新数组
}
```

### 8.2 使用 `const` 声明引用类型

用 `const` 声明对象或数组，可以防止变量被重新赋值，但内容仍可修改。这是一种好的实践，表明该变量应始终指向同一个对象。

```javascript
const settings = { theme: 'dark' };
settings.theme = 'light'; // 允许
// settings = {}; // 错误
```

### 8.3 比较对象内容需逐属性比较

不能直接用 `===` 比较两个不同对象的内容，需手动比较或借助库（如 `lodash.isEqual`）。

```javascript
function isEqual(obj1, obj2) {
  // 简易实现，只适用于简单对象
  return JSON.stringify(obj1) === JSON.stringify(obj2);
}
```

### 8.4 使用扩展运算符进行不可变更新

在 React 或 Redux 等场景中，提倡不可变数据。用展开运算符创建新对象/数组来更新状态。

```javascript
const state = { users: [], loading: false };
const newState = { ...state, loading: true };
```

### 8.5 谨慎处理循环引用

在深拷贝或序列化时，循环引用会导致错误或无限递归。使用 `JSON.stringify` 会抛出异常，结构化克隆能处理部分循环引用。

---

## 9. 小结

本章详细介绍了 JavaScript 中的数据结构及其核心概念——引用数据类型。主要内容包括：

- **引用类型** 的特点：存储引用、赋值传引用、比较引用、可变性。
- **常用数据结构**：对象、数组、Map、Set 的创建、操作和适用场景。
- **拷贝问题**：浅拷贝与深拷贝的区别及实现方法。
- **选择指南**：根据需求选择合适的数据结构。
- **最佳实践**：避免意外修改、使用 `const`、不可变更新等。

理解数据结构与引用类型是编写可靠 JavaScript 代码的基础。在实际开发中，灵活运用这些内置数据结构，并清楚它们的内存模型，能够有效避免许多隐蔽的 bug。下一节我们将学习模块化，探讨如何组织大型代码库。
