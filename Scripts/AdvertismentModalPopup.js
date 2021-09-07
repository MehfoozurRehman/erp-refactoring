var stateMd = true;
function create()
{
    debugger;
    var AdvertismentInfoIDFK = $("#div1 #AdvertismentInfoIDFK").val();
    toogleBodymodal("#myUserModal");
    $("#myUserModal form").PrettyFormJs({
        serialize: false,
        reset: true,
    });
    //$(".datepicker").val('');
    $("#div1 #AdvertismentInfoIDFK").val(AdvertismentInfoIDFK);
}
function cancel() {
    var id = "#myUserModal";
    $(id + " #btnAddmodal").show();
    $(id + " #div1").hide();
    $(id + " #div2").show();
}
function GetAdvertismentCheckList(id)
{

    ShowLoader();
    $.post("/TenderingModule/Client/AdvertismentCheckListModal", { Id: id }, function (data)
    {
        hideLoader();
        $("#myUserModal").html(data);
        $("#div1 #AdvertismentInfoIDFK").val(id);
        $('#myUserModal form').on('focus', ':input', function () {
            $(this).attr('autocomplete', 'off');

        });
        $("#myUserModal form").attr('autocomplete', 'off');
        $("#myUserModal form").validationEngine({
            scroll: true
        });
        
        AdvInitial(id)
    });
}
function AdvInitial(id) {
    if (Advtable != null) {
        Advtable.dataTable().fnDestroy();
        Advtable = getInstanceOfAdvertismentCheckList(id);
    }
    else
        Advtable = getInstanceOfAdvertismentCheckList(id);
}
function getInstanceOfAdvertismentCheckList(id) {
    debugger;
    $.fn.dataTableExt.oApi.fnPagingInfo = function (oSettings) {
        return {
            "iStart": oSettings._iDisplayStart,
            "iEnd": oSettings.fnDisplayEnd(),
            "iLength": oSettings._iDisplayLength,
            "iTotal": oSettings.fnRecordsTotal(),
            "iFilteredTotal": oSettings.fnRecordsDisplay(),
            "iPage": Math.ceil(oSettings._iDisplayStart / oSettings._iDisplayLength),
            "iTotalPages": Math.ceil(oSettings.fnRecordsDisplay() / oSettings._iDisplayLength)
        };
    };
    var arr = [];
    arr = [
       { "data": "Title", "orderable": true },
       { "data": "Name", "orderable": true },
       { "data": null },
    ]

    return $("#checklisttable").dataTable({
        "bServerSide": true,
        //"iDisplayLength": pageSize,
        oLanguage: {
            sProcessing: ''
        },
        bProcessing: true,
        "sAjaxSource": "/TenderingModule/Client/getInstanceOfAdvertismentDetail/",
        "columns": arr,
        "fnServerParams": function (aoData) {
            aoData.push({ "name": "page", "value": this.fnPagingInfo().iPage });
            aoData.push({ "name": "AdvertismentInfoIDFK", "value": id });
        },
        "fnRowCallback": function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
            var id = aData.Id;
            $('td:last', nRow).html("<a href='javascript:void(0)' class='btn btn-warning' onclick='GetAdvertismentDetailByID(" + id + ")'>Edit</a>");
           
        },
        "footerCallback": function (row, data, start, end, display) {
        },
        "fnInitComplete": function (oSettings, json) {
        }
    }).on('processing.dt', function (e, settings, processing) {
        if (processing) {
            $(".overlay").attr('style', 'display:block;')
        } else {
            $(".overlay").attr('style', 'display:none;')
        }
    });

}
function OnAdvertismentComplete(data)
{
    hideLoader();
    var id = "#myUserModal";
    $(id + " #btnAddmodal").show();
    $(id + " #div1").hide();
    $(id + " #div2").show();
    AdvInitial(data.AdvertismentInfoIDFK)
    $("#myUserModal form").PrettyFormJs({
        serialize: false,
        reset: true,
    });
    $("#div1 #AdvertismentInfoIDFK").val(data.AdvertismentInfoIDFK);
}
function GetAdvertismentDetailByID(id) {
    ShowLoader();
    $.get("/TenderingModule/Client/GetAdvertismentDetailByID/" + id, function (data) {
        hideLoader();
        debugger;
        $("#myUserModal form").PrettyFormJs({
            serialize: false,
            populate: true,
            jsonData: data.detail,
            reset: false,
            prefix: [""]
        });
        state = false;
        toogleBodymodal("#myUserModal");
    });
}
function setStateMd(s) {
    stateMd = s;
}
function toogleBodymodal(id)
{
    $(id + " #btnAddmodal").hide();
    $(id + " #div1").show();
    $(id + " #div2").hide();

}