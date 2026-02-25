# Set

[TOC]

---

`Set` 是 ES6 引入的一种新的集合类型，它表示一组**唯一值**的集合。与数组不同，`Set` 中的每个值只会出现一次，无论添加多少次相同的值。`Set` 可以存储任何类型的值（包括原始值和对象引用），并且会保持值的插入顺序。它提供了高效的成员检测和集合操作，是处理去重、交集、并集等问题的理想工具。

---

## 1. 概述

### 1.1 为什么需要 Set？

在 ES6 之前，JavaScript 开发者通常使用对象或数组来模拟集合，但都有各自的缺陷：

- **对象**：键只能是字符串或 Symbol，且存在原型链干扰，无法直接获取大小，迭代顺序不确定。
- **数组**：元素可以重复，需要手动去重，且 `includes` 查找效率较低（O(n)）。

`Set` 专为集合场景设计，解决了这些问题：

- 值唯一性自动保证。
- 可以存储任何类型的值。
- 严格的插入顺序。
- 高效的成员检测（平均 O(1)）。
- 简洁的 API。

### 1.2 核心特性

- 值唯一（使用 **SameValueZero** 算法比较）。
- 插入顺序被记住，迭代时按添加顺序返回。
- 可迭代，支持 `for...of` 和展开运算符。
- 大小可通过 `size` 属性获取。
- 没有默认键，原型链干净。

---

## 2. 创建 Set

### 2.1 构造函数

`Set` 构造函数可以不带参数创建一个空 Set，也可以传入一个可迭代对象（如数组、字符串、另一个 Set）来初始化。

```javascript
// 空 Set
const set1 = new Set();

// 从数组创建（自动去重）
const set2 = new Set([1, 2, 3, 3, 4]); // Set {1, 2, 3, 4}

// 从字符串创建
const set3 = new Set('hello'); // Set {'h', 'e', 'l', 'o'}（注意重复的 l 只出现一次）

// 从另一个 Set 创建（浅拷贝）
const set4 = new Set(set2);

// 从任何可迭代对象创建
const set5 = new Set(document.querySelectorAll('div')); // 元素对象集合
```

### 2.2 静态方法

`Set` 没有内置的静态工厂方法，但可以通过 `Array` 方法间接创建。

```javascript
// 生成 Set
const set = new Set([1, 2, 3].map(x => x * 2)); // Set {2, 4, 6}
```

---

## 3. 实例属性

### `size`

返回 Set 中唯一值的个数。

```javascript
const set = new Set([1, 2, 3, 3]);
console.log(set.size); // 3
```

---

## 4. 实例方法

### 4.1 添加、删除和检查

#### `add(value)`

向 Set 添加一个值。如果值已存在，则不会重复添加。返回 Set 对象本身，支持链式调用。

```javascript
const set = new Set();
set.add(1)
   .add(2)
   .add(2) // 忽略重复
   .add({ name: 'Alice' });
console.log(set); // Set {1, 2, {name: 'Alice'}}
```

#### `delete(value)`

删除指定的值。成功删除返回 `true`，否则返回 `false`。

```javascript
set.delete(2); // true
set.delete(10); // false
```

#### `has(value)`

判断 Set 中是否存在指定值，返回布尔值。

```javascript
set.has(1); // true
set.has(3); // false
```

**注意**：`has` 使用 **SameValueZero** 算法，因此 `NaN` 被认为等于自身。

```javascript
set.add(NaN);
set.has(NaN); // true
```

#### `clear()`

清空 Set 中的所有值。

```javascript
set.clear();
console.log(set.size); // 0
```

### 4.2 遍历与迭代

Set 是可迭代对象，提供了多种遍历方式，所有迭代都按照插入顺序进行。

#### `keys()` / `values()`

由于 Set 没有键，`keys()` 和 `values()` 的行为完全一致，都返回一个包含 Set 中所有值的迭代器。实际上，`values` 是默认迭代器。

```javascript
const set = new Set(['a', 'b', 'c']);
for (const val of set.values()) {
  console.log(val); // 'a', 'b', 'c'
}
for (const val of set.keys()) { // 和 values 一样
  console.log(val);
}
```

#### `entries()`

返回一个新的迭代器对象，包含 Set 中所有值的 `[value, value]` 数组。这种设计是为了与 Map 的 `entries` 方法保持一致，方便两者互换使用。

```javascript
for (const entry of set.entries()) {
  console.log(entry); // ['a', 'a'], ['b', 'b'], ['c', 'c']
}
```

#### `forEach(callback(value, key, set), thisArg?)`

按插入顺序对每个值执行一次回调。回调参数中 `key` 和 `value` 相同，同样是为了与 Map 对齐。

```javascript
set.forEach((value, key) => {
  console.log(`${key}: ${value}`); // a: a, b: b, c: c
});
```

#### `[Symbol.iterator]()`

返回 `values()` 方法返回的迭代器，因此可以直接使用 `for...of` 遍历 Set。

