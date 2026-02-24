# structure

```bash
前端基础技术体系
├─ 一、HTML（超文本标记语言）
│   ├─ 1. 文档结构
│   │   ├─ ⚙️ DOCTYPE 声明：<!DOCTYPE html>（文档类型，必须首行）
│   │   ├─ 📦 <html>：根元素（lang 属性）
│   │   ├─ 📋 <head>：元数据容器
│   │   │   ├─ <meta>（字符集、视口、描述等）
│   │   │   ├─ <title>（页面标题）
│   │   │   ├─ <link>（外部资源，CSS、图标）
│   │   │   ├─ <style>（内部样式）
│   │   │   ├─ <script>（脚本，可置于 head 或 body）
│   │   │   └─ <base>（基准 URL）
│   │   └─ 🖼️ <body>：可见内容容器
│   │
│   ├─ 2. 元素（按语义/功能分类）
│   │   ├─ 🔖 文档元数据（已归入 head）
│   │   ├─ 🧱 内容分区（结构化布局）
│   │   │   ├─ <header>, <footer>, <nav>, <main>
│   │   │   ├─ <section>, <article>, <aside>
│   │   │   └─ <h1>~<h6>, <address>
│   │   ├─ 📄 文本内容
│   │   │   ├─ <p>, <hr>, <pre>, <blockquote>
│   │   │   ├─ <ol>, <ul>, <li>, <dl>, <dt>, <dd>
│   │   │   ├─ <figure>, <figcaption>, <div>
│   │   │   └─ <main>（也属于分区）
│   │   ├─ ✍️ 内联文本语义
│   │   │   ├─ <a>, <span>, <br>, <wbr>
│   │   │   ├─ <strong>, <em>, <b>, <i>, <u>, <s>, <small>
│   │   │   ├─ <abbr>, <cite>, <code>, <sub>, <sup>
│   │   │   ├─ <time>, <mark>, <ruby>, <rt>, <rp>
│   │   │   └─ <q>, <dfn>, <kbd>, <samp>, <var>
│   │   ├─ 🖼️ 图像与多媒体
│   │   │   ├─ <img>, <picture>, <source>
│   │   │   ├─ <audio>, <video>, <track>
│   │   │   └─ <map>, <area>
│   │   ├─ 📦 嵌入内容
│   │   │   ├─ <iframe>, <embed>, <object>, <param>
│   │   │   ├─ <svg>（矢量图）
│   │   │   └─ <math>（数学公式）
│   │   ├─ 🧩 脚本与模板
│   │   │   ├─ <script>, <noscript>
│   │   │   ├─ <canvas>（位图绘图）
│   │   │   └─ <template>, <slot>（Web Components）
│   │   ├─ 📊 表格元素
│   │   │   ├─ <table>, <caption>
│   │   │   ├─ <thead>, <tbody>, <tfoot>
│   │   │   ├─ <tr>, <th>, <td>
│   │   │   └─ <colgroup>, <col>
│   │   ├─ 📝 表单元素
│   │   │   ├─ <form>, <fieldset>, <legend>, <label>
│   │   │   ├─ <input>（20+ type），<textarea>, <select>, <option>, <optgroup>
│   │   │   ├─ <button>, <datalist>, <output>
│   │   │   └─ <progress>, <meter>
│   │   └─ 🎛️ 交互元素
│   │       ├─ <details>, <summary>
│   │       ├─ <dialog>
│   │       └─ <menu>（较新）
│   │
│   ├─ 3. 属性（修饰元素）
│   │   ├─ 🌐 全局属性
│   │   │   ├─ id, class, style, title
│   │   │   ├─ lang, dir, hidden, tabindex
│   │   │   ├─ contenteditable, draggable, spellcheck, translate
│   │   │   └─ data-*（自定义数据）
│   │   ├─ ⚡ 事件属性（on*）
│   │   │   ├─ 鼠标：onclick, onmouseover, onmouseout
│   │   │   ├─ 键盘：onkeydown, onkeyup
│   │   │   ├─ 表单：onsubmit, onchange, oninput, onfocus, onblur
│   │   │   ├─ 文档/窗口：onload, onresize, onscroll
│   │   │   ├─ 拖拽：ondrag, ondrop
│   │   │   └─ 媒体：onplay, onpause, onended
│   │   ├─ 🧾 专用属性（按元素）
│   │   │   ├─ 链接/嵌入：<a href target>，<img src alt>，<iframe src>，<script src> 等
│   │   │   ├─ 表单：<input type name value>，<select>，<option>，<button>，<label for> 等
│   │   │   ├─ 表格：<td colspan rowspan>，<th scope>
│   │   │   └─ 媒体：<video controls autoplay>，<source src> 等
│   │   ├─ ✅ 布尔属性（出现即生效）
│   │   │   ├─ disabled, readonly, required, checked, selected, multiple
│   │   │   ├─ autofocus, hidden, controls, autoplay, loop, muted
│   │   │   └─ async, defer, nomodule, novalidate
│   │   ├─ ♿ ARIA/无障碍属性
│   │   │   ├─ role
│   │   │   ├─ aria-label, aria-labelledby, aria-describedby
│   │   │   └─ aria-hidden, aria-expanded, aria-checked, aria-selected 等
│   │   └─ 🔍 微数据/SEO
│   │       └─ itemprop, itemscope, itemtype
│   │
│   └─ 4. 其他语法
│       ├─ 💬 注释：<!-- ... -->（浏览器忽略）
│       ├─ 🔣 字符引用
│       │   ├─ &实体名;（如 &lt;、&amp;、&copy;）
│       │   └─ &#十进制; / &#x十六进制;（如 &#169;）
│       ├─ 📦 CDATA 节：<![CDATA[ ... ]]>（仅 XHTML，避免转义）
│       └─ ⚙️ 处理指令：<? ... ?>（如 <?php ?>，服务端解析）
│
├─ 二、CSS（层叠样式表）
│   ├─ 1. 基本结构与机制
│   │   ├─ 📐 语法规则：选择器 { 属性: 值; }
│   │   ├─ 📥 引入方式
│   │   │   ├─ 外部：<link rel="stylesheet" href="...">
│   │   │   ├─ 内部：<style> ... </style>
│   │   │   └─ 内联：style="属性: 值;"
│   │   ├─ 💬 注释：/* ... */
│   │   └─ ⚖️ 层叠与继承
│   │       ├─ 层叠：!important > 内联 > ID > 类/伪类 > 标签 > 通配符
│   │       └─ 继承：部分属性（字体、颜色等）自动继承
│   │
│   ├─ 2. 选择器（定位元素）
│   │   ├─ 🎯 基础选择器
│   │   │   ├─ 通配符：*
│   │   │   ├─ 标签：div
│   │   │   ├─ 类：.class
│   │   │   ├─ ID：#id
│   │   │   └─ 属性：[type="text"]
│   │   ├─ 🔗 组合选择器
│   │   │   ├─ 后代：div p
│   │   │   ├─ 子代：div > p
│   │   │   ├─ 相邻兄弟：h1 + p
│   │   │   ├─ 通用兄弟：h1 ~ p
│   │   │   └─ 分组：h1, h2
│   │   ├─ 🧬 伪类（:）
│   │   │   ├─ 动态：:link, :visited, :hover, :active, :focus
│   │   │   ├─ 结构：:first-child, :last-child, :nth-child(n), :nth-of-type(n), :root
│   │   │   ├─ 表单：:checked, :disabled, :required, :valid, :invalid
│   │   │   └─ 其他：:not(), :target, :empty
│   │   └─ 🧪 伪元素（::）
│   │       ├─ ::before, ::after（需 content）
│   │       ├─ ::first-line, ::first-letter
│   │       └─ ::selection
│   │
│   ├─ 3. 属性（按重要性/应用频率）
│   │   ├─ 📐 布局属性（骨架）
│   │   │   ├─ display: block, inline, inline-block, flex, grid, none
│   │   │   ├─ position: static, relative, absolute, fixed, sticky
│   │   │   ├─ 偏移: top, right, bottom, left, z-index
│   │   │   ├─ Flex 布局
│   │   │   │   ├─ 容器: flex-direction, flex-wrap, justify-content, align-items, align-content, gap
│   │   │   │   └─ 项目: flex-grow, flex-shrink, flex-basis, align-self, order
│   │   │   ├─ Grid 布局
│   │   │   │   ├─ 容器: grid-template-rows/columns, grid-template-areas, gap, justify/align-items
│   │   │   │   └─ 项目: grid-row/column, grid-area, justify/align-self
│   │   │   └─ 传统: float, clear, column-*, writing-mode
│   │   ├─ 📦 盒子模型（尺寸与间距）
│   │   │   ├─ 尺寸: width, height, min/max-width/height
│   │   │   ├─ 内边距: padding（单边/缩写）
│   │   │   ├─ 边框: border（宽度/样式/颜色），border-radius
│   │   │   ├─ 外边距: margin（单边/缩写，可负值）
│   │   │   ├─ box-sizing: content-box | border-box
│   │   │   └─ 溢出/阴影: overflow, box-shadow, outline
│   │   ├─ 🎨 修饰属性（视觉表现）
│   │   │   ├─ 文本: font-*, color, text-*, line-height, letter-spacing, word-break, white-space
│   │   │   ├─ 背景: background-*（color, image, repeat, position, size, gradient）
│   │   │   └─ 其他: opacity, filter, list-style, cursor, mix-blend-mode
│   │   ├─ 🎬 动画与变换（交互动效）
│   │   │   ├─ transform: translate, rotate, scale, skew（2D/3D）
│   │   │   ├─ transition: property, duration, timing-function, delay
│   │   │   └─ animation: @keyframes, animation-*（name, duration, iteration-count...）
│   │   └─ 📱 媒体适配（响应式）
│   │       ├─ 视口设置：<meta name="viewport">
│   │       ├─ 媒体查询：@media (条件) { ... }
│   │       ├─ 弹性单位：rem, em, vw, vh, %
│   │       └─ 容器查询：@container（新兴）
│   │
│   ├─ 4. 预处理器（CSS 增强）
│   │   ├─ 🧪 Sass/SCSS
│   │   │   ├─ 变量：$primary
│   │   │   ├─ 嵌套：选择器嵌套
│   │   │   ├─ 混合：@mixin / @include
│   │   │   ├─ 继承：@extend
│   │   │   ├─ 运算与函数
│   │   │   └─ 模块化：@use / @forward
│   │   ├─ 🧪 Less
│   │   │   ├─ 变量：@primary
│   │   │   └─ 嵌套、混合、运算
│   │   └─ 🧪 Stylus
│   │       └─ 极简语法（省略 {}、:、;）
│   │
│   └─ 5. 框架与生态
│       ├─ 🅱️ Bootstrap
│       │   ├─ 12 列栅格系统（Flex）
│       │   ├─ 预定义组件（导航、卡片、模态框等）
│       │   └─ 实用工具类 + Reboot 样式重置
│       ├─ 🌊 Tailwind CSS
│       │   ├─ 实用优先（utility-first）
│       │   ├─ 按需生成（JIT 引擎）
│       │   ├─ 响应式前缀（md:）、暗黑模式、自定义主题
│       │   └─ 无默认样式，高度可定制
│       └─ 🧩 其他
│           ├─ Bulma（纯 Flex，轻量）
│           ├─ Foundation（企业级）
│           └─ UI 组件库（Ant Design、Element Plus 等，常与框架集成）
│
└─ 三、HTML 与 CSS 的关联
    ├─ 📎 外部样式：<link> 引用 CSS
    ├─ 📄 内部样式：<style> 嵌入 CSS
    └─ 🖌️ 内联样式：style 属性直接定义s
```

