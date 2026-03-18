// var SB1 = SB1 || {};
// SB1.Quote = (function () {
//     "use strict";

//     function onLoad(executionContext) {

//         //SB1.Quote.triggercallQuoteAPI(executionContext);
//         SB1.Quote.onChange(executionContext);
//         SB1.Quote.navigateToTab(executionContext);
//         SB1.Quote.toggleSections(executionContext);
//         SB1.Quote.toggleProductTab(executionContext);
//         SB1.Quote.onConfirmMessageChange(executionContext);
//         SB1.Quote.callQuoteAPIforCopyQuote(executionContext);
//         SB1.Quote.lockWhenNotEmpty(executionContext);
//         SB1.Quote.disableOpportunityWhenEmptyAccount(executionContext);
//     }

//     function onChange(executionContext) {
//         var formContext = executionContext.getFormContext();
//         formContext.getAttribute("customerid").addOnChange(disableOpportunityWhenEmptyAccount);
//     }

//     function disableOpportunityWhenEmptyAccount(executionContext) {
//     var formContext = executionContext.getFormContext();
//    var formType = formContext.ui.getFormType();
// // 1 = Create, 2 = Update
//     if (formType !== 1) return;
//     var quoteType = formContext.getAttribute("sb1_quotetype").getValue();

//     // Run logic only if quote type is 0 (New) or 2 (Copy Quote)
//     if (quoteType === 0 || quoteType === 2) {

//         var customer = formContext.getAttribute("customerid").getValue();
//         var opportunityControl = formContext.getControl("opportunityid");

//         if (customer !== null) {
//             opportunityControl.setDisabled(false);
//         } else {
//             opportunityControl.setDisabled(true);
//             // Optional: clear value when disabled
//             // formContext.getAttribute("opportunityid").setValue(null);
//         }

//     } else {
//         // For other quote types, always enable the field (or do nothing)
//         var opportunityControl = formContext.getControl("opportunityid");
//         opportunityControl.setDisabled(false);
//     }
// }

//     function toggleProductTab(executionContext) {
//         var formContext = executionContext.getFormContext();

//         // Check Create vs Update mode
//         var isCreate = formContext.ui.getFormType() === 1;

//         var tab = formContext.ui.tabs.get("tab_productnamepage");

//         if (tab) {
//             if (isCreate) {
//                 // Hide tab in Create mode
//                 tab.setVisible(false);
//             } else {
//                 // Show tab after save (Update mode)
//                 tab.setVisible(true);
//             }
//         }
//     }


//     function validateAndToggleSections(executionContext) {
//         var formContext = executionContext.getFormContext();
//         var eventArgs = executionContext.getEventArgs ? executionContext.getEventArgs() : null;

//         // Clear old notifications
//         formContext.ui.clearFormNotification("RequiredFieldsError");

//         // Sections inside Summary_tab
//         var oobSection = formContext.ui.tabs.get("Summary_tab").sections.get("sec_oobfields");
//         var htmlSection = formContext.ui.tabs.get("Summary_tab").sections.get("sec_htmlweb");

//         // Map CRM logical names → Display names
//         var fieldMap = {
//             "sb1_state": "State",
//             "sb1_region": "Region",
//             "sb1_fundingarrangement": "Funding Arrangement",
//             "sb1_lineofbusiness": "Line of Business",
//             "sb1_marketsegment": "Market Segment"
//         };

//         var missingFields = [];

//         // Check missing fields using logical names
//         Object.keys(fieldMap).forEach(function (logicalName) {
//             var attr = formContext.getAttribute(logicalName);
//             if (!attr || attr.getValue() == null || attr.getValue() === "") {
//                 missingFields.push(fieldMap[logicalName]);  // PUSH DISPLAY NAME
//             }
//         });

//         // 🔴 If save triggered & missing fields exist → block save + show form notification
//         if (eventArgs && missingFields.length > 0) {
//             eventArgs.preventDefault();

//             formContext.ui.setFormNotification(
//                 "Please fill all required fields: " + missingFields.join(", "),
//                 "ERROR",
//                 "RequiredFieldsError"
//             );

//             return false;
//         }

//         // Toggle section based on values
//         var allFilled = missingFields.length === 0;

//         if (allFilled) {
//             oobSection.setVisible(true);
//             htmlSection.setVisible(false);
//         } else {
//             htmlSection.setVisible(true);
//             oobSection.setVisible(false);
//         }

//         return true;
//     }


//     /*function toggleSections(executionContext) {
//     var formContext = executionContext.getFormContext();
//      var quoteTypeAttr = formContext.getAttribute("sb1_quotetype");
//     if (!quoteTypeAttr) return; // field not found
//     var quoteType = quoteTypeAttr.getValue();
//     if (quoteType === 0 && quoteType === 1){

//     // Section names
//     var oobSection = formContext.ui.tabs.get("Summary_tab").sections.get("sec_oobfields");
//     var htmlSection = formContext.ui.tabs.get("Summary_tab").sections.get("sec_htmlweb");

//     // CRM Fields
//     var fields = [
//         "sb1_state",
//         "sb1_region",
//         "sb1_fundingarrangement",
//         "sb1_lineofbusiness",
//         "sb1_marketsegment"
//     ];

//     // Check if ANY CRM field has value
//     var hasValue = fields.some(f => {
//         var attr = formContext.getAttribute(f);
//         return attr && attr.getValue() != null && attr.getValue() !== "";
//     });

//     // Toggle visibility
//     if (hasValue) {
//         // Show CRM fields section
//         oobSection.setVisible(true);
//         // Hide HTML section
//         htmlSection.setVisible(false);
//     } else {
//         // Show HTML section
//         htmlSection.setVisible(true);
//         // Hide CRM fields section
//         oobSection.setVisible(false);
//     }
//     }
// }*/

//     function toggleSections(executionContext) {
//         var formContext = executionContext.getFormContext();
//         var quoteTypeAttr = formContext.getAttribute("sb1_quotetype");
//         if (!quoteTypeAttr) return; // field not found

//         var quoteType = quoteTypeAttr.getValue();

//         // Section names
//         var oobSection = formContext.ui.tabs.get("Summary_tab").sections.get("sec_oobfields");
//         var htmlSection = formContext.ui.tabs.get("Summary_tab").sections.get("sec_htmlweb");

//         // Case 1: Quote type 0 or 1
//         if (quoteType === 0 || quoteType === 1) {
//             // CRM Fields to check
//             var fields = [
//                 "sb1_state",
//                 "sb1_region",
//                 "sb1_fundingarrangement",
//                 "sb1_lineofbusiness",
//                 "sb1_marketsegment"
//             ];

//             // Check if ANY CRM field has value
//             var hasValue = fields.some(f => {
//                 var attr = formContext.getAttribute(f);
//                 return attr && attr.getValue() != null && attr.getValue() !== "";
//             });

//             // Toggle visibility
//             if (hasValue) {
//                 oobSection.setVisible(true);
//                 htmlSection.setVisible(false);
//             } else {
//                 htmlSection.setVisible(true);
//                 oobSection.setVisible(false);
//             }

//         }
//         // Case 2: Quote type 2 (Renewal)
//         else if (quoteType === 2) {
//             var formType = formContext.ui.getFormType(); // 1 = Create
//             if (formType === 1) { // Create mode
//                 htmlSection.setVisible(true);
//                 oobSection.setVisible(false);
//             } else { // Other modes (Update, ReadOnly)
//                 oobSection.setVisible(true);
//                 htmlSection.setVisible(false);
//             }
//         }
//     }



//     function navigateToTab(executionContext) {
//         try {
//             const form = executionContext.getFormContext();

//             // Get the tab
//             const tab = form.ui.tabs.get("tab_productnamepage");

//             if (!tab) {
//                 console.error("Tab not found: " + "tab_productnamepage");
//                 return;
//             }

//             // Focus the tab
//             tab.setFocus();
//             setTimeout(() => {
//                 const summaryTab = form.ui.tabs.get("Summary_tab");
//                 if (summaryTab) {
//                     summaryTab.setFocus();
//                     console.log("Navigated to Summary tab");
//                 } else {
//                     console.error("Summary tab not found");
//                 }
//             }, 1500);

//             console.log("Navigated to tab: " + "Summary_tab");

//         } catch (error) {
//             console.error("Error navigating to tab: ", error);
//         }
//     }


//     function populateBrokerId(executionContext) {
//         var formContext = executionContext.getFormContext();
//         var brokerLookup = formContext.getAttribute("sb1_broker").getValue();

//         if (brokerLookup && brokerLookup.length > 0) {
//             var brokerId = brokerLookup[0].id.replace("{", "").replace("}", "");

//             Xrm.WebApi.retrieveRecord("sb1_broker", brokerId, "?$select=sb1_broker_id").then(
//                 function success(result) {
//                     if (result && result.sb1_broker_id) {

//                         formContext.getAttribute("sb1_brokerid").setValue(result.sb1_broker_id);
//                     } else {
//                         formContext.getAttribute("sb1_brokerid").setValue(null);
//                     }
//                 },
//                 function (error) {
//                     console.error("Error fetching Broker record: ", error.message);
//                     formContext.getAttribute("sb1_brokerid").setValue(null);
//                 }
//             );
//         } else {
//             formContext.getAttribute("sb1_brokerid").setValue(null);
//         }
//     }

//     function validateEffectiveFromDate(executionContext) {
//         var formContext = executionContext.getFormContext();
//         var dateAttr = formContext.getAttribute("effectivefrom");

//         // Clear any existing notifications first
//         formContext.ui.clearFormNotification("EffectiveFromDateError");

//         if (!dateAttr) return;

//         var selectedDate = dateAttr.getValue();
//         if (!selectedDate) return;

//         // Remove time part from selected date for accurate comparison
//         selectedDate.setHours(0, 0, 0, 0);

//         // Define the minimum allowed date: January 1, 2024
//         var minAllowedDate = new Date(2024, 0, 1); // Month is 0-based (0 = January)
//         minAllowedDate.setHours(0, 0, 0, 0);

//         // If the selected date is before Jan 1, 2024, show error and clear field
//         if (selectedDate < minAllowedDate) {
//             formContext.getAttribute("effectivefrom").setValue(null);

//             formContext.ui.setFormNotification(
//                 "Copy of quote with an effective date prior to January 1, 2024 is not allowed.",
//                 "ERROR",
//                 "EffectiveFromDateError"
//             );
//         }
//     }



//     function onGridRowSelectedsetReadonly(context) {

//         context.getFormContext().getData().getEntity().attributes.forEach(function (attr) {
//             if (attr.getName() === "sb1_effectivedate") {
//                 attr.controls.forEach(function (myField) {
//                     myField.setDisabled(true);
//                 });
//             }
//             if (attr.getName() === "sb1_producttype") {
//                 attr.controls.forEach(function (myField) {
//                     myField.setDisabled(true);
//                 });
//             }
//         });
//     }

//     function onSubgridFieldChange(eventContext) {
//         var gridContext = eventContext.getFormContext(); // Editable grid context
//         var eventSource = eventContext.getEventSource(); // The field/column that triggered change
//         var columnName = eventSource.getName();

//         // Only proceed if sb1_document field changed
//         if (columnName !== "sb1_document") {
//             return;
//         }

//         var row = eventSource.getParent(); // Get row
//         var selectedValue = eventSource.getValue(); // For Choice fields, this is an integer

//         if (selectedValue !== null) {
//             var optionLabel = getOptionLabel(selectedValue);

//             var alertStrings = {
//                 confirmButtonLabel: "OK",
//                 text: `You selected option value: ${selectedValue} (${optionLabel})`,
//                 title: "Choice Changed"
//             };
//             var alertOptions = { height: 120, width: 260 };
//             Xrm.Navigation.openAlertDialog(alertStrings, alertOptions);
//         }
//     }

