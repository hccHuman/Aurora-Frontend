
import type { OrdersResponse } from "@/models/dashboardProps/DashboardOrderProps";
import type { StatsRange } from "@/models/dashboardProps/DashboardTimeProps";
import { handleInternalError } from "@/modules/ALBA/ErrorHandler";

export async function fetchSalesStats(range: StatsRange) {
  try {
    const apiUrl =
      import.meta.env.PUBLIC_API_URL || process.env.PUBLIC_API_URL;

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
    handleInternalError("810", error.message || error);
    return null;
  }
}

export async function fetchSalesByCategoryStats(range: StatsRange) {
  try {
    const apiUrl =
      import.meta.env.PUBLIC_API_URL || process.env.PUBLIC_API_URL;

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
    handleInternalError("811", error.message || error);
    return null;
  }
}

/* 🔽 NUEVO: New Products */
export async function fetchNewProductsStats(range: StatsRange) {
  try {
    const apiUrl =
      import.meta.env.PUBLIC_API_URL || process.env.PUBLIC_API_URL;

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
    handleInternalError("812", error.message || error);
    return null;
  }
}

/* 🔽 NUEVO: Visitors */
export async function fetchVisitorsStats(range: StatsRange) {
  try {
    const apiUrl =
      import.meta.env.PUBLIC_API_URL || process.env.PUBLIC_API_URL;

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
    handleInternalError("813", error.message || error);
    return null;
  }
}

/* 🔽 NUEVO: Signups */
export async function fetchSignupsStats(range: StatsRange) {
  try {
    const apiUrl =
      import.meta.env.PUBLIC_API_URL || process.env.PUBLIC_API_URL;

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
    handleInternalError("814", error.message || error);
    return null;
  }
}

/* 🔽 NUEVO: Traffic by device */
export async function fetchTrafficByDeviceStats(range: StatsRange) {
  try {
    const apiUrl =
      import.meta.env.PUBLIC_API_URL || process.env.PUBLIC_API_URL;

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
    handleInternalError("815", error.message || error);
    return null;
  }
}

export async function fetchOrders(page = 1, pageSize = 5, range = '30d'): Promise<OrdersResponse | null> {
  try {
    const apiUrl =
      import.meta.env.PUBLIC_API_URL || process.env.PUBLIC_API_URL;

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
    handleInternalError("820", error.message || error);
    return null;
  }
}