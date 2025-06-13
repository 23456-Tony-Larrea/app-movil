function liAddcpvinvoicefilter(executionContext) {
  var recorridoIdField;
  var recorridoIdValue;
  var totalKmLine = 0;
  var totalKm = 0;
  var CustAccount = "";
  var voucherIdField;
  var voucherIdValue;
  var voucherGuid;

  var li_custpendinginvoiceField = Xrm.Page.getControl(
    "li_custpendinginvoiceid"
  );

  var formContext = executionContext.getFormContext();
  voucherIdField = formContext.getAttribute("li_invoicevoucherid");
  voucherIdValue = voucherIdField.getValue();
  voucherGuid = voucherIdValue[0].id.slice(1, -1);
  Xrm.WebApi.retrieveRecord(
    "li_custpaymvoucher",
    voucherGuid,
    "?$select=_li_custaccountid_value,li_dataareaid"
  ).then(
    function success(result) {
      var _li_custaccountid_value = result["_li_custaccountid_value"];
      var _li_custaccountid_value_formatted =
        result[
          "_li_custaccountid_value@OData.Community.Display.V1.FormattedValue"
        ];
      var _li_custaccountid_value_lookuplogicalname =
        result[
          "_li_custaccountid_value@Microsoft.Dynamics.CRM.lookuplogicalname"
        ];
      var li_dataareaid = result["li_dataareaid"];
      var li_dataareaid_formatted =
        result["li_dataareaid@OData.Community.Display.V1.FormattedValue"];

      Xrm.WebApi.retrieveRecord(
        "account",
        _li_custaccountid_value,
        "?$select=li_dax_accountnumber"
      ).then(
        function success(result) {
          var li_dax_accountnumber = result["li_dax_accountnumber"];
          try {
            //debugger;
            // Xrm.Page.getControl("li_custpendinginvoiceid").addPreSearch(function () {
            li_custpendinginvoiceField.addPreSearch(function () {
              //debugger;
              //alert("guid: " + li_dax_accountnumber.split("-", 1));
              licpvinvoicefilter(
                li_dax_accountnumber.split("-", 1),
                li_dataareaid_formatted
              );
            });
          } catch (error) {
            throw new Error(error.Message);
          }
        },
        function (error) {
          Xrm.Utility.alertDialog(error.message);
        }
      );
    },
    function (error) {
      Xrm.Utility.alertDialog(error.message);
    }
  );
}

