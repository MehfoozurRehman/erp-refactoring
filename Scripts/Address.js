$(document).ready(function () {
    $(".PhoneNo1,.PhoneNo2,.MobileNo").attr("data-inputmask", "'mask': ['9999-9999999']");
    $(".PhoneNo1,.PhoneNo2,.MobileNo").attr("data-mask", "");
    $(".PhoneNo1,.PhoneNo2,.MobileNo").inputmask();
    var state = beforeId != "" ? $(beforeId + " #ddlStateIDFK").val() : $("#ddlStateIDFK").val();
    var selector = beforeId != "" ? beforeId + " #ddlStateIDFK" : "#ddlStateIDFK";
    GetCitites(state, "", modelBinding, beforeId);
    register_event(selector, beforeId, modelBinding, "");
})

function GetCitites(stateId, cityId, modelBinding, beforeId) {
    if (cityId == null || cityId == undefined || cityId == "") {
        cityId = $(beforeId + " #CityId").val();
        if (cityId == "") cityId = 0;
    }
    $.get("/civ_Address/GetCities/?CityId=" + cityId + "&StateId=" + stateId + "&modelBinding=" + modelBinding, function (data) {
        $(beforeId+" .City").html(data);
        $(".select2").select2();
    })
}
function register_event(selector,before, Binding,cityId) {
    $(selector).change(function () {
        //var city_binding_id = "#" + (Binding != "" ? Binding + "civ_Address_CityIDFK" : "civ_Address_CityIDFK");
        //var city = $(before + " " + city_binding_id).val();
        GetCitites($(this).val(), cityId, Binding, before);
    });
}
function GetCititesForSiteAutoBinding(stateId, cityId) {
    var Binding = "site";
    var before = "#tab3primary";
    if (cityId == null || cityId == undefined || cityId == "") {
        cityId = $(before + " #CityId").val();
        if (cityId == "") cityId = 0;
    }
    $.get("/civ_Address/GetCities/?CityId=" + cityId + "&StateId=" + stateId + "&modelBinding=" + Binding, function (data) {
        $(before + " .City").html(data);
        $(".select2").select2();
    })
    var selector = before != "" ? before + " #ddlStateIDFK" : "#ddlStateIDFK";
    register_event(selector, before, Binding, cityId);
}
function GetCititesForContactAutoBinding(stateId, cityId) {
    var Binding = "contactPerson";
    var before = "#tab2primary";
    if (cityId == null || cityId == undefined || cityId == "") {
        cityId = $(before + " #CityId").val();
        if (cityId == "") cityId = 0;
    }
    $.get("/civ_Address/GetCities/?CityId=" + cityId + "&StateId=" + stateId + "&modelBinding=" + Binding, function (data) {
        $(before + " .City").html(data);
        $(".select2").select2();
    });
    var selector = before != "" ? before + " #ddlStateIDFK" : "#ddlStateIDFK";
    register_event(selector, before, Binding, cityId);
}