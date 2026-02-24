# 类与对象

[TOC]

---

面向对象编程（Object-Oriented Programming, OOP）是一种程序设计范式，它将数据（属性）和操作数据的方法（函数）封装为对象，并通过类（Class）来创建对象。JavaScript 虽然最初是基于原型的语言，但从 ES6 开始引入了 `class` 关键字，使其更接近传统 OOP 语言的风格。然而，理解 JavaScript 的类与对象，必须同时掌握其背后的原型机制。

本章将系统介绍 JavaScript 中类与对象的基本概念、创建方式、属性与方法、以及 ES6 class 的用法，为后续学习封装、继承、多态等面向对象特性打下基础。

---

## 1. 对象的概念

**对象** 是包含一组无序属性和方法的集合。属性可以是基本值、函数或其他对象。在 JavaScript 中，几乎一切都是对象（除了原始类型）。

一个简单的对象示例：

```javascript
const person = {
  name: 'Alice',      // 属性
  age: 30,
  greet() {           // 方法
    console.log(`Hello, I'm ${this.name}`);
  }
};
person.greet(); // Hello, I'm Alice
```

对象可以通过 **属性名** 访问其成员，使用点号（`.`）或方括号（`[]`）语法。

---

## 2. 创建对象的几种方式

JavaScript 提供了多种创建对象的方法，理解它们有助于深入掌握对象系统。

### 2.1 对象字面量（Object Literal）

最常用、最简洁的方式，直接使用 `{}` 定义对象。

```javascript
const obj = {
  key: 'value',
  method() { ... }
};
```

适合创建单个、简单的对象。

### 2.2 使用 `new Object()` 构造函数

通过内置的 `Object` 构造函数创建对象，然后动态添加属性。

```javascript
const obj = new Object();
obj.key = 'value';
```

这种方式不常用，字面量更简洁。

### 2.3 使用工厂函数

工厂函数是一个返回对象的普通函数，可以封装创建逻辑。

```javascript
function createPerson(name, age) {
  return {
    name,
    age,
    greet() {
      console.log(`Hello, I'm ${this.name}`);
    }
  };
}
const person = createPerson('Alice', 30);
```

缺点：每次创建对象都会创建新的方法副本，无法共享方法。

### 2.4 使用构造函数

构造函数是一种用于创建特定类型对象的函数，通过 `new` 关键字调用。它利用原型（prototype）来共享方法，是 ES6 class 出现前的主流方式。

```javascript
function Person(name, age) {
  this.name = name;
  this.age = age;
}
Person.prototype.greet = function() {
  console.log(`Hello, I'm ${this.name}`);
};

const p1 = new Person('Alice', 30);
const p2 = new Person('Bob', 25);
p1.greet(); // Hello, I'm Alice
console.log(p1.greet === p2.greet); // true，共享同一方法
```

关于原型和构造函数的细节将在后续“原型链与继承”一章深入讲解。

### 2.5 使用 `Object.create()`

`Object.create(proto)` 创建一个新对象，其原型指向指定的 `proto` 对象。它可以实现基于原型的继承。

```javascript
const proto = {
  greet() {
    console.log(`Hello, I'm ${this.name}`);
  }
};
const person = Object.create(proto);
person.name = 'Alice';
person.greet(); // Hello, I'm Alice
```

`Object.create` 提供了更细粒度的原型控制。

### 2.6 使用 ES6 `class`

ES6 引入了 `class` 语法，本质上是构造函数的语法糖，但更清晰、更接近传统 OOP 语言。

```javascript
class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }
  greet() {
    console.log(`Hello, I'm ${this.name}`);
  }
}
const p = new Person('Alice', 30);
p.greet();
```

后续将详细展开 `class` 的用法。

---

## 3. 属性与方法

### 3.1 数据属性

对象的属性可以随时添加、修改或删除。

```javascript
const obj = { x: 1 };
obj.y = 2;          // 添加
obj.x = 10;         // 修改
delete obj.y;       // 删除
```

属性名可以是字符串或 Symbol。如果属性名不是合法标识符，必须使用方括号访问。

```javascript
obj['first name'] = 'Alice'; // 包含空格，需用方括号
```

### 3.2 方法

方法是作为对象属性的函数。在对象字面量中，可以定义方法（ES6 简写）：

```javascript
const obj = {
  method1: function() { ... },
  method2() { ... }   // 简写形式
};
```

方法内部的 `this` 通常指向调用该方法的对象（箭头函数除外）。

### 3.3 访问器属性：getter 和 setter

可以使用 `get` 和 `set` 关键字定义访问器属性，在读取和设置属性时执行自定义逻辑。

```javascript
const person = {
  firstName: 'Alice',
  lastName: 'Smith',
  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  },
  set fullName(value) {
    [this.firstName, this.lastName] = value.split(' ');
  }
};
console.log(person.fullName); // Alice Smith
person.fullName = 'Bob Johnson';
console.log(person.firstName); // Bob
```

在 ES6 class 中也可以使用 getter/setter。

### 3.4 静态属性与方法

静态成员属于类本身，而不是类的实例。在 ES6 class 中使用 `static` 关键字定义。

```javascript
class MathUtils {
  static PI = 3.14159;
  static add(a, b) {
    return a + b;
  }
}
console.log(MathUtils.PI);    // 3.14159
console.log(MathUtils.add(2, 3)); // 5
```

静态方法通常用于工具函数或与实例无关的操作。

### 3.5 私有属性（ES2022）

使用 `#` 前缀定义私有字段，只能在类内部访问。

