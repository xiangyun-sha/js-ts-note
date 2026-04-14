# 标准库 · 集合类 · TypedArray

[TOC]

---

`TypedArray`（类型化数组）是 JavaScript 中用于处理二进制数据的一套对象。它提供了一种机制，能够以特定的数据类型（如 8 位整数、32 位浮点数等）来读取和写入原始的二进制内存缓冲区。与普通的 `Array` 不同，`TypedArray` 并非一个全局属性，而是一个涵盖多种具体数据类型的总称，例如 `Int8Array`、`Uint8Array`、`Float32Array` 等。它们在 WebGL、文件操作、网络协议、音频视频处理等需要高性能和精细内存控制的场景中至关重要。

---

## 1. 概述

### 1.1 为什么需要 TypedArray？

普通的 JavaScript 数组非常灵活，可以存储任何类型的数据，并且可以动态调整大小。但这种灵活性是以额外的内存开销和性能损耗为代价的。在处理二进制数据（如文件、Canvas 像素、WebSocket 二进制帧）时，我们需要一种更接近底层硬件的数据结构，它必须满足：

- **内存连续且固定大小**：直接操作内存，提高读写速度。
- **数据类型确定**：每个元素在内存中占据固定的字节数，无类型转换开销。
- **与底层 API 无缝对接**：如 WebGL、Web Audio、WebSocket 等 API 都直接使用或可以转换为类型化数组。

`TypedArray` 正是为此而生。

### 1.2 核心概念：ArrayBuffer 与 视图

理解 `TypedArray` 必须掌握两个核心角色：**`ArrayBuffer`** 和 **视图**。

- **`ArrayBuffer`**：代表一个原始的、固定长度的二进制数据缓冲区。它本身不能直接读写，可以理解为一块“空白内存”。
- **视图**：提供解释这块内存的方式。`TypedArray` 就是一种视图，它告诉你如何读写这块内存（例如，把每 2 个字节解释为一个有符号 16 位整数）。`DataView` 是另一种更灵活的视图。

**关系类比**：可以把 `ArrayBuffer` 想象成一块画布（原始内存），而 `TypedArray` 是一把特殊的尺子（视图），它规定了画布上每一格的大小（`Int8`、`Float32` 等），让你可以按规则去绘制或读取点。

### 1.3 抽象类 TypedArray

严格来说，`TypedArray` 不是一个可以直接使用的全局构造函数，而是一个代表所有类型化数组的“抽象类”。它定义了所有具体类型化数组共享的属性和方法。我们可以通过 `Object.getPrototypeOf(Int8Array)` 访问到它。

```javascript
// 不存在全局的 TypedArray 构造函数
console.log(typeof TypedArray); // "undefined"

// 但我们可以获取它的“抽象类”
const TypedArrayProto = Object.getPrototypeOf(Int8Array);
console.log(TypedArrayProto.name); // "TypedArray"
```

我们实际使用的是它的具体子类，如 `Uint8Array`、`Int16Array` 等。

---

## 2. 类型化数组的具体类型

JavaScript 提供了多种类型化数组，每种都有固定的元素类型和字节大小 。

| 类型 | 元素类型 | 字节大小 | 值范围 | 描述 | 典型用途 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`Int8Array`** | 8 位有符号整数 | 1 | -128 ~ 127 | 二进制补码 | 小范围有符号整数 |
| **`Uint8Array`** | 8 位无符号整数 | 1 | 0 ~ 255 | 直接二进制 | **原始字节流、网络协议、文件头** |
| **`Uint8ClampedArray`** | 8 位无符号整数 (钳位) | 1 | 0 ~ 255 | 超出范围的值被钳位到边界 | **Canvas 像素处理 (ImageData)** |
| **`Int16Array`** | 16 位有符号整数 | 2 | -32768 ~ 32767 | 二进制补码 | **音频样本 (16-bit PCM)** |
| **`Uint16Array`** | 16 位无符号整数 | 2 | 0 ~ 65535 | 直接二进制 | 大范围无符号计数 |
| **`Int32Array`** | 32 位有符号整数 | 4 | -2147483648 ~ 2147483647 | 二进制补码 | 大范围有符号整数 |
| **`Uint32Array`** | 32 位无符号整数 | 4 | 0 ~ 4294967295 | 直接二进制 | 位掩码、大范围无符号计数 |
| **`Float32Array`** | 32 位浮点数 | 4 | ~3.4E38 (7 位有效数字) | IEEE 754 | **3D 坐标、浮点计算** |
| **`Float64Array`** | 64 位浮点数 | 8 | ~1.8E308 (16 位有效数字) | IEEE 754 | 高精度浮点计算 |
| **`BigInt64Array`** | 64 位有符号整数 | 8 | -2^63 ~ 2^63-1 | 二进制补码 | 超大整数 |
| **`BigUint64Array`** | 64 位无符号整数 | 8 | 0 ~ 2^64-1 | 直接二进制 | 超大无符号整数 |

