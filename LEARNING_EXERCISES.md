
# 前端开发学习练习：React, Tailwind CSS, TypeScript

这些练习旨在帮助你逐步掌握 React、Tailwind CSS 和 TypeScript 的基础知识。请按照顺序完成，并尝试在 `entrypoints/popup/App.tsx` 文件中进行修改。

## 练习 1: 修改文本内容

**目标:** 熟悉 `App.tsx` 文件，并修改页面上显示的文本。

1.  打开 `entrypoints/popup/App.tsx` 文件。
2.  找到 `<h1>` 或其他显示文本的标签。
3.  将文本内容修改为你自己的欢迎语，例如：“你好，前端世界！”
4.  保存文件，并在浏览器中查看效果。

## 练习 2: 添加一个新组件

**目标:** 学习如何创建和使用 React 组件。

1.  在 `entrypoints/popup/` 目录下创建一个新文件，例如 `Greeting.tsx`。
2.  在 `Greeting.tsx` 中创建一个简单的函数组件，显示一段问候语。
    ```tsx
    // Greeting.tsx
    import React from 'react';

    function Greeting() {
      return (
        <p>很高兴见到你！</p>
      );
    }

    export default Greeting;
    ```
3.  在 `App.tsx` 中导入并使用 `Greeting` 组件。
    ```tsx
    // App.tsx
    import React from 'react';
    import Greeting from './Greeting'; // 导入新组件

    function App() {
      return (
        <div>
          <h1>你好，前端世界！</h1>
          <Greeting /> {/* 使用新组件 */}
        </div>
      );
    }

    export default App;
    ```
4.  保存文件，并在浏览器中查看效果。

## 练习 3: 使用 Props 传递数据

**目标:** 学习如何通过 props 向组件传递数据。

1.  修改 `Greeting.tsx` 组件，使其接受一个 `name` 属性，并显示个性化的问候语。
    ```tsx
    // Greeting.tsx
    import React from 'react';

    interface GreetingProps {
      name: string;
    }

    function Greeting(props: GreetingProps) {
      return (
        <p>你好，{props.name}！很高兴见到你！</p>
      );
    }

    export default Greeting;
    ```
2.  在 `App.tsx` 中使用 `Greeting` 组件时，传递 `name` 属性。
    ```tsx
    // App.tsx
    import React from 'react';
    import Greeting from './Greeting';

    function App() {
      return (
        <div>
          <h1>你好，前端世界！</h1>
          <Greeting name="学习者" /> {/* 传递 name 属性 */}
        </div>
      );
    }

    export default App;
    ```
3.  保存文件，并在浏览器中查看效果。

## 练习 4: 使用 Tailwind CSS 样式化组件

**目标:** 学习如何使用 Tailwind CSS 为组件添加样式。

1.  在 `App.tsx` 中，为 `<h1>` 标签添加一些 Tailwind CSS 类，例如改变字体大小、颜色和居中。
    ```tsx
    // App.tsx
    import React from 'react';
    import Greeting from './Greeting';

    function App() {
      return (
        <div className="p-4 text-center">
          <h1 className="text-3xl font-bold text-blue-600 mb-4">你好，前端世界！</h1>
          <Greeting name="学习者" />
        </div>
      );
    }

    export default App;
    ```
2.  为 `Greeting.tsx` 中的 `<p>` 标签添加一些样式，例如改变字体颜色和背景色。
    ```tsx
    // Greeting.tsx
    import React from 'react';

    interface GreetingProps {
      name: string;
    }

    function Greeting(props: GreetingProps) {
      return (
        <p className="bg-green-100 text-green-800 p-2 rounded">你好，{props.name}！很高兴见到你！</p>
      );
    }

    export default Greeting;
    ```
3.  保存文件，并在浏览器中查看效果。

## 练习 5: 使用 useState 管理状态

**目标:** 学习如何使用 React 的 `useState` Hook 来管理组件内部的状态。

1.  在 `App.tsx` 中添加一个按钮，点击按钮时，改变一个计数器的值。
    ```tsx
    // App.tsx
    import React, { useState } from 'react'; // 导入 useState
    import Greeting from './Greeting';

    function App() {
      const [count, setCount] = useState(0); // 定义状态变量 count 和更新函数 setCount

      const handleClick = () => {
        setCount(count + 1);
      };

      return (
        <div className="p-4 text-center">
          <h1 className="text-3xl font-bold text-blue-600 mb-4">你好，前端世界！</h1>
          <Greeting name="学习者" />
          <p className="mt-4">你点击了 {count} 次。</p>
          <button
            className="mt-2 px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
            onClick={handleClick}
          >
            点击我
          </button>
        </div>
      );
    }

    export default App;
    ```
2.  保存文件，并在浏览器中查看效果。

## 练习 6: TypeScript 类型定义

**目标:** 巩固 TypeScript 的类型定义。

1.  在 `lib/utils.ts` 中添加一个简单的函数，例如 `add`，并为其参数和返回值添加类型注解。
    ```typescript
    // lib/utils.ts
    export function add(a: number, b: number): number {
      return a + b;
    }
    ```
2.  在 `App.tsx` 中导入并使用这个函数，确保类型检查正常工作。
    ```tsx
    // App.tsx
    import React, { useState } from 'react';
    import Greeting from './Greeting';
    import { add } from '../lib/utils'; // 导入 add 函数

    function App() {
      const [count, setCount] = useState(0);

      const handleClick = () => {
        setCount(add(count, 1)); // 使用 add 函数
      };

      return (
        <div className="p-4 text-center">
          <h1 className="text-3xl font-bold text-blue-600 mb-4">你好，前端世界！</h1>
          <Greeting name="学习者" />
          <p className="mt-4">你点击了 {count} 次。</p>
          <button
            className="mt-2 px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
            onClick={handleClick}
          >
            点击我
          </button>
        </div>
      );
    }

    export default App;
    ```
3.  尝试故意传入错误类型的参数（例如 `add('hello', 1)`），观察 TypeScript 的报错提示。

## 练习 7: 探索现有代码

**目标:** 尝试理解 `App.tsx` 中已有的代码结构和逻辑。

1.  仔细阅读 `App.tsx` 中现有的代码。
2.  尝试理解 `lucide-react` 和 `clsx` 等库的用法。
3.  尝试修改一些现有的 UI 元素，例如改变图标的颜色或大小。

完成这些练习后，你将对 React、Tailwind CSS 和 TypeScript 有一个初步的认识。祝你学习顺利！
