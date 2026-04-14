# Object

[TOC]

---

`Object` 是 JavaScript 中最基础、最重要的内置构造函数。几乎所有 JavaScript 对象都是 `Object` 的实例，或者位于其原型链上。`Object` 提供了创建和管理对象的多种方法，以及用于操作对象属性、原型和特性的一系列静态工具函数。理解 `Object` 及其方法是掌握 JavaScript 对象系统的关键。

本章将全面介绍 `Object` 构造函数、静态方法、实例方法、属性描述符，并提供丰富的使用示例和最佳实践。

---

## 1. 概述

在 JavaScript 中，对象是一种复合值，可以包含多个属性（键值对）。对象可以通过多种方式创建，例如对象字面量、`new Object()`、`Object.create()` 等。几乎所有对象都继承自 `Object.prototype`，因此它们共享 `Object.prototype` 上定义的方法（如 `toString`、`hasOwnProperty` 等）。

`Object` 本身是一个函数，可以作为普通函数调用（返回一个新对象），也可以作为构造函数使用（效果类似）。但它最常用的身份是作为工具方法的命名空间，提供了一系列操作对象的静态方法。

---

## 2. Object 构造函数

### 语法

```javascript
new Object(value)
Object(value)
```

- 当作为构造函数（`new Object()`）或普通函数（`Object()`）调用时，行为几乎相同：根据传入的 `value` 返回一个包装对象。
- 如果 `value` 是 `null` 或 `undefined`，返回一个空对象 `{}`。
- 如果 `value` 已经是对象，则直接返回该对象。
- 对于原始类型（如数字、字符串、布尔值），返回对应的包装对象（不推荐显式使用）。

**示例**：

```javascript
const obj1 = new Object();          // {}
const obj2 = Object();              // {}
const obj3 = new Object({ a: 1 });  // { a: 1 }（直接返回原对象）
const numObj = new Object(42);      // Number {42}，包装对象
```

通常，我们使用更简洁的对象字面量 `{}` 创建对象，而不是显式调用 `Object` 构造函数。

---

## 3. 静态方法

`Object` 的静态方法用于执行各种对象操作，如属性遍历、原型操作、对象扩展、属性描述符等。

### 3.1 属性遍历与键值获取

#### `Object.keys(obj)`

返回一个由对象自身的**可枚举**属性名组成的数组（不包括原型链上的属性）。

```javascript
const obj = { a: 1, b: 2, c: 3 };
console.log(Object.keys(obj)); // ['a', 'b', 'c']
```

#### `Object.values(obj)`

返回一个由对象自身的可枚举属性值组成的数组。

```javascript
console.log(Object.values(obj)); // [1, 2, 3]
```

#### `Object.entries(obj)`

返回一个由 `[key, value]` 对组成的数组，每个对是对象自身的可枚举属性。

```javascript
console.log(Object.entries(obj)); // [['a', 1], ['b', 2], ['c', 3]]
```

#### `Object.getOwnPropertyNames(obj)`

返回一个由对象自身的所有属性名（包括不可枚举的属性，但不包括 Symbol 属性）组成的数组。

```javascript
const obj = { a: 1 };
Object.defineProperty(obj, 'b', { value: 2, enumerable: false });
console.log(Object.getOwnPropertyNames(obj)); // ['a', 'b']
```

#### `Object.getOwnPropertySymbols(obj)`

返回一个由对象自身的所有 Symbol 属性组成的数组。

```javascript
const sym = Symbol('id');
const obj = { [sym]: 123 };
console.log(Object.getOwnPropertySymbols(obj)); // [Symbol(id)]
```

### 3.2 原型操作

#### `Object.create(proto, propertiesObject?)`

创建一个新对象，其原型指向 `proto`，并可选择性地添加属性描述符。

```javascript
const parent = { x: 10 };
const child = Object.create(parent);
child.y = 20;
console.log(child.x); // 10（继承自原型）
console.log(Object.getPrototypeOf(child) === parent); // true
```

#### `Object.getPrototypeOf(obj)`

返回指定对象的原型（即内部 `[[Prototype]]` 属性的值）。

```javascript
console.log(Object.getPrototypeOf(child) === parent); // true
```

#### `Object.setPrototypeOf(obj, proto)`

设置对象的原型。应谨慎使用，可能影响性能。

```javascript
const obj = {};
Object.setPrototypeOf(obj, parent);
console.log(obj.x); // 10
```

**注意**：修改原型可能降低性能，推荐使用 `Object.create()` 在创建时指定原型。

### 3.3 属性描述符

属性描述符用于定义属性的特性（如是否可写、可枚举、可配置等）。每个属性都有一个对应的描述符对象，分为**数据属性**和**访问器属性**。

#### 数据属性描述符

- `value`：属性值（默认 `undefined`）
- `writable`：是否可修改（默认 `false`）
- `enumerable`：是否可枚举（默认 `false`）
- `configurable`：是否可配置（如删除、修改描述符）（默认 `false`）

#### 访问器属性描述符

