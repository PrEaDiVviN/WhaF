function openTab(evt, tabName) 
{
    var i, content, nav;

    content = document.getElementsByClassName("content");

    for (i = 0; i < content.length; i++) 
    {
        content[i].style.display = "none";
    }

    nav = document.getElementsByClassName("nav");
    for (i = 0; i < nav.length; i++) 
    {
        nav[i].className = nav[i].className.replace(" active", "");
    }

    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}
  
// dam click by default pe elementul cu id-ul "defaultOpen"
document.getElementById("defaultOpen").click();