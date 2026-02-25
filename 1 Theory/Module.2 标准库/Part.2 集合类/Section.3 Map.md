# Map

[TOC]

---

`Map` 是 ES6 引入的一种新的集合类型，它表示键值对的集合。与传统的对象（Object）不同，`Map` 允许任何类型的值（包括对象、函数、原始值）作为键，并且会保持键值对的插入顺序。`Map` 提供了清晰的 API 来添加、获取、删除和遍历成员，在需要频繁增删键值对或键不是字符串的场景下，它是比普通对象更合适的选择。

---

## 1. 概述

### 1.1 为什么需要 Map？

在 ES6 之前，JavaScript 开发者通常使用普通对象来模拟键值对集合。但对象作为映射存在一些限制：

- **键只能是字符串或 Symbol**：数字或其他类型会被自动转换为字符串。
- **原型链干扰**：对象默认继承 `Object.prototype`，可能包含意外的键（如 `toString`、`constructor`）。
- **无法直接获取大小**：需要手动计算（如 `Object.keys(obj).length`）。
- **迭代顺序不可靠**：虽然现代引擎基本按插入顺序迭代，但规范并未保证（除整数索引外）。

`Map` 解决了这些问题，并提供了更完善的 API。

### 1.2 核心特性

- 键可以是任何类型（包括对象、函数、`NaN`）。
- 严格保持插入顺序。
- 可通过 `size` 属性直接获取成员数量。
- 继承自 `Map.prototype`，提供丰富的操作方法。
- 没有默认键（原型链干净）。

---

## 2. 创建 Map

### 2.1 构造函数

`Map` 构造函数可以不带参数创建一个空 Map，也可以传入一个可迭代对象（如数组或其他 Map）来初始化。

```javascript
// 空 Map
const map1 = new Map();

// 从二维数组（键值对数组）创建
const map2 = new Map([
  ['name', 'Alice'],
  ['age', 30],
  [true, 'boolean key'],
  [{ id: 1 }, 'object key']
]);

// 从另一个 Map 创建（浅拷贝）
const map3 = new Map(map2);

// 从任何可迭代的键值对对象创建
const pairs = [['a', 1], ['b', 2]];
const map4 = new Map(pairs);
```

### 2.2 静态方法

`Map` 没有类似 `Map.of` 或 `Map.from` 的静态方法，但可以通过 `Array` 方法间接创建。

```javascript
// 生成 Map
const map = new Map(
  [1, 2, 3].map(x => [x, x * x])
); // Map { 1 => 1, 2 => 4, 3 => 9 }
```

---

## 3. 实例属性

### `size`

返回 Map 中键值对的数量。

```javascript
const map = new Map([['a', 1], ['b', 2]]);
console.log(map.size); // 2
```

---

## 4. 实例方法

### 4.1 添加、获取和删除

#### `set(key, value)`

设置键 `key` 对应的值。如果键已存在，则更新值；否则添加新键值对。返回 Map 对象本身，因此支持链式调用。

```javascript
const map = new Map();
map.set('name', 'Alice')
   .set('age', 30)
   .set({}, 'object key');
```

#### `get(key)`

返回键 `key` 对应的值。如果键不存在，返回 `undefined`。

```javascript
map.get('name'); // 'Alice'
map.get('none'); // undefined
```

**注意**：`Map` 使用 **SameValueZero** 算法比较键，这意味着 `NaN` 被认为等于自身，而 `-0` 和 `+0` 相等。

```javascript
map.set(NaN, 'not a number');
map.get(NaN); // 'not a number'
```

#### `has(key)`

判断 Map 中是否存在指定的键，返回布尔值。

```javascript
map.has('age'); // true
map.has('gender'); // false
```

#### `delete(key)`

删除指定键及其对应的值。成功删除返回 `true`，否则返回 `false`。

```javascript
map.delete('age'); // true
map.delete('none'); // false
```

#### `clear()`

清空 Map 中的所有键值对。

```javascript
map.clear();
console.log(map.size); // 0
```

### 4.2 遍历与迭代

Map 是可迭代对象，提供了多种遍历方式，所有迭代都按照插入顺序进行。

#### `keys()`

返回一个新的迭代器对象，包含 Map 中所有键（按插入顺序）。

```javascript
const map = new Map([['a', 1], ['b', 2], ['c', 3]]);
for (const key of map.keys()) {
  console.log(key); // 'a', 'b', 'c'
}
```

#### `values()`

返回一个新的迭代器对象，包含 Map 中所有值。

#### `entries()`

返回一个新的迭代器对象，包含 Map 中所有 `[key, value]` 数组。这也是默认迭代器，因此可以直接使用 `for...of` 遍历 Map。

```javascript
for (const [key, value] of map) {
  console.log(key, value);
}
```

#### `forEach(callback(value, key, map), thisArg?)`

按插入顺序对每个键值对执行一次回调。

```javascript
map.forEach((value, key) => {
  console.log(`${key}: ${value}`);
});
```

### 4.3 其他方法

#### `[Symbol.iterator]()`

返回 `entries()` 方法返回的迭代器，使 Map 支持展开运算符和 `for...of`。

```javascript
const arr = [...map]; // 二维数组 [[key, value], ...]
```

---

## 5. 与 Object 的对比

