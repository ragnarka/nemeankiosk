( function(Meteor, $, _) {
        
        collection = new Meteor.Collection("orders")

        Meteor.autorun(function() {
            Meteor.subscribe("orders");       
        });
        
        function getCashier(barcode) {
            var cashier = Meteor.users.findOne({"profile.barcode" : barcode});
            console.log(cashier);
            if (cashier) {
                return cashier.profile;
            }
            return null;
        }

        Template.orders.events({
            // Remove product from cart (GUI)
            'click .expand' : function() {
                
            }
        });
        
        Template.orders.numberOfOrders = function() {
            return collection.find().count();
        }

        Template.orders.orders = function() {
            return collection.find({}, {sort: {date: -1}}).fetch();
        }
        
        Template.orders.cashier = function() {
            console.log(this);
            var barcode = this.cashier,
                cashier = getCashier(barcode);
                
            return (cashier == null) ? "Slettet selger" : cashier.name;
        }
        
        Template.orders.date = function() {
            var d = this.date;
            return d.toLocaleString();
        }
        
        Template.orders.total = function() {
            var total = 0;
            _.each(this.cart, function(product) {
                total += (product.price * product.amount);
            });
            return total;
        }

    }(Meteor, $, _));