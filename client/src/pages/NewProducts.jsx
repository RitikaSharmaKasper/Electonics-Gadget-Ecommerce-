// import React, { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
// import Card from "../components/Card";
// import Navbar from "../components/Navbar";
// import Breadcrumbs from "../components/Breadcrumbs";
// import Filter from "../components/Filter";
// import Footer from "../sections/Footer";
// import Categories from "../components/Categories";
// import FilterProducts from "../components/FilterProducts";
// import axiosInstance from "../api/axiosInstance";
// import { Skeleton } from "boneyard-js/react";

// function NewProducts() {
//   const [items, setItems] = useState([]);
//   const [param, setParam] = useState("");
//   const [color, setColor] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const [page, setPage] = useState(1);
//   const [hasMore, setHasMore] = useState(true);
//   const [loadingMore, setLoadingMore] = useState(false);

//   // const allProducts = useSelector((state) => state.products.product);

//   const fetchProducts = async (pageNum = 1, isLoadMore = false) => {
//     try {
//       if (isLoadMore) {
//         setLoadingMore(true);
//       } else {
//         setLoading(true);
//       }

//       const res = await axiosInstance.get(
//         `/product/all?page=${pageNum}&limit=20`,
//       );

//       const productData = res?.data?.data || [];

//       if (isLoadMore) {
//         setItems((prev) => [...prev, ...productData]);
//       } else {
//         setItems(productData);
//       }

//       // 🔥 check hasMore
//       if (productData.length < 20) {
//         setHasMore(false);
//       }

//       setError("");
//     } catch (err) {
//       console.error(err);
//       setError("Failed to load products");
//     } finally {
//       setLoading(false);
//       setLoadingMore(false);
//     }
//   };

//   useEffect(() => {
//     fetchProducts(1);
//   }, []);

//   const loadMore = () => {
//     if (!hasMore || loadingMore) return;

//     const nextPage = page + 1;
//     setPage(nextPage);
//     fetchProducts(nextPage, true);
//   };

//   const sort = (val) => {
//     setItems((prev) => {
//       const sorted = [...prev];
//       switch (val) {
//         case "high":
//           return sorted.sort(
//             (a, b) =>
//               b.variants[0].variantSellingPrice -
//               a.variants[0].variantSellingPrice,
//           );

//         case "low":
//           return sorted.sort(
//             (a, b) =>
//               a.variants[0].variantSellingPrice -
//               b.variants[0].variantSellingPrice,
//           );

//         case "atoz":
//           return sorted.sort((a, b) =>
//             (a.productTittle || "").localeCompare(b.productTittle || ""),
//           );

//         case "rating":
//           return sorted.sort((a, b) => {
//             const avgA =
//               a.reviews?.reduce((sum, r) => sum + r.rating, 0) /
//                 a.reviews?.length || 0;
//             const avgB =
//               b.reviews?.reduce((sum, r) => sum + r.rating, 0) /
//                 b.reviews?.length || 0;

//             return avgB - avgA;
//           });

//         case "latest":
//           return sorted.reverse();

//         default:
//           return prev;
//       }
//     });
//   };

//   return (
//     <>
//       <Navbar />
//       <Breadcrumbs title={"Best Selling Products"} />

//       <section className="lg:px-20 md:px-[60px] px-4 pb-[23px] bg-gray-50">
//         <FilterProducts text={"Best Selling Products"} sort={sort} />

//         <div
//           className="flex lg:gap-6 justify-center h-[80vh] overflow-y-auto"
//           onScroll={(e) => {
//             const { scrollTop, scrollHeight, clientHeight } = e.target;

//             if (scrollHeight - scrollTop <= clientHeight + 50) {
//               loadMore();
//             }
//           }}
//         >
//           <Skeleton name="product-grid" loading={loading}>
//             {error ? (
//               <p className="text-red-500">{error}</p>
//             ) : items.length > 0 ? (
//               <>
//                 <Card cardData={items} />

//                 {loadingMore && (
//                   <p className="text-center py-4">Loading more...</p>
//                 )}

//                 {!hasMore && (
//                   <p className="text-center py-4 text-gray-500">
//                     No more products
//                   </p>
//                 )}
//               </>
//             ) : (
//               <p>No products found.</p>
//             )}
//           </Skeleton>
//         </div>
//       </section>

//       <Footer />
//     </>
//   );
// }

// export default NewProducts;
// //