function licpvinvoicefilter(_CustAccount, li_dataareaid) {
  var functionName = "licpvinvoicefilter";
  if (li_dataareaid == "LIFE") {
    li_dataareaid = "li";
  } else if (li_dataareaid == "GENAMERICA") {
    li_dataareaid = "ga";
  }
  try {
    var recordid = Xrm.Page.data.entity.getId();
    var vnum = Xrm.Page.getAttribute("li_invoicepervouchernum");
    fetchXml =
      "<filter type='and'>" +
      "<condition attribute='li_custaccount' operator='eq' value='" +
      _CustAccount +
      "' />" +
      "<condition attribute='li_companyid' operator='eq' value='" +
      li_dataareaid +
      "' />" +
      "<condition attribute='li_pendinginvoice' operator='eq' value='1' />" +
      "</filter>";
    Xrm.Page.getControl("li_custpendinginvoiceid").addCustomFilter(fetchXml);
  } catch (error) {}
}
function onChangeCustPending(executionContext) {
  //   debugger;

  var formContext = executionContext.getFormContext();
  var pendingInvField = formContext.getAttribute("li_custpendinginvoiceid");
  var pendingInvValue = pendingInvField.getValue();
  var pendingInvGuid = pendingInvValue[0].id.slice(1, -1);

  var totalAmountField = formContext.getAttribute("li_invoicetotalamount");
  var remainAmountField = formContext.getAttribute("li_invoiceremainamount");
  var invoicenum = formContext.getAttribute("li_invoicenum");
  // var li_paymamount = formContext.getAttribute("li_paymamount");
  var li_paymamount = Xrm.Page.getAttribute("li_paymamount");

  var hasret = formContext.getAttribute("li_hasret");
  var calcretamountcur = formContext.getAttribute("li_calcretamountcur");
  var retdocumentnum = formContext.getAttribute("li_retdocumentnum");
  var li_retamount = formContext.getAttribute("li_retamount");

  //debugger;
  Xrm.WebApi.retrieveRecord(
    "li_custpaympendinginvoices",
    pendingInvGuid,
    "?$select=li_invoiceid,li_amountmst,li_remainamountmst,li_calcretamountcur,li_hasret,li_retamountcur,li_retnum"
  ).then(
    function success(result) {
      console.log(result);
      var li_amountmst = result["li_amountmst"];
      var li_remainamountmst = result["li_remainamountmst"];
      var li_invoiceid = result["li_invoiceid"];
      debugger;
      var li_calcretamountcur = result["li_calcretamountcur"];
      var li_calcretamountcur_formatted =
        result["li_calcretamountcur@OData.Community.Display.V1.FormattedValue"];
      var li_hasret = result["li_hasret"];
      var li_hasret_formatted =
        result["li_hasret@OData.Community.Display.V1.FormattedValue"];
      var li_retamountcur = result["li_retamountcur"];
      var li_retamountcur_formatted =
        result["li_retamountcur@OData.Community.Display.V1.FormattedValue"];
      var li_retnum = result["li_retnum"];

      totalAmountField.setValue(li_amountmst);
      remainAmountField.setValue(li_remainamountmst);
      //si es NC se setea el valor pendiente al valor a pagar
      if (li_invoiceid.includes("NC_"))
        li_paymamount.setValue(li_remainamountmst);
      //
      invoicenum.setValue(li_invoiceid);

      hasret.setValue(li_hasret);
      calcretamountcur.setValue(li_calcretamountcur);
      retdocumentnum.setValue(li_retnum);
      li_retamount.setValue(li_retamountcur);

      if (li_hasret) {
        // formContext.getAttribute("li_retnum").controls.forEach(control => control.addNotification(notification));
        formContext
          .getAttribute("li_retdocumentnum")
          .controls.forEach((control) => control.setDisabled(true));
        formContext
          .getAttribute("li_retamount")
          .controls.forEach((control) => control.setDisabled(true));
        // retdocumentnum.setValue(null);
        // li_retamount.setValue(null);
      } else {
        if (li_remainamountmst > 0) {
          formContext
            .getAttribute("li_retdocumentnum")
            .controls.forEach((control) => control.setDisabled(false));
          formContext
            .getAttribute("li_retamount")
            .controls.forEach((control) => control.setDisabled(false));
        } else {
          formContext
            .getAttribute("li_retdocumentnum")
            .controls.forEach((control) => control.setDisabled(true));
          formContext
            .getAttribute("li_retamount")
            .controls.forEach((control) => control.setDisabled(true));
        }

        retdocumentnum.setValue("");
        li_retamount.setValue(0);
      }
    }
    // function(error) {
    //     Xrm.Utility.alertDialog(error.message);
    // }
  );
}

// function onChangeCustPending(executionContext) {
//   debugger;

//   var formContext = executionContext.getFormContext();
//   var pendingInvField = formContext.getAttribute("li_custpendinginvoiceid");
//   var pendingInvValue = pendingInvField.getValue();
//   var pendingInvGuid = pendingInvValue[0].id.slice(1, -1);

//   var totalAmountField = formContext.getAttribute("li_invoicetotalamount");
//   var remainAmountField = formContext.getAttribute("li_invoiceremainamount");
//   var invoicenum = formContext.getAttribute("li_invoicenum");

//   var hasret = formContext.getAttribute("li_hasret");
//   var calcretamountcur = formContext.getAttribute("li_calcretamountcur");
//   var retdocumentnum = formContext.getAttribute("li_retdocumentnum");
//   var li_retamount = formContext.getAttribute("li_retamount");

