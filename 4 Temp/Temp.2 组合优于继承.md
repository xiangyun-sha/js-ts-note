# 面向对象设计原则 · 组合优于继承

**组合优于继承**（Composition Over Inheritance）是面向对象设计中的一个重要原则，它提倡通过组合对象（即在一个对象中引用其他对象）来获得功能复用和扩展性，而不是通过继承来建立类之间的层级关系。这一原则并非否定继承，而是提醒我们，在许多场景下，组合比继承更灵活、更可维护。

---

## 1. 为什么“组合优于继承”？

### 1.1 继承的缺点

继承虽然能实现代码复用和层次化，但也带来了一些固有问题：

- **脆弱的基类**：基类的修改可能意外影响所有子类，导致不可预知的行为（“脆弱的基类问题”）。
- **继承层级过深**：随着系统演进，继承树可能变得庞大而复杂，难以理解和维护。
- **不合理的耦合**：子类与父类紧密耦合，父类的实现细节暴露给子类，破坏了封装性。
- **代码复用受限**：继承是静态的，在编译/解释时就确定了关系，无法在运行时改变行为。
- **语义上的误用**：子类可能并不完全符合父类的语义，只是为了复用方法而继承（如 `Stack` 继承 `ArrayList`）。

### 1.2 组合的优点

组合通过将多个独立对象组合成一个更复杂的对象，具有以下优势：

- **更好的封装**：组合的对象之间通过接口交互，内部实现彼此隐藏。
- **动态行为**：可以在运行时替换或添加组件，改变对象行为（策略模式、装饰器模式等）。
- **更高的复用性**：任何组件都可以被多个组合对象复用，不依赖具体继承结构。
- **更清晰的职责划分**：每个类只关注自己的核心功能，通过组合实现复杂功能，符合单一职责原则。
- **测试友好**：可以轻松地模拟组件进行单元测试。

---

## 2. 组合与继承的对比

| 维度       | 继承                                 | 组合                                   |
| ---------- | ------------------------------------ | -------------------------------------- |
| 关系类型   | “is-a” 关系                          | “has-a” 关系                           |
| 耦合度     | 高（子类依赖父类实现）               | 低（仅依赖接口）                       |
| 复用粒度   | 类级别，可复用父类所有代码           | 对象级别，可灵活组合不同组件           |
| 运行时变化 | 不支持，继承关系静态固定             | 支持，可在运行时替换组件               |
| 代码可读性 | 层次清晰，但层级深时理解困难         | 扁平化，功能由组合关系描述，可能更直观 |
| 适用场景   | 强层次结构，子类确实是父类的一种特例 | 功能需要灵活组合，或避免单继承限制     |

---

## 3. 如何在 JavaScript 中实现组合

JavaScript 作为多范式语言，提供了多种实现组合的方式：

### 3.1 对象字面量组合

最简单的方式是将其他对象的引用作为属性。

```javascript
const logger = {
  log(message) {
    console.log(`[LOG] ${message}`);
  }
};

const fileReader = {
  readFile(path) {
    return `content of ${path}`;
  }
};

const fileProcessor = {
  logger,          // 组合 logger
  fileReader,      // 组合 fileReader
  process(path) {
    const content = this.fileReader.readFile(path);
    this.logger.log(`File read: ${path}`);
    return content;
  }
};

fileProcessor.process('data.txt');
```

### 3.2 工厂函数组合

通过工厂函数动态组装对象。

```javascript
function createLogger() {
  return {
    log(message) { console.log(message); }
  };
}

function createFileReader() {
  return {
    read(path) { /* ... */ }
  };
}

function createFileProcessor() {
  const logger = createLogger();
  const reader = createFileReader();
  return {
    process(path) {
      const content = reader.read(path);
      logger.log(`Processed ${path}`);
      return content;
    }
  };
}
```

### 3.3 类与构造函数组合

在类中通过构造函数参数或属性注入依赖对象。

```javascript
class Logger {
  log(message) { console.log(message); }
}

class FileReader {
  read(path) { /* ... */ }
}

class FileProcessor {
  constructor(logger, reader) {
    this.logger = logger;
    this.reader = reader;
  }
  process(path) {
    const content = this.reader.read(path);
    this.logger.log(`Processed ${path}`);
    return content;
  }
}

const processor = new FileProcessor(new Logger(), new FileReader());
processor.process('data.txt');
```