- `get`：获取函数
- `set`：设置函数
- `enumerable`：是否可枚举
- `configurable`：是否可配置

相关静态方法：

- **`Object.defineProperty(obj, prop, descriptor)`**  
  定义或修改对象上的单个属性，并返回该对象。

  ```javascript
  const obj = {};
  Object.defineProperty(obj, 'name', {
    value: 'Alice',
    writable: false,
    enumerable: true,
    configurable: false
  });
  console.log(obj.name); // 'Alice'
  obj.name = 'Bob';      // 静默失败（非严格模式）或抛出 TypeError（严格模式）
  ```

- **`Object.defineProperties(obj, props)`**  
  同时定义多个属性。

  ```javascript
  Object.defineProperties(obj, {
    prop1: { value: 1, writable: true },
    prop2: { value: 2 }
  });
  ```

- **`Object.getOwnPropertyDescriptor(obj, prop)`**  
  获取对象自身属性的描述符。

  ```javascript
  console.log(Object.getOwnPropertyDescriptor(obj, 'name'));
  // { value: 'Alice', writable: false, enumerable: true, configurable: false }
  ```

- **`Object.getOwnPropertyDescriptors(obj)`**  
  获取对象自身所有属性的描述符（包括 Symbol 属性），返回一个对象。

  ```javascript
  console.log(Object.getOwnPropertyDescriptors(obj));
  ```

### 3.4 对象扩展与冻结

#### `Object.assign(target, ...sources)`

将所有源对象的**可枚举自身属性**复制到目标对象，并返回目标对象。属性会被覆盖，且是浅拷贝。

```javascript
const target = { a: 1 };
const source = { b: 2, c: { d: 3 } };
Object.assign(target, source);
console.log(target); // { a: 1, b: 2, c: { d: 3 } }
target.c.d = 99;     // 影响 source 的 c 对象（浅拷贝）
console.log(source.c.d); // 99
```

#### `Object.is(value1, value2)`

判断两个值是否相同。与 `===` 的主要区别在于：

- `Object.is(NaN, NaN)` 返回 `true`。
- `Object.is(0, -0)` 返回 `false`。

```javascript
console.log(Object.is(NaN, NaN)); // true
console.log(NaN === NaN);         // false
```

#### 对象限制方法

- **`Object.preventExtensions(obj)`**：阻止向对象添加新属性。
- **`Object.seal(obj)`**：阻止添加或删除属性，但现有属性可修改（如果可写）。
- **`Object.freeze(obj)`**：完全冻结对象，不能添加、删除或修改任何属性（深度冻结需递归）。

对应的检查方法：

- `Object.isExtensible(obj)`
- `Object.isSealed(obj)`
- `Object.isFrozen(obj)`

```javascript
const obj = { a: 1 };
Object.freeze(obj);
obj.a = 2;      // 静默失败或报错
obj.b = 3;      // 无法添加
delete obj.a;   // 无法删除
console.log(obj); // { a: 1 }
```

---

## 4. 实例方法

所有通过 `Object` 创建或继承自 `Object.prototype` 的对象都可以调用以下方法（除非被覆盖）。

#### `obj.hasOwnProperty(prop)`

判断对象自身（不包括原型链）是否具有指定属性。

```javascript
const obj = { a: 1 };
console.log(obj.hasOwnProperty('a')); // true
console.log(obj.hasOwnProperty('toString')); // false（来自原型）
```

#### `obj.propertyIsEnumerable(prop)`

判断指定属性是否可枚举。

```javascript
const obj = { a: 1 };
Object.defineProperty(obj, 'b', { value: 2, enumerable: false });
console.log(obj.propertyIsEnumerable('a')); // true
console.log(obj.propertyIsEnumerable('b')); // false
```

#### `obj.isPrototypeOf(target)`

判断对象是否在目标对象的原型链上。

```javascript
const parent = {};
const child = Object.create(parent);
console.log(parent.isPrototypeOf(child)); // true
console.log(child.isPrototypeOf(parent)); // false
```

#### `obj.toString()`

返回对象的字符串表示。默认返回 `"[object Object]"`，但可被覆盖（如数组、日期等重写了该方法）。

```javascript
const obj = { a: 1 };
console.log(obj.toString()); // "[object Object]"
```

#### `obj.valueOf()`

返回对象的原始值表示。默认返回对象本身，通常被包装对象（如 `Number`、`Boolean`）重写。

```javascript
const numObj = new Number(42);
console.log(numObj.valueOf()); // 42
```

#### `obj.toLocaleString()`

返回对象的本地化字符串表示。可被重写（如日期、数字）。

---

## 5. 属性描述符详解

属性描述符是 `Object` 中一个核心概念，它允许精细控制属性的行为。在 `Object.defineProperty` 等方法中，我们传入的描述符对象可以包含以下字段：

### 数据属性

