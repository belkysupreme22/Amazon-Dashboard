import { useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function ProductModal({ product, onClose }) {

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const formatPriceHistory = () => {
    if (!product.priceHistory || product.priceHistory.length === 0) {
      return [];
    }

    return product.priceHistory
      .slice()
      .reverse()
      .map((entry, index) => ({
        price: entry.price,
        date: new Date(entry.date).toLocaleDateString(),
        label: `Day ${index + 1}`,
      }));
  };

  const priceHistory = formatPriceHistory();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-xl">
        <div className="overflow-y-auto max-h-[90vh]">
      
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-2xl font-mono font-bold text-gray-900">Product Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        
        <div className="p-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            
            <div className="bg-gray-100 rounded-lg overflow-hidden h-64 flex items-center justify-center">
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.title}
                  className="max-w-full max-h-full object-contain p-4"
                />
              ) : (
                <svg className="w-24 h-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              )}
            </div>

            
            <div>
              <h3 className="text-2xl font-mono font-bold text-gray-900 mb-4">{product.title}</h3>

              <div className="space-y-4">
                
                <div>
                  <p className="text-sm font-mono font-medium text-gray-600">Price</p>
                  <p className="text-3xl font-mono font-bold text-primary-600">
                    ${product.price.toFixed(2)}
                    <span className="text-base font-mono text-gray-600 ml-2">{product.currency}</span>
                  </p>
                </div>

              
                {product.rating && (
                  <div>
                    <p className="text-sm font-mono font-medium text-gray-600">Rating</p>
                    <div className="flex items-center mt-1">
                      <span className="text-yellow-500 text-2xl mr-2">★</span>
                      <span className="text-2xl font-mono font-bold">{product.rating.toFixed(1)}</span>
                      {product.reviewsCount && (
                        <span className="text-gray-600 font-mono ml-2">
                          ({product.reviewsCount.toLocaleString()} reviews)
                        </span>
                      )}
                    </div>
                  </div>
                )}

                
                <div>
                  <p className="text-sm font-mono font-medium text-gray-600">Last Updated</p>
                  <p className="text-gray-900 font-mono">
                    {new Date(product.scrapedAt).toLocaleString()}
                  </p>
                </div>

            
                <a
                  href={product.productUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary inline-block font-mono"
                >
                  View on Amazon ↗
                </a>
              </div>
            </div>
          </div>

          
          {priceHistory.length > 0 && (
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-xl font-mono font-bold text-gray-900 mb-4">Price History</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={priceHistory}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [`$${value.toFixed(2)}`, 'Price']}
                    labelStyle={{ fontWeight: 'bold' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="price"
                    stroke="#0284c7"
                    strokeWidth={2}
                    dot={{ fill: '#0284c7', r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
      </div>
    </div>
  );
}

export default ProductModal;
