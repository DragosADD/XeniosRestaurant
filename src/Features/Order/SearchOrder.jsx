import { useState } from 'react';
import { getOrder } from '../../Services/apiRestaurant';
import { useNavigate } from 'react-router-dom';

function SearchOrder() {
  const [checkOrder, setCheckOrder] = useState(false);
  const [orderId, setOrderId] = useState();
  const navigate = useNavigate();

  function handleSumbit(e) {
    e.preventDefault();
    if (!orderId) return;
    navigate(`/order/${orderId}`);
    setOrderId('');
  }

  return (
    <>
      {checkOrder ? (
        <form className="text-sm font-normal" onSubmit={handleSumbit}>
          <input
            className="focus: focus: ml-3 w-32 rounded-full bg-lime-100 px-4 py-2 text-sm outline-none placeholder:text-lime-900 focus:ring focus:ring-amber-700 focus:ring-opacity-50 md:w-48"
            placeholder="Order number"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
          />
        </form>
      ) : (
        <button
          className=" ml-3 w-32 rounded-md bg-amber-700 p-1 text-sm text-amber-50 "
          onClick={() => setCheckOrder(true)}
        >
          Check order status
        </button>
      )}
    </>
  );
}

export default SearchOrder;
