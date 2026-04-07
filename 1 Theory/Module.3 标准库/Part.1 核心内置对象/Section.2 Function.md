# Function

[TOC]

---

`Function` 是 JavaScript 中所有函数的构造函数。每个 JavaScript 函数实际上都是一个 `Function` 对象。通过 `Function` 构造函数可以动态创建函数，但通常我们使用函数声明或函数表达式来定义函数。`Function` 提供了几个实例方法（如 `call`、`apply`、`bind`）和属性（如 `length`、`name`），这些方法被所有函数继承。

理解 `Function` 及其原型上的方法，对于掌握函数调用、上下文绑定以及函数式编程至关重要。

---

## 1. 概述

在 JavaScript 中，函数是第一类对象，它们可以：

- 通过字面量创建（函数声明、函数表达式、箭头函数）
- 赋值给变量、对象属性或数组元素
- 作为参数传递给其他函数
- 作为返回值从函数返回
- 拥有属性和方法

所有函数（包括普通函数、箭头函数、生成器函数等）都继承自 `Function.prototype`。`Function` 构造函数本身也是一个函数，它的原型是 `Function.prototype`。

---

## 2. Function 构造函数

### 语法

```javascript
new Function(arg1, arg2, ..., functionBody)
Function(arg1, arg2, ..., functionBody)
```

- 参数可以是多个字符串，最后一个参数是函数体字符串，前面的参数都是形参名。
- 如果只有一个参数，则该参数被视为函数体。
- 调用方式（`new` 或直接调用）效果相同。

**示例**：

```javascript
const sum = new Function('a', 'b', 'return a + b');
console.log(sum(2, 3)); // 5

const sayHi = new Function('console.log("Hello")');
sayHi(); // Hello
```

### 特点与注意事项

- **动态创建**：函数体是字符串，可以在运行时动态生成代码。
- **不创建闭包**：使用 `new Function` 创建的函数，其作用域是全局作用域（在非严格模式下），不捕获其创建时的词法环境。

  ```javascript
  let x = 10;
  function test() {
    let x = 20;
    const fn = new Function('return x'); // 这里的 x 指向全局的 x
    return fn();
  }
  console.log(test()); // 10，而不是 20
  ```

- **性能较差**：每次调用 `new Function` 都会解析函数体字符串，可能影响性能，且存在安全风险（如代码注入），应谨慎使用。

通常，我们只在极少数需要动态生成函数的场景（如动态模板编译）中使用它，绝大多数情况应使用函数声明或表达式。

---

## 3. 函数的实例属性

函数作为 `Function` 的实例，拥有以下自有属性（直接定义在函数对象上）和继承自原型的方法。

### 3.1 `name` 属性

返回函数的名称。对于匿名函数，`name` 可能是空字符串或推断出的名称（如变量名）。

```javascript
function foo() {}
const bar = function() {};
const baz = () => {};
console.log(foo.name); // 'foo'
console.log(bar.name); // 'bar'（变量名被推断）
console.log(baz.name); // 'baz'
console.log((new Function()).name); // 'anonymous'
```

### 3.2 `length` 属性

返回函数定义的形参个数（不包括剩余参数，也不包括有默认值的参数）。

```javascript
function fn(a, b, c = 10) {}
console.log(fn.length); // 2（默认参数之后的参数不计入）
function fn2(a, ...rest) {}
console.log(fn2.length); // 1
```

### 3.3 `prototype` 属性

当函数作为构造函数（与 `new` 一起使用）时，`prototype` 属性指向一个对象，该对象会成为通过该构造函数创建的实例的原型。只有普通函数（非箭头函数、非方法简写）才有 `prototype` 属性。

```javascript
function Person(name) {
  this.name = name;
}
Person.prototype.say = function() { console.log(this.name); };
console.log(typeof Person.prototype); // 'object'
```

**注意**：箭头函数、对象方法简写、类的方法都没有 `prototype` 属性。