//     // Optional helper to map OptionSet values to labels
//     function getOptionLabel(value) {
//         var options = {
//             918580000: "Benefit Description",
//             918580001: "Handbook-1.0",
//             918580002: "HIPAA Codification",
//             918580003: "SBC Filing"
//             // Add more as needed
//         };
//         return options[value] || "Unknown";
//     }

//     function onSubgridFieldChange2(executionContext) {
//         var formContext = executionContext.getFormContext();
//         var eventSource = executionContext.getEventSource();

//         var row = eventSource.getParent();
//         if (!row) {
//             console.warn("No row context available.");
//             return;
//         }

//         var recordId = row.getId().replace(/[{}]/g, "");
//         var selectedValue = eventSource.getValue();
//         var documentLabel = getOptionLabel(selectedValue);

//         openSelectDownloadDialog(recordId, documentLabel);
//     }

//     function onSubgridLookupChange(executionContext) {
//         try {
//             var formContext = executionContext.getFormContext();
//             var eventSource = executionContext.getEventSource();

//             var row = eventSource.getParent();
//             if (!row) {
//                 console.warn("No row context available.");
//                 return;
//             }

//             var recordId = row.getId().replace(/[{}]/g, "");

//             // Get lookup field value (returns array)
//             var lookupValue = eventSource.getValue();
//             if (!lookupValue || lookupValue.length === 0) {
//                 console.warn("Lookup field is empty.");
//                 return;
//             }

//             // Extract lookup details
//             var lookupId = lookupValue[0].id.replace(/[{}]/g, "");
//             var lookupName = lookupValue[0].name;  // This is the name you want to display
//             var lookupEntity = lookupValue[0].entityType;

//             console.log("Selected Lookup:", lookupId, lookupName, lookupEntity);

//             // Open your popup with document name
//             openSelectDownloadDialog(recordId, lookupName);
//         } catch (e) {
//             console.error("Error in onSubgridLookupChange:", e);
//         }
//     }


//     function openSelectDownloadDialog(recordId, documentLabel) {
//         var dataParams = `recordId=${recordId}&documentLabel=${encodeURIComponent(documentLabel)}`;

//         var pageInput = {
//             pageType: "webresource",
//             webresourceName: "sb1_/script/quote/selectdownload",
//             data: encodeURIComponent(dataParams)
//         };

//         var navigationOptions = {
//             target: 2,
//             width: 500,
//             height: 400,
//             position: 1,
//             title: "Download Document"
//         };

//         Xrm.Navigation.navigateTo(pageInput, navigationOptions).then(
//             function () {
//                 console.log("Download dialog closed.");
//             },
//             function (error) {
//                 console.error("Dialog error:", error);
//             }
//         );
//     }


//     function openCustomPageDialog(primaryControl, selectedControlSelectedItemIds, selectedEntityTypeName) {

//         //var cleanIds = selectedControlSelectedItemIds.replace(/{|}/g, '').replace(/\s/g, '');
//         // Centered Dialog
//         var pageInput = {
//             pageType: "custom",
//             name: "sb1_documentdownloadpage_8a4ab",
//             entityName: selectedEntityTypeName, // "sample_review"
//             recordId: selectedControlSelectedItemIds// "{087AA308-B321-E811-A845-000D3A33A3AC}" 
//         };
//         var navigationOptions = {
//             target: 2,
//             position: 1,
//             height: {
//                 value: 550,
//                 unit: "px"
//             },
//             width: {
//                 value: 70,
//                 unit: "%"
//             },
//             title: "Document Download"
//         };
//         Xrm.Navigation.navigateTo(pageInput, navigationOptions).then(
//             function () {
//                 // Refresh the main form when the dialog is closed
//                 primaryControl.data.refresh();
//             }
//         ).catch(
//             function (error) {
//                 // Handle error
//             }
//         );
//     }

//     function callFrame(executionContext) {
//         var formContext = executionContext.getFormContext();

//         // Get record ID and remove curly braces
//         var recordId = formContext.data.entity.getId();
//         if (recordId) {
//             recordId = recordId.replace(/[{}]/g, "");
//         }

//         // Build custom page URL
//         // Format: main.aspx?pagetype=custom&name=<sb1_documentdownloadpage_8a4ab>&recordId=<guid>
//         var customPageName = "sb1_documentdownloadpage_8a4ab";
//         var pageUrl = formContext.context.getClientUrl()
//             + "/main.aspx?pagetype=custom"
//             + "&name=" + encodeURIComponent(customPageName)
//             + "&recordId=" + encodeURIComponent(recordId);

//         // Get iframe control
//         var iframeControl = formContext.getControl("IFRAME_downloadframe");
//         if (iframeControl) {
//             iframeControl.setSrc(pageUrl);
//         }
//     }

//     function openCustomPageDialog2(executioncontext) {

//         //var cleanIds = selectedControlSelectedItemIds.replace(/{|}/g, '').replace(/\s/g, '');
//         // Centered Dialog
//         var pageInput = {
//             pageType: "custom",
//             name: "sb1_documentdownloadpage_8a4ab",
//             //entityName: selectedEntityTypeName, // "sample_review"
//             //recordId: selectedControlSelectedItemIds// "{087AA308-B321-E811-A845-000D3A33A3AC}" 
//         };
//         var navigationOptions = {
//             target: 2,
//             position: 1,
//             height: {
//                 value: 550,
//                 unit: "px"
//             },
//             width: {
//                 value: 70,
//                 unit: "%"
//             },
//             title: "Document Download"
//         };
//         Xrm.Navigation.navigateTo(pageInput, navigationOptions).then(
//             function () {
//                 // Refresh the main form when the dialog is closed
//                 primaryControl.data.refresh();
//             }
//         ).catch(
//             function (error) {
//                 // Handle error
//             }
//         );
//     }
//     function registerTabChange(executionContext) {
//         var formContext = executionContext.getFormContext();
//         var tab = formContext.ui.tabs.get("tab_productnamepagecanvas");

//         if (!tab) return;

//         tab.addTabStateChange(function () {
//             if (tab.getDisplayState() === "expanded") {
//                 openCanvasPageA(formContext);
//             }
//         });
//     }

//     function openCanvasPageA(formContext) {
//         var recordid = formContext.getAttribute("sb1_quoteid").getValue();

//         var pageInput = {
//             pageType: "custom",
//             name: "sb1_documentdownloadpage_8a4ab",
//             quoteId: recordid
//         };

//         var navigationOptions = {
//             target: 2,
//             position: 1,
//             height: { value: 650, unit: "px" },
//             width: { value: 100, unit: "%" },
//             title: "Quote Products"
//         };

//         Xrm.Navigation.navigateTo(pageInput, navigationOptions)
//             .then(function (result) {
//                 console.log("Canvas A returned result:", result);
//                 openProductSearchPage(formContext);
//                 formContext.data.refresh();
//             })
//             .catch(function (error) {
//                 console.error("Navigation Error:", error);
//             });
//     }

//     function openProductSearchPage(primaryControl) {
//         console.log("product search page is called");
//         debugger;
//         var quoteId = primaryControl.data.entity.getId().replace(/[{}]/g, "");

//         var pageInput = {
//             pageType: "custom",
//             name: "sb1_productsearchpage_a963f",
//             entityName: "quote",
//             recordId: quoteId,
//             pageInputParams: { recordId: quoteId }
//         };

//         var navOptions = {
//             target: 2,
//             position: 1,
//             width: { value: 90, unit: "%" },
//             height: { value: 90, unit: "%" },
//             title: "Add Products",
//             hideNavBar: true
//         };

//         Xrm.Navigation.navigateTo(pageInput, navOptions)
//             .then(function (result) {
//                 if (result === "success") {
//                     Xrm.Utility.showToast({
//                         message: "Products added successfully",
//                         type: 1
//                     });
//                     primaryControl.data.refresh();
//                 }
//             })
//             .catch(err => console.error(err));
//     }


//     async function renewQuote(primaryControl) {
//         debugger;
//         console.log("Primary Control:", primaryControl);

//         if (!primaryControl.getGrid) {
//             console.error("Not a grid context.");
//             return;
//         }

//         var grid = primaryControl.getGrid();
//         var selectedRows = grid.getSelectedRows();

//         if (selectedRows.getLength() === 0) {
//             Xrm.Navigation.openAlertDialog({ text: "Please select a quote to renew." });
//             return;
//         }

//         var selectedRow = selectedRows.getAll()[0];
//         var quoteId = selectedRow.getData().getEntity().getId().replace("{", "").replace("}", "");
//         console.log("Quote ID:", quoteId);

//         // Retrieve existing quote record
//         Xrm.WebApi.retrieveRecord(
//             "quote",
//             quoteId,
//             "?$select=_customerid_value,effectivefrom,effectiveto,description,_pricelevelid_value,sb1_lineofbusiness,_sb1_quoteworkflowconfiguration_value,sb1_marketsegment,sb1_region,sb1_brokerid,_sb1_broker_value,name,billto_line1,billto_line2,billto_city,sb1_billtostate,billto_postalcode,sb1_billtocountry,totallineitemamount,discountpercentage,discountamount,totaltax,totalamount,_opportunityid_value,sb1_quotename,sb1_numberofsubscribers,sb1_numberofmembers,sb1_minage,sb1_maxage,sb1_averageage,sb1_lineofbusiness,sb1_marketsegment,sb1_fundingarrangement,sb1_state,sb1_region"
//         ).then(
//             function (result) {
//                 var formParameters = {
//                     name: result.name,
//                     description: result.description,
//                     sb1_quotetype: 1, // Directly set quotetype = 1
//                     effectivefrom: result.effectivefrom,
//                     effectiveto: result.effectiveto,
//                     sb1_region: result.sb1_region,
//                     sb1_marketsegment: result.sb1_marketsegment,
//                     sb1_lineofbusiness: result.sb1_lineofbusiness,
//                     sb1_brokerid: result.sb1_brokerid,
//                     sb1_numberofsubscribers: result.sb1_numberofsubscribers,
//                     sb1_numberofmembers: result.sb1_numberofmembers,
//                     sb1_minage: result.sb1_minage,
//                     sb1_maxage: result.sb1_maxage,
//                     sb1_averageage: result.sb1_averageage,
//                     billto_line1: result.billto_line1,
//                     billto_line2: result.billto_line2,
//                     billto_city: result.billto_city,
//                     sb1_billtostate: result.sb1_billtostate,
//                     billto_postalcode: result.billto_postalcode,
//                     sb1_billtocountry: result.sb1_billtocountry,
//                     totallineitemamount: result.totallineitemamount,
//                     discountpercentage: result.discountpercentage,
//                     discountamount: result.discountamount,
//                     totaltax: result.totaltax,
//                     totalamount: result.totalamount,
//                     sb1_lineofbusiness: result.sb1_lineofbusiness,
//                     sb1_marketsegment: result.sb1_marketsegment,
//                     sb1_fundingarrangement: result.sb1_fundingarrangement,
//                     sb1_state: result.sb1_state,
//                     sb1_region: result.sb1_region
//                 };

//                 // 🔹 Customer lookup
//                 if (result._customerid_value) {
//                     formParameters["customerid"] = result._customerid_value;
//                     formParameters["customeridname"] =
//                         result["_customerid_value@OData.Community.Display.V1.FormattedValue"];
//                     formParameters["customeridtype"] =
//                         result["_customerid_value@Microsoft.Dynamics.CRM.lookuplogicalname"];
//                 }

