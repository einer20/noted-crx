function Noted () {
  
  this.pageId = 'https://developer.chrome.com/extensions/storage';
  this.savedNotes = []
  this.listeners = [];
  var $this = this;
  chrome.storage.onChanged.addListener(function () {
    $this.notifyChanges("create", $this.savedNotes);
  });

  chrome.storage.sync.get({
    notes:[]
  },function(data) {
     $this.savedNotes = data.notes;
     $this.notifyChanges("loaded", data.notes);
  }); 


}

Noted.prototype.getNotes = function(listener) {

  if (this.savedNotes.length) {
      listener(this.savedNotes);
  }
  else {
    chrome.storage.sync.get({
      notes:[]
    },function(data) {
        listener(data.notes);
    }); 
  }

    
};



Noted.prototype.initializeNoteService = function() {
 
};

Noted.prototype.onNotedChanges = function(listener) {
  this.listeners.push(listener);
};

Noted.prototype.notifyChanges = function(action) {
  for (var i = 0; i < this.listeners.length; i++) {
      this.listeners[i](action, this.savedNotes);
  };
};

Noted.prototype.sendMessage = function(message, timeout , click) {

};

Noted.prototype.addNote = function(note, arguments) {
  this.savedNotes.push(note);
  var $this = this;
  chrome.storage.sync.set({
    notes:this.savedNotes
  }, function() {
    $this.notifyChanges("create");
  });
};

Noted.prototype.updateNote = function(index,note) {
  this.savedNotes[index] = note;

  var $this = this;
  chrome.storage.sync.set({
    notes:this.savedNotes
  }, function() {
    $this.notifyChanges("update");
  });
};

Noted.prototype.removeNote = function(note) {  

  for(var i = 0 ; i < this.savedNotes.length; i++)
  {
    if (this.savedNotes[i] == note) {
        this.savedNotes.splice(i,1);
        this.notifyChanges("delete")
    }
  }
};
