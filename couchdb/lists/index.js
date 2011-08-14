function(head, req) {
    var row, data = [ ];
    start({ headers: { "Content-Type": "text/html" } });

    while (row = getRow()) {
        data.push(row);
    }    

    send(this.templates.index.replace("@@DATA@@", JSON.stringify(data)));
}
