const recipeDiv = document.getElementById('recipe');
const newRecipeBtn = document.getElementById('newRecipe');
const recipeTitleInput = document.getElementById('recipeTitle');
const mealTypeInput = document.getElementById('mealType');
const numberOfPeopleServesInput = document.getElementById(
  'numberOfPeopleServes'
);
const difficultyLevelInput = document.getElementById('difficultyLevel');
const ingredientsInput = document.getElementById('ingredients');
const preparationStepsInput = document.getElementById('preparationSteps');

let cardNumber;

const getRecipes = async () => {
  const response = await fetch('data.json');
  const data = await response.json();

  for (const number in data.dishes) {
    cardNumber = number;
  }
  displayRecipes(data);
};

const displayRecipes = (data) => {
  newRecipeBtn.onclick = () => createNewRecipe(data);

  for (const i in data.dishes) {
    const cardDiv = document.createElement('div');
    cardDiv.id = 'card';

    const recipeTitle = document.createElement('p');
    recipeTitle.innerText = `Recipe title: ${data.dishes[i].recipeTitle}`;

    const mealType = document.createElement('p');
    mealType.innerText = `Meal type: ${data.dishes[i].mealType}`;

    const numberOfPeopleServes = document.createElement('p');
    numberOfPeopleServes.innerText = `Number of people it serves: ${data.dishes[i].numberOfPeopleServes}`;

    const difficultyLevel = document.createElement('p');
    difficultyLevel.innerText = `Difficulty level: ${data.dishes[i].difficultyLevel}`;

    const ingredientsHeading = document.createElement('p');
    ingredientsHeading.innerText = 'Ingredients:';

    const ingredientsList = document.createElement('ul');

    const ingredientsItems = data.dishes[i].ingredients;
    ingredientsItems.map((item) => {
      const ingredients = document.createElement('li');
      ingredients.innerText = `${Object.values(item)[0]}: ${
        Object.values(item)[1]
      }`;
      ingredientsList.appendChild(ingredients);
    });

    const preparationHeading = document.createElement('p');
    preparationHeading.innerText = 'Preparation steps:';

    const preparationSteps = document.createElement('ol');

    for (const step of data.dishes[i].preparationSteps) {
      stepItem = document.createElement('li');
      stepItem.innerText = step;
      preparationSteps.appendChild(stepItem);
    }

    recipeDiv.appendChild(cardDiv);
    cardDiv.appendChild(recipeTitle);
    cardDiv.appendChild(mealType);
    cardDiv.appendChild(numberOfPeopleServes);
    cardDiv.appendChild(difficultyLevel);
    cardDiv.appendChild(ingredientsHeading);
    cardDiv.appendChild(ingredientsList);
    cardDiv.appendChild(preparationHeading);
    cardDiv.appendChild(preparationSteps);
  }
};

const createNewRecipe = (data) => {
  cardNumber += 1;

  if (preparationStepsInput.value.trim() === '') return false;
  const preparationSteps = preparationStepsInput.value.split(',');
  const preparationStepsArray = [];
  preparationSteps.map((step) => {
    preparationStepsArray.push(`"${step}"`);
  });

  if (ingredientsInput.value.trim() === '') return false;
  let ingredients = ingredientsInput.value.split(': ');
  const ingredientsArrayObject = [];
  ingredients = ingredients.toString();
  ingredients = ingredients.split(',');
  for (let i = 0; i < ingredients.length; i++) {
    if (i % 2 === 0) {
      if (ingredients[i].startsWith(' ')) {
        ingredients[i] = ingredients[i].slice(1);
      }

      ingredientsArrayObject.push({
        name: ingredients[i],
        amount: ingredients[i + 1],
      });
    } else {
      continue;
    }
  }

  let json = JSON.stringify(data);
  json = json.substring(0, json.length - 2);
  json += `,
  "${cardNumber}": {
    "recipeTitle": "${recipeTitleInput.value}",
    "mealType": "${mealTypeInput.value}",
    "numberOfPeopleServes": "${numberOfPeopleServesInput.value}",
    "difficultyLevel": "${difficultyLevelInput.value}",
    "ingredients": ${JSON.stringify(ingredientsArrayObject)},
    "preparationSteps": [${preparationStepsArray}]
  }}}`;
  json = JSON.parse(json);
  recipeDiv.innerHTML = '';

  displayRecipes(json);
};

window.onload = getRecipes;
