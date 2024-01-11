// Test ID: IIDSAT

import { redirect, useLoaderData, useRouteLoaderData } from 'react-router-dom';
import {
  getOrder,
  updateStatusPriorityRecipe,
} from '../../Services/apiRestaurant';
import {
  calcMinutesLeft,
  formatCurrency,
  formatDate,
} from '../../utils/helpers';

import OrderItem from './OrderItem';
import OrderAdmin from './OrderAdmin';
import { getUser } from '../../Utils/auth';

function Order() {
  const order = useLoaderData();

  const {
    id,
    status,
    priority,
    priorityPrice,
    orderPrice,
    estimatedDelivery,
    cart,
  } = order[0];

  const user = useRouteLoaderData('root').role;

  const deliveryIn = calcMinutesLeft(estimatedDelivery);

  const base =
    'rounded-full border-0 px-3 py-1 text-sm font-semibold uppercase tracking-wide text-red-50 focus:ring-0';

  const styles = {
    Processing: `${base} bg-cyan-500`,
    Delivered: `${base} bg-green-500`,
    Cancelled: `${base} bg-stone-600`,
  };

  return (
    <>
      {user === 'service_role' ? (
        <OrderAdmin order={order[0]} />
      ) : (
        <div className="space-y-8 px-4 py-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-xl font-semibold">Order #{id} status</h2>

            <div className="space-x-2">
              {priority && (
                <span className="rounded-full bg-red-500 px-3 py-1 text-sm font-semibold uppercase tracking-wide text-red-50">
                  Priority
                </span>
              )}
              <span
                className={
                  styles[status === 'In process' ? 'Processing' : status]
                }
              >
                {status} order
              </span>
            </div>
          </div>

          <ul className="divide-y divide-amber-200 border-b border-t border-amber-200">
            {cart?.map((el) => {
              return <OrderItem item={el} key={el.id}></OrderItem>;
            })}
          </ul>

          <div className="flex flex-wrap items-center justify-between gap-2 bg-stone-200 px-6 py-5">
            <p className="font-medium">
              {deliveryIn >= 0
                ? `Only ${calcMinutesLeft(estimatedDelivery)} minutes left 😃`
                : 'Order should have arrived'}
            </p>
            <p className="text-xs text-stone-500">
              (Estimated delivery: {formatDate(estimatedDelivery)})
            </p>
          </div>

          <div className="space-y-2 bg-stone-200 px-6 py-5">
            <p className="text-sm font-medium">
              Price Order: {formatCurrency(orderPrice)}
            </p>
            {priority && (
              <p className="text-sm font-medium">
                Price priority: {formatCurrency(priorityPrice)}
              </p>
            )}
            <p className="font-bold">
              To pay on delivery: {formatCurrency(orderPrice + priorityPrice)}
            </p>
          </div>
        </div>
      )}
    </>
  );
}

export async function loader({ params }) {
  const order = await getOrder(params.orderId);
  return order;
}

export async function action({ request }) {
  const data = await request.formData();
  const user = await getUser();

  if (user.role !== 'service_role') {
    throw new Error(`You are not an admin, you cannot proceed.`);
  }
  const newdData = {
    id: data.get('id'),
    status: data.get('status'),
    priority: data.get('priority'),
    orderPrice: data.get('orderPrice'),
    priorityPrice:
      data.get('priority') === 'true'
        ? (Number(data.get('orderPrice')) * 20) / 100
        : 0,
    Total_price:
      data.get('priority') === 'true'
        ? Number(data.get('orderPrice')) +
          (Number(data.get('orderPrice')) * 20) / 100
        : Number(data.get('orderPrice')),
  };
  const newData = await updateStatusPriorityRecipe(newdData);

  return redirect('/orders/edit');
}

export default Order;