//   //debugger;
//   Xrm.WebApi.retrieveRecord(
//     "li_custpaympendinginvoices",
//     pendingInvGuid,
//     "?$select=li_invoiceid,li_amountmst,li_remainamountmst,li_calcretamountcur,li_hasret,li_retamountcur,li_retnum"
//   ).then(
//     function success(result) {
//       console.log(result);
//       var li_amountmst = result["li_amountmst"];
//       var li_remainamountmst = result["li_remainamountmst"];
//       var li_invoiceid = result["li_invoiceid"];
//       debugger;
//       var li_calcretamountcur = result["li_calcretamountcur"];
//       var li_calcretamountcur_formatted =
//         result["li_calcretamountcur@OData.Community.Display.V1.FormattedValue"];
//       var li_hasret = result["li_hasret"];
//       var li_hasret_formatted =
//         result["li_hasret@OData.Community.Display.V1.FormattedValue"];
//       var li_retamountcur = result["li_retamountcur"];
//       var li_retamountcur_formatted =
//         result["li_retamountcur@OData.Community.Display.V1.FormattedValue"];
//       var li_retnum = result["li_retnum"];

//       totalAmountField.setValue(li_amountmst);
//       remainAmountField.setValue(li_remainamountmst);
//       invoicenum.setValue(li_invoiceid);

//       hasret.setValue(li_hasret);
//       calcretamountcur.setValue(li_calcretamountcur);
//       retdocumentnum.setValue(li_retnum);
//       li_retamount.setValue(li_retamountcur);

//       if (li_hasret) {
//         // formContext.getAttribute("li_retnum").controls.forEach(control => control.addNotification(notification));
//         formContext
//           .getAttribute("li_retdocumentnum")
//           .controls.forEach((control) => control.setDisabled(true));
//         formContext
//           .getAttribute("li_retamount")
//           .controls.forEach((control) => control.setDisabled(true));
//         retdocumentnum.setValue(null);
//         li_retamount.setValue(null);
//       } else {
//         if (li_remainamountmst > 0) {
//           formContext
//             .getAttribute("li_retdocumentnum")
//             .controls.forEach((control) => control.setDisabled(false));
//           formContext
//             .getAttribute("li_retamount")
//             .controls.forEach((control) => control.setDisabled(false));
//         } else {
//           formContext
//             .getAttribute("li_retdocumentnum")
//             .controls.forEach((control) => control.setDisabled(true));
//           formContext
//             .getAttribute("li_retamount")
//             .controls.forEach((control) => control.setDisabled(true));
//         }

//         retdocumentnum.setValue("");
//         li_retamount.setValue(0);
//       }
//     }
//     // function(error) {
//     //     Xrm.Utility.alertDialog(error.message);
//     // }
//   );
// }
// function onChangeCustPending(executionContext) {
//   debugger;

//   var formContext = executionContext.getFormContext();
//   var pendingInvField = formContext.getAttribute("li_custpendinginvoiceid");
//   var pendingInvValue = pendingInvField.getValue();
//   var pendingInvGuid = pendingInvValue[0].id.slice(1, -1);

//   var totalAmountField = formContext.getAttribute("li_invoicetotalamount");
//   var remainAmountField = formContext.getAttribute("li_invoiceremainamount");
//   var invoicenum = formContext.getAttribute("li_invoicenum");

//   var hasret = formContext.getAttribute("li_hasret");
//   var calcretamountcur = formContext.getAttribute("li_calcretamountcur");
//   var retdocumentnum = formContext.getAttribute("li_retdocumentnum");
//   var li_retamount = formContext.getAttribute("li_retamount");

