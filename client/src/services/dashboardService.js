import axiosInstance from "../api/axiosInstance";

export const getKpiCards = () => axiosInstance.get("/dashboard/kpi-cards");

export const getSalesOverview = (type = "orders", range = "weekly") =>
  axiosInstance.get(`/dashboard/sales-overview?type=${type}&range=${range}`);

export const getDashboardSummary = () =>
  axiosInstance.get("/dashboard/dashboard-summary");

export const getTopSellingProducts = (range = "weekly") =>
  axiosInstance.get(
    `/dashboard/top-selling-products?range=${range}&page=1&limit=5`,
  );

export const getRecentActivities = (page = 1, limit = 10) =>
  axiosInstance.get(`/dashboard/recent-activities?page=${page}&limit=${limit}`);

export const getRecentOrders = (page = 1, limit = 10) =>
  axiosInstance.get(`/dashboard/recent-orders?page=${page}&limit=${limit}`);
