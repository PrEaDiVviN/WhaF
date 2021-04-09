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

    document.getElementById("MyPage").style.visibility = "visible";

    document.getElementById("Default").style.visibility = "hidden";

    document.getElementById("Filter").style.visibility = "hidden";
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

    document.getElementById("Default").style.visibility = "hidden";

    document.getElementById("Added").style.visibility = "hidden";

    document.getElementById("Tried").style.visibility = "hidden";

    document.getElementById("MyPage").style.visibility = "hidden";

    document.getElementById("Filter").style.visibility = "Visible";
}

function openDropdown() 
{
    //show the dropdown content
    document.getElementById("Dropdown").classList.toggle("show");

    //close the dropdown, if the user clicks outside of it
    window.onclick = function(event) 
    {
        if (!event.target.matches('.filter-button')) 
        {
            var dropdowns = document.getElementsByClassName("dropdown-content");
            var i;

            for (i = 0; i < dropdowns.length; i++) 
            {
                var openDropdown = dropdowns[i];

                if (openDropdown.classList.contains('show')) 
                {
                    openDropdown.classList.remove('show');
                }
            }
        }
    }
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

    document.getElementById(pageName).style.visibility = "visible";
}
