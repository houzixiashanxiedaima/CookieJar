
// 导入 React 的核心钩子函数：useEffect 用于处理副作用，useState 用于在组件中管理状态。
import { useEffect, useState } from 'react';
// 导入 popup 的主样式文件。
import './App.css';
// 从 shadcn-ui 生成的组件库中导入 Table 相关的组件。
// 这些组件已经预设了样式，并且符合无障碍设计标准。
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

// 定义一个接口 (Interface) 来描述单个 Cookie 的数据结构。
// 这有助于 TypeScript 进行类型检查，确保我们使用的数据格式是正确的。
interface Cookie {
  name: string;  // Cookie 的名称
  value: string; // Cookie 的值
}

// 定义我们的主应用组件 App。
function App() {
  // 使用 useState 创建一个状态变量 `cookies`，用于存储从浏览器获取到的 Cookie 数组。
  // 初始值是一个空数组 `[]`。
  // `setCookies` 是一个函数，用于更新 `cookies` 的状态。
  const [cookies, setCookies] = useState<Cookie[]>([]);

  // 使用 useEffect 来执行副作用操作。在这里，它的作用是在组件首次加载后获取 Cookie。
  // 第二个参数 `[]` 是一个依赖数组，为空表示这个 effect 只在组件挂载时运行一次。
  useEffect(() => {
    // 定义一个异步函数 `getCookies` 来封装获取 Cookie 的逻辑。
    // 使用 async/await 可以让异步代码更易读。
    async function getCookies() {
      // `browser.tabs.query` 是一个 Web Extension API，用于查询符合条件的标签页。
      // `{ active: true, currentWindow: true }` 表示我们想要获取当前窗口下的活动标签页。
      const tabs = await browser.tabs.query({ active: true, currentWindow: true });

      // 确保查询到了标签页，并且该标签页有 URL。
      // 某些特殊页面（如 about:blank）可能没有有效的 URL。
      if (tabs[0] && tabs[0].url) {
        // `browser.cookies.getAll` 是另一个 Web Extension API，用于获取指定 URL 的所有 Cookie。
        const allCookies = await browser.cookies.getAll({ url: tabs[0].url });
        
        // 将从 API 获取到的原始 Cookie 对象数组，映射（map）成我们自定义的 `Cookie` 接口格式。
        // 这样做可以筛选出我们需要的字段（name 和 value），使数据结构更清晰。
        const parsedCookies = allCookies.map(cookie => ({ name: cookie.name, value: cookie.value }));
        
        // 调用 `setCookies` 函数，用获取并解析好的 Cookie 数据来更新组件的状态。
        // React 会在状态更新后自动重新渲染 UI。
        setCookies(parsedCookies);
      }
    }

    // 调用上面定义的函数来执行获取 Cookie 的操作。
    getCookies();
  }, []); // 空依赖数组意味着这个 effect 只运行一次。

  // `return` 语句定义了组件的 JSX 结构，也就是它在页面上渲染出来的内容。
  return (
    <div className="App p-4"> {/* 使用 Tailwind CSS 的 p-4 工具类添加内边距 */}
      <h1 className="text-lg font-bold pb-4">Cookie Viewer</h1> {/* 使用 Tailwind CSS 设置标题样式 */}
      
      {/* 使用从 shadcn-ui 导入的 Table 组件来展示数据 */}
      <Table>
        {/* 表头部分 */}
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Value</TableHead>
          </TableRow>
        </TableHeader>
        {/* 表格主体部分 */}
        <TableBody>
          {/* 
            使用 map 方法遍历 `cookies` 状态数组。
            对于数组中的每一个 `cookie` 对象，都渲染一个 `<TableRow>` 表格行。
            `key={cookie.name}` 是 React 的要求，用于在列表渲染中高效地识别和更新元素。
          */}
          {cookies.map((cookie) => (
            <TableRow key={cookie.name}>
              <TableCell>{cookie.name}</TableCell>
              <TableCell className="break-all">{cookie.value}</TableCell> {/* `break-all` 确保长文本能正确换行 */}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

// 导出 App 组件，使其可以在其他文件中被导入和使用。
export default App;
