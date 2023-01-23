const recipeDiv = document.getElementById('recipe');
const newRecipeBtn = document.getElementById('newRecipe');

const getData = async () => {
  const response = await fetch('data.json');
  const data = await response.json();
  displayList(data);
};

const displayList = (data) => {
  newRecipeBtn.onclick = () => newRecipe(data);
  for (const i in data.dishes) {
    const cardDiv = document.createElement('div');
    cardDiv.id = 'card';
    recipeDiv.appendChild(cardDiv);

    const recipeTitle = document.createElement('p');
    recipeTitle.id = 'recipeTitle';
    recipeTitle.innerText = `Recipe title: ${data.dishes[i].recipeTitle}`;

    const mealType = document.createElement('p');
    mealType.id = 'mealType';
    mealType.innerText = `Meal type: ${data.dishes[i].mealType}`;

    const numberOfPeopleServes = document.createElement('p');
    numberOfPeopleServes.id = 'numberOfPeopleServes';
    numberOfPeopleServes.innerText = `Number of people it serves: ${data.dishes[i].numberOfPeopleServes}`;

    const difficultyLevel = document.createElement('p');
    difficultyLevel.id = 'difficultyLevel';
    difficultyLevel.innerText = `Difficulty level: ${data.dishes[i].difficultyLevel}`;

    const ingredientsHeading = document.createElement('p');
    ingredientsHeading.id = 'ingredientsHeading';
    ingredientsHeading.innerText = 'Ingredients:';

    const ingredientsList = document.createElement('ul');
    ingredientsList.id = 'ingredientsList';

    const ingredientsItems = data.dishes[i].ingredients;
    ingredientsItems.map((item) => {
      const ingredients = document.createElement('li');
      ingredients.id = 'ingredients';
      ingredients.innerText = `${Object.values(item)[0]}: ${
        Object.values(item)[1]
      }`;
      ingredientsList.appendChild(ingredients);
    });

    const preparationHeading = document.createElement('p');
    preparationHeading.innerText = 'Preparation steps:';
    preparationHeading.id = 'preparationHeading';

    const preparationSteps = document.createElement('ol');
    preparationSteps.id = 'preparationSteps';
    for (const step of data.dishes[i].preparationSteps) {
      stepItem = document.createElement('li');
      stepItem.id = 'stepItem';
      stepItem.innerText = step;
      preparationSteps.appendChild(stepItem);
    }

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

let cardNumber = 2;

const newRecipe = (data) => {
  cardNumber += 1;
  const recipeTitleInput = document.getElementById('recipeTitleInput');
  const mealTypeInput = document.getElementById('mealTypeInput');
  const numberOfPeopleServesInput = document.getElementById(
    'numberOfPeopleServesInput'
  );
  const difficultyLevelInput = document.getElementById('difficultyLevelInput');
  const ingredientsInput = document.getElementById('ingredientsInput');
  const preparationStepsInput = document.getElementById(
    'preparationStepsInput'
  );

  const preparationStepsValue = preparationStepsInput.value;
  const preparationSteps = preparationStepsValue.split(',');
  if (preparationStepsValue.trim() === '') {
    return;
  }
  const preparationStepsArray = [];
  preparationSteps.map((step) => {
    preparationStepsArray.push(`"${step}"`);
  });

  const ingredientsValue = ingredientsInput.value;
  let ingredients = ingredientsValue.split(': ');
  if (ingredientsValue.trim() === '') {
    return;
  }
  let ingredientsObject = [];
  ingredients = ingredients.toString();
  ingredients = ingredients.split(',');
  for (let i = 0; i < ingredients.length; i++) {
    if (i % 2 === 0) {
      if (ingredients[i].startsWith(' ')) {
        ingredients[i] = ingredients[i].slice(1);
      }

      ingredientsObject.push({
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
    "ingredients": ${JSON.stringify(ingredientsObject)},
    "preparationSteps": [${preparationStepsArray}]
  }}}`;
  json = JSON.parse(json);
  recipeDiv.innerHTML = '';
  displayList(json);
};
