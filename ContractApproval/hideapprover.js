function hideApproverOnPending(executionContext)
{
    var formContext = executionContext.getFormContext()

    var statusAttr = formContext.getAttribute("cms_approvalstatus")

    if(!statusAttr) return

    //Approver field control
    var status = statusAttr.getValue();
    var approverControl = formContext.getControl("cms_approvar")
    if(!approverControl) return

    if(status === "Pending")
    {
        approverControl.setVisible(false);
    }
    else
    {
        approverControl.setVisible(true)
    }
}