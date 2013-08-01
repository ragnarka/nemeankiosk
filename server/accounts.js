(function (Meteor) {

    /**
     * Benyttes hvis man vil hente inn info fra ekstern tjeneste når en
     * bruker opprettes. F.eks: Facebook info.
     */
    /**Accounts.onCreateUser(function(options,user){

        //user.profile = {name: 'James Bond'};

        return user;
    });**/

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