//   //debugger;
//   Xrm.WebApi.retrieveRecord(
//     "li_custpaympendinginvoices",
//     pendingInvGuid,
//     "?$select=li_invoiceid,li_amountmst,li_remainamountmst,li_calcretamountcur,li_hasret,li_retamountcur,li_retnum"
//   ).then(
//     function success(result) {
//       var li_amountmst = result["li_amountmst"];
//       var li_remainamountmst = result["li_remainamountmst"];
//       var li_invoiceid = result["li_invoiceid"];
//       debugger;
//       var li_calcretamountcur = result["li_calcretamountcur"];
//       var li_calcretamountcur_formatted =
//         result["li_calcretamountcur@OData.Community.Display.V1.FormattedValue"];
//       var li_hasret = result["li_hasret"];
//       var li_hasret_formatted =
//         result["li_hasret@OData.Community.Display.V1.FormattedValue"];
//       var li_retamountcur = result["li_retamountcur"];
//       var li_retamountcur_formatted =
//         result["li_retamountcur@OData.Community.Display.V1.FormattedValue"];
//       var li_retnum = result["li_retnum"];

//       totalAmountField.setValue(li_amountmst);
//       remainAmountField.setValue(li_remainamountmst);
//       invoicenum.setValue(li_invoiceid);

//       hasret.setValue(li_hasret);
//       calcretamountcur.setValue(li_calcretamountcur);
//       retdocumentnum.setValue(li_retnum);
//       li_retamount.setValue(li_retamountcur);

//       if (li_hasret) {
//         // formContext.getAttribute("li_retnum").controls.forEach(control => control.addNotification(notification));
//         formContext
//           .getAttribute("li_retdocumentnum")
//           .controls.forEach((control) => control.setDisabled(true));
//         formContext
//           .getAttribute("li_retamount")
//           .controls.forEach((control) => control.setDisabled(true));
//         // retdocumentnum.setValue(null);
//         // li_retamount.setValue(null);
//       } else {
//         if (li_remainamountmst > 0) {
//           formContext
//             .getAttribute("li_retdocumentnum")
//             .controls.forEach((control) => control.setDisabled(false));
//           formContext
//             .getAttribute("li_retamount")
//             .controls.forEach((control) => control.setDisabled(false));
//         } else {
//           formContext
//             .getAttribute("li_retdocumentnum")
//             .controls.forEach((control) => control.setDisabled(true));
//           formContext
//             .getAttribute("li_retamount")
//             .controls.forEach((control) => control.setDisabled(true));
//         }

//         retdocumentnum.setValue("");
//         li_retamount.setValue(0);
//       }
//     }
//     // function(error) {
//     //     Xrm.Utility.alertDialog(error.message);
//     // }
//   );
// }
// function onChangeCustPending(executionContext) {
//   var formContext = executionContext.getFormContext();
//   var pendingInvField = formContext.getAttribute("li_custpendinginvoiceid");
//   var pendingInvValue = pendingInvField.getValue();
//   var pendingInvGuid = pendingInvValue[0].id.slice(1, -1);

//   var totalAmountField = formContext.getAttribute("li_invoicetotalamount");
//   var remainAmountField = formContext.getAttribute("li_invoiceremainamount");
//   var invoicenum = formContext.getAttribute("li_invoicenum");

//   var hasret = formContext.getAttribute("li_hasret");
//   var calcretamountcur = formContext.getAttribute("li_calcretamountcur");
//   var retdocumentnum = formContext.getAttribute("li_retdocumentnum");
//   var li_retamount = formContext.getAttribute("li_retamount");

//   //debugger;
//   Xrm.WebApi.retrieveRecord(
//     "li_custpaympendinginvoices",
//     pendingInvGuid,
//     "?$select=li_invoiceid,li_amountmst,li_remainamountmst,li_calcretamountcur,li_hasret,li_retamountcur,li_retnum"
//   ).then(
//     function success(result) {
//       var li_amountmst = result["li_amountmst"];
//       var li_remainamountmst = result["li_remainamountmst"];
//       var li_invoiceid = result["li_invoiceid"];
//       //   debugger;
//       var li_calcretamountcur = result["li_calcretamountcur"];
//       var li_calcretamountcur_formatted =
//         result["li_calcretamountcur@OData.Community.Display.V1.FormattedValue"];
//       var li_hasret = result["li_hasret"];
//       var li_hasret_formatted =
//         result["li_hasret@OData.Community.Display.V1.FormattedValue"];
//       var li_retamountcur = result["li_retamountcur"];
//       var li_retamountcur_formatted =
//         result["li_retamountcur@OData.Community.Display.V1.FormattedValue"];
//       var li_retnum = result["li_retnum"];

