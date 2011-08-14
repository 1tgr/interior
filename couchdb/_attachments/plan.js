function AttachmentViewModel(db, plan, data) {
    var t = this;
    ko.mapping.fromJS(data, {}, this);

    this.deleteAttachment = function() {
        db.removeAttachment({ _id: plan._id(), _rev: plan._rev() }, t.id());
    };
}

function NoteViewModel(db, plan, data) {
    var t = this;
    ko.mapping.fromJS(data, {}, this);

    this.hasLink = this.link !== undefined;
    this.hasText = this.text !== undefined;

    this.edit = function() {
        plan.editNote.note = t;
        plan.editNote.title(t.title());
        $("#editNoteDialog").dialog("open");
    };

    this.save = function() {
        var title = plan.editNote.title();
        db.openDoc(t._id(), {
            success: function(doc) {
                doc.title = title;
                db.saveDoc(doc, {
                    success: function() {
                        plan.editNote.title("");
                        plan.editNote.note = null;
                        $("#editNoteDialog").dialog("close");
                    }
                });    
            }
        });    
    }

    this.deleteNote = function() {
        db.removeDoc({ _id: t._id(), _rev: t._rev() });
    };
}

function ViewModel(db, data) {
    var t = this;
    var mapping = {
        attachments: {
            create: function(options) {
                return new AttachmentViewModel(db, t, options.data)
            },
            key: function(data) {
                return ko.utils.unwrapObservable(data.id)
            }
        },
        notes: {
            create: function(options) {
                return new NoteViewModel(db, t, options.data)
            },
            key: function(data) {
                return ko.utils.unwrapObservable(data._id)
            }
        }
    };

    ko.mapping.fromJS(data.value, mapping, this);

    this.uploading = ko.observable(false);
    this.uploadAttachment = function(form) {
        t.uploading(true),
        $(form).ajaxSubmit({
            url: db.uri + t._id(),
            complete: function() {
                t.uploading(false)
            }
        });    
    };

    var defaultLink = "http://";
    this.addLinkValue = ko.observable(defaultLink);
    this.addLink = function() {
        var value = t.addLinkValue();
        if (value !== defaultLink) {
            var noteId = $.couch.newUUID();
            var doc = {
                _id: "note." + noteId,
                type: "Note",
                noteId: noteId,
                planId: t._id(),
                title: value,
                link: value
            };

            db.saveDoc(doc, {
                success: function() { 
                    t.addLinkValue(defaultLink);
                }
            });
        }    
    };

    this.addTextValue = ko.observable("");
    this.addText = function() {
        var value = t.addTextValue();
        if (value !== "") {
            var noteId = $.couch.newUUID();
            var doc = {
                _id: "note." + noteId,
                type: "Note",
                noteId: noteId,
                planId: t._id(),
                title: "Text",
                text: value
            };

            db.saveDoc(doc, {
                success: function() { 
                    t.addTextValue("");
                }
            });
        }    
    };

    this.editPlan = {
        title: ko.observable("")
    };   

    this.editNote = {
        title: ko.observable(""),
        note: null,
        save: function() { t.editNote.note.save(); }
    };   

    this.edit = function() {
        t.editPlan.title(t.title());
        $("#editPlanDialog").dialog("open");
    };

    this.save = function() {
        var title = t.editPlan.title();
        db.openDoc(t._id(), {
            success: function(doc) {
                doc.title = title;
                db.saveDoc(doc, {
                    success: function() {
                        t.editPlan.title("");
                        $("#editPlanDialog").dialog("close");
                    }
                });    
            }
        });
    }

    this.deletePlan = function() {
        db.removeDoc({ _id: t._id(), _rev: t._rev() }, {
            success: function() {
                location.href = "../";
            }
        });    
    };
}

var viewModel = new ViewModel(db, data);

function apply(data) {
    ko.mapping.updateFromJS(viewModel, data.value);
}

function refresh() {
    var options = {
        key: data.key,
        success: function (resp) {
            subscribe();

            if (resp.rows.length > 0) {
                apply(resp.rows[0]);
            }    
        },
        error: subscribe
    };

    db.view("app/plan", options);
}

$(function () {
    ko.applyBindings(viewModel);
});