```javascript
for (const val of set) {
  console.log(val); // 'a', 'b', 'c'
}
const arr = [...set]; // ['a', 'b', 'c']
```

### 4.3 其他方法（ES2024 新提案）

在较新的提案中（已进入 Stage 4，有望在 ES2024 中正式成为标准），`Set` 增加了一些实用的集合操作方法。这些方法返回新的 Set，不修改原 Set。

#### `union(other)`

返回一个新 Set，包含当前 Set 和另一个 Set（或类 Set 对象）的并集。

```javascript
const a = new Set([1, 2, 3]);
const b = new Set([2, 3, 4]);
const union = a.union(b); // Set {1, 2, 3, 4}
```

#### `intersection(other)`

返回一个新 Set，包含两个集合的交集。

```javascript
const intersection = a.intersection(b); // Set {2, 3}
```

#### `difference(other)`

返回一个新 Set，包含当前集合中存在但另一个集合中不存在的元素（差集）。

```javascript
const diff = a.difference(b); // Set {1}
```

#### `symmetricDifference(other)`

返回一个新 Set，包含两个集合中独有的元素（对称差集）。

```javascript
const symDiff = a.symmetricDifference(b); // Set {1, 4}
```

#### `isSubsetOf(other)`

返回布尔值，判断当前集合是否是另一个集合的子集。

```javascript
a.isSubsetOf(new Set([1, 2, 3, 4])); // true
```

#### `isSupersetOf(other)`

返回布尔值，判断当前集合是否是另一个集合的超集。

```javascript
a.isSupersetOf(new Set([1, 2])); // true
```

#### `isDisjointFrom(other)`

返回布尔值，判断当前集合是否与另一个集合不相交（没有共同元素）。

```javascript
a.isDisjointFrom(new Set([4, 5])); // true
```

**注意**：这些方法目前可能还未在所有环境中实现，使用前需确认兼容性或使用 polyfill。

---

## 5. 与数组的对比

| 特性 | Set | 数组 |
|------|-----|------|
| **值唯一性** | 自动保证唯一 | 可重复，需手动去重 |
| **元素类型** | 任何类型 | 任何类型 |
| **查找性能** | `has` 平均 O(1) | `includes` / `indexOf` O(n) |
| **插入顺序** | 严格保持 | 保持（通过索引） |
| **随机访问** | 不支持（无索引） | 支持（`arr[i]`） |
| **大小** | `size` 属性 | `length` 属性 |
| **去重** | 原生支持 | 需借助 Set 或循环 |
| **迭代** | 可迭代，`forEach` | 可迭代，多种方法 |
| **适用场景** | 集合运算、去重、成员检查 | 有序列表、需要索引访问 |

**何时使用 Set？**

- 需要保证值唯一（如标签集合、ID 集合）。
- 频繁进行成员检测（`has`）。
- 需要进行集合运算（交集、并集、差集）。
- 不关心索引顺序，只关心存在性。

**何时使用数组？**

- 需要保持元素顺序且可能重复。
- 需要通过索引访问元素。
- 需要使用数组特有的方法（如 `map`、`filter`、`reduce` 等，虽然 Set 也有部分，但数组更丰富）。

---

## 6. 与 Map 的对比

- **Map** 是键值对集合，每个元素由键和值组成。
- **Set** 是值的集合，每个值唯一。

两者共享许多相似的 API：`size`、`add`/`set`、`has`、`delete`、`clear`、迭代器方法（`keys`、`values`、`entries`、`forEach`），且都保持插入顺序。Set 的 `keys()` 和 `values()` 相同，`entries()` 返回 `[value, value]`。

```javascript
const set = new Set([1, 2, 3]);
const map = new Map([['a', 1], ['b', 2]]);

// 迭代方式类似
for (const val of set) console.log(val);
for (const [key, val] of map) console.log(key, val);
```

---

## 7. WeakSet（弱集合）

`WeakSet` 是 Set 的一种变体，它与 Set 的主要区别：

- **值必须是对象**（不能是原始值）。
- **弱引用**：不会阻止垃圾回收回收值对象。如果没有其他对值对象的引用，该对象会自动从 WeakSet 中移除。
- **不可迭代**：没有 `keys`、`values`、`entries` 方法，也没有 `size` 属性和 `clear` 方法，也不能用 `for...of` 遍历。
- **API**：只有 `add`、`has`、`delete`。

```javascript
const ws = new WeakSet();
let obj = { name: 'Alice' };
ws.add(obj);
console.log(ws.has(obj)); // true
obj = null; // 对象被回收，WeakSet 中的条目自动消失（不可观测）
```

**用途**：主要用于存储对象的标记或元数据，避免内存泄漏。例如，在类中标记实例是否已初始化。

```javascript
const initialized = new WeakSet();
class Foo {
  constructor() {
    initialized.add(this);
  }
  doSomething() {
    if (!initialized.has(this)) throw new Error('Not initialized');
    // ...
  }
}
```

---

## 8. 使用示例

### 8.1 数组去重

