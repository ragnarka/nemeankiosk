/**
 * Created with JetBrains PhpStorm.
 * User: Ragnar
 * Date: 30.07.13
 * Time: 21:31
 * To change this template use File | Settings | File Templates.
 */
(function (Meteor) {

    var barcode = '';   /** Make sure barcode is an empty string **/

    /**
     * login
     *
     * Registers keydown events and builds a string until enter is pushed. When enter is pushed an attempt to find
     * a user is made. If a user is found, the user is logged in.
     *
     */
    $(document).ready(function(){
        $("body").keydown(function(event){
            if (!Session.get('isFormLogin') && !Meteor.user())
            {
                /** No user is logged in -> Check if ENTER was pressed **/
                var keyCode = (event.keyCode ? event.keyCode : event.which);
                if (keyCode == 13)
                {
                    /** Enter was pressed, check if user is valid and reset string **/
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
                    Meteor.logout(function(err){
                        if (err) {
                            console.log(err);
                        }
                        else
                        {
                            Session.set('isFormLogin', false);
                        }
                    })
                    return;
                }
                barcode = '';
            }
        });
    });

    /**
     * Decides whether to show login form or not
     *
     * @returns boolean
     */
    Template.login.oldSchoolLogin = function() {
        return Session.get('isFormLogin');
    }


    Template.login.events({
       'click #logInBtn': function(event, template) {
           Session.set('isFormLogin', true);
       },

        /**
         * Triggers when enter is pushed in login form
         *
         * @param event
         * @param template
         */
       'submit': function(event, template) {
           var formData = {username: username.value, password: password.value};
           Meteor.loginWithPassword(formData.username, formData.password, function(err) {
               if (err) {
                   console.log(err);
               }
               else
               {
                   Session.set('isFormLogin', false);
               }
           });
           event.preventDefault();
       }
    });

}(Meteor));