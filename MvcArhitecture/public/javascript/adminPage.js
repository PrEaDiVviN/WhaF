let pageRecipes = 0;
let pageUsers = 0;


function viewRecipes() {
    let recipes = document.getElementsByClassName('recipes')[0];
    recipes.id = 'pink_background'; 
    let users = document.getElementsByClassName('users')[0];
    users.id = '';
    let panelRecipes = document.getElementsByClassName('panel-recipes')[0];
    panelRecipes.id = '';
    let panelUsers = document.getElementsByClassName('panel-users')[0];
    panelUsers.id = '';

    let viewRecipes = document.getElementsByClassName('viewRecipes')[0];
    viewRecipes.style.display = 'flex';
    let viewUsers = document.getElementsByClassName('viewUsers')[0];
    viewUsers.style.display = 'none';
    let viewPanelRecipes = document.getElementsByClassName('viewPanelRecipes')[0];
    viewPanelRecipes.style.display = 'none';
    let viewPanelUsers = document.getElementsByClassName('viewPanelUsers')[0];
    viewPanelUsers.style.display = 'none';
}

function viewUsers() {
    let recipes = document.getElementsByClassName('recipes')[0];
    recipes.id = ''; 
    let users = document.getElementsByClassName('users')[0];
    users.id = 'pink_background';
    let panelRecipes = document.getElementsByClassName('panel-recipes')[0];
    panelRecipes.id = '';
    let panelUsers = document.getElementsByClassName('panel-users')[0];
    panelUsers.id = '';

    let viewRecipes = document.getElementsByClassName('viewRecipes')[0];
    viewRecipes.style.display = 'none';
    let viewUsers = document.getElementsByClassName('viewUsers')[0];
    viewUsers.style.display = 'flex';
    let viewPanelRecipes = document.getElementsByClassName('viewPanelRecipes')[0];
    viewPanelRecipes.style.display = 'none';
    let viewPanelUsers = document.getElementsByClassName('viewPanelUsers')[0];
    viewPanelUsers.style.display = 'none';
} 

function viewPanelRecipes() {
    let recipes = document.getElementsByClassName('recipes')[0];
    recipes.id = ''; 
    let users = document.getElementsByClassName('users')[0];
    users.id = '';
    let panelRecipes = document.getElementsByClassName('panel-recipes')[0];
    panelRecipes.id = 'pink_background';
    let panelUsers = document.getElementsByClassName('panel-users')[0];
    panelUsers.id = '';

    let viewRecipes = document.getElementsByClassName('viewRecipes')[0];
    viewRecipes.style.display = 'none';
    let viewUsers = document.getElementsByClassName('viewUsers')[0];
    viewUsers.style.display = 'none';
    let viewPanelRecipes = document.getElementsByClassName('viewPanelRecipes')[0];
    viewPanelRecipes.style.display = 'flex';
    let viewPanelUsers = document.getElementsByClassName('viewPanelUsers')[0];
    viewPanelUsers.style.display = 'none';
}

function viewPanelUsers() {
    let recipes = document.getElementsByClassName('recipes')[0];
    recipes.id = ''; 
    let users = document.getElementsByClassName('users')[0];
    users.id = '';
    let panelRecipes = document.getElementsByClassName('panel-recipes')[0];
    panelRecipes.id = '';
    let panelUsers = document.getElementsByClassName('panel-users')[0];
    panelUsers.id = 'pink_background';

    let viewRecipes = document.getElementsByClassName('viewRecipes')[0];
    viewRecipes.style.display = 'none';
    let viewUsers = document.getElementsByClassName('viewUsers')[0];
    viewUsers.style.display = 'none';
    let viewPanelRecipes = document.getElementsByClassName('viewPanelRecipes')[0];
    viewPanelRecipes.style.display = 'none';
    let viewPanelUsers = document.getElementsByClassName('viewPanelUsers')[0];
    viewPanelUsers.style.display = 'flex';
}

function updatePlusPageRecipe() {
    pageRecipes += 25;
    ///recipeSkipAndCount
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/recipeSkipAndCount", true);
    xhr.setRequestHeader("Content-Type","application/json");

    xhr.onreadystatechange = function() {
        if(this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            let viewRecipes = document.getElementsByClassName('viewRecipes')[0];
            viewRecipes.innerHTML = '';
            viewRecipes.innerHTML = this.responseText;
        } 
        else if(this.readyState === XMLHttpRequest.DONE && this.status === 404) {
            //alert('There are no more files to load!');
        }
    }

    let skip = new String(pageRecipes);
    let count = new String(25);
    xhr.send(JSON.stringify({direction: 'up', skip: skip, count: count}));
}

