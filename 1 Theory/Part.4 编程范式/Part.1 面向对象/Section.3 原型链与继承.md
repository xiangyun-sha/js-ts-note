# 原型链与继承

[TOC]

---

继承是面向对象编程中代码复用的核心机制，它允许我们基于现有类（或对象）创建新类（或对象），并扩展或修改其行为。JavaScript 的继承体系独具特色：它没有传统的类继承模型，而是基于**原型链**（Prototype Chain）实现的。即使 ES6 引入了 `class` 语法，其底层依然是原型链。理解原型链是掌握 JavaScript 面向对象精髓的关键。

本章将深入剖析原型链的运作机制，系统介绍 JavaScript 中实现继承的各种方式，从早期的原型链继承到现代的 `class` 继承，并分析各自的优缺点和适用场景。

---

## 1. 原型基础

在深入继承之前，必须先理解原型（Prototype）的概念。

### 1.1 什么是原型？

每个 JavaScript 函数（除了某些内置函数）都有一个 `prototype` 属性，它指向一个对象，称为**原型对象**。当这个函数作为构造函数（与 `new` 配合）使用时，新创建的对象会有一个内部链接指向该原型对象。这个内部链接在规范中称为 `[[Prototype]]`，在大多数浏览器中可以通过 `__proto__` 属性访问（非标准，仅用于调试）。

```javascript
function Person(name) {
  this.name = name;
}
Person.prototype.sayHello = function() {
  console.log(`Hello, I'm ${this.name}`);
};

const alice = new Person('Alice');
alice.sayHello(); // Hello, I'm Alice
console.log(alice.__proto__ === Person.prototype); // true
```

### 1.2 原型的作用

原型的主要作用是**共享属性和方法**。所有通过同一构造函数创建的实例，都共享同一个原型对象上的属性和方法，从而节省内存。

```javascript
function Animal() {}
Animal.prototype.eat = function() {
  console.log('Eating...');
};

const dog = new Animal();
const cat = new Animal();
console.log(dog.eat === cat.eat); // true，共享同一个方法
```

### 1.3 原型链的形成

每个对象都有原型（除了 `Object.prototype`，其原型为 `null`）。当我们访问对象的某个属性时，JavaScript 引擎会先从对象自身查找，如果找不到，就沿着 `__proto__` 链向上查找，直到找到该属性或到达原型链末端（`null`）。这一系列相互关联的原型构成的链条就是**原型链**。

```javascript
function Grandparent() {}
Grandparent.prototype.sayHi = function() { console.log('Hi'); };

function Parent() {}
Parent.prototype = Object.create(Grandparent.prototype); // 继承 Grandparent
Parent.prototype.constructor = Parent;

function Child() {}
Child.prototype = Object.create(Parent.prototype);
Child.prototype.constructor = Child;

const child = new Child();
child.sayHi(); // 从 Grandparent.prototype 继承
```

查找过程：`child` 自身 → `Child.prototype` → `Parent.prototype` → `Grandparent.prototype` → `Object.prototype` → `null`。

---

## 2. 继承的实现方式

### 2.1 原型链继承

这是 JavaScript 中最原始的继承方式：让子类的原型指向父类的实例。

```javascript
function Parent() {
  this.name = 'parent';
}
Parent.prototype.say = function() {
  console.log(this.name);
};

function Child() {
  this.name = 'child';
}
Child.prototype = new Parent(); // 核心：将子类原型设为父类实例

const c = new Child();
c.say(); // child
console.log(c instanceof Parent); // true
```

**优点**：

- 简单易实现。
- 能够继承父类原型上的方法。

**缺点**：

- **引用类型属性被所有实例共享**：父类实例的引用属性（如数组）会被所有子实例共享。

  ```javascript
  function Parent() { this.colors = ['red']; }
  Child.prototype = new Parent();
  const c1 = new Child();
  const c2 = new Child();
  c1.colors.push('blue');
  console.log(c2.colors); // ['red', 'blue'] 受影响
  ```

- **无法向父类构造函数传参**：因为是在设置原型时一次性创建父类实例，后续子类实例化时无法定制。
- **子类原型上的 `constructor` 被覆盖**，需要手动修复。

### 2.2 借用构造函数继承

为了解决引用类型共享和传参问题，可以在子类构造函数中调用父类构造函数（借用构造函数），将父类的实例属性复制到子类实例上。

```javascript
function Parent(name) {
  this.name = name;
  this.colors = ['red'];
}
Parent.prototype.say = function() { ... };

