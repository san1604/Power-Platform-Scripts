var workflowPopupFired = false;
var lastStageSentToFlow = null;
var currentBpfStage = null;
function markAsComplete(primaryControl){
    debugger;
    var formContext = primaryControl;
    currentBpfStage = getCurrentBpfStageName(formContext);
    console.log("Current Stage:", currentBpfStage);
    moveToNextStage(formContext,currentBpfStage);
    
}
function syncQuoteWorkflowConfiguration(formContext) {

    const quoteType = formContext.getAttribute("sb1_quotetype")?.getValue();
    if (quoteType === null || quoteType === undefined) return;

    // Get Workflow Config lookup
    const configLookup = formContext.getAttribute("sb1_quoteworkflowconfiguration").getValue();
    if (!configLookup || configLookup.length === 0) return;

    const configId = configLookup[0].id.replace("{", "").replace("}", "");

    Xrm.WebApi.retrieveRecord(
        "sb1_quoteworkflowconfiguration",
        configId,
        "?$select=" +
        "sb1_submitquoteforpricingpremiumfornew," +
        "sb1_triggerexceptionalapprovalfornew," +
        "sb1_quotestateifrejectedfornew," +
        "sb1_internalreviewfornew," +
        "sb1_submitquoteforpricingpremiumforrenew," +
        "sb1_triggerexceptionalapprovalforrenew," +
        "sb1_quotestateifrejectedforrenew," +
        "sb1_internalreviewforrenew,"+
          "sb1_acceptedquotestatusfornew," +
        "sb1_acceptedquotestatusforrenew," +
        "sb1_approvedquotestatusfornew," +
        "sb1_approvedquotestatusforrenew," +
        "sb1_draftquotestatusfornew," +
        "sb1_draftquotestatusforrenew," +
        "sb1_inreviewquotestatusfornew," +
        "sb1_inreviewquotestatusforrenew," +
        "sb1_presentedquotestatusfornew," +
        "sb1_presentedsquotestatusforrenew"
    ).then(function (config) {
      applyQuoteWorkflowLogic(formContext,config);

    }).catch(function (error) {
        console.error("Error loading workflow config: ", error.message);
    });
}

function applyQuoteWorkflowLogic(formContext, config) {
    
    const quoteType = formContext.getAttribute("sb1_quotetype").getValue(); 
    const folderVersionId = formContext.getAttribute("sb1_quoteid").getValue();
  //  const currentBpfStage = getCurrentBpfStageName(formContext);
    if(currentBpfStage == "Sold"){
        setAllFieldsReadOnly(formContext);
     //  formContext.getAttribute("statecode").setValue(2);
       formContext.getAttribute("sb1_quotestatus").setValue(4);
    }

    let submitStage = "";
    let exceptionalStage = "";
    let rejectedStage = "";
    let internalReviewStage = "";
    let draftStage = "";
    let inReviewStage = "";
    let approvedStage = "";
    let presentedStage = "";
    let acceptedStage = "";

 console.log("Current Stage:", currentBpfStage);

    if (quoteType == 0) { // NEW

        submitStage = config.sb1_submitquoteforpricingpremiumfornew;
        exceptionalStage = config.sb1_triggerexceptionalapprovalfornew;
        rejectedStage = config.sb1_quotestateifrejectedfornew;
        internalReviewStage = config.sb1_internalreviewfornew;

        // 🔽 Added from screenshot
        draftStage = config.sb1_draftquotestatusfornew;
        inReviewStage = config.sb1_inreviewquotestatusfornew;
        approvedStage = config.sb1_approvedquotestatusfornew;
        presentedStage = config.sb1_presentedquotestatusfornew;
        acceptedStage = config.sb1_acceptedquotestatusfornew;

    } else { // RENEW

        submitStage = config.sb1_submitquoteforpricingpremiumforrenew;
        exceptionalStage = config.sb1_triggerexceptionalapprovalforrenew;
        rejectedStage = config.sb1_quotestateifrejectedforrenew;
        internalReviewStage = config.sb1_internalreviewforrenew;

        // 🔽 Added from screenshot
        draftStage = config.sb1_draftquotestatusforrenew;
        inReviewStage = config.sb1_inreviewquotestatusforrenew;
        approvedStage = config.sb1_approvedquotestatusforrenew;
        presentedStage = config.sb1_presentedsquotestatusforrenew;
        acceptedStage = config.sb1_acceptedquotestatusforrenew;
    }


    console.log("Current Stage:", currentBpfStage);

     if (currentBpfStage === submitStage && !workflowPopupFired) {
        workflowPopupFired = true;
       setAllFieldsReadOnly(formContext);
        submitQuoteToUW(formContext);
    }

    if (currentBpfStage === exceptionalStage && !workflowPopupFired) {
        workflowPopupFired = true;
        setAllFieldsReadOnly(formContext);
        triggerExceptionalApproval();
    }
    

    if (currentBpfStage === internalReviewStage) {
       setAllFieldsReadOnly(formContext);
    }
 console.log("Current Stage:", currentBpfStage);
     var workflowStageValue = "";

     switch (currentBpfStage) {
        case "Draft":
        workflowStageValue = draftStage;
        break;

    case "In Progress":
        workflowStageValue = inReviewStage;
        break;

    case "Premium Calculation":
        workflowStageValue = approvedStage;
        break;

    case "Review Premium":
        workflowStageValue = presentedStage;
        break;

    case "Sold":
        workflowStageValue = acceptedStage;
        break;


        default:
            return; // no call
    }
    updateQuoteStage(formContext);
   // if (!workflowStageValue || lastStageSentToFlow === workflowStageValue) return;

   // lastStageSentToFlow = workflowStageValue;
    callPowerAutomate(folderVersionId, quoteType,workflowStageValue);
    formContext.data.refresh(false);
    
}

