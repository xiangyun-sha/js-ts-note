# WeakMap & WeakSet

[TOC]

---

`WeakMap` 和 `WeakSet` 是 ES6 引入的两种特殊集合，它们与 `Map` 和 `Set` 类似，但具有**弱引用**的特性。弱引用意味着当键（对于 WeakMap）或值（对于 WeakSet）不再被其他强引用引用时，它们可以被垃圾回收（Garbage Collection, GC），从而避免内存泄漏。这一特性使得 WeakMap 和 WeakSet 非常适合存储与对象关联的元数据、缓存或状态标记，而不影响对象的生命周期。

---

## 1. 概述

### 1.1 为什么需要弱引用集合？

在 JavaScript 中，如果一个对象被某个强引用（如变量、属性、数组元素等）所引用，则该对象不会被垃圾回收。当我们使用普通的 `Map` 或 `Set` 存储对象时，即使该对象在其他地方已经不可达，它仍然会被 `Map` 或 `Set` 强引用着，导致内存无法释放，可能造成内存泄漏。

例如：

```javascript
let user = { name: 'Alice' };
const map = new Map();
map.set(user, 'some metadata');
user = null; // 原对象不再被变量引用，但仍被 map 强引用，无法回收
```

`WeakMap` 和 `WeakSet` 通过弱引用解决了这一问题：它们不会阻止垃圾回收器回收键（或值）对象。

### 1.2 核心特性

- **键/值必须是对象**：WeakMap 的键必须是对象（不能是原始值），WeakSet 的值必须是对象。
- **弱引用**：当键（或值）对象只被 WeakMap/WeakSet 引用时，它会被垃圾回收。
- **不可遍历**：没有 `keys()`、`values()`、`entries()` 方法，也没有 `size` 属性和 `clear` 方法，也不能使用 `for...of` 循环。这是为了防止因遍历而干扰垃圾回收。
- **有限 API**：只有基本的添加、删除、检查方法。

---

## 2. WeakMap

`WeakMap` 是一种键值对的集合，其中**键必须是对象**，值可以是任意类型。它对键是弱引用，当键对象被回收时，对应的键值对会自动从 WeakMap 中移除。

### 2.1 创建 WeakMap

```javascript
const wm = new WeakMap();
// 也可以传入可迭代对象（键必须是对象）
const obj1 = {}, obj2 = {};
const wm2 = new WeakMap([
  [obj1, 'value1'],
  [obj2, 'value2']
]);
```

### 2.2 实例方法

| 方法              | 描述                                                                       |
| ----------------- | -------------------------------------------------------------------------- |
| `set(key, value)` | 设置键 `key` 对应的值。`key` 必须是对象。返回 WeakMap 实例，支持链式调用。 |
| `get(key)`        | 返回键 `key` 对应的值，如果键不存在或已被回收，返回 `undefined`。          |
| `has(key)`        | 判断是否存在指定的键。                                                     |
| `delete(key)`     | 删除指定的键值对。成功删除返回 `true`，否则返回 `false`。                  |

```javascript
const wm = new WeakMap();
const obj = { id: 1 };

wm.set(obj, 'metadata');
console.log(wm.has(obj)); // true
console.log(wm.get(obj)); // 'metadata'

wm.delete(obj);
console.log(wm.has(obj)); // false
```

**注意**：WeakMap 没有 `size` 属性和 `clear` 方法，也无法遍历。

### 2.3 与 Map 的对比

| 特性         | Map            | WeakMap          |
| ------------ | -------------- | ---------------- |
| 键类型       | 任意类型       | **必须是对象**   |
| 值类型       | 任意类型       | 任意类型         |
| 引用强度     | 强引用         | 弱引用（对键）   |
| 可遍历       | 是             | 否               |
| 有 `size`    | 是             | 否               |
| 有 `clear`   | 是             | 否               |
| 垃圾回收阻止 | 阻止键对象回收 | 不阻止键对象回收 |

---

## 3. WeakSet

