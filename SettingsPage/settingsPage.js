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