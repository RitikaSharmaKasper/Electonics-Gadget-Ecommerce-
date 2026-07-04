// import { ChevronLeft, Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
// import PriceDetails from "../components/PriceDetails";
// import DeliveryDetailsDialog from "../components/DeliveryDetailsDialog";
// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   removeFromCart,
//   increaseQty,
//   decreaseQty,
//   clearCart,
//   setCartFromAPI,
// } from "../redux/cart/cartSlice";
// import { Link } from "react-router-dom";
// import Footer from "../sections/Footer";
// import Navbar from "../components/Navbar";
// // import { addToWishlist, setWishlistFromAPI } from "../redux/cart/wishlistSlice";
// import { formatPrice, getPrices } from "../utils/homePageUtils";
// import Modal from "../components/Modal";
// import EmptyState from "../components/EmptyState";
// import { twMerge } from "tailwind-merge";
// import Ratings from "../components/Ratings";
// import axiosInstance from "../api/axiosInstance";
// import { toast } from "react-toastify";

// function Cart() {
//   const [cart, setCart] = useState(null);
//   const [open, setOpen] = useState(false);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [cartLoading, setCartLoading] = useState(true);
//   const dispatch = useDispatch();
//   const closeDialog = () => setOpen(false);
//   const syncWishlistFromBackend = async () => {
//     try {
//       const res = await axiosInstance.get("/wishlist");
//       dispatch(setWishlistFromAPI(res.data.data));
//     } catch (err) {
//       console.error("Failed to sync wishlist:", err);
//     }
//   };

//   const moveToWishlist = async (item) => {
//     const previousCart = cart;

//     try {
//       const promise = (async () => {
//         await axiosInstance.post("/wishlist/add-to-wishlist", {
//           productId: item.product || item.productId || item.uuid,
//           variantId: item.variantId,
//         });

//         const removeRes = await axiosInstance.delete(
//           `/cart/remove-item/${item._id}`,
//         );

//         return removeRes;
//       })();

//       const res = await toast.promise(promise, {
//         pending: "Moving to wishlist...",
//         success: "Moved to wishlist",
//         error: {
//           render({ data }) {
//             return data?.response?.data?.message || "Failed to move item";
//           },
//         },
//       });

//       setCart(res.data.data);
//       dispatch(setCartFromAPI(res.data.data));

//       await syncWishlistFromBackend();
//     } catch (err) {
//       console.error(err);

//       setCart(previousCart);
//       if (previousCart) {
//         dispatch(setCartFromAPI(previousCart));
//       }
//     }
//   };

//   // detect out of stock
//   const hasOutOfStock = cart?.items?.some(
//     (item) =>
//       item.variantAvailableStock <= 0 ||
//       item.quantity > item.variantAvailableStock,
//   );

//   // fetch cart details from api
//   const fetchCartItem = async () => {
//     try {
//       setCartLoading(true);

//       const res = await axiosInstance.get("/cart");
//       setCart(res.data?.data);
//       dispatch(setCartFromAPI(res.data?.data));
//     } catch (error) {
//       console.error(error);
//     } finally {
//       setCartLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchCartItem();
//   }, []);

//   console.log(cart);

//   const handleClearCart = async () => {
//     try {
//       await axiosInstance.delete("/cart/clear-cart");

//       const emptyCart = {
//         items: [],
//         totalQuantity: 0,
//         subtotal: 0,
//         totalGST: 0,
//         grandTotal: 0,
//       };

