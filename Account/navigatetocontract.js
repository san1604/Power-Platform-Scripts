function createContractFromAccount(primaryControl) {
    var formContext = primaryControl;

    // var accountId = formContext.data.entity.getId().replace(/[{}]/g, "");
    var accountName = formContext.getAttribute("name").getValue();

    var entityFormOptions = {
        entityName: "cms_contract",
        useQuickCreateForm: false
    };

    // Pass raw values only (NO odata.bind)
    var formParameters = {};
    // formParameters.accountId = accountId;
    formParameters.accountName = accountName;

    Xrm.Navigation.openForm(entityFormOptions, formParameters);
}