function moveToNextStage(formContext,currentBpfStage) {
    debugger;

    var quoteStatusAttr = formContext.getAttribute("sb1_quotestatus");
    if (!quoteStatusAttr) return;

    var quoteStatusValue = quoteStatusAttr.getValue();

    // Step 1: If status = 1 → set to 2 and save
    if (quoteStatusValue === 1) {
        quoteStatusAttr.setValue(2);

        formContext.data.save().then(
            function () {
                // Step 2: After successful save → move BPF
                moveBpf(formContext);
            },
            function (error) {
                console.error("Save failed: " + error.message);
            }
        );
    }
    else{
        moveBpf(formContext,currentBpfStage);
    }
}
function moveBpf(formContext,currentBpfStage) {

    // Ensure BPF exists
    if (!formContext.data.process) {
        console.log("BPF is not available on this form.");
        return;
    }

    formContext.data.process.moveNext(
        function () {
                // NOW stage is actually "In Progress"
                syncQuoteWorkflowConfiguration(formContext);
        },
        function (error) {
            console.error("Move next failed: " + error.message);
        }
    );
}
function callPowerAutomate(folderVersionId, quoteType, workflowStageValue) {
    var payload = {
        folderVersionId: folderVersionId,
        quoteType : quoteType,
        quoteStatus : "Complete",
        workflowStageValue: workflowStageValue
    };

    var req = new XMLHttpRequest();
    req.open("POST", "https://b1da9bdebce3e56ba057fa4958b325.08.environment.api.powerplatform.com/powerautomate/automations/direct/workflows/d009cb3d592f499e8604293ed62cd0e4/triggers/manual/paths/invoke/quote/syncwithB1?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=1EXWHM6RnYIXlEUsETkbV5SQ2GLDf9oJHaLPH4A5BYk", true);
    req.setRequestHeader("Content-Type", "application/json");
    req.send(JSON.stringify(payload));
}

