// 导入React核心库和Hooks
import React, { useEffect, useMemo, useState } from "react";
// 导入WXT提供的浏览器API，用于与浏览器扩展功能交互
import { browser } from "@wxt-dev/browser";
// 从lucide-react库导入图标组件
import { LoaderCircle, Search } from "lucide-react";
// 导入此组件的样式文件
import "./style.css";

// 定义Cookie对象的数据结构
interface Cookie {
  name: string;
  value: string;
  domain: string;
}

// 移除 FilterType，简化为统一搜索

const ESCAPE_PATTERN = /[-\/^$*+?.()|[\\]{}]/g;

const escapeRegExp = (value: string) => value.replace(ESCAPE_PATTERN, "\\$&\\\\");

const Highlight: React.FC<{ text: string; query: string }> = ({ text, query }) => {
  if (!query) return <>{text}</>;
  const parts = text.split(new RegExp(`(${escapeRegExp(query)})`, "gi"));

  return (
    <>
      {parts.map((part, index) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <span key={`${part}-${index}`} className="highlight">
            {part}
          </span>
        ) : (
          <React.Fragment key={`${part}-${index}`}>{part}</React.Fragment>
        ),
      )}
    </>
  );
};

/**
 * 主应用组件 App
 * @returns {React.ReactElement} - 渲染后的主应用界面。
 */
