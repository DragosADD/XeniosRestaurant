import { getUser } from '../Utils/auth';
import supabase from './supabase';

export async function getMenu() {
  const { data: Recipes, error } = await supabase.from('Recipes').select('*');
  if (error) throw Error('Failed getting menu');
  await Promise.all(
    Recipes.map(async (el) => {
      const { data: IngredientsUsed, errorIngredients } = await supabase
        .from('IngredientsUsed')
        .select('*')
        .eq('recipeId', el.foodId);

      if (errorIngredients) throw Error(`failed getting usedIngredients`);
      el.ingredients = [];

      await Promise.all(
        IngredientsUsed.map(async (ing) => {
          let { data: Ingredients, errorIng } = await supabase
            .from('Ingredients')
            .select('*')
            .eq('idIngredient', ing.idIngredient);

          if (errorIng) throw Error(`failed getting usedIngredients`);
          el.ingredients.push({
            ingredientWeight: ing.ingredientWeight,
            ingredientName: Ingredients[0].name,
            ingredientCalories: Ingredients[0].calories,
          });
        })
      );
    })
  );
  return Recipes;
}

export async function addNewReview(review) {
  const { data, error } = await supabase
    .from('Reviews')
    .insert([
      {
        userId: review.userId,
        recipeId: review.recipeId,
        rating: review.rating,
        comment: review.comment,
        createdAt: review.createdAt,
        name: review.name,
      },
    ])
    .select();
  if (error) throw new Error(`Unable to send new Review ${error.message}`);
  return data;
}

export async function deleteIngredient(id) {
  const { error } = await supabase
    .from('Ingredients')
    .delete()
    .eq('idIngredient', id);
  if (error) throw new Error(`The ingredient couldnt be deleted ${error}`);
}

export async function getOrder(id) {
  const { data: order, errorOrder } = await supabase
    .from('Orders')
    .select('*')
    .eq('id', id);
  if (errorOrder) throw Error(`Failed getting the order with the id ${id}`);
  const { data: items, errorItems } = await supabase
    .from('OrderedItems')
    .select('*')
    .eq('order_id', id);
  if (errorItems)
    throw Error(
      `Failed getting the the items that were order please contact us via the phone number in contact us`
    );

  const itemPromises = items.map(async (item) => {
    const { data: orderItemWithRName, errorRecipe } = await supabase
      .from('Recipes')
      .select('name')
      .eq('foodId', item.recipe_id);

    if (errorRecipe)
      throw Error(
        `Failed creating the complete data for displaying the order.`
      );

    item.name = orderItemWithRName[0].name;
    return item;
  });

  const updatedItems = await Promise.all(itemPromises);

  order[0].cart = updatedItems;

  return order;
}

export async function addComment(reviewId, comment, name, userId, role) {
  name = role === 'role' ? 'Moderator' : name;
  const { data, error } = await supabase
    .from('Comments')
    .insert([
      {
        reviewId: reviewId,
        comment: comment,
        name: name,
        userId: userId,
      },
    ])
    .select();
  if (error) throw new Error(`Unable to comment ${error.message}`);
  return data;
}

export async function createOrder(newOrder, itemsOfTheOrder) {
  const { data: lastId, errorID } = await supabase
    .from('Orders')
    .select('id')
    .order('id', { ascending: false })
    .limit(1);

  const newId = lastId[0].id + 1;
  if (errorID) throw Error(`Failed getting the ID of the last order`);
  const {
    status,
    priority,
    priorityPrice,
    orderPrice,
    Total_price,
    estimatedDelivery,
  } = newOrder;

  const user = await getUser();

  const {
    id: user_id,
    user_metadata: { address, phone },
  } = user;

  try {
    const { data: sentOrder, error } = await supabase
      .from('Orders')
      .insert([
        {
          id: newId,
          status: status,
          priority: priority,
          priorityPrice: priorityPrice,
          orderPrice,
          Total_price: Total_price,
          estimatedDelivery: estimatedDelivery,
          user_id: user_id,
          address: address,
          mobileNumber: phone,
        },
      ])
      .select();

    if (error) throw Error(`Failed creating your order please contact us `);

    for (const item of itemsOfTheOrder) {
      try {
        const { data, error } = await supabase
          .from('OrderedItems')
          .insert([
            {
              recipe_id: item.foodId,
              quantity: item.quantity,
              totalPrice: item.totalPrice,
              order_id: newId,
            },
          ])
          .select();
      } catch (error) {
        throw Error(`Failed creating pushing items please contact us`);
      }
    }

    return sentOrder;
  } catch {
    throw Error('Failed creating your order please contact us');
  }
}

export async function getComments(identifier, type) {
  try {
    let comments;
    const commentsQuery = supabase.from(`Comments`).select('*');
    if (type === 'userId') {
      const { data, error } = await commentsQuery.eq('userId', identifier);
      if (error) throw new Error(`failedGetting comments related to user`);
      comments = data;
    } else if (type === 'reviewId') {
      const { data, error } = await commentsQuery.eq('reviewId', identifier);
      if (error) throw new Error(`Failed fetching comments related to review`);
      comments = data;
    } else throw new Error(`type not provided`);
    return comments;
  } catch (error) {
    throw new Error(`Failed fetching comments ${error}`);
  }
}

