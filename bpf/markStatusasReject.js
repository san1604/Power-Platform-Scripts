// function markContractRejected(primaryControl) {
//     var formContext = primaryControl;

//     var recordId = formContext.data.entity.getId().replace("{", "").replace("}", "");
//     var entityName = formContext.data.entity.getEntityName();

//     Xrm.WebApi.execute({
//         entityName: entityName,
//         entityId: recordId,
//         name: "cms_MarkContractRejected",
//         getMetadata: function () {
//             return {
//                 boundParameter: "entity",
//                 parameterTypes: {},
//                 operationType: 0,
//                 operationName: "cms_MarkContractRejected"
//             };
//         }
//     }).then(
//         function () {
//             formContext.data.refresh(false);
//         },
//         function (error) {
//             Xrm.Navigation.openAlertDialog({ text: error.message });
//         }
//     );
// }
// function markContractRejected(primaryControl) {
//     var formContext = primaryControl;

//     var recordId = formContext.data.entity.getId().replace("{", "").replace("}", "");
//     var entityName = formContext.data.entity.getEntityName();

//     var request = {
//         entity: {
//             entityType: entityName,
//             id: recordId
//         },
//         getMetadata: function () {
//             return {
//                 boundParameter: "entity",
//                 parameterTypes: {
//                     "entity": {
//                         typeName: "mscrm.crmbaseentity",
//                         structuralProperty: 5
//                     }
//                 },
//                 operationType: 1, // ACTION
//                 operationName: "cms_MarkContractRejected"
//             };
//         }
//     };

//     Xrm.WebApi.execute(request).then(
//         function () {
//             formContext.data.refresh(false);
//         },
//         function (error) {
//             Xrm.Navigation.openAlertDialog({ text: error.message });
//         }
//     );
// }
// function markContractRejected(primaryControl) {
//     var formContext = primaryControl;

//     var recordId = formContext.data.entity.getId().replace("{", "").replace("}", "");
//     var entityName = formContext.data.entity.getEntityName();

//     var request = {
//         entity: {
//             entityType: entityName,
//             id: recordId
//         },
//         getMetadata: function () {
//             return {
//                 boundParameter: "entity",
//                 parameterTypes: {
//                     "entity": {
//                         typeName: "mscrm.crmbaseentity",
//                         structuralProperty: 5
//                     }
//                 },
//                 operationType: 1, // ACTION
//                 operationName: "cms_mark_contract_rejected"
//             };
//         }
//     };

//     Xrm.WebApi.execute(request).then(
//         function () {
//             formContext.data.refresh(false);
//         },
//         function (error) {
//             Xrm.Navigation.openAlertDialog({ text: error.message });
//         }
//     );
// }
// function rejectContract(primaryControl) {
//     const formContext = primaryControl;
//     const contractId = formContext.data.entity.getId().replace("{", "").replace("}", "");

//     const request = {
//         cms_ContractId: contractId,
//         getMetadata: function () {
//             return {
//                 boundParameter: null,
//                 parameterTypes: {
//                     cms_ContractId: {
//                         typeName: "Edm.String",
//                         structuralProperty: 1
//                     }
//                 },
//                 operationType: 0,
//                 operationName: "cms_mark_contract_rejected"
//             };
//         }
//     };

//     Xrm.WebApi.online.execute(request).then(
//         function () {
//             formContext.data.refresh(true); // refreshes BPF + status
//         },
//         function (error) {
//             Xrm.Navigation.openAlertDialog({ text: error.message });
//         }
//     );
// }
function rejectContract(primaryControl) {
    var formContext = primaryControl;

    var recordId = formContext.data.entity.getId();
    var entityName = formContext.data.entity.getEntityName();

    if (!recordId) {
        Xrm.Navigation.openAlertDialog({
            text: "Please save the contract before rejecting."
        });
        return;
    }

    // Remove curly braces from GUID
    recordId = recordId.replace("{", "").replace("}", "");

    var request = {
        entity: {
            id: recordId,
            entityType: entityName
        },
        getMetadata: function () {
            return {
                boundParameter: "entity",
                parameterTypes: {
                    "entity": {
                        typeName: "mscrm.crmbaseentity",
                        structuralProperty: 5 // EntityReference
                    }
                },
                operationType: 1, // ACTION
                operationName: "cms_mark_contract_rejected" // Custom API unique name
            };
        }
    };

    Xrm.WebApi.execute(request).then(
        function () {
            // Refresh form so status + BPF reset show up
            formContext.data.refresh(false);
        },
        function (error) {
            Xrm.Navigation.openAlertDialog({
                text: error.message
            });
        }
    );
}
