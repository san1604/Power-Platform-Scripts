var GSTIN = GSTIN || {};

GSTIN.validateGSTIN = function (executionContext) {
    var formContext = executionContext.getFormContext();
    var gstinAttr = formContext.getAttribute("cms_gstin");

    if (!gstinAttr) return;

    var gstin = gstinAttr.getValue();

    if (!gstin) return;

    gstin = gstin.toUpperCase();

    var gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

    if (!gstinRegex.test(gstin) || !GSTIN.isValidChecksum(gstin)) {
        GSTIN.showDialog("Invalid GSTIN", "The GSTIN entered is not valid. Please re-check.");
        gstinAttr.setValue(null);
        return;
    }

    GSTIN.showDialog(
        "Confirm GSTIN",
        "GSTIN looks valid:\n\n" + gstin + "\n\nDo you want to keep this value?"
    );
};

GSTIN.showDialog = function (title, text) {
    var confirmStrings = {
        title: title,
        text: text,
        confirmButtonLabel: "OK"
    };

    var confirmOptions = {
        height: 200,
        width: 450
    };

    Xrm.Navigation.openConfirmDialog(confirmStrings, confirmOptions);
};

GSTIN.isValidChecksum = function (gstin) {
    var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var factor = 2;
    var sum = 0;

    for (var i = gstin.length - 2; i >= 0; i--) {
        var codePoint = chars.indexOf(gstin.charAt(i));
        var digit = factor * codePoint;
        factor = factor === 2 ? 1 : 2;
        digit = Math.floor(digit / 36) + (digit % 36);
        sum += digit;
    }

    var remainder = sum % 36;
    var checkCodePoint = remainder === 0 ? 0 : 36 - remainder;
    var checksumChar = chars.charAt(checkCodePoint);

    return gstin.charAt(gstin.length - 1) === checksumChar;
};

// Create a code to validate gst number in the following format! => 29ABCDE1234F1Z5([1-9](2)[A-Z](5)[1-9](4)[A-Z](1)[1-9](1)[])