`WeakSet` 是一种值的集合，其中**值必须是对象**，且每个值只能出现一次（唯一）。它对值是弱引用，当值对象不再被其他强引用引用时，会自动从 WeakSet 中移除。

### 3.1 创建 WeakSet

```javascript
const ws = new WeakSet();
const obj1 = {}, obj2 = {};
ws.add(obj1);
ws.add(obj2);
```

### 3.2 实例方法

| 方法            | 描述                                                                         |
| --------------- | ---------------------------------------------------------------------------- |
| `add(value)`    | 向 WeakSet 添加一个值。`value` 必须是对象。返回 WeakSet 实例，支持链式调用。 |
| `has(value)`    | 判断 WeakSet 中是否存在指定值。                                              |
| `delete(value)` | 删除指定值。成功删除返回 `true`，否则返回 `false`。                          |

```javascript
const ws = new WeakSet();
const obj = { name: 'Alice' };

ws.add(obj);
console.log(ws.has(obj)); // true

ws.delete(obj);
console.log(ws.has(obj)); // false
```

WeakSet 同样没有 `size`、`clear` 和任何遍历方法。

### 3.3 与 Set 的对比

| 特性         | Set            | WeakSet          |
| ------------ | -------------- | ---------------- |
| 值类型       | 任意类型       | **必须是对象**   |
| 唯一性       | 是             | 是               |
| 引用强度     | 强引用         | 弱引用           |
| 可遍历       | 是             | 否               |
| 有 `size`    | 是             | 否               |
| 有 `clear`   | 是             | 否               |
| 垃圾回收阻止 | 阻止值对象回收 | 不阻止值对象回收 |

---

## 4. 弱引用与垃圾回收

### 4.1 弱引用如何工作？

弱引用不会增加对象的引用计数，垃圾回收器在决定是否回收对象时，只考虑强引用。如果一个对象只被 WeakMap/WeakSet 引用（即没有其他强引用指向它），那么它在下一次垃圾回收时就会被回收，同时对应的条目会自动从 WeakMap/WeakSet 中移除。

**示例**：

```javascript
let user = { name: 'Alice' };
const wm = new WeakMap();
wm.set(user, 'admin');

user = null; // 原对象失去强引用，仅被 wm 弱引用
// 下次垃圾回收后，wm 中对应的条目会被自动清除
```

由于垃圾回收的具体时机不可预测，我们无法立即观察到 `wm.has(user)` 的变化，但可以确定的是，当对象被回收后，条目就不再存在。

### 4.2 无法强制触发垃圾回收

在 JavaScript 中，开发者无法强制立即进行垃圾回收。因此，WeakMap/WeakSet 的内部状态变化是不可观察的（除非通过引用计数等非标准手段）。这正符合其设计目标：让内存管理由引擎自动处理，开发者无需手动清理。

---

## 5. 使用场景

### 5.1 存储 DOM 节点的元数据

在 Web 开发中，经常需要为 DOM 节点关联一些数据（如事件监听器标识、自定义属性等）。如果使用普通 `Map` 存储，当节点被移除后，数据仍然被 `Map` 引用，导致内存泄漏。使用 `WeakMap` 可以自动清理这些数据。

```javascript
const nodeData = new WeakMap();

function addDataToNode(node, data) {
  nodeData.set(node, data);
}

// 当 node 从 DOM 中移除且没有其他引用时，nodeData 中的条目自动消失
```

### 5.2 私有属性/私有数据存储

利用 WeakMap 可以实现真正的私有属性，避免属性被外部访问。将私有数据存储在 WeakMap 中，以实例对象为键。

```javascript
const _private = new WeakMap();

class Person {
  constructor(name, age) {
    _private.set(this, { name, age });
  }
  getName() {
    return _private.get(this).name;
  }
}
const p = new Person('Alice', 30);
console.log(p.name); // undefined，无法直接访问私有数据
console.log(p.getName()); // 'Alice'
```

由于 WeakMap 的键是对象，且没有遍历方法，外部无法获取到私有数据，除非通过实例对象本身和 `_private` 变量。

