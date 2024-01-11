import React from 'react';
import {
  calcMinutesLeft,
  formatCurrency,
  formatDate,
} from '../../utils/helpers';
import {
  Form,
  useLoaderData,
  useNavigate,
  useRouteLoaderData,
} from 'react-router-dom/dist';
import Button from '../../UI/button/Button';

export default function HistoryItem({ order, isEditing, showingDetails }) {
  // const user = useRouteLoaderData('root').role === `service_role`;
  const {
    id,
    Total_price,
    estimatedDelivery,
    orderPrice,
    priority,
    priorityPrice,
    status,
    address,
    mobileNumber,
  } = order;

  const deliveryIn = calcMinutesLeft(estimatedDelivery);

  const navigation = useNavigate();

  const redirectHandler = () => {
    navigation(`/order/${id}`);
  };

  const base =
    'rounded-full px-3 py-1 text-sm font-semibold uppercase tracking-wide';

  const style = {
    Processing: `${base} text-cyan-500`,
    Delivered: `${base} text-green-500`,
    Cancelled: `${base} text-stone-600`,
  };

  return (
    <li
      className="cursor-pointer bg-stone-200 hover:bg-stone-500"
      onClick={redirectHandler}
    >
      <div className="flex flex-wrap items-center justify-between gap-2 px-6 py-5 ">
        <h2 className="text-lg font-semibold">Order# {id} status</h2>
        <div className="space-x-2">
          {priority && (
            <span className=" px-3 py-1 text-sm  uppercase tracking-wide text-red-600">
              Priority
            </span>
          )}
          <span
            className={style[status === 'In process' ? 'Processing' : status]}
          >
            {status} order
          </span>
        </div>
      </div>
      {showingDetails && (
        <div className="my-2 px-6 py-1 text-cyan-800">
          <p className="text-sm">
            Address: {address ? `${address}` : `Cient has to be called`}
          </p>
          <p className="text-sm">
            Phone: {mobileNumber ? `${mobileNumber}` : `No phone number`}
          </p>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-2  px-6 py-1">
        <p className="font-medium">
          {deliveryIn >= 0
            ? `Only ${calcMinutesLeft(estimatedDelivery)} minutes left 😃`
            : 'Order should have arrived'}
        </p>
        <p className="text-xs text-stone-500">
          (Estimated delivery: {formatDate(estimatedDelivery)})
        </p>
      </div>
      <div className="space-y-2 px-6 py-1 pb-3">
        {priority && (
          <p className="text-sm font-medium">
            Price Order: {formatCurrency(orderPrice)}
          </p>
        )}
        {priority && (
          <p className="text-sm font-medium">
            Price priority: {formatCurrency(priorityPrice)}
          </p>
        )}
        <div className="flex items-center justify-between">
          <p className="font-bold">
            Total Price of the order: {formatCurrency(Total_price)}
          </p>
          {isEditing && status !== 'Cancelled' && status !== 'Delivered' && (
            <Form method="POST">
              <input
                type="hidden"
                id="status"
                name="status"
                value={'Delivered'}
              />
              <input type="hidden" id="id" name="id" value={id} />
              <Button type="submit">✔</Button>
            </Form>
          )}
        </div>
      </div>
    </li>
  );
}