//                 // 🔹 Price List lookup
//                 if (result._pricelevelid_value) {
//                     formParameters["pricelevelid"] = result._pricelevelid_value;
//                     formParameters["pricelevelidname"] =
//                         result["_pricelevelid_value@OData.Community.Display.V1.FormattedValue"];
//                     formParameters["pricelevelidtype"] =
//                         result["_pricelevelid_value@Microsoft.Dynamics.CRM.lookuplogicalname"];
//                 }

//                 // 🔥🔥 NEW: Auto populate Source Quote
//                 formParameters["sb1_sourcequote"] = quoteId;
//                 formParameters["sb1_sourcequotename"] = result.name;
//                 formParameters["sb1_sourcequotetype"] = "quote";

//                 var entityFormOptions = {
//                     entityName: "quote",
//                     useQuickCreateForm: false
//                 };

//                 // 🔹 Opportunity lookup
//                 if (result._opportunityid_value) {
//                     formParameters["opportunityid"] = result._opportunityid_value;
//                     formParameters["opportunityidname"] =
//                         result["_opportunityid_value@OData.Community.Display.V1.FormattedValue"];
//                     formParameters["opportunityidtype"] =
//                         result["_opportunityid_value@Microsoft.Dynamics.CRM.lookuplogicalname"];
//                 }

//                 // 🔹 Broker lookup
//                 if (result._sb1_broker_value) {
//                     formParameters["sb1_broker"] = result._sb1_broker_value;
//                     formParameters["sb1_brokername"] =
//                         result["_sb1_broker_value@OData.Community.Display.V1.FormattedValue"];
//                     formParameters["sb1_brokertype"] =
//                         result["_sb1_broker_value@Microsoft.Dynamics.CRM.lookuplogicalname"];
//                 }

//                 if (result._sb1_quoteworkflowconfiguration_value) {
//                     formParameters["sb1_quoteworkflowconfiguration"] = result._sb1_quoteworkflowconfiguration_value;
//                     formParameters["_sb1_quoteworkflowconfiguration_value"] =
//                         result["_sb1_quoteworkflowconfiguration_value@OData.Community.Display.V1.FormattedValue"];
//                     formParameters["quoteworkflowconfigurationidtype"]
//                     result["_sb1_quoteworkflowconfiguration_value@Microsoft.Dynamics.CRM.lookuplogicalname"];
//                 }


//                 console.log("Opening new quote form with parameters:", formParameters);

//                 // Open the new form
//                 Xrm.Navigation.openForm(entityFormOptions, formParameters).then(
//                     function (success) {
//                         console.log("Renew Quote form opened successfully!", success);

//                         // Apply date validation logic
//                         setTimeout(function () {
//                             var formContext = Xrm.Page;
//                             if (!formContext) return;

//                             var choiceAttr = formContext.getAttribute("sb1_quotetype");

//                             if (choiceAttr) {
//                                 console.log("QuoteType value:", choiceAttr.getValue());

//                                 if (choiceAttr.getValue() === 1) {
//                                     restrictPastDates({ getFormContext: () => formContext });
//                                 } else if (choiceAttr.getValue() === 2) {
//                                     validateEffectiveFormDate({ getFormContext: () => formContext });
//                                 }
//                             }
//                         }, 2500);
//                     },
//                     function (error) {
//                         console.error("Error opening Quote form:", error.message);
//                     }
//                 );
//             },
//             function (error) {
//                 console.error("Error retrieving Quote record:", error.message);
//             }
//         );
//     }

//     async function callQuoteAPI(executionContext) {   // get details from eff date to fill HTML WEB

//         var formContext = executionContext.getFormContext();
//         var quoteType = formContext.getAttribute("sb1_quotetype")?.getValue();

//         if (quoteType === 0) {

//             try {
//                 var formContext = executionContext.getFormContext();
//                 // 1️⃣ Get the date from the CRM form
//                 var effDate = formContext.getAttribute("effectivefrom").getValue();
//                 if (!effDate) {
//                     Xrm.Navigation.openAlertDialog({ text: "Effective Date is empty." });
//                     return;
//                 }
//                 // 2️⃣ Convert date to ISO format
//                 var formattedDate = effDate.toISOString();
//                 // 3️⃣ Create request body
//                 var body = {
//                     "sb1_effdate": formattedDate
//                 };
//                 // 4️⃣ Call Custom API
//                 var response = await fetch("/api/data/v9.1/sb1_getquotedetailsfromdate", {
//                     method: "POST",
//                     headers: {
//                         "Content-Type": "application/json",
//                         "Accept": "application/json",
//                         "OData-MaxVersion": "4.0",
//                         "OData-Version": "4.0"
//                     },
//                     body: JSON.stringify(body)
//                 });
//                 if (!response.ok) {
//                     var err = await response.text();
//                     Xrm.Navigation.openAlertDialog({ text: "Error calling Custom API:\n" + err });
//                     return;
//                 }
//                 // 5️⃣ Parse CRM response
//                 var data = await response.json();
//                 // 6️⃣ Parse the JSON inside sb1_getdetails
//                 var details = JSON.parse(data.sb1_getdetails);
//                 // 7️⃣ Extract actual lists
//                 var lists = details.Result.Data;
//                 // Debug popup
//                 // Xrm.Navigation.openAlertDialog({
//                 //     text: "PARSED RESPONSE:\n\n" + JSON.stringify(lists, null, 2)
//                 //  });
//                 // 8️⃣ Load the HTML Web Resource iframe
//                 var iframe = formContext.getControl("WebResource_quotefields");
//                 if (!iframe) {
//                     console.log("HTML Webresource not found.");
//                     return;
//                 }
//                 var contentWindow = iframe.getContentWindow();
//                 // 9️⃣ Send data to HTML Web Resource using postMessage
//                 contentWindow.then(function (win) {
//                     win.postMessage({
//                         StateList: lists.StateList,
//                         RegionList: lists.RegionList,
//                         FundingList: lists.FundingArrangementList,
//                         LOBList: lists.LineOfBusinessList,
//                         MarketSegmentList: lists.MarketSegmentList
//                     }, "*");
//                 });
//             } catch (e) {
//                 Xrm.Navigation.openAlertDialog({ text: "Exception: " + e.message });
//             }
//         }
//     }

//     async function callSyncQuoteAPI(executionContext) {

//     var formContext = executionContext.getFormContext();

//     // Show processing indicator (OOB safe)
//     Xrm.Utility.showProgressIndicator("Processing... Please wait.");

//     // Check if sb1_quoteid already exists
//     var existingQuoteIdAttr = formContext.getAttribute("sb1_quoteid");
//     var existingQuoteId = existingQuoteIdAttr ? existingQuoteIdAttr.getValue() : null;

//     if (existingQuoteId) {
//         console.log("Quote already synced. Skipping API call.");
//         Xrm.Utility.closeProgressIndicator();
//         return;
//     }

//     try {
//         var formContext = executionContext.getFormContext();
//         var customerLookup = formContext.getAttribute("customerid").getValue();
//         if (!customerLookup || customerLookup.length === 0) {
//             Xrm.Utility.closeProgressIndicator();
//             Xrm.Navigation.openAlertDialog({ text: "Customer (Account) is required." });
//             return;
//         }

//         var accountId = customerLookup[0].id.replace("{", "").replace("}", "");

//         var accountResult = await Xrm.WebApi.online.retrieveRecord(
//             "account",
//             accountId,
//             "?$select=sb1_accountid"
//         );

//         var sb1AccountId = accountResult.sb1_accountid || "0";

//         var accName = customerLookup[0].name;
//         var folderName = formContext.getAttribute("name")?.getValue() || "";

//         var effDate = formContext.getAttribute("effectivefrom")?.getValue();
//         if (!effDate) {
//             Xrm.Utility.closeProgressIndicator();
//             Xrm.Navigation.openAlertDialog({ text: "Effective Date is empty." });
//             return;
//         }

//         var formattedDate = effDate.toISOString().split("T")[0];

//         var lob = formContext.getAttribute("sb1_lineofbusiness")?.getValue() || "";
//         var marketSeg = formContext.getAttribute("sb1_marketsegment")?.getValue() || "";
//         var funding = formContext.getAttribute("sb1_fundingarrangement")?.getValue() || "";
//         var state = formContext.getAttribute("sb1_state")?.getValue() || "";
//         var region = formContext.getAttribute("sb1_region")?.getValue() || "";

//         var body = {
//             "sb1_accid": sb1AccountId,
//             "sb1_accname": accName,
//             "sb1_foldername": folderName,
//             "sb1_foldereffdate": formattedDate,
//             "sb1_marketseg": marketSeg,
//             "sb1_lineofbusiness": lob,
//             "sb1_fundingarrangement": funding,
//             "sb1_state": state,
//             "sb1_region": region
//         };

//         var response = await fetch("/api/data/v9.1/sb1_syncquotewithb1", {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//                 "Accept": "application/json",
//                 "OData-MaxVersion": "4.0",
//                 "OData-Version": "4.0"
//             },
//             body: JSON.stringify(body)
//         });

//         if (!response.ok) {
//             Xrm.Utility.closeProgressIndicator();
//             var err = await response.text();
//             Xrm.Navigation.openAlertDialog({ text: "Error calling Custom API:\n" + err });
//             return;
//         }

//         var data = await response.json();
//         var syncResponse = JSON.parse(data.sb1_syncresponse);

//         var actualquoteFolderId = syncResponse?.Result?.Data?.EbsDetailsForCrm?.QuoteFolderId;
//         var quoteFolderId = syncResponse?.Result?.Data?.EbsAdditionalDetail?.FolderVersion?.FolderVersionId;

//         if (!quoteFolderId) {
//             Xrm.Utility.closeProgressIndicator();
//             Xrm.Navigation.openAlertDialog({
//                 text: "QuoteFolderId not found in response."
//             });
//             return;
//         }

//         formContext.getAttribute("sb1_quoteid").setValue(quoteFolderId.toString());
//         formContext.getAttribute("sb1_quoteid").setSubmitMode("always");
//         formContext.getAttribute("sb1_quotefolderid").setValue(actualquoteFolderId.toString());
//         formContext.getAttribute("sb1_quotefolderid").setSubmitMode("always");

//         await formContext.data.entity.save();

//         // Close processing indicator BEFORE showing success popup
//         Xrm.Utility.closeProgressIndicator();

//         Xrm.Navigation.openAlertDialog({
//             text: "Quote created successfully"
//         }, { title: "Quote" });

//     } catch (e) {
//         Xrm.Utility.closeProgressIndicator();
//         Xrm.Navigation.openAlertDialog({ text: "Exception: " + e.message });
//     }
// }

//     function onConfirmMessageChange(executionContext) {
//         var formContext = executionContext.getFormContext();

//         // Get the field value
//         var msg = formContext.getAttribute("sb1_confirmmessage").getValue();

//         // If field has data
//         if (msg && msg.trim() !== "") {

//             // Show message to user
//             Xrm.Navigation.openAlertDialog({ text: msg }, { title: "Quote" });

//             // Clear the field
//             formContext.getAttribute("sb1_confirmmessage").setValue(null);
//             formContext.getAttribute("sb1_confirmmessage").setSubmitMode("always");
//         }
//     }

//     //-----
//     async function callQuoteAPIforCopyQuote(executionContext) {

//         var formContext = executionContext.getFormContext();

//         // 🔹 Only Renewal
//         if (formContext.getAttribute("sb1_quotetype")?.getValue() !== 2) return;

//         var effDate = formContext.getAttribute("effectivefrom")?.getValue();
//         if (!effDate) return;

//         try {

//             var body = {
//                 sb1_effdate: effDate.toISOString()
//             };

//             var response = await fetch("/api/data/v9.1/sb1_getquotedetailsfromdate", {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                     "Accept": "application/json",
//                     "OData-MaxVersion": "4.0",
//                     "OData-Version": "4.0"
//                 },
//                 body: JSON.stringify(body)
//             });