function Child(name, age) {
  Parent.call(this, name); // 核心：调用父类构造函数
  this.age = age;
}

const c = new Child('Alice', 10);
console.log(c.name); // Alice
c.colors.push('blue');
console.log(new Child('Bob', 12).colors); // ['red']，不受影响
```

**优点**：

- 解决了引用类型共享问题。
- 可以向父类传递参数。

**缺点**：

- **无法继承父类原型上的方法**：`Parent.prototype` 上的方法对子类不可见。
- 每个子类实例都会创建一份父类实例属性的副本，方法无法复用。

### 2.3 组合继承（原型链 + 借用构造函数）

组合继承结合了二者的优点：使用原型链继承原型上的方法，借用构造函数继承实例属性。

```javascript
function Parent(name) {
  this.name = name;
  this.colors = ['red'];
}
Parent.prototype.say = function() {
  console.log(this.name);
};

function Child(name, age) {
  Parent.call(this, name); // 第二次调用 Parent
  this.age = age;
}
Child.prototype = new Parent(); // 第一次调用 Parent
Child.prototype.constructor = Child;

const c = new Child('Alice', 10);
c.say(); // Alice
c.colors.push('blue');
console.log(new Child('Bob', 12).colors); // ['red']
```

**优点**：

- 实例属性独立，方法共享。
- 可以传参，支持 `instanceof` 和 `isPrototypeOf`。

**缺点**：

- **父类构造函数被调用了两次**，导致子类原型上存在不必要的父类实例属性（被实例属性遮蔽，但仍有内存浪费）。

### 2.4 原型式继承

借助已有的对象创建新对象，不必创建构造函数。`Object.create()` 就是该模式的标准化实现。

```javascript
const parent = {
  name: 'parent',
  colors: ['red'],
  say() { console.log(this.name); }
};

const child = Object.create(parent);
child.name = 'child';
child.say(); // child
console.log(child.colors); // ['red']
```

**特点**：

- 适用于基于现有对象创建新对象，无需构造函数。
- 与原型链继承类似，引用类型属性会被所有“实例”共享。

### 2.5 寄生式继承

在原型式继承的基础上增强对象，添加额外方法。

```javascript
function createAnother(original) {
  const clone = Object.create(original);
  clone.sayHi = function() { // 添加新方法
    console.log('Hi');
  };
  return clone;
}
const parent = { name: 'parent' };
const child = createAnother(parent);
child.sayHi(); // Hi
```

**缺点**：方法无法复用，每个对象都有自己的方法副本。

### 2.6 寄生组合式继承

组合继承的改进版，解决两次调用父类构造函数的问题。它通过空函数桥接来继承父类原型，而不是直接调用父类构造函数。

```javascript
function inheritPrototype(Child, Parent) {
  const prototype = Object.create(Parent.prototype); // 创建父类原型的副本
  prototype.constructor = Child;
  Child.prototype = prototype;
}

function Parent(name) {
  this.name = name;
  this.colors = ['red'];
}
Parent.prototype.say = function() { console.log(this.name); };

function Child(name, age) {
  Parent.call(this, name); // 仅一次调用
  this.age = age;
}
inheritPrototype(Child, Parent); // 链接原型

const c = new Child('Alice', 10);
c.say(); // Alice
```

**优点**：这是最理想的继承方式，只调用一次父类构造函数，且保持了原型链，是 ES6 `class` 继承的底层实现基础。

---

## 3. ES6 class 继承

ES6 的 `class` 语法大大简化了继承的实现，其底层仍然基于原型链，但封装了上述复杂性。

```javascript
class Parent {
  constructor(name) {
    this.name = name;
    this.colors = ['red'];
  }
  say() {
    console.log(this.name);
  }
}

