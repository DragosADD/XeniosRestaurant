import React, { useEffect, useReducer } from 'react';
import DropdownIngredients from '../dropdown/DropdownIngredients';
import AddMenuItem from '../../Features/Menu/AddMenuItem';

// ... (import statements)

const reducer = (state, action) => {
  if (action.type === 'DELETE') {
    const updatedIngredients = state.ingredients.filter(
      (ingredient) => ingredient !== null && ingredient.id !== action.idToDelete
    );
    return { ...state, ingredients: updatedIngredients };
  }

  if (action.type === 'SEND_DATA_TO_RECIPE') {
    const updatedIngredients = state.ingredients.map((ingredient) =>
      ingredient !== null && ingredient.id === action.idToUpdate
        ? action.ingredientDetails
        : ingredient
    );
    return { ...state, ingredients: updatedIngredients };
  }

  if (action.type === 'ADD') {
    const newIngredient = {
      id: Date.now(),
    };
    return {
      ...state,
      ingredients: [...state.ingredients, newIngredient],
    };
  }

  return { ...state };
};

const ingredientDataForRecipe = {
  ingredients: [],
};

function IngredientAddition(props) {
  const [ingredientState, dispatchIngredients] = useReducer(
    reducer,
    ingredientDataForRecipe
  );

  const sendDataToForRecipe = (id, data) => {
    dispatchIngredients({
      type: 'SEND_DATA_TO_RECIPE',
      idToUpdate: id,
      ingredientDetails: data,
    });
  };

  return (
    <React.Fragment>
      {ingredientState.ingredients &&
        ingredientState.ingredients.map(
          (ingredient) =>
            ingredient !== null &&
            ingredient.id !== undefined && (
              <div key={ingredient.id} className="flex justify-between">
                <DropdownIngredients
                  ingredients={props.ingredients || []}
                  dataFromComponent={(data) =>
                    sendDataToForRecipe(ingredient.id, data)
                  }
                />
                <input
                  type="text"
                  name="price"
                  id="weight"
                  className="block w-20 rounded-md border-0 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                  placeholder="0.00 gr"
                />
                <button
                  onClick={() =>
                    dispatchIngredients({
                      type: 'DELETE',
                      idToDelete: ingredient.id,
                    })
                  }
                >
                  ❌
                </button>
              </div>
            )
        )}
      <div>
        <AddMenuItem
          onOpen={() => dispatchIngredients({ type: 'ADD' })}
          classes={'h-3 m-1'}
        />
      </div>
    </React.Fragment>
  );
}

export default IngredientAddition;
