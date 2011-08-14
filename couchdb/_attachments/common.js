var db = $.couch.db("interior");
var subscribe;

$(function () {
    var promise, lastSeq;

    subscribe = function () {
        promise = db.changes(lastSeq);
        promise.onChange(function (resp) {
            promise.stop();
            promise = undefined;
            lastSeq = resp.last_seq;
            refresh();
        });
    };

    setTimeout(refresh, 1000);
});

