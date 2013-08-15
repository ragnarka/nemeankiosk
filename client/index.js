var notify, removeNotice;

(function (Meteor) {
	
	Meteor.startup(function() {
		console.log("Nemean Kiosk is running at client!");
	});

	Meteor.Router.add({
		"/": "start",
		"/cart": "cart",
        "/products": "products",
        "/cashiers": "cashiers",
        "/cashiers/add": "addCashier",
        "/sales": "sales",
        "/stats": "stats"
	});


    Template.index.helpers({
        /**
         * Name of logged in user to be displayed in view
         * @returns {*}
         */
        'displayName': function() {
            return (Meteor.userId() && Meteor.user() && Meteor.user().profile) ? Meteor.user().profile.name : '';
        },

        /**
         * Are the logged in user a superuser?
         * @returns {Boolean}
         */
        'isSuperuser': function() {
            return Roles.userIsInRole(Meteor.user(), ['Superbruker']);
        },

        /** Decided whether to show a displayMessage **/
        'displayMessage': function() {
            return Session.get('displayMessage');
        },

        /** Type of displayMessage **/
        'type': function() {
            return Session.get('type');
        },

        /** Message of displayMessage **/
        'message': function() {
            return Session.get('message');
        },

        /** Title of displayMessage **/
        'title': function() {
            return Session.get('title');
        }
    });

    Template.index.events({
        /** Hide displayMessage from view **/
        'click .close': function(event, template) {
            removeNotice();
        }
    });


    /**
     * Display a message to the user
     *
     * @param title
     * @param message
     * @param type
     */
    notify = function(title, message, type)
    {
        Session.set('displayMessage', true);
        Session.set('type', type);
        Session.set('title', title);
        Session.set('message', message);
    }

    /**
     * Remove the displayed message
     */
    removeNotice = function() {
        Session.set('displayMessage', false);
        Session.set('type', null);
        Session.set('message', null);
        Session.set('title', null);
    }


}(Meteor));