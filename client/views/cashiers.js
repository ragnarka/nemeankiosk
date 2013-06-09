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
            Meteor.call('getCashiers', function(errors, result) {
                Session.set('cashiers', result);
            });
            return Session.get("cashiers");
        }
    });
}(Meteor));
