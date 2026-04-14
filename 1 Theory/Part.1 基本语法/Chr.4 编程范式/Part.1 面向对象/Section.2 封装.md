# 封装

[TOC]

---

封装（Encapsulation）是面向对象编程的三大核心特性之一（另外两个是继承和多态）。它将数据（属性）和操作数据的方法（行为）捆绑在一起，形成一个独立的对象，并对外隐藏内部实现细节，仅暴露必要的接口。封装不仅使代码更易于维护和复用，还能保护数据免受外部不当修改，提升安全性。

本章将深入探讨 JavaScript 中实现封装的多种方式，从早期的闭包模拟到 ES2022 的私有字段，以及模块化封装和访问器属性的应用。

---

## 1. 封装的概念与意义

### 1.1 什么是封装？

封装的核心思想是**信息隐藏**和**接口分离**：

- **信息隐藏**：将对象的内部状态（属性）实现细节隐藏起来，不允许外部直接访问，只能通过对象提供的公共方法（接口）来操作这些状态。
- **接口分离**：对外暴露一组稳定的方法，作为与对象交互的唯一途径。内部实现可以自由变化而不影响外部代码。

### 1.2 封装的好处

- **保护数据完整性**：通过受控的方式修改数据，可以加入验证逻辑，避免数据被赋予无效值。
- **降低耦合**：外部代码只依赖接口，不依赖内部实现，使得内部重构更加安全。
- **提高可维护性**：职责清晰，易于理解和修改。
- **提升复用性**：封装良好的对象可以像黑盒一样被重复使用。

---

## 2. JavaScript 中的封装方式

JavaScript 作为一门动态语言，没有像 Java 那样原生的访问控制关键字（如 `private`、`protected`），但开发者利用语言特性创造出了多种模拟封装的模式。随着语言发展，ES2022 终于引入了正式的私有字段。

### 2.1 对象字面量 —— 最基本的封装

对象字面量本身将属性和方法组合在一起，已经体现了封装的基本形式——数据与操作的聚合。

```javascript
const counter = {
  count: 0,                // 属性
  increment() {            // 方法
    this.count++;
  },
  decrement() {
    this.count--;
  },
  getValue() {
    return this.count;
  }
};

counter.increment();
console.log(counter.getValue()); // 1
```

但这种方式并未隐藏 `count` 属性，外部可以直接修改 `counter.count`，破坏了封装。

### 2.2 使用闭包模拟私有变量

利用函数作用域和闭包，可以创建真正的私有变量。常见于构造函数或工厂函数。

#### 2.2.1 构造函数中的私有变量

```javascript
function Counter() {
  let count = 0;  // 私有变量，外部无法直接访问

  this.increment = function() {
    count++;
  };

  this.decrement = function() {
    count--;
  };

  this.getValue = function() {
    return count;
  };
}

const c = new Counter();
c.increment();
console.log(c.getValue()); // 1
console.log(c.count);      // undefined
```

这里 `count` 是构造函数内部的局部变量，被闭包捕获，只能通过暴露的方法访问。缺点：每个实例都会创建一份新的方法副本，无法共享。

#### 2.2.2 工厂函数中的私有变量

使用工厂函数同样可以实现私有变量，且无需使用 `new`。

```javascript
function createCounter() {
  let count = 0;
  return {
    increment() { count++; },
    decrement() { count--; },
    getValue() { return count; }
  };
}
```

这种方式简洁直观，但每个实例都拥有独立的方法副本，内存占用稍高。

### 2.3 使用 Symbol 模拟私有属性

ES6 引入的 `Symbol` 可以创建唯一的值，用作对象属性名，从而在一定程度上避免意外访问或命名冲突。

```javascript
const _count = Symbol('count');

class Counter {
  constructor() {
    this[_count] = 0;
  }
  increment() {
    this[_count]++;
  }
  getValue() {
    return this[_count];
  }
}

const c = new Counter();
c.increment();
console.log(c.getValue()); // 1
console.log(c._count);     // undefined（普通字符串无法访问）
console.log(c[Symbol('count')]); // undefined，因为 Symbol 每次都是新的
```

但这种方法并不绝对安全，因为可以通过 `Object.getOwnPropertySymbols()` 获取对象的所有 Symbol 属性，然后进行访问。因此，Symbol 更适用于定义**非字符串键名**，而非严格的私有。

### 2.4 使用 WeakMap 实现真正私有

利用 WeakMap 将私有数据与实例关联，且 WeakMap 不可遍历，能提供真正的私有性。

```javascript
const _count = new WeakMap();

class Counter {
  constructor() {
    _count.set(this, 0);
  }
  increment() {
    _count.set(this, _count.get(this) + 1);
  }
  getValue() {
    return _count.get(this);
  }
}

const c = new Counter();
c.increment();
console.log(c.getValue()); // 1
console.log(_count.get(c)); // 1，但 _count 在模块外部不可访问（若该 WeakMap 在模块内部定义）
```

通常将 WeakMap 定义在模块作用域内，不对外暴露，从而实现私有。这种方式在 ES6 class 出现后一度被广泛使用。

