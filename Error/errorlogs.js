window.logError = function (error, formContext) {
    const errorLog = {
        cms_Name: errorName || error.name || "JavaScript Error",
        cms_errormessage: error.message,
        cms_stacktrace: error.stack || "",
        cms_source: 2, // JavaScript
        cms_entityname: formContext.data.entity.getEntityName(),
        cms_recordid: formContext.data.entity.getId(),
        cms_occurredon: new Date().toISOString()
    };

    Xrm.WebApi.createRecord("cms_errorlog", errorLog)
        .catch(e => console.error("Error logging failed", e));
};
