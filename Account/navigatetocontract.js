function createContractFromAccount(primaryControl) {
    var formContext = primaryControl;

    var accountId = formContext.data.entity.getId().replace(/[{}]/g, "");
    var accountName = formContext.getAttribute("name").getValue();

    var entityFormOptions = {
        entityName: "cms_contract",
        useQuickCreateForm: false
    };

    // 👇 Lookup field parameters
    var formParameters = {};
    formParameters["cms_accountid"] = accountId;
    formParameters["cms_accountidname"] = accountName;
    formParameters["cms_accountidtype"] = "account";

    Xrm.Navigation.openForm(entityFormOptions, formParameters);
}
