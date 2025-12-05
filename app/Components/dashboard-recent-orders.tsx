const orders = [
  {
    id: "#3210",
    customer: "Olivia Martin",
    email: "olivia@email.com",
    amount: "$316.00",
    status: "Completed",
  },
  {
    id: "#3209",
    customer: "Ava Johnson",
    email: "ava@email.com",
    amount: "$242.00",
    status: "Pending",
  },
  {
    id: "#3208",
    customer: "Michael Brown",
    email: "michael@email.com",
    amount: "$837.00",
    status: "Completed",
  },
  {
    id: "#3207",
    customer: "Lisa Anderson",
    email: "lisa@email.com",
    amount: "$529.00",
    status: "Processing",
  },
  {
    id: "#3206",
    customer: "James Wilson",
    email: "james@email.com",
    amount: "$159.00",
    status: "Completed",
  },
];

const statusStyles: Record<string, string> = {
  Completed: "bg-green-100 text-green-700",
  Pending: "bg-yellow-100 text-yellow-700",
  Processing: "bg-blue-100 text-blue-700",
};

export function DashboardRecentOrders() {
  return (
    <div className="bg-card border border-border rounded-xl p-4 sm:p-5">
      <div className="flex items-center justify-between mb-4 sm:mb-5">
        <div>
          <h3 className="text-base sm:text-lg font-semibold text-foreground">
            Recent Orders
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Latest customer transactions
          </p>
        </div>
        <button className="text-xs sm:text-sm font-medium text-primary hover:text-primary/80 transition-colors">
          View all
        </button>
      </div>
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider pb-3">
                Order
              </th>
              <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider pb-3">
                Customer
              </th>
              <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider pb-3 hidden md:table-cell">
                Amount
              </th>
              <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider pb-3">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {orders.map((order) => (
              <tr
                key={order.id}
                className="hover:bg-accent/30 transition-colors"
              >
                <td className="py-3 text-sm font-medium text-foreground">
                  {order.id}
                </td>
                <td className="py-3">
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {order.customer}
                    </p>
                    <p className="text-xs text-muted-foreground hidden lg:block">
                      {order.email}
                    </p>
                  </div>
                </td>
                <td className="py-3 text-sm font-medium text-foreground hidden md:table-cell">
                  {order.amount}
                </td>
                <td className="py-3">
                  <span
                    className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${
                      statusStyles[order.status]
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="sm:hidden space-y-3">
        {orders.map((order) => (
          <div key={order.id} className="p-3 bg-accent/30 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-foreground">
                {order.id}
              </span>
              <span
                className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${
                  statusStyles[order.status]
                }`}
              >
                {order.status}
              </span>
            </div>
            <p className="text-sm font-medium text-foreground">
              {order.customer}
            </p>
            <div className="flex items-center justify-between mt-1">
              <p className="text-xs text-muted-foreground">{order.email}</p>
              <p className="text-sm font-semibold text-foreground">
                {order.amount}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
