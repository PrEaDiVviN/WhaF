function showTab(buttonName ,tabName) {
	let tabs = ["requested-content-account", "requested-content-history", "requested-content-added", "requested-content-tried"];
	let buttons = ["button-account", "button-history", "button-added", "button-tried"];
	for (i = 0; i < tabs.length; i++) {
		let itm = document.getElementsByClassName(tabs[i]);
		itm[0].style.display = "none";
		let btns = document.getElementsByClassName(buttons[i]);
		btns[0].className = btns[0].className.replace(" active", "");
    }
    let tab = document.getElementsByClassName(tabName);
    let btn = document.getElementsByClassName(buttonName);
    btn[0].className += " active";
    if(buttonName == "button-tried" || buttonName == "button-added") {
    	tab[0].style.display = "flex";
    	tab[0].style.alignContent = "flex-start";
    	tab[0].style.justifyContent = "space-evenly";
    	tab[0].style.flexWrap = "wrap";
    
    }
    else
		tab[0].style.display = "block";
}


//afisam tab-ul modoficarilor pt account
document.getElementsByClassName("button-account")[0].click();