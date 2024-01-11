import {
  redirect,
  useLoaderData,
  useRouteLoaderData,
} from 'react-router-dom/dist';
import {
  getHistory,
  updateStatusToCompleted,
} from '../../Services/apiRestaurant';
import { getUser } from '../../Utils/auth';
import HistoryItem from './HistoryItem';
import { useState } from 'react';

const today = new Date();
today.setHours(0, 0, 0, 0);

export default function AdminOrderHistory() {
  const orders = useLoaderData();
  const [showHistory, setShowHistory] = useState(true);

  const showHistoryHandler = () => {
    setShowHistory((prevState) => !prevState);
  };

  const todayOrdersInactive = orders.filter((el) => {
    const dateOfTheOrder = new Date(el.estimatedDelivery);
    return (
      dateOfTheOrder >= today &&
      (el.status === 'Delivered' || el.status === 'Cancelled')
    );
  });

  const todayOrdersActive = orders.filter((el) => {
    const dateOfTheOrder = new Date(el.estimatedDelivery);
    return dateOfTheOrder >= today && el.status === 'In process';
  });

  const ShowTodayOrdersActive = todayOrdersActive?.map((order) => {
    return (
      <HistoryItem
        key={order.id}
        order={order}
        isEditing={true}
        showHistory={showHistory}
        showingDetails={true}
      />
    );
  });
  const ShowTodayOrdersInactive = todayOrdersInactive?.map((order) => {
    return <HistoryItem key={order.id} order={order} showingDetails={true} />;
  });

  const allOrderHistory = orders?.map((order) => {
    return <HistoryItem key={order.id} order={order} showingDetails={true} />;
  });

  return (
    <ul className="space-y-8 divide-y divide-amber-200  border-b border-t border-amber-200 px-4 py-6">
      <div className="flex justify-center">
        {showHistory ? (
          <button
            className="my-2 rounded-lg bg-red-300 p-2 font-semibold
          text-cyan-900"
            onClick={showHistoryHandler}
          >
            Show all orders
          </button>
        ) : (
          <button
            className="my-2 rounded-lg bg-lime-300 p-2 font-semibold
                 text-cyan-900"
            onClick={showHistoryHandler}
          >
            Show all orders Today
          </button>
        )}
      </div>
      {/* <h1 className="mb-4 text-2xl font-semibold">Order History</h1> */}
      {showHistory && ShowTodayOrdersActive}
      {showHistory ? ShowTodayOrdersInactive : allOrderHistory}
    </ul>
  );
}

export async function loader() {
  const user = await getUser();

  if (user.role === 'service_role') {
    const orders = await getHistory('all');
    const sortedOrders = orders.sort((a, b) => {
      const dateA = new Date(a.estimatedDelivery);
      const dateB = new Date(b.estimatedDelivery);

      return dateB - dateA; // descending
    });
    return sortedOrders;
  }

  return redirect('/history');
}

export async function action({ request }) {
  const user = await getUser();
  if (user.role !== 'service_role') {
    throw new Error(`You can't do that`);
  }
  const data = await request.formData();
  const orderId = data.get('id');
  const updatedStatusOfOrder = await updateStatusToCompleted(orderId);

  return updatedStatusOfOrder;
}
