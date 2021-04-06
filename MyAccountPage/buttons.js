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
    tab[0].style.display = "block";
    btn[0].className += " active";
}


//afisam tab-ul modoficarilor pt account
document.getElementsByClassName("button-account")[0].click();