- `value`：属性的值。
- `writable`：布尔值，是否可以通过赋值修改。
- `enumerable`：布尔值，是否在 `for...in` 或 `Object.keys()` 中出现。
- `configurable`：布尔值，是否可以通过 `delete` 删除，或修改描述符（除了将 `writable` 从 `true` 改为 `false` 外，不允许修改其他特性）。

### 访问器属性

- `get`：函数，读取属性时调用。
- `set`：函数，写入属性时调用。
- `enumerable`：同上。
- `configurable`：同上。

**示例**：实现一个只读属性

```javascript
const obj = {};
Object.defineProperty(obj, 'readonly', {
  value: 100,
  writable: false,
  enumerable: true,
  configurable: false
});
```

**示例**：使用 getter/setter

```javascript
const temperature = { _celsius: 0 };
Object.defineProperty(temperature, 'fahrenheit', {
  get() { return this._celsius * 9 / 5 + 32; },
  set(value) { this._celsius = (value - 32) * 5 / 9; },
  enumerable: true,
  configurable: true
});
temperature.fahrenheit = 212;
console.log(temperature._celsius); // 100
```

---

## 6. 使用示例

### 6.1 浅拷贝对象

```javascript
const original = { a: 1, b: { c: 2 } };
const copy1 = Object.assign({}, original);
const copy2 = { ...original }; // 展开运算符更简洁
```

### 6.2 合并多个对象

```javascript
const defaults = { theme: 'light', debug: false };
const userConfig = { theme: 'dark' };
const config = Object.assign({}, defaults, userConfig); // { theme: 'dark', debug: false }
```

### 6.3 检查空对象

```javascript
function isEmpty(obj) {
  return Object.keys(obj).length === 0 && Object.getOwnPropertySymbols(obj).length === 0;
}
console.log(isEmpty({})); // true
```

### 6.4 创建纯字典对象（无原型）

```javascript
const dict = Object.create(null);
dict.key = 'value';
console.log(dict.toString); // undefined，因为没有继承 Object.prototype
```

### 6.5 对象属性计数

```javascript
const obj = { a: 1, b: 2, c: 3 };
console.log(Object.keys(obj).length); // 3
```

### 6.6 实现简单的枚举不可变性

```javascript
const enumObj = { A: 1, B: 2 };
Object.freeze(enumObj); // 禁止修改
// enumObj.A = 99; // 无效
```

---

## 7. 最佳实践与注意事项

### 7.1 优先使用对象字面量

除非需要特殊操作（如指定原型），否则始终使用 `{}` 创建对象，代码更简洁。

### 7.2 使用 `Object.create(null)` 创建纯字典

如果你需要一个纯粹作为键值对存储的对象（没有原型上的方法），使用 `Object.create(null)`，避免原型污染。

### 7.3 避免直接修改 `Object.prototype`

扩展 `Object.prototype` 会影响所有对象，导致难以追踪的 bug。如果需要添加通用方法，考虑使用 `Object.defineProperty` 定义不可枚举的属性，或者使用 `Symbol` 作为键。

### 7.4 谨慎使用 `Object.setPrototypeOf`

修改原型可能严重影响性能，且使代码难以理解。推荐在创建对象时指定原型（如 `Object.create`）。

### 7.5 理解浅拷贝与深拷贝

`Object.assign()` 和展开运算符只进行浅拷贝。对于嵌套对象，需要深拷贝时使用 `structuredClone()` 或递归实现。

### 7.6 利用属性描述符实现不可变数据

通过将属性设为不可写、不可配置，可以创建更安全的数据结构。

### 7.7 使用 `Object.is` 处理 NaN 比较

需要精确比较 `NaN` 或区分 `0` 和 `-0` 时，使用 `Object.is` 而非 `===`。

### 7.8 枚举属性时注意原型链

`for...in` 会遍历原型链上的可枚举属性，通常配合 `hasOwnProperty` 过滤。现代开发中更推荐 `Object.keys()` 或 `Object.entries()` 配合数组迭代。

---

## 小结

`Object` 是 JavaScript 对象系统的基石，提供了丰富的工具来创建、查询、修改和限制对象。掌握这些静态方法和实例方法，你就能更灵活地操控对象，写出更健壮、可维护的代码。

| 类别         | 常用方法                                                                                      |
| ------------ | --------------------------------------------------------------------------------------------- |
| 属性遍历     | `keys`、`values`、`entries`、`getOwnPropertyNames`、`getOwnPropertySymbols`                   |
| 原型操作     | `create`、`getPrototypeOf`、`setPrototypeOf`                                                  |
| 属性描述符   | `defineProperty`、`defineProperties`、`getOwnPropertyDescriptor`、`getOwnPropertyDescriptors` |
| 对象扩展限制 | `assign`、`preventExtensions`、`seal`、`freeze`、`is`                                         |
| 实例方法     | `hasOwnProperty`、`propertyIsEnumerable`、`isPrototypeOf`、`toString`、`valueOf`              |

在后续的标准库章节中，我们将继续学习其他核心内置对象，如 `Function`、`String`、`Number` 等，它们都继承自 `Object`，并扩展了各自的特有方法。