import React, { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import Navbar from "../components/Navbar";
import Breadcrumbs from "../components/Breadcrumbs";
import Footer from "../sections/Footer";
import FilterProducts from "../components/FilterProducts";
import axiosInstance from "../api/axiosInstance";
import { Skeleton } from "boneyard-js/react";
import { getCart, getWishlist } from "../services/CartService";
import { useNavigate } from "react-router-dom";
import Card from "../components/Card";

function NewProducts() {
  const { isAuthenticated } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [visibleCount, setVisibleCount] = useState(20); // Products per page

  // Sync cart from backend (only if authenticated)
  const syncCartFromBackend = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const res = await getCart();
      const cartData = res?.data?.data || res?.data;
      setCartItems(cartData?.items || []);
    } catch (err) {
      console.error("Cart sync failed:", err);
    }
  }, [isAuthenticated]);

  // Sync wishlist from backend (only if authenticated)
  const syncWishlistFromBackend = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const res = await getWishlist();
      const wishlistData = res?.data?.data || res?.data;
      setWishlistItems(wishlistData?.items || []);
    } catch (err) {
      console.error("Wishlist sync failed:", err);
    }
  }, [isAuthenticated]);

  // Authentication check helper
  const requireAuth = (message) => {
    if (!isAuthenticated) {
      toast.error(message);
      return false;
    }
    return true;
  };

  // Handle Add to Cart
  const handleAddToCart = async (product) => {
    if (!requireAuth("Please login first to add items to cart")) return;

    const defaultVariant = product.variants?.[0];
    if (!defaultVariant) {
      toast.error("No variant available");
      return;
    }

    const variantId = defaultVariant._id;
    const productId = product._id;

    try {
      await addToCart({
        productId: productId,
        variantId: variantId,
        quantity: 1,
      });

      // Refresh cart and wishlist counts
      await syncCartFromBackend();
      await syncWishlistFromBackend();

      toast.success("Added to cart!");
    } catch (err) {
      console.error("Error adding to cart:", err);
      toast.error(err.response?.data?.message || "Failed to add to cart");
    }
  };

  // Handle Wishlist Toggle
  const handleWishlistToggle = async (e, product) => {
    e.preventDefault();
    e.stopPropagation();

    if (!requireAuth("Please login first to add items to wishlist")) return;

    const defaultVariant = product.variants?.[0];
    const variantId = defaultVariant?._id;
    const productId = product._id;

    const isInWishlist = wishlistItems.some(
      (i) =>
        String(i.productId || i.product) === String(productId) &&
        String(i.variantId) === String(variantId)
    );

    try {
      if (isInWishlist) {
        await removeFromWishlist({ productId: productId, variantId });
        await syncWishlistFromBackend();
        toast.success("Removed from wishlist");
      } else {
        await addToWishlist({
          productId: productId,
          variantId,
        });
        await syncWishlistFromBackend();
        toast.success("Added to wishlist");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  };

  // Fetch products with pagination
  const fetchProducts = async (pageNum = 1, isLoadMore = false) => {
    try {
      if (isLoadMore) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      const res = await axiosInstance.get(`/product/all?page=${pageNum}&limit=${visibleCount}`);
      const productData = res?.data?.data || [];

      if (isLoadMore) {
        setItems((prev) => [...prev, ...productData]);
      } else {
        setItems(productData);
      }

      if (productData.length < visibleCount) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }

      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to load products");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchProducts(1);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      syncCartFromBackend();
      syncWishlistFromBackend();
    } else {
      setCartItems([]);
      setWishlistItems([]);
    }
  }, [isAuthenticated, syncCartFromBackend, syncWishlistFromBackend]);

  // Listen for cart/wishlist updates from other components
  useEffect(() => {
    const handleCartUpdate = () => {
      if (isAuthenticated) syncCartFromBackend();
    };
    const handleWishlistUpdate = () => {
      if (isAuthenticated) syncWishlistFromBackend();
    };

    window.addEventListener("cartUpdated", handleCartUpdate);
    window.addEventListener("wishlistUpdated", handleWishlistUpdate);

    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate);
      window.removeEventListener("wishlistUpdated", handleWishlistUpdate);
    };
  }, [isAuthenticated, syncCartFromBackend, syncWishlistFromBackend]);

  const loadMore = () => {
    if (!hasMore || loadingMore) return;
    const nextPage = page + 1;
    setPage(nextPage);
    fetchProducts(nextPage, true);
  };

  // Product Card Component (Same as LatestProducts)
  const ProductCard = ({ product }) => {
    const defaultVariant = product.variants?.[0];
    const variantId = defaultVariant?._id;

    const inCart = isAuthenticated && cartItems.some(
      (i) =>
        String(i.productId || i.product) === String(product._id) &&
        String(i.variantId) === String(variantId)
    );

    const inWishlist = isAuthenticated && wishlistItems.some(
      (i) =>
        String(i.productId || i.product) === String(product._id) &&
        String(i.variantId) === String(variantId)
    );

    const productImage = defaultVariant?.variantImage?.[0]?.url || product.image || "/placeholder.png";
    const mrp = defaultVariant?.variantMrp || product.mrp || 0;
    const sellingPrice = defaultVariant?.variantSellingPrice || product.defaultPrice || 0;
    const discountPercent = mrp > 0 && sellingPrice > 0 && mrp !== sellingPrice
      ? Math.round(((mrp - sellingPrice) / mrp) * 100)
      : product.discount || 0;

    const handleAddToCartClick = async (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (!inCart) {
        await handleAddToCart(product);
      }
    };

    const handleGoToCart = (e) => {
      e.preventDefault();
      e.stopPropagation();
      navigate("/bag");
    };

    return (
      <div className="bg-white p-2 rounded-lg group block transition-shadow duration-300 hover:shadow-lg">
        <Link to={`/product/${product.slug || product._id}`} onClick={(e) => e.stopPropagation()}>
          <div className="relative w-full overflow-hidden rounded-md">
            <button
              type="button"
              className="absolute top-2 right-2 bg-white shadow-md rounded-full p-1.5 z-10 hover:scale-110 transition-transform"
              onClick={(e) => handleWishlistToggle(e, product)}
            >
              <Heart
                className="w-4 h-4"
                fill={inWishlist ? "red" : "white"}
                stroke={inWishlist ? "red" : "black"}
                strokeWidth={1.5}
              />
            </button>
            <img
              className="w-full aspect-square object-contain transition-transform duration-300 group-hover:scale-110"
              src={productImage}
              alt={product.name || product.productTittle}
              loading="lazy"
              onError={(e) => { e.target.src = "/placeholder.png"; }}
            />
          </div>

          <div className="mt-3">
            <h3 className="text-sm font-merriweather text-[#55516e] font-normal line-clamp-1 mb-2">
              {product.name || product.productTittle || "Product Name"}
            </h3>

            <div className="flex items-center flex-wrap gap-2">
              <span className="text-gray-900 font-medium">₹{sellingPrice || "--"}</span>
              {mrp > 0 && sellingPrice > 0 && mrp !== sellingPrice && (
                <span className="text-gray-400 text-xs line-through font-light">₹{mrp}</span>
              )}
              {discountPercent > 0 && (
                <>
                  <div className="border-l border-[#DBDBDB] h-3"></div>
                  <span className="text-[#35C772] text-xs">{Math.round(discountPercent)}% Off</span>
                </>
              )}
            </div>
          </div>
        </Link>

        <button
          className={`w-full rounded-md flex justify-center items-center gap-4 p-2 mt-2 transition-all duration-300 cursor-pointer ${
            inCart ? "bg-white border border-[#5a1720] text-black" : "  bg-[#7A1F2B] border border-[#5a1720] text-white"
          }`}
          onClick={inCart ? handleGoToCart : handleAddToCartClick}
        >
          {inCart ? (
            <>
              <ShoppingCart className="w-4 h-4" />
              <span className="text-[12px]">Go to Cart</span>
            </>
          ) : (
            <>
              <FaBagShopping className="w-3 h-3" />
              <span className="text-[12px]">Add To Cart</span>
            </>
          )}
        </button>
      </div>
    );
  };

  // Sorting function
  const sort = (val) => {
    setItems((prev) => {
      const sorted = [...prev];
      switch (val) {
        case "high":
          return sorted.sort((a, b) => b.variants[0]?.variantSellingPrice - a.variants[0]?.variantSellingPrice);
        case "low":
          return sorted.sort((a, b) => a.variants[0]?.variantSellingPrice - b.variants[0]?.variantSellingPrice);
        case "atoz":
          return sorted.sort((a, b) => (a.productTittle || "").localeCompare(b.productTittle || ""));
        case "rating":
          return sorted.sort((a, b) => {
            const avgA = a.reviews?.reduce((sum, r) => sum + r.rating, 0) / a.reviews?.length || 0;
            const avgB = b.reviews?.reduce((sum, r) => sum + r.rating, 0) / b.reviews?.length || 0;
            return avgB - avgA;
          });
        case "latest":
          return sorted.reverse();
        default:
          return prev;
      }
    });
  };

  return (
    <>
      <Navbar />
      <Breadcrumbs title={"Best Accessories"} />

      <section className="lg:px-20 md:px-[60px] px-4 pb-[23px] bg-gray-50 ">
        <FilterProducts text={"Best Accessories"} sort={sort} />

        <div
          className="flex lg:gap-6 justify-center min-h-[80vh] overflow-y-auto"
          onScroll={(e) => {
            const { scrollTop, scrollHeight, clientHeight } = e.target;
            if (scrollHeight - scrollTop <= clientHeight + 100) {
              loadMore();
            }
          }}
        >
          <Skeleton name="product-grid" loading={loading}>
            {error ? (
              <p className="text-red-500">{error}</p>
            ) : items.length > 0 ? (
              <>
                <Card
                  cardData={items}
                  cartItems={cartItems}
                  wishlistItems={wishlistItems}
                  onCartUpdate={syncCartFromBackend}
                  onWishlistUpdate={syncWishlistFromBackend}
                />

                {loadingMore && (
                  <div className="flex justify-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#5a1720]"></div>
                  </div>
                )}

                {!hasMore && items.length > 0 && (
                  <p className="text-center py-4 text-gray-500">No more products</p>
                )}
              </>
            ) : (
              <p className="text-center py-10">No products found.</p>
            )}
          </Skeleton>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default NewProducts;