### 2.5 ES2022 私有字段（`#`）

如今，最标准、最简洁的私有成员实现是 ES2022 引入的**私有字段**。使用 `#` 前缀声明属性和方法，它们将在类内部强制私有，外部无法访问。

```javascript
class Counter {
  #count = 0;  // 私有字段

  increment() {
    this.#count++;
  }

  getValue() {
    return this.#count;
  }
}

const c = new Counter();
c.increment();
console.log(c.getValue()); // 1
console.log(c.#count);     // SyntaxError: Private field '#count' must be declared in an enclosing class
```

私有字段具有以下特点：

- 必须在类体中预先声明。
- 在类外部直接访问会引发语法错误。
- 私有字段不会出现在 `Object.keys()` 或 `for...in` 中。
- 支持私有方法（同样用 `#` 前缀）和私有静态字段。

这是现代 JavaScript 实现封装的首选方式。

### 2.6 使用 getter/setter 控制属性访问

除了隐藏属性，封装还包括对属性读写的控制。通过 getter 和 setter，可以在读取或修改属性时插入额外的逻辑（如验证、计算）。

```javascript
class Person {
  #age = 0;

  set age(value) {
    if (value < 0 || value > 150) {
      throw new Error('Invalid age');
    }
    this.#age = value;
  }

  get age() {
    return this.#age;
  }
}

const p = new Person();
p.age = 25;        // 调用 setter
console.log(p.age); // 25，调用 getter
p.age = -5;        // Error: Invalid age
```

这样既保证了数据的合法性，又保留了属性访问的自然语法。

### 2.7 模块化封装

ES6 模块本身提供了作用域隔离，是实现更高级封装的理想方式。可以将实现细节隐藏在模块内部，只导出公共接口。

```javascript
// counter.js
let count = 0;  // 模块内私有，外部无法访问

export function increment() {
  count++;
}

export function getValue() {
  return count;
}
```

```javascript
// main.js
import { increment, getValue } from './counter.js';
increment();
console.log(getValue()); // 1
console.log(count);      // 报错：count 未定义
```

模块级封装适用于工具库、状态管理等多种场景，是组织代码的最佳实践之一。

---

## 3. 封装与信息隐藏

封装的本质是信息隐藏。一个好的封装应遵循以下原则：

- **最小权限原则**：只暴露必要的接口，隐藏一切可隐藏的实现。
- **接口稳定**：对外接口应保持稳定，内部实现可以自由变化。
- **防御式编程**：对传入的参数进行验证，确保对象状态的一致性。

在团队协作中，封装良好的模块可以降低沟通成本，因为其他开发者只需了解接口，无需关心内部实现。

---

## 4. 封装的优缺点

### 优点

- **安全性**：防止外部代码随意修改内部数据，减少 bug。
- **灵活性**：内部实现变更不影响外部，便于重构和优化。
- **可测试性**：通过公共接口测试对象行为，无需关注内部细节。
- **可读性**：清晰的接口使得对象职责明确，代码更易于理解。

### 缺点

- **性能开销**：某些封装模式（如闭包）可能带来额外的内存或时间开销，但现代引擎已高度优化，通常可忽略。
- **复杂度**：过度封装可能导致不必要的抽象，增加系统复杂度。需权衡封装粒度。

---

## 5. 最佳实践

### 5.1 优先使用 ES2022 私有字段

在新项目中，对于类内部需要隐藏的数据，优先使用 `#` 私有字段，语法简洁且性能良好。

### 5.2 结合 getter/setter 控制访问

当属性需要验证、转换或触发副作用时，使用 getter/setter。避免为每个属性都添加无意义的 getter/setter，仅在必要时使用。

### 5.3 利用模块作用域实现封装

对于不需要实例化的工具函数或共享状态，使用模块导出代替全局变量，隐藏内部实现。

### 5.4 避免过度封装

不要为封装而封装。简单的对象字面量或公开字段在合适的情况下完全可接受。封装的程度应与代码的复杂度和可维护性需求相匹配。

### 5.5 TypeScript 的访问修饰符（扩展）

在 TypeScript 中，可以使用 `private`、`protected`、`public` 关键字在编译时检查访问权限，但它们不会在运行时产生任何限制。真正的运行时私有仍需借助 JavaScript 的私有字段或 WeakMap。本体系的 TypeScript 模块将详细探讨这部分。

---

## 小结

封装是面向对象编程的基石，它通过信息隐藏和接口分离，使代码更安全、更易维护。JavaScript 提供了多种实现封装的方式：

- **闭包**：在函数内部创建私有变量。
- **Symbol / WeakMap**：模拟私有属性。
- **ES2022 私有字段**：语言原生的私有成员。
- **getter/setter**：控制属性读写。
- **模块化**：在文件级别实现封装。

理解并善用这些技术，你将能够设计出更加健壮、可维护的 JavaScript 应用。下一节我们将探讨**原型链与继承**，揭示 JavaScript 对象系统的底层机制。
