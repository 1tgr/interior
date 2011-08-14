function(doc) {
    var value = {
        _id: doc._id,
        _rev: doc._rev,
        title: doc.title,
        createTime: doc.createTime,
        lastUpdateTime: doc.lastUpdateTime,
        attachments: []
    };

    for (var id in doc._attachments) {
        var attachment = {
            id: id,
            contentType: doc._attachments[id].content_type,
            length: doc._attachments[id].length
        };

        value.attachments.push(attachment);
    }

    if (doc.type === "Plan") {
        value.notes = [ ];
        emit(doc._id, value);
    } else if (doc.type === "Note") {
        value.link = doc.link;
        value.text = doc.text;
        emit(doc.planId, { notes: [ value ] });
    }
}
