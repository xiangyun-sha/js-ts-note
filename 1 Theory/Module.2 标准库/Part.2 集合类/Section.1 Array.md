# Array

[TOC]

---

`Array` 是 JavaScript 中最常用的内置对象之一，也是常用的集合类，用于表示有序的元素集合。数组可以存储任意类型的数据（包括对象、函数、其他数组等），并且其长度可以动态变化。JavaScript 数组本质上是对象，但拥有特殊的 `length` 属性和一系列强大的方法，使其成为处理数据集合的理想工具。

本章将全面介绍 `Array` 构造函数、静态方法、实例属性、实例方法（按功能分类），并提供丰富的使用示例和最佳实践，帮助你高效地操作数组。

---

## 1. 概述

### 1.1 什么是数组？

数组是一种类似列表的对象，其元素通过从 0 开始的数字索引进行访问。数组的 `length` 属性反映了元素的个数（注意：`length` 并不总是等于元素个数，但通常如此）。数组是动态的，可以随时添加或删除元素。

```javascript
const fruits = ['apple', 'banana', 'orange'];
console.log(fruits[0]); // 'apple'
console.log(fruits.length); // 3
```

### 1.2 数组的特点

- **动态大小**：无需预先定义长度，可以随时添加元素。
- **异构性**：可以存储不同类型的元素。

  ```javascript
  const mixed = [1, 'hello', true, { name: 'Alice' }, [2, 3]];
  ```

- **索引从 0 开始**：第一个元素的索引为 0，最后一个为 `length - 1`。
- **稀疏数组**：如果元素不连续，数组可能是稀疏的（存在空槽）。
- **继承自 `Array.prototype`**：拥有丰富的实例方法。

### 1.3 创建数组的方式

#### 1.3.1 数组字面量（推荐）

```javascript
const arr = [1, 2, 3];
```

#### 1.3.2 `Array` 构造函数

```javascript
const arr1 = new Array();        // []
const arr2 = new Array(5);       // 创建一个长度为5的稀疏数组（空槽×5）
const arr3 = new Array(1, 2, 3); // [1, 2, 3]
```

**注意**：当只传递一个数字参数时，它表示数组长度，而不是单个元素。这容易引起歧义，因此通常不推荐使用 `Array` 构造函数创建数组。

#### 1.3.3 `Array.of()`（ES6）

创建一个新数组，无论参数数量或类型，参数即为数组元素。

```javascript
Array.of(5);       // [5]（而不是长度为5的空数组）
Array.of(1, 2, 3); // [1, 2, 3]
```

#### 1.3.4 `Array.from()`（ES6）

从类数组对象（如 `arguments`、`NodeList`）或可迭代对象（如 `Set`、`Map`、字符串）创建新数组。

```javascript
Array.from('hello');        // ['h', 'e', 'l', 'l', 'o']
Array.from(new Set([1,2,2])); // [1, 2]
Array.from({ length: 3 }, (_, i) => i); // [0, 1, 2]（映射函数）
```

#### 1.3.5 其他方式

- 展开运算符：`[...iterable]`
- 从现有数组复制：`arr.slice()`、`[...arr]`、`Array.from(arr)`

---

## 2. 静态方法

### 2.1 `Array.isArray(value)`

判断一个值是否为数组，返回布尔值。优于 `value instanceof Array`，因为它能正确检测不同全局环境（如 iframe）中的数组。

```javascript
Array.isArray([]);        // true
Array.isArray({});        // false
Array.isArray('hello');   // false
```

### 2.2 `Array.from(arrayLike, mapFn?, thisArg?)`

从类数组对象或可迭代对象创建新数组。可选映射函数可在创建时对每个元素进行处理。

```javascript
const str = 'abc';
const arr = Array.from(str, char => char.toUpperCase()); // ['A', 'B', 'C']
```

### 2.3 `Array.of(element0, element1, ...)`

用可变数量的参数创建一个新数组，无论参数类型和数量。

### 2.4 `Array.fromAsync()`（ES2023，提案）

从异步可迭代对象或类数组对象创建数组，返回 Promise。目前仍处于提案阶段，但可能已在某些环境实现。

---

## 3. 实例属性

### `length`

返回数组的元素个数。`length` 属性是可写的，可以通过设置 `length` 来截断或延长数组（延长后新位置为 `undefined` 空槽）。

