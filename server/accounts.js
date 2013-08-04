(function (Meteor) {

/**********************************************************************************************************************
 * Meteor startup method
 *********************************************************************************************************************/
    Meteor.startup(function(){
        if (Meteor.users.find().fetch().length === 0)
        {
            var id = Accounts.createUser({
                username: '007',
                email: '007@mi5.uk',
                password: '007',
                profile: {name: 'James Bond', barcode: '007'}
            });
            console.log(id);
            Roles.addUsersToRoles(id, ['Superbruker', 'Selger']);
        }

        /**
         * Only superuser can create new users
         */
        Accounts.validateNewUser(function(user) {
            var loggedInUser = Meteor.user();

            if (Roles.userIsInRole(loggedInUser, ['Superbruker']))
            {
                return true;
            }
            console.log('Ikke tillatelse til å utføre operasjon');
        });
    });




/**********************************************************************************************************************
 * Meteor publish
 *********************************************************************************************************************/
    /**
     * Only Superbruker needs to see all users
     */
    Meteor.publish("users", function(){
        var loggedInUser = Meteor.users.findOne({_id: this.userId});
        if (Roles.userIsInRole(loggedInUser, ['Superbruker']))
        {
            return Meteor.users.find({});
        }
    });




/**********************************************************************************************************************
 * Meteor methods
 *********************************************************************************************************************/

    Meteor.methods({
        /**
         * newAccount
         *
         * Client calls this method remotely to add a new user account
         *
         * @param options
         */
        'newAccount': function(options) {
            createNewAccount(options);
        }
    });

    Meteor.users.allow({
        /**
         * Let Superbruker update accounts, and the current logged in user can update on his account
         */
        update: function (userId, doc) {
            var loggedInUser = Meteor.users.findOne({_id: userId});
            if (Roles.userIsInRole(loggedInUser, ['Superbruker']))
            {
                console.log('Oppdaterer');
                return true;
            }
            console.log('Ikke tillatelse til å oppdatere');
        },

        /**
         * Let Superbruker delete accounts
         */
        remove: function (userId, doc) {
            var loggedInUser = Meteor.users.findOne({_id: userId});
            if (Roles.userIsInRole(loggedInUser, ['Superbruker']))
            {
                return true;
            }
            console.log('Ikke tillatelse til å utføre operasjon');
        }
    });




/**********************************************************************************************************************
 * Custom helper methods
 *********************************************************************************************************************/

    /**
     * createNewAccount
     *
     * Creates a new user account with a preset role 'Selger'
     *
     * @param options
     */
    function createNewAccount(options)
    {
        var id = Accounts.createUser(options);
        console.log('User created with id: ' + id);
        Roles.addUsersToRoles(id, ['Selger']);
    }




/**********************************************************************************************************************
 * Custom made login
 *********************************************************************************************************************/

    /**
     * Customized login method
     * This is used for scanner login
     */
    Accounts.registerLoginHandler(function(barcode) {
        if (!barcode.barcode)
        {
            return undefined;
        }
        var userId = null;
        /** Find a user based on barcode **/
        var user = Meteor.users.findOne({"profile.barcode": barcode.barcode});
        if (!user)
        {
            console.log('No user found');
            return null;
        }
        else
        {
            userId = user._id;
            console.log('User found');
        }
        var stampedToken = Accounts._generateStampedLoginToken();
        Meteor.users.update(userId, {$push: {'services.resume.loginTokens': stampedToken}});
        return {id: userId, token: stampedToken.token};
    });

}(Meteor));