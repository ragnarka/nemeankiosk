(function (Meteor) {

/**********************************************************************************************************************
 * Meteor startup method
 */
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
            Roles.addUsersToRoles(id, ['Superbruker']);
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
 */
    Meteor.publish("users", function(){
        return Meteor.users.find();
    });

    Meteor.users.allow({
        /** Let users delete accounts
         *  Modify later so that only Superbruker can delete
         * **/
        update: function (userId, doc) {
            // Add check for user is in role Superbruker
            return true;
        },
        /** Let users delete accounts
         *  Modify later so that only Superbruker can delete
         * **/
        remove: function (userId, doc) {
            // Add check for user is in role Superbruker
            return true;
        }
    });

    /**
     * Benyttes hvis man vil hente inn info fra ekstern tjeneste når en
     * bruker opprettes. F.eks: Facebook info.
     */
    /**Accounts.onCreateUser(function(options,user){

        //user.profile = {name: 'James Bond'};

        return user;
    });**/



/**********************************************************************************************************************
 * Custom made login
 */

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