```tree
编程语言学习通用路径
├─ 一、基础语法入门（构建语言认知）
│   ├─ 📝 注释：单行//、多行/* */、文档注释
│   ├─ 🧠 变量/常量/关键字
│   │   ├─ 变量声明与初始化
│   │   ├─ 可变性控制（let vs var, const, final）
│   │   ├─ 数据类型：基本类型（整型、浮点、布尔、字符）
│   │   └─ 关键字识别（if, else, for, while, return...）
│   ├─ 🧮 表达式与运算符
│   │   ├─ 算术运算符：+ - * / %
│   │   ├─ 关系运算符：== != < > <= >=
│   │   ├─ 逻辑运算符：&& || !
│   │   ├─ 赋值运算符：= += -= ...
│   │   └─ 位运算符（按需，C/C++/Rust早期即涉及）
│   ├─ 🔁 语句与流程控制
│   │   ├─ 条件语句：if-else, switch
│   │   ├─ 循环语句：for, while, do-while
│   │   └─ 跳转语句：break, continue, return, goto（特定语言）
│   ├─ 📥 基本输入输出
│   │   ├─ 标准输出：print/println, console.log, printf...
│   │   └─ 标准输入：scanf, input(), readLine...
│   └─ 🐞 基本调试
│       ├─ 打印调试
│       ├─ 断言 assert
│       └─ IDE断点/单步执行概念
│
├─ 二、结构化编程（构建抽象与组织能力）
│   ├─ 🧩 函数/方法
│   │   ├─ 定义与调用
│   │   ├─ 参数传递（值传递、引用传递）
│   │   ├─ 返回值
│   │   └─ 作用域与生命周期
│   ├─ 📚 复合数据结构
│   │   ├─ 数组/列表
│   │   ├─ 字符串处理
│   │   ├─ 结构体/记录（struct, record）
│   │   └─ 枚举（enum）
│   ├─ 📦 模块化
│   │   ├─ 文件组织
│   │   ├─ 命名空间/包
│   │   └─ 导入导出机制
│   └─ 🔍 基础内存概念（引入）
│       ├─ 栈与堆的直觉理解
│       └─ 值类型 vs 引用类型
│
├─ 三、三大编程范式（建立多范式思维）
│   ├─ 🏛️ 面向过程
│   │   ├─ 模块化函数设计
│   │   ├─ 数据与操作分离
│   │   └─ 典型代表：C
│   ├─ 🧱 面向对象
│   │   ├─ 类与对象
│   │   ├─ 封装、继承、多态
│   │   ├─ 接口/抽象类
│   │   └─ 典型代表：Java, C++, Python
│   └─ λ 函数式
│       ├─ 一等公民函数
│       ├─ 纯函数与不可变性
│       ├─ 高阶函数、闭包
│       └─ 典型代表：Haskell, Scala, JavaScript
│
├─ 四、标准库与生态系统（迈向工业级开发）
│   ├─ 📖 标准库
│   │   ├─ 核心集合/容器（动态数组、哈希表、树）
│   │   ├─ I/O 与文件操作
│   │   ├─ 时间日期
│   │   ├─ 正则表达式
│   │   └─ 并发原语（线程、异步）
│   ├─ 📦 包管理器与依赖
│   │   ├─ npm, pip, cargo, maven...
│   │   └─ 第三方库引入与版本管理
│   ├─ 🔧 工具链
│   │   ├─ 构建工具（make, gradle, webpack）
│   │   ├─ 测试框架（JUnit, pytest, cargo test）
│   │   └─ 格式化/静态分析
│   └─ 🌐 生态框架
│       ├─ Web开发、GUI、数据库、机器学习等领域的典型框架
│       └─ 特定语言生态代表
│
└─ 五、语言特性插叙：渐进式深入策略（以指针/所有权为例）
    ├─ ⚠️ 问题：指针（C/C++）和所有权（Rust）是初学者最大难点
    ├─ 🔁 核心原则：**提前铺垫、分点切入、螺旋上升**
    ├─ 🧭 融入各阶段的具体策略
    │   ├─ 阶段一（基础语法）
    │   │   ├─ C/C++：引入“取地址&”和“解引用*”符号，但不深入指针运算
    │   │   └─ Rust：引入“所有权转移”的直觉（移动语义），浅谈栈上数据
    │   ├─ 阶段二（结构化编程）
    │   │   ├─ C/C++：数组与指针的关系，指针作为函数参数（模拟引用）
    │   │   ├─ Rust：借用&引用概念，区分可变/不可变借用，避谈生命周期
    │   │   └─ 两者共同：通过调试器观察内存地址，建立具象认知
    │   ├─ 阶段三（三大范式）
    │   │   ├─ C/C++：指针与动态内存分配（malloc/free），对象指针（this）
    │   │   ├─ Rust：生命周期标注（基础用法）、智能指针（Box, Rc）
    │   │   └─ 进阶所有权模式（RefCell, 内部可变性）
    │   └─ 阶段四（标准库与生态）
    │       ├─ C/C++：智能指针（shared_ptr, unique_ptr）、原始指针高危场景
    │       ├─ Rust：Send/Sync、跨线程所有权、unsafe代码块原则
    │       └─ 至此完成完整难点攻克
    └─ 📌 穿插教学法的本质
        ├─ 不追求一次性讲透，而是**环形迭代**
        ├─ 每阶段仅引入当前够用的子集
        └─ 结合具体代码练习（如实现链表、内存池）强化理解
```

