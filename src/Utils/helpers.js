export function formatCurrency(value) {
  return new Intl.NumberFormat('en', {
    style: 'currency',
    currency: 'RON',
  }).format(value);
}

export function formatDate(dateStr) {
  return new Intl.DateTimeFormat('en', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dateStr));
}

export function calcMinutesLeft(dateStr) {
  const d1 = new Date().getTime();
  const d2 = new Date(dateStr).getTime();
  return Math.round((d2 - d1) / 60000);
}

export function calculateTimeDifference(deliveryTime) {
  deliveryTime = new Date(deliveryTime);
  const currentTime = new Date();
  const diffInMs = deliveryTime.getTime() - currentTime.getTime();
  return diffInMs / (1000 * 60 * 60); // Convert milliseconds to hours
}

export function calcPriceWithPriority(updatedTotalOrder) {
  return updatedTotalOrder + (updatedTotalOrder * 20) / 100;
}

export function ingredientsText(ingredients) {
  let totalCalories = 0;
  let totalWeight = 0;
  ingredients.forEach((ingredient) => {
    const oneGramCal = ingredient.ingredientCalories / 100;
    const totalIngredientCalories = ingredient.ingredientWeight * oneGramCal;
    totalWeight = totalWeight + ingredient.ingredientWeight;
    totalCalories = totalCalories + totalIngredientCalories;
  });
  const textSummary = ingredients
    .map(
      (ingredient) =>
        `${ingredient.ingredientName} ${ingredient.ingredientWeight}gr`
    )
    .join(', ');

  return `Ingredients: ${textSummary} total: ${totalWeight}gr -> ${totalCalories.toFixed(
    0
  )} calories`;
}
