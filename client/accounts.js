/**
 * Created with JetBrains PhpStorm.
 * User: Ragnar
 * Date: 31.07.13
 * Time: 13:05
 * To change this template use File | Settings | File Templates.
 */
(function (Meteor) {

    /**
     * Custom made login method to be used with scanner input
     *
     * @param barcode
     * @param callback
     */
    Meteor.loginWithScanner = function(barcode, callback) {
        Accounts.callLoginMethod({
            methodArguments: [{barcode: barcode}],
            userCallback: callback
        });
    }

    Deps.autorun(function() {
        Meteor.subscribe('users');
    });

}(Meteor));