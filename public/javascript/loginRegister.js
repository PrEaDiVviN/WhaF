function openForm(pageName, hiddenPage) 
{
    document.getElementById(pageName).style.display = "flex";
    document.getElementById(hiddenPage).style.display = "none";
};

function reloadCurrentPage() {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", '/loginRegister.html', true);
    
    //Send the proper header information along with the request
    xhr.setRequestHeader("Content-Type", "application/json");
    
    xhr.onreadystatechange = function() { // Call a function when the state changes.
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            // Request finished. Do processing here.
            window.location.reload(); 
        }
        else if(this.readyState === XMLHttpRequest.DONE && this.status === 403) {
            alert("Wrong user credentials! Please check your username and password.");
        }
    }

    let username = document.getElementById("username").value;
    let password = document.getElementById("passwd").value; 
    xhr.send(JSON.stringify({type: 'Login' ,username: username, password: password}));
};

function sendRegisterAndRedirect() {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/loginRegister.html", true);
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onreadystatechange = function() {
        if (this.readyState === XMLHttpRequest.DONE && this.status === 201) {
            openForm('Login','Register'); 
        } 
        else if (this.readyState === XMLHttpRequest.DONE && this.status === 409) {
            alert('Email already used by someone else! Please change it to continue.');
        }
        else if (this.readyState === XMLHttpRequest.DONE && this.status === 408) {
            alert('Username already used by someone else! Please change it to continue.');
        }
        else if (this.readyState === XMLHttpRequest.DONE && this.status === 410) {
            alert('Passwords do not coincide! Please try again.');
        }
        else if (this.readyState === XMLHttpRequest.DONE && this.status === 411) {
            alert('Your password must contain at least one character, one number and one special character like _, -, ~, <, > and must have a minimum length of 7! Please try again.');
        }
        else if (this.readyState === XMLHttpRequest.DONE && this.status === 412) {
            alert('Your username must only contain characters and must have a minimum length of 7! Please try again');
        }
        else if (this.readyState === XMLHttpRequest.DONE && this.status === 413) {
            alert('Your email must have the format "example@something.com"! Please try again.');
        }
        else if (this.readyState === XMLHttpRequest.DONE && this.status === 414) {
            alert('First and last name has to only contain letters! Please try again.');
        }
        else if (this.readyState === XMLHttpRequest.DONE && this.status === 500) {
            alert('Internal server error.');
        }
    }

    let firstName = document.getElementById("fName").value;
    let lastName = document.getElementById("lName").value;
    let email = document.getElementById("mail").value;
    let username = document.getElementById("UserName").value;
    let password = document.getElementById("Password").value;
    let passwordConfirm = document.getElementById("passw").value;
    let birthDate = document.getElementById("date").value;
    xhr.send(JSON.stringify({type: 'Register', firstName: firstName, lastName: lastName, email: email, username: username, password: password, passwordConfirm: passwordConfirm, birthDate: birthDate }));
}
