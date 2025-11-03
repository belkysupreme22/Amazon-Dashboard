import { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import Header from './components/Header';
import ProductGrid from './components/ProductGrid';
import SearchBar from './components/SearchBar';
import StatsPanel from './components/StatsPanel';
import ScrapeModal from './components/ScrapeModal';
import { api } from './services/api';

function App() {
  const [allProducts, setAllProducts] = useState([]); 
  const [filteredProducts, setFilteredProducts] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [stats, setStats] = useState(null);
  const [showScrapeModal, setShowScrapeModal] = useState(false);

  // Fetch products on mount
  useEffect(() => {
    fetchProducts();
    fetchStats();
  }, []);
  

  // Fetch products with current filters
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await api.get(`/products?limit=100`);
      setAllProducts(data.products);
      setFilteredProducts(data.products);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch products:', err);
      setError('Failed to load products. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  

  // Fetch dashboard statistics
  const fetchStats = async () => {
    try {
      const data = await api.get('/products/stats/summary');
      setStats(data);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  useEffect(() => {
    let updated = [...allProducts];
  
    if (searchTerm.trim() !== '') {
      updated = updated.filter(p =>
        p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
  
    if (sortBy === 'price_asc') {
      updated.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortBy === 'price_desc') {
      updated.sort((a, b) => (b.price || 0) - (a.price || 0));
    } else if (sortBy === 'rating') {
      updated.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortBy === 'newest') {
      updated.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
  
    setFilteredProducts(updated);
  }, [searchTerm, sortBy, allProducts]);
  

  const handleSearch = () => {
    fetchProducts();
  };

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    if (!value) {
      setTimeout(() => fetchProducts(), 100);
    }
  };

  const handleScrape = async (searchTerm) => {
    try {
      setLoading(true);
      await api.post('/scrape', { searchTerm, maxProducts: 10 });
      
      await fetchProducts();
      await fetchStats();
      
      return { success: true };
    } catch (err) {
      console.error('Scraping failed:', err);
      return { 
        success: false, 
        error: err.response?.data?.message || 'Scraping failed' 
      };
    } finally {
      setLoading(false);
    }
  };

  const handleShowScrapeModal = () => setShowScrapeModal(true);
  const handleCloseScrapeModal = () => setShowScrapeModal(false);

  return (
    <div className="min-h-screen">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <Dashboard 
          onScrape={handleScrape}
          stats={stats}
          showScrapeModal={showScrapeModal}
          onShowScrapeModal={handleShowScrapeModal}
          onCloseScrapeModal={handleCloseScrapeModal}
        />
        
        <div className="mt-8">
        <SearchBar
  searchTerm={searchTerm}
  onSearchChange={setSearchTerm}
  sortBy={sortBy}
  onSortChange={setSortBy}
/>

        </div>

        {loading && (
          <div className="font-mono text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            <p className="mt-4 text-gray-600">Loading products...</p>
          </div>
        )}

        {error && (
          <div className="font-mono bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {!loading && !error && (
         <ProductGrid 
         products={filteredProducts} 
         onEmptyAction={handleShowScrapeModal}
       />
       
        )}
      </div>
    </div>
  );
}

export default App;
