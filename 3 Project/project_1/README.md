# project_1 概述

[TOC]

## 描述

通用模板

## 结构

```bash
project_1/
├── .prettierrc
├── README.md
├── babel.config.json
├── dockerfile
├── eslint.config.js
├── jenkinsfile
├── jest.config.js
├── nginx.conf
├── package-lock.json
├── package.json
├── public
│   ├── favicon.ico
│   └── index.html
│   # 注：system-setting.json 已移至 src/config/ 或改为 API 获取
├── src
│   ├── App.vue
│   ├── main.ts
│   ├── api
│   │   ├── http
│   │   │   ├── clients
│   │   │   │   ├── gisInstance.ts
│   │   │   │   └── userInstance.ts
│   │   │   ├── services
│   │   │   │   ├── gisServices.ts
│   │   │   │   └── userServices.ts
│   │   │   ├── types
│   │   │   │   ├── gis.ts
│   │   │   │   └── user.ts
│   │   │   └── utils
│   │   │       ├── auth.ts
│   │   │       └── interceptors.ts
│   │   ├── index.ts
│   │   └── ws
│   │       └── index.ts
│   ├── assets
│   │   ├── imgs
│   │   └── styles
│   │       ├── cesium-container.css   # 修正拼写 (原 ceisum)
│   │       ├── dynamic-form.css
│   │       ├── main.css
│   │       ├── preset.css
│   │       └── reset.css
│   ├── common
│   │   ├── components
│   │   │   ├── CesiumContainer       # 若仅为特定模块使用，可移至 modules/gis，此处保留为通用示例
│   │   │   │   ├── CesiumContainer.vue
│   │   │   │   └── composables
│   │   │   │       └── useCesiumContainer.ts
│   │   │   ├── DynamicForm
│   │   │   │   ├── DynamicForm.vue
│   │   │   │   └── composables
│   │   │   │       └── useDynamicForm.ts
│   │   │   └── FieldRenderer
│   │   │       ├── FieldRenderer.vue
│   │   │       └── composables
│   │   │           ├── useFieldRenderer.ts   # 修正拼写 (原 useFieldRenerer)
│   │   │           ├── useGeomField.ts
│   │   │           ├── useStandardField.ts
│   │   │           └── useUploadField.ts
│   │   ├── composables
│   │   └── utils
│   │       ├── class
│   │       │   └── (移除 FooClass.ts 示例，或移入 __tests__)
│   │       └── function
│   │           └── (移除 fooFn.ts 示例，或移入 __tests__)
│   ├── config
│   │   ├── system-config.ts           # 替代 public/static/system-setting.json
│   │   └── testRendererList.ts
│   ├── layout
│   │   ├── AdminLayout
│   │   │   └── AdminLayout.vue        # 完善后台管理布局（含侧边栏/顶栏）
│   │   └── DefaultLayout
│   │       ├── Aside
│   │       │   └── Aside.vue
│   │       ├── Footer
│   │       │   └── Footer.vue
│   │       ├── Header
│   │       │   └── Header.vue
│   │       ├── DefaultLayout.vue      # 原 Layout.vue 重命名，便于识别
│   │       └── Main
│   │           └── MainLayout.vue
│   ├── modules                         # 新增业务模块目录（可选，拆分重型业务）
│   │   └── gis
│   │       ├── components
│   │       │   └── CesiumContainer    # 若 CesiumContainer 仅 GIS 模块使用，可移至此
│   │       └── views
│   ├── router
│   │   ├── interceptor.ts
│   │   ├── router.ts
│   │   └── routes
│   │       ├── index.ts               # 合并导出
│   │       ├── home.ts                # 按模块拆分路由
│   │       ├── about.ts
│   │       └── admin.ts
│   ├── stores
│   │   ├── counter.ts
│   │   ├── user.ts                    # 新增用户状态
│   │   └── app.ts                     # 新增应用全局状态
│   ├── types
│   │   ├── auto-imports.d.ts
│   │   ├── components.d.ts
│   │   ├── dynamic-form.d.ts
│   │   ├── env.d.ts
│   │   ├── global.d.ts
│   │   ├── shims-css.d.ts
│   │   └── shims-vue.d.ts
│   ├── views
│   │   ├── About
│   │   │   ├── AboutView.vue
│   │   │   └── composables
│   │   │       └── useAboutView.ts
│   │   ├── Home
│   │   │   ├── HomeView.vue
│   │   │   └── composables
│   │   │       └── useHomeView.ts
│   │   └── Login.vue                  # 登录视图（无布局）
│   └── __tests__                      # 新增单元测试目录
│       ├── api
│       │   └── userServices.spec.ts
│       ├── common
│       │   └── utils
│       │       └── (示例测试)
│       └── setup.ts
├── tsconfig.json
├── uml
│   └── DynamicForm.plantuml
└── webpack.config.js
```