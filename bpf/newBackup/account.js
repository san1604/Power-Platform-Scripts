var SB1 = SB1 || {};
SB1.Account = (function () {
    "use strict";

    function showIntegrationMessage(executionContext) {
        var formContext = executionContext.getFormContext();

        // Field logical name
        var messageField = formContext.getAttribute("sb1_newaccountintegrationmessage");

        if (messageField) {
            var message = messageField.getValue();

            // Show popup only if field has a value
            if (message && message.trim() !== "") {

                // Default title
                var dialogTitle = "Message";

                // Set title based on message text
                if (message.includes("Account created successfully")) {
                    dialogTitle = "New Account";
                } 
                else if (message.includes("Account updated successfully")) {
                    dialogTitle = "Account Update";
                }

                Xrm.Navigation.openAlertDialog({
                    title: dialogTitle,
                    text: message
                }).then(
                    function () {
                        // Clear the field after OK
                        messageField.setValue("");
                        messageField.setSubmitMode("always"); // ensure save
                        formContext.data.entity.save(); // optional auto save
                    },
                    function (error) {
                        console.log("Dialog closed or error:", error);
                    }
                );
            }
        }
    }

    return {
        showIntegrationMessage: showIntegrationMessage
    };

})();
