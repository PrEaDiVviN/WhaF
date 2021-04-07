function openForm(pageName, hiddenPage) 
{
    document.getElementById(pageName).style.display = "block";

    document.getElementById(hiddenPage).style.visibility = "hidden";

    document.getElementById(pageName).style.visibility = "visible";
}