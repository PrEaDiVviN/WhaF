function addIngredient() 
{
    var content, nringredient;
    nringredient = document.getElementById("nringrediente").value;
    content = document.getElementsByClassName("ingredinte_wrapper");
    content[0].innerHTML = '';
    if(nringredient != 'none')
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
            content[0].append(label);
            content[0].append(input);
        }
    
 
}

function addInstruction() 
{
    var content, nrinstructiuni;

    nrinstructiuni = document.getElementById("nrinstructiuni").value;
    content = document.getElementsByClassName("instructiuni_wrapper");
    content[0].innerHTML = '';

    if(nrinstructiuni != 'none')
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
            content[0].append(label1);
            content[0].append(textarea);
            content[0].append(label2);
            content[0].append(input);
        }
    
 
}

function verifyChecked() {
    var subm = document.getElementById("submitbtn");
    var nrIngredient = document.getElementById("nringrediente").value;
    var nrinstructiuni = document.getElementById("nrinstructiuni").value;
    if(nrIngredient == "none" || nrinstructiuni == "none")
        alert("Va rugam introduceti cel putin un ingredient si cel putin o instructiune. Va multumim!");
    else 
        document.getElementById("formInstr").submit();
}

function sendRecipeToDatabase() {

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/addrecipePage.html", true);
    //xhr.setRequestHeader("Content-Type", "multipart/form-data");

    xhr.onreadystatechange = function() {
        if(this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            alert('Reteta a fost introdusa cu success!');
        } 
        /*
        else if(this.readyState === XMLHttpRequest.DONE && this.status === 409) {
            alert('Username or email already used by someone else! Please change them to continue.');
        }
        */
    }
    
    let recipeName = document.getElementById("numereteta").value;
    let recipePhoto = document.getElementById("pozareteta").files[0];
    let nrIngrediente = document.getElementById("nringrediente").value;
    // formData.append("pozaReteta", pozaReteta);
    let ingrediente = [];
    for( i = 0 ; i < nrIngrediente; i++) {
        ingrediente[i] = document.getElementById( (i + 1) + "_ingredient").value;  
    }
    let preparationTime = document.getElementById("preptime").value;
    let finalizationTime = document.getElementById("fintime").value;
    let nrInstructiuni = document.getElementById("nrinstructiuni").value
    let instructiuni = [];
    let pozeInstructiuni = [];
    for( i = 0 ; i < nrInstructiuni; i++) {
        instructiuni[i] = document.getElementById("instructiune" + (i + 1)).value;  
        pozeInstructiuni[i] = document.getElementById("pozainstructiunea" + (i + 1)).files[0];  
    }
    let difficulty = document.getElementById("dificultate").value;
    let category = document.getElementById("categorie").value;

    var formData = new FormData();
    
    formData.append("recipeName", recipeName);
    formData.append("recipePhoto", recipePhoto);
    formData.append("nrIngrediente", nrIngrediente);
    formData.append("ingrediente", ingrediente);
    formData.append("preparationTime", preparationTime);
    formData.append("finalizationTime",finalizationTime);
    formData.append("nrInstructiuni", nrInstructiuni);
    formData.append("instructiuni", instructiuni);
    formData.append("pozeInstructiuni", new File([pozeInstructiuni[0]], 'poza.jpg',{type:pozeInstructiuni[0].type}));
    formData.append("dificultate", difficulty);
    formData.append("categorie", category);
    
    xhr.send(formData);
}