function updateMinusPageRecipe() {
    pageRecipes -= 25;
    ///recipeSkipAndCount
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/recipeSkipAndCount", true);
    xhr.setRequestHeader("Content-Type","application/json");

    xhr.onreadystatechange = function() {
        if(this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            let viewRecipes = document.getElementsByClassName('viewRecipes')[0];
            viewRecipes.innerHTML = '';
            viewRecipes.innerHTML = this.responseText;
        } 
        else if(this.readyState === XMLHttpRequest.DONE && this.status === 404) {
            //alert('There are no more files to load!');
        }
    }

    let skip = new String(pageRecipes);
    let count = new String(25);
    xhr.send(JSON.stringify({direction: 'down', skip: skip, count: count}));
}

function deleteRecipe(deleteBtn) {
    let id = deleteBtn.id;
    let nr = 0;
    let i = id.length - 1;
    let pow = 1;
    while(id.charAt(i) >= '0' && id.charAt(i) < '9') {
        nr = nr + parseInt(id.charAt(i)) * pow;
        pow = pow * 10;
        i--;
    }
    let item = document.getElementById('recipe' + nr);
    let recipeName = item.innerText;
    var xhr = new XMLHttpRequest();
    xhr.open("DELETE", "/deleteRecipe", true);
    xhr.setRequestHeader("Content-Type","application/json");

    xhr.onreadystatechange = function() {
        if(this.readyState === XMLHttpRequest.DONE && this.status === 202) {
            let recipe = document.getElementById('card' + nr);
            recipe.remove();
        } 
        else if(this.readyState === XMLHttpRequest.DONE && this.status === 404) {
            alert('Page not found! Seems, that the page does not exist!');
        }
        else if(this.readyState === XMLDocument.DONE && this.status === 403) {
            alert('Forbidden! You are not allow to access this page! If you are an admin, request control from the owner!');
        }
        else if(this.readyState === XMLDocument.DONE && this.status === 500) {
            alert('Internal server error!');
        }
    }
    xhr.send(JSON.stringify({recipeName: recipeName}));
}

function modifyRecipeName() {
    let input = document.getElementById('inputChangeName');
    let text = input.value;
    if(text === '') 
        alert('Va rugam sa introduceti un alt nume inainte de a incerca sa schimbati numele retetei!');
    else {
        var xhr = new XMLHttpRequest();
        xhr.open("PATCH", "/modifyRecipe/recipeName", true);
        xhr.setRequestHeader("Content-Type","application/json");
    
        xhr.onreadystatechange = function() {
            if(this.readyState === XMLHttpRequest.DONE && this.status === 202) {
                let recipe = document.getElementById('pageName');
                recipe.innerText = this.responseText.substr(this.responseText.search(':') + 1);
            } 
            else if(this.readyState === XMLHttpRequest.DONE && this.status === 406) {
                alert('The current recipe name already exists! Please, try another name!');
            }
            else if(this.readyState === XMLDocument.DONE && this.status === 500) {
                alert('Internal server error!');
            }
        }
        let recipeName = document.getElementById('pageName').innerText;
        xhr.send(JSON.stringify({recipeName: recipeName, newRecipeName: text}));
    }

}

