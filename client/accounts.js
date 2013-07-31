/**
 * Created with JetBrains PhpStorm.
 * User: Ragnar
 * Date: 31.07.13
 * Time: 13:05
 * To change this template use File | Settings | File Templates.
 */

    Meteor.loginWithScanner = function(barcode, callback) {
        Accounts.callLoginMethod({
            methodArguments: [{barcode: barcode}],
            userCallback: callback
        });
    }