**关键点**：

- `Uint8Array` 是最基础的字节视图，直接对应 `ArrayBuffer` 的每个字节。
- `Uint8ClampedArray` 是 Canvas 绘制中的特殊类型，当赋值超出 0-255 范围时，它会自动钳位到边界值（例如 300 变成 255，-10 变成 0），而不是截断高位。
- 多字节类型（如 `Int16Array`）的字节顺序（大小端）遵循平台的本地字节序 。

---

## 3. 创建 TypedArray

创建类型化数组有多种方式，最常用的是基于 `ArrayBuffer` 创建，也可以从普通数组或可迭代对象创建。

### 3.1 通过构造函数

所有具体类型的构造函数都支持以下几种参数形式 ：

```javascript
// 1. 创建一个指定长度的类型化数组（内部自动创建 ArrayBuffer）
const int8 = new Int8Array(8);         // 长度为 8 的 Int8Array，元素初始为 0
const float32 = new Float32Array(4);   // 长度为 4 的 Float32Array，初始为 0.0

// 2. 从另一个类型化数组创建（复制元素）
const original = new Uint8Array([1, 2, 3]);
const copy = new Uint8Array(original); // 新的 Uint8Array，内容为 [1, 2, 3]

// 3. 从类数组对象或可迭代对象创建
const fromArray = new Uint16Array([10, 20, 30]);        // Uint16Array [10, 20, 30]
const fromSet = new Uint8Array(new Set([5, 6, 7]));     // Uint8Array [5, 6, 7]

// 4. 基于现有的 ArrayBuffer 创建视图（核心用法）
const buffer = new ArrayBuffer(16); // 创建一个 16 字节的缓冲区

// 将整个 buffer 视为 16 个无符号 8 位整数
const view1 = new Uint8Array(buffer);

// 从 buffer 的字节偏移 8 开始，创建一个长度为 4 的 Int32Array 视图
const view2 = new Int32Array(buffer, 8, 2); // 注意：Int32Array 每个元素 4 字节，所以 2 个元素占 8 字节
```

**重要规则**：当使用 `buffer` 和 `byteOffset` 创建视图时，`byteOffset` 必须是对应类型元素大小的整数倍（例如 `Int32Array` 必须是 4 的倍数），这是内存对齐的要求 。

### 3.2 静态工厂方法

所有类型化数组子类都提供了与 `Array` 类似的静态方法 。

- **`TypedArray.from(arrayLike, mapFn?, thisArg?)`**：从类数组对象或可迭代对象创建新的类型化数组。

  ```javascript
  const arr = Uint8Array.from([1, 2, 3]);             // Uint8Array [1, 2, 3]
  const mapped = Int16Array.from([1, 2, 3], x => x * 2); // Int16Array [2, 4, 6]
  const fromString = Uint8Array.from("hello");        // 字符串可迭代，得到 [104, 101, 108, 108, 111]
  ```

- **`TypedArray.of(element0, element1, ...)`**：用可变数量的参数创建新的类型化数组。

  ```javascript
  const float32 = Float32Array.of(3.14, 2.71, 1.41); // Float32Array [3.14, 2.71, 1.41]
  const ints = Int8Array.of(10, 20, 30);            // Int8Array [10, 20, 30]
  ```

---

## 4. 实例属性

所有类型化数组实例共享以下属性 ：

- **`buffer`**：返回该类型化数组所引用的底层 `ArrayBuffer` 对象。
- **`byteLength`**：返回从开始偏移到结束的字节长度。
- **`byteOffset`**：返回该类型化数组从底层 `ArrayBuffer` 起始处的字节偏移量。
- **`length`**：返回数组中元素的个数。

