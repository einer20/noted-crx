$(document).ready(function () {
	var noted = new Noted();
	noted.getNotes(function (notes) {
		if (notes.length) {
			utils.showNotification("You have " + (notes.length == 1 ? " note " : " notes ") + " in this page");
		};
	});
	
})