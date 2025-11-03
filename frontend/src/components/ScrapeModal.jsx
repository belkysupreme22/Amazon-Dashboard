import { useState } from 'react';

function ScrapeModal({ onClose, onScrape }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!searchTerm.trim()) {
      setError('Please enter a search term');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await onScrape(searchTerm.trim());
      if (result.success) {
        onClose();
      } else {
        setError(result.error || 'Scraping failed');
      }
    } catch (err) {
      setError('An unexpected error occurred, Please try again!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-3xl font-mono text-gray-900">Scrape Amazon Products</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={loading}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4 font-mono">
            <label htmlFor="searchTerm" className="block text-sm font-medium text-gray-700 mb-2">
              Search Term
            </label>
            <input
              id="searchTerm"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="e.g., wireless headphones"
              className="input w-full"
              disabled={loading}
            />
            <p className="text-sm text-gray-500 mt-2">
              Enter what you want to search on Amazon (e.g., "wireless headphones", "gaming mouse")
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          {loading && (
            <div className="text-center py-4">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              <p className="mt-2 text-gray-600">Scraping products...</p>
              <p className="text-sm text-gray-500">This may take a minute</p>
            </div>
          )}

          <div className="font-mono flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
            >
              {loading ? 'Scraping...' : 'Start Scraping'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ScrapeModal;
