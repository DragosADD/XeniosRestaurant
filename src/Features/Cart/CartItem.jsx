import { useContext } from 'react';
import Button from '../../UI/button/Button';
import { formatCurrency } from '../../utils/helpers';
import CartContext from '../../Storage/CartContext';

function CartItem({ item }) {
  const { foodId, name, quantity, totalPrice } = item;

  const cartCtx = useContext(CartContext);

  const deleteOrderHandler = () => {
    cartCtx.deleteRecipe(foodId);
  };

  return (
    <li className="py-2 sm:flex sm:items-center sm:justify-between">
      <p className="mb-1 sm:mb-0">
        {quantity}&times; {name}
      </p>
      <div className="flex items-center justify-between sm:gap-6">
        <p className="text-sm font-bold">{formatCurrency(totalPrice)}</p>
        <Button type="deleteOrder" onClick={deleteOrderHandler}>
          Delete
        </Button>
      </div>
    </li>
  );
}

export default CartItem;
