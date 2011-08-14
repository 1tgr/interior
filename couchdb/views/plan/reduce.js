function(keys, values, rereduce) {
    var acc = values[0];

    for (i = 1; i < values.length; i++) {
        var value = values[i];
        for (var key in value) {
            if (key === "notes" || key === "attachments") {
                acc[key] = acc[key].concat(value[key]);
            } else if (acc.hasOwnProperty(key)) {
                acc[key] = null;
            } else {    
                acc[key] = value[key];
            }
        }
    }

    return acc;
}
