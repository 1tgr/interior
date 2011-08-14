function PlanViewModel(data) {
    ko.mapping.fromJS(data, {}, this);
}

function fromView(view) {
    return {
        plans: $.map(view, function(row) {
            return row.value;
        })
    };    
}

function ViewModel(db, data) {
    var t = this;
    var mapping = {
        plans: {
            create: function(options) {
                return new PlanViewModel(options.data)
            },
            key: function(data) {
                return ko.utils.unwrapObservable(data._id)
            }
        }
    };

    ko.mapping.fromJS(fromView(data), mapping, this);

    this.addPlanEnabled = ko.observable(true);
    this.addPlanTitle = ko.observable("");
    this.addPlan = function() {
        var planId = $.couch.newUUID();
        t.addPlanEnabled(false);
        db.saveDoc({
            _id: "plan." + planId,
            type: "Plan",
            planId: planId,
            title: t.addPlanTitle()
        }, {
            success: function() {
                t.addPlanTitle("");
                t.addPlanEnabled(true);
            },
            error: function() {
                t.addPlanEnabled(true);
            }
        });
    }
}

var viewModel = new ViewModel(db, data);

function apply(data) {
    ko.mapping.updateFromJS(viewModel, fromView(data));
}

function refresh() {
    var options = {
        group: true,
        success: function (resp) {
            subscribe();
            apply(resp.rows);
        },
        error: subscribe
    };

    db.view("app/plan", options);
}

$(function () {
    apply(data);
    ko.applyBindings(viewModel);
});