class Child extends Parent {
  constructor(name, age) {
    super(name); // 调用父类构造函数
    this.age = age;
  }
}

const c = new Child('Alice', 10);
c.say(); // Alice
console.log(c instanceof Parent); // true
console.log(c instanceof Child);  // true
```

### 3.1 `extends` 的工作原理

`extends` 内部会建立一个原型链：

- `Child.prototype` 的原型指向 `Parent.prototype`（方法继承）。
- `Child.__proto__` 指向 `Parent`（静态属性继承）。

```javascript
Object.setPrototypeOf(Child.prototype, Parent.prototype);
Object.setPrototypeOf(Child, Parent); // 继承静态属性
```

### 3.2 `super` 关键字

- 在构造函数中，`super()` 代表调用父类构造函数，必须在访问 `this` 之前调用。
- 在方法中，`super.method()` 可以调用父类原型上的方法。

### 3.3 继承内置对象

ES6 允许继承内置构造函数（如 `Array`、`Error`），使子类拥有内置对象的行为。

```javascript
class MyArray extends Array {
  first() { return this[0]; }
}
const arr = new MyArray(1, 2, 3);
console.log(arr.first()); // 1
console.log(arr.length);  // 3
```

---

## 4. 原型链相关的关键细节

### 4.1 `instanceof` 运算符

`instanceof` 检查右侧构造函数的 `prototype` 是否出现在左侧对象的原型链上。

```javascript
function Parent() {}
const child = Object.create(Parent.prototype);
console.log(child instanceof Parent); // true
```

### 4.2 `isPrototypeOf` 方法

判断一个对象是否在另一个对象的原型链上。

```javascript
const parent = {};
const child = Object.create(parent);
console.log(parent.isPrototypeOf(child)); // true
```

### 4.3 动态修改原型的影响

因为原型链是动态的，对原型对象的修改会立即反映到所有基于该原型创建的对象上（即使对象已经创建）。

```javascript
function Person() {}
const p = new Person();
Person.prototype.sayHi = function() { console.log('Hi'); };
p.sayHi(); // Hi，即使对象创建后才添加方法
```

但如果重写整个原型，则之前创建的实例的 `__proto__` 仍指向旧原型，不会受影响。

### 4.4 不要使用 `__proto__`

`__proto__` 是历史遗留的非标准属性，虽然在许多环境中可用，但应避免在正式代码中使用。现代 JavaScript 提供了 `Object.getPrototypeOf()` 和 `Object.setPrototypeOf()` 来操作原型。

### 4.5 性能影响

原型链查找有一定性能开销，尤其是在深层链上。但现代引擎已高度优化，通常无需过度担忧。如果遇到性能瓶颈，可考虑将频繁访问的属性缓存为自身属性。

---

## 5. 继承的最佳实践

- **优先使用 ES6 `class` 继承**：语法清晰，功能完备，适合绝大多数场景。
- **避免过深的继承链**：保持层次扁平，优先考虑组合而非继承。
- **使用 `Object.create` 实现原型式继承**：适合简单对象继承。
- **理解底层原理**：即使在 `class` 时代，掌握原型链仍有助于调试和深入理解语言。
- **注意 `super` 的使用**：在子类构造函数中必须先调用 `super()` 才能使用 `this`。

---

## 小结

原型链是 JavaScript 的基石，理解它才能真正掌握这门语言的面向对象特性。本章我们学习了：

- 原型的基本概念和原型链的形成。
- 从原型链继承到寄生组合式继承的演进，每种方式的优缺点。
- ES6 `class` 继承的用法及其底层原理。
- 原型链相关的关键细节和最佳实践。

在下一节 **抽象** 中，我们将探讨如何利用面向对象的抽象思想，设计出更具扩展性的代码结构。
