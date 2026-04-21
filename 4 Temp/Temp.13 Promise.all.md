## Promise.all 使用最佳范式与实现

`Promise.all` 用于**并行执行多个异步任务**，并等待所有任务完成（或任意一个失败）。在前端开发中非常常见，例如批量请求、并发处理数据等。

下面从最佳实践角度总结其使用范式，并结合前面代码案例说明。

---

### 一、核心范式

#### 1. 基本结构
```typescript
async function fetchAllData() {
  const promises = items.map(item => someAsyncFunction(item));
  const results = await Promise.all(promises);
  // results 是按原顺序存放的每个 Promise 的 resolve 值
  return results;
}
```

#### 2. 典型模式：批量请求并合并数据
```typescript
// 并发获取多个点的数据
const requestArr = points.map(point => 
  getAPiPoint({ layerName: point.layer, lat: point.lat, lon: point.lon })
);
const responses = await Promise.all(requestArr);
const data = responses.map(res => res.data);
```

#### 3. 结合数据转换（保持顺序）
```typescript
const items = series.series;
const requestArr = items.map(item => fetch(item.url));
const responses = await Promise.all(requestArr);
const enrichedData = items.map((item, idx) => ({
  ...item,
  value: responses[idx].data
}));
```

---

### 二、错误处理最佳实践

#### 1. 全局 try-catch 捕获任意失败
```typescript
try {
  const results = await Promise.all(promises);
  // 所有成功
} catch (error) {
  // 任何一个 Promise 被 reject 就会立即进入 catch，其他请求可能仍在进行但结果被忽略
  console.error('至少一个请求失败', error);
}
```

#### 2. 使用 Promise.allSettled 实现部分容错（推荐）
当需要“全部完成，但允许某些失败”时使用：
```typescript
const settled = await Promise.allSettled(promises);
const results = settled.map(result => 
  result.status === 'fulfilled' ? result.value : null
);
// 过滤掉失败的 null 值，或保留并后续处理
```

**适用场景**：多个独立请求，某个失败不应影响其他数据的展示。

#### 3. 在失败时回退默认值
```typescript
const results = await Promise.all(
  promises.map(p => p.catch(error => ({ error, default: null })))
);
```

---

### 三、性能与并发控制

#### 1. 避免串行误用
❌ 错误：`for...of` + `await` 导致串行执行
```typescript
for (const item of items) {
  const res = await fetch(item); // 一个一个等
}
```
✅ 正确：`Promise.all` 并行
```typescript
await Promise.all(items.map(item => fetch(item)));
```

#### 2. 限制并发数量（防压垮服务器）
当任务数量极大（如数百个请求）时，应使用并发限制库或手写限流。
```typescript
// 使用 p-limit 库
import pLimit from 'p-limit';
const limit = pLimit(5); // 最多5个并发
const tasks = items.map(item => limit(() => fetch(item)));
const results = await Promise.all(tasks);
```

#### 3. 大数组分批处理
```typescript
const batchSize = 10;
for (let i = 0; i < allItems.length; i += batchSize) {
  const batch = allItems.slice(i, i + batchSize);
  const batchResults = await Promise.all(batch.map(item => process(item)));
  // 累积结果...
}
```

---

### 四、与其他 Promise 方法的对比选择

| 方法 | 行为 | 适用场景 |
|------|------|----------|
| `Promise.all` | 任一失败则整体失败 | 强依赖所有结果，缺少任何一个都不能继续 |
| `Promise.allSettled` | 等待全部完成，收集每个的状态 | 独立任务，可部分失败 |
| `Promise.race` | 返回最快完成的那个结果 | 超时控制、竞速 |
| `Promise.any` | 返回第一个成功的，忽略失败 | 多个后备服务，只要一个可用 |

---

### 五、在 Vue 组件中的最佳实践（结合你的代码）

#### 1. 避免在 watch 中直接调用未就绪的 Promise.all
你的问题中 `timeSeriesRef` 为 undefined 是因为异步数据未就绪。应使用 **守卫条件** 或 **在数据就绪后再触发**。
```typescript
// ✅ 推荐：数据就绪后再执行
if (this.timeSeriesRef && this.axisTypeRef === 'time-sequence') {
  await this.handleAxisChange(lnglat, this.timeSeriesRef);
}
```

#### 2. 使用 loading 状态 + try-finally
```typescript
async handleAxisChange(...) {
  this.loading = true;
  try {
    const tasks = timeSeries.map(item => this.getPointValue(item, lnglat));
    const resultList = await Promise.all(tasks);
    // 更新图表...
  } catch (error) {
    KqMessage.error('数据加载失败');
  } finally {
    this.loading = false;
  }
}
```

#### 3. 对单个 getPointValue 内部也使用 Promise.all（你已经做了）
```typescript
async getPointValue(series, lnglat) {
  const requestArr = series.series.map(item => getAPiPoint(...));
  const responses = await Promise.all(requestArr);  // 并行请求该天所有时次
  return responses.map((res, idx) => ({ realTime: series.series[idx].realTime, value: res.data }));
}
```

---

### 六、常见陷阱与注意事项

1. **空数组**：`Promise.all([])` 立即 resolve 为空数组，不会报错。
2. **非 Promise 值**：数组中若包含非 Promise 值，会原样放入结果。
3. **内存**：同时发起过多请求可能导致内存激增，使用并发限制。
4. **顺序保证**：`Promise.all` 保证结果顺序与输入顺序一致，无需额外处理。
5. **取消请求**：`Promise.all` 不支持中途取消，若需取消需配合 AbortController。

---

### 七、封装工具函数示例

```typescript
// 通用批量请求（带错误回退）
async function batchRequest<T, R>(
  items: T[],
  fetcher: (item: T) => Promise<R>,
  fallback?: R
): Promise<R[]> {
  const promises = items.map(item => fetcher(item).catch(() => fallback));
  return Promise.all(promises);
}

// 使用
const results = await batchRequest(points, point => getAPiPoint(point), null);
```

---

### 八、总结思维导图

```
Promise.all 最佳实践
├── 基本范式：map → Promise.all → 解构结果
├── 错误处理
│   ├── try-catch（整体失败）
│   └── allSettled（部分容错）
├── 性能
│   ├── 并行化（避免串行）
│   ├── 限制并发（p-limit）
│   └── 分批处理（大数据）
├── 集成到组件
│   ├── loading 状态管理
│   ├── 数据就绪守卫
│   └── finally 清理
└── 陷阱提醒
    ├── 顺序依赖
    ├── 空数组
    └── 取消请求
```

掌握这些范式后，你可以写出健壮、高效的并发异步代码，避免常见的时序和错误处理问题。