//             if (!response.ok) {
//                 throw new Error(await response.text());
//             }

//             var data = await response.json();
//             var details = JSON.parse(data.sb1_getdetails);
//             var lists = details.Result.Data;

//             var iframe = formContext.getControl("WebResource_quotefields");
//             if (!iframe) return;

//             iframe.getContentWindow().then(function (win) {
//                 win.postMessage({
//                     StateList: lists.StateList,
//                     RegionList: lists.RegionList,
//                     FundingList: lists.FundingArrangementList,
//                     LOBList: lists.LineOfBusinessList,
//                     MarketSegmentList: lists.MarketSegmentList
//                 }, "*");
//             });

//         } catch (e) {
//             Xrm.Navigation.openAlertDialog({ text: "API Error: " + e.message });
//         }
//     }

//     /* async function openQuoteDocument(primaryControl) {
 
//      try {
 
//          const response = await fetch(
//              "/api/data/v9.1/zen__getdocumentnames",
//              {
//                  method: "POST",
//                  headers: {
//                      "Content-Type": "application/json",
//                      "Accept": "application/json",
//                      "OData-MaxVersion": "4.0",
//                      "OData-Version": "4.0"
//                  },
//                  body: JSON.stringify({}) // no input params
//              }
//          );
 
//          if (!response.ok) {
//              throw new Error(await response.text());
//          }
 
//          const data = await response.json();
 
//          // Parse returned JSON
//          const apiResult = JSON.parse(data.zen_docnames);
 
//          console.log("Document Names:", apiResult);
 
//          // Example usage
//          const templates = apiResult.Result?.Data || [];
 
//          Xrm.Navigation.openAlertDialog({
//              text: `Templates received: ${templates.length}`
//          });
 
//      } catch (e) {
//          Xrm.Navigation.openAlertDialog({
//              text: "API Error: " + e.message
//          });
//      }
//  }*/

//     /*async function openQuoteDocument(primaryControl) {
//         try {
//             const response = await fetch(
//                 "/api/data/v9.1/zen__getdocumentnames",
//                 {
//                     method: "POST",
//                     headers: {
//                         "Content-Type": "application/json",
//                         "Accept": "application/json",
//                         "OData-MaxVersion": "4.0",
//                         "OData-Version": "4.0"
//                     },
//                     body: JSON.stringify({})
//                 }
//             );
    
//             if (!response.ok) {
//                 throw new Error(await response.text());
//             }
    
//             const data = await response.json();
//             const apiResult = JSON.parse(data.zen_docnames);
//             const templates = apiResult.Result?.Data || [];
//     console.log("API Raw Response:", data);
//     console.log("Parsed API Result:", apiResult);
//     console.log("Templates Array:", templates);
    
//             // Open HTML Web Resource and pass data
//             const pageInput = {
//                 pageType: "webresource",
//                 webresourceName: "sb1_createquotedocument.html",
//                 data: JSON.stringify(templates)   // 👈 pass templates
//             };
    
//             const navigationOptions = {
//                 target: 2,          // Dialog
//                 width: 400,
//                 height: 270,
//                 position: 1
//             };
    
//             Xrm.Navigation.navigateTo(pageInput, navigationOptions);
    
//         } catch (e) {
//             Xrm.Navigation.openAlertDialog({
//                 text: "API Error: " + e.message
//             });
//         }
//     }*/

//     async function openQuoteDocument(primaryControl) {
//         try {
//             const quoteId = primaryControl.data.entity.getId().replace(/[{}]/g, "");

//             const response = await fetch(
//                 "/api/data/v9.1/zen__getdocumentnames",
//                 {
//                     method: "POST",
//                     headers: {
//                         "Content-Type": "application/json",
//                         "Accept": "application/json",
//                         "OData-MaxVersion": "4.0",
//                         "OData-Version": "4.0"
//                     },
//                     body: JSON.stringify({})
//                 }
//             );

//             if (!response.ok) {
//                 throw new Error(await response.text());
//             }

//             const data = await response.json();
//             const apiResult = JSON.parse(data.zen_docnames);
//             const templates = apiResult.Result?.Data || [];

//             // 👇 Pass BOTH templates and quoteId
//             const pageInput = {
//                 pageType: "webresource",
//                 webresourceName: "sb1_createquotedocument.html",
//                 data: JSON.stringify({
//                     templates: templates,
//                     quoteId: quoteId
//                 })
//             };

//             const navigationOptions = {
//                 target: 2,
//                 width: 400,
//                 height: 270,
//                 position: 1
//             };

//             Xrm.Navigation.navigateTo(pageInput, navigationOptions);

//         } catch (e) {
//             Xrm.Navigation.openAlertDialog({
//                 text: "API Error: " + e.message
//             });
//         }
//     }

//     /*function quoteDocGeneration(primaryControl) {
//         var formContext = primaryControl;
    
//         // Current record info (Email)
//         var recordId = formContext.data.entity.getId().replace("{", "").replace("}", "");
//         var entityName = formContext.data.entity.getEntityName();
    
//         // Get Quote lookup value
//         var quoteLookup = formContext.getAttribute("sb1_quoteid")?.getValue();
//         var quoteId = null;
    
//         if (quoteLookup && quoteLookup.length > 0) {
//             quoteId = quoteLookup[0].id.replace("{", "").replace("}", "");
//         }
    
//         var pageInput = {
//             pageType: "custom",
//             name: "sb1_quotedocgeneration_4fe01",
//             parameters: {
//                 recordId: recordId,
//                 entityName: entityName,
//                 quoteId: quoteId   // 👈 pass to canvas app
//             }
//         };
    
//         var navigationOptions = {
//             target: 2,
//             position: 1,
//             width: 1510,
//             height: 600,
//             title: "Create Quote Document"
//         };
    
//         Xrm.Navigation.navigateTo(pageInput, navigationOptions);
//     }*/

//     //
//     /*function quoteDocGeneration(primaryControl) {
//         var formContext = primaryControl;
    
//         // ✅ Get recordId safely
//         var recordId = formContext.data.entity.getId();
//         if (!recordId) {
//             Xrm.Navigation.openAlertDialog({
//                 text: "Please save the record before generating the Quote document."
//             });
//             return;
//         }
//         recordId = recordId.replace("{", "").replace("}", "");
    
//         var entityName = formContext.data.entity.getEntityName();
    
//         // ✅ Get Quote lookup safely
//         var quoteId = null;
//         var quoteAttr = formContext.getAttribute("sb1_quoteid");
    
//         if (quoteAttr) {
//             var quoteLookup = quoteAttr.getValue();
//             if (quoteLookup && quoteLookup.length > 0 && quoteLookup[0].id) {
//                 quoteId = quoteLookup[0].id.replace("{", "").replace("}", "");
//             }
//         }
    
//         var pageInput = {
//             pageType: "custom",
//             name: "sb1_quotedocgeneration_4fe01",
//             parameters: {
//                 recordId: recordId,
//                 entityName: entityName,
//                 quoteId: quoteId
//             }
//         };
    
//         var navigationOptions = {
//             target: 2,
//             position: 1,
//             width: 1510,
//             height: 700,
//             title: "Create Quote Document"
//         };
    
//         Xrm.Navigation.navigateTo(pageInput, navigationOptions);
//     }
//     */


//     //duplicate
//     async function quoteDocGeneration(primaryControl) {
//         try {
//             // Get the Quote ID
//             const quoteId = primaryControl.data.entity.getId().replace(/[{}]/g, "");

//             // Prepare canvas page navigation
//             const pageInput = {
//                 pageType: "custom",
//                 name: "sb1_quotedocgeneration_4fe01",
//                 recordId: quoteId,  // Pass the Quote GUID
//                 entityName: "quote" // optional, can be anything your canvas page expects
//             };

//             const navigationOptions = {
//                 target: 2,   // Opens in a dialog
//                 width: 1510,
//                 height: 600,
//                 position: 1,
//                 title: "Create Quote Document"
//             };

//             Xrm.Navigation.navigateTo(pageInput, navigationOptions);

//         } catch (e) {
//             Xrm.Navigation.openAlertDialog({
//                 text: "Error opening canvas page: " + e.message
//             });
//         }
//     }

//     function onOpportunityChange(executionContext) {

//         var formContext = executionContext.getFormContext();
//         var opportunity = formContext.getAttribute("opportunityid").getValue();

//         if (!opportunity) {
//             return;
//         }

//         var opportunityId = opportunity[0].id.replace(/[{}]/g, "");

//         Xrm.WebApi.retrieveRecord(
//             "opportunity",
//             opportunityId,
//             "?$select=_parentaccountid_value"
//         ).then(
//             function (result) {
//                 if (result._parentaccountid_value) {
//                     var customerLookup = [{
//                         id: result._parentaccountid_value,
//                         name: result["_parentaccountid_value@OData.Community.Display.V1.FormattedValue"],
//                         entityType: "account"
//                     }];

//                     formContext.getAttribute("customerid").setValue(customerLookup);
//                 }
//             },
//             function (error) {
//                 console.error("Error retrieving opportunity:", error.message);
//             }
//         );
//     }

//     /**
//      * Adds filter so only Opportunities of selected Account are shown
//      */

//     var opportunityPreSearchHandler = null;


//     function onAccountChange(executionContext) {

//         var formContext = executionContext.getFormContext();

//         // Run only on Create form
//         if (formContext.ui.getFormType() !== 1) {
//             return;
//         }

//         var customerAttr = formContext.getAttribute("customerid");
//         var opportunityAttr = formContext.getAttribute("opportunityid");
//         var opportunityCtrl = formContext.getControl("opportunityid");

//         if (!customerAttr || !opportunityCtrl) {
//             return;
//         }

//         var customer = customerAttr.getValue();

//         // 🔹 Account cleared
//         if (!customer) {
//             if (opportunityAttr.getValue() !== null) {
//                 opportunityAttr.setValue(null);
//             }

//             if (opportunityPreSearchHandler) {
//                 opportunityCtrl.removePreSearch(opportunityPreSearchHandler);
//                 opportunityPreSearchHandler = null;
//             }
//             return;
//         }

//         var accountId = customer[0].id.replace(/[{}]/g, "");

//         // 🔹 Clear Opportunity on Account change
//         if (opportunityAttr.getValue() !== null) {
//             opportunityAttr.setValue(null);
//         }

//         // 🔹 Remove old filter (IMPORTANT)
//         if (opportunityPreSearchHandler) {
//             opportunityCtrl.removePreSearch(opportunityPreSearchHandler);
//         }

//         // 🔹 Create new filter handler
//         opportunityPreSearchHandler = function () {
//             var filterXml =
//                 "<filter type='and'>" +
//                 "<condition attribute='parentaccountid' operator='eq' value='" + accountId + "' />" +
//                 "</filter>";

//             opportunityCtrl.addCustomFilter(filterXml, "opportunity");
//         };

//         // 🔹 Add new filter
//         opportunityCtrl.addPreSearch(opportunityPreSearchHandler);
//     }

//     function lockWhenNotEmpty(executionContext) {
//         var formContext = executionContext.getFormContext();
//         // Form Types:
//         // 1 = Create
//         // 2 = Update
//         var formType = formContext.ui.getFormType();

//         // Run only on Create & Update
//         if (formType !== 1 && formType !== 2) {
//             return;
//         }

//         var customerAttr = formContext.getAttribute("customerid");
//         var opportunityAttr = formContext.getAttribute("opportunityid");

//         var customerCtrl = formContext.getControl("customerid");
//         var opportunityCtrl = formContext.getControl("opportunityid");

//         if (!customerCtrl || !opportunityCtrl) {
//             return;
//         }

//         var isCustomerFilled =
//             customerAttr && customerAttr.getValue() !== null;