function getCurrentBpfStageName(formContext) {
    console.log("called stage");
    try {
        let activeStage = formContext.data.process.getActiveStage();
        console.log("called  active stage" + activeStage);
        return activeStage ? activeStage.getName() : "";
    } catch (e) {
        return "";
    }
}
function updateQuoteStage(formContext) {
    var quoteStage = formContext.getAttribute("sb1_quotestage").getValue();
    quoteStage =  quoteStage + 1;
    formContext.getAttribute("sb1_quotestage").setValue(quoteStage);
}
function submitQuoteToUW(formContext) {
    try {
        debugger;
 
        var quoteId = formContext.data.entity.getId();
        if (!quoteId) {
            Xrm.Navigation.openAlertDialog({ text: "Quote Id not found." });
            return;
        }
        quoteId = quoteId.replace(/[{}]/g, "");
 
        var folderVersionAttr = formContext.getAttribute("sb1_quoteid");
        if (!folderVersionAttr || folderVersionAttr.getValue() === null) {
            Xrm.Navigation.openAlertDialog({ text: "Folder Version Id not found." });
            return;
        }
        var folderVersionId = folderVersionAttr.getValue();
 
        var request = {
            sb1_folderversion_id: folderVersionId,
            sb1_quote_guid: quoteId,
 
            getMetadata: function () {
                return {
                    boundParameter: null,
                    parameterTypes: {
                        sb1_folderversion_id: {
                            typeName: "Edm.Int32",
                            structuralProperty: 1
                        },
                        sb1_quote_guid: {
                            typeName: "Edm.String",
                            structuralProperty: 1
                        }
                    },
                    operationName: "sb1_submit_quote_uw",
                    operationType: 0
                };
            }
        };
 
        Xrm.Utility.showProgressIndicator("Submitting Quote to Underwriter...");
 
        Xrm.WebApi.online.execute(request)
            .then(function (response) {
                if (!response.ok) {
                    throw new Error("Custom API execution failed.");
                }
                return response.json(); // 🔴 IMPORTANT
            })
            .then(function (uwResponse) {
                Xrm.Utility.closeProgressIndicator();
 
                console.log("UW Response:", uwResponse);
 
                // ✅ UW SUCCESS
                if (
                    uwResponse &&
                    uwResponse.Result &&
                    uwResponse.Result.Success === "Success"
                ) {
                    Xrm.Navigation.openAlertDialog({
                        title: "Submit Quote",
                        text: uwResponse.Result.Message || "Quote submitted successfully."
                    });
                }
               
                else {
                    var errorMsg = "UW submission failed.";
 
                    if (uwResponse?.Errors?.length > 0) {
                        errorMsg = uwResponse.Errors.join(", ");
                    } else if (uwResponse?.Result?.Message) {
                        errorMsg = uwResponse.Result.Message;
                    }
 
                    Xrm.Navigation.openAlertDialog({
                        title: "UW Error",
                        text: errorMsg
                    }).then(function () {
                        // ⬅ MOVE BPF BACK AFTER USER SEES ERROR
                        moveBpfToPreviousStage(formContext);
                    });
                }
 
            })
            .catch(function (error) {
                Xrm.Utility.closeProgressIndicator();
                console.error(error);
 
                Xrm.Navigation.openAlertDialog({
                    title: "Error",
                    text: error.message || "Unexpected error while submitting quote."
                });
            });
 
    } catch (e) {
        Xrm.Utility.closeProgressIndicator();
        console.error("SubmitQuoteToUW error:", e.message);
 
        Xrm.Navigation.openAlertDialog({
            title: "Error",
            text: "Unexpected error while submitting quote."
        });
    }
}
function triggerExceptionalApproval() {
    console.log("Called Trigger approval");
    try {
        Xrm.Navigation.openAlertDialog({
            text: "Exceptional Approval triggered.",
            title: "Exceptional Approval"
        });
    } catch (e) {
        console.log("Popup error: " + e.message);
        alert("Exceptional Approval triggered.");
    }
}
function setAllFieldsReadOnly(formContext) {
    formContext.ui.controls.forEach(function (ctrl) {
        try { ctrl.setDisabled(true); } catch {}
    });
    formContext.getAttribute("sb1_quoteedit").setValue(2);
}
function setFieldsEditable(formContext) {
    formContext.ui.controls.forEach(function (ctrl) {
        try {
            ctrl.setDisabled(false); // enable field
        } catch (e) {}
    });

    formContext.getAttribute("sb1_quoteedit").setValue(1);
    

}
async function markAsReject(primaryControl) {
    debugger;

    const formContext = primaryControl;

    const quoteStatus = formContext.getAttribute("sb1_quotestatus")?.getValue();
    if (quoteStatus !== 4) {
        formContext.getAttribute("sb1_quotestatus").setValue(3); // Rejected
    }

    formContext.getAttribute("sb1_quotestatus").setValue(1);
    formContext.getAttribute("sb1_quoteedit").setValue(1);

    // 🔥 WAIT for BPF stage change
    await rejectQuoteChangeStage(formContext);

    // ✅ Now BPF is updated → get latest stage
    const currentBpfStage = getCurrentBpfStageName(formContext);

    switch (currentBpfStage) {
        case "Draft":
            formContext.getAttribute("sb1_quotestage").setValue(918580000);
            break;

        case "In Progress":
            formContext.getAttribute("sb1_quotestage").setValue(918580001);
            break;

        case "Premium Calculation":
            formContext.getAttribute("sb1_quotestage").setValue(918580002);
            break;

        case "Review Premium":
            formContext.getAttribute("sb1_quotestage").setValue(918580003);
            break;

        case "Sold":
            formContext.getAttribute("sb1_quotestage").setValue(918580004);
            break;

        default:
            console.warn("Unknown BPF stage:", currentBpfStage);
            return;
    }

    // Save changes
    formContext.data.entity.save();
}