```javascript
const arr = [1, 2, 3];
arr.length = 2;  // arr 变为 [1, 2]
arr.length = 4;  // arr 变为 [1, 2, <2 empty slots>]
console.log(arr[3]); // undefined（空槽）
```

---

## 4. 实例方法

所有数组实例都继承自 `Array.prototype`，因此可以调用以下方法。为了方便学习，我们将它们按功能分类。

### 4.1 修改器方法（改变原数组）

#### `push(element1, ..., elementN)`

在数组末尾添加一个或多个元素，返回新长度。

```javascript
const arr = [1, 2];
arr.push(3, 4); // 4
console.log(arr); // [1, 2, 3, 4]
```

#### `pop()`

移除数组最后一个元素并返回该元素；如果数组为空，返回 `undefined`。

```javascript
const arr = [1, 2, 3];
const last = arr.pop(); // 3
console.log(arr); // [1, 2]
```

#### `unshift(element1, ..., elementN)`

在数组开头添加一个或多个元素，返回新长度。

```javascript
const arr = [2, 3];
arr.unshift(0, 1); // 4
console.log(arr); // [0, 1, 2, 3]
```

#### `shift()`

移除数组第一个元素并返回该元素；如果数组为空，返回 `undefined`。

```javascript
const arr = [1, 2, 3];
const first = arr.shift(); // 1
console.log(arr); // [2, 3]
```

#### `splice(start, deleteCount?, item1?, item2?, ...)`

强大的多功能方法，用于添加、删除或替换元素。

- `start`：开始索引（可为负数，表示从末尾倒数）。
- `deleteCount`：要删除的元素个数（省略则删除从 `start` 到末尾的所有元素）。
- `item1, ...`：要添加的新元素。
返回被删除的元素组成的数组。

```javascript
const arr = ['a', 'b', 'c', 'd'];
// 删除 2 个元素从索引 1 开始，并插入 'x', 'y'
const removed = arr.splice(1, 2, 'x', 'y'); 
console.log(arr);     // ['a', 'x', 'y', 'd']
console.log(removed); // ['b', 'c']

// 仅删除
arr.splice(2, 1); // 从索引2删除1个
// 仅插入
arr.splice(1, 0, 'z'); // 在索引1处插入 'z'，不删除
```

#### `reverse()`

反转数组中元素的顺序，并返回原数组（引用）。

```javascript
const arr = [1, 2, 3];
arr.reverse(); // [3, 2, 1]
```

#### `sort(compareFn?)`

对数组元素进行排序，默认将元素转换为字符串后按 UTF-16 码点排序。通常需要提供比较函数。

```javascript
const arr = [3, 1, 10, 2];
arr.sort(); // [1, 10, 2, 3]（按字符串排序）

arr.sort((a, b) => a - b); // 升序 [1, 2, 3, 10]
arr.sort((a, b) => b - a); // 降序 [10, 3, 2, 1]
```

**注意**：`sort` 方法在原数组上排序，并返回原数组的引用。

#### `fill(value, start?, end?)`（ES6）

用固定值填充数组从 `start` 到 `end`（不包括 `end`）的所有元素。`start` 默认为 0，`end` 默认为 `length`。

```javascript
const arr = [1, 2, 3, 4];
arr.fill(0, 1, 3); // [1, 0, 0, 4]
```

#### `copyWithin(target, start, end?)`（ES6）

在数组内部将一段元素复制到另一位置，覆盖原有元素。不改变数组长度。

```javascript
const arr = [1, 2, 3, 4, 5];
arr.copyWithin(0, 3, 5); // 将索引3-5的元素复制到索引0开始 => [4, 5, 3, 4, 5]
```

### 4.2 访问器方法（不改变原数组，返回新数组或值）

#### `concat(value1, ..., valueN)`

合并当前数组与一个或多个数组或值，返回新数组。

```javascript
const arr1 = [1, 2];
const arr2 = [3, 4];
const result = arr1.concat(arr2, 5); // [1, 2, 3, 4, 5]
```

#### `slice(start?, end?)`

返回从 `start` 到 `end`（不包括 `end`）的新数组副本。`start` 和 `end` 可为负数。

```javascript
const arr = [1, 2, 3, 4, 5];
arr.slice(1, 3); // [2, 3]
arr.slice(-2);   // [4, 5]
```

#### `join(separator?)`