export async function getReviewsWCommentsRelatedToUser(user_id) {
  const reviewsWithoComments = await Promise.all(
    (
      await getComments(user_id, 'userId')
    ).map(async (comment) => {
      const review = await getUserReviews(comment.reviewId, 'reviewId');
      return review;
    })
  );

  return reviewsWithoComments;
}

export async function getRecipesOfUser(userId) {
  try {
    const historyOfOrders = await getHistory(userId);

    const recipes = await Promise.all(
      historyOfOrders.map(async (el) => {
        const { data: allItemsUsed, errorItemsUsed } = await supabase
          .from('OrderedItems')
          .select('recipe_id')
          .eq('order_id', el.id);
        if (errorItemsUsed)
          throw new Error(`Failed getting specific Items ${errorItemsUsed}`);
        const recipesBought = await Promise.all(
          allItemsUsed.map(async (recipeId) => {
            let { data: Recipes, error } = await supabase
              .from('Recipes')
              .select('*')
              .eq('foodId', recipeId.recipe_id);

            if (error)
              throw new Error(`Failed getting specific recipe ${error}`);
            return Recipes[0];
          })
        );
        return recipesBought[0];
      })
    );
    return recipes;
  } catch (error) {
    throw new Error(`failed to get history ${error}`);
  }
}

export async function getUserReviews(identifier, type) {
  try {
    // Fetch reviews by the current user
    let userReviews;
    const reviewsQuery = supabase.from('Reviews').select('*');

    if (type === 'userId') {
      userReviews = await reviewsQuery.eq('userId', identifier);
    } else if (type === 'reviewId') {
      userReviews = await reviewsQuery.eq('reviewId', identifier);
    } else if (type === 'noId') {
      userReviews = await reviewsQuery;
    } else if (type === 'allOther') {
      userReviews = await reviewsQuery.neq('userId', identifier);
    } else {
      throw new Error(`type not provided`);
    }
    const { data: userReviewsOrReview, errorUserReviews } = userReviews;

    if (errorUserReviews) {
      throw new Error('Error fetching user reviews');
    }

    // Fetch additional details for each review
    const reviewsWithDetails = await Promise.all(
      userReviewsOrReview.map(async (review) => {
        // Fetch recipe details

        const { data: recipeDetails, errorRecipeDetails } = await supabase
          .from('Recipes')
          .select('*')
          .eq('foodId', review.recipeId)
          .single();

        if (errorRecipeDetails) {
          throw new Error(
            `Error fetching recipe details ${errorRecipeDetails.message}`
          );
        }

        // Fetch comments for the current review
        const { data: reviewComments, errorReviewComments } = await supabase
          .from('Comments')
          .select('*')
          .eq('reviewId', review.reviewId);

        if (errorReviewComments) {
          throw new Error('Error fetching review comments');
        }

        // Return the review with additional details
        return {
          ...review,
          recipeDetails,
          comments: reviewComments || [],
        };
      })
    );

    return reviewsWithDetails;
  } catch (error) {
    console.error('Error fetching user reviews with details:', error);
    return [];
  }
}

export async function getLastReviewsId() {
  const { data: lastReviewId, error } = await supabase
    .from('Reviews')
    .select('reviewId', {
      order: [{ column: 'reviewId', order: 'desc' }],
      limit: 1,
    });
  if (error) throw new Error(`failed getting last comment`);
  return lastReviewId[0];
}

export async function getHistory(userId) {
  if (userId === 'all') {
    const { data, error } = await supabase.from('Orders').select('*');

    if (error) throw Error(`Failed to fetch orders`);

    return data;
  }
  const { data, error } = await supabase
    .from('Orders')
    .select('*')
    .eq('user_id', userId);

  if (error) throw Error(`Failed to fetch orders`);

  return data;
}

export async function getIngredients() {
  try {
    const { data: Ingredients, error } = await supabase
      .from('Ingredients')
      .select('*');
    if (error) throw Error(error);
    return Ingredients;
  } catch (error) {
    throw Error(`Failed getting ingredients` + error.message);
  }
}

export async function removeRecipeFromMenu(id) {
  try {
    const { data, error } = await supabase
      .from('Recipes')
      .update({ IsOnMenu: false })
      .eq('foodId', id);
    if (error) throw Error();
    window.location.reload();
    return data;
  } catch (error) {
    throw Error('Failed updating your order' + error.message);
  }
}

export async function addBackRecipeFromOnMenu(id) {
  try {
    const { data, error } = await supabase
      .from('Recipes')
      .update({ IsOnMenu: true })
      .eq('foodId', id);
    if (error) throw Error();
    window.location.reload();
    return data;
  } catch (error) {
    throw Error('Failed updating your order' + error.message);
  }
}

