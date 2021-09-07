$(document).ready(function () {
    var Depid = $("#ddlDepartmentIDFK").val();
    var DesId = $("#des").val();
    GetDesignation(Depid, DesId);
})

function GetDesignation(Depid, DesId) {
    if (DesId == null || DesId == undefined || DesId == "") {
        DesId = 0;
        if (DesId == "") DesId = 0;
    }
    $.get("/Civ_Department/GetDesignation/?DepID=" + Depid + "&DesId=" + DesId, function (data) {
        $("#Designation").html(data);
    })
}