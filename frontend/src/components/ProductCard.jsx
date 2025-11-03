import { useState } from 'react';
import ProductModal from './ProductModal';

function ProductCard({ product }) {
  const [showModal, setShowModal] = useState(false);

  
  const getPriceTrend = () => {
    if (!product.priceHistory || product.priceHistory.length < 2) {
      return null;
    }

    const history = product.priceHistory;
    const currentPrice = history[0].price;
    const previousPrice = history[1].price;
    const change = currentPrice - previousPrice;
    const percentChange = ((change / previousPrice) * 100).toFixed(1);

    return {
      change,
      percentChange,
      isIncreasing: change > 0,
    };
  };

  const priceTrend = getPriceTrend();


  const displayTitle = product.title.length > 70 
    ? product.title.substring(0, 70) + '...' 
    : product.title;

  return (
    <>
      <div 
        className="card cursor-pointer hover:scale-105 transition-transform duration-200"
        onClick={() => setShowModal(true)}
      >
      
        <div className="relative h-48 bg-gray-100 overflow-hidden">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.title}
              className="w-full h-full object-contain p-2"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src =
                  "https://placehold.co/300x300?text=No+Image&font=mono";
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
        </div>

        
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
            {displayTitle}
          </h3>

          
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl font-bold text-gray-900">
              ${product.price.toFixed(2)}
            </span>
            {priceTrend && (
              <span
                className={`text-sm font-medium px-2 py-1 rounded ${
                  priceTrend.isIncreasing
                    ? 'bg-red-100 text-red-800'
                    : 'bg-green-100 text-green-800'
                }`}
              >
                {priceTrend.isIncreasing ? '+' : ''}{priceTrend.percentChange}%
              </span>
            )}
          </div>

          
          <div className="flex items-center justify-between text-sm">
            {product.rating ? (
              <div className="flex items-center">
                <span className="text-yellow-500 mr-1">★</span>
                <span className="font-medium">{product.rating.toFixed(1)}</span>
                {product.reviewsCount && (
                  <span className="text-gray-500 ml-2">
                    ({product.reviewsCount.toLocaleString()} reviews)
                  </span>
                )}
              </div>
            ) : (
              <span className="text-gray-500">No ratings</span>
            )}

            <span className="text-gray-500 text-xs">
              {new Date(product.scrapedAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

    
      {showModal && (
        <ProductModal
          product={product}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}

export default ProductCard;
