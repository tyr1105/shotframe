export default function Footer() {
  return (
    <footer className="border-t border-[var(--border)] py-6 text-center text-sm text-[var(--text-secondary)]">
      <div className="max-w-7xl mx-auto px-4">
        <p>📸 ShotFrame - 免费截图美化工具 | 纯浏览器端处理，隐私安全</p>
        <div className="mt-2 flex items-center justify-center gap-4">
          <a href="https://tyr1105.github.io" className="hover:text-white transition-colors">🧰 万能工具箱</a>
          <a href="https://github.com/tyr1105/shotframe" className="hover:text-white transition-colors">📦 源码</a>
        </div>
      </div>
    </footer>
  );
}
