import AccountSidebar from "../components/AccountSidebar";
import { useEffect, useState } from "react";
import { Heart, ShoppingCart } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { formatPrice } from "../utils/homePageUtils";
import Modal from "../components/Modal";
import EmptyState from "../components/EmptyState";
import axiosInstance from "../api/axiosInstance";
import { toast } from "react-toastify";
import { removeFromWishlist } from "../services/CartService";

function Wishlist() {
  const { isAuthenticated } = useSelector((s) => s.user);
  const navigate = useNavigate();
  const [apiWishlist, setApiWishlist] = useState([]);
  const wishlistItems = apiWishlist;
  const totalItems = apiWishlist.length;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  // Authentication check helper
  const requireAuth = (message) => {
    if (!isAuthenticated) {
      toast.error(message);
      navigate("/login");
      return false;
    }
    return true;
  };
  // add by aman
  const moveToCart = async (item) => {
    if (!requireAuth("Please login to move items to cart")) return;

    try {
      setActionLoadingId(item._id);

      await axiosInstance.post("/cart/add-to-cart", {
        productId: item.product || item.productId || item.uuid,
        variantId: item.variantId,
        quantity: 1,
      });

      await removeFromWishlist({
        productId: item.product || item.productId || item.uuid,
        variantId: item.variantId,
      });

      await fetchWishlist();

      window.dispatchEvent(new Event("cartUpdated"));
      window.dispatchEvent(new Event("wishlistUpdated"));

      toast.success("Item moved to cart");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to move item");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleRemoveWishlistItem = async (item) => {
    if (!requireAuth("Please login to remove items from wishlist")) return;

    try {
      setActionLoadingId(item._id);

      const promise = removeFromWishlist({
        productId: item.product || item.productId || item.uuid,
        variantId: item.variantId,
      });

      await toast.promise(promise, {
        pending: "Removing...",
        success: "Removed from wishlist",
        error: {
          render({ data }) {
            return data?.response?.data?.message || "Failed to remove item";
          },
        },
      });

      await fetchWishlist();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoadingId(null);
    }
  };

  // Detect out of stock items
  const outOfStockItems = wishlistItems.filter(
    (item) => (item.stockQuantity ?? 0) <= 0,
  );
  const hasOutOfStock = outOfStockItems.length > 0;

  // Get wishlist from API
  const fetchWishlist = async () => {
    if (!isAuthenticated) {
      setApiWishlist([]);
      return;
    }

    try {
      const res = await axiosInstance.get("/wishlist");

      const items = res.data?.data?.items || [];

      const formatted = items.map((item) => ({
        _id: item._id,
        product: item.product,
        uuid: item.product,
        variantId: item.variantId,
        title: item.productTitle,
        image: item.image?.url,
        variantName: item.variantName,
        variantColor: item.variantColor,
        variantAttributes: item.variantAttributes,
        basePrice: Number(item.variantAttributes?.mrp || 0),
        discountPercent: Number(item.variantAttributes?.discount || 0),
        stockQuantity: Number(item.variantAvailableStock || 0),
      }));

      setApiWishlist(formatted);
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      if (error?.response?.status === 401) {
        setApiWishlist([]);
      }
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchWishlist();
    } else {
      setApiWishlist([]);
    }
  }, [isAuthenticated]);

  const handleClearWishlist = async () => {
    if (!requireAuth("Please login to clear wishlist")) {
      setIsModalOpen(false);
      return;
    }

    try {
      const promise = axiosInstance.delete("/wishlist/clear-wishlist");

      await toast.promise(promise, {
        pending: "Clearing wishlist...",
        success: "Wishlist cleared",
        error: {
          render({ data }) {
            return data?.response?.data?.message || "Failed to clear wishlist";
          },
        },
      });

      setApiWishlist([]);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error clearing wishlist:", error);
    }
  };

  const moveAllToCart = async () => {
    if (!requireAuth("Please login to move items to cart")) return;

    if (hasOutOfStock) {
      toast.error("Remove out of stock items first");
      return;
    }

    try {
      await axiosInstance.post("/wishlist/move-to-cart-all");

      setApiWishlist([]);

      window.dispatchEvent(new Event("cartUpdated"));
      window.dispatchEvent(new Event("wishlistUpdated"));

      toast.success("All items moved to cart");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to move items");
    }
  };

  // If not authenticated, show login message
  if (!isAuthenticated) {
    return (
      <div className="mt-5 w-full bg-white rounded-lg shadow-sm md:border border-gray-200">
        <div className="flex flex-row items-center justify-between p-4 md:p-6 border-b border-gray-200">
          <h1 className="text-lg sm:text-xl font-medium text-[#126B6D] font-playpen-sans">
            Wishlist <span>(0)</span>
          </h1>
        </div>
        <EmptyState
          heading="Login to View Wishlist"
          description="Please login to see your saved items and continue shopping."
          icon={Heart}
          ctaLabel="Login Now"
          ctaLink="/login"
        />
      </div>
    );
  }

  return (
    <div className="mt-5 w-full bg-white rounded-lg shadow-sm md:border border-gray-200">
      <div className="flex flex-row items-center justify-between p-4 md:p-6 border-b border-gray-200">
        <h1 className="text-lg sm:text-xl font-medium text-[#126B6D] font-playpen-sans">
          Wishlist <span>({totalItems})</span>
        </h1>
        {totalItems > 1 && (
          <button
            className="bg-white text-[#1C3753] border border-[#1C3753] hover:border-opacity-0 hover:bg-red-500 hover:text-white px-3 py-1.5 text-sm font-medium transition-colors rounded-md"
            onClick={() => setIsModalOpen(true)}
          >
            Clear All
          </button>
        )}
      </div>

      {wishlistItems.length === 0 ? (
        <EmptyState
          heading="Your Wishlist is Empty"
          description="Save your favorite items here to easily find and purchase them later."
          icon={Heart}
          ctaLabel="Discover Products"
          ctaLink="/home"
        />
      ) : (
        <>
          <div className="divide-y divide-gray-100">
            {wishlistItems?.map((item) => (
              <div
                key={`${item.uuid}-${item.variantId}`}
                className="p-4 md:p-6 hover:bg-gray-50/50 transition-colors"
              >
                <div className="flex gap-4 items-start sm:items-center">
                  <Link
                    to={`/product/${item.uuid}`}
                    className="sm:w-36 sm:h-36 w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border border-gray-200 bg-white"
                  >
                    <img
                      className="sm:w-36 sm:h-36 w-20 h-20 object-contain"
                      src={item.image}
                      alt={item.title}
                      loading="lazy"
                    />
                  </Link>
                  <div className="flex-grow flex flex-col sm:flex-row sm:items-center gap-3 w-full">
                    <div className="flex-grow">
                      <Link
                        to={`/product/${item.uuid}`}
                        className="md:text-lg text-sm font-medium text-[#126B6D] font-playpen-sans line-clamp-2"
                      >
                        {item.title}
                      </Link>

                      <div>
                        <div className="flex items-center gap-1">
                          {item.variantColor ? (
                            <>
                              <p className="text-[#686868]">Color: </p>
                              <span>{item.variantColor}</span>
                            </>
                          ) : (
                            ""
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          {item.variantAttributes?.weight ? (
                            <>
                              <p className="text-[#686868]">Weight: </p>
                              <span>{item.variantAttributes.weight}</span>
                            </>
                          ) : (
                            ""
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          {item.variantName ? (
                            <>
                              <p className="text-[#686868]">Style Name: </p>
                              <span>{item.variantName}</span>
                            </>
                          ) : (
                            ""
                          )}
                        </div>
                      </div>
                      <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1">
                        <span className="md:text-xl text-base font-semibold text-[#126B6D] font-playpen-sans">
                          {formatPrice(
                            item.basePrice -
                              (item.discountPercent * item.basePrice) / 100,
                          )}
                        </span>
                        {item.discountPercent > 0 && (
                          <>
                            <span className="text-gray-400 md:text-sm text-xs line-through">
                              {formatPrice(item.basePrice)}
                            </span>
                            <span className="text-green-600 md:text-sm text-sm bg-green-50 px-2 py-0.5 rounded">
                              {item.discountPercent}% OFF
                            </span>
                          </>
                        )}
                      </div>
                      <span className="text-sm text-[#686868]">
                        inclusive of all taxes
                      </span>

                      {/* Out of Stock Label */}
                      {(item.stockQuantity ?? 0) <= 0 && (
                        <p className="text-red-600 text-sm mt-1">
                          Currently Out of Stock
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        className="bg-[#126B6D] md:px-4 px-2 md:py-1 py-0.5 text-sm text-white border border-[#126B6D] transition-colors whitespace-nowrap shadow-sm hover:shadow-sm rounded-lg disabled:bg-gray-300 disabled:border-gray-300 disabled:text-gray-500"
                        onClick={() => moveToCart(item)}
                        disabled={
                          (item.stockQuantity ?? 0) <= 0 ||
                          actionLoadingId === item._id
                        }
                      >
                        {(item.stockQuantity ?? 0) <= 0
                          ? "Out of Stock"
                          : actionLoadingId === item._id
                            ? "Moving..."
                            : "Add to Cart"}
                      </button>

                      <button
                        className="md:px-4 px-2 md:py-1 py-0.5 flex items-center text-sm border border-[#126B6D] text-[#126B6D] gap-2 rounded-lg disabled:opacity-60"
                        onClick={() => handleRemoveWishlistItem(item)}
                        disabled={actionLoadingId === item._id}
                        aria-label="Remove item"
                      >
                        {actionLoadingId === item._id
                          ? "Removing..."
                          : "Remove"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {totalItems > 1 && (
            <div className="p-4 border-t border-gray-200 justify-self-end relative group w-max">
              <button
                className={`flex w-max gap-2 items-center md:px-4 md:py-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm sm:w-auto text-center ${
                  hasOutOfStock
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-[#126B6D] text-white hover:bg-[#126B6D]/90"
                }`}
                disabled={hasOutOfStock}
                onClick={() => !hasOutOfStock && moveAllToCart()}
              >
                <ShoppingCart size={16} />
                Move All to Cart
              </button>

              {/* Tooltip when disabled */}
              {hasOutOfStock && (
                <div className="absolute bottom-full right-0 mb-2 px-3 py-2 text-xs text-white bg-red-600 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {outOfStockItems.length} item
                  {outOfStockItems.length > 1 ? "s are" : " is"} out of stock.
                  Remove {outOfStockItems.length > 1 ? "them" : "it"} to move
                  all.
                </div>
              )}
            </div>
          )}
        </>
      )}
      {isModalOpen && (
        <div className="fixed inset-0 z-50">
          <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onConfirm={handleClearWishlist}
            title="Clear Wishlist?"
            description="Are you sure you want to remove all items from your wishlist?"
            confirmText="Yes, Clear"
            cancelText="No"
          />
        </div>
      )}
    </div>
  );
}

export default Wishlist;