function callPowerAutomateForRejectAndChangeStage(recordId) {
    console.log("flow called");
  try {
        const payload = {
            guid: recordId || null
        };
        const req = new XMLHttpRequest();
        req.open("POST", "https://b1da9bdebce3e56ba057fa4958b325.08.environment.api.powerplatform.com/powerautomate/automations/direct/workflows/cda435fdd52c45d9b3a03050d3043415/triggers/manual/paths/invoke/reject/changestage?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=MNkJhlilXgI-KAmFG23GW9Ga6Cjyeqiji7YUlS49AYM", true);
        req.setRequestHeader("Content-Type", "application/json");
        req.onreadystatechange = function () {
            if (req.readyState === 4 && req.status >= 400) {
                console.error("Reject Flow and change stage call failed:", req.status, req.responseText);
            }
        };
        req.send(JSON.stringify(payload));
    } catch (e) {
        console.error("Reject Flow call error:", e?.message);
    }
}

function syncQuoteWorkflowConfigurationOnload(executionContext) {
var formContext = executionContext.getFormContext();
    const quoteType = formContext.getAttribute("sb1_quotetype")?.getValue();
    if (quoteType === null || quoteType === undefined) return;

    // Get Workflow Config lookup
    const configLookup = formContext.getAttribute("sb1_quoteworkflowconfiguration").getValue();
    if (!configLookup || configLookup.length === 0) return;

    const configId = configLookup[0].id.replace("{", "").replace("}", "");

    Xrm.WebApi.retrieveRecord(
        "sb1_quoteworkflowconfiguration",
        configId,
        "?$select=" +
        "sb1_submitquoteforpricingpremiumfornew," +
        "sb1_triggerexceptionalapprovalfornew," +
        "sb1_quotestateifrejectedfornew," +
        "sb1_internalreviewfornew," +
        "sb1_submitquoteforpricingpremiumforrenew," +
        "sb1_triggerexceptionalapprovalforrenew," +
        "sb1_quotestateifrejectedforrenew," +
        "sb1_internalreviewforrenew,"
    ).then(function (config) {
      applyQuoteWorkflowLogicOnLoad(formContext,config);

    }).catch(function (error) {
        console.error("Error loading workflow config: ", error.message);
    });
}

function applyQuoteWorkflowLogicOnLoad(formContext, config) {
    
    const quoteType = formContext.getAttribute("sb1_quotetype").getValue(); 
    const currentBpfStage = getCurrentBpfStageName(formContext);
   
 if(currentBpfStage == "Sold"){
      // formContext.getAttribute("statecode").setValue(2);
      setAllFieldsReadOnly(formContext);
       formContext.getAttribute("sb1_quotestatus").setValue(4);
    }

    let submitStage = "";
    let exceptionalStage = "";
    let rejectedStage = "";
    let internalReviewStage = "";


    if (quoteType == 0) { // NEW

        submitStage = config.sb1_submitquoteforpricingpremiumfornew;
        exceptionalStage = config.sb1_triggerexceptionalapprovalfornew;
        rejectedStage = config.sb1_quotestateifrejectedfornew;
        internalReviewStage = config.sb1_internalreviewfornew;

    } else { // RENEW

        submitStage = config.sb1_submitquoteforpricingpremiumforrenew;
        exceptionalStage = config.sb1_triggerexceptionalapprovalforrenew;
        rejectedStage = config.sb1_quotestateifrejectedforrenew;
        internalReviewStage = config.sb1_internalreviewforrenew;

    }


    console.log("Current Stage:", currentBpfStage);

     if (currentBpfStage === submitStage && !workflowPopupFired) {
        workflowPopupFired = true;
       setAllFieldsReadOnly(formContext);
          formContext.data.refresh(false).then(
                function () {
                    console.log("Form refreshed after 1 minute");
                },
                function (error) {
                    console.error("Refresh failed: " + error.message);
                }
            );
    }

    if (currentBpfStage === exceptionalStage && !workflowPopupFired) {
        workflowPopupFired = true;
        setAllFieldsReadOnly(formContext);
           formContext.data.refresh(false).then(
                function () {
                    console.log("Form refreshed after 1 minute");
                },
                function (error) {
                    console.error("Refresh failed: " + error.message);
                }
            );
    }
    
    if (currentBpfStage === internalReviewStage) {
       setAllFieldsReadOnly(formContext);
          formContext.data.refresh(false).then(
                function () {
                    console.log("Form refreshed after 1 minute");
                },
                function (error) {
                    console.error("Refresh failed: " + error.message);
                }
            );
    }
}


