import axiosInstance from "../api/axiosInstance";

const dispatchCartUpdate = () => window.dispatchEvent(new Event("cartUpdated"));
const dispatchWishlistUpdate = () =>
  window.dispatchEvent(new Event("wishlistUpdated"));

// ================= CART =================

export const getCart = async () => {
  const response = await axiosInstance.get("/cart");
  return response;
};

export const addToCart = async ({ productId, variantId, quantity = 1 }) => {
  const response = await axiosInstance.post("/cart/add-to-cart", {
    productId,
    variantId,
    quantity,
  });
  dispatchCartUpdate();
  return response;
};

export const updateCart = async ({ itemId, action }) => {
  const response = await axiosInstance.patch("/cart/update-item", {
    itemId,
    action,
  });
  dispatchCartUpdate();
  return response;
};

export const deleteFromCart = async ({ itemId }) => {
  const response = await axiosInstance.delete(`/cart/remove-item/${itemId}`);
  dispatchCartUpdate();
  return response;
};

export const clearCart = async () => {
  const response = await axiosInstance.delete("/cart/clear-cart");
  dispatchCartUpdate();
  return response;
};

// ================= WISHLIST =================

export const getWishlist = async () => {
  const response = await axiosInstance.get("/wishlist");
  return response;
};

export const addToWishlist = async ({ productId, variantId }) => {
  const response = await axiosInstance.post("/wishlist/add-to-wishlist", {
    productId,
    variantId,
  });
  dispatchWishlistUpdate();
  return response;
};

// FIXED: always uses { data: { productId, variantId } } for DELETE body
export const removeFromWishlist = async ({ productId, variantId }) => {
  const response = await axiosInstance.delete("/wishlist/remove-item", {
    data: { productId, variantId },
  });
  dispatchWishlistUpdate();
  return response;
};

export const clearWishlist = async () => {
  const response = await axiosInstance.delete("/wishlist/clear-wishlist");
  dispatchWishlistUpdate();
  return response;
};

export const moveToCart = async ({ productId, variantId, quantity = 1 }) => {
  const response = await axiosInstance.post("/wishlist/move-to-cart", {
    productId,
    variantId,
    quantity,
  });
  dispatchWishlistUpdate();
  dispatchCartUpdate();
  return response;
};

export const moveAllToCart = async () => {
  const response = await axiosInstance.post("/wishlist/move-to-cart-all");
  dispatchWishlistUpdate();
  dispatchCartUpdate();
  return response;
};
