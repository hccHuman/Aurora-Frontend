/**
 * Dashboard Service
 *
 * Provides functions for fetching various dashboard statistics and analytics data.
 * Includes sales, categories, visitors, signups, and traffic metrics.
 */
import type { OrdersResponse } from "@/models/dashboardProps/DashboardOrderProps";
import type { StatsRange } from "@/models/dashboardProps/DashboardTimeProps";
import { handleInternalError } from "@/modules/ALBA/ErrorHandler";
import { PUBLIC_API_URL } from "@/utils/envWrapper";

/**
 * Fetch generic sales statistics for a given time range
 *
 * @param {StatsRange} range - Time range for stats (e.g., '24h', '7d', '30d')
 * @returns {Promise<any>} Sales stats data or null if fails
 */
export async function fetchSalesStats(range: StatsRange) {
  try {
    const apiUrl = PUBLIC_API_URL;
    const endpoint = `${apiUrl}/api/stats/sales?range=${range}`;

    const res = await fetch(endpoint, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error(`Stats error: ${res.status}`);
    }

    return await res.json();
  } catch (error: any) {
    handleInternalError(error);
    return null;
  }
}

/**
 * Fetch sales data categorized by product category
 *
 * @param {StatsRange} range - Time range for stats
 * @returns {Promise<any>} Categorized sales stats or null if fails
 */
export async function fetchSalesByCategoryStats(range: StatsRange) {
  try {
    const apiUrl = PUBLIC_API_URL;
    const endpoint = `${apiUrl}/api/stats/sales-by-category?range=${range}`;

    const res = await fetch(endpoint, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error(`Stats category error: ${res.status}`);
    }

    return await res.json();
  } catch (error: any) {
    handleInternalError(error);
    return null;
  }
}

/**
 * Fetch statistics about new products added within a range
 *
 * @param {StatsRange} range - Time range for stats
 * @returns {Promise<any>} New products stats or null if fails
 */
export async function fetchNewProductsStats(range: StatsRange) {
  try {
    const apiUrl = PUBLIC_API_URL;
    const endpoint = `${apiUrl}/api/stats/new-products?range=${range}`;

    const res = await fetch(endpoint, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error(`New products stats error: ${res.status}`);
    }

    return await res.json();
  } catch (error: any) {
    handleInternalError(error);
    return null;
  }
}

/**
 * Fetch visitor statistics (people) for the dashboard
 *
 * @param {StatsRange} range - Time range for stats
 * @returns {Promise<any>} Visitor stats data or null if fails
 */
export async function fetchVisitorsStats(range: StatsRange) {
  try {
    const apiUrl = PUBLIC_API_URL;
    const endpoint = `${apiUrl}/api/stats/people?range=${range}`;

    const res = await fetch(endpoint, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error(`Visitors stats error: ${res.status}`);
    }

    return await res.json();
  } catch (error: any) {
    handleInternalError(error);
    return null;
  }
}

/**
 * Fetch user signup statistics for a given range
 *
 * @param {StatsRange} range - Time range for stats
 * @returns {Promise<any>} Signups stats data or null if fails
 */
export async function fetchSignupsStats(range: StatsRange) {
  try {
    const apiUrl = PUBLIC_API_URL;
    const endpoint = `${apiUrl}/api/stats/signups?range=${range}`;

    const res = await fetch(endpoint, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error(`Signups stats error: ${res.status}`);
    }

    return await res.json();
  } catch (error: any) {
    handleInternalError(error);
    return null;
  }
}

/**
 * Fetch traffic distribution by device type (mobile, desktop, etc.)
 *
 * @param {StatsRange} range - Time range for stats
 * @returns {Promise<any>} Traffic analytics data or null if fails
 */
export async function fetchTrafficByDeviceStats(range: StatsRange) {
  try {
    const apiUrl = PUBLIC_API_URL;
    const endpoint = `${apiUrl}/api/stats/traffic-by-device?range=${range}`;

    const res = await fetch(endpoint, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error(`Traffic by device stats error: ${res.status}`);
    }

    return await res.json();
  } catch (error: any) {
    handleInternalError(error);
    return null;
  }
}

/**
 * Fetch a paginated list of orders for the dashboard
 *
 * @param {number} page - Page number (default: 1)
 * @param {number} pageSize - Orders per page (default: 5)
 * @param {string} range - Time range for orders (default: '30d')
 * @returns {Promise<OrdersResponse | null>} Paginated orders data or null if fails
 */
export async function fetchOrders(page = 1, pageSize = 5, range = '30d'): Promise<OrdersResponse | null> {
  try {
    const apiUrl = PUBLIC_API_URL;
    const endpoint = `${apiUrl}/api/stats/orders?page=${page}&pageSize=${pageSize}&range=${range}`;

    const res = await fetch(endpoint, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error(`Orders stats error: ${res.status}`);
    }

    return await res.json();
  } catch (error: any) {
    handleInternalError(error);
    return null;
  }
}