### 3.4 `arguments` 和 `caller`（非标准，不推荐使用）

在非严格模式下，函数内部可以访问 `arguments.callee` 和 `arguments.caller`，以及函数对象的 `caller` 属性，但它们已被废弃，且在严格模式下访问会抛出错误。应避免使用。

---

## 4. 函数的实例方法（来自 `Function.prototype`）

所有函数都继承自 `Function.prototype`，因此拥有以下方法。

### 4.1 `call(thisArg, arg1, arg2, ...)`

调用函数，并显式指定函数内部的 `this` 值，后续参数依次作为函数的参数。

```javascript
function greet(greeting) {
  console.log(`${greeting}, ${this.name}`);
}
const user = { name: 'Alice' };
greet.call(user, 'Hello'); // Hello, Alice
```

### 4.2 `apply(thisArg, [argsArray])`

与 `call` 类似，但参数以数组（或类数组对象）形式传递。

```javascript
greet.apply(user, ['Hi']); // Hi, Alice
```

常用于将数组展开为参数，如 `Math.max.apply(null, [1, 2, 3])`。现代开发中可用展开运算符替代：`Math.max(...[1,2,3])`。

### 4.3 `bind(thisArg, arg1, arg2, ...)`

创建一个新函数，该函数被调用时将其 `this` 绑定为 `thisArg`，并可以预设部分参数（偏函数应用）。原函数不会被修改。

```javascript
const greetAlice = greet.bind(user, 'Hey');
greetAlice(); // Hey, Alice
```

`bind` 返回的函数也可以用作构造函数（如果原函数是构造函数），此时 `thisArg` 会被忽略，但预设的参数仍有效。

### 4.4 `toString()`

返回函数的源代码字符串。对于内置函数，返回 `"function name() { [native code] }"`。

```javascript
function foo() { return 42; }
console.log(foo.toString()); // "function foo() { return 42; }"
```

---

## 5. 函数对象的其他特性

### 5.1 函数作为构造函数

任何函数（箭头函数、生成器函数、类构造函数除外）都可以通过 `new` 关键字调用，成为构造函数。执行过程：

1. 创建一个新对象，其原型指向该函数的 `prototype` 属性。
2. 将函数内部的 `this` 绑定到该新对象。
3. 执行函数体，通常通过 `this` 添加属性。
4. 如果函数没有返回对象，则返回该新对象；如果显式返回一个对象，则返回该对象。

```javascript
function Car(model) {
  this.model = model;
}
const tesla = new Car('Model 3');
console.log(tesla.model); // Model 3
```

### 5.2 函数的原型链

函数既是对象，也是可调用对象。其原型链如下：

```
函数实例 → Function.prototype → Object.prototype → null
```

`Function.prototype` 本身是一个函数，但通常不直接调用。它定义了 `call`、`apply`、`bind` 等方法，并且它的 `Symbol.hasInstance` 方法定义了 `instanceof` 的行为。

### 5.3 函数的内部属性

- `[[Call]]`：当函数被普通调用时执行的内置逻辑。
- `[[Construct]]`：当函数被 `new` 调用时执行的内置逻辑（只有普通函数才有）。

箭头函数和类方法没有 `[[Construct]]`，因此不能用 `new` 调用。

---

## 6. 箭头函数与普通函数的区别

虽然箭头函数也是 `Function` 的实例，但它们在以下方面与普通函数不同：

- 没有自己的 `this`、`arguments`、`super`、`new.target`。
- 不能用作构造函数（不能 `new`）。
- 没有 `prototype` 属性。
- 内部的 `this` 由词法作用域决定（即定义时外层的 `this`），且无法通过 `call`、`apply`、`bind` 改变。

这些差异源于箭头函数的内部实现不同，但它们仍然继承自 `Function.prototype`，因此可以使用 `call`、`apply`、`bind`（只是不会改变 `this`）。

```javascript
const arrow = () => {};
console.log(arrow instanceof Function); // true
console.log(arrow.prototype); // undefined
```

