
var notedApp = {
	service: new Noted(),
	controls: {
		NOTE_EDITOR: 1,
		SAVING_INDICATOR_LABEL : 2,
		CANCEL_NOTE_BUTTON: 3,
		EDITOR_TEXTAREA_INPUT : 4,
		SAVED_NOTED_LIST : 5,
		SAVED_NOTED_LIST_LABEL : 6,
		NOT_NOTES_SAVED_LABEL: 7
	},
	disableControl:function() {
		for (var i = 0; i < arguments.length; i++) {
			var $c = $("#control-" + arguments[i]);
			if ($c.is("textarea") || $c.is("input")) {
				$c.prop("disabled",true);
			}
			else{
				$c.addClass("invisible");
			}
		};
	},
	enableControl:function () {
		for (var i = 0; i < arguments.length; i++) {
			var $c = $("#control-" + arguments[i]);
			if ($c.is("textarea") || $c.is("input")) {
				$c.prop("disabled",false);
			}
			else{
				$c.removeClass("invisible");
			}
		};	
	},
	getControl:function (id) {
		return $("#control-"+id);
	},
	savedNotesList : {
		getControl: function () {
			return notedApp.getControl(notedApp.controls.SAVED_NOTED_LIST);
		},

		add:function (note) {
			notedApp.enableControl(notedApp.controls.SAVED_NOTED_LIST_LABEL);
			notedApp.disableControl(notedApp.controls.NOT_NOTES_SAVED_LABEL);

			var control = this.getControl();
			var index = control.find("li").length;
			var link = $(document.createElement("a"))
						.text(note)
						.attr("href","javascript:void(0)")
						.data("index", index)
						.click(function () {
							var index = $(this).data("index");
							notedApp.service.getNotes(function (notes) {
								var note = notes[index];
								notedApp.editor.setNote(note);
								notedApp.editor.state.editing = true;
								notedApp.editor.state.index = index;
							});
							
						});
			$(document.createElement("li"))
			.append(link)
			.appendTo(control);
		},
		addRange:function (list) {
			
		},
		clear:function (argument) {
			
		},
		fill:function (list) {
			this.getControl().find("li").remove();
			for (var i = 0; i < list.length; i++) {
				var note = list[i];
				this.add(note);
			};
		},

	},
	editor:{
		editing:false,
		state:{},
		getControl: function () {
			return notedApp.getControl(notedApp.controls.EDITOR_TEXTAREA_INPUT);
		},
		clear:function (disableControls) {
			if(disableControls)
			{
				this.disableControl(notedApp.controls.SAVING_INDICATOR_LABEL,notedApp.controls.CANCEL_NOTE_BUTTON);
			}
			this.getControl().val("");
		},
		onSave:function(listener){
			notedApp.getControl(notedApp.controls.SAVING_INDICATOR_LABEL)
			.click(function () {
				listener.call(notedApp, this );
			})
		},
		getNote:function () {
			return $.trim(this.getControl().val());
		},
		setNote:function (note) {
			this.getControl().val(note);
			notedApp.enableControl(notedApp.controls.SAVING_INDICATOR_LABEL, notedApp.controls.CANCEL_NOTE_BUTTON);
			this.editing = true;
		},
		onWriting:function (listener) {
			this.getControl().keyup(function (e) {
				listener.call(notedApp,e);
			});	
		},
		onNewNotedStart:function (listener) {
			this.getControl().focus(function (e) {
				listener.call(notedApp, this.control);
			});
		},
		onValidNotedFinish: function (listener) {
			this.getControl().focusout(function (e) {
				var text = $(this).val();
				if ($.trim(text).length) {
					listener.call(notedApp, text, this.control);
				};
			})
		},
		onEditingFinish:function (listener) {
			this.getControl().focusout(function (e) {
				listener.call(notedApp, this);
			});
		},
		onCancel:function (listener) {
			notedApp.getControl(notedApp.controls.CANCEL_NOTE_BUTTON).click(function (e) {
				listener.call(notedApp, this);
			})
		}
	},
	showNotification:function (message, timeout, title) {
	 	if (Notification.permission !== "granted"){
          Notification.requestPermission();
    	}
    	else {
	        var notification = new Notification(title || 'Noted alert', {
		          icon: 'resources/logo.png',
		          body: message,
	        });

	        setTimeout(function () {
	          notification.close();
	        }, timeout || 5000);
    	}
    }

}


$(document).ready(function () {

	
	notedApp.service.getNotes(function (notes) {
		notedApp.savedNotesList.fill(notes);	
	});

	notedApp.editor.onWriting(function (e) {
		if ($.trim($(e.delegateTarget).val()).length) {
			this.enableControl(this.controls.SAVING_INDICATOR_LABEL, this.controls.CANCEL_NOTE_BUTTON);
		}
		else{
			this.disableControl(this.controls.SAVING_INDICATOR_LABEL, this.controls.CANCEL_NOTE_BUTTON);	
		}
	});

	notedApp.editor.onSave(function (app) {
		var note = this.editor.getNote();
		if (note.length) {

			if (this.editor.state.editing) {
				this.service.updateNote(this.editor.state.index, note);
				this.showNotification("Noted updated!");
				this.disableControl(notedApp.controls.SAVING_INDICATOR_LABEL,notedApp.controls.CANCEL_NOTE_BUTTON);
				this.editor.state.editing = false;
				this.editor.clear();
				this.service.getNotes(function (notes) {
					notedApp.savedNotesList.fill(notes);
				})
				
			}
			else{
				this.app.service.addNote(note);
				this.disableControl(notedApp.controls.SAVING_INDICATOR_LABEL,notedApp.controls.CANCEL_NOTE_BUTTON);
				this.showNotification("Noted added!");
				this.editing.clear();
			}
		}
	});

	notedApp.editor.onCancel(function () {
		this.editor.getControl().val("");
		this.editor.getControl().focus();
		this.disableControl(this.controls.CANCEL_NOTE_BUTTON, this.controls.SAVING_INDICATOR_LABEL);
	});
});


function prepareNotesForView(note) {
	return note.substring(0,10) + '...';
}

function renderNoteOnEditor () {
	var $note = $(this);
	var index = $note.data("index");

	if (index > note.getNotes().length) {
		var noteText = note.getNotes()[index];
		$textAreaEditor.val(noteText);
	}
}

function displayMessage (message, timeout , click) {
	
   
}