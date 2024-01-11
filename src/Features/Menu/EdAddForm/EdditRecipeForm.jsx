import { Form } from 'react-router-dom';
import Modal from '../../../UI/Modals/Modal';
import Button from '../../../UI/button/Button';
import { useState } from 'react';

export default function EdditRecipeForm(props) {
  const item = props.item;

  const [readyToEnterIngredient, setReadyToEnterIngredient] = useState(false);
  const [numberOfIngredients, setNumberOfIngredients] = useState(0);
  const readyToEnterIngredientHandler = (e) => {
    e.preventDefault();
    if (numberOfIngredients > 0) {
      setReadyToEnterIngredient((prev) => !prev);
    }
  };

  const [formData, setFormData] = useState({
    ingredients: [],
    soldOut: item.soldOut,
    unitPrice: item.unitPrice,
    foodId: item.foodId,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleDropdownChange = (event, index) => {
    const selectedIngredientId = event.target.value;
    console.log(selectedIngredientId);
    setFormData((prevFormData) => {
      const updatedIngredients = [...prevFormData.ingredients];
      updatedIngredients[index] = {
        ingredientId: selectedIngredientId,
        grams: '',
      };
      console.log(updatedIngredients);
      return {
        ...prevFormData,
        ingredients: updatedIngredients,
      };
    });
  };

  const handleGramsInputChange = (event, index) => {
    const gramsValue = event.target.value;
    setFormData((prevFormData) => {
      const updatedIngredients = [...prevFormData.ingredients];
      updatedIngredients[index].grams = gramsValue;
      return {
        ...prevFormData,
        ingredients: updatedIngredients,
      };
    });
  };

  return (
    <Modal onClose={props.onClose}>
      <div className="ml-2 flex flex-col items-center justify-center font-medium text-cyan-950 ">
        <Form method="post" onSubmit={props.onClose}>
          <h2 className="mb-8 mt-5 text-xl font-semibold">Eddit Recipe</h2>
          <div className="my-2 flex flex-col">
            <input
              type="hidden"
              id="ingredients"
              name="ingredients"
              value={JSON.stringify(formData.ingredients)}
            />
            {!readyToEnterIngredient ? (
              <div className="space-y-2">
                <label htmlFor="inputField" className="text-sm">
                  If you wish to change ingredients enter how many ingredients
                  you need else, leave this how it it is.
                </label>
                <div className="flex items-center space-x-4">
                  <input
                    type="text"
                    id="inputField"
                    className="w-16 rounded border border-gray-300 bg-yellow-100 p-2"
                    value={numberOfIngredients}
                    onChange={(e) => setNumberOfIngredients(e.target.value)}
                  />
                  <Button onClick={readyToEnterIngredientHandler} type="edit">
                    Choose ingredients
                  </Button>
                </div>
              </div>
            ) : (
              Array.from({ length: numberOfIngredients }, (_, index) => (
                <div key={index} className="my-4">
                  <label htmlFor={`dropdown-${index + 1}`} className="text-sm">
                    {`Ingredient ${index + 1}:`}
                  </label>
                  <select
                    id={`dropdown-${index + 1}`}
                    onChange={(event) => handleDropdownChange(event, index)}
                    className="rounded border border-gray-300 bg-yellow-100 p-2"
                  >
                    <option value="">Select...</option>
                    {props.ingredients.map((ingredient) => (
                      <option
                        key={ingredient.idIngredient}
                        value={ingredient.idIngredient}
                      >
                        {ingredient.name}
                      </option>
                    ))}
                  </select>
                  <label
                    htmlFor={`grams-${index + 1}`}
                    className="mt-2 text-sm"
                  >
                    {`Grams ${index + 1}:`}
                  </label>
                  <input
                    type="text"
                    id={`grams-${index + 1}`}
                    value={formData.ingredients[index]?.grams || ''}
                    onChange={(event) => handleGramsInputChange(event, index)}
                    className="w-20 rounded border border-gray-300 bg-yellow-100 p-2"
                  />
                </div>
              ))
            )}
          </div>
          <div className="my-2 flex flex-col">
            <label>Is It Sold Out?</label>
            <select
              id="soldOut"
              type="soldOut"
              name="soldOut"
              className="bg-yellow-100"
              value={formData.soldOut}
              onChange={handleInputChange}
              required
            >
              <option value={true}>Yes</option>
              <option value={false}>No</option>
            </select>
          </div>
          <div className="my-2 flex flex-col">
            <label>Price of Portion</label>
            <input
              id="unitPrice"
              type="unitPrice"
              step="0.01"
              name="unitPrice"
              value={formData.unitPrice}
              onChange={handleInputChange}
              required
              className="bg-yellow-100"
            />
          </div>
          <input type="hidden" id="id" name="id" value={formData.foodId} />
          <input
            type="hidden"
            id="typeOfForm"
            name="typeOfForm"
            value={'editRecipe'}
          />

          <Button type="submit">Edit</Button>
          <Button type="button" onClick={props.onClose}>
            CLOSE
          </Button>
        </Form>
      </div>
    </Modal>
  );
}