将数组元素用 `separator` 连接成一个字符串，默认用逗号。

```javascript
['a', 'b', 'c'].join('-'); // 'a-b-c'
```

#### `indexOf(searchElement, fromIndex?)`

返回第一个匹配元素的索引，不存在返回 -1。使用严格相等比较。

```javascript
[1, 2, 3, 2].indexOf(2); // 1
[1, 2, 3, 2].indexOf(2, 2); // 3（从索引2开始搜索）
```

#### `lastIndexOf(searchElement, fromIndex?)`

从后向前搜索，返回最后一个匹配元素的索引。

#### `includes(searchElement, fromIndex?)`（ES6）

判断数组是否包含指定元素，返回布尔值。使用 `SameValueZero` 比较（`NaN` 被认为等于自身）。

```javascript
[1, 2, NaN].includes(NaN); // true
```

#### `toString()`

返回由数组元素组成的字符串，元素用逗号分隔。实际上是 `join()` 的别名。

```javascript
[1, 2, 3].toString(); // '1,2,3'
```

#### `toLocaleString(locales?, options?)`

返回数组元素的本地化字符串表示。

### 4.3 迭代方法（遍历数组，通常不改变原数组）

#### `forEach(callback(currentValue, index, array), thisArg?)`

对数组每个元素执行一次提供的函数。没有返回值（返回 `undefined`）。

```javascript
[1, 2, 3].forEach((item, index) => {
  console.log(`arr[${index}] = ${item}`);
});
```

#### `map(callback, thisArg?)`

对每个元素执行回调，返回由回调返回值组成的新数组。

```javascript
const doubled = [1, 2, 3].map(x => x * 2); // [2, 4, 6]
```

#### `filter(callback, thisArg?)`

返回由使回调返回真值的所有元素组成的新数组。

```javascript
const evens = [1, 2, 3, 4].filter(x => x % 2 === 0); // [2, 4]
```

#### `reduce(callback(accumulator, currentValue, index, array), initialValue?)`

从左到右累积计算数组元素，返回单个值。如果未提供 `initialValue`，则使用第一个元素作为初始累积值。

```javascript
const sum = [1, 2, 3].reduce((acc, cur) => acc + cur, 0); // 6
const nested = [[1], [2, 3], [4]].reduce((acc, cur) => acc.concat(cur), []); // 扁平化
```

#### `reduceRight(callback, initialValue?)`

从右到左累积。

#### `every(callback, thisArg?)`

测试是否所有元素都通过回调测试（回调返回真值）。返回布尔值。

```javascript
[1, 2, 3].every(x => x > 0); // true
[1, 2, -1].every(x => x > 0); // false
```

#### `some(callback, thisArg?)`

测试是否至少有一个元素通过回调测试。

```javascript
[1, 2, -1].some(x => x < 0); // true
```

#### `find(callback, thisArg?)`（ES6）

返回第一个使回调返回真值的元素，否则返回 `undefined`。

```javascript
[1, 2, 3, 4].find(x => x > 2); // 3
```

#### `findIndex(callback, thisArg?)`（ES6）

返回第一个使回调返回真值的元素索引，否则返回 -1。

```javascript
[1, 2, 3, 4].findIndex(x => x > 2); // 2
```

#### `findLast(callback, thisArg?)`（ES2023）

从后向前搜索，返回第一个使回调返回真值的元素。

```javascript
[1, 2, 3, 4, 3].findLast(x => x === 3); // 3（最后一个3）
```

#### `findLastIndex(callback, thisArg?)`（ES2023）

从后向前搜索，返回第一个使回调返回真值的元素索引。

#### `flat(depth?)`（ES2019）

递归地将嵌套数组“拉平”到指定深度，返回新数组。

```javascript
[1, [2, [3]]].flat(2); // [1, 2, 3]
[1, [2, [3]]].flat(1); // [1, 2, [3]]
[1, [2, [3]]].flat(Infinity); // [1, 2, 3]
```

#### `flatMap(callback, thisArg?)`（ES2019）

先对每个元素执行 `map`，然后将结果数组拉平一层。相当于 `map().flat(1)`，但效率更高。

```javascript
[1, 2, 3].flatMap(x => [x, x * 2]); // [1, 2, 2, 4, 3, 6]
```

#### `keys()`、`values()`、`entries()`（ES6）

