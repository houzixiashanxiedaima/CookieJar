import React, { useEffect, useState, useMemo } from 'react';
import { browser } from '@wxt-dev/browser';
import { Search, Copy, Check, ChevronDown, LoaderCircle } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import './style.css';

// --- 工具函数 (Utils) ---
/**
 * 🎓 学习重点：Tailwind CSS 类名合并工具
 * - clsx: 条件性类名拼接，支持对象、数组、字符串形式
 * - twMerge: 自动处理 Tailwind 类冲突，后面的类会覆盖前面的
 * - 这是 Tailwind 生态中的最佳实践组合
 */
function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

// --- 数据类型定义 (Data Structures) ---
/**
 * 🎓 学习重点：TypeScript 接口定义
 * - interface: 定义对象的结构和类型
 * - 所有属性都是必需的（没有 ? 可选标记）
 * - 这样可以确保类型安全，避免运行时错误
 */
interface Cookie {
  name: string;    // Cookie 名称
  value: string;   // Cookie 值
  domain: string;  // Cookie 所属域名
}

/**
 * 🎓 学习重点：TypeScript 联合类型 (Union Types)
 * - 用 | 分隔不同的字面量类型
 * - 限制变量只能是这三个值之一
 * - 提供更好的类型安全和 IDE 自动补全
 */
type FilterType = 'all' | 'key' | 'value';

// --- 子组件定义 (Components) ---
/**
 * 🎓 学习重点：React 函数组件 + TypeScript
 * 高亮文本组件 - 在搜索结果中突出显示匹配的文本
 * 
 * Props 类型定义：
 * - text: 要高亮的原始文本
 * - query: 搜索查询词
 * 
 * React.FC<Props> 是函数组件的 TypeScript 类型定义
 */
const Highlight: React.FC<{ text: string; query: string }> = ({ text, query }) => {
  // 📖 早期返回模式：如果没有搜索词，直接返回原文本
  if (!query) return <>{text}</>;
  
  // 📖 正则表达式：全局不区分大小写搜索，并捕获匹配组
  const parts = text.split(new RegExp(`(${query})`, 'gi'));
  
  return (
    <>
      {/* 📖 数组映射：将文本片段渲染为 JSX */}
      {parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase() ? (
          // 🎨 匹配的文本：蓝色高亮样式
          <span key={i} className="bg-blue-100 text-blue-900 px-1 py-0.5 rounded-md font-medium">
            {part}
          </span>
        ) : (
          // 📝 普通文本：不做特殊处理
          part
        )
      )}
    </>
  );
};

/**
 * 🎓 学习重点：React 主组件定义
 * 这是应用的根组件，包含所有的状态管理和业务逻辑
 */
