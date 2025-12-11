function filterPrimaryContact(executionContext) {
    var formContext = executionContext.getFormContext();

    // Get Account field
    var accountAttr = formContext.getAttribute("cms_accountid");
    if (!accountAttr) {
        console.log("cms_accountid not found on form.");
        return;
    }

    // Get Contact control
    var contactControl = formContext.getControl("cms_contactid");
    if (!contactControl) {
        console.log("cms_contactid control not found on form.");
        return;
    }

    // Add PreSearch filter
    contactControl.addPreSearch(function () {
        var accountValue = accountAttr.getValue();
        if (!accountValue) return;

        var accountId = accountValue[0].id.replace(/[{}]/g, "");

            `<filter type='and'>
                <condition attribute='parentcustomerid' operator='eq' value='${accountId}'/>
            </filter>`;

        contactControl.addCustomFilter(filter, "contact");
    });
}

// function filterPrimaryContact(executionContext)
// {
//     var formContext = executionContext.getFormContext()

//     //get Account fileld
//     var accountAttr = formContext.getAttribute("cms_accountid")
//     if(!accountAttr)
//     {
//         console.log("cms_accountid cannot be found.");
//         return
//     }
//     // Get contact control
//     var contactControl = formContext.getControl("cms_contactid")
//     if(!contactControl)
//     {
//         console.log("cms_contactid cannot be found.");
//         return
//     }
//     // Add presearch filter
//     contactControl.addPreSearch(function()
//     {
//         var accountValue = accountAttr.getValue();
//         if(!accountValue)
//         {
//             return
//         }
//         var accountId = accountValue[0].id.replace(/[{}]/g, "")
//                 `<filter type='and'>
//                     <condition attribute='parentcustomerid' operator='eq' value='${accountId}'/>
//                 </filter>`
//         contactControl.addCustomFilter(filter,"contact")
//     })
// }