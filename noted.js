  if (Notification.permission !== "granted")
    Notification.requestPermission();
  else {
    var notification = new Notification('You have noted in this page!', {
      icon: 'resources/logo.png',
      body: "You have 2 notes in this web page!",
    });

    notification.onclick = function () {
      window.open("http://stackoverflow.com/a/13328397/1269037");      
    };

  }