import { useContext, useEffect, useState } from 'react';
import Button from '../../UI/button/Button';
import { formatCurrency, ingredientsText } from '../../utils/helpers';
import CartContext from '../../Storage/CartContext';
import { useRouteLoaderData } from 'react-router-dom';
import {
  addBackRecipeFromOnMenu,
  removeRecipeFromMenu,
} from '../../Services/apiRestaurant';
import EdditRecipeForm from './EdAddForm/EdditRecipeForm';

function MenuItem({ recipe, onShow, allIngredients }) {
  const { foodId, name, unitPrice, ingredients, soldOut, imageUrl, IsOnMenu } =
    recipe;
  const cartCtx = useContext(CartContext);
  const [isEditting, setIsEditting] = useState(false);

  const handlerShowEditRecipe = () => {
    setIsEditting(true);
  };

  const handlerCloseEditRecipe = () => {
    setIsEditting(false);
  };
  const addRecipeHandler = () => {
    cartCtx.addRecipe(recipe);
  };

  const user = useRouteLoaderData('root');

  const cutRecipefromMenu = () => {
    removeRecipeFromMenu(foodId);
  };

  const addBackOnMenu = () => {
    addBackRecipeFromOnMenu(foodId);
  };
  const ingredientText = ingredientsText(ingredients);

  return (
    <>
      {isEditting && (
        <EdditRecipeForm
          onClose={handlerCloseEditRecipe}
          item={recipe}
          ingredients={allIngredients}
        />
      )}
      <li className="flex gap-4 py-2">
        <img
          src={imageUrl}
          alt={name}
          className={`h-24 w-24 ${soldOut ? 'opacity-70 grayscale' : ''}`}
        />
        <div className="flex grow flex-col">
          <p className={`font-medium${soldOut ? ' grayscale' : ''}`}>{name}</p>
          <p
            className={`text-sm capitalize italic${
              soldOut ? ' grayscale' : ''
            }`}
          >
            {ingredientText}
          </p>
          <div className="mt-auto flex  items-center justify-between">
            {!soldOut ? (
              <p className="text-sm">{formatCurrency(unitPrice)}</p>
            ) : (
              <p className="text-sm font-medium uppercase text-lime-800">
                Sold out
              </p>
            )}

            {user?.role !== 'service_role' ? (
              <Button
                type="addButton"
                disabled={soldOut ? true : false}
                onClick={addRecipeHandler}
              >
                Add
              </Button>
            ) : (
              <div>
                <Button
                  type="edit"
                  disabled={false}
                  onClick={handlerShowEditRecipe}
                >
                  edit
                </Button>
                <Button
                  type="addButton"
                  disabled={false}
                  onClick={IsOnMenu ? cutRecipefromMenu : addBackOnMenu}
                >
                  {IsOnMenu ? 'remove' : 'add back'}
                </Button>
              </div>
            )}
          </div>
        </div>
      </li>
    </>
  );
}

export default MenuItem;
