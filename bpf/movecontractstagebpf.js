function moveBpfNextAndUpdateStatus(primaryControl) {
    var formContext = primaryControl;
    var statusAttr = formContext.getAttribute("cms_contractstatus");

    formContext.data.process.moveNext(function (result) {
        if (result === "success") {
            var activeStage = formContext.data.process.getActiveStage();
            var stageName = activeStage.getName();

            // Map stage names to contract status values
            var statusValue = null;
            switch (stageName) {
                case "Draft":
                    statusValue = 1; // example value
                    break;
                case "Review":
                    statusValue = 2;
                    break;
                case "Approved":
                    statusValue = 3;
                    break;
                case "Closed":
                    statusValue = 4;
                    break;
                default:
                    statusValue = null; // or keep existing
                    break;
            }

            if (statusValue !== null) {
                statusAttr.setValue(statusValue);
            }

            formContext.data.entity.save();

            // Optionally finish the BPF if at last stage
            var stages = formContext.data.process.getStages();
            if (activeStage.getId() === stages.get(stages.getLength() - 1).getId()) {
                formContext.data.process.setStatus("finished");
            }
        }
    });
}
var entityId = processId;
var bpfEntityName = "Contract.bpf.changecontractstatus"; // Example: new_mybpf
 
var data = {
    "statecode": 1,       // Inactive
    "statuscode": 2       // Finished (varies by BPF type)
};

Xrm.WebApi.updateRecord(bpfEntityName, entityId, data).then(
    function success(result) {
        console.log("BPF marked as finished.");
    },
    function (error) {
        console.log(error.message);
    }
);