export async function updateRecipe(updatedData) {
  const { foodId, soldOut, ingredients, unitPrice } = updatedData;

  const { data, error } = await supabase
    .from('Recipes')
    .update({
      soldOut: soldOut,
      unitPrice: unitPrice,
    })
    .eq('foodId', foodId);

  const parsedIngredients = JSON.parse(ingredients);

  if (parsedIngredients.length > 0) {
    const { response, errorDel } = await supabase
      .from('IngredientsUsed')
      .delete()
      .eq('recipeId', foodId);
    if (errorDel)
      throw new Error(
        `failed deleting ingredints that have been used for this recipe ${error.message}`
      );

    const newIngredientUsedData = await Promise.all(
      parsedIngredients.map(async (el) => {
        const { data: insertedIngredient, error: insertError } = await supabase
          .from('IngredientsUsed')
          .insert([
            {
              ingredientWeight: Number(el.grams),
              idIngredient: Number(el.ingredientId),
              recipeId: Number(foodId),
            },
          ])
          .select();
        if (insertError)
          throw Error(`Problem in updating ingrdient${error.message}`);
        return insertedIngredient;
      })
    );
    return newIngredientUsedData;
  }

  return null;
}

export async function addIngredient(data) {
  const { data: lastId, errorID } = await supabase
    .from('Ingredients')
    .select('idIngredient')
    .order('idIngredient', { ascending: false })
    .limit(1);

  if (errorID)
    throw new Error(`Could not create new ingredient ${errorID.message}`);

  const { data: newIngredient, error } = await supabase
    .from('Ingredients')
    .insert([
      {
        idIngredient: lastId[0].idIngredient + 1,
        name: data.nameIngredient,
        calories: Number(data.caloricValue),
      },
    ])
    .select();
  if (error)
    throw new Error(`Could not create new ingredient ${error.message}`);

  return newIngredient;
}

export async function uploadRecipe(data) {
  const requiredFields = ['name', 'unitPrice', 'ingredients', 'imageUrl'];

  for (const field of requiredFields) {
    if (
      !(field in data) ||
      data[field] === null ||
      data[field] === undefined ||
      data[field] === '' ||
      data[field] === '[]'
    ) {
      throw new Error(`Required field "${field}" is missing or empty`);
    }
  }

  if (!('soldOut' in data)) {
    throw new Error('Required field "soldOut" is missing');
  }

  if (!('IsOnMenu' in data)) {
    throw new Error('Required field "IsOnMenu" is missing');
  }

  const { data: lastId, errorID } = await supabase
    .from('Recipes')
    .select('foodId')
    .order('foodId', { ascending: false })
    .limit(1);

  if (errorID) throw new Error('Failed getting the last Recipe Added');

  const actualLastId = lastId[0].foodId + 1;

  const { name, unitPrice, ingredients, soldOut, imageUrl, IsOnMenu } = data;
  const ingredientsArray = JSON.parse(ingredients);

  const hasGramsForAllIngredients = ingredientsArray.every(
    (ingredient) =>
      ingredient &&
      typeof ingredient === 'object' &&
      'grams' in ingredient &&
      ingredient.grams.trim() !== ''
  );

  if (!hasGramsForAllIngredients)
    throw new Error(`Some ingredients do not have grams or repeat themselves`);

  const { data: final, error } = await supabase
    .from('Recipes')
    .insert([
      {
        foodId: actualLastId,
        name: name,
        unitPrice: unitPrice,
        soldOut: soldOut,
        imageUrl: imageUrl,
        IsOnMenu: IsOnMenu,
      },
    ])
    .select();

  const newIngredientUsedData = await Promise.all(
    ingredientsArray.map(async (ingredient, index) => {
      const { data: insertedIngredient, error: insertError } = await supabase
        .from('IngredientsUsed')
        .insert([
          {
            ingredientWeight: Number(ingredient.grams),
            idIngredient: Number(ingredient.ingredientId),
            recipeId: final[0].foodId,
          },
        ]);

      if (insertError) {
        throw new Error(
          `Failed to insert ingredient into IngredientsUsed tabl${insertError.message}`
        );
      }
      console.insertedIngredient[0];
      return insertedIngredient[0];
    })
  );

  if (error) throw Error('Failed updating your order' + error.message);
  return newIngredientUsedData;
}

export async function updateStatusPriorityRecipe(newData) {
  const { id, status, priority, orderPrice, priorityPrice, Total_price } =
    newData;
  const { data: updatedData, error } = await supabase
    .from('Orders')
    .update({
      status: status,
      priority: priority,
      orderPrice: orderPrice,
      priorityPrice: priorityPrice,
      Total_price: Total_price,
    })
    .eq('id', id)
    .select();
  if (error)
    throw new Error(
      `Failed updating the status and priority of the order ${error.message}`
    );
  return updatedData;
}

export async function updateStatusToCompleted(id) {
  const { data: updatedOrder, error } = await supabase
    .from('Orders')
    .update({
      status: 'Delivered',
    })
    .eq('id', id)
    .select();
  if (error) throw new Error(`Unable to update status` + error.message);

  return updatedOrder;
}
