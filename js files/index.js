var jpdbBaseURL = "http://api.login2explore.com:5577";
var jpdbIRL = "/api/irl";
var jpdbIML = "/api/iml";
var stuDBname = "STUDENT-DB";
var stuRelationName = "StuData";
var connToken = "90932971|-31949275697191070|90949409";

$("#stuId").focus();

function saveRecNo2LS(jsonObj) {
  var lvData = JSON.parse(jsonObj.data);
  localStorage.setItem("recno", lvData.rec_no);
}

function getStuIdAsJsonObj() {
  var stuid = $("#stuId").val();
  var jsonStr = {
    id: stuid,
  };
  return JSON.stringify(jsonStr);
}

function fillData(jsonObj) {
  saveRecNo2LS(jsonObj);
  var record = JSON.parse(jsonObj.data).record;
  $("#stuName").val(record.name);
  $("#stuClass").val(record.class);
  $("#stuDOB").val(record.dob);
  $("#stuAddr").val(record.address);
  $("#stuEnroll").val(record.enrollment);
}

function getStu() {
  var stuIdJsonObj = getStuIdAsJsonObj();
  var getRequest = createGET_BY_KEYRequest(
    connToken,
    stuDBname,
    stuRelationName,
    stuIdJsonObj
  );
  jQuery.ajaxSetup({ async: false });
  var resJsonObj = executeCommandAtGivenBaseUrl(
    getRequest,
    jpdbBaseURL,
    jpdbIRL
  );
  jQuery.ajaxSetup({ async: true });

  if (resJsonObj.status === 400) {
    $("#save").prop("disabled", false);
    $("#reset").prop("disabled", false);
    $("#stuName").focus();
  } else if (resJsonObj.status === 200) {
    $("#stuId").prop("disabed", true);
    fillData(resJsonObj);

    $("#change").prop("disabled", false);
    $("#reset").prop("disabled", false);
    $("stuName").focus();
  }
}

function validateData() {
  var stuId, stuName, stuClass, stuDOB, stuAddr, stuEnroll;
  stuId = $("#stuId").val();
  stuName = $("#stuName").val();
  stuClass = $("#stuClass").val();
  stuDOB = $("#stuDOB").val();
  stuAddr = $("#stuAddr").val();
  stuEnroll = $("#stuEnroll").val();

  if (stuId === "") {
    alert("Student Roll Missing");
    $("#stuId").focus();
    return "";
  }
  if (stuName === "") {
    alert("Student Name Missing");
    $("#stuName").focus();
    return "";
  }
  if (stuClass === "") {
    alert("Student Class Missing");
    $("#stuClass").focus();
    return "";
  }
  if (stuDOB === "") {
    alert("Student DOB Missing");
    $("#stuDOB").focus();
    return "";
  }
  if (stuAddr === "") {
    alert("Student Address Missing");
    $("#stuAddr").focus();
    return "";
  }
  if (stuEnroll === "") {
    alert("Student Eenrollment Number Missing");
    $("#stuEnroll").focus();
    return "";
  }

  var jsonStrObj = {
    id: stuId,
    name: stuName,
    class: stuClass,
    dob: stuDOB,
    address: stuAddr,
    enrollment: stuEnroll,
  };
  return JSON.stringify(jsonStrObj);
}

function resetForm() {
  $("#stuId").val("");
  $("#stuName").val("");
  $("#stuClass").val("");
  $("#stuDOB").val("");
  $("#stuAddr").val("");
  $("#stuEnroll").val("");

  $("#stuId").prop("disabled", false);
  $("#save").prop("disabled", true);
  $("#change").prop("disabled", true);
  $("#reset").prop("disabled", true);
  $("#stuId").focus();
}

function saveData() {
  var jsonStrObj = validateData();
  if (jsonStrObj === "") {
    return "";
  }

  var putRequest = createPUTRequest(
    connToken,
    jsonStrObj,
    stuDBname,
    stuRelationName
  );
  jQuery.ajaxSetup({ async: false });
  var resJsonObj = executeCommandAtGivenBaseUrl(
    putRequest,
    jpdbBaseURL,
    jpdbIML
  );
  jQuery.ajaxSetup({ async: true });
  resetForm();
  $("#stuId").focus();
}

function changeData() {
  $("#change").prop("disabled", true);
  jsonChg = validateData();
  var updateRequest = createUPDATERecordRequest(
    connToken,
    jsonChg,
    stuDBname,
    stuRelationName,
    localStorage.getItem("recno")
  );
  jQuery.ajaxSetup({ async: false });
  var resJsonObj = executeCommandAtGivenBaseUrl(
    updateRequest,
    jpdbBaseURL,
    jpdbIML
  );
  jQuery.ajaxSetup({ async: true });
  console.log(resJsonObj);
  resetForm();
  $("#stuId").focus();
}
