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

  // Spotlight cursor-follow effect (from design 2)
  const handleCardPointerMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty("--spot-x", `${x}px`);
    card.style.setProperty("--spot-y", `${y}px`);
  };

  // Product Card Component — same logic, restyled with circular image + framer motion
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
        whileHover={{ y: -8 }}
        transition={{ type: "spring", stiffness: 220, damping: 18 }}
        className="bg-white p-2 group block border  duration-300 "
      >
        <Link
          to={`/product/${product.slug || product._id}`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Circular / arch image container with spotlight effect */}
          <div
            className="relative w-full overflow-hidden rounded-t-[90px] rounded-b-lg aspect-[3/4] bg-white isolate"
            onMouseMove={handleCardPointerMove}
          >
            {/* Spotlight */}
            <div
              className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-50 transition-opacity duration-500 z-[1]"
              style={{
                background:
                  "radial-gradient(210px circle at var(--spot-x, 45%) var(--spot-y, 45%), rgba(18,107,109,0.18), transparent 65%)",
              }}
            />

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
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              src={productImage}
              alt={product.productTittle}
              loading="lazy"
              onError={(e) => {
                e.target.src = "/placeholder.png";
              }}
            />
          </div>

          <div className="mt-3">
            <h3 className="text-sm font-marcellus text-[#55516e] font-normal line-clamp-1 mb-2">
              {product.productTittle}
            </h3>

            <div className="flex items-center flex-wrap gap-2">
              <span className="text-gray-900 font-medium">
                ₹{sellingPrice || mrp || "--"}
              </span>
              {mrp > 0 && sellingPrice > 0 && mrp !== sellingPrice && (
                <span className="text-[#747877] text-xs line-through font-light">
                  ₹{mrp}
                </span>
              )}
              {discountPercent > 0 && (
                <>
                  <div className="border-l border-[#DBDBDB] h-3"></div>
                  <span className="text-[#126B6D] text-xs">
                    {discountPercent}% Off
                  </span>
                </>
              )}
            </div>
          </div>
        </Link>

        {/* Button placed OUTSIDE the Link to prevent navigation */}
        <button
          className={`w-full rounded-md flex justify-center items-center gap-4 p-2 mt-2 transition-all duration-300 cursor-pointer ${
            inCart
              ? "bg-white border border-[#126B6D] text-[#126B6D]"
              : "bg-[#126B6D] border border-[#126B6D] text-white hover:bg-[#0f5c5e]"
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
      </motion.div>
    );
  };

  if (loading) {
    return (
      <div className="lg:px-20 md:px-[60px] px-4 py-[23px] bg-white shadow-sm rounded-lg border border-[#F0EEFF]">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#126B6D] mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading products...</p>
          </div>
        </div>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  };

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <div className="lg:px-20 md:px-[60px] px-4 py-[20px] bg-white shadow-sm rounded-lg border border-[#F0EEFF]">
      {/* Main Header */}
      <div
        className="flex items-center justify-between mb-6"
        style={{
          color: "#126B6D",
          fontFamily: "'Marcellus SC', cursive",
        }}
      >
        <p className="md:items-start px-2 text-[30px]  md: text-[30px] sm:text-[30px] text-[#126B6D] font-playpen-sans">Featured Collection</p>
        <Link
          className="whitespace-nowrap font-lavishly text-[#FF7F66] text-[32px] hover:text-[#126B6D] px-2 text-base sm:text-xl md:text-xl underline cursor-pointer"
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
                fontFamily: "'Playpen Sans', 'cursive', 'sans-serif'",
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