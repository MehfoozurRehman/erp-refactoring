var stateMd = true;
function create() {
    debugger;
    var PremiumHeaderIDFK = $("#div1 #PremiumHeaderIDFK").val();
    toogleBodymodal("#myUserModal");
    $("#myUserModal form").PrettyFormJs({
        serialize: false,
        reset: true,
    });
    //$(".datepicker").val('');
    $("#div1 #PremiumHeaderIDFK").val(PremiumHeaderIDFK);
}
function cancel() {
    var id = "#myUserModal";
    $(id + " #btnAddmodal").show();
    $(id + " #div1").hide();
    $(id + " #div2").show();
}
function GetPremiumDetail(id) {

    ShowLoader();
    $.post("/Settings/PremiumCategory/PremiumCategoryDetailModal", { Id: id }, function (data) {
        hideLoader();
        $("#myUserModal").html(data);
        $("#div1 #PremiumHeaderIDFK").val(id);
        $('#div1 .make-switch').bootstrapSwitch();
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
        Advtable = getInstanceOfPremiumDetail(id);
    }
    else
        Advtable = getInstanceOfPremiumDetail(id);
}
function getInstanceOfPremiumDetail(id) {
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
       { "data": "Type", "orderable": true },
       { "data": "Description", "orderable": true },
       { "data": "Premium", "orderable": true },
       { "data": "SortOrder", "orderable": true },
       { "data": null },
    ]

    return $("#premiumdetail").dataTable({
        "bServerSide": true,
        //"iDisplayLength": pageSize,
        "bFilter": false,
        oLanguage:
        {
            sProcessing: ''
        },
        bProcessing: true,
        "sAjaxSource": "/Settings/PremiumCategory/getInstanceOfPremiumDetail/",
        "columns": arr,
        "fnServerParams": function (aoData) {
            aoData.push({ "name": "page", "value": this.fnPagingInfo().iPage });
            aoData.push({ "name": "PremiumHeaderIDFK", "value": id });
        },
        "fnRowCallback": function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
            var id = aData.Id;
            $('td:last', nRow).html("<a href='javascript:void(0)' class='btn btn-warning' onclick='GetPremiumDetailByID(" + id + ")'>Edit</a>");

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
function OnPremiumDetailComplete(data) {
    hideLoader();
    var id = "#myUserModal";
    $(id + " #btnAddmodal").show();
    $(id + " #div1").hide();
    $(id + " #div2").show();
    AdvInitial(data.PremiumHeaderIDFK)
    $("#myUserModal form").PrettyFormJs({
        serialize: false,
        reset: true,
    });
    $("#div1 #PremiumHeaderIDFK").val(data.PremiumHeaderIDFK);
}
function GetPremiumDetailByID(id) {
    ShowLoader();
    $.get("/Settings/PremiumCategory/GetPremiumDetailByID/" + id, function (data) {
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
function toogleBodymodal(id) {
    $(id + " #btnAddmodal").hide();
    $(id + " #div1").show();
    $(id + " #div2").hide();

}