分别返回数组索引、值、键值对的迭代器。

```javascript
const arr = ['a', 'b', 'c'];
for (const key of arr.keys()) { console.log(key); } // 0,1,2
for (const val of arr.values()) { console.log(val); } // 'a','b','c'
for (const [idx, val] of arr.entries()) { console.log(idx, val); }
```

#### `group()` 和 `groupToMap()`（ES2024，提案）

用于将数组元素分组。`group` 返回一个无原型的对象，`groupToMap` 返回一个 `Map`。

```javascript
const array = [1, 2, 3, 4, 5];
const grouped = array.group((num) => num % 2 === 0 ? 'even' : 'odd');
// { odd: [1, 3, 5], even: [2, 4] }
```

（注：目前可能还未完全标准化，但已有实现。）

#### `with(index, value)`（ES2023）

返回一个新数组，其中指定索引位置被替换为新值，原数组不变。

```javascript
const arr = [1, 2, 3, 4];
const newArr = arr.with(2, 99); // [1, 2, 99, 4]
```

#### `toReversed()`、`toSorted(compareFn?)`、`toSpliced(start, deleteCount?, ...items)`（ES2023）

分别返回反转、排序、splice 操作后的新数组，不修改原数组。

```javascript
const arr = [3, 1, 4, 2];
const sorted = arr.toSorted(); // [1, 2, 3, 4]
console.log(arr); // [3, 1, 4, 2] 原数组未变
```

#### `at(index)`（ES2022）

返回指定索引的元素，支持负索引（从末尾倒数）。

```javascript
const arr = [10, 20, 30, 40];
arr.at(-1); // 40
arr.at(-2); // 30
```

#### `[Symbol.iterator]`（ES6）

数组实现了可迭代协议，可以直接用于 `for...of` 循环和展开运算符。

```javascript
const arr = [1, 2, 3];
for (const item of arr) console.log(item); // 1,2,3
const copy = [...arr]; // [1,2,3]
```

---

## 5. 稀疏数组与空槽

### 5.1 什么是稀疏数组？

当数组的元素不是连续索引时，就会产生空槽（empty slots）。例如使用 `new Array(3)` 或给数组长度赋值大于当前元素数时。

```javascript
const sparse = [1, , 3]; // 索引1处是空槽
console.log(sparse[1]); // undefined（但不同于显式赋值为 undefined）
```

### 5.2 空槽 vs `undefined`

空槽和显式赋值为 `undefined` 在大多数迭代方法中行为不同。例如 `map`、`forEach`、`filter` 等会跳过空槽，而不会跳过 `undefined` 值。

```javascript
[1, , 3].forEach(x => console.log(x)); // 输出 1 和 3（跳过了空槽）
[1, undefined, 3].forEach(x => console.log(x)); // 输出 1 undefined 3
```

`join` 和 `toString` 会将空槽视为空字符串。

```javascript
[1, , 3].join('-'); // '1--3'
```

### 5.3 避免稀疏数组

通常应避免创建稀疏数组，因为它可能导致意外的行为。如果需要创建连续数组，可以使用 `Array.from` 或 `fill`。

```javascript
Array.from({ length: 3 }, (_, i) => i); // [0, 1, 2]
Array(3).fill(0); // [0, 0, 0]
```

---

## 6. 类数组对象

类数组对象是指具有 `length` 属性和数字索引的对象，如 `arguments`、`NodeList`、字符串等。它们通常没有数组的方法，但可以通过 `Array.from` 或 `Array.prototype.slice.call()` 转换为真正的数组。

```javascript
function foo() {
  console.log(arguments); // 类数组对象
  const args = Array.from(arguments); // 转换为数组
}
```

---

## 7. 使用示例

### 7.1 数组去重

```javascript
const arr = [1, 2, 2, 3, 4, 4, 5];
// 使用 Set
const unique = [...new Set(arr)]; // [1, 2, 3, 4, 5]
// 使用 filter
const unique2 = arr.filter((item, index) => arr.indexOf(item) === index);
```

### 7.2 扁平化嵌套数组

```javascript
const nested = [1, [2, [3, 4], 5], 6];
// 使用 flat
const flat = nested.flat(Infinity); // [1, 2, 3, 4, 5, 6]
// 使用递归 reduce
function flatten(arr) {
  return arr.reduce((acc, val) => Array.isArray(val) ? acc.concat(flatten(val)) : acc.concat(val), []);
}
```

