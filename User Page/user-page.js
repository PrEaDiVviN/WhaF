function openPage(pageName) 
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
        nav[i].style.backgroundColor = "";
    }

    document.getElementById(pageName).style.display = "block";
}