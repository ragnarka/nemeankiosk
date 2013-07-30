(function (Meteor, $) {

    //Insert code here
    var barcode ="",
        ENTER = 13;

    function scan() {
        $("body").keypress(function (e){
            var keypressed = String.fromCharCode(e.charCode);
            barcode += keypressed;

            if(e.keyCode === ENTER){
                alert(barcode);
                
                if(findProduct(barcode)){  // === PRODUCT_BARCODE
                // Add product to basket here!
                    barcode = "";
                }

                if(findCashier(barcode))  // === CASHIER_BARCODE
                // Make sale for Cashier
                    barcode = "";
                }
            });
    }

    function findProduct(barcode) {
        return null;
    }

    function findCashier(barcode) {
        return null;
    }

    Template.cart.rendered = function () {
        scan();
    }

}(Meteor, $));