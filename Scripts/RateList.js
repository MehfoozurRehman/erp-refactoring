$(document.body).delegate("#myUserModal #btnAddmodal", 'click', function (event) {
    toogleBodymodal("#myUserModal");
})
$(document.body).delegate("#myUserModal #btnCancel", "click", function (event) {
    var id = "#myUserModal";
    $(id + " #btnAddmodal").show();
    $(id + " #div1").hide();
    $(id + " #div2").show();
});
function OnRateListComplete(data) {
    hideLoader();
    var id = "#myUserModal";
    $(id + " #btnAddmodal").show();
    $(id + " #div1").hide();
    $(id + " #div2").show();
    if (Pricetable != null) {

        Pricetable.dataTable().fnDestroy();
        Pricetable = getInstanceOfRateList(data.serviceid);

    } else {
        Pricetable = getInstanceOfRateList(data.serviceid);
    }
    if (otable != null) {
        otable.dataTable().fnDestroy();
        otable = getInstanceOfServices();
    }
    else {
        otable = getInstanceOfServices();

    }


    $("#myUserModal form").PrettyFormJs({
        serialize: false,
        reset: true,
    });
    $(id + " #ServiceIDFK").val(data.serviceid);


}
function RateModal(CategoryIDFK, id) {

    ShowLoader();
    var categoryidFk = CategoryIDFK;
    $.post("/Purchase/Service/RateList", { CategoryIDFK: categoryidFk, id: id }, function (data) {
        hideLoader();
        $("#myUserModal").html(data)
        $("#myUserModal #ServiceIDFK").val(id);
        $('.datepicker').datepicker({
            //autoclose: true,
            format: dateformat,
            showStatus: true,
            showWeeks: true,
            currentText: 'Now',
            autoSize: true,
            gotoCurrent: true,
            showAnim: 'blind',
            highlightWeek: true
        })

        $('#myUserModal form').on('focus', ':input', function () {
            $(this).attr('autocomplete', 'off');

        });
        $("#myUserModal form").attr('autocomplete', 'off');
        $("#myUserModal form").validationEngine({
            scroll: true
        });
        if (Pricetable != null) {
            Pricetable.dataTable().fnDestroy();
            Pricetable = getInstanceOfRateList(id);
        }
        else
            Pricetable = getInstanceOfRateList(id);
    });
}
function getInstanceOfRateList(id) {
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
       { "data": "ContractorName", "orderable": true },
       { "data": "Rate", "orderable": true },
       { "data": "Date", "orderable": true },
       { "data": "Comments", "orderable": true },
       { "data": null },
    ]

    return $("#consumeableitemPricetable").dataTable({
        "bServerSide": true,
        //"iDisplayLength": pageSize,
        oLanguage: {
            sProcessing: ''
        },
        bProcessing: true,
        "sAjaxSource": "/Purchase/Service/RateListDataProviderAction/",
        "columns": arr,
        "fnServerParams": function (aoData) {
            aoData.push({ "name": "page", "value": this.fnPagingInfo().iPage });
            aoData.push({ "name": "ServiceIDFK", "value": id });
        },
        "fnRowCallback": function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
            var id = aData.Id;
            var serviceName = aData.ServiceName;
            $("#sName").text(serviceName);
            $('td:last', nRow).html("<a href='javascript:void(0)' class='btn btn-warning' onclick='GetRateByID(" + id + ")'>Edit</a>");
            $('td:eq(2)', nRow).html(convertDate(aData.Date));
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
function GetRateByID(id) {
    ShowLoader();
    $.get("/Purchase/Service/GetRateByID/" + id, function (data) {
        hideLoader();
        //OnInfo("Data Loaded<br/>" + "Name: " + data.item.ItemName + "<br/>", true);
        $("#myUserModal form").PrettyFormJs({
            serialize: false,
            populate: true,
            jsonData: data,
            reset: false,
           // prefix: ['itemprice\\.']

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