//       totalAmountField.setValue(li_amountmst);
//       remainAmountField.setValue(li_remainamountmst);
//       invoicenum.setValue(li_invoiceid);

//       hasret.setValue(li_hasret);
//       calcretamountcur.setValue(li_calcretamountcur);
//       retdocumentnum.setValue(li_retnum);
//       li_retamount.setValue(li_retamountcur);

//       if (li_hasret) {
//         // formContext.getAttribute("li_retnum").controls.forEach(control => control.addNotification(notification));
//         formContext
//           .getAttribute("li_retdocumentnum")
//           .controls.forEach((control) => control.setDisabled(true));
//         formContext
//           .getAttribute("li_retamount")
//           .controls.forEach((control) => control.setDisabled(true));
//         retdocumentnum.setValue(null);
//         li_retamount.setValue(null);
//       } else {
//         if (li_remainamountmst > 0) {
//           formContext
//             .getAttribute("li_retdocumentnum")
//             .controls.forEach((control) => control.setDisabled(false));
//           formContext
//             .getAttribute("li_retamount")
//             .controls.forEach((control) => control.setDisabled(false));
//         } else {
//           formContext
//             .getAttribute("li_retdocumentnum")
//             .controls.forEach((control) => control.setDisabled(true));
//           formContext
//             .getAttribute("li_retamount")
//             .controls.forEach((control) => control.setDisabled(true));
//         }

//         retdocumentnum.setValue("");
//         li_retamount.setValue(0);
//       }
//     }
//     // function(error) {
//     //     Xrm.Utility.alertDialog(error.message);
//     // }
//   );
// }

//liAddcpvinvoicefilter

