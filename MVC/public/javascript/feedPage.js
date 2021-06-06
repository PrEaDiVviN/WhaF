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

    if (pageName == 'Recipes' || pageName == 'Breakfast')
        document.getElementById("Filter").style.display = "block";
    else 
        document.getElementById("Filter").style.display = "none";
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

    document.getElementById("Breakfast").style.display = "none";

    document.getElementById("Brunch").style.display = "none";

    document.getElementById("Lunch").style.display = "none";

    document.getElementById("Snacks").style.display = "none";

    document.getElementById("Dinner").style.display = "none";

    document.getElementById("Soups").style.display = "none";

    document.getElementById("Salads").style.display = "none";

    document.getElementById("Main").style.display = "none";

    document.getElementById("Pasta").style.display = "none";

    document.getElementById("Seafood").style.display = "none";

    document.getElementById("Pizza").style.display = "none";

    document.getElementById("Burgers").style.display = "none";

    document.getElementById("Vegetarian").style.display = "none";

    document.getElementById("Vegan").style.display = "none";

    document.getElementById("Sides").style.display = "none";

    document.getElementById("Sauces").style.display = "none";

    document.getElementById("Desserts").style.display = "none";

    document.getElementById("Drinks").style.display = "none";

    document.getElementById("Rankings").style.display = "none";
}

function logout() {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/feedPage.html", true);

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

function exportCSV(filename) {
    var csv = [];
    var i;

    //luam elementele cu id-ul PopularR, care au ca parinte table si tr
    var rows = document.querySelectorAll("#PopularR table tr");
    
    for (i = 0; i < rows.length; i++) {
        var row = [], cols = rows[i].querySelectorAll("td, th");
        
        for (var j = 0; j < cols.length; j++) 
            row.push(cols[j].innerText);
        
        csv.push(row.join(","));        
    }

    // Download CSV file
    downloadCSV(csv.join("\n"), filename);
}

function downloadCSV(csv, filename) {
    var csvFile;
    var downloadLink;

    //cream fisierul CSV, Blob <=> fisier de un anumit tip
    csvFile = new Blob([csv], {type: "text/csv"});

    //cream un link de download
    downloadLink = document.createElement("a");

    downloadLink.download = filename;

    //cream un link catre fisierul pe care vrem sa-l descarcam
    downloadLink.href = window.URL.createObjectURL(csvFile);

    downloadLink.style.display = "none";

    document.body.appendChild(downloadLink);

    //dam click pe link  
    downloadLink.click();
}

function exportJSON(filename, id) {
    var json;
    var i;
    var data = [];

    //luam elementele cu id-ul PopularR, care au ca parinte table si tr
    var rows = document.querySelectorAll(id + " table tr");

    var header = [], col = rows[0].querySelectorAll("td, th");
        
    for (var j = 0; j < col.length; j++) 
        header.push(col[j].innerText);
    
    for (i = 1; i < rows.length; i++) {
        var row = [], cols = rows[i].querySelectorAll("td, th");
        
        for (var j = 0; j < cols.length; j++) {
            row.push(header[j]);
            row.push(cols[j].innerText);
        }
        
        data.push(row);        
    }

    json = JSON.stringify(data);

    // Download CSV file
    downloadJSON(json, filename);
}

function downloadJSON(json, filename) {
    var jsonFile;
    var downloadLink;

    //cream fisierul CSV, Blob <=> fisier de un anumit tip
    jsonFile = new Blob([json], {type: "text/json"});

    //cream un link de download
    downloadLink = document.createElement("a");

    downloadLink.download = filename;

    //cream un link catre fisierul pe care vrem sa-l descarcam
    downloadLink.href = window.URL.createObjectURL(jsonFile);

    downloadLink.style.display = "none";

    document.body.appendChild(downloadLink);

    //dam click pe link  
    downloadLink.click();
}