const App: React.FC = () => {
  // --- 状态管理 (State Management) ---
  // 存储从浏览器获取的所有 cookies
  const [allCookies, setAllCookies] = useState<Cookie[]>([]);
  // 控制加载状态，true表示正在加载数据
  const [loading, setLoading] = useState(true);
  // 存储用户输入的搜索关键词
  const [searchQuery, setSearchQuery] = useState("");
  // 跟踪哪些 cookie 的值已被复制，用于显示 "Copied" 状态
  const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({});
  // 存储扩展的版本号
  const [extensionVersion, setExtensionVersion] = useState("");

  // --- 数据获取与初始化 (Data Fetching & Initialization) ---
  // 使用 useEffect 在组件挂载时执行初始化操作
  useEffect(() => {
    let isMounted = true;

    async function initializeExtension() {
      try {
        const manifest = browser.runtime.getManifest();
        if (isMounted) {
          setExtensionVersion(manifest.version ?? "");
        }

        const tabs = await browser.tabs.query({ active: true, currentWindow: true });
        const activeTab = tabs[0];

        if (activeTab?.url) {
          const currentUrl = new URL(activeTab.url);
          const domain = currentUrl.hostname;

          const cookies = await browser.cookies.getAll({ domain });
          if (isMounted) {
            setAllCookies(
              cookies.map(({ name, value, domain: cookieDomain }) => ({
                name,
                value,
                domain: cookieDomain,
              })),
            );
          }
        } else if (isMounted) {
          setAllCookies([]);
        }
      } catch (error) {
        console.error("Error initializing extension:", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    initializeExtension();

    return () => {
      isMounted = false;
    };
  }, []);

  // --- 派生状态与计算 (Derived State & Memoization) ---
  // 使用 useMemo 记忆化筛选结果，统一全域搜索
  const filteredCookies = useMemo(() => {
    if (!searchQuery) return allCookies;
    const lowercasedQuery = searchQuery.toLowerCase();

    return allCookies.filter((cookie) => {
      const name = cookie.name.toLowerCase();
      const value = cookie.value.toLowerCase();
      const domain = cookie.domain.toLowerCase();

      // 统一搜索：同时匹配 Key、Value、Domain
      return name.includes(lowercasedQuery) ||
             value.includes(lowercasedQuery) ||
             domain.includes(lowercasedQuery);
    });
  }, [allCookies, searchQuery]);

  // --- 事件处理 (Event Handlers) ---
  /**
   * 处理复制 Key 的函数
   * @param {string} key - Cookie 的 Key
   * @param {string} id - 唯一标识符
   */
  const handleCopyKey = (key: string, id: string) => {
    navigator.clipboard.writeText(key).then(() => {
      setCopiedStates((prev) => ({ ...prev, [`${id}-key`]: true }));
      setTimeout(() => {
        setCopiedStates((prev) => ({ ...prev, [`${id}-key`]: false }));
      }, 2000);
    });
  };

  /**
   * 处理复制 Value 的函数
   * @param {string} value - Cookie 的 Value
   * @param {string} id - 唯一标识符
   */
  const handleCopyValue = (value: string, id: string) => {
    navigator.clipboard.writeText(value).then(() => {
      setCopiedStates((prev) => ({ ...prev, [`${id}-value`]: true }));
      setTimeout(() => {
        setCopiedStates((prev) => ({ ...prev, [`${id}-value`]: false }));
      }, 2000);
    });
  };

  // --- 渲染变量 (Render Variables) ---
  const shownCookies = filteredCookies.length;

  // --- 渲染逻辑 (Render Logic) ---
  return (
    <div className="app-container">
      {/* 专业 Logo - 绝对定位 */}
      <div className="app-logo">
        <span className="logo-text">CJ</span>
      </div>

      {/* 版本号 - 绝对定位 */}
      <span className="version-badge">
        v{extensionVersion}
      </span>

      <header className="app-header">
        <div className="header-content">
          <h1 className="header-title">Cookie Jar</h1>
        </div>

        <div className="search-container">
          <div className="search-input-wrapper">
            <Search
              className="search-icon"
              aria-hidden="true"
            />
            <input
              type="text"
              placeholder="Search cookies..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="search-input"
            />
          </div>
        </div>
      </header>

      <main className="main-content">
        {loading ? (
          <div className="loading-container">
            <LoaderCircle className="loading-spinner" aria-hidden="true" />
            <p className="loading-text">Loading cookies…</p>
          </div>
        ) : shownCookies === 0 ? (
          <div className="empty-container">
            <div className="empty-icon-container">
              <Search className="empty-icon" aria-hidden="true" />
            </div>
            <div>
              <p className="empty-title">No cookies found</p>
              <p className="empty-subtitle">
                Try a different keyword or filter
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="cookie-stats">
              <span className="stats-count">
                {shownCookies} cookies {searchQuery ? 'matched' : 'found'}
              </span>
              {searchQuery && (
                <div className="stats-info">
                  <span className="search-query" title={searchQuery}>
                    Search "{searchQuery}"
                  </span>
                </div>
              )}
            </div>

            <div className="cookie-list">
              {filteredCookies.map((cookie, index) => {
                const cookieId = `cookie-${index}`;
                const isKeyCopied = copiedStates[`${cookieId}-key`];
                const isValueCopied = copiedStates[`${cookieId}-value`];

                return (
                  <article
                    key={cookieId}
                    className="cookie-card"
                  >
                    {/* 单元一：Key + 操作 */}
                    <div className="key-unit">
                      <span className="key-name">
                        <Highlight text={cookie.name} query={searchQuery} />
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopyKey(cookie.name, cookieId)}
                        className={`copy-button key-copy ${isKeyCopied ? 'copied' : ''}`}
                        aria-label="Copy cookie key"
                      >
                        {isKeyCopied ? "✓" : "📋 Copy"}
                      </button>
                    </div>

                    {/* Domain 行：辅助信息 */}
                    <div className="domain-unit">
                      <span className="domain">
                        <Highlight text={cookie.domain} query={searchQuery} />
                      </span>
                    </div>

                    {/* 单元二：Value + 操作 */}
                    <div className="value-unit">
                      <div className="value-box">
                        <Highlight text={cookie.value} query={searchQuery} />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopyValue(cookie.value, cookieId)}
                        className={`copy-button value-copy ${isValueCopied ? 'copied' : ''}`}
                        aria-label="Copy cookie value"
                      >
                        {isValueCopied ? "✓" : "📋 Copy"}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default App;