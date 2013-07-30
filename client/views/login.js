/**
 * Created with JetBrains PhpStorm.
 * User: Ragnar
 * Date: 30.07.13
 * Time: 21:31
 * To change this template use File | Settings | File Templates.
 */
(function (Meteor, $, _) {

    var barcode = '';
    function login() {
        $("body").keydown(function(event){
            event.preventDefault();
            if (!Session.get('loggedIn'))
            {
                var keyCode = (event.keyCode ? event.keyCode : event.which);
                if (keyCode == 13)
                {
                    /** Enter was pressed, check if user is valid and reset string **/
                    checkLogin(barcode);
                    barcode = '';
                    return;
                }
                /** Build barcode string **/
                barcode += String.fromCharCode(keyCode);
            }
        });
    }


    function checkLogin(barcode) {
        var cashier = findOneCashier(barcode);
        if (_.isObject(cashier))
        {
            Session.set('loggedIn', true);
            Session.set('user', cashier);
            Session.set('loginName', cashier.name);
        }
        else
        {
            console.log('Cashier was not found');
        }
    }

    function findOneCashier(barcode) {
        var cashier = _.find(Session.get('cashiers'), function(cashier) {
            if (cashier.strekkode == barcode) { return cashier; }
        });
        return cashier;
    }

    Template.login.rendered = function() {
        login();
    }

}(Meteor, $, _));