var utils = {

	showNotification:function (message, timeout, title) {
		if (Notification.permission !== "granted"){
	          Notification.requestPermission();
	          alert(message);
	    }
	    else {
		        var notification = new Notification( title || 'Noted alert', {
			          icon: 'resources/logo.png',
			          body: message,
		        });

		        setTimeout(function () {
		          notification.close();
		        }, timeout || 5000);

		        return notification;
	    	}
	}
}