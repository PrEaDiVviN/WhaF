function openMyPage() 
{
    var i, content, nav;

    content = document.getElementsByClassName("content");
    for (i = 0; i < content.length; i++) 
    {
        content[i].style.display = "none";
    }

    nav = document.getElementsByClassName("my-page");
    for (i = 0; i < nav.length; i++) 
    {
        nav[i].style.backgroundColor = "";
    }

    document.getElementById("MyPage").style.display = "block";

    document.getElementById("Default").style.display = "none";

    document.getElementById("Filter").style.display = "none";

    document.getElementById("Search").style.display = "none";
}

function openPage(pageName) 
{
    var i, content, nav;

    content = document.getElementsByClassName("content");
    for (i = 0; i < content.length; i++) 
    {
        content[i].style.display = "none";
    }

    nav = document.getElementsByClassName("grid-button");
    for (i = 0; i < nav.length; i++) 
    {
        nav[i].style.backgroundColor = "";
    }

    document.getElementById(pageName).style.display = "block";

    document.getElementById("Default").style.display = "none";

    document.getElementById("Added").style.display = "none";

    document.getElementById("Tried").style.display = "none";

    document.getElementById("MyPage").style.display = "none";

    if (pageName == 'Recipes')
        document.getElementById("Filter").style.display = "block";
    else
        document.getElementById("Filter").style.display = "none";
}

function openRecipes(pageName) 
{
    var i, content, button;

    content = document.getElementsByClassName("recipes-content");
    for (i = 0; i < content.length; i++) 
    {
        content[i].style.display = "none";
    }

    button = document.getElementsByClassName("page-button");
    for (i = 0; i < button.length; i++) 
    {
        button[i].style.backgroundColor = "";
    }

    document.getElementById(pageName).style.display = "block";

    document.getElementById("Default").style.display = "none";

    document.getElementById("Filter").style.display = "none";

    document.getElementById("Search").style.display = "none";
}

function openFilter() 
{
    var i, content, nav;

    content = document.getElementsByClassName("content-filter");
    for (i = 0; i < content.length; i++) 
    {
        content[i].style.display = "none";
    }

    nav = document.getElementsByClassName("filter-button");
    for (i = 0; i < nav.length; i++) 
    {
        nav[i].style.backgroundColor = "";
    }

    document.getElementById("Filter").style.display = "block";

    document.getElementById("Default").style.display = "block";

    document.getElementById("Search").style.display = "none";

    document.getElementById("Categories").style.display = "none";

    document.getElementById("Rankings").style.display = "none";

    document.getElementById("MyPage").style.display = "none";

    document.getElementById("Added").style.display = "none";

    document.getElementById("Tried").style.display = "none";
}