### 7.3 交集与并集

```javascript
const a = [1, 2, 3];
const b = [2, 3, 4];
// 交集
const intersection = a.filter(x => b.includes(x)); // [2, 3]
// 并集
const union = [...new Set([...a, ...b])]; // [1, 2, 3, 4]
```

### 7.4 根据条件分组

```javascript
const people = [
  { name: 'Alice', age: 30 },
  { name: 'Bob', age: 20 },
  { name: 'Charlie', age: 30 }
];
const groupedByAge = people.reduce((acc, person) => {
  const key = person.age;
  if (!acc[key]) acc[key] = [];
  acc[key].push(person);
  return acc;
}, {});
// { 20: [{ name: 'Bob', age: 20 }], 30: [{ name: 'Alice', age: 30 }, { name: 'Charlie', age: 30 }] }
```

### 7.5 生成指定范围数组

```javascript
function range(start, end, step = 1) {
  return Array.from({ length: Math.floor((end - start) / step) + 1 }, (_, i) => start + i * step);
}
range(1, 5); // [1, 2, 3, 4, 5]
```

### 7.6 随机打乱数组（Fisher-Yates）

```javascript
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
```

---

## 8. 最佳实践与注意事项

### 8.1 使用字面量创建数组

避免使用 `new Array()`，除非需要创建特定长度的稀疏数组（但通常应避免稀疏数组）。使用 `[]` 或 `Array.of`。

### 8.2 使用展开运算符代替 `concat`

```javascript
const combined = [...arr1, ...arr2]; // 更简洁
```

### 8.3 迭代数组时避免修改原数组

在 `forEach`、`map` 等迭代中，不要添加或删除数组元素，这可能导致意外行为。若需修改，可使用 `reduce` 或先复制。

### 8.4 使用 `for...of` 遍历值

`for...of` 比 `for...in` 更安全，因为它遍历的是值而不是索引，且不会遍历原型属性。

### 8.5 利用 `Array.from` 的映射功能

创建新数组时，如果需要初始化或映射，`Array.from({length: n}, (_, i) => ...)` 非常方便。

### 8.6 使用 `includes` 代替 `indexOf` 判断存在性

`includes` 语义更清晰，且能正确处理 `NaN`。

### 8.7 注意 `sort` 的默认行为

不要忘记提供比较函数进行数值排序。

### 8.8 处理空位时要小心

尽量创建密集数组，避免空位带来的混淆。如果确实需要处理稀疏数组，要了解各个方法对空位的处理（如 `map` 跳过空位，`join` 视同空字符串）。

### 8.9 性能考虑

- 在需要频繁在数组开头插入/删除元素时，使用链表或反向存储（如用 `push` 后反转）可能更高效，因为 `shift` 和 `unshift` 会移动所有元素。
- 对于大数组的深拷贝，考虑使用 `structuredClone` 或 `JSON.parse(JSON.stringify(arr))`（注意限制）。
- 使用 `for` 循环通常比 `forEach` 略快，但可读性差，除非在性能关键场景，否则应优先选择语义清晰的方法。

### 8.10 使用现代方法提升代码简洁性

- 用 `flatMap` 代替 `map().flat()`
- 用 `at` 代替 `arr[arr.length - 1]` 获取末尾元素
- 用 `toSorted` 等新方法避免修改原数组（如果不需要原数组）

### 8.11 数组与类型化数组

对于二进制数据或高性能数值计算，考虑使用 `TypedArray`（如 `Int32Array`、`Float64Array`），它们操作连续内存，性能更好，但方法集不同。

---

## 小结

`Array` 是 JavaScript 中处理有序集合的核心工具，提供了丰富的方法来操作和遍历数据。本章详细介绍了：

- 创建数组的多种方式（字面量、`Array.of`、`Array.from`）
- 静态方法（`isArray`、`from`、`of`）
- 实例属性 `length` 及其特殊性
- 实例方法按功能分类：修改器、访问器、迭代器、新式方法等
- 稀疏数组的概念与处理
- 类数组对象及转换
- 大量实用示例和最佳实践

掌握 `Array` 的方法和特性，将使你在处理数据时更加得心应手。在后续的标准库章节中，我们将继续学习其他核心内置对象，如 `Map`、`Set` 等集合类。