### 3.4 Mixin 模式

将多个对象的方法混入目标对象，实现多继承的效果。

```javascript
const canLog = {
  log(message) { console.log(message); }
};

const canRead = {
  read(path) { return `content`; }
};

class FileProcessor {
  constructor() {
    Object.assign(this, canLog, canRead);
  }
  process(path) {
    const content = this.read(path);
    this.log(`Processed ${path}`);
    return content;
  }
}
```

### 3.5 高阶函数与装饰器

通过高阶函数包装对象，动态添加行为。

```javascript
function withLogging(processor) {
  return {
    ...processor,
    process(path) {
      console.log(`Start processing ${path}`);
      const result = processor.process(path);
      console.log(`Finished processing ${path}`);
      return result;
    }
  };
}

const baseProcessor = { process(path) { return `content`; } };
const enhancedProcessor = withLogging(baseProcessor);
enhancedProcessor.process('data.txt');
```

---

## 4. 实际应用场景

### 4.1 策略模式

通过组合不同的策略对象，改变算法行为。

```javascript
class ShippingCost {
  constructor(strategy) {
    this.strategy = strategy;  // 组合策略对象
  }
  calculate(parcel) {
    return this.strategy.calculate(parcel);
  }
}

// 策略对象
const fedexStrategy = { calculate: (p) => p.weight * 2 };
const upsStrategy = { calculate: (p) => p.weight * 2.5 };

const parcel = { weight: 10 };
const shipping = new ShippingCost(fedexStrategy);
console.log(shipping.calculate(parcel)); // 20
```

### 4.2 装饰器模式

通过组合动态添加职责。

```javascript
class Coffee {
  cost() { return 5; }
}

function withMilk(coffee) {
  return {
    cost() { return coffee.cost() + 2; }
  };
}

function withSugar(coffee) {
  return {
    cost() { return coffee.cost() + 1; }
  };
}

let myCoffee = new Coffee();
myCoffee = withMilk(myCoffee);
myCoffee = withSugar(myCoffee);
console.log(myCoffee.cost()); // 8
```

### 4.3 React 中的组合

React 推荐使用组合而非继承来复用组件功能。

```jsx
function FancyBorder(props) {
  return (
    <div className={'FancyBorder ' + props.color}>
      {props.children}
    </div>
  );
}

function WelcomeDialog() {
  return (
    <FancyBorder color="blue">
      <h1>Welcome</h1>
      <p>Thank you for visiting!</p>
    </FancyBorder>
  );
}
```

---

## 5. 何时使用继承？

虽然组合优先，但继承并非一无是处。继承适合以下场景：

- **真正的 “is-a” 关系**：子类确实是父类的一种特例，且不会变化。
- **基类提供了稳定的、通用的行为**，子类只需少量定制。
- **框架或库要求继承**（如 React 早期的 `React.Component`）。

即使在这些情况下，也应保持继承层次浅而稳定。

---

## 6. 组合优于继承的 JavaScript 实践

- **优先使用对象组合**：通过属性持有其他对象。
- **使用工厂函数或依赖注入**：让对象可以灵活组装。
- **利用 JavaScript 的动态特性**：在运行时添加、替换行为。
- **考虑使用 Mixin 或高阶函数**：实现横切关注点（如日志、缓存）的复用。
- **在 React 等框架中遵循组合模式**：使用 children、render props 或 hooks 而非继承。

---

## 7. 总结

“组合优于继承”是一个经过实践检验的设计原则，它倡导通过组装小型、独立的组件来构建系统，而不是依赖脆弱的继承体系。在 JavaScript 中，由于其动态特性和丰富的语言特性，组合尤为自然和强大。掌握这一原则，你将能设计出更灵活、可维护的代码。

但需注意，原则不是教条。继承在适当的场合仍有其价值。关键是理解每种方式的权衡，根据实际需求做出明智的选择。

---

**扩展阅读**：本体系后续章节的“设计模式”将大量运用组合思想（策略、装饰器、组合模式等），届时可深入体会组合的威力。
