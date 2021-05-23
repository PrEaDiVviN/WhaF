function savePhoto() {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/recipePage.html", true);
    //xhr.setRequestHeader("Content-Type", "multipart/form-data");

    xhr.onreadystatechange = function() {
        if(this.readyState === XMLHttpRequest.DONE && this.status === 201) {
            alert('Reteta a fost adaugata la retete incercate!');
            window.location.reload();
        } 
        
        else if(this.readyState === XMLHttpRequest.DONE && this.status === 500) {
            alert('Eroare neasteptata a serverului! Va rugam sa reincercati! Daca problema persista, contactati un administrator al site-ului..');
        }
    }
    
    let recipeName = document.getElementById("pageName").innerText;
    let recipePhoto = document.getElementById("add").files[0];
   
    var formData = new FormData();
    
    if(recipePhoto != undefined) {
        formData.append("recipeName", recipeName);
        formData.append("recipePhoto", recipePhoto);
        xhr.send(formData);
    }
    else if(recipePhoto.type != 'image/jpeg' && recipePhoto.type != 'image/png' && recipePhoto.type != 'image/svg')
        alert('Fisierul introdus nu respecta formatele (.jpg, .png, .svg)! Va rugam sa introduceti unul din aceste formate!');
    else 
        alert('Va rugam sa introduceti intai o imagine pentru a putea salva!');
}