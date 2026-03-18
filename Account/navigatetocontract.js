function createContractAndMoveBPF(primaryControl) {

    var formContext = primaryControl;
    var accountId = formContext.data.entity.getId().replace(/[{}]/g, "");

    // create contract first (simplified)
    var contract = {
        "cms_name": "New Contract",
        "cms_accountid@odata.bind": "/accounts(" + accountId + ")"
    };

    Xrm.WebApi.createRecord("cms_contract", contract).then(
        function (result) {

            // Call Custom API
            Xrm.WebApi.online.execute({
                entityName: "cms_contract",
                entityId: result.id.replace(/[{}]/g, ""),
                operationName: "cms_MoveContractToNextStage"
            }).then(
                function () {
                    Xrm.Navigation.openForm({
                        entityName: "cms_contract",
                        entityId: result.id
                    });
                }
            );
        }
    );
}
