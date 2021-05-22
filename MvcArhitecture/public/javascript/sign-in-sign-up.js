function openForm(pageName, hiddenPage) 
{
    document.getElementById(pageName).style.display = "flex";
    document.getElementById(hiddenPage).style.display = "none";
};


function reloadCurrentPage() {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", '/sign-in-sign-up.html', true);
    
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
    // xhr.send(new Int8Array());
    // xhr.send(document);
};

function sendRegisterAndRedirect() {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/sign-in-sign-up.html", true);
    xhr.setRequestHeader("Content-Type","application/json");

    xhr.onreadystatechange = function() {
        if(this.readyState === XMLHttpRequest.DONE && this.status === 201) {
            openForm('Login','Register'); 
        } 
        else if(this.readyState === XMLHttpRequest.DONE && this.status === 409) {
            alert('Username or email already used by someone else! Please change them to continue.');
        }
    }

    let firstName = document.getElementById("fName").value;
    let lastName = document.getElementById("lName").value;
    let email = document.getElementById("mail").value;
    let username = document.getElementById("UserName").value;
    let password = document.getElementById("Password").value;
    let birthDate = document.getElementById("date").value;
    xhr.send(JSON.stringify({type: 'Register', firstName: firstName, lastName: lastName, email: email, username: username, password: password, birthDate: birthDate }));
}
