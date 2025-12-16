function populateContractEndDate(executionContext) {
    var formContext = executionContext.getFormContext();

    var contractLookup = formContext.getAttribute("cms_Contract");
    if (!contractLookup || !contractLookup.getValue()) return;

    var contractId = contractLookup.getValue()[0].id.replace(/[{}]/g, "");

    // Retrieve Contract End Date
    Xrm.WebApi.retrieveRecord(
        "cms_contract",
        contractId,
        "?$select=cms_enddate"
    ).then(
        function (result) {
            if (result.cms_enddate) {
                formContext.getAttribute("cms_oldenddate")
                    .setValue(new Date(result.cms_enddate));
            }
        },
        function (error) {
            console.log(error.message);
        }
    );
}