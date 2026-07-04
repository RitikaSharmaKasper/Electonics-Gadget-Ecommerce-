// Card.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, ShoppingCart } from "lucide-react";
import { FaBagShopping } from "react-icons/fa6";
import { toast } from "react-toastify";
// import axiosInstance from "../api/axiosInstance";
import { formatPrice } from "../utils/homePageUtils";
import {
  addToCart,
  addToWishlist,
  removeFromWishlist,
} from "../services/CartService";
import { useSelector } from "react-redux";

function Card({
  cardData = [],
  cartItems = [],
  wishlistItems = [],
  onCartUpdate,
  onWishlistUpdate,
}) {
  const navigate = useNavigate();
  const [loadingIds, setLoadingIds] = useState([]);
  const [guestCartItems, setGuestCartItems] = useState([]);
  const [guestWishlistItems, setGuestWishlistItems] = useState([]);

  const syncGuestState = () => {
    setGuestCartItems(JSON.parse(localStorage.getItem("cart") || "[]"));
    setGuestWishlistItems(JSON.parse(localStorage.getItem("wishlist") || "[]"));
  };

  const { isAuthenticated } = useSelector((state) => state.user);

  // Helper function to get product id
  const getProductId = (item) => {
    return item._id || item.uuid || item.id;
  };

  // Helper to get product name
  const getProductName = (item) => {
    return item.name || item.productTittle || item.title || "United Product";
  };

  // Helper to get product image
  const getProductImage = (item) => {
    if (item.image && item.image.startsWith("http")) {
      return item.image;
    }
    if (item.variants?.[0]?.variantImage?.[0]?.url) {
      return item.variants[0].variantImage[0]?.url;
    }
    return "/placeholder.png";
  };

  // Helper to get default variant
  const getDefaultVariant = (item) => {
    if (item.variants && item.variants.length > 0) {
      const selected = item.variants.find((v) => v.isSelected);
      return selected || item.variants[0];
    }
    return null;
  };

  // Authentication check helper
  // const requireAuth = (message) => {
  //   if (!isAuthenticated) {
  //     toast.error(message);
  //     navigate("/login");
  //     return false;
  //   }
  //   return true;
  // };

  // Card.jsx - Update
  const handleAddToCart = async (item) => {
    const productId = getProductId(item);
    const defaultVariant = getDefaultVariant(item);

    if (!defaultVariant) {
      toast.error("No variant available");
      return;
    }

    const variantId = defaultVariant._id || defaultVariant.variantId;

    // Guest user localStorage
    if (!isAuthenticated) {
      const guestCart = JSON.parse(localStorage.getItem("cart") || "[]");

      const exists = guestCart.find(
        (i) => i.productId === productId && i.variantId === variantId,
      );

      const updatedCart = exists
        ? guestCart.map((i) =>
            i.productId === productId && i.variantId === variantId
              ? { ...i, quantity: i.quantity + 1 }
              : i,
          )
        : [
            ...guestCart,
            {
              productId,
              variantId,
              quantity: 1,
              title: getProductName(item),
              image: getProductImage(item),
              price:
                item.defaultPrice || defaultVariant.variantSellingPrice || 0,
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

    setLoadingIds((prev) => [...prev, productId]);

    try {
      await addToCart({
        productId,
        variantId,
        quantity: 1,
      });

      if (onCartUpdate) {
        console.log("Calling onCartUpdate...");
        await onCartUpdate();
      }

      window.dispatchEvent(new Event("cartUpdated"));

      toast.success("Added to cart");
    } catch (err) {
      console.error("Error:", err);
      toast.error(err.response?.data?.message || "Failed to add to cart");
    } finally {
      setLoadingIds((prev) => prev.filter((id) => id !== productId));
    }
  };

  const handleWishlistToggle = async (
    e,
    item,
    productId,
    variantId,
    inWishlist,
  ) => {
    e.stopPropagation();

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
              title: getProductName(item),
              image: getProductImage(item),
              price:
                item.defaultPrice ||
                getDefaultVariant(item)?.variantSellingPrice ||
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

    try {
      if (inWishlist) {
        await removeFromWishlist({ productId, variantId });
        toast.success("Removed from wishlist");
      } else {
        await addToWishlist({ productId, variantId });
        toast.success("Added to wishlist");
      }

      if (onWishlistUpdate) {
        await onWishlistUpdate();
      }

      window.dispatchEvent(new Event("wishlistUpdated"));
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    }
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

  return (
    <div className="grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-3 grid-cols-2 gap-2 w-full place-content-between overflow-visible">
      {cardData && cardData.length > 0 ? (
        cardData.map((item, index) => {
          const productId = getProductId(item);
          const productName = getProductName(item);
          const productImage = getProductImage(item);
          const defaultVariant = getDefaultVariant(item);

          if (!defaultVariant) return null;

          const effectivePrice =
            item.defaultPrice || defaultVariant?.variantSellingPrice || 0;
          const basePrice = item.mrp || defaultVariant?.variantMrp || 0;
          const discountPercent =
            item.discount || defaultVariant?.variantDiscount || 0;

          const variantStock = defaultVariant?.variantAvailableStock ?? 10;
          const outOfStock = variantStock <= 0;
          const variantId = defaultVariant._id || defaultVariant.variantId;

          // Only check cart/wishlist status if authenticated
          const inCart = isAuthenticated
            ? cartItems.some(
                (i) =>
                  String(i.productId || i.product || i.uuid) ===
                    String(productId) &&
                  String(i.variantId) === String(variantId),
              )
            : guestCartItems.some(
                (i) =>
                  String(i.productId) === String(productId) &&
                  String(i.variantId) === String(variantId),
              );

          const inWishlist = isAuthenticated
            ? wishlistItems.some(
                (i) =>
                  String(i.productId || i.product || i.uuid) ===
                    String(productId) &&
                  String(i.variantId) === String(variantId),
              )
            : guestWishlistItems.some(
                (i) =>
                  String(i.productId) === String(productId) &&
                  String(i.variantId) === String(variantId),
              );

          const isLoading = loadingIds.includes(productId);

          return (
            <div
              key={productId || index}
              onClick={() => navigate(`/product/${item.slug || productId}`)}
              className="relative group flex flex-col lg:justify-between items-center bg-white rounded-lg sm:h-[333px] lg:h-[333px] max-sm:h-max overflow-hidden group lg:hover:drop-shadow-md aspect-4/3 object-top cursor-pointer border border-[#F0EEFF] shadow-sm transition-shadow duration-300 hover:shadow-md"
            >
              <button
                className="absolute bg-white shadow-md md:shadow-lg md:bg-white active:scale-110 transition-all duration-300 md:p-2 p-2 rounded-full text-xs top-1 right-1 z-20"
                onClick={(e) =>
                  handleWishlistToggle(
                    e,
                    item,
                    productId,
                    variantId,
                    inWishlist,
                  )
                }
              >
                <Heart
                  className="w-5 h-5 cursor-pointer"
                  fill={inWishlist ? "#FF7F66" : "white"}
                  stroke={inWishlist ? "#FF7F66" : "#126B6D"}
                  strokeWidth={1}
                />
              </button>

              <img
                className="lg:min-h-[202px] pt-2 sm:min-w-[207px] sm:min-h-[160px] max-w-40 max-h-40 object-contain lg:group-hover:scale-110 transition duration-300 "
                src={productImage}
                alt={productName}
                crossOrigin="anonymous"
                referrerPolicy="no-referrer"
              />

              <div className="p-2 flex flex-col gap-1.5 w-full bg-white min-h-[150px] md:min-h-[113px] lg:justify-between transition-transform duration-300 border-t border-[#F0EEFF]">
                <div className="flex items-center flex-wrap gap-2">
                  <p className="text-sm w-full line-clamp-1 overflow-hidden text-ellipsis">
                    {productName || "Untitled Product"}
                  </p>
                  <span className="text-[#192324] font-medium text-lg tracking-tight">
                    {formatPrice(effectivePrice)}
                  </span>
                  {basePrice > effectivePrice && (
                    <>
                      <span className="text-[#747877] text-xs line-through font-light">
                        {formatPrice(basePrice)}
                      </span>
                      <div className="border-l border-[#DBDBDB] h-3"></div>
                    </>
                  )}

                  {discountPercent > 0 && (
                    <div>
                      <span className="text-[#7A1F2B] text-sm">
                        {Math.round(discountPercent)}% Off
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex gap-3 justify-center">
                  {outOfStock ? (
                    <button
                      disabled
                      className="px-4 py-2 bg-[#f1d5d9] text-xs w-full text-center text-[#747877] rounded-full cursor-not-allowed"
                    >
                      Out of Stock
                    </button>
                  ) : inCart ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate("/bag");
                      }}
                      className="flex items-center w-full text-xs justify-center gap-2 px-2 border border-[#52151d] text-[#7A1F2B] bg-white p-2 rounded-md"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span>Go to Cart</span>
                    </button>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(item);
                      }}
                      disabled={isLoading}
                      className="px-4 py-2 bg-[#7A1F2B] text-xs w-full text-center rounded text-white hover:bg-[#7A1F2B] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-opacity-30 rounded-md animate-spin"></div>
                          <span>Adding...</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-4">
                          <p>Add to Cart</p>
                          <span className="text-white">
                            <FaBagShopping />
                          </span>
                        </div>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <h1 className="text-lg sm:text-xl font-semibold text-[#7A1F2B] col-span-full text-center">
          No Products Available
        </h1>
      )}
    </div>
  );
}

export default Card;
