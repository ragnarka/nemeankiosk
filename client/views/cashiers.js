/**
 * Created with JetBrains PhpStorm.
 * User: Ragnar
 * Date: 6/9/13
 * Time: 2:06 PM
 * To change this template use File | Settings | File Templates.
 */
(function (Meteor) {

    Template.cashiers.helpers({
        /**
         * Fetch all cashiers
         * @returns {*}
         */
        cashiers: function(){
            return Meteor.users.find().fetch();
        },

        /** Decides wheter to show edit or display row **/
        'isEdited': function(id) {
            return (Session.get('editCashierId') == id);
        },

        /** Decides whether to show add cashier form or not **/
        'addCashier': function() {
            return Session.get('newCashier');
        }
    });

    Template.cashiers.events({
        /** Set cashier row to edit mode **/
        'dblclick tr': function(event, template) {
            Session.set('editCashierId', event.currentTarget.getAttribute('id'));
        },

        /** Delete a cashier **/
        'click a.delete': function(event, template) {
            var id = event.currentTarget.getAttribute('id');
            if (id == Meteor.userId())
            {
                alert('Du prøver å slette deg selv!');
            }
            else
            {
                Meteor.users.remove(id);
            }
            event.preventDefault();
        },

        /** View add cashier form **/
        'click #addC': function(event, template) {
            Session.set('newCashier', true);
        },

        /** Hide add cashier form **/
        'click #cancelAddCashier': function(event, template) {
            Session.set('newCashier', false);
        },

        /** Update cashier field **/
        'blur input': function(event, template) {
            var elm = event.currentTarget;
            var id = elm.parentNode.parentNode.getAttribute('id');
            var field = elm.getAttribute('name');
            var value = elm.value;
            if (value != '')
            {
                updateCashier(id, field, value);
            }
        }
    });

    Template.addCashier.events({
        /**
         * Adds a new cashier
         *
         * @param event
         * @param template
         */
        'submit': function(event, template) {
            formData = {
                name : cName.value,
                barcode : barcode.value,
                username : username.value,
                password : password.value
            };
            var existsCashier = existsCashier(formData.barcode, formData.username);
            if (!existsCashier)
            {
                var options = {
                    username : formData.username,
                    email : formData.email,
                    password : formData.password,
                    profile : {
                        name : formData.name,
                        barcode : formData.barcode
                    }
                };
                Accounts.createUser(options);
                Session.set('newCashier', false);
            }
            else
            {
                console.log('User already exists!');
            }
            event.preventDefault();
        }
    });

    /**
     * existsCashier
     *
     * Check whether one cashier exists
     *
     * @param barcode
     * @param username
     * @returns {boolean}
     */
    function existsCashier(barcode, username) {
        var isBarcode = (Meteor.users.findOne({"profile.barcode":barcode}) == null) ? false : true;
        var isUsername = (Meteor.users.findOne({username: username}) == null) ? false : true;
        var retVal = (isBarcode || isUsername);
        return retVal;
    }

    /**
     * findCashierById
     *
     * Find one cashier
     *
     * @param id
     * @returns Meteor.user
     */
    function findCashierById(id) {
        return Meteor.users.findOne({_id : id});
    }

    /**
     * updateCashier
     *
     * Update one field in a cahsiers document
     *
     * @param id
     * @param field
     * @param value
     */
    function updateCashier(id, field, value) {
        var data = {};
        data[field] = value;
        Meteor.users.update({_id:id}, {$set:data});
    }

}(Meteor));
