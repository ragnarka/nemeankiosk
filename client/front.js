/**
 * Created with JetBrains PhpStorm.
 * User: Ragnar
 * Date: 6/9/13
 * Time: 1:28 AM
 * To change this template use File | Settings | File Templates.
 */

Template.front.events = {
    'click .btn': function() {
        Meteor.Router.to("/cart");
    }
}
