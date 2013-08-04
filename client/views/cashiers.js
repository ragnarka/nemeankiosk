(function (Meteor) {

    /**
     * Are the logged in user a superuser?
     * @returns {Boolean}
     */
    Template.cashiers.isSuperuser = function() {
        return Roles.userIsInRole(Meteor.user(), ['Superbruker']);
    }

    Template.displayCashier.isSuperuser = function() {
        return Roles.userIsInRole(Meteor.user(), ['Superbruker']);
    }

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

            /** Validation to be added **/

            var exists = existsCashier(formData.barcode, formData.username);

            if (!exists)
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
                Meteor.call('newAccount', options, function(err) {
                    if (err)
                    {
                        console.log(err);
                    }
                    else
                    {
                        console.log('User created');
                    }
                });
                Session.set('newCashier', false);
            }
            else
            {
                console.log('User already exists!');
            }
            event.preventDefault();
        }
    });




/**********************************************************************************************************************
 * Custom helper methods
 *********************************************************************************************************************/

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
        console.log('2.1');
        var isBarcode = (Meteor.users.findOne({"profile.barcode":barcode}) == null) ? false : true;
        console.log('2.2');
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

    /** TODO: Complete this method **/
    function validate(options)
    {
        if (!_.isArray(options))
        {
            return false;
        }

        _.each(options, function(elm){
           if (_.isEmpty(elm)) {
               return false;
           }
        });
        return true;
    }

}(Meteor));
