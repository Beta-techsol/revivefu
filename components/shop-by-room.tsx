import React, { useState, useEffect } from 'react';
import { Product } from '@/types';
import { Heart, BarChart3, Eye, ShoppingBag } from 'lucide-react';

interface ShopByRoomProps {
  products: Product[];
}

const ShopByRoom: React.FC<ShopByRoomProps> = ({ products }) => {
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [compareList, setCompareList] = useState<string[]>([]);

  useEffect(() => {
    // Load wishlist and compareList from localStorage on component mount
    const storedWishlist = localStorage.getItem('wishlist');
    if (storedWishlist) {
      setWishlist(JSON.parse(storedWishlist));
    }

    const storedCompareList = localStorage.getItem('compareList');
    if (storedCompareList) {
      setCompareList(JSON.parse(storedCompareList));
    }
  }, []);

  useEffect(() => {
    // Save wishlist to localStorage whenever it changes
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    // Save compareList to localStorage whenever it changes
    localStorage.setItem('compareList', JSON.stringify(compareList));
  }, [compareList]);


  const handleWishlist = (productId: string) => {
    if (isInWishlist(productId)) {
      setWishlist(wishlist.filter((id) => id !== productId));
    } else {
      setWishlist([...wishlist, productId]);
    }
  };

  const handleCompare = (productId: string) => {
    if (isInCompare(productId)) {
      setCompareList(compareList.filter((id) => id !== productId));
    } else {
      setCompareList([...compareList, productId]);
    }
  };

  const handleQuickView = (productId: string) => {
    alert(`Quick view for product ${productId}`);
  };

  const handleAddToCart = (productId: string) => {
    alert(`Added product ${productId} to cart`);
  };

  const isInWishlist = (productId: string) => {
    return wishlist.includes(productId);
  };

  const isInCompare = (productId: string) => {
    return compareList.includes(productId);
  };


  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map((product) => (
        <div key={product.id} className="relative rounded-md shadow-md overflow-hidden">
          <img src={product.image || "/placeholder.svg"} alt={product.name} className="w-full h-64 object-cover" />
          <div className="p-4">
            <h3 className="text-lg font-semibold">{product.name}</h3>
            <p className="text-gray-600">${product.price}</p>
          </div>

          {/* Action buttons */}
          <div className="absolute top-3 right-3 flex flex-col space-y-2">
            {/* Wishlist */}
            <button
              onClick={() => handleWishlist(product.id)}
              className={`group/btn relative overflow-hidden transition-all duration-300 ${
                isInWishlist(product.id)
                  ? "w-8 h-8 bg-[#C53D39] text-white"
                  : "w-8 h-8 bg-white/90 text-gray-600 hover:w-24 hover:bg-[#C53D39] hover:text-white"
              } rounded-full flex items-center justify-center`}
            >
              <Heart className={`h-4 w-4 transition-all duration-300 ${isInWishlist(product.id) ? "fill-current" : ""}`} />
              <span className="absolute left-8 text-xs font-medium opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                Wishlist
              </span>
            </button>

            {/* Compare */}
            <button
              onClick={() => handleCompare(product.id)}
              className={`group/btn relative overflow-hidden transition-all duration-300 ${
                isInCompare(product.id)
                  ? "w-8 h-8 bg-[#C53D39] text-white"
                  : "w-8 h-8 bg-white/90 text-gray-600 hover:w-24 hover:bg-[#C53D39] hover:text-white"
              } rounded-full flex items-center justify-center`}
            >
              <BarChart3 className="h-4 w-4 transition-all duration-300" />
              <span className="absolute left-8 text-xs font-medium opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                Compare
              </span>
            </button>

            {/* Quick View */}
            <button
              onClick={() => handleQuickView(product.id)}
              className="group/btn relative overflow-hidden w-8 h-8 bg-white/90 text-gray-600 hover:w-24 hover:bg-[#C53D39] hover:text-white rounded-full flex items-center justify-center transition-all duration-300"
            >
              <Eye className="h-4 w-4 transition-all duration-300" />
              <span className="absolute left-8 text-xs font-medium opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                Quick View
              </span>
            </button>

            {/* Add to Cart */}
            <button
              onClick={() => handleAddToCart(product.id)}
              disabled={product.isSoldOut}
              className={`group/btn relative overflow-hidden transition-all duration-300 rounded-full flex items-center justify-center ${
                product.isSoldOut
                  ? "w-8 h-8 bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "w-8 h-8 bg-white/90 text-gray-600 hover:w-24 hover:bg-[#C53D39] hover:text-white"
              }`}
            >
              <ShoppingBag className="h-4 w-4 transition-all duration-300" />
              <span className="absolute left-8 text-xs font-medium opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                {product.isSoldOut ? "Sold Out" : "Add Cart"}
              </span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ShopByRoom;