//       setCart(emptyCart);
//       dispatch(setCartFromAPI(emptyCart));
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const handleUpdateQty = async (itemId, action) => {
//     const previousCart = cart;

//     setCart((prev) => {
//       if (!prev) return prev;

//       const updatedItems = prev.items
//         .map((item) => {
//           if (item._id !== itemId) return item;

//           const newQty =
//             action === "inc"
//               ? item.quantity + 1
//               : Math.max(item.quantity - 1, 0);

//           return { ...item, quantity: newQty };
//         })
//         .filter((item) => item.quantity > 0);

//       return {
//         ...prev,
//         items: updatedItems,
//         totalQuantity: updatedItems.reduce(
//           (sum, item) => sum + item.quantity,
//           0,
//         ),
//       };
//     });

//     try {
//       const res = await axiosInstance.patch("/cart/update-item", {
//         itemId,
//         action,
//       });

//       setCart(res.data.data);
//       dispatch(setCartFromAPI(res.data.data));
//     } catch (err) {
//       console.error(err);

//       setCart(previousCart);
//       if (previousCart) {
//         dispatch(setCartFromAPI(previousCart));
//       }

//       toast.error(err?.response?.data?.message || "Failed to update cart");
//     }
//   };

//   const handleRemoveItem = async (item) => {
//     const previousCart = cart;

//     // optimistic UI
//     setCart((prev) => {
//       if (!prev) return prev;

//       const updatedItems = prev.items.filter((i) => i._id !== item._id);

//       return {
//         ...prev,
//         items: updatedItems,
//         totalQuantity: updatedItems.reduce((sum, i) => sum + i.quantity, 0),
//       };
//     });

//     try {
//       const res = await axiosInstance.delete(`/cart/remove-item/${item._id}`);

//       setCart(res.data.data);
//       dispatch(setCartFromAPI(res.data.data));
//       toast.success("Item removed");
//     } catch (err) {
//       console.error(err);

//       setCart(previousCart);
//       if (previousCart) {
//         dispatch(setCartFromAPI(previousCart));
//       }

//       toast.error(err?.response?.data?.message || "Failed to remove item");
//     }
//   };

//   if (cartLoading) {
//     return (
//       <>
//         <Navbar />
//         <section className="lg:px-20 md:px-[60px] md:py-4 bg-gray-50 mt-24">
//           <div className="bg-white md:rounded-lg shadow-sm p-8 text-center">
//             Loading cart...
//           </div>
//         </section>
//         <Footer />
//       </>
//     );
//   }

//   return (
//     <>
//       <Navbar />
//       <section className="lg:px-20 md:px-[60px] md:py-4 bg-gray-50 mt-24">
//         <div className="flex flex-col lg:flex-row justify-between lg:gap-6 font-inter gap-6">
//           {/* Main Cart Content */}
//           <div
//             className={`w-full ${cart?.totalQuantity > 0 ? "lg:w-2/3" : "w-full "}`}
//           >
//             {/* Cart Items Section */}
//             <div className=" bg-white md:rounded-lg shadow-sm">
//               <div className="p-4 md:p-6 flex items-center justify-between border-b border-gray-200">
//                 <div className="text-xl font-medium flex items-center gap-2 text-[#7A1F2B] font-stack-sans">
//                   <Link to="/home">
//                     {" "}
//                     <ChevronLeft className="w-7 h-7" />
//                   </Link>{" "}
//                   <span className="font-merriweather text-[#1800AC]">
//                     Shopping Cart ({cart?.totalQuantity || 0})
//                   </span>
//                 </div>
//                 {cart?.items?.length > 1 && (
//                   <button
//                     onClick={() => setIsModalOpen(true)}
//                     className="bg-white text-red-500 border border-red-500 hover:bg-red-500 hover:text-white px-3 py-1.5 text-sm font-medium transition-colors rounded-md"
//                   >
//                     Clear All
//                   </button>
//                 )}
//               </div>

//               {!cart || cart.items.length === 0 ? (
//                 <EmptyState
//                   heading="Your Cart is Empty"
//                   description="Looks like you haven’t added anything yet. Browse our
//                     collection and find something you love."
//                   icon={ShoppingCart}
//                   ctaLabel="Continue Shopping"
//                   ctaLink="/home"
//                 />
//               ) : (
//                 <>
//                   <div className="divide-y divide-gray-100">
//                     {cart?.items?.map((item) => {
//                       const base = Number(item.mrp);
//                       const effective = Number(item.sellingPrice);
//                       const isOutOfStock = item.variantAvailableStock <= 0;

//                       return (
//                         <div
//                           key={item._id}
//                           className="p-4 md:p-6 hover:bg-gray-50 transition-colors"
//                         >
//                           <div className="flex flex-row md:gap-6 gap-4 ">
//                             {/* Image + Qty */}
//                             <div className="flex flex-col  items-center gap-2">
//                               <Link
//                                 className="sm:w-36 sm:h-36 w-20 h-20 rounded-md overflow-hidden border border-gray-200"
//                                 to={`/product/${item._id}`}
//                               >
//                                 <img
//                                   className="sm:w-36 sm:h-36 w-20 h-20 object-contain"
//                                   src={item?.image?.url}
//                                   alt={item.productTitle}
//                                 />
//                               </Link>
//                             </div>

//                             {/* Details */}
//                             <div className="flex-grow">
//                               <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//                                 <div>
//                                   <h3 className="md:text-lg text-sm font-medium text-[#1C1C1C] line-clamp-2">
//                                     {item.productTitle} soon
//                                   </h3>

//                                   {/* <div className="flex flex-col text-sm">
//                                     <div className="text-[#686868]">
//                                       Color:{" "}
//                                       <span className="text-black">
//                                         {item?.selectedOptions?.color || "N/A"}
//                                       </span>
//                                     </div>
//                                     <div className="text-[#686868]">
//                                       Size:{" "}
//                                       <span className="text-black">
//                                         {item?.selectedOptions?.dimension ||
//                                           "N/A"}
//                                       </span>
//                                     </div>
//                                   </div> */}

//                                   {/* <div className=" border-gray-200 pb-2 flex items-center gap-4">
//                                     <div className="flex items-center gap-1">
//                                       <span className="text-2xl font-semibold text-gray-900">
//                                         {avgRating ?? "—"}
//                                       </span>
//                                       <span className="text-gray-500 text-sm">
//                                         /5
//                                       </span>
//                                     </div>
//                                     <div className="flex flex-col gap-1">
//                                       <Ratings
//                                         size={20}

//                                       />
//                                       <span className="text-sm text-gray-500">
//                                         <span>Based on </span>

//                                       </span>
//                                     </div>
//                                   </div> */}

//                                   {isOutOfStock && (
//                                     <p className="text-red-600 text-sm mt-1">
//                                       Currently Out of Stock
//                                     </p>
//                                   )}
//                                 </div>
//                               </div>
//                               {/* Price Section */}
//                               <div className="mt-2 flex flex-wrap items-center gap-2">
//                                 <span className="md:text-xl text-base font-semibold text-[#7A1F2B] font-stack-sans">
//                                   {formatPrice(effective)}
//                                 </span>
//                                 <span className="text-[#686868] md:text-sm text-xs line-through">
//                                   {formatPrice(base)}
//                                 </span>
//                                 {/* <span className="text-green-600 md:text-sm text-sm ">

//                                   {(
//                                     ( item.basePrice - item.discountPercent) /

//                                     (item.basePrice) *100
//                                   ).toFixed(2)} Off
//                                 </span> */}
//                                 <span className="text-green-600 text-sm">
//                                   {item.discount}% Off
//                                 </span>
//                               </div>
//                               {/* <div
//                                 className={twMerge(
//                                   "md:w-4 w-3 md:h-4 h-3 ring-2 ring-[#BEBEBE] ring-offset-2 ml-1 my-2 rounded-full transition-all duration-150 ease-in-out",
//                                   colorMap[item.selectedOptions?.color] ||
//                                     "bg-gray-200",
//                                 )}
//                               /> */}
//                               <div className="mt-2 text-xs text-gray-500 mb-4">
//                                 inclusive of all taxes
//                               </div>
//                               <div className="flex  flex-col sm:flex-row sm:items-center justify-between gap-3">
//                                 {/* Left Section */}
//                                 <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full">
//                                   {/* Variant Info */}
//                                   <div className="flex flex-wrap items-center gap-2">
//                                     {item.variantAttributes?.weight && (
//                                       <div className="min-w-[80px] px-2 py-1 border border-[#B6AAFF] rounded-lg text-center">
//                                         <span className="text-[#1800AC] text-sm">
//                                           {item.variantAttributes.weight}
//                                         </span>
//                                       </div>
//                                     )}

//                                     {item.variantColor && (
//                                       <div className="min-w-[80px] px-2 py-1 border border-[#B6AAFF] rounded-lg text-center">
//                                         <span className="text-[#1800AC] text-sm">
//                                           {item.variantColor}
//                                         </span>
//                                       </div>
//                                     )}

//                                     {item.variantName && (
//                                       <div className="min-w-[80px] px-2 py-1 border border-[#B6AAFF] rounded-lg text-center">
//                                         <span className="text-[#1800AC] text-sm">
//                                           {item.variantName}
//                                         </span>
//                                       </div>
//                                     )}
//                                   </div>

//                                   {/* Quantity */}
//                                   <div className="flex items-center justify-between w-[110px] px-2 py-1 border border-[#E8E8E8] rounded-md">
//                                     <button
//                                       onClick={() =>
//                                         handleUpdateQty(item._id, "dec")
//                                       }
//                                       className="w-5 h-5 flex items-center justify-center"
//                                     >
//                                       <Minus />
//                                     </button>

//                                     <span className="text-sm font-medium">
//                                       {item.quantity}
//                                     </span>

//                                     <button
//                                       onClick={() =>
//                                         handleUpdateQty(item._id, "inc")
//                                       }
//                                       className="w-5 h-5 flex items-center justify-center"
//                                     >
//                                       <Plus />
//                                     </button>
//                                   </div>
//                                 </div>
//                                 {/* Actions */}
//                                 <div className="flex md:flex-row tems-center gap-2 text-sm font-medium">
//                                   <button
//                                     className="text-[#0C0057]"
//                                     onClick={() => handleRemoveItem(item)}
//                                   >
//                                     Remove
//                                   </button>

//                                   <span className="hidden sm:inline">|</span>

//                                   <button
//                                     className="text-[#0C0057] whitespace-nowrap"
//                                     onClick={() => moveToWishlist(item)}
//                                   >
//                                     Save later
//                                   </button>
//                                 </div>
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       );
//                     })}
//                   </div>