/*
function licpvinvoicefilter(_CustAccount, li_dataareaid) {
  var functionName = "licpvinvoicefilter";
  if (li_dataareaid == "LIFE") {
    li_dataareaid = "li";
  } else if (li_dataareaid == "GENAMERICA") {
    li_dataareaid = "ga";
  }
  try {
    var recordid = Xrm.Page.data.entity.getId();
    var vnum = Xrm.Page.getAttribute("li_invoicepervouchernum");
    fetchXml =
      "<filter type='and'>" +
      "<condition attribute='li_custaccount' operator='eq' value='" +
      _CustAccount +
      "' />" +
      "<condition attribute='li_companyid' operator='eq' value='" +
      li_dataareaid +
      "' />" +
      "<condition attribute='li_pendinginvoice' operator='eq' value='1' />" +
      "</filter>";
    Xrm.Page.getControl("li_custpendinginvoiceid").addCustomFilter(fetchXml);
  } catch (error) {}
}



function licpvinvoicefilter(_CustAccount, li_dataareaid) {
  var functionName = "licpvinvoicefilter";
  if (li_dataareaid == "LIFE") {
    li_dataareaid = "li";
  } else if (li_dataareaid == "GENAMERICA") {
    li_dataareaid = "ga";
  }
  try {
    var recordid = Xrm.Page.data.entity.getId();
    var vnum = Xrm.Page.getAttribute("li_invoicepervouchernum");
    fetchXml =
      "<filter type='and'>" +
      "<condition attribute='li_custaccount' operator='eq' value='" +
      _CustAccount +
      "' />" +
      "<condition attribute='li_companyid' operator='eq' value='" +
      li_dataareaid +
      "' />" +
      "<condition attribute='li_pendinginvoice' operator='eq' value='1' />" +
      "</filter>";
    Xrm.Page.getControl("li_custpendinginvoiceid").addCustomFilter(fetchXml);
  } catch (error) {}
}



function licpvinvoicefilter(_CustAccount, li_dataareaid) {
  var functionName = "licpvinvoicefilter";
  if (li_dataareaid == "LIFE") {
    li_dataareaid = "li";
  } else if (li_dataareaid == "GENAMERICA") {
    li_dataareaid = "ga";
  }
  try {
    var recordid = Xrm.Page.data.entity.getId();
    var vnum = Xrm.Page.getAttribute("li_invoicepervouchernum");
    fetchXml =
      "<filter type='and'>" +
      "<condition attribute='li_custaccount' operator='eq' value='" +
      _CustAccount +
      "' />" +
      "<condition attribute='li_companyid' operator='eq' value='" +
      li_dataareaid +
      "' />" +
      "<condition attribute='li_pendinginvoice' operator='eq' value='1' />" +
      "</filter>";
    Xrm.Page.getControl("li_custpendinginvoiceid").addCustomFilter(fetchXml);
  } catch (error) {}
}

function liAddcpvinvoicefilter(executionContext) {
  var recorridoIdField;
  var recorridoIdValue;
  var totalKmLine = 0;
  var totalKm = 0;
  var CustAccount = "";
  var voucherIdField;
  var voucherIdValue;
  var voucherGuid;

  var li_custpendinginvoiceField = Xrm.Page.getControl(
    "li_custpendinginvoiceid"
  );

  var formContext = executionContext.getFormContext();
  voucherIdField = formContext.getAttribute("li_invoicevoucherid");
  voucherIdValue = voucherIdField.getValue();
  voucherGuid = voucherIdValue[0].id.slice(1, -1);
  Xrm.WebApi.retrieveRecord(
    "li_custpaymvoucher",
    voucherGuid,
    "?$select=_li_custaccountid_value,li_dataareaid"
  ).then(
    function success(result) {
      var _li_custaccountid_value = result["_li_custaccountid_value"];
      var _li_custaccountid_value_formatted =
        result[
          "_li_custaccountid_value@OData.Community.Display.V1.FormattedValue"
        ];
      var _li_custaccountid_value_lookuplogicalname =
        result[
          "_li_custaccountid_value@Microsoft.Dynamics.CRM.lookuplogicalname"
        ];
      var li_dataareaid = result["li_dataareaid"];
      var li_dataareaid_formatted =
        result["li_dataareaid@OData.Community.Display.V1.FormattedValue"];

      Xrm.WebApi.retrieveRecord(
        "account",
        _li_custaccountid_value,
        "?$select=li_dax_accountnumber"
      ).then(
        function success(result) {
          var li_dax_accountnumber = result["li_dax_accountnumber"];
          try {
            //debugger;
            // Xrm.Page.getControl("li_custpendinginvoiceid").addPreSearch(function () {
            li_custpendinginvoiceField.addPreSearch(function () {
              //debugger;
              //alert("guid: " + li_dax_accountnumber.split("-", 1));
              licpvinvoicefilter(
                li_dax_accountnumber.split("-", 1),
                li_dataareaid_formatted
              );
            });
          } catch (error) {
            throw new Error(error.Message);
          }
        },
        function (error) {
          Xrm.Utility.alertDialog(error.message);
        }
      );
    },
    function (error) {
      Xrm.Utility.alertDialog(error.message);
    }
  );
}
function liAddcpvinvoicefilter(executionContext) {
  var recorridoIdField;
  var recorridoIdValue;
  var totalKmLine = 0;
  var totalKm = 0;
  var CustAccount = "";
  var voucherIdField;
  var voucherIdValue;
  var voucherGuid;

  var li_custpendinginvoiceField = Xrm.Page.getControl(
    "li_custpendinginvoiceid"
  );

  var formContext = executionContext.getFormContext();
  voucherIdField = formContext.getAttribute("li_invoicevoucherid");
  voucherIdValue = voucherIdField.getValue();
  voucherGuid = voucherIdValue[0].id.slice(1, -1);
  Xrm.WebApi.retrieveRecord(
    "li_custpaymvoucher",
    voucherGuid,
    "?$select=_li_custaccountid_value,li_dataareaid"
  ).then(
    function success(result) {
      var _li_custaccountid_value = result["_li_custaccountid_value"];
      var _li_custaccountid_value_formatted =
        result[
          "_li_custaccountid_value@OData.Community.Display.V1.FormattedValue"
        ];
      var _li_custaccountid_value_lookuplogicalname =
        result[
          "_li_custaccountid_value@Microsoft.Dynamics.CRM.lookuplogicalname"
        ];
      var li_dataareaid = result["li_dataareaid"];
      var li_dataareaid_formatted =
        result["li_dataareaid@OData.Community.Display.V1.FormattedValue"];

      Xrm.WebApi.retrieveRecord(
        "account",
        _li_custaccountid_value,
        "?$select=li_dax_accountnumber"
      ).then(
        function success(result) {
          var li_dax_accountnumber = result["li_dax_accountnumber"];
          try {
            //debugger;
            // Xrm.Page.getControl("li_custpendinginvoiceid").addPreSearch(function () {
            li_custpendinginvoiceField.addPreSearch(function () {
              //debugger;
              //alert("guid: " + li_dax_accountnumber.split("-", 1));
              licpvinvoicefilter(
                li_dax_accountnumber.split("-", 1),
                li_dataareaid_formatted
              );
            });
          } catch (error) {
            throw new Error(error.Message);
          }
        },
        function (error) {
          Xrm.Utility.alertDialog(error.message);
        }
      );
    },
    function (error) {
      Xrm.Utility.alertDialog(error.message);
    }
  );
}
function liAddcpvinvoicefilter(executionContext) {
  var recorridoIdField;
  var recorridoIdValue;
  var totalKmLine = 0;
  var totalKm = 0;
  var CustAccount = "";
  var voucherIdField;
  var voucherIdValue;
  var voucherGuid;

  var li_custpendinginvoiceField = Xrm.Page.getControl(
    "li_custpendinginvoiceid"
  );

  var formContext = executionContext.getFormContext();
  voucherIdField = formContext.getAttribute("li_invoicevoucherid");
  voucherIdValue = voucherIdField.getValue();
  voucherGuid = voucherIdValue[0].id.slice(1, -1);
  Xrm.WebApi.retrieveRecord(
    "li_custpaymvoucher",
    voucherGuid,
    "?$select=_li_custaccountid_value,li_dataareaid"
  ).then(
    function success(result) {
      var _li_custaccountid_value = result["_li_custaccountid_value"];
      var _li_custaccountid_value_formatted =
        result[
          "_li_custaccountid_value@OData.Community.Display.V1.FormattedValue"
        ];
      var _li_custaccountid_value_lookuplogicalname =
        result[
          "_li_custaccountid_value@Microsoft.Dynamics.CRM.lookuplogicalname"
        ];
      var li_dataareaid = result["li_dataareaid"];
      var li_dataareaid_formatted =
        result["li_dataareaid@OData.Community.Display.V1.FormattedValue"];

      Xrm.WebApi.retrieveRecord(
        "account",
        _li_custaccountid_value,
        "?$select=li_dax_accountnumber"
      ).then(
        function success(result) {
          var li_dax_accountnumber = result["li_dax_accountnumber"];
          try {
            //debugger;
            // Xrm.Page.getControl("li_custpendinginvoiceid").addPreSearch(function () {
            li_custpendinginvoiceField.addPreSearch(function () {
              //debugger;
              //alert("guid: " + li_dax_accountnumber.split("-", 1));
              licpvinvoicefilter(
                li_dax_accountnumber.split("-", 1),
                li_dataareaid_formatted
              );
            });
          } catch (error) {
            throw new Error(error.Message);
          }
        },
        function (error) {
          Xrm.Utility.alertDialog(error.message);
        }
      );
    },
    function (error) {
      Xrm.Utility.alertDialog(error.message);
    }
  );
}
*/
