function setPrefilledAccount(executionContext) {
    var formContext = executionContext.getFormContext();

    // Read parameters passed from parent form
    var params = formContext.getAttribute("accountId") ? null : Xrm.Utility.getPageContext().input;

    if (!params || !params.accountId) return;

    var accountId = params.accountId.replace(/[{}]/g, "");
    var accountName = params.accountName;

    // Set the lookup value
    var lookup = [{
        id: accountId,
        name: accountName,
        entityType: "account"
    }];

    formContext.getAttribute("cms_accountid").setValue(lookup);
    formContext.getAttribute("cms_accountid").setSubmitMode("always");
}
