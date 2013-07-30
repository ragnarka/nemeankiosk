/**
 * Created with JetBrains PhpStorm.
 * User: Ragnar
 * Date: 30.07.13
 * Time: 21:31
 * To change this template use File | Settings | File Templates.
 */
(function (Meteor, $) {

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
        console.log(barcode);
        if (barcode == "1234")
        {
            console.log('Jaaa');
            Session.set('loggedIn', true);
        }
    }

    Template.login.rendered = function() {
        login();
    }

}(Meteor, $));