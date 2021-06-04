function openTab(evt, tabName) 
{
    var i, content, button;

    content = document.getElementsByClassName("content");

    for (i = 0; i < content.length; i++) 
    {
        content[i].style.display = "none";
    }

    button = document.getElementsByClassName("menu-button");
    for (i = 0; i < button.length; i++) 
    {
        button[i].className = button[i].className.replace(" active", "");
    }

    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}

document.getElementById("defaultOpen").click();

function sendSettings() {

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/settingsPage.html", true);
    //xhr.setRequestHeader("Content-Type", "multipart/form-data");

    xhr.onreadystatechange = function() {
        if(this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            alert('Setarile au fost executate cu success!');
        } 
        else if(this.readyState === XMLHttpRequest.DONE && this.status === 500) {
            alert('Eroare neasteptata a serverului! Va rugam sa reincercati! Daca problema persista, contactati un administrator al site-ului..');
        }
        else if(this.readyState === XMLHttpRequest.DONE && this.status === 415) {
            alert('Fisierul introdus drept imagine de profil al utilizatorului poate fi doar imagine cu extensia .jpg, .png sau .svg');
        }
    }
    console.log(document.getElementById("firstname").value);
    let firstName = (document.getElementById("firstname").value != '') ? document.getElementById("firstname").value : undefined ;
    let lastName = (document.getElementById("lastname").value != '') ? document.getElementById("lastname").value : undefined ;
    let username = (document.getElementById("username").value != '') ? document.getElementById("username").value : undefined ;
    console.log('------------------------------------------------');
    console.log(username);
    console.log('------------------------------------------------');
    let password = (document.getElementById("password").value != '') ? document.getElementById("password").value : undefined ;
    let email = (document.getElementById("email").value != '') ? document.getElementById("email").value : undefined ;
    let userPhoto = document.getElementById("avatar").files[0];
    console.log(document.getElementById("birthdate").value);
    let birthDate = (document.getElementById("birthdate").value != '') ? document.getElementById("birthdate").value : undefined ;

    var formData = new FormData();
    formData.append("type", "change");
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("username", username);
    formData.append("password", password);
    formData.append("email", email);
    formData.append("userPhoto", userPhoto);
    formData.append("birthDate", birthDate);
    xhr.send(formData);
}