| 特性 | Map | Object |
|------|-----|--------|
| **键的类型** | 任意值（包括对象、函数、NaN） | 字符串或 Symbol（其他类型会转换为字符串） |
| **插入顺序** | 严格按插入顺序迭代 | 普通属性按插入顺序，整数索引按升序，有混淆可能 |
| **大小获取** | `map.size` | `Object.keys(obj).length` |
| **默认键** | 无 | 继承自原型（如 `toString`），可能意外覆盖 |
| **性能** | 频繁增删键值对更优 | 适合静态结构，但现代引擎优化良好 |
| **可迭代性** | 原生可迭代（`entries`、`keys`、`values`） | 需借助 `Object.keys` 等 |
| **JSON 支持** | 无直接支持，需手动转换 | 可通过 `JSON.stringify()` 序列化（只处理字符串键） |
| **使用场景** | 键为动态类型、频繁增删、需要保持顺序 | 简单记录、结构固定、需要 JSON 互操作 |

**何时使用 Map？**

- 键不是字符串（如对象、数字、`NaN`）。
- 需要频繁添加/删除键值对。
- 需要保持键值对的插入顺序。
- 需要直接获取集合大小。
- 希望避免原型链干扰。

**何时使用 Object？**

- 键都是字符串或 Symbol。
- 结构相对固定（如配置对象）。
- 需要与 JSON 互操作。
- 需要利用原型链（如方法查找）。

---

## 6. 使用示例

### 6.1 以对象为键

```javascript
const users = new Map();
const alice = { name: 'Alice' };
const bob = { name: 'Bob' };

users.set(alice, { age: 30, email: 'alice@example.com' });
users.set(bob, { age: 25, email: 'bob@example.com' });

console.log(users.get(alice).age); // 30
```

### 6.2 频率统计

```javascript
function countWords(words) {
  const counts = new Map();
  for (const word of words) {
    counts.set(word, (counts.get(word) || 0) + 1);
  }
  return counts;
}
const result = countWords(['apple', 'banana', 'apple']);
console.log(result.get('apple')); // 2
```

### 6.3 缓存计算结果

```javascript
const cache = new Map();

function expensiveComputation(input) {
  if (cache.has(input)) {
    console.log('返回缓存结果');
    return cache.get(input);
  }
  const result = input * 1000; // 模拟耗时计算
  cache.set(input, result);
  return result;
}
```

### 6.4 转换 Map 到数组

```javascript
const map = new Map([['a', 1], ['b', 2]]);

// 二维数组
const arr = [...map]; // [['a', 1], ['b', 2]]

// 键数组
const keys = [...map.keys()]; // ['a', 'b']

// 值数组
const values = [...map.values()]; // [1, 2]
```

### 6.5 合并 Map

```javascript
const map1 = new Map([['a', 1], ['b', 2]]);
const map2 = new Map([['b', 3], ['c', 4]]);

const merged = new Map([...map1, ...map2]); // 后面的会覆盖前面的键
console.log(merged); // Map { 'a' => 1, 'b' => 3, 'c' => 4 }
```

### 6.6 Map 与 JSON 互转

由于 Map 不支持直接序列化，需要手动转换。

```javascript
// Map -> JSON
function mapToJson(map) {
  return JSON.stringify([...map]);
}
const json = mapToJson(new Map([['a', 1], ['b', 2]])); // '[["a",1],["b",2]]'

// JSON -> Map
function jsonToMap(json) {
  return new Map(JSON.parse(json));
}
const map = jsonToMap('[["a",1],["b",2]]');
```

---

## 7. WeakMap（弱映射）

`WeakMap` 是 Map 的一种变体，它与 Map 的主要区别：

- **键必须是对象**（不能是原始值）。
- **弱引用**：不会阻止垃圾回收回收键对象。如果没有其他对键对象的引用，该键值对会自动从 WeakMap 中移除。
- **不可迭代**：没有 `keys`、`values`、`entries` 方法，也没有 `size` 属性和 `clear` 方法。
- **用途**：存储与对象关联的私有数据，避免内存泄漏。

```javascript
const wm = new WeakMap();
let obj = {};
wm.set(obj, 'some metadata');
obj = null; // 对象被回收，WeakMap 中的条目自动消失
```

`WeakMap` 的 API 只有 `set`、`get`、`has`、`delete`。

---

## 8. 最佳实践与注意事项

### 8.1 键的比较规则（SameValueZero）

- `NaN` 与自身相等（可以作为键）。
- `0` 和 `-0` 被视为相等。
- 对象键通过引用比较，内容相同的不同对象视为不同键。

### 8.2 避免使用非预期的键类型

虽然 Map 允许任何类型，但使用对象键时要确保对象引用不被意外丢失，否则可能造成内存泄漏（但通常不会，除非使用 WeakMap）。

### 8.3 遍历时修改 Map

如果在使用 `forEach` 或迭代器遍历 Map 时修改它（添加或删除条目），可能产生意外行为。规范允许在遍历期间修改，但除了当前被删除的键，其他未遍历到的键仍会被处理。建议尽量在遍历前确定集合不变，或使用临时数组记录要操作的键。

### 8.4 性能考量

- Map 在频繁增删键值对的场景下通常比对象更优，尤其是键为动态类型时。
- 对于小规模固定键集合，对象可能更快（引擎优化好）。

### 8.5 使用 Map 替代对象作为字典

在需要纯键值对存储时，优先考虑 Map，避免对象原型链污染。

```javascript
// 不推荐
const dict = Object.create(null); // 需要手动创建无原型对象
dict.key = 'value';

// 推荐
const dict = new Map();
dict.set('key', 'value');
```

### 8.6 与 Set 的配合

Map 常与 Set 结合使用，例如实现双向映射或集合运算。

---

## 小结

`Map` 是 ES6 中功能强大且灵活的键值对集合，弥补了对象作为映射的诸多不足。它支持任意类型的键、保持插入顺序、提供直观的 API，并具备良好的性能。掌握 `Map` 及其与对象的区别，能让你在合适的场景做出正确的选择。

在集合类中，Map 与 Set 是姊妹篇：Map 是键值对集合，Set 是唯一值的集合。下一节我们将学习 **Set**。