```javascript
const buffer = new ArrayBuffer(20);
const view = new Int32Array(buffer, 4, 3); // 每个 Int32 4 字节，共 12 字节

console.log(view.buffer);       // ArrayBuffer(20)
console.log(view.byteLength);   // 12
console.log(view.byteOffset);   // 4
console.log(view.length);       // 3
console.log(view.BYTES_PER_ELEMENT); // 4 (来自构造函数的静态属性)
```

---

## 5. 实例方法

类型化数组继承了 `%TypedArray%.prototype` 上的方法，这些方法与普通 `Array` 的方法非常相似，但处理的是固定类型的数据。

### 5.1 类似 Array 的方法

大多数 `Array` 的实例方法在类型化数组上都有对应的版本，行为基本一致，但返回的仍然是类型化数组 。

- **迭代方法**：`forEach`、`map`、`filter`、`some`、`every`、`find`、`findIndex` 等。
- **修改方法**：`reverse`、`fill`、`copyWithin`、`sort`（注意默认也是按字符串排序，需提供比较函数）。
- **访问方法**：`slice`、`subarray`（类似 `slice` 但返回新的视图引用同一缓冲区）、`join`、`indexOf`、`lastIndexOf`、`includes`。
- **迭代器**：`keys`、`values`、`entries`，以及 `[Symbol.iterator]` 方法，使其可被 `for...of` 循环遍历。

```javascript
const uint8 = new Uint8Array([10, 20, 30, 40]);

// 使用 map 返回新的类型化数组
const doubled = uint8.map(x => x * 2); // Uint8Array [20, 40, 60, 80]

// 使用 for...of 遍历
for (const value of uint8.values()) {
  console.log(value); // 10, 20, 30, 40
}

// 使用 subarray 创建子视图
const sub = uint8.subarray(1, 3); // Uint8Array [20, 30] (引用同一 buffer)
sub[0] = 99;
console.log(uint8[1]); // 99，原数组也被修改
```

**重要区别**：类型化数组的 `map` 返回的是相同类型的类型化数组，并且会自动处理值的溢出（见下文）。

### 5.2 与 Array 方法的细微差异

尽管方法名相同，但 `TypedArray` 的实现与 `Array` 存在一些底层差异，例如规范中 `indexOf` 的具体步骤略有不同，但由于操作的确定性，实际行为一致 。更重要的是，类型化数组的方法**不会创建稀疏数组**，始终是密集的 。

---

## 6. 值编码、溢出与标准化

类型化数组对数值的存储有明确的规则，理解这些规则对于避免 bug 至关重要 。

### 6.1 整数的溢出处理

当向整数类型化数组赋值一个超出范围的值时，**不会抛出错误**，而是进行**固定宽度数值转换**：首先截断小数部分，然后取最低有效位（相当于对 2^(字节长度*8) 取模）。

```javascript
const uint8 = new Uint8Array(1);
uint8[0] = 300;     // 300 的二进制是 100101100，取最低 8 位 -> 00101100 (44)
console.log(uint8[0]); // 44

const int8 = new Int8Array(1);
int8[0] = 128;      // 对于有符号 8 位，128 超出了 -128~127，取模后得到 -128
console.log(int8[0]); // -128
```

### 6.2 浮点数的舍入

`Float32Array` 在存储 64 位 JavaScript Number 时，会进行“四舍五入到最近偶数”的转换，这与 `Math.fround()` 相同 。

```javascript
const float32 = new Float32Array(1);
float32[0] = 0.1;   // 0.1 无法精确表示为二进制浮点数
console.log(float32[0]); // 0.10000000149011612 (32 位精度版本)
```

### 6.3 Uint8ClampedArray 的特殊性

`Uint8ClampedArray` 采用**钳位**而非取模：小于 0 的值变为 0，大于 255 的值变为 255，并对 0.5 这样的边界值采用“四舍五入到最近偶数” 。

```javascript
const clamped = new Uint8ClampedArray(1);
clamped[0] = 300;   // 钳位到 255
console.log(clamped[0]); // 255
clamped[0] = -10;   // 钳位到 0
console.log(clamped[0]); // 0
clamped[0] = 1.5;   // 1.5 介于 1 和 2 之间，舍入到最近的偶数 2
console.log(clamped[0]); // 2
```

---

## 7. 与 ArrayBuffer 和 DataView 的关系

