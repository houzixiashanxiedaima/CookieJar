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

type FilterType = "all" | "key" | "value";

const filterOptions: Array<{ value: FilterType; label: string }> = [
  { value: "all", label: "All" },
  { value: "key", label: "Key" },
  { value: "value", label: "Value" },
];

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
  // 存储当前的筛选类型 ('all', 'key', 'value')
  const [filterType, setFilterType] = useState<FilterType>("all");
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
  // 使用 useMemo 记忆化筛选结果，避免在每次渲染时都重新计算
  const filteredCookies = useMemo(() => {
    if (!searchQuery) return allCookies;
    const lowercasedQuery = searchQuery.toLowerCase();

    return allCookies.filter((cookie) => {
      const name = cookie.name.toLowerCase();
      const value = cookie.value.toLowerCase();

      if (filterType === "key") {
        return name.includes(lowercasedQuery);
      }

      if (filterType === "value") {
        return value.includes(lowercasedQuery);
      }

      return name.includes(lowercasedQuery) || value.includes(lowercasedQuery);
    });
  }, [allCookies, filterType, searchQuery]);

  // --- 事件处理 (Event Handlers) ---
  /**
   * 处理复制操作的函数。
   * @param {string} text - 要复制到剪贴板的文本。
   * @param {string} id - 唯一标识符，用于更新复制状态。
   */
  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedStates((prev) => ({ ...prev, [id]: true }));
      setTimeout(() => {
        setCopiedStates((prev) => ({ ...prev, [id]: false }));
      }, 2000);
    });
  };

  // --- 渲染变量 (Render Variables) ---
  const shownCookies = filteredCookies.length;

  // --- 渲染逻辑 (Render Logic) ---
  return (
    <div className="app-container">
      {/* Cookie图标 - 绝对定位 */}
      <div className="cookie-icon">
        <span role="img" aria-label="Cookie">
          🍪
        </span>
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
              placeholder="Search cookies"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="search-input"
            />
          </div>
          <div className="filter-container">
            {filterOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setFilterType(option.value)}
                className={`filter-button ${filterType === option.value ? 'active' : ''}`}
              >
                {option.label}
              </button>
            ))}
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
                {shownCookies} cookies matched
              </span>
              <div className="stats-info">
                {searchQuery && (
                  <span className="search-query" title={searchQuery}>
                    Search "{searchQuery}"
                  </span>
                )}
                {filterType !== "all" && <span className="filter-info">Filter: {filterType}</span>}
              </div>
            </div>

            <div className="cookie-list">
              {filteredCookies.map((cookie, index) => {
                const cookieId = `cookie-${index}`;
                const isCopied = copiedStates[cookieId];

                return (
                  <article
                    key={cookieId}
                    className="cookie-card"
                  >
                    <div className="cookie-header">
                      <div className="cookie-domain">
                        <Highlight text={cookie.domain} query={searchQuery} />
                      </div>
                      <div className="cookie-actions">
                        {cookie.name === "_locale" && (
                          <span className="locale-tag">
                            zh
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => handleCopy(cookie.value, cookieId)}
                          className={`copy-button ${isCopied ? 'copied' : ''}`}
                          aria-label="Copy cookie value"
                        >
                          {isCopied ? "✓" : "copy"}
                        </button>
                      </div>
                    </div>

                    <div className="cookie-content">
                      <div className="cookie-field">
                        <span className="field-label">KEY</span>
                        <span className="field-value key">
                          <Highlight text={cookie.name} query={searchQuery} />
                        </span>
                      </div>
                      {filterType === "value" || filterType === "all" ? (
                        <div className="cookie-field">
                          <span className="field-label">VALUE</span>
                          <span className="field-value value">
                            <Highlight text={cookie.value.length > 50 ? cookie.value.substring(0, 50) + "..." : cookie.value} query={searchQuery} />
                          </span>
                        </div>
                      ) : null}
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