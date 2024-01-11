import { useLoaderData } from 'react-router-dom/dist';
import { getHistory } from '../../Services/apiRestaurant';
import { getUser } from '../../Utils/auth';
import HistoryItem from './HistoryItem';

export default function OrderHistory() {
  const menu = useLoaderData();
  const sortedOrders = menu.sort((a, b) => {
    const dateA = new Date(a.estimatedDelivery);
    const dateB = new Date(b.estimatedDelivery);

    return dateB - dateA; // Compare in descending order (newest to oldest)
  });

  return (
    <ul className="space-y-8 divide-y divide-amber-200  border-b border-t border-amber-200 px-4 py-6">
      <h1 className="mb-4 text-2xl font-semibold">Order History</h1>
      {sortedOrders.map((order) => (
        <HistoryItem key={order.id} order={order} />
      ))}
    </ul>
  );
}

export async function loader() {
  const user = await getUser();

  const id = user.id;
  const menu = await getHistory(id);

  return menu;
}
