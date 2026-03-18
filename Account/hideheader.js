function hideHeader(executionContext) {
    var formContext = executionContext.getFormContext();

    formContext.ui.headerSection.setBodyVisible(false);
    formContext.ui.headerSection.setCommandBarVisible(false);
    formContext.ui.headerSection.setTabNavigatorVisible(false);
    if (formContext.ui.process) {
        formContext.ui.process.setVisible(false);
    }
    
}