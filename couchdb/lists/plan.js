function(head, req) {
    var row, doc = { };
    start({ headers: { "Content-Type": "text/html" } });

    if (row = getRow()) {
        doc = row;
    }    

    send(this.templates.plan.replace("@@DATA@@", JSON.stringify(doc)));
}
