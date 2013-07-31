/**
 * Created with JetBrains PhpStorm.
 * User: Ragnar
 * Date: 6/9/13
 * Time: 2:06 PM
 * To change this template use File | Settings | File Templates.
 */
(function (Meteor) {

    //Insert code here
    Template.cashiers.helpers({

        /**
         * Fetch one cashier
         * @returns {*}
         */
        cashier: function() {
            //return Cashiers.findOne(Session.get('selectedCashierId'));
        },

        /**
         * Fetch all cashiers
         * @returns {*}
         */
        cashiers: function(){
            return Session.get("cashiers");
        },

        'isEdited': function(id) {
            return Session.get('editCashierId') == id;
        }
    });

    Template.cashiers.events({
        'dblclick tr': function(event, template) {
            Session.set('editCashierId', event.currentTarget.getAttribute('id'));
        },
        'click a.delete': function(event, template) {
            var barcode = event.currentTarget.getAttribute('id');
            var cashier = findOneCashier(barcode);
            serverCall('removeCashier', cashier);
            event.preventDefault();
        }
    });

    Template.addCashier.events({
        'submit': function(event, template) {
            formData = {name : cName.value, strekkode : strekkode.value};
           serverCall('addCashier', formData, function() {
                Meteor.Router.to('/cashiers');
            });
            event.preventDefault();
        }
    });


    /**
     * findOneCashier
     *
     * Fetch one cashier from the Cashier collection
     * @param barcode
     * @returns {*}
     */
    function findOneCashier(barcode) {
        var cashier = _.find(Session.get('cashiers'), function(cashier) {
            if (cashier.strekkode == barcode) { return cashier; }
        });
        return cashier;
    }

    /**
     * serverCall
     *
     * Perform operations on Cashiers collection on server.
     *
     * @param method
     * @param data
     * @param callback
     */
    function serverCall(method, data, callback) {
        Meteor.call(method, data, function(errors, result) {
            refresh();
            if (_.isFunction(callback))
            {
                callback();
            }
        });
    }

    /**
     * refresh
     *
     * Get Cashiers collection from server and update client.
     */
    function refresh() {
        Meteor.call('getCashiers', function(errors, result) {
            Session.set('cashiers', result);
        });
    }
}(Meteor));
