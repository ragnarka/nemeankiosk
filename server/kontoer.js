
    /*Accounts.onCreateUser(function(options,user){


        return user;
    }); */

    Accounts.registerLoginHandler(function(barcode) {
        if (!barcode.barcode)
        {
            return undefined;
        }
        var userId = null;
        var user = Meteor.users.findOne({password: barcode.barcode});
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
        Meteor.users.update(userId, {$push: {'service.resume.loginTokens': stampedToken}});
        return {id: userId, name:user.email, token: stampedToken.token};
    });