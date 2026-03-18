/**
 * Call Custom API: sb1_reject_quote_sync_with_b1
 * @param {string} folderVersionId
 * @param {string} guid
 */
function callRejectQuoteSyncWithB1(folderVersionId, guid) {

    // Basic validation
    if (!folderVersionId || !guid) {
        Xrm.Navigation.openAlertDialog({
            title: "Missing Data",
            text: "folderVersionId and guid are required."
        });
        return;
    }

    Xrm.Utility.showProgressIndicator("Syncing quote rejection with B1...");

    var request = {
        folderVersionId: folderVersionId,
        guid: guid,

        getMetadata: function () {
            return {
                boundParameter: null, // Unbound Custom API
                parameterTypes: {
                    folderVersionId: {
                        typeName: "Edm.String",
                        structuralProperty: 1 // Primitive type
                    },
                    guid: {
                        typeName: "Edm.String",
                        structuralProperty: 1
                    }
                },
                operationType: 0, // Action
                operationName: "sb1_reject_quote_sync_with_b1"
            };
        }
    };

    Xrm.WebApi.online.execute(request)
        .then(function (response) {
            if (!response.ok) {
                throw new Error("Custom API call failed.");
            }
            return response.json();
        })
        .then(function (result) {
            Xrm.Utility.closeProgressIndicator();

            console.log("Custom API response:", result);

            Xrm.Navigation.openAlertDialog({
                title: "Success",
                text: "Quote rejection synced successfully with B1."
            });
        })
        .catch(function (error) {
            Xrm.Utility.closeProgressIndicator();

            console.error("Custom API error:", error);

            Xrm.Navigation.openAlertDialog({
                title: "Error",
                text: error.message || "Failed to sync quote rejection."
            });
        });
}
