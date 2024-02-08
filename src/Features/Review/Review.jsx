import React, { useReducer, useState } from 'react';
import ReviewItem from './ReviewItem';
import { checkAuthLoader, getUser } from '../../Utils/auth';
import {
  addComment,
  addNewReview,
  getComments,
  getLastReviewsId,
  getRecipesOfUser,
  getReviewsWCommentsRelatedToUser,
  getUserReviews,
} from '../../Services/apiRestaurant';
import { redirect, useLoaderData, useRouteLoaderData } from 'react-router-dom';
import LeaveReview from './LeaveReview';

export default function Review() {
  const reviews = useLoaderData();
  const [reviewData, setReviewData] = useState({
    reviewsByUser: reviews.reviewsByUser,
    reviewsRelatedToUser: reviews.reviewsRelatedToUser,
    allOtherReviews: reviews.allOtherReviews,
  });

  const user = useRouteLoaderData('root'); //to be used when handling modderation things
  return (
    <div className="mx-auto max-w-2xl p-4">
      {user.role !== 'service_role' && (
        <>
          {reviews.uniqueRecipes ? (
            <LeaveReview
              recipesOfUser={reviews.uniqueRecipes}
              lastReview={reviews.lastReview}
            />
          ) : (
            <p className="mb-4 text-lg font-semibold">
              You have not ordered any of our recipes
            </p>
          )}
          <div className="my-8">
            <h2 className="mb-4 text-xl font-semibold">My Reviews</h2>
            {reviewData.reviewsByUser.length === 0 ? (
              <p className="text-lg">I have no reviews</p>
            ) : (
              <div>
                {reviewData.reviewsByUser.map((el) => (
                  <ReviewItem key={el.reviewId} review={el} />
                ))}
              </div>
            )}
          </div>
        </>
      )}

      <div className="my-8">
        <h2 className="mb-4 text-xl font-semibold">
          Reviews I Participated In
        </h2>
        {
          <div>
            {reviewData.reviewsRelatedToUser?.map((el) => (
              <ReviewItem key={el.reviewId} review={el} />
            ))}
          </div>
        }
      </div>

      <div className="my-8">
        <h2 className="mb-4 text-xl font-semibold">All Reviews</h2>
        {
          <div>
            {reviewData.allOtherReviews.map((el) => (
              <ReviewItem key={el.reviewId} review={el} />
            ))}
          </div>
        }
      </div>
    </div>
  );
}

export async function loader() {
  const user = await getUser();
  await checkAuthLoader();

  const {
    id: user_id,
    user_metadata: { name: name },
  } = user;

  const reviewsByUser = await getUserReviews(user_id, 'userId');
  const reviewsRelatedToUser = await getReviewsWCommentsRelatedToUser(user_id);
  const allOtherReviews = await getUserReviews(user_id, 'allOther');
  const recipesOfUser = await getRecipesOfUser(user_id);
  const uniqueFoodIds = new Set();
  const lastReview = await getLastReviewsId();

  const uniqueRecipes = recipesOfUser.filter((recipe) => {
    if (!uniqueFoodIds.has(recipe.foodId)) {
      uniqueFoodIds.add(recipe.foodId);
      return true;
    }
    return false;
  });
  const bulk = {
    idUser: user_id,
    reviewsByUser,
    reviewsRelatedToUser: reviewsRelatedToUser[0],
    allOtherReviews,
    uniqueRecipes,
    lastReview,
    name,
  };

  return bulk;
}

export async function action({ request }) {
  const data = await request.formData();
  const typeOfForm = data.get('typeOfForm');
  const currentDate = new Date();
  const {
    id: user_id,
    role: role,
    user_metadata: { name: name },
  } = await getUser();

  if (typeOfForm === 'addRecipe') {
    const newdData = JSON.parse(data.get('review'));

    const dataToSend = {
      ...newdData,
      userId: user_id,
      name,
      createdAt: currentDate,
    };
    const data2 = await addNewReview(dataToSend);
    location.reload();
    return data2;
  }

  if (typeOfForm === 'addComment') {
    const reviewId = data.get('reviewId');
    const comment = data.get('comment');
    const data3 = await addComment(
      reviewId,
      comment,
      role === 'service_role' ? 'Moderator' : name,
      user_id
    );
    return data3;
  }
  return null;
}
