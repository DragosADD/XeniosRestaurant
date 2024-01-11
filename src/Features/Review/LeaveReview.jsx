import React, { useState } from 'react';

import { Form, useRouteLoaderData } from 'react-router-dom';
import Button from '../../UI/button/Button';

export default function LeaveReview({
  recipesOfUser,
  lastReview,
  idUser,
  name,
}) {
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [leaveReview, setLeaveReview] = useState(false);
  const [reviewData, setReviewData] = useState({
    recipeId: '',
    rating: 5,
    comment: '',
  });

  const handleRecipeSelect = (recipe) => {
    setSelectedRecipe(recipe);
    setReviewData((prevData) => {
      return {
        ...prevData,
        recipeId: recipe.foodId,
      };
    });
  };

  const handleLeaveReview = (e) => {
    e.preventDefault();
    setLeaveReview((prev) => !prev);
  };

  const handleInputChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setReviewData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };
  const handleRatingChange = (e) => {
    setReviewData((prevFormData) => ({
      ...prevFormData,
      rating: Number(e.target.value),
    }));
  };

  return (
    <div className=" bg-cyan-200 p-4 text-cyan-800">
      <h2 className="mb-4 text-2xl font-semibold" onClick={handleLeaveReview}>
        Leave a Review
      </h2>
      {leaveReview && (
        <div>
          {selectedRecipe ? (
            <div className="mb-4">
              <h3 className="text-lg font-semibold">{selectedRecipe.name}</h3>
              <img
                src={selectedRecipe.imageUrl}
                alt={selectedRecipe.name}
                className="mt-2 rounded-lg"
                style={{
                  width: '100%',
                  maxHeight: '200px',
                  objectFit: 'cover',
                }}
              />
            </div>
          ) : (
            <div className="mb-4">
              <h3 className="text-lg font-semibold">Select a Recipe</h3>
              <ul>
                {recipesOfUser.map((recipe) => (
                  <li
                    key={recipe.foodId}
                    onClick={() => handleRecipeSelect(recipe)}
                    className="cursor-pointer hover:text-gray-300"
                  >
                    {recipe.name}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {selectedRecipe && (
            <Form method="post">
              <input
                type="hidden"
                id="review"
                name="review"
                value={JSON.stringify(reviewData)}
              />

              <label htmlFor="rating" className="mb-2 block">
                Rating:
                <select
                  id="rating"
                  name="rating"
                  onChange={handleRatingChange}
                  value={reviewData.rating}
                  className="ml-2 rounded-md border p-2"
                  required
                >
                  <option value="5">5 (Excellent)</option>
                  <option value="4">4 (Very Good)</option>
                  <option value="3">3 (Good)</option>
                  <option value="2">2 (Fair)</option>
                  <option value="1">1 (Poor)</option>
                </select>
              </label>

              <label htmlFor="comment" className="mb-2 block">
                Comment:
                <textarea
                  id="comment"
                  name="comment"
                  rows="3"
                  value={reviewData.comment}
                  onChange={handleInputChange}
                  className="w-full rounded-md border p-2"
                  required
                ></textarea>
              </label>
              <input
                type="hidden"
                id="typeOfForm"
                name="typeOfForm"
                value={'addRecipe'}
              />

              <Button type="submit">Submit Review</Button>
            </Form>
          )}
        </div>
      )}
    </div>
  );
}
