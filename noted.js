function Noted (keyName) {
  
  keyName = keyName || location.href;
  console.log(keyName);
  this.storageKey = {};
  this.storageKeyName = "noted-" + keyName;
  this.storageKey["noted-" + keyName] = [];
  this.emptyStorageKey = {};
  this.emptyStorageKey["noted-" + keyName] = [];

  this.savedNotes = []
  this.listeners = [];
  var $this = this;
  chrome.storage.onChanged.addListener(function () {
    $this.notifyChanges("create", $this.savedNotes);
  });

  chrome.storage.sync.get(this.emptyStorageKey,function(data) {
     $this.savedNotes = data[$this.storageKeyName];
     $this.notifyChanges("loaded", data.notes);
  }); 

}

Noted.prototype.setStorageKey = function(keyName) {
  this.storageKey = {};
  this.storageKeyName = "noted-" + keyName;
  this.storageKey["noted-" + keyName] = [];
  this.emptyStorageKey = {};
  this.emptyStorageKey["noted-" + keyName] = [];

};

Noted.prototype.getNotes = function(listener) {

  var $this = this;
  if (this.savedNotes.length) {
      listener(this.savedNotes);
  }
  else {
    
    chrome.storage.sync.get(this.emptyStorageKey,function(data) {
        listener(data[$this.storageKeyName]);
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

Noted.prototype.addNote = function(note, arguments) {
  this.savedNotes.push(note);
  var $this = this;
  var data = {};
  data[this.storageKeyName] = this.savedNotes;
  chrome.storage.sync.set(data, function() {
    $this.notifyChanges("create");
  });
};

Noted.prototype.updateNote = function(index,note) {
  this.savedNotes[index] = note;

  var $this = this;
  var update = {};
  update[this.storageKeyName] = this.savedNotes;
  chrome.storage.sync.set(update, function() {
    $this.notifyChanges("update");
  });
};

Noted.prototype.removeNote = function(note) { 

  var $this = this;
  this.savedNotes.splice(note,1);

  var data = {};
  data[this.storageKeyName] = this.savedNotes;
  chrome.storage.sync.set(data, function() {
    $this.notifyChanges("remove");
  });
};
