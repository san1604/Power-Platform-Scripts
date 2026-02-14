function lockBPF(executionContext) {
    var formContext = executionContext.getFormContext();

    if (!formContext.data.process) return;

    formContext.data.process.getActiveProcess(function (activeProcess) {
        if (!activeProcess) return;

        var stages = activeProcess.getStages();

        stages.forEach(function (stage) {
            stage.setDisabled(true);
        });
    });
}

// Hide BPF buttons
function HideSetAcgtiveButton(executionContext) {

   var formContext = executionContext.getFormContext();

   formContext.data.process.addOnStageSelected(onStageClicked);

}

function onStageClicked(executionContext) {

var formContext = executionContext.getFormContext();

var hide = true;

var interval = null;

interval = setInterval(function () {

       var element = parent.document.getElementById("MscrmControls.Containers.ProcessStageControl-businessProcessFlowFlyoutFooterContainer");

       if (element != null && hide == true) {

           hide = false;

           element.style.display = "none";

           clearInterval(interval);

       }

   }, 10);

}
