const recipeDiv = document.getElementById('recipe');
const form = document.querySelector('form');
const recipeTitleInput = document.getElementById('recipeTitle');
const imageInput = document.getElementById('image');
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
  form.addEventListener('submit', (event) => event.preventDefault());
  form.onsubmit = () => createNewRecipe(data);

  for (const recipeIndex in data.dishes) {
    const cardDiv = document.createElement('div');
    cardDiv.id = 'card';

    const image = document.createElement('img');
    image.className = 'foodImg';
    image.src = data.dishes[recipeIndex].image;
    image.alt = 'Food image';
    image.width = 400;
    image.height = 200;

    const recipeTitle = document.createElement('h4');
    recipeTitle.innerHTML = data.dishes[recipeIndex].recipeTitle;

    const mealType = document.createElement('p');
    mealType.innerHTML = `Meal: <b>${data.dishes[recipeIndex].mealType}</b>`;

    const numberOfPeopleServes = document.createElement('p');
    numberOfPeopleServes.innerHTML = `Number of people it serves: <b>${data.dishes[recipeIndex].numberOfPeopleServes}</b>`;

    const difficultyLevel = document.createElement('p');
    difficultyLevel.innerHTML = `Difficulty: <b>${data.dishes[recipeIndex].difficultyLevel}</b>`;

    const ingredientsHeading = document.createElement('h4');
    ingredientsHeading.innerHTML = 'Ingredients:';

    const ingredientsList = document.createElement('ul');

    const ingredientsItems = data.dishes[recipeIndex].ingredients;
    ingredientsItems.map((item) => {
      const ingredients = document.createElement('li');
      ingredients.innerText = `${Object.values(item)[0]}: ${
        Object.values(item)[1]
      }`;
      ingredientsList.appendChild(ingredients);
    });

    const preparationHeading = document.createElement('h4');
    preparationHeading.innerText = 'Preparation steps:';

    const preparationSteps = document.createElement('ol');

    for (const step of data.dishes[recipeIndex].preparationSteps) {
      stepItem = document.createElement('li');
      stepItem.innerText = step;
      preparationSteps.appendChild(stepItem);
    }

    recipeDiv.appendChild(cardDiv);
    cardDiv.appendChild(recipeTitle);
    cardDiv.appendChild(image);
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

  const preparationSteps = preparationStepsInput.value.split(',');
  const preparationStepsArray = [];
  preparationSteps.map((step) => {
    preparationStepsArray.push(`"${step}"`);
  });

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
    "image": "${imageInput.value}",
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