//                   {/* Checkout Section */}
//                 </>
//               )}
//             </div>
//           </div>

//           {/*
//            Section */}
//           {cart?.totalQuantity > 0 && (
//             <PriceDetails
//               totalItems={cart?.totalQuantity || 0}
//               totalDiscount={
//                 cart?.items?.reduce(
//                   (sum, item) =>
//                     sum + (item.mrp - item.sellingPrice) * item.quantity,
//                   0,
//                 ) || 0
//               }
//               sellingPrice={
//                 cart?.items?.reduce(
//                   (sum, item) => sum + item.mrp * item.quantity,
//                   0,
//                 ) || 0
//               }
//               totalPrice={cart?.grandTotal || 0}
//               totalGST={cart?.totalGST || 0}
//               product={cart?.items || []}
//               step="cart"
//               hasOutOfStock={hasOutOfStock}
//             />
//           )}
//         </div>

//         {isModalOpen && (
//           <div className="absolute">
//             <Modal
//               isOpen={isModalOpen}
//               onClose={() => setIsModalOpen(false)}
//               onConfirm={async () => {
//                 await handleClearCart();
//                 setIsModalOpen(false);
//               }}
//               title="Clear Cart?"
//               description="Are you sure you want to remove all products from your cart?"
//               confirmText="Yes, Clear"
//               cancelText="No"
//             />
//           </div>
//         )}