```javascript
class Person {
  #age; // 私有字段
  constructor(name, age) {
    this.name = name;
    this.#age = age;
  }
  getAge() {
    return this.#age;
  }
}
const p = new Person('Alice', 30);
console.log(p.name);      // Alice
console.log(p.#age);      // 语法错误
console.log(p.getAge());  // 30
```

私有方法同样可以使用 `#` 定义。

---

## 4. ES6 class 详解

### 4.1 基本语法

```javascript
class ClassName {
  // 构造函数，可选
  constructor(parameters) {
    // 初始化实例属性
  }
  // 实例方法
  method() { ... }
  // 静态方法
  static staticMethod() { ... }
  // 静态属性（需在类外部定义，或使用 ES2022 静态块）
  // getter/setter
  get prop() { ... }
  set prop(value) { ... }
}
```

- `constructor` 方法在 `new` 实例化时自动调用，用于初始化实例属性。如果未显式定义，会有一个空的 `constructor()`。
- 类内部定义的方法都会挂载到类的原型上（静态方法除外）。

### 4.2 类的本质

ES6 的 `class` 本质上是构造函数的语法糖：

```javascript
class Person { ... }
console.log(typeof Person); // "function"
console.log(Person === Person.prototype.constructor); // true
```

但和普通函数有以下区别：

- 类必须用 `new` 调用，不能直接执行。
- 类声明不会提升（但类表达式会提升？实际上类声明也存在暂时性死区，不能在定义前访问）。
- 类内部默认启用严格模式。

### 4.3 类表达式

类也可以定义为表达式，可以是命名或匿名。

```javascript
const MyClass = class {
  // ...
};
const NamedClass = class MyNamedClass {
  // 类名 MyNamedClass 仅在类内部可见
};
```

### 4.4 实例属性新写法（ES2022）

可以在类顶层直接定义实例属性，无需写在 `constructor` 中。

```javascript
class Person {
  name = 'Unknown';     // 实例属性，默认值
  age = 0;
  constructor(name, age) {
    this.name = name;   // 会覆盖默认值
    this.age = age;
  }
}
```

### 4.5 静态初始化块（ES2022）

静态块用于在类加载时执行复杂的静态属性初始化。

```javascript
class Database {
  static connection;
  static {
    // 模拟异步初始化
    this.connection = createConnection();
  }
}
```

---

## 5. 类的继承

使用 `extends` 关键字实现继承，子类通过 `super` 调用父类构造函数和方法。

```javascript
class Animal {
  constructor(name) {
    this.name = name;
  }
  speak() {
    console.log(`${this.name} makes a sound.`);
  }
}

class Dog extends Animal {
  constructor(name, breed) {
    super(name);          // 调用父类构造函数
    this.breed = breed;
  }
  speak() {
    console.log(`${this.name} barks.`);
  }
  describe() {
    super.speak();        // 调用父类方法
    console.log(`It's a ${this.breed}.`);
  }
}

const d = new Dog('Rex', 'German Shepherd');
d.speak();      // Rex barks.
d.describe();   // Rex makes a sound. It's a German Shepherd.
```

**注意**：

- 子类必须在 `constructor` 中调用 `super()` 才能使用 `this`。
- 可以继承内置构造函数（如 `Array`、`Error`），但需注意一些细节。

---

## 6. 关于原型的提醒

虽然 ES6 class 隐藏了原型操作，但 JavaScript 的继承仍然基于原型链。理解以下等价关系有助于深入理解：

```javascript
class Person { ... }
Person.prototype.method === 实例对象的 __proto__.method
```

在类中定义的方法会被添加到 `Person.prototype` 上。静态方法则是添加到 `Person` 本身上。

后续章节“原型链与继承”将详细展开这一底层机制。

---

## 7. 最佳实践

### 7.1 优先使用 class 语法

除非需要特殊的原型操作，否则推荐使用 `class`，它更清晰、更符合现代 JavaScript 风格。

### 7.2 合理使用 getter/setter

只在需要额外逻辑（如验证、计算）时使用访问器属性，不要过度设计。

### 7.3 静态方法的适用场景

- 与类相关但不依赖实例数据的工具方法。
- 工厂方法（返回类实例的静态方法）。

### 7.4 私有字段的封装

尽量将需要隐藏的状态设为私有（`#`），避免外部直接修改。

### 7.5 避免复杂的继承层次

优先考虑组合而非继承，保持类层次扁平化。

---

## 小结

本章介绍了 JavaScript 中对象与类的核心概念，包括多种创建对象的方式、属性的定义与操作、ES6 class 的语法，以及继承的基本用法。通过学习，你应该能够：

- 理解对象作为属性集合的本质。
- 掌握使用对象字面量、构造函数、`Object.create` 和 `class` 创建对象。
- 熟练运用 ES6 class 定义属性和方法，包括静态成员、访问器、私有字段。
- 能够通过 `extends` 实现简单的类继承。

面向对象的其他重要特性（封装、继承、多态等）将在后续章节中逐一展开。下一节我们将学习 **封装**，探讨如何隐藏对象内部细节，保护数据完整性。
