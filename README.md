# CookieJar - A Chrome Extension for Viewing Cookies

CookieJar is a simple yet powerful Chrome extension that allows you to view the cookies of the current website in a clean, organized table. Click the extension icon, and instantly see all the cookie names and their corresponding values.

This project is built with a modern tech stack, making it a great starting point for anyone looking to learn about Chrome extension development with WXT, React, and Tailwind CSS.

![Screenshot of CookieJar](https://i.imgur.com/your-screenshot.png) <!-- 你可以将这里的链接替换为你的应用截图 -->

## ✨ Features

- **View Cookies**: Instantly view all cookies for the active tab.
- **Clear Presentation**: Displays cookies in a clean, easy-to-read table.
- **Modern UI**: Built with React, Tailwind CSS, and shadcn-ui for a polished user experience.
- **Fast & Efficient**: Built with WXT for an optimized and fast development workflow.

## 🛠️ Tech Stack

- **Framework**: [WXT](https://wxt.dev/) (Web Extension Toolkit)
- **UI Library**: [React](https://react.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [shadcn-ui](https://ui.shadcn.com/)
- **Package Manager**: [pnpm](https://pnpm.io/)

## 🚀 Getting Started

Follow these instructions to get the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or newer)
- [pnpm](https://pnpm.io/installation)

### Installation & Running

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/your-username/cookiejar.git
    cd cookiejar
    ```

2.  **Install dependencies:**
    ```sh
    pnpm install
    ```

3.  **Start the development server:**
    ```sh
    pnpm dev
    ```
    This command will build the extension and watch for file changes, automatically rebuilding as you code. The output will be generated in the `.output/` directory.

### Loading the Extension in Chrome

1.  Open Google Chrome and navigate to `chrome://extensions`.
2.  Enable **Developer mode** using the toggle switch in the top-right corner.
3.  Click the **"Load unpacked"** button.
4.  Select the `.output/chrome-mv3-dev` directory from this project.

Once loaded, you can navigate to any website, click the CookieJar icon in your browser's toolbar, and see the cookies for that site.

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.