import React from 'react';

const CartContext = React.createContext({
  hasPriority: false,
  totalAmountFromRecipes: 0,
  totalOrder: 0,
  dataForSending: [],
  recipesInCart: [],
  recipesDisplayed: [],
  deleteRecipe: (recipeId) => {},
  addRecipe: (recipeObj) => {},
  clearCart: () => {},
  orderRecipes: (id) => {},
  changePriority: () => {},
});

export default CartContext;
