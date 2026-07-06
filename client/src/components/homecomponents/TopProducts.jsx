import Title from "../Title";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { FaBagShopping } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Heart, ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";

function TopProducts() {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.user);
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [guestCartItems, setGuestCartItems] = useState([]);
  const [guestWishlistItems, setGuestWishlistItems] = useState([]);

  const syncGuestState = () => {
    setGuestCartItems(JSON.parse(localStorage.getItem("cart") || "[]"));
    setGuestWishlistItems(JSON.parse(localStorage.getItem("wishlist") || "[]"));
  };

  useEffect(() => {
    syncGuestState();

    window.addEventListener("cartUpdated", syncGuestState);
    window.addEventListener("wishlistUpdated", syncGuestState);

    return () => {
      window.removeEventListener("cartUpdated", syncGuestState);
      window.removeEventListener("wishlistUpdated", syncGuestState);
    };
  }, []);

  const MIN_PRODUCTS = 4;
  const MAX_PRODUCTS = 5;
  const MAX_COLLECTIONS = 4;

  // Authentication check helper
  const requireAuth = (message) => {
    if (!isAuthenticated) {
      toast.error(message);
      // navigate("/login");
      return false;
    }
    return true;
  };

  // Sync cart from backend (only if authenticated)
  const syncCartFromBackend = async () => {
    if (!isAuthenticated) return;
    try {
      const res = await axiosInstance.get("/cart");
      if (res.data?.data) {
        setCartItems(res.data.data.items || []);
      }
    } catch (err) {
      console.error("Cart sync failed:", err);
    }
  };

  // Sync wishlist from backend (only if authenticated)
  const syncWishlistFromBackend = async () => {
    if (!isAuthenticated) return;
    try {
      const res = await axiosInstance.get("/wishlist");
      if (res.data?.data) {
        setWishlistItems(res.data.data.items || []);
      }
    } catch (err) {
      console.error("Wishlist sync failed:", err);
    }
  };

  // Fetch collection products (always accessible)
  const fetchCollections = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(
        `/collection/get-all-collections`,
      );

      let collectionsData = [];
      if (response.data?.success && response.data?.data?.collections) {
        collectionsData = response.data.data.collections;
      } else if (Array.isArray(response.data)) {
        collectionsData = response.data;
      } else if (response.data?.collections) {
        collectionsData = response.data.collections;
      }

      const validCollections = collectionsData
        .filter(
          (c) => c.isActive === true && c.products?.length >= MIN_PRODUCTS,
        )
        .slice(0, MAX_COLLECTIONS);
      setCollections(validCollections);
    } catch (error) {
      console.error("Error fetching collections:", error);
      setCollections([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      syncCartFromBackend();
      syncWishlistFromBackend();
    } else {
      // Clear cart/wishlist when logged out
      setCartItems([]);
      setWishlistItems([]);
    }
  }, [isAuthenticated]);

  // Add to cart handler (requires login)
  const handleAddToCart = async (product) => {
    const defaultVariant = product.variants?.[0];

    if (!defaultVariant) {
      toast.error("No variant available");
      return;
    }

    const variantId = defaultVariant._id;
    const productId = product._id;

    if (!isAuthenticated) {
      const guestCart = JSON.parse(localStorage.getItem("cart") || "[]");

      const exists = guestCart.find(
        (i) => i.productId === productId && i.variantId === variantId,
      );

      const updatedCart = exists
        ? guestCart.map((i) =>
            i.productId === productId && i.variantId === variantId
              ? { ...i, quantity: (i.quantity || 1) + 1 }
              : i,
          )
        : [
            ...guestCart,
            {
              productId,
              variantId,
              quantity: 1,
              title: product.productTittle || product.name || "Product Name",
              image:
                defaultVariant?.variantImage?.[0]?.url ||
                product.image ||
                "/placeholder.png",
              price:
                defaultVariant?.variantSellingPrice ||
                product.defaultPrice ||
                0,
            },
          ];

      localStorage.setItem("cart", JSON.stringify(updatedCart));
      setGuestCartItems(updatedCart);

      setTimeout(() => {
        window.dispatchEvent(new Event("cartUpdated"));
      }, 0);

      toast.success("Added to cart. Login to view cart.");
      return;
    }

    try {
      const response = await axiosInstance.post("/cart/add-to-cart", {
        productId,
        variantId,
        quantity: 1,
      });

      if (response.data?.data) {
        setCartItems(response.data.data.items || []);
      }

      window.dispatchEvent(new Event("cartUpdated"));
      toast.success("Added to cart!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add to cart");
    }
  };

  // Wishlist toggle handler (requires login)
  const handleWishlistToggle = async (e, product) => {
    e.preventDefault();
    e.stopPropagation();

    const defaultVariant = product.variants?.[0];

    if (!defaultVariant) {
      toast.error("No variant available");
      return;
    }

    const variantId = defaultVariant._id;
    const productId = product._id;

    if (!isAuthenticated) {
      const guestWishlist = JSON.parse(
        localStorage.getItem("wishlist") || "[]",
      );

      const exists = guestWishlist.some(
        (i) => i.productId === productId && i.variantId === variantId,
      );

      const updatedWishlist = exists
        ? guestWishlist.filter(
            (i) => !(i.productId === productId && i.variantId === variantId),
          )
        : [
            ...guestWishlist,
            {
              productId,
              variantId,
              title: product.productTittle || product.name || "Product Name",
              image:
                defaultVariant?.variantImage?.[0]?.url ||
                product.image ||
                "/placeholder.png",
              price:
                defaultVariant?.variantSellingPrice ||
                product.defaultPrice ||
                0,
            },
          ];

      localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
      setGuestWishlistItems(updatedWishlist);

      setTimeout(() => {
        window.dispatchEvent(new Event("wishlistUpdated"));
      }, 0);

      toast.success(exists ? "Removed from wishlist" : "Added to wishlist");
      return;
    }

    const isInWishlist = wishlistItems.some(
      (i) =>
        String(i.productId || i.product) === String(productId) &&
        String(i.variantId) === String(variantId),
    );

    try {
      if (isInWishlist) {
        await axiosInstance.delete("/wishlist/remove-item", {
          data: { productId, variantId },
        });
        toast.success("Removed from wishlist");
      } else {
        await axiosInstance.post("/wishlist/add-to-wishlist", {
          productId,
          variantId,
        });
        toast.success("Added to wishlist");
      }

      await syncWishlistFromBackend();
      window.dispatchEvent(new Event("wishlistUpdated"));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update wishlist");
    }
  };

  // Spotlight cursor-follow effect (kept, still used on hover)
  const handleCardPointerMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty("--spot-x", `${x}px`);
    card.style.setProperty("--spot-y", `${y}px`);
  };

  // Product Card Component — same logic, redesigned visuals:
  // clean rounded card, floating glass badges, pill-shaped CTA button
  const ProductCard = ({ product }) => {
    const defaultVariant = product.variants?.[0];
    const variantId = defaultVariant?._id;

    // Only check cart/wishlist status if authenticated
    const inCart = isAuthenticated
      ? cartItems.some(
          (i) =>
            String(i.productId || i.product) === String(product._id) &&
            String(i.variantId) === String(variantId),
        )
      : guestCartItems.some(
          (i) =>
            String(i.productId) === String(product._id) &&
            String(i.variantId) === String(variantId),
        );

    const inWishlist = isAuthenticated
      ? wishlistItems.some(
          (i) =>
            String(i.productId || i.product) === String(product._id) &&
            String(i.variantId) === String(variantId),
        )
      : guestWishlistItems.some(
          (i) =>
            String(i.productId) === String(product._id) &&
            String(i.variantId) === String(variantId),
        );

    const productImage =
      defaultVariant?.variantImage?.[0]?.url ||
      product.image ||
      "/placeholder.png";
    const mrp = defaultVariant?.variantMrp || 0;
    const sellingPrice = defaultVariant?.variantSellingPrice || 0;
    const discountPercent =
      mrp > 0 && sellingPrice > 0
        ? Math.round(((mrp - sellingPrice) / mrp) * 100)
        : 0;

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
      <motion.div
        whileHover={{ y: -6, boxShadow: "0 18px 34px -14px rgba(122,31,43,0.28)" }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="bg-white rounded-2xl p-3 group block border border-[#F0EEFF] shadow-sm"
      >
        <Link
          to={`/product/${product.slug || product._id}`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Fully rounded image container with spotlight effect */}
          <div
            className="relative w-full overflow-hidden rounded-xl aspect-[3/4] bg-[#FAF9FB] isolate"
            onMouseMove={handleCardPointerMove}
          >
            {/* Spotlight */}
            <div
              className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-60 transition-opacity duration-500 z-[1]"
              style={{
                background:
                  "radial-gradient(220px circle at var(--spot-x, 45%) var(--spot-y, 45%), rgba(18,107,109,0.16), transparent 65%)",
              }}
            />

            {/* Discount badge, top-left, only shown when applicable */}
            {discountPercent > 0 && (
              <span className="absolute top-2 left-2 z-10 bg-[#7A1F2B] text-white text-[10px] font-semibold tracking-wide px-2 py-1 rounded-full shadow-sm">
                {discountPercent}% OFF
              </span>
            )}

            {/* Wishlist button, glass-morphism style */}
            <button
              type="button"
              className="absolute top-2 right-2 backdrop-blur-md bg-white/70 shadow-md rounded-full p-1.5 z-10 hover:scale-110 transition-transform duration-300"
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
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              src={productImage}
              alt={product.productTittle}
              loading="lazy"
              onError={(e) => {
                e.target.src = "/placeholder.png";
              }}
            />
          </div>

          <div className="mt-3 px-1">
            <h3 className="text-sm font-merriweather text-[#55516e] font-normal line-clamp-1 mb-1.5">
              {product.productTittle}
            </h3>

            <div className="flex items-center flex-wrap gap-2">
              <span className="text-gray-900 font-semibold">
                ₹{sellingPrice || mrp || "--"}
              </span>
              {mrp > 0 && sellingPrice > 0 && mrp !== sellingPrice && (
                <span className="text-[#747877] text-xs line-through font-light">
                  ₹{mrp}
                </span>
              )}
            </div>
          </div>
        </Link>

        {/* Button placed OUTSIDE the Link to prevent navigation — pill shape */}
        <button
          className={`w-full rounded-full flex justify-center items-center gap-2 py-2.5 mt-3 text-[12px] font-medium transition-all duration-300 cursor-pointer ${
            inCart
              ? "bg-white border border-[#7A1F2B] text-[#7A1F2B] hover:bg-[#FBF2F3]"
              : "bg-[#7A1F2B] border border-[#7A1F2B] text-white hover:bg-[#5f1621]"
          }`}
          onClick={inCart ? handleGoToCart : handleAddToCartClick}
        >
          {inCart ? (
            <>
              <ShoppingCart className="w-4 h-4" />
              <span>Go to Cart</span>
            </>
          ) : (
            <>
              <FaBagShopping className="w-3 h-3" />
              <span>Add To Cart</span>
            </>
          )}
        </button>
      </motion.div>
    );
  };

  if (loading) {
    return (
      <div className="lg:px-20 md:px-[60px] px-4 py-[23px] bg-white shadow-sm rounded-lg border border-[#F0EEFF]">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7A1F2B] mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading products...</p>
          </div>
        </div>
      </div>
    );
  }

  // Entrance animation restyled: gentle fade + scale-in instead of slide-up
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.06 },
    },
  };

  const cardVariants = {
    hidden: { scale: 0.94, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <div className="lg:px-20 md:px-[60px] px-4 py-[20px] bg-white shadow-sm rounded-lg border border-[#F0EEFF]">
      {/* Main Header */}
      <div
        className="flex items-center justify-between mb-6"
        style={{
          color: "#126B6D",
          fontFamily: "Stack Sans Notch', 'sans-serif",
        }}
      >
        <p className="md:items-start px-2 text-[30px]  md: text-[30px] sm:text-[30px] text-[#7A1F2B] font-stack-sans">Featured Collection</p>
        <Link
          className="whitespace-nowrap font-merriweather text-gray-800 hover:text-[#7A1F2B] px-2 text-base sm:text-lg md:text-lg underline cursor-pointer"
          to="/products/top-products "
        >
          Explore more
        </Link>
      </div>

      {!loading && collections.length === 0 && (
        <div className="text-center py-10">
          <p className="text-gray-500 text-sm">
            No featured collections available right now.
          </p>
          <p className="text-gray-400 text-xs mt-1">
            Check back later for new arrivals!
          </p>
        </div>
      )}

      {/* Loop through each collection */}
      {collections.map((collection) => (
        <div key={collection._id} className="mb-12 last:mb-0">
          {/* Collection Name Header */}
          <div className="flex items-center justify-between mb-2 px-2">
            <h2
              className="text-[22px]"
              style={{
                color: "#1E1E1E",
                fontFamily:"Stack Sans Notch', 'sans-serif",
              }}
            >
              {collection.collectionName}
            </h2>
          </div>

          {/* Products Grid - Visible to everyone, with staggered entrance animation */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4 p-4"
          >
            {collection.products.slice(0, MAX_PRODUCTS).map((product) => (
              <motion.div variants={cardVariants} key={product._id}>
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      ))}
    </div>
  );
}

export default TopProducts;