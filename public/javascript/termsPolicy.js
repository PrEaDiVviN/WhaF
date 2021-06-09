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
  
//dam click by default pe elementul cu id-ul "defaultOpen"
document.getElementById("defaultOpen").click();

function logout() {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/termsPolicy.html", true);

    xhr.onreadystatechange = function() {
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            window.location.href = "/loginRegister.html"; 
        } 
        else if (this.readyState === XMLHttpRequest.DONE && this.status === 500) {
            alert('Unexpected server error! Please try again! If the problem persists, please contact us.');
        }
    }

    var formData = new FormData();

    formData.append("type", 'Logout');
    xhr.send(formData);
}