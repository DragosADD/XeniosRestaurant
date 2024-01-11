import { Form } from 'react-router-dom';
import Modal from '../../../UI/Modals/Modal';
import { useState } from 'react';
import Button from '../../../UI/button/Button';

export default function AddIngredientForm(props) {
  const [formData, setFormData] = useState({
    nameIngredient: '',
    caloricValue: '',
  });

  const [ingToDelete, setIngToDelete] = useState(null);

  const [deleteOrAdd, setDeleteOrAdd] = useState(true);

  const handleInputChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleDeleteOrAdd = () => {
    setDeleteOrAdd((prev) => !prev);
  };

  const handleDeleteIngredient = (e) => {
    e.preventDefault();
    const selectedIngredientId = e.target.value;
    console.log(selectedIngredientId);
    setIngToDelete(selectedIngredientId);
  };

  return (
    <Modal onClose={props.onClose}>
      <button
        className={`my-2 p-2 font-semibold ${
          deleteOrAdd ? 'bg-lime-300 text-cyan-900' : 'bg-red-200 text-gray-600'
        } rounded-lg`}
        onClick={handleDeleteOrAdd}
      >
        Delete or Add Ingredients
      </button>
      <div className="ml-2 flex flex-col items-center justify-center font-medium text-cyan-950 ">
        {deleteOrAdd ? (
          <Form method="post" onSubmit={props.onClose}>
            <h2 className="mb-8 mt-5 text-xl font-semibold">Add Ingredient</h2>
            <div className="my-2 flex flex-col">
              <label>Name of the Ingredient</label>
              <input
                id="nameIngredient"
                type="nameIngredient"
                name="nameIngredient"
                value={formData.nameIngredient}
                onChange={handleInputChange}
                required
                className="bg-yellow-100 "
              />
              <label>Caloric value</label>
              <input
                id="caloricValue"
                type="caloricValue"
                name="caloricValue"
                value={formData.caloricValue}
                onChange={handleInputChange}
                required
                className="bg-yellow-100 "
              />
              <input
                type="hidden"
                id="typeOfForm"
                name="typeOfForm"
                value={'addIngredient'}
              />
            </div>
            <Button type="submit">Add</Button>
            <Button type="button" onClick={props.onClose}>
              CLOSE
            </Button>
          </Form>
        ) : (
          <Form method="post" onSubmit={props.onClose}>
            <h2 className="mb-8 mt-5 text-xl font-semibold">
              Delete Ingredient
            </h2>
            <div className="my-2 flex flex-col">
              <select
                id="ingredient"
                name="ingredient"
                onChange={(event) => handleDeleteIngredient(event)}
                value={ingToDelete}
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
            </div>
            <input
              type="hidden"
              id="typeOfForm"
              name="typeOfForm"
              value={'deleteIngredient'}
            />
            <Button type="submit">Delete</Button>
            <Button type="button" onClick={props.onClose}>
              CLOSE
            </Button>
          </Form>
        )}
      </div>
    </Modal>
  );
}
