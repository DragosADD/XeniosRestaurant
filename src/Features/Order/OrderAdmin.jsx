import { Form, useLoaderData, useNavigate } from 'react-router-dom';
import { getOrder } from '../../Services/apiRestaurant';
import {
  calcMinutesLeft,
  formatCurrency,
  formatDate,
} from '../../utils/helpers';

import OrderItem from './OrderItem';
import Button from '../../UI/button/Button';
import { useState } from 'react';
import LinkButton from '../../UI/button/LinkButton';

function OrderAdmin({ order }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    id: order.id,
    status: order.status,
    priority: order.priority,
    priorityPrice: order.priorityPrice,
    orderPrice: order.orderPrice,
    estimatedDelivery: order.estimatedDelivery,
    cart: order.cart,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    const updatedValue = name === 'priority' ? value === 'true' : value;
    if (name === 'priority' && formData.status === 'Delivered') return;

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: updatedValue,
    }));
  };
  const base =
    'rounded-full border-0 px-3 py-1 text-sm font-semibold uppercase tracking-wide text-red-50 focus:ring-0';

  const styles = {
    Processing: `${base} bg-cyan-500`,
    Delivered: `${base} bg-green-500`,
    Cancelled: `${base} bg-stone-600`,
  };

  const deliveryIn = calcMinutesLeft(formData.estimatedDelivery);

  return (
    <Form method="POST">
      <div className="space-y-8 px-4 py-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-xl font-semibold">Order #{formData.id} status</h2>

          <div className="space-x-2">
            <select
              className="rounded-full border-0 bg-red-500 px-3 py-1 text-sm font-semibold uppercase tracking-wide text-red-50 focus:ring-0"
              value={formData.priority}
              name="priority"
              onChange={handleInputChange}
            >
              <option value={true}>Priority</option>
              <option value={false}>No Priority</option>
            </select>
            <select
              className={
                styles[
                  formData.status === 'In process'
                    ? 'Processing'
                    : formData.status
                ]
              }
              name="status"
              value={formData.status}
              onChange={handleInputChange}
            >
              <option value="In process">In process order</option>
              <option value="Delivered">Completed order</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <ul className="divide-y divide-amber-200 border-b border-t border-amber-200">
          {formData.cart?.map((el) => {
            return <OrderItem item={el} key={el.id}></OrderItem>;
          })}
        </ul>

        <div className="flex flex-wrap items-center justify-between gap-2 bg-stone-200 px-6 py-5">
          <p className="font-medium">
            {deliveryIn >= 0
              ? `Only ${calcMinutesLeft(
                  formData.estimatedDelivery
                )} minutes left 😃`
              : 'Order should have arrived'}
          </p>
          <p className="text-xs text-stone-500">
            (Estimated delivery: {formatDate(formData.estimatedDelivery)})
          </p>
        </div>

        <div className="space-y-2 bg-stone-200 px-6 py-5">
          <p className="text-sm font-medium">
            Price Order: {formatCurrency(formData.orderPrice)}
          </p>
          {formData.priority && (
            <p className="text-sm font-medium">
              Price priority: {formatCurrency((formData.orderPrice * 20) / 100)}
            </p>
          )}
          <p className="font-bold">
            To pay on delivery:{' '}
            {formData.priority
              ? formatCurrency(
                  formData.orderPrice + (formData.orderPrice * 20) / 100
                )
              : formatCurrency(formData.orderPrice)}
          </p>
        </div>
        <input
          type="hidden"
          id="orderPrice"
          name="orderPrice"
          value={formData.orderPrice}
        />
        <input type="hidden" id="id" name="id" value={formData.id} />
        <Button type={'submit'}>Submit</Button>
        <Button
          type={'clearButton'}
          onClick={() => {
            window.location.reload();
          }}
        >
          Cancel
        </Button>
        <Button type={`clearButton`} onClick={() => navigate(-1)}>
          Go back
        </Button>
      </div>
    </Form>
  );
}

export default OrderAdmin;
