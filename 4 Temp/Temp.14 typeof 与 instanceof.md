# 在 TypeScript（和 JavaScript）中，`typeof` 和 `instanceof` 都用于类型检查，但它们的用途和适用场景完全不同

[TOC]

## 1. `typeof` —— 获取基本类型

`typeof` 是一个**运算符**，返回一个表示值类型的字符串。它主要用于**基本类型**（`string`、`number`、`boolean`、`symbol`、`bigint`、`undefined`、`function`、`object`）。

```typescript
let str = "hello";
let num = 42;
let bool = true;
let fn = () => {};
let obj = {};
let arr = [];
let nul = null;
let undef = undefined;

console.log(typeof str);   // "string"
console.log(typeof num);   // "number"
console.log(typeof bool);  // "boolean"
console.log(typeof fn);    // "function"
console.log(typeof obj);   // "object"
console.log(typeof arr);   // "object"  （注意：数组也是 "object"）
console.log(typeof nul);   // "object"  （历史遗留 bug）
console.log(typeof undef); // "undefined"
```

**TypeScript 中的类型收窄**：

```typescript
function print(value: string | number) {
  if (typeof value === "string") {
    // 此处 TypeScript 知道 value 是 string
    console.log(value.toUpperCase());
  } else {
    // 此处 TypeScript 知道 value 是 number
    console.log(value.toFixed(2));
  }
}
```

> ⚠️ `typeof` **无法区分** `null`、数组、普通对象、`Date`、`RegExp` 等，它们都返回 `"object"`。

## 2. `instanceof` —— 检查原型链

`instanceof` 是一个**运算符**，用于检查一个对象是否**某个构造函数的实例**（即原型链上是否存在该构造函数的 `prototype`）。它适用于**复杂对象**（类、数组、自定义类型等）。

```typescript
class Animal {}
class Dog extends Animal {}

let dog = new Dog();
let arr = [];
let date = new Date();

console.log(dog instanceof Dog);     // true
console.log(dog instanceof Animal);  // true
console.log(arr instanceof Array);   // true
console.log(arr instanceof Object);  // true
console.log(date instanceof Date);   // true
console.log(date instanceof Object); // true
```

**TypeScript 中的类型收窄**：

```typescript
function handle(value: Date | string) {
  if (value instanceof Date) {
    // 此处 TypeScript 知道 value 是 Date
    console.log(value.getTime());
  } else {
    // 此处是 string
    console.log(value.toUpperCase());
  }
}
```

> ⚠️ `instanceof` 对**基本类型**无效，并且要求右操作数是一个构造函数（有 `prototype` 属性）。

## 3. 关键区别对比表

| 特性            | `typeof`                 | `instanceof`                     |
| --------------- | ------------------------ | -------------------------------- |
| 适用类型        | 基本类型 + 函数          | 对象（原型链上的实例）           |
| 返回值          | 字符串（如 `"string"`）  | `boolean`                        |
| 判断依据        | 内部 `[[Type]]` 标记     | 原型链查找                       |
| 对 `null`       | `"object"`（错误）       | `false`（不能用于基本类型）      |
| 对数组          | `"object"`               | `true`（`arr instanceof Array`） |
| 对自定义类      | `"object"`               | 可以正确判断                     |
| TypeScript 用法 | 收窄联合类型（基本类型） | 收窄联合类型（对象类型）         |

## 4. 常见陷阱与补充

- **`typeof null` 是 `"object"`** —— 需单独处理：
  
  ```typescript
  if (value === null) { /* ... */ }
  ```

- **`instanceof` 跨 iframe / 不同全局对象时可能失效**，因为每个全局环境有独立的构造函数。

- **对于数组**，更好的判断是 `Array.isArray()`（ES5+）。

- **TypeScript 中可以使用 `typeof` 获取类型**（类型上下文）：

  ```typescript
  let person = { name: "Alice", age: 30 };
  type Person = typeof person;  // 提取 person 的类型
  ```

## 5. 总结

- 判断**基本类型**（包括 `function`） → 使用 **`typeof`**
- 判断**对象具体属于哪个类/构造函数** → 使用 **`instanceof`**
- 判断数组 → 使用 `Array.isArray()`
- 判断 `null` → 直接 `=== null`

两者结合使用可以覆盖大多数运行时类型检查场景。在 TypeScript 中，它们也是实现**类型守卫**（type guard）的常用工具。
