var workflowPopupFired = false;
var lastStageSentToFlow = null;
var currentBpfStage = null;
function markAsComplete(primaryControl) {
    debugger;
    var formContext = primaryControl;
    currentBpfStage = getCurrentBpfStageName(formContext);
    console.log("Current Stage:", currentBpfStage);
    moveToNextStage(formContext, currentBpfStage);

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
        "sb1_internalreviewforrenew," +
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
        applyQuoteWorkflowLogic(formContext, config);

    }).catch(function (error) {
        console.error("Error loading workflow config: ", error.message);
    });
}

function applyQuoteWorkflowLogic(formContext, config) {

    const quoteType = formContext.getAttribute("sb1_quotetype").getValue();
    const folderVersionId = formContext.getAttribute("sb1_quoteid").getValue();
    const postStageChange = getCurrentBpfStageName(formContext);
    if (currentBpfStage == "Sold") {
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

    if (postStageChange === internalReviewStage || postStageChange === submitStage || postStageChange === exceptionalStage) {
        setAllFieldsReadOnly(formContext);
    }

    console.log("Current Stage:", postStageChange);
    var workflowStageValue = "";

    switch (postStageChange) {
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
    callPowerAutomate(folderVersionId, quoteType, workflowStageValue);
    formContext.data.refresh(false);

}

function moveToNextStage(formContext, currentBpfStage) {
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
                moveBpf(formContext, currentBpfStage);

            },
            function (error) {
                console.error("Save failed: " + error.message);
            }
        );
    }
    else {
        moveBpf(formContext, currentBpfStage);
    }
}
function moveBpf(formContext, currentBpfStage) {

    if (!formContext.data.process) {
        console.log("BPF is not available on this form.");
        return;
    }

    // ✅ NEW: If already on Sold → finish BPF
    if (currentBpfStage === "Sold") {
        finishBpf(formContext); // 🔥 NEW CALL
        return;
    }

    formContext.data.process.moveNext(
        function () {
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
        quoteType: quoteType,
        quoteStatus: "Complete",
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
    quoteStage = quoteStage + 1;
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
                return response.json(); // 
            })
            .then(function (uwResponse) {
                Xrm.Utility.closeProgressIndicator();

                console.log("UW Response:", uwResponse);

                var rawUwResponse = uwResponse.sb1_uw_responce;

                if (!rawUwResponse) {
                    throw new Error("UW response not returned from Custom API.");
                }

                // 🔹 Parse UW response safely
                var uwResponse;
                try {
                    uwResponse = JSON.parse(rawUwResponse);
                } catch (e) {
                    uwResponse = {
                        Success: false,
                        Message: rawUwResponse
                    };
                }

                console.log("Parsed UW Response:", uwResponse);

                if (
                    uwResponse.Result &&
                    uwResponse.Result.Success &&
                    uwResponse.Result.Success.toLowerCase() === "success"
                ) {
                    Xrm.Navigation.openAlertDialog({
                        title: "Submit Quote",
                        text: uwResponse.Result.Message || "Quote submitted successfully."
                    });
                }
                else {
                    var errorMsg =
                        (uwResponse.Errors && uwResponse.Errors.length
                            ? uwResponse.Errors.join(", ")
                            : uwResponse.Result?.Message) ||
                        "UW submission failed.";

                    Xrm.Navigation.openAlertDialog({
                        title: "UW Error",
                        text: errorMsg
                    }).then(function () {
                        // ⬅ move BPF only on actual failure
                        moveBPFToPreviousStage(formContext);
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

function moveBPFToPreviousStage(formContext) {

    var currentStage = formContext.data.process.getActiveStage();
    if (!currentStage) return;

    var currentStageName = currentStage.getName();
    var previousStageName = null;

    // Manual stage order mapping
    switch (currentStageName) {
        case "In Progress":
            previousStageName = "Draft";
            break;

        case "Premium Calculation":
            previousStageName = "In Progress";
            break;

        case "Review Premium":
            previousStageName = "Premium Calculation";
            break;

        case "Sold":
            previousStageName = "Review Premium";
            break;

        default:
            console.log("Already at first stage or unknown stage.");
            return;
    }

    var processId = formContext.data.process.getInstanceId();

    if (!processId) {
        console.log("Process instance not found.");
        return;
    }

    // Get Stage ID
    Xrm.WebApi.retrieveMultipleRecords(
        "processstage",
        "?$select=processstageid&$filter=stagename eq '" + previousStageName + "'"
    ).then(function (result) {

        if (result.entities.length === 0) {
            throw new Error("Previous stage not found.");
        }

        var previousStageId = result.entities[0].processstageid;

        return Xrm.WebApi.updateRecord(
            "sb1_quotequoteprocessflow",
            processId,
            {
                "activestageid@odata.bind":
                    "/processstages(" + previousStageId + ")"
            }
        );

    }).then(function () {

        console.log("Successfully moved back to:", previousStageName);

        formContext.data.refresh(false);

    }).catch(function (error) {
        console.error("Failed to move back:", error.message);
    });
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
        try { ctrl.setDisabled(true); } catch { }
    });
    formContext.getAttribute("sb1_quoteedit").setValue(2);
}
function setFieldsEditable(formContext) {
    formContext.ui.controls.forEach(function (ctrl) {
        try {
            ctrl.setDisabled(false); // enable field
        } catch (e) { }
    });

    formContext.getAttribute("sb1_quoteedit").setValue(1);


}
function markAsReject(primaryControl) {
    debugger;
    var formContext = primaryControl;
    var quoteStatus = formContext.getAttribute("sb1_quotestatus").getValue();
    // Set Quote Status = Rejected (3)
    if (quoteStatus != 4) {
        formContext.getAttribute("sb1_quotestatus").setValue(3);
    }
    const folderVersionId = formContext.getAttribute("sb1_quoteid").getValue();
    var recordId = formContext.data.entity.getId().replace(/[{}]/g, "");
     
    rejectQuoteChangeStage(formContext);
    callRejectQuoteCustomApi(folderVersionId, recordId);
    formContext.data.save();
    formContext.getAttribute("sb1_quotestatus").setValue(1);
    formContext.getAttribute("sb1_quoteedit").setValue(1);
    formContext.getAttribute("sb1_quotestage").setValue(918580000);
  /*  const currentBpfStage = getCurrentBpfStageName(formContext);
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
            return; // no call
    }*/
    console.log(formContext.getAttribute("sb1_quotestage").getValue());
    formContext.data.refresh(false);
    // Save first   
}

/*function callPowerAutomateForRejectAndChangeStage(recordId) {
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
}*/

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
        applyQuoteWorkflowLogicOnLoad(formContext, config);

    }).catch(function (error) {
        console.error("Error loading workflow config: ", error.message);
    });
}

function applyQuoteWorkflowLogicOnLoad(formContext, config) {

    const quoteType = formContext.getAttribute("sb1_quotetype").getValue();
    const currentBpfStage = getCurrentBpfStageName(formContext);

    if (currentBpfStage == "Sold") {
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


function onQuoteStatusChange(executionContext) {
    debugger;
    var formContext = executionContext.getFormContext();
    var status = formContext.getAttribute("sb1_quotestatus").getValue();
    if (status != 3) return;
    const folderVersionId = formContext.getAttribute("sb1_quoteid").getValue();
    var recordId = formContext.data.entity.getId().replace(/[{}]/g, "");
    //  callPowerAutomateForReject(folderVersionId,recordId);
   // formContext.data.refresh(false);
}
function callRejectQuoteCustomApi(folderVersionId, recordId) {
    debugger;
    console.log("Reject Custom API called");

    if (!folderVersionId || !recordId) {
        Xrm.Navigation.openAlertDialog({
            text: "Folder Version Id or Quote Id is missing."
        });
        return;
    }

    // remove {}
    recordId = recordId.replace(/[{}]/g, "");

    var request = {
        sb1_folderversion_id_reject: folderVersionId,
        sb1_guid: recordId,

        getMetadata: function () {
            return {
                boundParameter: null,
                parameterTypes: {
                    "sb1_folderversion_id_reject": {
                        typeName: "Edm.Int32",
                        structuralProperty: 1 // PrimitiveType
                    },
                    "sb1_guid": {
                        typeName: "Edm.String",
                        structuralProperty: 1
                    }
                },
                operationType: 0, // Action
                operationName: "sb1_reject_quote_sync_with_b1"
            };
        }
    };

    Xrm.WebApi.online.execute(request)
        .then(function (response) {
            if (response.ok) {
                console.log("Reject Quote Sync completed successfully");
                Xrm.Navigation.openAlertDialog({
                    text: "Quote rejected and synced with B1 successfully."
                });
            }
        })
        .catch(function (error) {
            console.error(error);
        });
}

function rejectQuoteChangeStage(formContext) {
    debugger;

    // var formContext = primaryControl;
    var quoteId = formContext.data.entity.getId();

    if (!quoteId) {
        Xrm.Navigation.openAlertDialog({ text: "Quote Id not found." });
        return;
    }

    quoteId = quoteId.replace(/[{}]/g, "");

    // 1️⃣ Get Quote
    Xrm.WebApi.retrieveRecord(
        "quote",
        quoteId,
        "?$select=sb1_quotetype,_sb1_quoteworkflowconfiguration_value"
    ).then(function (quote) {

        var configId = quote._sb1_quoteworkflowconfiguration_value;
        if (!configId) {
            throw new Error("Quote Workflow Configuration is missing.");
        }

        var isRenew = quote.sb1_quotetype === 1;

        // 2️⃣ Get Workflow Configuration
        return Xrm.WebApi.retrieveRecord(
            "sb1_quoteworkflowconfiguration",
            configId,
            "?$select=sb1_quotestateifrejectedfornew,sb1_quotestateifrejectedforrenew"
        ).then(function (config) {

            var rejectedStageName = isRenew
                ? config.sb1_quotestateifrejectedforrenew
                : config.sb1_quotestateifrejectedfornew;

            if (!rejectedStageName) {
                throw new Error("Rejected stage is not configured.");
            }

            return {
                rejectedStageName: rejectedStageName
            };
        });

    }).then(function (data) {

        // 3️⃣ Get BPF instance
        return Xrm.WebApi.retrieveMultipleRecords(
            "sb1_quotequoteprocessflow",
            "?$select=businessprocessflowinstanceid" +
            "&$filter=_bpf_quoteid_value eq " + quoteId
        ).then(function (result) {

            if (result.entities.length === 0) {
                throw new Error("BPF instance not found.");
            }

            return {
                bpfId: result.entities[0].businessprocessflowinstanceid,
                rejectedStageName: data.rejectedStageName
            };
        });

    }).then(function (data) {

        // 4️⃣ Get Process Stage
        return Xrm.WebApi.retrieveMultipleRecords(
            "processstage",
            "?$select=processstageid" +
            "&$filter=stagename eq '" + data.rejectedStageName + "'"
        ).then(function (result) {

            if (result.entities.length === 0) {
                throw new Error("Rejected BPF stage not found.");
            }

            return {
                bpfId: data.bpfId,
                stageId: result.entities[0].processstageid
            };
        });

    }).then(function (data) {

        // 5️⃣ Update BPF Active Stage
        return Xrm.WebApi.updateRecord(
            "sb1_quotequoteprocessflow",
            data.bpfId,
            {
                "activestageid@odata.bind":
                    "/processstages(" + data.stageId + ")"
            }
        );

    }).then(
        function () {
            formContext.data.save();
            // Step 2: After successful save → move BPF
            //formContext.data.refresh(false);
        }).catch(function (error) {
            Xrm.Navigation.openAlertDialog({ text: error.message });
        });
}
// ✅ NEW FUNCTION — ADDED
function finishBpf(formContext) {
    if (!formContext.data.process) return;

    formContext.data.process.setStatus("finished",
        function () {
            console.log("✅ BPF marked as Finished");
            formContext.data.save();
        },
        function (error) {
            console.error("❌ Failed to finish BPF:", error.message);
        }
    );
}
function HideSetActiveButton(executionContext) {
 
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