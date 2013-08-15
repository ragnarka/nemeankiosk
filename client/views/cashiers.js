(function (Meteor, _) {





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
        },

        /**
         * Are the logged in user a superuser?
         * @returns {Boolean}
         */
        'isSuperuser': function() {
            return Roles.userIsInRole(Meteor.user(), ['Superbruker']);
        },

        'displayMenu': function() {
            return !(Session.get('hideMenu'));
        },

        'importCashiers': function() {
            return Session.get('importCashiers');
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
            Session.set('hideMenu', true);
        },

        /** Hide add cashier form **/
        'click #cancelAddCashier': function(event, template) {
            Session.set('newCashier', false);
            Session.set('hideMenu', false);
        },

        'click #importCashiersBtn': function(event, template) {
            Session.set('importCashiers', true);
            Session.set('hideMenu', true);
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
                password : password.value,
                email : email.value
            };

            /** Validation to be added **/

            var exists = existsCashier(formData.barcode,
                formData.username, formData.email);

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


    Template.importCashiers.rendered = function() {
        document.getElementById('file').addEventListener('change', handleFile, false);
    }

    Template.importCashiers.helpers({
       'users': function() {
            return Session.get('users');
       },

        'isWarning': function() {
            return Session.get('warning');
        }
    });

    Template.importCashiers.events({
        'click #saveAccountsBtn': function() {
            createAccounts(Session.get('users'));
        },

        'click #cancelImportCashiersBtn': function() {
            Session.set('users', {});
            Session.set('importCashiers', false);
            Session.set('hideMenu', false);
            Session.set('warning', false);
        }
    });



/*******************************************************************************
 * Custom helper methods
 ******************************************************************************/

    /**
     * existsCashier
     *
     * Check whether one cashier exists
     *
     * @param barcode
     * @param username
     * @returns {boolean}
     */
    function existsCashier(barcode, username, email) {
        var isBarcode = (Meteor.users.findOne({"profile.barcode":barcode}) == null) ? false : true;
        var isUsername = (Meteor.users.findOne({username: username}) == null) ? false : true;
        var isEmail = (Meteor.users.findOne({email: email}) == null) ? false : true;
        var retVal = (isBarcode || isUsername || isEmail);
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


    function handleFile(event) {
        var f = event.target.files[0];
        var reader = new FileReader();
        if (f)
        {
            reader.readAsText(f);
            switch (f.type) {
                case 'application/vnd.ms-excel':
                    reader.onload = loadedCSV;
                    break;

                default:
                    Session.set('users', {});
                    break;
            }

        };
        var output = [];

        output.push('<li>', f.type, '</li>');

        document.getElementById('fileView').innerHTML = '<ul>' + output.join('') +
            '</ul>';
    }




    function loadedCSV (event) {
        event.stopPropagation();
        event.preventDefault();
        var fileData = event.target.result;
        var users = $.csv.toObjects(fileData);
        var valid = [];
        // Add valid user entries to a tmp array
        _.each(users, function(u) {
           if (u.name && u.email && u.username && u.password) {
               u.barcode = (u.barcode != '') ? u.barcode : '';
               if (!existsCashier(u.barcode, u.username, u.email))
               {
                    u.class = 'success';
                   u.ok = true;
               }
               else
               {
                   u.class = 'error';
                   u.error = 'Kontoen finnes allerede';
               }
           }
            else
           {
               u.class = 'error';
               u.error = 'Ufullstendig kontoinformasjon';
           }
        });

        Session.set('users', users);

        if (valid.length == users.length)
        {
            Session.set('warning', false);
        }
        else
        {
            Session.set('warning', true);
        }

        // createAccounts(users);
    };

    function createAccounts(users) {
        Meteor.call('createAccountsFromImports', users, function (err) {
            if (err)
            {
                console.log(err);
            }
            else
            {
                Session.set('warning', false);
                Session.set('users', {});
                Session.set('importCashiers', false);
                Session.set('hideMenu', false);
            }
        });
    }

}(Meteor, _));