---

## 7. 使用示例

### 7.1 动态指定函数执行上下文

```javascript
function logger(level, message) {
  console.log(`[${level}] ${this.timestamp}: ${message}`);
}

const context = { timestamp: new Date().toISOString() };
logger.call(context, 'INFO', 'Application started');
logger.apply(context, ['ERROR', 'Something went wrong']);
```

### 7.2 偏函数（参数预设）

```javascript
function multiply(a, b) {
  return a * b;
}
const double = multiply.bind(null, 2); // 预设 a=2
console.log(double(5)); // 10
```

### 7.3 函数柯里化

```javascript
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    } else {
      return function(...args2) {
        return curried.apply(this, args.concat(args2));
      };
    }
  };
}

function sum(a, b, c) { return a + b + c; }
const curriedSum = curry(sum);
console.log(curriedSum(1)(2)(3)); // 6
```

### 7.4 使用 `new Function` 动态编译模板

```javascript
function compileTemplate(template, data) {
  const keys = Object.keys(data);
  const values = keys.map(k => data[k]);
  const fn = new Function(...keys, 'return `' + template + '`');
  return fn(...values);
}
const result = compileTemplate('Hello, ${name}! You are ${age} years old.', { name: 'Alice', age: 30 });
console.log(result); // Hello, Alice! You are 30 years old.
```

**注意**：此示例仅用于演示，实际应用中应使用安全的模板引擎。

### 7.5 判断函数是否可被 new

```javascript
function isConstructor(fn) {
  try {
    new fn();
    return true;
  } catch {
    return false;
  }
}
console.log(isConstructor(function() {})); // true
console.log(isConstructor(() => {}));      // false
```

---

## 8. 最佳实践与注意事项

### 8.1 优先使用函数声明或表达式

除非绝对必要，否则不要使用 `new Function`，因为它会导致性能问题和安全风险。

### 8.2 理解 `this` 的绑定规则

使用 `call`、`apply` 或 `bind` 来显式指定 `this`，避免依赖默认绑定导致的意外。箭头函数适用于需要保留外层 `this` 的场景。

### 8.3 避免修改函数的内置属性

不要随意给函数对象添加非标准属性，除非用于特定优化（如缓存）。使用 `WeakMap` 或 `Map` 来存储与函数关联的数据，避免内存泄漏。

### 8.4 注意 `length` 属性的行为

`length` 只统计形参个数，不包括默认参数和剩余参数，这可能在柯里化等场景中引发问题，需自行处理。

### 8.5 谨慎使用 `arguments` 对象

在非箭头函数中，`arguments` 是类数组对象，包含了所有传入的参数。但在现代代码中，推荐使用剩余参数（`...args`）来获取参数数组，更清晰且支持数组方法。

### 8.6 函数缓存与记忆化

可以利用闭包和对象缓存函数计算结果，提升性能。

```javascript
function memoize(fn) {
  const cache = new Map();
  return function(...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}
```

### 8.7 避免在循环中创建函数

在循环中创建函数会导致多个函数对象，可能影响性能。如果函数逻辑相同，将其定义移到循环外部。

---

## 小结

`Function` 是 JavaScript 中函数的基石，提供了动态创建函数、控制函数调用上下文以及获取函数元信息的能力。掌握 `call`、`apply`、`bind` 以及函数的属性，能够让你更灵活地处理函数式编程和面向对象编程中的各种场景。

| 类别         | 常用属性/方法                                    |
|--------------|--------------------------------------------------|
| 实例属性     | `name`、`length`、`prototype`                    |
| 实例方法     | `call`、`apply`、`bind`、`toString`              |
| 静态方法     | `Function` 构造函数（一般不直接使用）            |
| 相关概念     | 构造函数、箭头函数、柯里化、记忆化              |

在后续的标准库章节中，我们将继续学习其他核心内置对象，如 `String`、`Number`、`Array` 等，它们都在各自领域扩展了 JavaScript 的能力。