### 5.3 缓存与防止内存泄漏

当缓存对象且希望它们随原始对象一起销毁时，WeakMap 是理想选择。例如，缓存计算结果，但避免长期占用内存。

```javascript
const cache = new WeakMap();

function computeExpensiveResult(obj) {
  if (cache.has(obj)) return cache.get(obj);
  const result = /* 耗时计算 */;
  cache.set(obj, result);
  return result;
}
// 当 obj 被回收，缓存条目自动清除
```

### 5.4 对象标记与状态跟踪

WeakSet 可以用于标记对象是否具有某种状态，而不影响其生命周期。

```javascript
const processed = new WeakSet();

function process(obj) {
  if (processed.has(obj)) return;
  // 处理 obj
  processed.add(obj);
}
// 当 obj 被回收，标记自动移除
```

这在事件处理、观察者模式或临时状态标记中非常有用。

---

## 6. 注意事项与最佳实践

### 6.1 键/值必须是对象

WeakMap 的键和 WeakSet 的值必须是对象类型。如果尝试使用原始值（如字符串、数字），会抛出 `TypeError`。

```javascript
const wm = new WeakMap();
wm.set('key', 'value'); // TypeError: Invalid value used as weak map key
```

### 6.2 不可遍历带来的限制

由于 WeakMap 和 WeakSet 不可遍历，你无法获取它们的全部键或值，也无法知道它们的大小。这要求你必须在其他数据结构中维护必要的引用信息。如果需要遍历，说明你可能应该使用 `Map` 或 `Set`。

### 6.3 弱引用不保证立即清除

垃圾回收的时机由引擎决定，你无法立即看到 WeakMap/WeakSet 中条目的消失。因此，不要依赖它们进行业务逻辑的即时反馈，仅应用于内存管理优化。

### 6.4 避免无意义的查询

如果你已经失去了对键对象的引用，仍然试图通过 `has` 或 `get` 查询，由于对象可能已被回收，返回值可能是 `false` 或 `undefined`，但无法确定对象是否真的被回收（因为查询时你可能创建了一个新的对象引用）。因此，通常的做法是只在持有对象引用时操作 WeakMap/WeakSet。

### 6.5 与 FinalizationRegistry 的关联

ES2021 引入了 `FinalizationRegistry`，允许注册在对象被垃圾回收时执行回调。这与 WeakMap/WeakSet 的弱引用概念相关，但用途不同。`FinalizationRegistry` 更底层，一般用于库开发，日常编程中应优先使用 WeakMap/WeakSet。

### 6.6 何时使用 WeakMap/WeakSet？

- 当你需要为对象关联额外数据，且这些数据的生命周期应与对象一致时，使用 WeakMap。
- 当你需要标记对象而不影响其回收时，使用 WeakSet。
- 如果对象可能被重复使用且数据需要长期保存，或者你需要遍历数据，请使用 Map/Set。

---

## 7. 总结

`WeakMap` 和 `WeakSet` 是 JavaScript 中用于高效内存管理的重要工具。它们通过弱引用机制，允许开发者安全地为对象附加元数据或标记，而无需担心内存泄漏。尽管它们的 API 有限（不支持遍历、无 size），但正是这些限制保证了弱引用的有效性，并使垃圾回收器能够正确工作。

| 特性      | WeakMap                        | WeakSet                |
| --------- | ------------------------------ | ---------------------- |
| 存储内容  | 键值对（键为对象）             | 唯一值（值为对象）     |
| 键/值类型 | 键：对象；值：任意             | 值：对象               |
| 引用强度  | 弱引用（键）                   | 弱引用（值）           |
| 主要用途  | 存储私有数据、缓存、DOM 元数据 | 对象标记、状态跟踪     |
| API       | `set`、`get`、`has`、`delete`  | `add`、`has`、`delete` |

掌握 WeakMap 和 WeakSet，可以帮助你编写更健壮、更内存友好的 JavaScript 应用程序。在实际开发中，结合 Map 和 Set 一起使用，可以满足各种数据存储需求。
