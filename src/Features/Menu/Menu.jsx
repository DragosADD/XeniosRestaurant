import { useLoaderData, useRouteLoaderData } from 'react-router-dom';
import {
  addIngredient,
  deleteIngredient,
  getIngredients,
  getMenu,
  updateRecipe,
  uploadRecipe,
} from '../../Services/apiRestaurant';
import MenuItem from './MenuItem';
import AddMenuItem from './AddMenuItem';
import { useEffect, useReducer, useState } from 'react';
import EdditRecipeForm from './EdAddForm/EdditRecipeForm';
import AddRecipeForm from './EdAddForm/AddRecipeForm';
import AddIngredientForm from './EdAddForm/AddIngredientForm';

const reducer = (state, action) => {
  if (action.type === 'SET_INITIAL_STATE') {
    return action.payload;
  }

  return { ...state };
};

function Menu() {
  const menu = useLoaderData();
  const user = useRouteLoaderData('root');
  const [showAllRecipes, setshowAllRecipes] = useState(false);
  const [isAddingRecipe, setIsAddingRecipe] = useState(false);
  const [ingredientState, dispatchIngredients] = useReducer(reducer, {});
  const [isAddingIngredient, setIsAddingIngredient] = useState(false);

  useEffect(() => {
    if (!(user?.role === 'service_role')) return;
    const fetchIngredients = async () => {
      try {
        const initialState = await getIngredients();
        dispatchIngredients({
          type: 'SET_INITIAL_STATE',
          payload: initialState,
        });
      } catch (error) {
        console.log('Error fetching ingredients:', error);
      }
    };

    fetchIngredients();
  }, []);

  const handleShowClick = () => {
    setshowAllRecipes((prevState) => !prevState);
  };

  const showAddingForm = () => {
    setIsAddingRecipe(true);
  };

  const hideAddingForm = () => {
    setIsAddingRecipe(false);
  };
  const handleAddIngredient = () => {
    setIsAddingIngredient(true);
  };

  const hideAddingIngredient = () => {
    setIsAddingIngredient(false);
  };

  return (
    <>
      <div className="flex justify-center">
        {user?.role === 'service_role' && (
          <div className="space-x-4">
            <button
              className={`my-2 p-2 font-semibold ${
                showAllRecipes
                  ? 'bg-lime-300 text-cyan-900'
                  : 'bg-gray-200 text-gray-600'
              } rounded-lg`}
              onClick={handleShowClick}
            >
              Show all Recipes
            </button>
            <button
              className={`my-2 rounded-lg bg-lime-300 p-2 font-semibold text-cyan-900`}
              onClick={handleAddIngredient}
            >
              Add or delete Ingredients
            </button>
          </div>
        )}
      </div>
      <ul className=" divide-y divide-amber-200 px-2">
        {!showAllRecipes
          ? menu.menu.map((recipe) => {
              if (recipe.IsOnMenu) {
                return (
                  <MenuItem
                    recipe={recipe}
                    key={recipe.foodId}
                    allIngredients={ingredientState}
                  />
                );
              }
            })
          : menu.menu.map((recipe) => {
              return (
                <MenuItem
                  recipe={recipe}
                  key={recipe.foodId}
                  ingredients={ingredientState}
                />
              );
            })}
      </ul>
      {user?.role === 'service_role' && <AddMenuItem onOpen={showAddingForm} />}
      {isAddingRecipe && (
        <AddRecipeForm onClose={hideAddingForm} ingredients={ingredientState} />
      )}
      {isAddingIngredient && (
        <AddIngredientForm
          onClose={hideAddingIngredient}
          ingredients={menu.ingredients}
        />
      )}
    </>
  );
}

export async function loader() {
  const menu = await getMenu();
  const ingredients = await getIngredients();
  const bulk = { menu: menu, ingredients: ingredients };

  return bulk;
}

export async function action({ request }) {
  const data = await request.formData();
  const typeOfForm = data.get('typeOfForm');

  if (typeOfForm === 'addRecipe') {
    const newdData = {
      name: data.get('name'),
      ingredients: data.get('ingredients'),
      soldOut: data.get('soldOut'),
      unitPrice: data.get('unitPrice'),
      imageUrl: data.get('imageUrl'),
      IsOnMenu: data.get('IsOnMenu'),
    };
    const result = await uploadRecipe(newdData);
    return result;
  }
  if (typeOfForm === 'editRecipe') {
    const updatedData = {
      foodId: data.get('id'),
      ingredients: data.get('ingredients'),
      soldOut: data.get('soldOut'),
      unitPrice: data.get('unitPrice'),
    };

    const result = await updateRecipe(updatedData);

    return result;
  }

  if (typeOfForm === 'addIngredient') {
    const newIngredient = {
      caloricValue: data.get('caloricValue'),
      nameIngredient: data.get('nameIngredient'),
    };
    const result = await addIngredient(newIngredient);
    return result;
  }

  if (typeOfForm === 'deleteIngredient') {
    const toBeDeleted = {
      idIngredient: data.get('ingredient'),
    };
    await deleteIngredient(toBeDeleted.idIngredient);
  }
  return null;
}

export default Menu;
