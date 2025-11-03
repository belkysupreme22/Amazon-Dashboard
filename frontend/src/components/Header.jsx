function Header() {
  return (
    <header className="bg-primary-50 shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <svg className="w-8 h-8 text-primary-600 mr-2" fill="currentColor" viewBox="0 0 25 25">
              <path d="M10 2L3 7v11h4v-7h6v7h4V7l-7-5z"/>
            </svg>
            <h1 className="text-xl font-mono font-bold text-gray-900">Amazon Dashboard</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="font-mono text-sm text-gray-600">Track • Monitor • Analyze</span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
