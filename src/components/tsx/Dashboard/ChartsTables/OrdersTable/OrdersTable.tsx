import { useEffect, useState } from "react";
import type { Order } from "@/models/dashboardProps/DashboardOrderProps";
import { fetchOrders } from "@/services/dashboardService";
import Pagination from "@/components/tsx/Dashboard/ui/Pagination";
import { getResponsivePageSize } from "@/services/deviceService";

type RangeType = "7d" | "30d" | "90d";

export default function OrdersTable() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(() => getResponsivePageSize());
  const [totalPages, setTotalPages] = useState(1);
  const [range, setRange] = useState<RangeType>("30d");
  const [loading, setLoading] = useState(false);

  /* Responsive page size */
  useEffect(() => {
    const handleResize = () => {
      setPageSize(getResponsivePageSize());
      setPage(1);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /* Fetch orders */
  useEffect(() => {
    loadOrders(page, pageSize, range);
  }, [page, pageSize, range]);

  const loadOrders = async (
    currentPage: number,
    size: number,
    range: RangeType
  ) => {
    setLoading(true);

    const res = await fetchOrders(currentPage, size, range);

    if (res) {
      const mappedOrders: Order[] = res.data.map((o: any) => ({
        transaction: `#${o.id}`,
        datetime: new Date(o.creado_en).toLocaleDateString("es-ES"),
        amount: `${(o.amount_total / 100).toFixed(2)} ${o.currency}`,
        reference: o.stripe_payment_intent_id ?? "-",
        method: "Stripe",
        status: o.status,
      }));

      setOrders(mappedOrders);
      setTotalPages(res.totalPages);
    }

    setLoading(false);
  };

  return (
    <section>
      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 p-4 rounded-lg">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Recent orders</h2>

          {/* Range selector */}
          <div className="flex gap-2">
            {(["7d", "30d", "90d"] as RangeType[]).map((r) => (
              <button
                key={r}
                onClick={() => {
                  setRange(r);
                  setPage(1);
                }}
                className={`px-3 py-1 text-xs rounded transition ${
                  range === r
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300"
                }`}
                disabled={loading}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
            <thead>
              <tr>
                <th className="p-2 text-xs text-left uppercase">Transaction</th>
                <th className="p-2 text-xs text-left uppercase">Date</th>
                <th className="p-2 text-xs text-left uppercase">Amount</th>
                <th className="p-2 text-xs text-left uppercase">Reference</th>
                <th className="p-2 text-xs text-left uppercase">Method</th>
                <th className="p-2 text-xs text-left uppercase">Status</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-4 text-center text-sm text-gray-500">
                    Loading orders…
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-4 text-center text-sm text-gray-400">
                    No orders found
                  </td>
                </tr>
              ) : (
                orders.map((o, idx) => (
                  <tr key={`order-${idx}`}>
                    <td className="p-2 text-sm">{o.transaction}</td>
                    <td className="p-2 text-sm text-gray-500">{o.datetime}</td>
                    <td className="p-2 text-sm font-semibold">{o.amount}</td>
                    <td className="p-2 text-sm text-gray-500">{o.reference}</td>
                    <td className="p-2 text-sm text-gray-500">{o.method}</td>
                    <td className="p-2 text-sm text-gray-500">{o.status}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
          disabled={loading}
        />
      </div>
    </section>
  );
}
