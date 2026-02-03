import pluginVue from "eslint-plugin-vue"
import globals from "globals"
import stylistic from "@stylistic/eslint-plugin"
import importPlugin from "eslint-plugin-import"

export default [
  {
    ignores: [
      "dist/**/*",
      "node_modules/**/*",
      "public/**/*",
    ],
  },
  ...pluginVue.configs["flat/recommended"],
  {
    plugins: {
      "@stylistic": stylistic,
      import: importPlugin,
    },
    rules: {
      semi: ["warn", "never"], // 禁止分号
      camelcase: ["warn", { allow: ["dead_code", "keep_classnames", "keep_fnames", "drop_console", "drop_debugger"] }], // 强制驼峰命名
      eqeqeq: ["warn", "smart"], // 智能禁止使用 == 和 !=，要求使用 === 和 !==
      "no-multi-str": ["warn"], // 禁止使用多行字符串
      "prefer-template": ["warn"], // 优先使用模板字符串
      "no-var": ["warn"], // 禁止使用 var
      "no-unused-vars": [
        "off",
        {
          vars: "all", // 变量
          args: "none", // 参数
          ignoreRestSiblings: false, // 忽略剩余的解构
          varsIgnorePattern: "required", // 忽略 required(vee-validate)
        },
      ], // 未使用的变量
      "prefer-const": ["warn", {
        "destructuring": "any",
        "ignoreReadBeforeAssign": false,
      }], // 优先使用 const

      "@stylistic/max-len": ["warn", { code: 8000 }], // 单行最大长度
      "@stylistic/no-trailing-spaces": ["warn"], // 禁止行尾空格
      "@stylistic/linebreak-style": ["warn", "unix"], // 换行符风格
      "@stylistic/no-multiple-empty-lines": ["warn", { max: 2, maxEOF: 1, maxBOF: 0 }], // 空行数量
      "@stylistic/quotes": ["warn", "double", { avoidEscape: true }], // 引号
      "@stylistic/brace-style": ["warn", "1tbs", { allowSingleLine: true }], // 大括号风格
      "@stylistic/comma-dangle": ["warn", "always-multiline"], // 逗号后面必须有空格
      "@stylistic/eol-last": ["warn", "always"], // 文件末尾必须有换行符
      "@stylistic/template-curly-spacing": ["warn", "never"], // 模板字符串中花括号内的空格
      "@stylistic/object-curly-spacing": ["warn", "always"], // 对象字面量中花括号内的空格
      "@stylistic/space-infix-ops": ["warn", { int32Hint: false }], // 运算符周围的空格
      "@stylistic/keyword-spacing": ["warn", { before: true, after: true }], // 关键字周围的空格
      "@stylistic/arrow-spacing": ["warn"], // 箭头函数的箭头前后的空格
      "@stylistic/space-before-blocks": ["warn", { functions: "always", keywords: "always", classes: "always" }], // 块语句大括号前的空格
      "@stylistic/no-multi-spaces": ["warn"], // 禁止使用多个空格
      "@stylistic/comma-spacing": ["warn", { before: false, after: true }], // 逗号周围的空格
      "@stylistic/semi-spacing": ["warn", { before: false, after: true }], // 分号周围的空格
      "@stylistic/indent": [
        "warn",
        2, // 默认缩进2个空格
        {
          SwitchCase: 1, //  switch语句缩进1个单位
          VariableDeclarator: 1, // 变量声明符缩进1个单位
          offsetTernaryExpressions: true, //三元表达式缩进
        },
      ], // 缩进

      "import/order": ["warn"], // import排序

      "vue/component-api-style": [
        "warn",
        ["script-setup", "composition"], // "script-setup", "composition", "composition-vue2", or "options"
      ], // vue组件api风格
      "vue/no-unused-vars": ["off"], // vue模板中未使用的变量
      "vue/max-attributes-per-line": ["warn", { singleline: { max: Infinity }, multiline: { max: 1 } }], // 每行最多的属性数量
      "vue/no-unused-components": ["warn"], // 未使用的组件
      "vue/multi-word-component-names": ["off", { ignores: [] }], // 组件名必须由多个单词组成
      "vue/order-in-components": ["warn"], // 组件属性顺序
      "vue/block-order": ["warn"], // 块顺序
      "vue/no-v-text-v-html-on-component": ["off"], // 组件中禁止使用v-text和v-html
      "vue/component-definition-name-casing": ["warn", "PascalCase"], // 组件命名规范
      "vue/attributes-order": ["warn"], // 属性顺序
      "vue/attribute-hyphenation": ["warn"], // 属性命名规范
      "vue/multiline-html-element-content-newline": ["warn"], // 多行元素内容换行
      "vue/mustache-interpolation-spacing": ["warn", "always"], // 插值表达式周围的空格
      "vue/no-multi-spaces": ["warn"], // 禁止使用多个空格
      "vue/singleline-html-element-content-newline": [
        "off",
        {
          ignoreWhenNoAttributes: true,
          ignoreWhenEmpty: true,
          ignores: ["pre", "textarea", "h1", "p", "span"], // 忽略的元素
          externalIgnores: [],
        },
      ], // 单行元素内容换行，关闭，允许不换行
      "vue/component-name-in-template-casing": [
        "warn",
        "PascalCase", // 大驼峰 或 短横线命名
        {
          ignores: ["/^rain-/"], // 忽略以rain-开头的组件名
          registeredComponentsOnly: true, // 只检查已注册的组件
        },
      ], // 模板中使用组件名
      "vue/v-slot-style": [
        "warn",
        {
          atComponent: "v-slot",
          default: "v-slot",
          named: "shorthand",
        },
      ], // v-slot 风格
      "vue/html-closing-bracket-newline": [
        "warn",
        {
          singleline: "never", // 单行元素的结束标签换行
          multiline: "never", // 多行元素的结束标签换行
        },
      ], // 多行元素的结束标签换行
      "vue/html-self-closing": [
        "warn",
        {
          html: {
            void: "any",
            normal: "always",
            component: "always",
          },
          svg: "always",
          math: "always",
        },
      ], // 自闭合标签, void标签允许省略结束标签
    },
    languageOptions: {
      sourceType: "module",
      globals: {
        ...globals.browser,
      },
    },
  },
]