function changeRecipePhoto1() {
    let image = document.getElementById('inputChangeRecipePhoto').files[0];
    if(image === undefined) 
        alert('Va rugam sa introduceti o poza a retetei inainte de a incerca sa schimbati poza retetei!');
    else {
        var xhr = new XMLHttpRequest();
        xhr.open("PATCH", "/modifyRecipe/recipePhoto", true);
    
        xhr.onreadystatechange = function() {
            if(this.readyState === XMLHttpRequest.DONE && this.status === 202) {
                let mainPicture = document.getElementsByClassName('mainpicture')[0];
                //mainPicture.src = this.responseText.substr(this.responseText.search(':') + 1);
                //<img class="mainpicture" src="${recipePhoto}.jpg" alt="ceva">
                var image = document.createElement("img");
                image.setAttribute("class","mainpicture");
                image.setAttribute("alt", "ceva");
                image.setAttribute("src", this.responseText.substr(this.responseText.search(':') + 1) + '?' + new Date().getTime());
                console.log(this.responseText);
                let wrapper = document.getElementsByClassName('content')[0];
                wrapper.insertBefore(image, wrapper.children[2]);
                mainPicture.remove();
                let newPicture = document.getElementsByClassName('mainpicture')[0];
            } 
            else if(this.readyState === XMLHttpRequest.DONE && this.status === 406) {
                alert('The file introduced is not a photo!');
            }
            else if(this.readyState === XMLDocument.DONE && this.status === 500) {
                alert('Internal server error!');
            }
        }
        var formData = new FormData();
        let recipeName = document.getElementById('pageName').innerText;
        formData.append("recipeName", recipeName);
        formData.append("recipePhoto", image);

        xhr.send(formData);
    }
}


function changeRecipeTime(value) {
    let input;
    if(value === 'prep')
        input = document.getElementById('inputChangePreparationTime');
    else 
        input = document.getElementById('inputChangeFinalisationTime');
    let number = input.value;
    if(number === undefined || number === null || number === '') 
        alert('Va rugam sa introduceti un alt numar inainte de a incerca sa schimbati timpul retetei!');
    else if(number < 0 || number > 999999)
        alert('Not a valid number! Please, insert a number between [0,999999]!');
    else {
        var xhr = new XMLHttpRequest();
        xhr.open("PATCH", "/modifyRecipe/Time", true);
        xhr.setRequestHeader("Content-Type","application/json");
    
        xhr.onreadystatechange = function() {
            if(this.readyState === XMLHttpRequest.DONE && this.status === 202) {
                let type = this.responseText.startsWith('prep') ? 'prep' : 'fin';
                let Time = document.getElementById(type);
                Time.innerHTML = '<strong>Timp ' + ((type === 'prep') ? 'preparare: ' : 'finalizare: ')  +  '</strong>' + this.responseText.substr(this.responseText.search(':') + 1) + ' minute.'; 
            } 
            else if(this.readyState === XMLHttpRequest.DONE && this.status === 406) {
                alert('The current introduced value is not a number');
            }
            else if(this.readyState === XMLDocument.DONE && this.status === 500) {
                alert('Internal server error!');
            }
        }
        let recipeName = document.getElementById('pageName').innerText;
        xhr.send(JSON.stringify({recipeName: recipeName, newNumber: number, type: value}));
    }
}

function changeSelect(type) {
    let input;
    if(type === 'cat')
        input = document.getElementById('categorie');
    else 
        input = document.getElementById('dificultate');
    let value = input.value;
    if(value === undefined || value === null || value === '') 
        alert('Va rugam sa introduceti o valoare valida pentru tip cand schimbati tipul retetei!');
    else {
        var xhr = new XMLHttpRequest();
        xhr.open("PATCH", "/modifyRecipe/Type", true);
        xhr.setRequestHeader("Content-Type","application/json");
    
        xhr.onreadystatechange = function() {
            if(this.readyState === XMLHttpRequest.DONE && this.status === 202) {
                let type = this.responseText.startsWith('cat') ? 'cat' : 'dif';
                let elem = document.getElementById(type);
                //<strong>Categorie reteta: </strong>${categorie}
                if(type === 'cat')
                    elem.innerHTML = '<strong>Categorie reteta: ';
                else 
                    elem.innerHTML = '<strong>Dificultate reteta: ';
                elem.innerHTML = elem.innerHTML +  this.responseText.substr(this.responseText.search(':') + 1)  + '</strong>'; 
            } 
            else if(this.readyState === XMLHttpRequest.DONE && this.status === 406) {
                alert('The current introduced value is not a valid category/type!');
            }
            else if(this.readyState === XMLDocument.DONE && this.status === 500) {
                alert('Internal server error!');
            }
        }
        let recipeName = document.getElementById('pageName').innerText;
        xhr.send(JSON.stringify({recipeName: recipeName, value : value, type: type}));
    }
}

