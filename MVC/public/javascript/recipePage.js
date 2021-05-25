function savePhoto() {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/recipePage.html", true);

    xhr.onreadystatechange = function() {
        if(this.readyState === XMLHttpRequest.DONE && this.status === 201) {
            alert('The recipe has been added to your tried recipes!');
            window.location.reload();
        } 
        
        else if(this.readyState === XMLHttpRequest.DONE && this.status === 500) {
            alert('Unexpected server error! Please try again! If the problem persists, please contact us.');
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
        alert('The uploaded file does not respect the image format (.jpg, .png, .svg)! Please try again!');
    else 
        alert('Please upload an image first in order to save the recipe!');
}