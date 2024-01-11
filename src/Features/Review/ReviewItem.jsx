import React, { useState } from 'react';
import { Form } from 'react-router-dom';

export default function ReviewItem(props) {
  const [showForm, setShowForm] = useState(false);

  const handleToggleForm = () => {
    setShowForm((prevShowForm) => !prevShowForm);
  };

  return (
    <div className="mt-5 rounded-lg bg-cyan-100 p-4 shadow-md">
      <div onClick={handleToggleForm}>
        <div className="mb-4 flex items-center">
          <h2 className="text-xl font-semibold">{props.review.name}</h2>
          <span className="ml-2 text-gray-500">
            Rating: {props.review.rating}/5
          </span>
        </div>

        {/* Recipe Image */}
        <img
          src={props.review.recipeDetails.imageUrl}
          alt={props.review.recipeDetails.recipeName}
          className="mb-4 rounded-lg"
          style={{
            width: '100%',
            maxHeight: '200px', // Set your desired maxHeight value
            objectFit: 'cover',
          }}
        />

        <p className="mb-4 text-gray-700">
          Shared a review for{' '}
          <span className="font-semibold">
            {props.review.recipeDetails.name}
          </span>
          : {props.review.comment}
        </p>

        {/* Comments Section */}
        <div>
          <h3 className="mb-2 text-lg font-semibold">Comments</h3>
          <ul>
            {props.review.comments.map((comment) => {
              console.log(comment);
              return (
                <li key={comment.commentId} className="mb-2">
                  <span className="font-semibold">{comment.name}:</span>{' '}
                  {comment.comment}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
      {/* Add Comment Form */}
      {showForm && (
        <Form method="post">
          <label
            htmlFor="comment"
            className="block text-sm font-medium text-gray-700"
          >
            Add a Comment
          </label>
          <textarea
            id="comment"
            name="comment"
            rows="3"
            className="mt-1 w-full rounded-md border p-2 focus:border-blue-300 focus:outline-none focus:ring"
          ></textarea>
          <input
            type="hidden"
            id="reviewId"
            name="reviewId"
            value={props.review.reviewId}
          />
          <input
            type="hidden"
            id="typeOfForm"
            name="typeOfForm"
            value={'addComment'}
          />
          <button
            type="submit"
            className="mt-2 rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:border-blue-300 focus:outline-none focus:ring"
          >
            Add Comment
          </button>
        </Form>
      )}
    </div>
  );
}
