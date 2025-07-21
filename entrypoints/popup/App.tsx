
import { useEffect, useState } from 'react';
import './App.css';
import { browser } from '@wxt-dev/browser';

// 定义一个接口 (Interface) 来描述单个 Cookie 的数据结构。
// 这有助于 TypeScript 进行类型检查，确保我们使用的数据格式是正确的。
interface Cookie {
  name: string;  // Cookie 的名称
  value: string; // Cookie 的值
  domain: string; // Cookie 的域
}

// 定义我们的主应用组件 App。
function App() {
  const [cookies, setCookies] = useState<Cookie[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDomain, setCurrentDomain] = useState<string>('');
  
  // 复制到剪贴板功能
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  // 使用 useEffect 来执行副作用操作。在这里，它的作用是在组件首次加载后获取 Cookie。
  // 第二个参数 `[]` 是一个依赖数组，为空表示这个 effect 只在组件挂载时运行一次。
  useEffect(() => {
    // 定义一个异步函数 `getCookies` 来封装获取 Cookie 的逻辑。
    // 使用 async/await 可以让异步代码更易读。
    async function getCookies() {
      try {
        console.log('开始获取 Cookie...');
        
        // `browser.tabs.query` 是一个 Web Extension API，用于查询符合条件的标签页。
        // `{ active: true, currentWindow: true }` 表示我们想要获取当前窗口下的活动标签页。
        const tabs = await browser.tabs.query({ active: true, currentWindow: true });
        console.log('获取到的标签页:', tabs);

        // 确保查询到了标签页，并且该标签页有 URL。
        // 某些特殊页面（如 about:blank）可能没有有效的 URL。
        if (tabs[0] && tabs[0].url) {
          const currentUrl = new URL(tabs[0].url);
          const domain = currentUrl.hostname;
          console.log('当前标签页 Domain:', domain);
          setCurrentDomain(domain);
          
          const allCookies = await browser.cookies.getAll({ domain: domain });
          console.log('获取到的原始 Cookie 数据:', allCookies);
          
          const parsedCookies = allCookies.map(cookie => ({ 
            name: cookie.name, 
            value: cookie.value, 
            domain: cookie.domain 
          }));
          console.log('解析后的 Cookie 数据:', parsedCookies);
          
          setCookies(parsedCookies);
        } else {
          console.log('没有找到有效的标签页或 URL');
        }
      } catch (error) {
        console.error('获取 Cookie 时发生错误:', error);
      } finally {
        setLoading(false);
      }
    }

    // 调用上面定义的函数来执行获取 Cookie 的操作。
    getCookies();
  }, []); // 空依赖数组意味着这个 effect 只运行一次。

  return (
    <div className="min-h-[400px] w-[480px] bg-gradient-to-br from-gray-50 to-white">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-100 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">🍪</span>
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">Cookie Jar</h1>
            <p className="text-sm text-gray-500">
              {currentDomain ? `${cookies.length} cookies from ${currentDomain}` : `${cookies.length} cookies found`}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-3"></div>
            <p className="text-gray-500 text-sm">Loading cookies...</p>
          </div>
        ) : cookies.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6 shadow-inner">
              <span className="text-3xl opacity-60">🍪</span>
            </div>
            <h3 className="text-gray-700 text-base font-medium mb-2">No cookies found</h3>
            <p className="text-gray-400 text-sm text-center max-w-xs">
              This website doesn't store any cookies in your browser
            </p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto scrollbar-thin pr-1">
            {cookies.map((cookie, index) => (
              <div
                key={`${cookie.name}-${index}`}
                className="cookie-card bg-white rounded-xl border border-gray-100 p-4 shadow-sm"
              >
                {/* Cookie Name */}
                <div className="mb-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-900 text-sm truncate flex-1 mr-2">
                      {cookie.name}
                    </h3>
                    <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-full">
                      {cookie.domain}
                    </span>
                  </div>
                </div>

                {/* Cookie Value */}
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <div className="text-xs text-gray-500 font-medium">Value</div>
                    <button
                      onClick={() => copyToClipboard(cookie.value)}
                      className="text-xs text-blue-500 hover:text-blue-600 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded-full transition-colors duration-150 font-medium"
                    >
                      Copy
                    </button>
                  </div>
                  <div className="overflow-x-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-300">
                    <div className="text-sm text-gray-700 font-mono whitespace-nowrap min-w-0 select-all">
                      {cookie.value || <span className="text-gray-400 italic">empty</span>}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// 导出 App 组件，使其可以在其他文件中被导入和使用。
export default App;
