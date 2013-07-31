/**
 * Created with JetBrains PhpStorm.
 * User: Ragnar
 * Date: 30.07.13
 * Time: 21:31
 * To change this template use File | Settings | File Templates.
 */
(function (Meteor, $, _) {

    var barcode = '';   /** Make sure barcode is an empty string **/

    /**
     * login
     *
     * Registers keydown events and builds a string until enter is pushed. When enter is pushed an attempt to find
     * a user is made. If a user is found, the user is logged in.
     *
     * @see checkLogin
     */
    //function login() {
    $(document).ready(function(){
        $("body").keydown(function(event){
            if (!Session.get('loggedIn'))
            {
                /** No user is logged in -> Check if ENTER was pressed **/
                var keyCode = (event.keyCode ? event.keyCode : event.which);
                if (keyCode == 13)
                {
                    /** Enter was pressed, check if user is valid and reset string **/
                    //checkLogin(barcode);
                    Meteor.loginWithScanner(barcode, function(err) {
                        if (err) {
                            console.log(err);
                        }
                        else
                        {
                            console.log('All ok with login');
                        }
                    });
                    barcode = '';
                    return;
                }
                else
                {
                    /** Build barcode string **/
                    barcode += String.fromCharCode(keyCode);
                }
            }
            else
            {
                /** User logged in -> Check if ESC was pressed **/
                var keyCode = (event.keyCode ? event.keyCode : event.which);
                if (keyCode == 27)
                {
                    /** ESC was pressed, log user out **/

                    return;
                }
                barcode = '';
            }
        });
    });
  //  }


    /**
     * checkLogin
     *
     * Check if a user has the specified barcode -> Log in the user who has it.
     * @param barcode
     */
    function checkLogin(barcode) {
        var cashier = findOneCashier(barcode);
        if (_.isObject(cashier))
        {

        }
        else
        {
            console.log('Cashier was not found');
        }
    }

    /**
     * findOneCashier
     *
     * Fetch one cashier from the Cashier collection
     * @param barcode
     * @returns {*}
     */
    function findOneCashier(barcode) {
        var cashier = _.find(Session.get('cashiers'), function(cashier) {
            if (cashier.strekkode == barcode) { return cashier; }
        });
        return cashier;
    }

    Template.login.rendered = function() {
       // login();
    }

}(Meteor, $, _));