import StatsPanel from './StatsPanel';
import ScrapeModal from './ScrapeModal';

function Dashboard({ onScrape, stats, showScrapeModal, onShowScrapeModal, onCloseScrapeModal }) {
  const handleScrapeSuccess = async (searchTerm) => {
    const result = await onScrape(searchTerm);
    if (result.success) {
      onCloseScrapeModal();
    }
    return result;
  };

  return (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="font-mono text-3xl text-gray-900">Amazon Product Dashboard</h1>
          <p className="font-mono text-gray-600 mt-1">Track products, prices, and ratings</p>
        </div>
        <button
          onClick={onShowScrapeModal}
          className="font-mono mt-4 md:mt-0 btn-primary"
        >
          + Scrape New Products
        </button>
      </div>

      <StatsPanel stats={stats} />

      {showScrapeModal && (
        <ScrapeModal
          onClose={onCloseScrapeModal}
          onScrape={handleScrapeSuccess}
        />
      )}
    </div>
  );
}

export default Dashboard;