```js
js-ts-note
├─ 1 Theory
│  ├─ Module.1 入门
│  │  ├─ Part.1 基本
│  │  │  ├─ Chr.1 基础语法
│  │  │  │  ├─ Section.1 基本环境.md
│  │  │  │  ├─ Section.2 注释.md
│  │  │  │  ├─ Section.3 变量与命名规则.md
│  │  │  │  ├─ Section.4 操作符与表达式.md
│  │  │  │  ├─ Section.5 语句与流程控制.md
│  │  │  │  ├─ Section.6 基本输入输出.md
│  │  │  │  └─ Section.7 基本调试.md
│  │  │  └─ Chr.2 结构化编程
│  │  │     ├─ Section.1 函数.md
│  │  │     ├─ Section.2 数据结构.md
│  │  │     └─ Section.3 模块化.md
│  │  └─ Part.2 范式
│  │     ├─ Chr.1 面向对象
│  │     │  ├─ Section.1 类与对象.md
│  │     │  ├─ Section.2 封装.md
│  │     │  ├─ Section.3 原型连与继承.md
│  │     │  ├─ Section.4 抽象.md
│  │     │  ├─ Section.5 多态.md
│  │     │  ├─ Section.6 泛型[*].md
│  │     │  ├─ Section.7 设计模式[*].md
│  │     │  └─ Section.8 拓展[*].md
│  │     ├─ Chr.2 函数式
│  │     └─ Chr.3 元编程
│  ├─ Module.2 标准库
│  │  ├─ Part.1 集合类
│  │  ├─ Part.2 时间与日期
│  │  ├─ Part.3 正则
│  │  └─ Part.4 异步
│  ├─ Module.3 TypeScript
│  ├─ Module.4 生态系统
│  │  ├─ Part.1 浏览器端
│  │  └─ Part.2 服务器端
│  ├─ Module.5 工程化
│  ├─ Module.6 应用与推荐框架
│  │  ├─ Part.1 数据科学--数据可视化
│  │  └─ Part.2
│  └─ README.md
├─ 2 Demo
│  └─ demo.1 .html
├─ 3 Project
├─ 4 Temp
│  └─ Temp.1 文档化注释 与 代码即文档.md
└─ README.md
```
