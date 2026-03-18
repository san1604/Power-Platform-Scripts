function processContract(primaryControl)
{
    var formContext = primaryControl
    var recordId = formContext.data.entity.getId();

    if (!recordId)
    {
        Xrm.Navigation.openAlertDialog({text : "Please Save the record first"})
        return
    }

    recordId = recordId.replace("{", "").replace("}", "")

    var updateData = {
        "cms_contractStatus":2
    }
    Xrm.WebApi.updateRecord("cms_contract", recordId, updateData).then(
        function success()
        {
            triggerFlow(recordId);
            Xrm.Navigation.openAlertDialog({
                text: "Processing Started."
            });

            formContext.data.refresh();
        },

        function (error) {
            Xrm.Navigation.openAlertDialog({
                text: error.message
            });
        }
    )
}
function triggerFlow(contractId) {

    var flowUrl = "https://0d083087301eefd3aa68b7002c88dc.d9.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/fc141298e54f47c783cf07c854fd274d/triggers/manual/paths/invoke?api-version=1";

    var data = {
        contractId: contractId
    };

    var req = new XMLHttpRequest();
    req.open("POST", flowUrl, true);
    req.setRequestHeader("Content-Type", "application/json");
    req.send(JSON.stringify(data));
}