//         var isOpportunityFilled =
//             opportunityAttr && opportunityAttr.getValue() !== null;

//         // Lock both if either has value
//         if (isCustomerFilled || isOpportunityFilled) {
//             customerCtrl.setDisabled(true);
//             opportunityCtrl.setDisabled(true);
//         } else {
//             customerCtrl.setDisabled(false);
//             opportunityCtrl.setDisabled(false);
//         }

//     }
//     return {
//         onLoad: onLoad,
//         toggleProductTab: toggleProductTab,
//         validateAndToggleSections: validateAndToggleSections,
//         toggleSections: toggleSections,
//         navigateToTab: navigateToTab,
//         populateBrokerId: populateBrokerId,
//         validateEffectiveFromDate: validateEffectiveFromDate,
//         onGridRowSelectedsetReadonly: onGridRowSelectedsetReadonly,
//         onSubgridFieldChange: onSubgridFieldChange,
//         onSubgridFieldChange2: onSubgridFieldChange2,
//         onSubgridLookupChange: onSubgridLookupChange,
//         openCustomPageDialog: openCustomPageDialog,
//         callFrame: callFrame,
//         openCustomPageDialog2: openCustomPageDialog2,
//         registerTabChange: registerTabChange,
//         renewQuote: renewQuote,
//         callQuoteAPI: callQuoteAPI,
//         callSyncQuoteAPI: callSyncQuoteAPI,
//         onConfirmMessageChange: onConfirmMessageChange,
//         callQuoteAPIforCopyQuote: callQuoteAPIforCopyQuote,
//         openQuoteDocument: openQuoteDocument,
//         quoteDocGeneration: quoteDocGeneration,
//         onOpportunityChange: onOpportunityChange,
//         onAccountChange: onAccountChange,
//         lockWhenNotEmpty: lockWhenNotEmpty,
//         disableOpportunityWhenEmptyAccount: disableOpportunityWhenEmptyAccount,
//         onChange: onChange
//     };
// })();
var SB1 = SB1 || {};
SB1.Quote = (function () {
    "use strict";

    function onLoad(executionContext) {

        //SB1.Quote.triggercallQuoteAPI(executionContext);
        SB1.Quote.onChange(executionContext);
        SB1.Quote.navigateToTab(executionContext);
        SB1.Quote.toggleSections(executionContext);
        SB1.Quote.toggleProductTab(executionContext);
        SB1.Quote.onConfirmMessageChange(executionContext);
        SB1.Quote.callQuoteAPIforCopyQuote(executionContext);
        SB1.Quote.lockWhenNotEmpty(executionContext);
        //SB1.Quote.disableOpportunityWhenEmptyAccount(executionContext);
    }

    function onChange(executionContext) {
        var formContext = executionContext.getFormContext();
        formContext.getAttribute("customerid").addOnChange(disableOpportunityWhenEmptyAccount);
    }

    function disableOpportunityWhenEmptyAccount(executionContext) {
        var formContext = executionContext.getFormContext();
        var formType = formContext.ui.getFormType();
        // 1 = Create, 2 = Update
        if (formType !== 1) return;
        var quoteType = formContext.getAttribute("sb1_quotetype").getValue();

        // Run logic only if quote type is 0 (New) or 2 (Copy Quote)
        if (quoteType === 0 || quoteType === 2) {

            var customer = formContext.getAttribute("customerid").getValue();
            var opportunityControl = formContext.getControl("opportunityid");

            if (customer !== null) {
                opportunityControl.setDisabled(false);
            } else {
                opportunityControl.setDisabled(true);
                // Optional: clear value when disabled
                // formContext.getAttribute("opportunityid").setValue(null);
            }

        } else {
            // For other quote types, always enable the field (or do nothing)
            var opportunityControl = formContext.getControl("opportunityid");
            opportunityControl.setDisabled(false);
        }
    }

    function toggleProductTab(executionContext) {
        var formContext = executionContext.getFormContext();

        // Check Create vs Update mode
        var isCreate = formContext.ui.getFormType() === 1;

        var tab = formContext.ui.tabs.get("tab_productnamepage");

        if (tab) {
            if (isCreate) {
                // Hide tab in Create mode
                tab.setVisible(false);
            } else {
                // Show tab after save (Update mode)
                tab.setVisible(true);
            }
        }
    }


    function validateAndToggleSections(executionContext) {
        var formContext = executionContext.getFormContext();
        var eventArgs = executionContext.getEventArgs ? executionContext.getEventArgs() : null;

        // Clear old notifications
        formContext.ui.clearFormNotification("RequiredFieldsError");

        // Sections inside Summary_tab
        var oobSection = formContext.ui.tabs.get("Summary_tab").sections.get("sec_oobfields");
        var htmlSection = formContext.ui.tabs.get("Summary_tab").sections.get("sec_htmlweb");

        // Map CRM logical names → Display names
        var fieldMap = {
            "sb1_state": "State",
            "sb1_region": "Region",
            "sb1_fundingarrangement": "Funding Arrangement",
            "sb1_lineofbusiness": "Line of Business",
            "sb1_marketsegment": "Market Segment"
        };

        var missingFields = [];

        // Check missing fields using logical names
        Object.keys(fieldMap).forEach(function (logicalName) {
            var attr = formContext.getAttribute(logicalName);
            if (!attr || attr.getValue() == null || attr.getValue() === "") {
                missingFields.push(fieldMap[logicalName]);  // PUSH DISPLAY NAME
            }
        });

        // 🔴 If save triggered & missing fields exist → block save + show form notification
        if (eventArgs && missingFields.length > 0) {
            eventArgs.preventDefault();

            formContext.ui.setFormNotification(
                "Please fill all required fields: " + missingFields.join(", "),
                "ERROR",
                "RequiredFieldsError"
            );

            return false;
        }

        // Toggle section based on values
        var allFilled = missingFields.length === 0;

        if (allFilled) {
            oobSection.setVisible(true);
            htmlSection.setVisible(false);
        } else {
            htmlSection.setVisible(true);
            oobSection.setVisible(false);
        }

        return true;
    }


    /*function toggleSections(executionContext) {
    var formContext = executionContext.getFormContext();
     var quoteTypeAttr = formContext.getAttribute("sb1_quotetype");
    if (!quoteTypeAttr) return; // field not found
    var quoteType = quoteTypeAttr.getValue();
    if (quoteType === 0 && quoteType === 1){

    // Section names
    var oobSection = formContext.ui.tabs.get("Summary_tab").sections.get("sec_oobfields");
    var htmlSection = formContext.ui.tabs.get("Summary_tab").sections.get("sec_htmlweb");

    // CRM Fields
    var fields = [
        "sb1_state",
        "sb1_region",
        "sb1_fundingarrangement",
        "sb1_lineofbusiness",
        "sb1_marketsegment"
    ];

    // Check if ANY CRM field has value
    var hasValue = fields.some(f => {
        var attr = formContext.getAttribute(f);
        return attr && attr.getValue() != null && attr.getValue() !== "";
    });

    // Toggle visibility
    if (hasValue) {
        // Show CRM fields section
        oobSection.setVisible(true);
        // Hide HTML section
        htmlSection.setVisible(false);
    } else {
        // Show HTML section
        htmlSection.setVisible(true);
        // Hide CRM fields section
        oobSection.setVisible(false);
    }
    }
}*/

    function toggleSections(executionContext) {
        var formContext = executionContext.getFormContext();
        var quoteTypeAttr = formContext.getAttribute("sb1_quotetype");
        if (!quoteTypeAttr) return; // field not found

        var quoteType = quoteTypeAttr.getValue();

        // Section names
        var oobSection = formContext.ui.tabs.get("Summary_tab").sections.get("sec_oobfields");
        var htmlSection = formContext.ui.tabs.get("Summary_tab").sections.get("sec_htmlweb");

        // Case 1: Quote type 0 or 1
        if (quoteType === 0 || quoteType === 1) {
            // CRM Fields to check
            var fields = [
                "sb1_state",
                "sb1_region",
                "sb1_fundingarrangement",
                "sb1_lineofbusiness",
                "sb1_marketsegment"
            ];

            // Check if ANY CRM field has value
            var hasValue = fields.some(f => {
                var attr = formContext.getAttribute(f);
                return attr && attr.getValue() != null && attr.getValue() !== "";
            });

            // Toggle visibility
            if (hasValue) {
                oobSection.setVisible(true);
                htmlSection.setVisible(false);
            } else {
                htmlSection.setVisible(true);
                oobSection.setVisible(false);
            }

        }
        // Case 2: Quote type 2 (Renewal)
        else if (quoteType === 2) {
            var formType = formContext.ui.getFormType(); // 1 = Create
            if (formType === 1) { // Create mode
                htmlSection.setVisible(true);
                oobSection.setVisible(false);
            } else { // Other modes (Update, ReadOnly)
                oobSection.setVisible(true);
                htmlSection.setVisible(false);
            }
        }
    }



    function navigateToTab(executionContext) {
        try {
            const form = executionContext.getFormContext();

            // Get the tab
            const tab = form.ui.tabs.get("tab_productnamepage");

            if (!tab) {
                console.error("Tab not found: " + "tab_productnamepage");
                return;
            }

            // Focus the tab
            tab.setFocus();
            setTimeout(() => {
                const summaryTab = form.ui.tabs.get("Summary_tab");
                if (summaryTab) {
                    summaryTab.setFocus();
                    console.log("Navigated to Summary tab");
                } else {
                    console.error("Summary tab not found");
                }
            }, 1500);

            console.log("Navigated to tab: " + "Summary_tab");

        } catch (error) {
            console.error("Error navigating to tab: ", error);
        }
    }


    function populateBrokerId(executionContext) {
        var formContext = executionContext.getFormContext();
        var brokerLookup = formContext.getAttribute("sb1_broker").getValue();

        if (brokerLookup && brokerLookup.length > 0) {
            var brokerId = brokerLookup[0].id.replace("{", "").replace("}", "");

            Xrm.WebApi.retrieveRecord("sb1_broker", brokerId, "?$select=sb1_broker_id").then(
                function success(result) {
                    if (result && result.sb1_broker_id) {

                        formContext.getAttribute("sb1_brokerid").setValue(result.sb1_broker_id);
                    } else {
                        formContext.getAttribute("sb1_brokerid").setValue(null);
                    }
                },
                function (error) {
                    console.error("Error fetching Broker record: ", error.message);
                    formContext.getAttribute("sb1_brokerid").setValue(null);
                }
            );
        } else {
            formContext.getAttribute("sb1_brokerid").setValue(null);
        }
    }

    function validateEffectiveFromDate(executionContext) {
        var formContext = executionContext.getFormContext();
        var dateAttr = formContext.getAttribute("effectivefrom");

        // Clear any existing notifications first
        formContext.ui.clearFormNotification("EffectiveFromDateError");

        if (!dateAttr) return;

        var selectedDate = dateAttr.getValue();
        if (!selectedDate) return;

        // Remove time part from selected date for accurate comparison
        selectedDate.setHours(0, 0, 0, 0);

        // Define the minimum allowed date: January 1, 2024
        var minAllowedDate = new Date(2024, 0, 1); // Month is 0-based (0 = January)
        minAllowedDate.setHours(0, 0, 0, 0);

        // If the selected date is before Jan 1, 2024, show error and clear field
        if (selectedDate < minAllowedDate) {
            formContext.getAttribute("effectivefrom").setValue(null);

            formContext.ui.setFormNotification(
                "Copy of quote with an effective date prior to January 1, 2024 is not allowed.",
                "ERROR",
                "EffectiveFromDateError"
            );
        }
    }



    function onGridRowSelectedsetReadonly(context) {

        context.getFormContext().getData().getEntity().attributes.forEach(function (attr) {
            if (attr.getName() === "sb1_effectivedate") {
                attr.controls.forEach(function (myField) {
                    myField.setDisabled(true);
                });
            }
            if (attr.getName() === "sb1_producttype") {
                attr.controls.forEach(function (myField) {
                    myField.setDisabled(true);
                });
            }
        });
    }

    function onSubgridFieldChange(eventContext) {
        var gridContext = eventContext.getFormContext(); // Editable grid context
        var eventSource = eventContext.getEventSource(); // The field/column that triggered change
        var columnName = eventSource.getName();

        // Only proceed if sb1_document field changed
        if (columnName !== "sb1_document") {
            return;
        }

        var row = eventSource.getParent(); // Get row
        var selectedValue = eventSource.getValue(); // For Choice fields, this is an integer

        if (selectedValue !== null) {
            var optionLabel = getOptionLabel(selectedValue);

            var alertStrings = {
                confirmButtonLabel: "OK",
                text: `You selected option value: ${selectedValue} (${optionLabel})`,
                title: "Choice Changed"
            };
            var alertOptions = { height: 120, width: 260 };
            Xrm.Navigation.openAlertDialog(alertStrings, alertOptions);
        }
    }

    // Optional helper to map OptionSet values to labels
    function getOptionLabel(value) {
        var options = {
            918580000: "Benefit Description",
            918580001: "Handbook-1.0",
            918580002: "HIPAA Codification",
            918580003: "SBC Filing"
            // Add more as needed
        };
        return options[value] || "Unknown";
    }

    function onSubgridFieldChange2(executionContext) {
        var formContext = executionContext.getFormContext();
        var eventSource = executionContext.getEventSource();

        var row = eventSource.getParent();
        if (!row) {
            console.warn("No row context available.");
            return;
        }

        var recordId = row.getId().replace(/[{}]/g, "");
        var selectedValue = eventSource.getValue();
        var documentLabel = getOptionLabel(selectedValue);

        openSelectDownloadDialog(recordId, documentLabel);
    }

    function onSubgridLookupChange(executionContext) {
        try {
            var formContext = executionContext.getFormContext();
            var eventSource = executionContext.getEventSource();

            var row = eventSource.getParent();
            if (!row) {
                console.warn("No row context available.");
                return;
            }

            var recordId = row.getId().replace(/[{}]/g, "");

            // Get lookup field value (returns array)
            var lookupValue = eventSource.getValue();
            if (!lookupValue || lookupValue.length === 0) {
                console.warn("Lookup field is empty.");
                return;
            }

            // Extract lookup details
            var lookupId = lookupValue[0].id.replace(/[{}]/g, "");
            var lookupName = lookupValue[0].name;  // This is the name you want to display
            var lookupEntity = lookupValue[0].entityType;

            console.log("Selected Lookup:", lookupId, lookupName, lookupEntity);

            // Open your popup with document name
            openSelectDownloadDialog(recordId, lookupName);
        } catch (e) {
            console.error("Error in onSubgridLookupChange:", e);
        }
    }


    function openSelectDownloadDialog(recordId, documentLabel) {
        var dataParams = `recordId=${recordId}&documentLabel=${encodeURIComponent(documentLabel)}`;

        var pageInput = {
            pageType: "webresource",
            webresourceName: "sb1_/script/quote/selectdownload",
            data: encodeURIComponent(dataParams)
        };

        var navigationOptions = {
            target: 2,
            width: 500,
            height: 400,
            position: 1,
            title: "Download Document"
        };

        Xrm.Navigation.navigateTo(pageInput, navigationOptions).then(
            function () {
                console.log("Download dialog closed.");
            },
            function (error) {
                console.error("Dialog error:", error);
            }
        );
    }


    function openCustomPageDialog(primaryControl, selectedControlSelectedItemIds, selectedEntityTypeName) {

        //var cleanIds = selectedControlSelectedItemIds.replace(/{|}/g, '').replace(/\s/g, '');
        // Centered Dialog
        var pageInput = {
            pageType: "custom",
            name: "sb1_documentdownloadpage_8a4ab",
            entityName: selectedEntityTypeName, // "sample_review"
            recordId: selectedControlSelectedItemIds// "{087AA308-B321-E811-A845-000D3A33A3AC}" 
        };
        var navigationOptions = {
            target: 2,
            position: 1,
            height: {
                value: 550,
                unit: "px"
            },
            width: {
                value: 70,
                unit: "%"
            },
            title: "Document Download"
        };
        Xrm.Navigation.navigateTo(pageInput, navigationOptions).then(
            function () {
                // Refresh the main form when the dialog is closed
                primaryControl.data.refresh();
            }
        ).catch(
            function (error) {
                // Handle error
            }
        );
    }

    function callFrame(executionContext) {
        var formContext = executionContext.getFormContext();

        // Get record ID and remove curly braces
        var recordId = formContext.data.entity.getId();
        if (recordId) {
            recordId = recordId.replace(/[{}]/g, "");
        }

        // Build custom page URL
        // Format: main.aspx?pagetype=custom&name=<sb1_documentdownloadpage_8a4ab>&recordId=<guid>
        var customPageName = "sb1_documentdownloadpage_8a4ab";
        var pageUrl = formContext.context.getClientUrl()
            + "/main.aspx?pagetype=custom"
            + "&name=" + encodeURIComponent(customPageName)
            + "&recordId=" + encodeURIComponent(recordId);

        // Get iframe control
        var iframeControl = formContext.getControl("IFRAME_downloadframe");
        if (iframeControl) {
            iframeControl.setSrc(pageUrl);
        }
    }

    function openCustomPageDialog2(executioncontext) {

        //var cleanIds = selectedControlSelectedItemIds.replace(/{|}/g, '').replace(/\s/g, '');
        // Centered Dialog
        var pageInput = {
            pageType: "custom",
            name: "sb1_documentdownloadpage_8a4ab",
            //entityName: selectedEntityTypeName, // "sample_review"
            //recordId: selectedControlSelectedItemIds// "{087AA308-B321-E811-A845-000D3A33A3AC}" 
        };
        var navigationOptions = {
            target: 2,
            position: 1,
            height: {
                value: 550,
                unit: "px"
            },
            width: {
                value: 70,
                unit: "%"
            },
            title: "Document Download"
        };
        Xrm.Navigation.navigateTo(pageInput, navigationOptions).then(
            function () {
                // Refresh the main form when the dialog is closed
                primaryControl.data.refresh();
            }
        ).catch(
            function (error) {
                // Handle error
            }
        );
    }
    function registerTabChange(executionContext) {
        var formContext = executionContext.getFormContext();
        var tab = formContext.ui.tabs.get("tab_productnamepagecanvas");

        if (!tab) return;

        tab.addTabStateChange(function () {
            if (tab.getDisplayState() === "expanded") {
                openCanvasPageA(formContext);
            }
        });
    }

    function openCanvasPageA(formContext) {
        var recordid = formContext.getAttribute("sb1_quoteid").getValue();

        var pageInput = {
            pageType: "custom",
            name: "sb1_documentdownloadpage_8a4ab",
            quoteId: recordid
        };

        var navigationOptions = {
            target: 2,
            position: 1,
            height: { value: 650, unit: "px" },
            width: { value: 100, unit: "%" },
            title: "Quote Products"
        };

        Xrm.Navigation.navigateTo(pageInput, navigationOptions)
            .then(function (result) {
                console.log("Canvas A returned result:", result);
                openProductSearchPage(formContext);
                formContext.data.refresh();
            })
            .catch(function (error) {
                console.error("Navigation Error:", error);
            });
    }

    function openProductSearchPage(primaryControl) {
        console.log("product search page is called");
        debugger;
        var quoteId = primaryControl.data.entity.getId().replace(/[{}]/g, "");

        var pageInput = {
            pageType: "custom",
            name: "sb1_productsearchpage_a963f",
            entityName: "quote",
            recordId: quoteId,
            pageInputParams: { recordId: quoteId }
        };

        var navOptions = {
            target: 2,
            position: 1,
            width: { value: 90, unit: "%" },
            height: { value: 90, unit: "%" },
            title: "Add Products",
            hideNavBar: true
        };

        Xrm.Navigation.navigateTo(pageInput, navOptions)
            .then(function (result) {
                if (result === "success") {
                    Xrm.Utility.showToast({
                        message: "Products added successfully",
                        type: 1
                    });
                    primaryControl.data.refresh();
                }
            })
            .catch(err => console.error(err));
    }


    async function renewQuote(primaryControl) {
        debugger;
        console.log("Primary Control:", primaryControl);

        if (!primaryControl.getGrid) {
            console.error("Not a grid context.");
            return;
        }

        var grid = primaryControl.getGrid();
        var selectedRows = grid.getSelectedRows();

        if (selectedRows.getLength() === 0) {
            Xrm.Navigation.openAlertDialog({ text: "Please select a quote to renew." });
            return;
        }

        var selectedRow = selectedRows.getAll()[0];
        var quoteId = selectedRow.getData().getEntity().getId().replace("{", "").replace("}", "");
        console.log("Quote ID:", quoteId);

        // Retrieve existing quote record
        Xrm.WebApi.retrieveRecord(
            "quote",
            quoteId,
            "?$select=_customerid_value,effectivefrom,effectiveto,description,_pricelevelid_value,sb1_lineofbusiness,_sb1_quoteworkflowconfiguration_value,sb1_marketsegment,sb1_region,sb1_brokerid,_sb1_broker_value,name,billto_line1,billto_line2,billto_city,sb1_billtostate,billto_postalcode,sb1_billtocountry,totallineitemamount,discountpercentage,discountamount,totaltax,totalamount,_opportunityid_value,sb1_quotename,sb1_numberofsubscribers,sb1_numberofmembers,sb1_minage,sb1_maxage,sb1_averageage,sb1_lineofbusiness,sb1_marketsegment,sb1_fundingarrangement,sb1_state,sb1_region"
        ).then(
            function (result) {
                var formParameters = {
                    name: result.name,
                    description: result.description,
                    sb1_quotetype: 1, // Directly set quotetype = 1
                    effectivefrom: result.effectivefrom,
                    effectiveto: result.effectiveto,
                    sb1_region: result.sb1_region,
                    sb1_marketsegment: result.sb1_marketsegment,
                    sb1_lineofbusiness: result.sb1_lineofbusiness,
                    sb1_brokerid: result.sb1_brokerid,
                    sb1_numberofsubscribers: result.sb1_numberofsubscribers,
                    sb1_numberofmembers: result.sb1_numberofmembers,
                    sb1_minage: result.sb1_minage,
                    sb1_maxage: result.sb1_maxage,
                    sb1_averageage: result.sb1_averageage,
                    billto_line1: result.billto_line1,
                    billto_line2: result.billto_line2,
                    billto_city: result.billto_city,
                    sb1_billtostate: result.sb1_billtostate,
                    billto_postalcode: result.billto_postalcode,
                    sb1_billtocountry: result.sb1_billtocountry,
                    totallineitemamount: result.totallineitemamount,
                    discountpercentage: result.discountpercentage,
                    discountamount: result.discountamount,
                    totaltax: result.totaltax,
                    totalamount: result.totalamount,
                    sb1_lineofbusiness: result.sb1_lineofbusiness,
                    sb1_marketsegment: result.sb1_marketsegment,
                    sb1_fundingarrangement: result.sb1_fundingarrangement,
                    sb1_state: result.sb1_state,
                    sb1_region: result.sb1_region
                };

                // 🔹 Customer lookup
                if (result._customerid_value) {
                    formParameters["customerid"] = result._customerid_value;
                    formParameters["customeridname"] =
                        result["_customerid_value@OData.Community.Display.V1.FormattedValue"];
                    formParameters["customeridtype"] =
                        result["_customerid_value@Microsoft.Dynamics.CRM.lookuplogicalname"];
                }

                // 🔹 Price List lookup
                if (result._pricelevelid_value) {
                    formParameters["pricelevelid"] = result._pricelevelid_value;
                    formParameters["pricelevelidname"] =
                        result["_pricelevelid_value@OData.Community.Display.V1.FormattedValue"];
                    formParameters["pricelevelidtype"] =
                        result["_pricelevelid_value@Microsoft.Dynamics.CRM.lookuplogicalname"];
                }

                // 🔥🔥 NEW: Auto populate Source Quote
                formParameters["sb1_sourcequote"] = quoteId;
                formParameters["sb1_sourcequotename"] = result.name;
                formParameters["sb1_sourcequotetype"] = "quote";

                var entityFormOptions = {
                    entityName: "quote",
                    useQuickCreateForm: false
                };

                // 🔹 Opportunity lookup
                if (result._opportunityid_value) {
                    formParameters["opportunityid"] = result._opportunityid_value;
                    formParameters["opportunityidname"] =
                        result["_opportunityid_value@OData.Community.Display.V1.FormattedValue"];
                    formParameters["opportunityidtype"] =
                        result["_opportunityid_value@Microsoft.Dynamics.CRM.lookuplogicalname"];
                }

                // 🔹 Broker lookup
                if (result._sb1_broker_value) {
                    formParameters["sb1_broker"] = result._sb1_broker_value;
                    formParameters["sb1_brokername"] =
                        result["_sb1_broker_value@OData.Community.Display.V1.FormattedValue"];
                    formParameters["sb1_brokertype"] =
                        result["_sb1_broker_value@Microsoft.Dynamics.CRM.lookuplogicalname"];
                }

                if (result._sb1_quoteworkflowconfiguration_value) {
                    formParameters["sb1_quoteworkflowconfiguration"] = result._sb1_quoteworkflowconfiguration_value;
                    formParameters["_sb1_quoteworkflowconfiguration_value"] =
                        result["_sb1_quoteworkflowconfiguration_value@OData.Community.Display.V1.FormattedValue"];
                    formParameters["quoteworkflowconfigurationidtype"]
                    result["_sb1_quoteworkflowconfiguration_value@Microsoft.Dynamics.CRM.lookuplogicalname"];
                }


                console.log("Opening new quote form with parameters:", formParameters);

                // Open the new form
                Xrm.Navigation.openForm(entityFormOptions, formParameters).then(
                    function (success) {
                        console.log("Renew Quote form opened successfully!", success);

                        // Apply date validation logic
                        setTimeout(function () {
                            var formContext = Xrm.Page;
                            if (!formContext) return;

                            var choiceAttr = formContext.getAttribute("sb1_quotetype");

                            if (choiceAttr) {
                                console.log("QuoteType value:", choiceAttr.getValue());

                                if (choiceAttr.getValue() === 1) {
                                    restrictPastDates({ getFormContext: () => formContext });
                                } else if (choiceAttr.getValue() === 2) {
                                    validateEffectiveFormDate({ getFormContext: () => formContext });
                                }
                            }
                        }, 2500);
                    },
                    function (error) {
                        console.error("Error opening Quote form:", error.message);
                    }
                );
            },
            function (error) {
                console.error("Error retrieving Quote record:", error.message);
            }
        );
    }

    async function callQuoteAPI(executionContext) {   // get details from eff date to fill HTML WEB

        var formContext = executionContext.getFormContext();
        var quoteType = formContext.getAttribute("sb1_quotetype")?.getValue();

        if (quoteType === 0) {

            try {
                var formContext = executionContext.getFormContext();
                // 1️⃣ Get the date from the CRM form
                var effDate = formContext.getAttribute("effectivefrom").getValue();
                if (!effDate) {
                    Xrm.Navigation.openAlertDialog({ text: "Effective Date is empty." });
                    return;
                }
                // 2️⃣ Convert date to ISO format
                var formattedDate = effDate.toISOString();
                // 3️⃣ Create request body
                var body = {
                    "sb1_effdate": formattedDate
                };
                // 4️⃣ Call Custom API
                var response = await fetch("/api/data/v9.1/sb1_getquotedetailsfromdate", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json",
                        "OData-MaxVersion": "4.0",
                        "OData-Version": "4.0"
                    },
                    body: JSON.stringify(body)
                });
                if (!response.ok) {
                    var err = await response.text();
                    Xrm.Navigation.openAlertDialog({ text: "Error calling Custom API:\n" + err });
                    return;
                }
                // 5️⃣ Parse CRM response
                var data = await response.json();
                // 6️⃣ Parse the JSON inside sb1_getdetails
                var details = JSON.parse(data.sb1_getdetails);
                // 7️⃣ Extract actual lists
                var lists = details.Result.Data;
                // Debug popup
                // Xrm.Navigation.openAlertDialog({
                //     text: "PARSED RESPONSE:\n\n" + JSON.stringify(lists, null, 2)
                //  });
                // 8️⃣ Load the HTML Web Resource iframe
                var iframe = formContext.getControl("WebResource_quotefields");
                if (!iframe) {
                    console.log("HTML Webresource not found.");
                    return;
                }
                var contentWindow = iframe.getContentWindow();
                // 9️⃣ Send data to HTML Web Resource using postMessage
                contentWindow.then(function (win) {
                    win.postMessage({
                        StateList: lists.StateList,
                        RegionList: lists.RegionList,
                        FundingList: lists.FundingArrangementList,
                        LOBList: lists.LineOfBusinessList,
                        MarketSegmentList: lists.MarketSegmentList
                    }, "*");
                });
            } catch (e) {
                Xrm.Navigation.openAlertDialog({ text: "Exception: " + e.message });
            }
        }
    }

    async function callSyncQuoteAPI(executionContext) {

    var formContext = executionContext.getFormContext();

    // Show processing indicator (OOB safe)
    Xrm.Utility.showProgressIndicator("Processing... Please wait.");

    // Check if sb1_quoteid already exists
    var existingQuoteIdAttr = formContext.getAttribute("sb1_quoteid");
    var existingQuoteId = existingQuoteIdAttr ? existingQuoteIdAttr.getValue() : null;

    if (existingQuoteId) {
        console.log("Quote already synced. Skipping API call.");
        Xrm.Utility.closeProgressIndicator();
        return;
    }

    try {
        var formContext = executionContext.getFormContext();
        var customerLookup = formContext.getAttribute("customerid").getValue();
        if (!customerLookup || customerLookup.length === 0) {
            Xrm.Utility.closeProgressIndicator();
            Xrm.Navigation.openAlertDialog({ text: "Customer (Account) is required." });
            return;
        }

        var accountId = customerLookup[0].id.replace("{", "").replace("}", "");

        var accountResult = await Xrm.WebApi.online.retrieveRecord(
            "account",
            accountId,
            "?$select=sb1_accountid"
        );

        var sb1AccountId = accountResult.sb1_accountid || "0";

        var accName = customerLookup[0].name;
        var folderName = formContext.getAttribute("name")?.getValue() || "";

        var effDate = formContext.getAttribute("effectivefrom")?.getValue();
        if (!effDate) {
            Xrm.Utility.closeProgressIndicator();
            Xrm.Navigation.openAlertDialog({ text: "Effective Date is empty." });
            return;
        }

        var formattedDate = effDate.toISOString().split("T")[0];

        var lob = formContext.getAttribute("sb1_lineofbusiness")?.getValue() || "";
        var marketSeg = formContext.getAttribute("sb1_marketsegment")?.getValue() || "";
        var funding = formContext.getAttribute("sb1_fundingarrangement")?.getValue() || "";
        var state = formContext.getAttribute("sb1_state")?.getValue() || "";
        var region = formContext.getAttribute("sb1_region")?.getValue() || "";

        var body = {
            "sb1_accid": sb1AccountId,
            "sb1_accname": accName,
            "sb1_foldername": folderName,
            "sb1_foldereffdate": formattedDate,
            "sb1_marketseg": marketSeg,
            "sb1_lineofbusiness": lob,
            "sb1_fundingarrangement": funding,
            "sb1_state": state,
            "sb1_region": region
        };

        var response = await fetch("/api/data/v9.1/sb1_syncquotewithb1", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "OData-MaxVersion": "4.0",
                "OData-Version": "4.0"
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            Xrm.Utility.closeProgressIndicator();
            var err = await response.text();
            Xrm.Navigation.openAlertDialog({ text: "Error calling Custom API:\n" + err });
            return;
        }

        var data = await response.json();
        var syncResponse = JSON.parse(data.sb1_syncresponse);

        var actualquoteFolderId = syncResponse?.Result?.Data?.EbsDetailsForCrm?.QuoteFolderId;
        var quoteFolderId = syncResponse?.Result?.Data?.EbsAdditionalDetail?.FolderVersion?.FolderVersionId;

        if (!quoteFolderId) {
            Xrm.Utility.closeProgressIndicator();
            Xrm.Navigation.openAlertDialog({
                text: "QuoteFolderId not found in response."
            });
            return;
        }

        formContext.getAttribute("sb1_quoteid").setValue(quoteFolderId.toString());
        formContext.getAttribute("sb1_quoteid").setSubmitMode("always");
        formContext.getAttribute("sb1_quotefolderid").setValue(actualquoteFolderId.toString());
        formContext.getAttribute("sb1_quotefolderid").setSubmitMode("always");

        await formContext.data.entity.save();

        // Close processing indicator BEFORE showing success popup
        Xrm.Utility.closeProgressIndicator();

        Xrm.Navigation.openAlertDialog({
            text: "Quote created successfully"
        }, { title: "Quote" });

    } catch (e) {
        Xrm.Utility.closeProgressIndicator();
        Xrm.Navigation.openAlertDialog({ text: "Exception: " + e.message });
    }
}

    function onConfirmMessageChange(executionContext) {
        var formContext = executionContext.getFormContext();

        // Get the field value
        var msg = formContext.getAttribute("sb1_confirmmessage").getValue();

        // If field has data
        if (msg && msg.trim() !== "") {

            // Show message to user
            Xrm.Navigation.openAlertDialog({ text: msg }, { title: "Quote" });

            // Clear the field
            formContext.getAttribute("sb1_confirmmessage").setValue(null);
            formContext.getAttribute("sb1_confirmmessage").setSubmitMode("always");
        }
    }

    //-----
    async function callQuoteAPIforCopyQuote(executionContext) {

        var formContext = executionContext.getFormContext();

        // 🔹 Only Renewal
        if (formContext.getAttribute("sb1_quotetype")?.getValue() !== 2) return;

        var effDate = formContext.getAttribute("effectivefrom")?.getValue();
        if (!effDate) return;

        try {

            var body = {
                sb1_effdate: effDate.toISOString()
            };

            var response = await fetch("/api/data/v9.1/sb1_getquotedetailsfromdate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "OData-MaxVersion": "4.0",
                    "OData-Version": "4.0"
                },
                body: JSON.stringify(body)
            });

            if (!response.ok) {
                throw new Error(await response.text());
            }

            var data = await response.json();
            var details = JSON.parse(data.sb1_getdetails);
            var lists = details.Result.Data;

            var iframe = formContext.getControl("WebResource_quotefields");
            if (!iframe) return;

            iframe.getContentWindow().then(function (win) {
                win.postMessage({
                    StateList: lists.StateList,
                    RegionList: lists.RegionList,
                    FundingList: lists.FundingArrangementList,
                    LOBList: lists.LineOfBusinessList,
                    MarketSegmentList: lists.MarketSegmentList
                }, "*");
            });

        } catch (e) {
            Xrm.Navigation.openAlertDialog({ text: "API Error: " + e.message });
        }
    }

    /* async function openQuoteDocument(primaryControl) {
 
     try {
 
         const response = await fetch(
             "/api/data/v9.1/zen__getdocumentnames",
             {
                 method: "POST",
                 headers: {
                     "Content-Type": "application/json",
                     "Accept": "application/json",
                     "OData-MaxVersion": "4.0",
                     "OData-Version": "4.0"
                 },
                 body: JSON.stringify({}) // no input params
             }
         );
 
         if (!response.ok) {
             throw new Error(await response.text());
         }
 
         const data = await response.json();
 
         // Parse returned JSON
         const apiResult = JSON.parse(data.zen_docnames);
 
         console.log("Document Names:", apiResult);
 
         // Example usage
         const templates = apiResult.Result?.Data || [];
 
         Xrm.Navigation.openAlertDialog({
             text: `Templates received: ${templates.length}`
         });
 
     } catch (e) {
         Xrm.Navigation.openAlertDialog({
             text: "API Error: " + e.message
         });
     }
 }*/

    /*async function openQuoteDocument(primaryControl) {
        try {
            const response = await fetch(
                "/api/data/v9.1/zen__getdocumentnames",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json",
                        "OData-MaxVersion": "4.0",
                        "OData-Version": "4.0"
                    },
                    body: JSON.stringify({})
                }
            );
    
            if (!response.ok) {
                throw new Error(await response.text());
            }
    
            const data = await response.json();
            const apiResult = JSON.parse(data.zen_docnames);
            const templates = apiResult.Result?.Data || [];
    console.log("API Raw Response:", data);
    console.log("Parsed API Result:", apiResult);
    console.log("Templates Array:", templates);
    
            // Open HTML Web Resource and pass data
            const pageInput = {
                pageType: "webresource",
                webresourceName: "sb1_createquotedocument.html",
                data: JSON.stringify(templates)   // 👈 pass templates
            };
    
            const navigationOptions = {
                target: 2,          // Dialog
                width: 400,
                height: 270,
                position: 1
            };
    
            Xrm.Navigation.navigateTo(pageInput, navigationOptions);
    
        } catch (e) {
            Xrm.Navigation.openAlertDialog({
                text: "API Error: " + e.message
            });
        }
    }*/

    async function openQuoteDocument(primaryControl) {
        try {
            const quoteId = primaryControl.data.entity.getId().replace(/[{}]/g, "");

            const response = await fetch(
                "/api/data/v9.1/zen__getdocumentnames",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json",
                        "OData-MaxVersion": "4.0",
                        "OData-Version": "4.0"
                    },
                    body: JSON.stringify({})
                }
            );

            if (!response.ok) {
                throw new Error(await response.text());
            }

            const data = await response.json();
            const apiResult = JSON.parse(data.zen_docnames);
            const templates = apiResult.Result?.Data || [];

            // 👇 Pass BOTH templates and quoteId
            const pageInput = {
                pageType: "webresource",
                webresourceName: "sb1_createquotedocument.html",
                data: JSON.stringify({
                    templates: templates,
                    quoteId: quoteId
                })
            };

            const navigationOptions = {
                target: 2,
                width: 400,
                height: 270,
                position: 1
            };

            Xrm.Navigation.navigateTo(pageInput, navigationOptions);

        } catch (e) {
            Xrm.Navigation.openAlertDialog({
                text: "API Error: " + e.message
            });
        }
    }

    /*function quoteDocGeneration(primaryControl) {
        var formContext = primaryControl;
    
        // Current record info (Email)
        var recordId = formContext.data.entity.getId().replace("{", "").replace("}", "");
        var entityName = formContext.data.entity.getEntityName();
    
        // Get Quote lookup value
        var quoteLookup = formContext.getAttribute("sb1_quoteid")?.getValue();
        var quoteId = null;
    
        if (quoteLookup && quoteLookup.length > 0) {
            quoteId = quoteLookup[0].id.replace("{", "").replace("}", "");
        }
    
        var pageInput = {
            pageType: "custom",
            name: "sb1_quotedocgeneration_4fe01",
            parameters: {
                recordId: recordId,
                entityName: entityName,
                quoteId: quoteId   // 👈 pass to canvas app
            }
        };
    
        var navigationOptions = {
            target: 2,
            position: 1,
            width: 1510,
            height: 600,
            title: "Create Quote Document"
        };
    
        Xrm.Navigation.navigateTo(pageInput, navigationOptions);
    }*/

    //
    /*function quoteDocGeneration(primaryControl) {
        var formContext = primaryControl;
    
        // ✅ Get recordId safely
        var recordId = formContext.data.entity.getId();
        if (!recordId) {
            Xrm.Navigation.openAlertDialog({
                text: "Please save the record before generating the Quote document."
            });
            return;
        }
        recordId = recordId.replace("{", "").replace("}", "");
    
        var entityName = formContext.data.entity.getEntityName();
    
        // ✅ Get Quote lookup safely
        var quoteId = null;
        var quoteAttr = formContext.getAttribute("sb1_quoteid");
    
        if (quoteAttr) {
            var quoteLookup = quoteAttr.getValue();
            if (quoteLookup && quoteLookup.length > 0 && quoteLookup[0].id) {
                quoteId = quoteLookup[0].id.replace("{", "").replace("}", "");
            }
        }
    
        var pageInput = {
            pageType: "custom",
            name: "sb1_quotedocgeneration_4fe01",
            parameters: {
                recordId: recordId,
                entityName: entityName,
                quoteId: quoteId
            }
        };
    
        var navigationOptions = {
            target: 2,
            position: 1,
            width: 1510,
            height: 700,
            title: "Create Quote Document"
        };
    
        Xrm.Navigation.navigateTo(pageInput, navigationOptions);
    }
    */


    //duplicate
    async function quoteDocGeneration(primaryControl) {
        try {
            // Get the Quote ID
            const quoteId = primaryControl.data.entity.getId().replace(/[{}]/g, "");

            // Prepare canvas page navigation
            const pageInput = {
                pageType: "custom",
                name: "sb1_quotedocgeneration_4fe01",
                recordId: quoteId,  // Pass the Quote GUID
                entityName: "quote" // optional, can be anything your canvas page expects
            };

            const navigationOptions = {
                target: 2,   // Opens in a dialog
                width: 1510,
                height: 600,
                position: 1,
                title: "Create Quote Document"
            };

            Xrm.Navigation.navigateTo(pageInput, navigationOptions);

        } catch (e) {
            Xrm.Navigation.openAlertDialog({
                text: "Error opening canvas page: " + e.message
            });
        }
    }

    function onOpportunityChange(executionContext) {

        var formContext = executionContext.getFormContext();
        var opportunity = formContext.getAttribute("opportunityid").getValue();

        if (!opportunity) {
            return;
        }

        var opportunityId = opportunity[0].id.replace(/[{}]/g, "");

        Xrm.WebApi.retrieveRecord(
            "opportunity",
            opportunityId,
            "?$select=_parentaccountid_value"
        ).then(
            function (result) {
                if (result._parentaccountid_value) {
                    var customerLookup = [{
                        id: result._parentaccountid_value,
                        name: result["_parentaccountid_value@OData.Community.Display.V1.FormattedValue"],
                        entityType: "account"
                    }];

                    formContext.getAttribute("customerid").setValue(customerLookup);
                }
            },
            function (error) {
                console.error("Error retrieving opportunity:", error.message);
            }
        );
    }

    /**
     * Adds filter so only Opportunities of selected Account are shown
     */

    var opportunityPreSearchHandler = null;


    function onAccountChange(executionContext) {

        var formContext = executionContext.getFormContext();

        // Run only on Create form
        if (formContext.ui.getFormType() !== 1) {
            return;
        }

        var customerAttr = formContext.getAttribute("customerid");
        var opportunityAttr = formContext.getAttribute("opportunityid");
        var opportunityCtrl = formContext.getControl("opportunityid");

        if (!customerAttr || !opportunityCtrl) {
            return;
        }

        var customer = customerAttr.getValue();

        // 🔹 Account cleared
        if (!customer) {
            if (opportunityAttr.getValue() !== null) {
                opportunityAttr.setValue(null);
            }

            if (opportunityPreSearchHandler) {
                opportunityCtrl.removePreSearch(opportunityPreSearchHandler);
                opportunityPreSearchHandler = null;
            }
            return;
        }

        var accountId = customer[0].id.replace(/[{}]/g, "");

        // 🔹 Clear Opportunity on Account change
        if (opportunityAttr.getValue() !== null) {
            opportunityAttr.setValue(null);
        }

        // 🔹 Remove old filter (IMPORTANT)
        if (opportunityPreSearchHandler) {
            opportunityCtrl.removePreSearch(opportunityPreSearchHandler);
        }

        // 🔹 Create new filter handler
        opportunityPreSearchHandler = function () {
            var filterXml =
                "<filter type='and'>" +
                "<condition attribute='parentaccountid' operator='eq' value='" + accountId + "' />" +
                "</filter>";

            opportunityCtrl.addCustomFilter(filterXml, "opportunity");
        };

        // 🔹 Add new filter
        opportunityCtrl.addPreSearch(opportunityPreSearchHandler);
    }

    function lockWhenNotEmpty(executionContext) {
        var formContext = executionContext.getFormContext();
        // Form Types:
        // 1 = Create
        // 2 = Update
        var formType = formContext.ui.getFormType();

        // Run only on Create & Update
        if (formType !== 1 && formType !== 2) {
            return;
        }

        var customerAttr = formContext.getAttribute("customerid");
        var opportunityAttr = formContext.getAttribute("opportunityid");

        var customerCtrl = formContext.getControl("customerid");
        var opportunityCtrl = formContext.getControl("opportunityid");

        if (!customerCtrl || !opportunityCtrl) {
            return;
        }

        var isCustomerFilled =
            customerAttr && customerAttr.getValue() !== null;

        var isOpportunityFilled =
            opportunityAttr && opportunityAttr.getValue() !== null;

        // Lock both if either has value
        if (isCustomerFilled || isOpportunityFilled) {
            customerCtrl.setDisabled(true);
            opportunityCtrl.setDisabled(true);
        } else {
            customerCtrl.setDisabled(false);
            opportunityCtrl.setDisabled(false);
        }

    }
    return {
        onLoad: onLoad,
        toggleProductTab: toggleProductTab,
        validateAndToggleSections: validateAndToggleSections,
        toggleSections: toggleSections,
        navigateToTab: navigateToTab,
        populateBrokerId: populateBrokerId,
        validateEffectiveFromDate: validateEffectiveFromDate,
        onGridRowSelectedsetReadonly: onGridRowSelectedsetReadonly,
        onSubgridFieldChange: onSubgridFieldChange,
        onSubgridFieldChange2: onSubgridFieldChange2,
        onSubgridLookupChange: onSubgridLookupChange,
        openCustomPageDialog: openCustomPageDialog,
        callFrame: callFrame,
        openCustomPageDialog2: openCustomPageDialog2,
        registerTabChange: registerTabChange,
        renewQuote: renewQuote,
        callQuoteAPI: callQuoteAPI,
        callSyncQuoteAPI: callSyncQuoteAPI,
        onConfirmMessageChange: onConfirmMessageChange,
        callQuoteAPIforCopyQuote: callQuoteAPIforCopyQuote,
        openQuoteDocument: openQuoteDocument,
        quoteDocGeneration: quoteDocGeneration,
        onOpportunityChange: onOpportunityChange,
        onAccountChange: onAccountChange,
        lockWhenNotEmpty: lockWhenNotEmpty,
        disableOpportunityWhenEmptyAccount: disableOpportunityWhenEmptyAccount,
        onChange: onChange
    };
})();