function addIngredient() 
{
    var content, nringredient;
    nringredient = document.getElementById("nringrediente").value;
    content = document.getElementsByClassName("add_ingredinte_wrapper");
    content[0].innerHTML = '';
    var form = document.createElement("form");
    if(nringredient != 'none') {
        for (i = 0; i < nringredient; i++) 
        {
            var label = document.createElement("label");
            var input = document.createElement("input")
            label.setAttribute("for", (i + 1)  + "_ingredient");
            label.innerHTML = (i + 1) + ". Ingredient";
            input.setAttribute("type","text");
            input.setAttribute("id", (i + 1) + "_ingredient");
            input.setAttribute("name",(i + 1) + "_ingredient");
            input.setAttribute("required","true");
            form.append(label);
            form.append(input);
        }
        var btn = document.createElement("button");
        btn.setAttribute("type", "button");
        btn.setAttribute("onclick", "addIngredientsToRecipe()");
        btn.innerText = "Add ingredient(s)!";
        form.append(btn);
        content[0].append(form);
    }
}

function addIngredientsToRecipe() {
    ingredients = [];
    var nringredient;
    nringredient = document.getElementById("nringrediente").value;
    if(nringredient != 'none') {
        for (i = 0; i < nringredient; i++) 
        {
            var value = document.getElementById((i + 1) + "_ingredient").value;
            ingredients.push(value);
        }
        var xhr = new XMLHttpRequest();
        xhr.open("PATCH", "/modifyRecipe/addIngredients", true);
        xhr.setRequestHeader("Content-Type","application/json");
    
        xhr.onreadystatechange = function() {
            if(this.readyState === XMLHttpRequest.DONE && this.status === 202) {
                let elem = document.getElementById('listIngredients');
                let data = '';
                let childs = elem.childNodes;
                let actualSize = 0;
                /*
                for(let k = 0; k < childs.length; k++) 
                    if(childs[k].nodeName === 'LI')
                        actualSize = actualSize + 1;
                */
                actualSize = actualSize + nringredient;
                let numb = parseInt(this.responseText.substr(this.responseText.search(':') + 1));
                for(let j = 0; j < actualSize ; j++)
                    data = data + '<li class="relative" id="li' + (numb + j + 1) + '"><img src="/circle.png" alt="circle"><div id="div' + (numb + j + 1) + '"> ' + ingredients[j] +'</div><img src="/deleteButton.png" id="delete' +  (numb + j + 1) + '" alt="delete" class="deleteButton" onclick="deleteIngredient(this.id)"></li>';
                elem.innerHTML = elem.innerHTML + data;

                let ingred = document.getElementById('ing');
                ingred.innerHTML = '<strong>Numar ingrediente: </strong>' + this.responseText.substr(this.responseText.search(':') + 1) ; 
            } 
            else if(this.readyState === XMLHttpRequest.DONE && this.status === 406) {
                alert('The current introduced value is not a valid category/type!');
            }
            else if(this.readyState === XMLDocument.DONE && this.status === 500) {
                alert('Internal server error!');
            }
        }
        let recipeName = document.getElementById('pageName').innerText;
        xhr.send(JSON.stringify({ingredients: ingredients, recipeName: recipeName}));
    } 
    else
        alert('Nu ati selectat un numar valid de ingrediente!');
}

function addInstruction() 
{
    var content, nrinstructiuni;

    nrinstructiuni = document.getElementById("nrinstructiuni").value;
    content = document.getElementsByClassName("add_instructiuni_wrapper");
    content[0].innerHTML = '';
    var form = document.createElement("form");
    if(nrinstructiuni != 'none') {
        for (i = 0; i < nrinstructiuni; i++) 
        {
            
            var label1 = document.createElement("label");
            var textarea = document.createElement("textarea");
            var label2 = document.createElement("label");
            var input = document.createElement("input");
            label1.setAttribute("for", "instructiune" + (i + 1));
            label1.innerHTML = "Instructiunea " + (i + 1);
            textarea.setAttribute("id", "instructiune" + (i + 1));
            textarea.setAttribute("name", "instructiune" + (i + 1));
            textarea.setAttribute("required", "true");
            label2.setAttribute("for", "pozainstructiunea" + (i + 1));
            label2.innerHTML = "Poza instructiunea " + (i + 1);
            input.setAttribute("type","file");
            input.setAttribute("id", "pozainstructiunea" + (i + 1));
            input.setAttribute("name", "pozainstructiunea" + (i + 1));
            input.setAttribute("required","true");
            form.append(label1);
            form.append(textarea);
            form.append(label2);
            form.append(input);
        }
        var btn = document.createElement("button");
        btn.setAttribute("type", "button");
        btn.setAttribute("onclick", "addInstructionsToRecipe()");
        btn.innerText = "Add instructions(s)!";
        form.append(btn);
        content[0].append(form);
    } 
}