```javascript
const arr = [1, 2, 2, 3, 4, 4, 5];
const unique = [...new Set(arr)]; // [1, 2, 3, 4, 5]
```

### 8.2 检查元素是否在集合中

```javascript
const allowedRoles = new Set(['admin', 'editor', 'viewer']);
function hasAccess(role) {
  return allowedRoles.has(role);
}
console.log(hasAccess('admin')); // true
console.log(hasAccess('guest')); // false
```

### 8.3 交集、并集、差集（传统方法）

```javascript
const a = new Set([1, 2, 3]);
const b = new Set([2, 3, 4]);

// 并集
const union = new Set([...a, ...b]); // Set {1, 2, 3, 4}

// 交集
const intersection = new Set([...a].filter(x => b.has(x))); // Set {2, 3}

// 差集（a 中有 b 中无）
const difference = new Set([...a].filter(x => !b.has(x))); // Set {1}
```

### 8.4 使用新集合方法（如果环境支持）

```javascript
const a = new Set([1, 2, 3]);
const b = new Set([2, 3, 4]);

console.log(a.union(b));           // Set {1, 2, 3, 4}
console.log(a.intersection(b));    // Set {2, 3}
console.log(a.difference(b));      // Set {1}
console.log(a.symmetricDifference(b)); // Set {1, 4}
```

### 8.5 去重并保留出现次数信息

结合 Map 实现：

```javascript
const items = ['apple', 'banana', 'apple', 'orange', 'banana', 'apple'];
const countMap = new Map();
for (const item of items) {
  countMap.set(item, (countMap.get(item) || 0) + 1);
}
const uniqueItems = new Set(items); // 去重后的集合
console.log(uniqueItems); // Set {'apple', 'banana', 'orange'}
```

### 8.6 字符串中不同字符的数量

```javascript
const str = 'hello world';
const chars = new Set(str.replace(/\s/g, '')); // 忽略空格
console.log(chars.size); // 7（h,e,l,o,w,r,d）
```

### 8.7 标签系统

```javascript
class Post {
  constructor(title, tags) {
    this.title = title;
    this.tags = new Set(tags); // 保证标签唯一
  }
  addTag(tag) {
    this.tags.add(tag);
  }
  hasTag(tag) {
    return this.tags.has(tag);
  }
}
```

---

## 9. 最佳实践与注意事项

### 9.1 值唯一性比较规则（SameValueZero）

- `NaN` 与自身相等（可以作为唯一值）。
- `0` 和 `-0` 被视为相等。
- 对象通过引用比较，内容相同的不同对象视为不同值。

```javascript
const set = new Set();
set.add(NaN);
set.add(NaN); // 只保留一个
console.log(set.size); // 1

set.add(0);
set.add(-0); // 0 和 -0 视为相等
console.log(set.size); // 2（0 和 NaN）

set.add({});
set.add({}); // 两个不同对象，都保留
console.log(set.size); // 4
```

### 9.2 遍历时修改 Set

如果在使用 `forEach` 或迭代器遍历 Set 时修改它（添加或删除值），可能产生意外行为。规范允许在遍历期间修改，但推荐在遍历前确定集合不变，或使用临时数组记录要操作的值。

### 9.3 性能考量

- `has`、`add`、`delete` 的平均时间复杂度为 O(1)，远优于数组的 `includes`（O(n)）。
- 对于大量数据的集合运算，使用 Set 比数组更高效。

### 9.4 与数组的转换

- Set → 数组：`[...set]` 或 `Array.from(set)`
- 数组 → Set：`new Set(array)`
注意转换时会自动去重。

### 9.5 避免将 Set 当作数组使用

Set 没有索引，不能直接通过索引访问元素。如果需要索引，应使用数组。

### 9.6 使用 WeakSet 避免内存泄漏

当需要标记对象但又不想阻止垃圾回收时，使用 WeakSet 而不是 Set。

### 9.7 利用 Set 实现简单集合运算

虽然传统方法需要借助数组，但新提案的方法（如 `union`、`intersection`）将使代码更简洁。可以关注浏览器兼容性，必要时使用 polyfill。

### 9.8 注意 Set 的迭代顺序

Set 的迭代顺序就是插入顺序，这在某些场景下很有用（如保持用户添加标签的顺序）。

---

## 小结

`Set` 是 ES6 中引入的强大集合类型，它以优雅的方式解决了值唯一性和成员检测的需求。本章我们学习了：

- 创建 Set 的多种方式。
- 核心方法：`add`、`delete`、`has`、`clear`。
- 遍历方法：`keys`、`values`、`entries`、`forEach`、`[Symbol.iterator]`。
- 与数组和 Map 的对比及适用场景。
- `WeakSet` 的特点与用途。
- 丰富的使用示例和最佳实践。

掌握 Set 将使你在处理唯一值集合、去重、集合运算时更加得心应手。在集合类中，Map 和 Set 是互补的伙伴：Map 用于键值映射，Set 用于唯一值集合。接下来我们将学习其他标准库内容，如时间与日期处理。
