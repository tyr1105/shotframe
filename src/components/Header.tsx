export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--bg-primary)]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">📸</span>
          <h1 className="text-lg font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            ShotFrame
          </h1>
          <span className="text-xs text-[var(--text-secondary)] ml-1">截图美化</span>
        </div>
        <div className="flex items-center gap-3">
          <a href="https://github.com/tyr1105/shotframe" target="_blank" rel="noopener noreferrer"
            className="text-sm text-[var(--text-secondary)] hover:text-white transition-colors">
            GitHub
          </a>
          <a href="https://tyr1105.github.io" target="_blank" rel="noopener noreferrer"
            className="text-sm text-[var(--text-secondary)] hover:text-white transition-colors">
            🧰 更多工具
          </a>
        </div>
      </div>
    </header>
  );
}
