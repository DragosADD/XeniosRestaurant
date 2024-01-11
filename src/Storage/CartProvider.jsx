import { useReducer } from 'react';
import CartContext from './CartContext';
import { calcPriceWithPriority } from '../utils/helpers';
import { createOrder } from '../Services/apiRestaurant';

function calcPriceOfRecipes(recipesDisplayed) {
  return recipesDisplayed.reduce(
    (accumulator, obj) => accumulator + obj.unitPrice,
    0
  );
}

const defaultCartState = {
  hasPriority: false,
  totalAmountFromRecipes: 0,
  recipesInCart: [],
  recipesDisplayed: [],
  dataForSending: [],
};

const CartReducer = (state, action) => {
  if (action.type === 'CLEAR') {
    return {
      ...state,
      recipesInCart: [],
      recipesDisplayed: [],
      totalAmountFromRecipes: 0,
      totalOrder: 0,
      dataForSending: [],
    };
  }
  if (action.type === 'ADD') {
    const updatedRecipes = [...state.recipesInCart, action.recipeObj];
    const recipesInTheOrder = updatedRecipes.filter(
      (el) => el.foodId === action.recipeObj.foodId
    );

    const updateDisplayedItems = [...state.recipesDisplayed];
    const recipeDisplayed = updateDisplayedItems.find(
      (el) => el.foodId === action.recipeObj.foodId
    );
    if (recipeDisplayed) {
      recipeDisplayed.quantity = recipesInTheOrder.length;
      recipeDisplayed.totalPrice =
        recipesInTheOrder.length * action.recipeObj.unitPrice;
    } else {
      updateDisplayedItems.push({
        foodId: action.recipeObj.foodId,
        name: action.recipeObj.name,
        quantity: 1,
        unitPrice: action.recipeObj.unitPrice,
        totalPrice: action.recipeObj.unitPrice,
      });
    }
    const updatedTotalAmountFromRecipes = calcPriceOfRecipes(updatedRecipes);

    return {
      ...state,
      totalAmountFromRecipes: updatedTotalAmountFromRecipes,
      recipesDisplayed: updateDisplayedItems,
      recipesInCart: updatedRecipes,
    };
  }
  if (action.type === 'DELETE') {
    const updatedRecipes = state.recipesInCart.filter(
      (obj) => obj.foodId !== action.id
    );
    const updatedRecipesDisplayed = state.recipesDisplayed.filter(
      (obj) => obj.foodId !== action.id
    );
    const updateTotalAmountFromRecipes = calcPriceOfRecipes(updatedRecipes);

    return {
      ...state,
      totalAmountFromRecipes: updateTotalAmountFromRecipes,
      recipesDisplayed: updatedRecipesDisplayed,
      recipesInCart: updatedRecipes,
    };
  }
  if (action.type === 'GIVEPRIORITY') {
    return {
      ...state,
      hasPriority: !state.hasPriority,
    };
  }

  if (action.type === 'ORDER') {
    const orderItems = state.recipesDisplayed.map((item) => {
      return {
        foodId: item.foodId,
        quantity: item.quantity,
        totalPrice: item.totalPrice,
      };
    });
    console.log(orderItems);
    const timeNow = new Date(new Date().getTime() + 60 * 60 * 4000);
    const order = {
      status: 'In process',
      priority: state.hasPriority,
      priorityPrice: state.hasPriority
        ? calcPriceWithPriority(state.totalAmountFromRecipes) -
          state.totalAmountFromRecipes
        : 0,
      orderPrice: state.totalAmountFromRecipes,
      Total_price: state.hasPriority
        ? calcPriceWithPriority(state.totalAmountFromRecipes)
        : state.totalAmountFromRecipes,
      estimatedDelivery: timeNow,
    };

    return {
      ...state,
      dataForSending: [order, orderItems],
    };
  }
};

export default function CartProvider(props) {
  const [cartState, dispatchCartAction] = useReducer(
    CartReducer,
    defaultCartState
  );

  const clearCartHandler = () => {
    dispatchCartAction({ type: 'CLEAR' });
  };

  const addRecipeHandler = (recipeObj) => {
    dispatchCartAction({ type: 'ADD', recipeObj: recipeObj });
  };

  const deleteRecipeHandler = (id) => {
    dispatchCartAction({ type: 'DELETE', id: id });
  };

  const orderRecipesHandler = (obj) => {
    dispatchCartAction({ type: 'ORDER', obj: obj });
  };
  const changePriorityHandler = () => {
    dispatchCartAction({ type: 'GIVEPRIORITY' });
  };

  const cartContext = {
    dataForSending: cartState.dataForSending,
    totalAmountFromRecipes: cartState.totalAmountFromRecipes,
    recipesInCart: cartState.recipesInCart,
    recipesDisplayed: cartState.recipesDisplayed,
    addRecipe: addRecipeHandler,
    clearCart: clearCartHandler,
    deleteRecipe: deleteRecipeHandler,
    orderRecipes: orderRecipesHandler,
    changePriority: changePriorityHandler,
  };

  return (
    <CartContext.Provider value={cartContext}>
      {props.children}
    </CartContext.Provider>
  );
}