//         {/* Delivery Address Modal */}
//         {open && (
//           <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
//             <div className="relative w-full max-w-md">
//               <DeliveryDetailsDialog onClose={closeDialog} />
//             </div>
//           </div>
//         )}
//       </section>
//       <Footer />
//     </>
//   );
// }

// export default Cart;

// Cart.jsx
import { ChevronLeft, Minus, Plus, ShoppingCart } from "lucide-react";
import PriceDetails from "../components/PriceDetails";
import DeliveryDetailsDialog from "../components/DeliveryDetailsDialog";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Footer from "../sections/Footer";
import Navbar from "../components/Navbar";
import { formatPrice } from "../utils/homePageUtils";
import Modal from "../components/Modal";
import EmptyState from "../components/EmptyState";
import { toast } from "react-toastify";
import {
  getCart,
  updateCart,
  deleteFromCart,
  clearCart,
  addToWishlist,
  removeFromWishlist,
} from "../services/CartService";

function Cart() {
  const { isAuthenticated } = useSelector((state) => state.user);
  const [cart, setCart] = useState(null);
  const [open, setOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cartLoading, setCartLoading] = useState(true);
  const [loadingItems, setLoadingItems] = useState({});

  const closeDialog = () => setOpen(false);

  // Fetch cart details from API
  const fetchCartItems = async () => {
    if (!isAuthenticated) {
      setCartLoading(false);
      setCart(null);
      return;
    }

    try {
      setCartLoading(true);
      const response = await getCart();
      // Fix: response.data.data contains the cart data
      const cartData = response?.data?.data || response?.data || null;
      setCart(cartData);
    } catch (error) {
      console.error("Failed to fetch cart:", error);
      toast.error("Failed to load cart");
      setCart(null);
    } finally {
      setCartLoading(false);
    }
  };

console.log(cart)

  // Move item to wishlist
  const moveToWishlist = async (item) => {
    if (!isAuthenticated) {
      toast.error("Please login to move items to wishlist");
      return;
    }

    setLoadingItems((prev) => ({ ...prev, [item._id]: "wishlist" }));

    try {
      // Add to wishlist
      await addToWishlist({
        productId: item.product || item.productId || item.uuid,
        variantId: item.variantId,
      });

      // Remove from cart
      const removeRes = await deleteFromCart({ itemId: item._id });
      const cartData = removeRes?.data?.data || removeRes?.data;
      setCart(cartData);

      // Dispatch event for navbar update
      window.dispatchEvent(new Event("cartUpdated"));
      window.dispatchEvent(new Event("wishlistUpdated"));

      toast.success("Moved to wishlist");
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to move item");
      await fetchCartItems();
    } finally {
      setLoadingItems((prev) => ({ ...prev, [item._id]: false }));
    }
  };

  // Handle quantity update
  const handleUpdateQty = async (itemId, action) => {
    if (!isAuthenticated) {
      toast.error("Please login to update cart");
      return;
    }

    const previousCart = structuredClone(cart);
    const currentItem = cart?.items?.find((item) => item._id === itemId);

    if (!currentItem) return;

    const newQuantity =
      action === "inc" ? currentItem.quantity + 1 : currentItem.quantity - 1;

    if (newQuantity < 0) return;

    if (action === "inc" && newQuantity > currentItem.variantAvailableStock) {
      toast.error(`Only ${currentItem.variantAvailableStock} items available`);
      return;
    }

    // Optimistic UI
    setCart((prev) => {
      if (!prev) return prev;

      const updatedItems = prev.items
        .map((item) =>
          item._id === itemId ? { ...item, quantity: newQuantity } : item,
        )
        .filter((item) => item.quantity > 0);

      return {
        ...prev,
        items: updatedItems,
        totalQuantity: updatedItems.reduce(
          (sum, item) => sum + item.quantity,
          0,
        ),
      };
    });

    setLoadingItems((prev) => ({ ...prev, [itemId]: "qty" }));

    try {
      const response = await updateCart({ itemId, action });
      const cartData = response?.data?.data || response?.data;
      setCart(cartData);

      // Dispatch event for navbar update
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (err) {
      setCart(previousCart);
      toast.error(err?.response?.data?.message || "Failed to update cart");
    } finally {
      setLoadingItems((prev) => ({ ...prev, [itemId]: false }));
    }
  };

  // Handle remove item
  const handleRemoveItem = async (item) => {
    if (!isAuthenticated) {
      toast.error("Please login to remove items");
      return;
    }

    const previousCart = cart;

    // Optimistic update
    setCart((prev) => {
      if (!prev) return prev;
      const updatedItems = prev.items.filter((i) => i._id !== item._id);
      return {
        ...prev,
        items: updatedItems,
        totalQuantity: updatedItems.reduce((sum, i) => sum + i.quantity, 0),
      };
    });

    setLoadingItems((prev) => ({ ...prev, [item._id]: "remove" }));

    try {
      const response = await deleteFromCart({ itemId: item._id });
      const cartData = response?.data?.data || response?.data;
      setCart(cartData);

      // Dispatch event for navbar update
      window.dispatchEvent(new Event("cartUpdated"));

      toast.success("Item removed from cart");
    } catch (err) {
      console.error(err);
      setCart(previousCart);
      toast.error(err?.response?.data?.message || "Failed to remove item");
    } finally {
      setLoadingItems((prev) => ({ ...prev, [item._id]: false }));
    }
  };

  // Handle clear all cart
  const handleClearCart = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to clear cart");
      setIsModalOpen(false);
      return;
    }

    const previousCart = cart;

    // Optimistic update
    setCart({
      items: [],
      totalQuantity: 0,
      subtotal: 0,
      totalGST: 0,
      grandTotal: 0,
    });

    try {
      const response = await clearCart();
      const cartData = response?.data?.data || response?.data;
      setCart(cartData);

      // Dispatch event for navbar update
      window.dispatchEvent(new Event("cartUpdated"));

      toast.success("Cart cleared successfully");
    } catch (err) {
      console.error(err);
      setCart(previousCart);
      toast.error(err?.response?.data?.message || "Failed to clear cart");
    } finally {
      setIsModalOpen(false);
    }
  };

  // Check for out of stock items
  const hasOutOfStock = cart?.items?.some(
    (item) =>
      item.variantAvailableStock <= 0 ||
      item.quantity > item.variantAvailableStock,
  );

  // Calculate total discount
  const calculateTotalDiscount = () => {
    if (!cart?.items?.length) return 0;
    return cart.items.reduce(
      (sum, item) => sum + (item.mrp - item.sellingPrice) * item.quantity,
      0,
    );
  };

  // Calculate selling price (MRP total)
  const calculateSellingPrice = () => {
    if (!cart?.items?.length) return 0;
    return cart.items.reduce((sum, item) => sum + item.mrp * item.quantity, 0);
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchCartItems();
    } else {
      setCartLoading(false);
      setCart(null);
    }
  }, [isAuthenticated]);

  // Not authenticated view
  if (!isAuthenticated) {
    return (
      <>
        <Navbar />
        <section className="lg:px-20 md:px-[60px] md:py-4 bg-gray-50 mt-24 min-h-screen">
          <div className="bg-white md:rounded-lg shadow-sm p-8 text-center">
            <ShoppingCart className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h2 className="text-2xl font-semibold text-[#7A1F2B] font-stack-sans mb-2">
              Your Cart is Waiting
            </h2>
            <p className="text-gray-600 mb-6">
              Please login to view and manage your cart items
            </p>
            <Link
              to="/login"
              className="inline-block px-6 py-3 bg-[#7A1F2B]text-white rounded-md hover:  bg-[#7A1F2B] transition-colors"
            >
              Login to Continue
            </Link>
          </div>
        </section>
        <Footer />
      </>
    );
  }

  if (cartLoading) {
    return (
      <>
        <Navbar />
        <section className="lg:px-20 md:px-[60px] md:py-4 bg-gray-50 mt-24 min-h-screen">
          <div className="bg-white md:rounded-lg shadow-sm p-8 text-center">
            <div className="flex justify-center items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#52151d]"></div>
              <span className="ml-3 text-gray-600">Loading your cart...</span>
            </div>
          </div>
        </section>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <section className="lg:px-20 md:px-[60px] md:py-4 bg-gray-50 mt-24 min-h-screen">
        <div className="flex flex-col lg:flex-row justify-between lg:gap-6 font-inter gap-6">
          {/* Main Cart Content */}
          <div
            className={`w-full ${cart?.totalQuantity > 0 ? "lg:w-2/3" : "w-full"}`}
          >
            {/* Cart Items Section */}
            <div className="bg-white md:rounded-lg shadow-sm">
              <div className="p-4 md:p-6 flex items-center justify-between border-b border-gray-200">
                <div className="text-xl font-medium flex items-center gap-2 text-[#7A1F2B] font-stack-sans">
                  <Link to="/home">
                    <ChevronLeft className="w-7 h-7" />
                  </Link>
                  <span className="font-stack-sans text-[#7A1F2B]">
                    Shopping Cart ({cart?.totalQuantity || 0})
                  </span>
                </div>
                {cart?.items?.length > 1 && (
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-white text-red-500 border border-red-500 hover:bg-red-500 hover:text-white px-3 py-1.5 text-sm font-medium transition-colors rounded-md"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {!cart || cart.items?.length === 0 ? (
                <EmptyState
                  heading="Your Cart is Empty"
                  description="Looks like you haven't added anything yet. Browse our collection and find something you love."
                  icon={ShoppingCart}
                  ctaLabel="Continue Shopping"
                  ctaLink="/home"
                />
              ) : (
                <div className="divide-y divide-gray-100">
                  {cart?.items?.map((item) => {
                    const base = Number(item.mrp);
                    const effective = Number(item.sellingPrice);
                    const isOutOfStock = item.variantAvailableStock <= 0;
                    const isLoading = loadingItems[item._id];

                    return (
                      <div
                        key={item._id}
                        className="p-4 md:p-6 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex flex-row md:gap-6 gap-4">
                          {/* Image */}
                          <div className="flex flex-col items-center gap-2">
                            <Link
                              className="sm:w-36 sm:h-36 w-20 h-20 rounded-md overflow-hidden border border-gray-200"
                              to={`/product/${item.product || item.productId}`}
                            >
                              <img
                                className="sm:w-36 sm:h-36 w-20 h-20 object-contain"
                                src={item?.image?.url || item?.image}
                                alt={item.productTitle}
                              />
                            </Link>
                          </div>

                          {/* Details */}
                          <div className="flex-grow">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                              <div>
                                <h3 className="md:text-lg text-sm font-stack-sans text-[#7A1F2B] line-clamp-2">
                                  {item.productTitle}
                                </h3>

                                {isOutOfStock && (
                                  <p className="text-red-600 text-sm mt-1">
                                    Currently Out of Stock
                                  </p>
                                )}
                              </div>
                            </div>

                            {/* Price Section */}
                            <div className="mt-2 flex flex-wrap items-center gap-2">
                              <span className="md:text-xl text-base font-semibold text-[#7A1F2B] font-stack-sans">
                                {formatPrice(effective)}
                              </span>
                              <span className="text-[#686868] md:text-sm text-xs line-through">
                                {formatPrice(base)}
                              </span>
                              <span className="text-green-600 text-sm">
                                {item.discount}% Off
                              </span>
                            </div>

                            <div className="mt-2 text-xs text-gray-500 mb-4">
                              inclusive of all taxes
                            </div>

                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                              {/* Left Section */}
                              <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full">
                                {/* Variant Info */}
                                <div className="flex flex-wrap items-center gap-2">
                                  {item.variantAttributes?.weight && item.variantAttributes.weight !== "undefined" && (
                                    <div className="min-w-[80px] px-2 py-1 border border-[] rounded-lg text-center">
                                      <span className="text-[#7A1F2B] text-sm">
                                        {item.variantAttributes.weight}
                                      </span>
                                    </div>
                                  )}

                                  {item.variantColor && (
                                    <div className="min-w-[80px] px-2 py-1 border border-[#52151d] rounded-lg text-center">
                                      <span className="text-[#7A1F2B] text-sm">
                                        {item.variantColor}
                                      </span>
                                    </div>
                                  )}

                                  {item.variantName && (
                                    <div className="min-w-[80px] px-2 py-1 border border-[#52151d] rounded-lg text-center">
                                      <span className="text-[#7A1F2B] text-sm">
                                        {item.variantName}
                                      </span>
                                    </div>
                                  )}
                                </div>

                                {/* Quantity Controls */}
                                <div className="flex items-center justify-between w-[110px] px-2 py-1 border border-[#E8E8E8] rounded-md">
                                  <button
                                    onClick={() =>
                                      handleUpdateQty(item._id, "dec")
                                    }
                                    disabled={isLoading === "qty"}
                                    className="w-5 h-5 flex items-center justify-center disabled:opacity-50 hover:bg-gray-100 rounded transition-colors"
                                  >
                                    <Minus className="w-4 h-4" />
                                  </button>

                                  <span className="text-sm font-medium">
                                    {item.quantity}
                                  </span>

                                  <button
                                    onClick={() =>
                                      handleUpdateQty(item._id, "inc")
                                    }
                                    disabled={
                                      isLoading === "qty" || isOutOfStock
                                    }
                                    className="w-5 h-5 flex items-center justify-center disabled:opacity-50 hover:bg-gray-100 rounded transition-colors"
                                  >
                                    <Plus className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>

                              {/* Actions */}
                              <div className="flex md:flex-row items-center gap-2 text-sm font-medium">
                                <button
                                  className="text-[#7A1F2B] hover:text-red-600 transition-colors disabled:opacity-50"
                                  onClick={() => handleRemoveItem(item)}
                                  disabled={isLoading === "remove"}
                                >
                                  {isLoading === "remove"
                                    ? "Removing..."
                                    : "Remove"}
                                </button>

                                <span className="hidden sm:inline">|</span>

                                <button
                                  className="text-[#7A1F2B] whitespace-nowrap hover:text-[#7A1F2B] transition-colors disabled:opacity-50"
                                  onClick={() => moveToWishlist(item)}
                                  disabled={isLoading === "wishlist"}
                                >
                                  {isLoading === "wishlist"
                                    ? "Moving..."
                                    : "Save later"}
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Price Details Section */}
          {cart?.totalQuantity > 0 && (
            <PriceDetails
              totalItems={cart?.totalQuantity || 0}
              totalDiscount={calculateTotalDiscount()}
              sellingPrice={calculateSellingPrice()}
              totalPrice={cart?.grandTotal || 0}
              totalGST={cart?.totalGST || 0}
              product={cart?.items || []}
              step="cart"
              cart={cart}
              hasOutOfStock={hasOutOfStock}
            />
          )}
        </div>

        {/* Clear Cart Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50">
            <Modal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              onConfirm={handleClearCart}
              title="Clear Cart?"
              description="Are you sure you want to remove all products from your cart?"
              confirmText="Yes, Clear"
              cancelText="No"
            />
          </div>
        )}

        {/* Delivery Address Modal */}
        {open && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="relative w-full max-w-md">
              <DeliveryDetailsDialog onClose={closeDialog} />
            </div>
          </div>
        )}
      </section>
      <Footer />
    </>
  );
}

export default Cart;