function addInstructionsToRecipe() {

    let recipeName = document.getElementById('pageName').innerText;
    let nrInstructiuni = document.getElementById("nrinstructiuni").value;
    nrInstructiuni = parseInt(nrInstructiuni);
    console.log('???????????????????????????');
    console.log(nrInstructiuni);
    console.log('???????????????????????????');
    let instructiuni = [];
    let pozeInstructiuni = [];
    for( i = 0 ; i < nrInstructiuni; i++) {
        instructiuni[i] = document.getElementById("instructiune" + (i + 1)).value;  
        pozeInstructiuni[i] = document.getElementById("pozainstructiunea" + (i + 1)).files[0];  
    }
    var formData = new FormData();
    
    formData.append("recipeName", recipeName);

    formData.append("nrInstructiuni", nrInstructiuni);
    formData.append("instructiuni", instructiuni);
    for( i = 0; i < nrInstructiuni; i++)
        formData.append("pozeInstructiuni" , new File([pozeInstructiuni[i]], 'poza.jpg',{type:pozeInstructiuni[i].type}));
    var xhr = new XMLHttpRequest();
    xhr.open("PATCH", "/modifyRecipe/addInstructions", true);

    xhr.onreadystatechange = function() {
        if(this.readyState === XMLHttpRequest.DONE && this.status === 202) {
            let elem = document.getElementById('listInstructions');
            let data = '';
            let actualSize = 0;
            actualSize = actualSize + parseInt(this.responseText.substr(this.responseText.search(':') + 1));
            for(let j = 0; j < nrInstructiuni ; j++) {

                data = data + '<li><img src="/recipes/' + recipeName + '/poza' + (actualSize + j + 1) + '.jpg" alt="photo"><div>' + instructiuni[j] + '</div></li>';
            }
            elem.innerHTML = elem.innerHTML + data;
            instr = document.getElementById('ins');
            instr.innerHTML = '<strong>Numar instructiuni: </strong>' + (actualSize + nrInstructiuni);
        } 
        else if(this.readyState === XMLHttpRequest.DONE && this.status === 406) {
            alert('The current file is not a valid file type!');
        }
        else if(this.readyState === XMLDocument.DONE && this.status === 500) {
            alert('Internal server error!');
        }
    }    
    xhr.send(formData);
}

function deleteIngredient(id) {
    let nr = 0;
    let i = id.length - 1;
    let pow = 1;
    while(id.charAt(i) >= '0' && id.charAt(i) < '9') {
        nr = nr + parseInt(id.charAt(i)) * pow;
        pow = pow * 10;
        i--;
    }
    let instructionText = document.getElementById('div' + nr).innerText;
    let recipeName = document.getElementById('pageName').innerText;
    var xhr = new XMLHttpRequest();
    xhr.open("DELETE", "/deleteIngredient", true);
    xhr.setRequestHeader("Content-Type","application/json");

    xhr.onreadystatechange = function() {
        if(this.readyState === XMLHttpRequest.DONE && this.status === 202) {
            let li = document.getElementById('li' + nr);
            li.remove();
            let ingred = document.getElementById('ing');
            console.log('++++++++++++++++++++++++++++++++++++++++++++++++++++++++');
            console.log(this.responseText.substr(this.responseText.search(':') + 1));
            console.log('++++++++++++++++++++++++++++++++++++++++++++++++++++++++');
            ingred.innerHTML = '<strong>Numar ingrediente: </strong> ' + this.responseText.substr(this.responseText.search(':') + 1) ; 
        } 
        else if(this.readyState === XMLHttpRequest.DONE && this.status === 404) {
            alert('Page not found! Seems, that the page does not exist!');
        }
        else if(this.readyState === XMLDocument.DONE && this.status === 403) {
            alert('Forbidden! You are not allow to access this page! If you are an admin, request control from the owner!');
        }
        else if(this.readyState === XMLDocument.DONE && this.status === 500) {
            alert('Internal server error!');
        }
    }
    xhr.send(JSON.stringify({recipeName: recipeName, instructionText: instructionText}));
}