const App: React.FC = () => {
  // --- 状态管理 (State Management) ---
  
  /**
   * 🎓 学习重点：useState Hook 状态管理
   * 
   * allCookies: 存储所有 cookie 数据的数组
   * - 泛型 <Cookie[]> 指定数组元素类型
   * - 初始值为空数组 []
   */
  const [allCookies, setAllCookies] = useState<Cookie[]>([]);
  
  /**
   * 🎓 学习重点：布尔状态管理
   * loading: 控制加载状态的显示
   * - 初始值 true，数据加载完成后设为 false
   */
  const [loading, setLoading] = useState(true);
  
  /**
   * 🎓 学习重点：字符串状态管理  
   * searchQuery: 存储用户输入的搜索关键词
   * - 与搜索输入框双向绑定
   */
  const [searchQuery, setSearchQuery] = useState('');
  
  /**
   * 🎓 学习重点：联合类型状态管理
   * filterType: 当前选择的筛选类型
   * - 类型为 FilterType，限制只能是 'all' | 'key' | 'value'
   * - 默认值 'all' 显示所有结果
   */
  const [filterType, setFilterType] = useState<FilterType>('all');
  
  /**
   * 🎓 学习重点：复杂对象状态管理
   * copiedStates: 追踪复制按钮的状态
   * - Record<string, boolean> 类型表示键为字符串，值为布尔值的对象
   * - 用于显示复制成功的临时状态
   */
  const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({});
  
  /**
   * 🎓 学习重点：版本信息状态
   * extensionVersion: 存储扩展程序版本号
   * - 通过浏览器 API 获取 manifest.json 中的版本信息
   */
  const [extensionVersion, setExtensionVersion] = useState('');

  useEffect(() => {
    async function initializeExtension() {
      try {
        // Get extension version
        const manifest = browser.runtime.getManifest();
        setExtensionVersion(manifest.version);

        // Get cookies
        const tabs = await browser.tabs.query({ active: true, currentWindow: true });
        if (tabs[0] && tabs[0].url) {
          const currentUrl = new URL(tabs[0].url);
          const domain = currentUrl.hostname;
          const cookies = await browser.cookies.getAll({ domain });
          setAllCookies(cookies.map(({ name, value, domain }) => ({ name, value, domain })));
        }
      } catch (error) {
        console.error('Error initializing extension:', error);
      } finally {
        setLoading(false);
      }
    }
    initializeExtension();
  }, []);

  const filteredCookies = useMemo(() => {
    if (!searchQuery) return allCookies;
    const lowercasedQuery = searchQuery.toLowerCase();
    return allCookies.filter(cookie => {
      const name = cookie.name.toLowerCase();
      const value = cookie.value.toLowerCase();
      if (filterType === 'key') return name.includes(lowercasedQuery);
      if (filterType === 'value') return value.includes(lowercasedQuery);
      return name.includes(lowercasedQuery) || value.includes(lowercasedQuery);
    });
  }, [searchQuery, filterType, allCookies]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedStates(prev => ({ ...prev, [id]: true }));
      setTimeout(() => {
        setCopiedStates(prev => ({ ...prev, [id]: false }));
      }, 2000);
    });
  };

  return (
    <div className="w-[520px] h-[500px] bg-white font-sans flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 px-4 py-3 bg-white/95 backdrop-blur-xl border-b border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-sm">
              <span className="text-white text-xs font-semibold">🍪</span>
            </div>
            <h1 className="text-lg font-semibold text-gray-900 tracking-tight">Cookie Jar</h1>
          </div>
          <span className="text-xs text-gray-500 font-medium bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full border border-blue-200">v{extensionVersion}</span>
        </div>
        {/* 搜索栏和筛选器容器 */}
        <div className="flex items-stretch gap-3">
          {/* 搜索输入框容器 */}
          <div className="relative flex-1">
            {/* 搜索图标 - 绝对定位在输入框左侧 */}
            <div className="absolute left-3 top-1/2 -translate-y-1/2">
              <Search className="w-4 h-4 text-gray-400" />
            </div>
            {/* 搜索输入框
                - w-full: 占满容器宽度
                - h-10: 高度 40px (2.5rem)
                - pl-10: 左内边距为搜索图标留空间
                - pr-4: 右内边距
                - bg-white: 白色背景
                - border border-gray-200: 浅灰色边框
                - rounded-xl: 大圆角 (12px)
                - focus样式: 聚焦时显示蓝色边框和光圈
                - shadow-sm: 轻微阴影
            */}
            <input
              type="text"
              placeholder="Search cookies..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-4 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-300 transition-all duration-200 placeholder-gray-400 shadow-sm"
            />
          </div>
          
          {/* 筛选下拉框容器 */}
          <div className="relative">
            {/* 筛选下拉选择器
                - appearance-none: 移除默认下拉箭头
                - h-10: 与搜索框同高度 40px
                - bg-blue-500: 蓝色背景突出显示
                - text-white: 白色文字
                - font-semibold: 半粗体
                - pl-4 pr-10: 左内边距4, 右内边距10 (为自定义箭头留空间)
                - border-0: 无边框
                - rounded-xl: 大圆角
                - hover:bg-blue-600: 悬停时深蓝色
                - focus样式: 聚焦时显示光圈和偏移
                - shadow-md: 中等阴影
                - min-w-20: 最小宽度 80px
            */}
            <select
              value={filterType}
              onChange={e => setFilterType(e.target.value as FilterType)}
              className="appearance-none cursor-pointer h-10 text-sm bg-blue-500 text-white font-semibold pl-4 pr-10 border-0 rounded-xl hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:ring-offset-2 transition-all duration-200 shadow-md min-w-20"
            >
              <option value="all">All</option>
              <option value="key">Key</option>
              <option value="value">Value</option>
            </select>
            {/* 自定义下拉箭头 - 绝对定位在右侧 */}
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white pointer-events-none" />
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-grow overflow-y-auto px-4 py-2">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full">
            <LoaderCircle className="w-8 h-8 text-blue-500 animate-spin mb-3" />
            <p className="text-sm text-gray-500 font-medium">Loading cookies...</p>
          </div>
        ) : filteredCookies.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full">
                <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                  <Search className="w-6 h-6 text-blue-500" />
                </div>
                <p className="text-gray-700 font-medium">No cookies found</p>
                <p className="text-xs text-gray-500 mt-1">Try adjusting your search or filter</p>
            </div>
        ) : (
          <div className="space-y-2 pb-3">
            {filteredCookies.map((cookie, index) => {
              const cookieId = `cookie-${index}`;
              const isCopied = copiedStates[cookieId];
              return (
                <div key={cookieId} className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-200 hover:bg-blue-50/30">
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <div className="w-2.5 h-2.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex-shrink-0"></div>
                      <p className="text-xs text-gray-600 truncate font-medium">
                        <Highlight text={cookie.domain} query={searchQuery} />
                      </p>
                    </div>
                    <button
                      onClick={() => handleCopy(cookie.value, cookieId)}
                      className={cn(
                        "flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30",
                        isCopied
                          ? "bg-green-500 text-white shadow-md scale-105"
                          : "bg-gray-100 hover:bg-blue-100 text-gray-600 hover:text-blue-600 hover:scale-105 active:scale-95"
                      )}
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-xs text-blue-600 uppercase tracking-wide font-semibold">Key</span>
                        <div className="flex-1 h-px bg-blue-200"></div>
                      </div>
                      <p className="text-sm text-gray-900 font-semibold break-words">
                        <Highlight text={cookie.name} query={searchQuery} />
                      </p>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-xs text-blue-600 uppercase tracking-wide font-semibold">Value</span>
                        <div className="flex-1 h-px bg-blue-200"></div>
                      </div>
                      <div className="bg-gray-100 p-2.5 rounded-lg max-h-20 overflow-y-auto">
                        <pre className="text-xs text-gray-700 font-mono whitespace-pre-wrap break-all leading-relaxed">
                          <Highlight text={cookie.value} query={searchQuery} />
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default App;