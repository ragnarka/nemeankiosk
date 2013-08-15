(function (Meteor) {

/*******************************************************************************
 * Meteor startup method
 ******************************************************************************/
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




/*******************************************************************************
 * Meteor publish
 ******************************************************************************/
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




/*******************************************************************************
 * Meteor methods
 ******************************************************************************/

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
        },

        'createAccountsFromImports': function(obj) {
            _.each(obj, function(u) {
                if (u.name && u.email&& u.username && u.password) {
                    u.barcode = (u.barcode != '') ? u.barcode : '';
                    var options = {
                        username : u.username,
                        email : u.email,
                        password : u.password,
                        profile : {
                            name : u.name,
                            barcode : u.barcode
                        }
                    };
                    //var e = existsCashier(u.barcode, u.username);
                    //console.log(e + ' ' + u.ID);

                    if (!existsCashier(u.barcode, u.username, u.email))
                    {
                        createNewAccount(options);
                    }
                    else
                    {
                        console.log('Omitting... User with ID: ' + u.ID + ' already exists');
                    }
                }
                else
                {
                    console.log('Invalid user data for user with ID: ' + u.ID);
                }
            })
        }
    });

    Meteor.users.allow({
        /**
         * Let Superbruker update accounts, and the current logged in user can
         * update on his account
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




/*******************************************************************************
 * Custom helper methods
 ******************************************************************************/

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




/*******************************************************************************
 * Custom made login
 ******************************************************************************/

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
        Meteor.users.update(userId,
            {$push: {'services.resume.loginTokens': stampedToken}});
        return {id: userId, token: stampedToken.token};
    });

}(Meteor));