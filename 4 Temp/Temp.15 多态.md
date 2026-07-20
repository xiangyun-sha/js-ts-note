在 TypeScript 的语境下，讨论这两个概念会变得非常有趣，因为 **TypeScript 的类型系统是结构化的（鸭子类型）**，而且**类型在编译后会被完全擦除**。

针对 TypeScript，我们重新拆解这两者，核心结论是：**运行时多态是 JavaScript 引擎的事，参数化多态是 TypeScript 编译器的事。**

### 1. 运行时多态（基于原型链和重写）

在 TS 中，运行时多态完全依赖编译后的 **JavaScript 原型链**。它主要体现为类继承中的方法重写（Override）。

- **机制**：使用 `class`、`extends` 和 `override` 关键字（TS 4.3+ 支持显式 `override` 标识）。
- **绑定**：**动态绑定**。代码跑在浏览器或 Node 里时，JS 引擎沿着 `__proto__` 链查找实际执行的方法。
- **示例**：

```typescript
class Animal {
	speak(): void {
		console.log('Unknown sound');
	}
}

class Dog extends Animal {
	// 重写父类方法
	override speak(): void {
		console.log('Woof!');
	}
}

// 运行时多态：声明是 Animal，实际 new 的是 Dog
const pet: Animal = new Dog();
pet.speak(); // 输出 "Woof!"（JavaScript 运行时决定）
```

**TypeScript 的特殊性**：这里的 `: Animal` 类型注解在编译后会被删掉。运行时根本不看类型，只看 `pet` 指向的对象是不是 `Dog` 实例。

---

### 2. 参数化多态（泛型）

这是 TypeScript 编译器最强大的功能之一。它让你写出“不限定具体类型”的复用逻辑，编译器在编译期进行类型安全检查。

- **机制**：使用尖括号 `<T>` 定义类型变量。
- **绑定**：**静态绑定（编译时）**。TS 编译器在编译期推断或检查具体类型，确认无误后，泛型标识符 `T` 会被擦除，最终生成没有任何泛型信息的纯 JS 代码。
- **示例**：

```typescript
// 参数化多态：T 代表任意类型
function identity<T>(value: T): T {
	return value;
}

const num = identity<number>(100); // 编译时推断 T = number
const str = identity('hello'); // 编译时推断 T = string
// 生成后的 JS 代码完全一样：function identity(value) { return value; }
```

---

### 3. TypeScript 独有的“结构性子类型”（横跨两者）

这是 TypeScript 区别于 Java/C++ 的核心点。TS 不需要显式声明 `extends`，只要**形状（Shape）匹配**，就自动视为子类型。

- **运行时表现**：只要对象里有对应的方法，就能调用（真正的“鸭子类型”）。
- **编译时表现**：泛型约束可以基于形状。

```typescript
// 无需继承，只要结构一致
class Cat {
	speak() {
		console.log('Meow');
	}
}

function makeItSpeak(animal: { speak(): void }) {
	// 运行时多态的“接口”约束
	animal.speak();
}

// 泛型结合结构类型：约束 T 必须拥有 speak 方法
function callSpeak<T extends { speak(): void }>(item: T): void {
	item.speak();
}

// 传 Cat 进去完全合法，虽然 Cat 没有显式实现任何接口
callSpeak(new Cat());
```

---

### 4. 两者的核心冲突与注意点（TypeScript 避坑）

由于 TypeScript 是 **编译时类型系统 + 运行时擦除**，有一个致命误区你必须留意：

**❌ 错误理解**：用泛型 `<T extends Animal>` 可以让运行时知道 T 是 Animal。
**✅ 正确理解**：泛型只在编译时约束传入的参数。如果你在泛型函数里用 `instanceof T`，**TS 会报错**，因为运行时压根没有 `T` 这个构造器。

```typescript
// 这是错的！运行时报错，因为 T 被擦除了
function bad<T>(arg: T): void {
	// if (arg instanceof T) {} // ❌ 错误：'T' 仅表示类型，但在此处作为值使用
}

// 正确的做法：把构造器作为参数传入（运行时多态和参数化结合）
function good<T>(ctor: new () => T): T {
	return new ctor(); // 运行时执行，编译时确保类型
}
```

---

### 5. 面试/架构中的落地建议（针对 TS 项目）

| 场景                                     | 推荐方案                                                  | 理由                                                                                              |
| :--------------------------------------- | :-------------------------------------------------------- | :------------------------------------------------------------------------------------------------ |
| **业务策略切换**（如不同支付渠道）       | **运行时多态**（类 + 接口）                               | 便于依赖注入，方便单元测试 Mock，且扩展新渠道只需新增子类，不修改旧代码（开闭原则）。             |
| **通用工具函数**（如深拷贝、防抖、排序） | **参数化多态**（泛型）                                    | 极度灵活，保留传入对象的具体类型，避免使用 `any` 导致类型安全丢失。                               |
| **React/Vue 组件 Props**                 | **参数化多态（泛型组件）** + **联合类型**                 | 让使用者传入的类型自动推导出组件内部逻辑，提升开发体验（IDE 智能提示）。                          |
| **需要做 `typeof` 或 `instanceof` 判断** | **不用泛型，改用** **类型守卫**（`is`）或**区分联合类型** | 因为运行时类型信息是 JS 原生提供的，泛型帮不上忙，要用 `typeof value === 'string'` 这种原生方式。 |

### 一句话总结 TypeScript 版

> **运行时多态**决定了“这个对象在浏览器/Node 内存里到底怎么调用方法”（靠原型链）；**参数化多态**决定了“开发者写代码时，VSCode 会不会飘红报错”（靠泛型检查）。两者在 TS 中是完全解耦的——**泛型在编译完成后就“死掉”了，而运行时的多态才刚刚“活过来”**。

如果你正在封装一个通用 Hook（React）或装饰器，需要我给出一个“泛型 + 运行时策略”结合使用的复杂代码模板吗？我可以当场写一段给你参考。😊