function onQuoteStatusChange(executionContext){
    debugger;
    var formContext = executionContext.getFormContext();
    var status = formContext.getAttribute("sb1_quotestatus").getValue();
    if(status != 3) return;
    const folderVersionId = formContext.getAttribute("sb1_quoteid").getValue();
    var recordId = formContext.data.entity.getId().replace(/[{}]/g, "");
  //  callPowerAutomateForReject(folderVersionId,recordId);
    formContext.data.refresh(false);
}
function callPowerAutomateForReject(folderVersionId,recordId) {
    console.log("reject Flow called");
    var payload = {
        folderVersionId: folderVersionId,
        guid :recordId
    };
    var req = new XMLHttpRequest();
    req.open("POST", "https://b1da9bdebce3e56ba057fa4958b325.08.environment.api.powerplatform.com/powerautomate/automations/direct/workflows/4b12e20f8a0e4521bf471b91fcbc3647/triggers/manual/paths/invoke/quote/syncwithB1?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=Kwj8eVDsu2qdXMLcxU3ldgXEbnMykSWZRoQuyk7mR1c", true);
    req.setRequestHeader("Content-Type", "application/json");
    req.send(JSON.stringify(payload));
}
async function rejectQuoteChangeStage(formContext) {
    debugger;

    let quoteId = formContext.data.entity.getId();
    if (!quoteId) {
        await Xrm.Navigation.openAlertDialog({ text: "Quote Id not found." });
        throw new Error("Quote Id missing");
    }

    quoteId = quoteId.replace(/[{}]/g, "");

    // 1️⃣ Get Quote
    const quote = await Xrm.WebApi.retrieveRecord(
        "quote",
        quoteId,
        "?$select=sb1_quotetype,_sb1_quoteworkflowconfiguration_value"
    );

    const configId = quote._sb1_quoteworkflowconfiguration_value;
    if (!configId) {
        throw new Error("Quote Workflow Configuration is missing.");
    }

    const isRenew = quote.sb1_quotetype === 1;

    // 2️⃣ Get Workflow Configuration
    const config = await Xrm.WebApi.retrieveRecord(
        "sb1_quoteworkflowconfiguration",
        configId,
        "?$select=sb1_quotestateifrejectedfornew,sb1_quotestateifrejectedforrenew"
    );

    const rejectedStageName = isRenew
        ? config.sb1_quotestateifrejectedforrenew
        : config.sb1_quotestateifrejectedfornew;

    if (!rejectedStageName) {
        throw new Error("Rejected stage is not configured.");
    }

    // 3️⃣ Get BPF instance
    const bpfResult = await Xrm.WebApi.retrieveMultipleRecords(
        "sb1_quotequoteprocessflow",
        "?$select=businessprocessflowinstanceid" +
        "&$filter=_bpf_quoteid_value eq " + quoteId
    );

    if (bpfResult.entities.length === 0) {
        throw new Error("BPF instance not found.");
    }

    const bpfId = bpfResult.entities[0].businessprocessflowinstanceid;

    // 4️⃣ Get Process Stage
    const stageResult = await Xrm.WebApi.retrieveMultipleRecords(
        "processstage",
        "?$select=processstageid" +
        "&$filter=stagename eq '" + rejectedStageName + "'"
    );

    if (stageResult.entities.length === 0) {
        throw new Error("Rejected BPF stage not found.");
    }

    const stageId = stageResult.entities[0].processstageid;

    // 5️⃣ Update BPF Active Stage
    await Xrm.WebApi.updateRecord(
        "sb1_quotequoteprocessflow",
        bpfId,
        {
            "activestageid@odata.bind": `/processstages(${stageId})`
        }
    );

    // 6️⃣ Refresh form so UI reflects new stage
    await formContext.data.refresh(false);
}

