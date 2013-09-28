/**
 * Created with JetBrains PhpStorm.
 * User: Ragnar
 * Date: 30.07.13
 * Time: 21:31
 * To change this template use File | Settings | File Templates.
 */
(function (Meteor) {

    var barcode = '';   /** Make sure barcode is an empty string **/

    if (Accounts._resetPasswordToken) {
        Session.set('isResetPassword', Accounts._resetPasswordToken);
    }

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
                    logout();
                    return;
                }
                barcode = '';
            }
        });
    });

    Template.login.helpers({
        /** Decided whether to show reset password form or not **/
        'isResetPassword': function() {
            return Session.get('isResetPassword');
        },

        /**
         * Decides whether to show login form or not
         *
         * @returns boolean
         */
        'oldSchoolLogin': function() {
            return Session.get('isFormLogin');
        },

        /**
         * Decides whether to show forgot password form or not
         *
         * @returns boolean
         */
        'forgotPassword': function() {
            return Session.get('isForgotPassword');
        }
    });

    Template.login.events({
        /** Show oldSchool login form **/
       'click #logInBtn': function(event, template) {
           Session.set('isFormLogin', true);
       }
    });


    Template.oldSchoolLogin.events({
        /** Show forgotten password form **/
        'click #forgotPasswordBtn': function(event, template) {
            event.preventDefault();
            Session.set('isForgotPassword', true);
            Session.set('isFormLogin', false);
        },

        /**
         * Triggers when enter is pushed in login form
         *
         * An attempt to login the user is made.
         *
         * @param event
         * @param template
         */
        'submit': function(event, template) {
            event.preventDefault();
            var formData = {username: username.value, password: password.value};
            console.log(formData);
            Meteor.loginWithPassword(formData.username, formData.password, function(err) {
                if (err) {
                    notify('Oh snap!', err.reason, 'alert-error');
                }
                else
                {
                    Session.set('isFormLogin', false);
                }
            });
        }
    });

    Template.forgotPassword.events({
        /** User has decided not to purse forgot password - hide form **/
        'click #cancelForgotBtn': function(event, template) {
            event.preventDefault();
            Session.set('isForgotPassword', false);
        },

        /**
         * forgotPassword
         *
         * User requests to change password, send email with resetToken.
         *
         * @param event
         * @param template
         */
        'submit': function(event, template) {
            event.preventDefault();
            var formData = {email: email.value};
            notify('Til informasjon', 'Funksjoen kan ikke testes før en ' +
                'eventuelt "deployer" applikasjonen', 'alert-info');
            /*
            Meteor.forgotPassword(formData, function(err) {
                if (err) {
                    console.log(err);
                }
                else
                {
                    Session.set('isForgotPassword', false);
                }
            });
            */
        }
    });

    Template.resetPassword.events({
        /** User does not want to reset password - hide form **/
       'click #cancelResetBtn': function(event, template) {
           event.preventDefault();
           Session.set('isResetPassword', false);
       },

        /** TODO: Complete resetPassword method with validation++ **/
        'submit': function(event, template) {
            event.preventDefault();
            Accounts.resetPassword(Session.get('isResetPassword'),
            password.value,function(err) {
                    if (err) {
                        console.log(err);
                    }
                    else
                    {
                        Session.set('resetPassword', null);
                    }
            });
        }
    });


    Template.index.events({
        /** User has clicked log out button - log user out **/
        'click #logOutBtn': function(event, template) {
            logout();
            event.preventDefault();
        }
    });

    /**
     * Log user out of the application
     */
    function logout() {
        Meteor.logout(function(err){
            if (err) {
                console.log(err);
            }
            else
            {
                Session.set('isFormLogin', false);
            }
        });
    }

}(Meteor));