import { useContext } from 'react';
import { Link } from 'react-router-dom';
import CartContext from '../../Storage/CartContext';
import { formatCurrency } from '../../utils/helpers';

function CartOverview() {
  const cartContext = useContext(CartContext);

  const numberOfItems = cartContext.recipesInCart.length;

  // const totalOrder = cartContext.totalOrder;

  return (
    <div className=" bottom-0  left-0 right-0 flex h-12 items-center justify-between bg-cyan-950 py-2 pl-6 pr-10 text-sm uppercase text-green-300 sm:px-6 md:h-20 md:text-base">
      <p className="space-x-3 text-green-100">
        {numberOfItems === 0 ? (
          <span>No Items</span>
        ) : (
          <>
            <span>{numberOfItems} Items worth of</span>
            <span>
              {cartContext.hasPriority
                ? formatCurrency(
                    cartContext.totalAmountFromRecipes +
                      (cartContext.totalAmountFromRecipes * 20) / 100
                  )
                : formatCurrency(cartContext.totalAmountFromRecipes)}
            </span>
          </>
        )}
      </p>
      {numberOfItems === 0 ? (
        <Link to="/menu">Click here to go to Menu! </Link>
      ) : (
        <Link to="/cart">Open cart </Link>
      )}
    </div>
  );
}

export default CartOverview;
