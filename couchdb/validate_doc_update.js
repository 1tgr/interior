function(newDoc, oldDoc, userCtx) {
    function required(field, message /* optional */) {
        message = message || "Document must have a " + field;
        if (!newDoc[field])
            throw({forbidden : message});
    }

    function unchanged(field) {
        if (oldDoc && toJSON(oldDoc[field]) != toJSON(newDoc[field]))
            throw({forbidden : "Field can't be changed: " + field});
    }

    if (newDoc._deleted) {
        return;
    }

    required("type");
    unchanged("type");

    switch (newDoc.type) {
        case "Plan":
            unchanged("planId");
            required("title");
            break;

        case "Note":
            unchanged("noteId");
            required("title");
            break;
    }
}
