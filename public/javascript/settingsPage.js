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

function logout() {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/settingsPage.html", true);

    xhr.onreadystatechange = function() {
        if (this.readyState === XMLHttpRequest.DONE && this.status === 302) {
            window.location.reload(); 
        } 
        else if (this.readyState === XMLHttpRequest.DONE && this.status === 500) {
            alert('Unexpected server error! Please try again! If the problem persists, please contact us.');
        }
    }

    var formData = new FormData();

    formData.append("type", 'Logout');
    xhr.send(formData);
}
  
//dam click by default pe elementul cu id-ul "defaultOpen"
document.getElementById("defaultOpen").click();

function sendChanges() {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/settingsPage.html", true);

    xhr.onreadystatechange = function() {
        if (this.readyState === XMLHttpRequest.DONE && this.status === 500) {
            alert('Unexpected server error! Please try again! If the problem persists, please contact us.');
        }
        else if (this.readyState === XMLHttpRequest.DONE && this.status === 403) {
            alert('It is forbidden for an user who is not connected to access user account settings! Login or register to do so!');
        }
        else  if (this.readyState === XMLHttpRequest.DONE && this.status === 701) {
            alert('The type of files you inserted are not images! Please, insert these types of images! (Accepted formats are .jpg, .png, .svg)');
        }
        else  if (this.readyState === XMLHttpRequest.DONE && this.status === 203) {
            alert('First and last name must only contain characters! Please try again!');
        }
        else  if (this.readyState === XMLHttpRequest.DONE && this.status === 204) {
            alert('Username already exists! Please try again!');
        }
        else  if (this.readyState === XMLHttpRequest.DONE && this.status === 205) {
            alert('Username must only contain characters! Please try again!');
        }
        else if (this.readyState === XMLHttpRequest.DONE && this.status === 206) {
            alert('Your password must contain at least one character, one number and one special character like _, -, ~, <, > and must have a minimum length of 7! Please try again.');
        }
        else  if (this.readyState === XMLHttpRequest.DONE && this.status === 207) {
            alert('Email already exists! Please try again!');
        }
        else if (this.readyState === XMLHttpRequest.DONE && this.status === 208) {
            alert('Your email must have the format "example@something.com"! Please try again.');
        }
        else if (this.readyState === XMLHttpRequest.DONE && this.status === 200) { 
            window.location.href = "/loginRegister.html";
        }
        else if (this.readyState === XMLHttpRequest.DONE && this.status === 201) { 
            window.location.href = "/feedPage.html";
        }
    }
    
    let fName = document.getElementById("firstname").value;
    let lName = document.getElementById("lastname").value;
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    let email = document.getElementById("email").value;
    let avatar = document.getElementById("avatar").files[0];
    let birthdate = document.getElementById("birthdate").value; 

    var formData = new FormData();

    console.log(fName);
    console.log(username);

    formData.append("type", 'Settings');
    formData.append("firstname", fName);
    formData.append("lastname", lName);
    formData.append("username", username);
    formData.append("password", password);
    formData.append("email", email);
    formData.append("avatar", avatar);
    formData.append("birthdate", birthdate);

    xhr.send(formData);
}

function deleteAccount() {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/settingsPage.html", true);

    xhr.onreadystatechange = function() {
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            window.location.href = "/loginRegister.html";
        } 
        else if (this.readyState === XMLHttpRequest.DONE && this.status === 500) {
            alert('Unexpected server error! Please try again! If the problem persists, please contact us.');
        }
    }

    var formData = new FormData();

    formData.append("type", 'Delete');
    xhr.send(formData);
}