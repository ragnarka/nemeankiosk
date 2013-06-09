/**
 * Created with JetBrains PhpStorm.
 * User: Ragnar
 * Date: 6/9/13
 * Time: 1:28 AM
 * To change this template use File | Settings | File Templates.
 */
(function (Meteor) {

Template.front.events = {
    /**
     * Handling click events on buttons in front.
     */
    'click .btn': function(e) {
        Meteor.Router.to(e.getAttribute("href"));
        e.preventDefault();
    }
}
}(Meteor));