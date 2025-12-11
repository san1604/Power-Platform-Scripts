function autoFillSingleField(executionContext) {
    const formContext = executionContext.getFormContext();

    // Get the Account lookup value
    const accountLookup = formContext.getAttribute("cms_accountid").getValue(); // <-- replace with your field name
    if (!accountLookup) return;

    const accountId = accountLookup[0].id.replace("{", "").replace("}", "");

    // Retrieve the Account field you want
    Xrm.WebApi.retrieveRecord("account", accountId, "?$select=Name")  // <-- replace with your source field
        .then(function (result) {
            // Set the target Contract field
            formContext.getAttribute("cms_accountid").setValue(result.Name); // <-- your target field
        })
        .catch(function (error) {
            console.error(error);
        });
}
                                                        