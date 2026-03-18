var SB1 = SB1 || {};
SB1.QuoteProducts = (function () {
    "use strict";

    function openProductSearchPage(primaryControl) {
        debugger;
        try {
            var quoteId = primaryControl.data.entity.getId();
            quoteId = quoteId.replace(/[{}]/g, ""); // remove {}
            console.log("Quote ID: ", quoteId);
            var tab = primaryControl.ui.tabs.get("tab_productnamepage");

            if (tab) {
                tab.setVisible(false);
            }
            
            var pageInput = {
                pageType: "custom",
                name: "sb1_productsearchpage_a963f", // Canvas Page logical name
                entityName: "quote",
                recordId: quoteId,
                pageInputParams: { recordId: quoteId }
            };

            var navigationOptions = {
                target: 2, // open as dialog
                position: 1,
                width: { value: 80, unit: "%" },
                height: { value: 80, unit: "%" },
                hideNavBar: true,
                title: "Add Products"
            };

            Xrm.Navigation.navigateTo(pageInput, navigationOptions)
                .then(function (result) {
                    debugger;

                    if (tab) {
                        tab.setVisible(true);
                        tab.setFocus();

                    }
                    primaryControl.data.refresh();

                });

        } catch (e) {
            console.error("Exception:", e);
        }
    }

    return {
        openProductSearchPage: openProductSearchPage
    };
})();