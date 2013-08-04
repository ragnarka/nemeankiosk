(function (Meteor, $) {

    var barcode ="",
        ENTER = 13;

    function scan() {
        $("body").keypress(function (e){
            var keypressed = String.fromCharCode(e.keyCode);
            barcode += keypressed;

            if(e.keyCode === ENTER){
                alert(barcode);
                
                if(findProduct(barcode)){  // === PRODUCT_BARCODE
                // Add product to basket here!
                    resetBarcode();
                }

                if(findCashier(barcode))  {// === CASHIER_BARCODE
                // Make sale for Cashier
                    resetBarcode();
                }
            }
        });
    }

    function findProduct(barcode) {
        return null;
    }

    function findCashier(barcode) {
        return null;
    }
    
    function resetBarcode() {
        barcode = "";
    }

    Template.cart.rendered = function () {
        scan();
    }

}(Meteor, $));