- **`ArrayBuffer`**：原始的二进制数据容器。
- **`TypedArray`**：提供**结构化视图**，每个元素类型固定，适合批量处理同类型数据。
- **`DataView`**：提供**底层接口**，允许你以任意字节偏移和任意字节序（大小端）读取和写入多种数据类型。当你需要处理包含混合类型或指定字节序的复杂二进制格式（如文件头）时，`DataView` 是更合适的选择 。

```javascript
const buffer = new ArrayBuffer(6);
const uint8View = new Uint8Array(buffer);
uint8View.set([0x48, 0x65, 0x6c, 0x6c, 0x6f, 0x00]); // "Hello\0"

const dataview = new DataView(buffer);
// 以小端序读取前两个字节作为一个 16 位整数
const firstInt16 = dataview.getInt16(0, true); // true 表示小端序
console.log(firstInt16.toString(16)); // "6548" (因为小端序：0x48 是低位，0x65 是高位)
```

---

## 8. 典型应用场景

### 8.1 网络通信与文件操作

- **WebSocket** 接收二进制数据时，通常在 `message` 事件中获取 `Blob` 或 `ArrayBuffer`，然后使用 `Uint8Array` 解析自定义协议头 。
- **File API**：通过 `FileReader.readAsArrayBuffer()` 读取文件，然后用 `Uint8Array` 分析文件签名或内容。

### 8.2 图像与图形处理

- **Canvas**：`ImageData.data` 是一个 `Uint8ClampedArray`，包含 RGBA 四个通道的像素值，每个值范围 0-255 。
- **WebGL**：顶点数据、索引数据、纹理数据通常以 `Float32Array` 或 `Uint16Array` 的形式传递给 GPU。

### 8.3 音频处理

- **Web Audio API**：音频样本数据通常以 `Float32Array` 表示（范围 -1.0 到 1.0）。
- **PCM 数据**：16 位 PCM 音频文件可以直接映射到 `Int16Array` 进行处理 。

### 8.4 高性能计算

- 当需要对大量数值进行快速运算时，使用类型化数组可以减少类型转换开销，并利用 CPU 的 SIMD 指令（通过某些 API）。

---

## 9. 注意事项与最佳实践

### 9.1 避免意外溢出

由于类型化数组在溢出时不会报错，在关键业务中应自行验证值的范围，尤其是在从外部输入赋值时。

### 9.2 内存对齐

在从 `ArrayBuffer` 创建多字节类型视图时，确保 `byteOffset` 是元素字节大小的整数倍，否则会抛出 `RangeError` 。

### 9.3 字节序问题

类型化数组始终使用平台的本地字节序。如果你需要处理网络字节序（大端序）或特定格式的数据，请使用 `DataView` 。

### 9.4 视图生命周期与内存释放

类型化数组只是视图，只要存在对 `ArrayBuffer` 的任何引用，该缓冲区就不会被垃圾回收。如果不再需要整个缓冲区，应解除所有视图的引用。

### 9.5 使用 `subarray` 而非 `slice` 提高性能

如果你需要一个子集但不希望复制数据，使用 `subarray` 创建新视图，它共享同一个缓冲区，效率极高 。`slice` 会复制元素到新的缓冲区。

### 9.6 与普通 Array 的互操作

- 如果需要将类型化数组转为普通数组，可以使用 `Array.from(typedArray)` 或 `[...typedArray]`。
- 如果需要将普通数组传给期望类型化数组的 API，可以通过 `TypedArray.from(array)` 快速转换，但注意这可能涉及内存复制。

---

## 小结

`TypedArray` 是 JavaScript 通往高性能和二进制世界的大门。本章我们学习了：

- 它和 `ArrayBuffer` 的关系：`ArrayBuffer` 是原始内存，`TypedArray` 是固定类型的视图。
- 所有具体的类型化数组及其适用场景。
- 五种创建方式：构造函数（指定长度、复制、从对象、基于 buffer）、静态方法 `from` 和 `of`。
- 共享的实例属性和与 `Array` 类似的方法集。
- 值溢出和标准化的行为规则。
- 与 `DataView` 的分工协作。
- 丰富的实战应用和注意事项。

掌握 `TypedArray`，你将能自信地处理文件、网络、图形和音频数据，编写出更接近底层的、高效的 JavaScript 代码。
