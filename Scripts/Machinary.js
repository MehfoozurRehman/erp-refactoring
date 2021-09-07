$(document.body).delegate("#machineModal #btnAddmodal", 'click', function (event) {
    toogleBodymodal("#machineModal");
})
$(document.body).delegate("#machineModal #btnCancel", "click", function (event) {
    var id = "#machineModal";
    $(id + " #btnAddmodal").show();
    $(id + " #div1").hide();
    $(id + " #div2").show();
});
function OnMachineItemdetailComplete(data) {
    hideLoader();
    var id = "#machineModal";
    //$(id).show();
    $(id + " #btnAddmodal").show();
    $(id + " #div1").hide();
    $(id + " #div2").show();
    if (mTable != null) {

        mTable.dataTable().fnDestroy();
        mTable = getInstanceOfMachinaryItem();

    } else {
        mTable = getInstanceOfMachinaryItem();
    }
   
    if (dTable != null) {
        dTable.dataTable().fnDestroy();
        dTable = getInstanceOfMachinaryDetail(data.itemid);
    }
    else {
        dTable = getInstanceOfMachinaryDetail(data.itemid);

    }


    $("#tab3primary #machinetabprimary #machineModal form").PrettyFormJs({
        serialize: false,
        reset: true,
    });
    $(id + " #ItemIDFK").val(data.itemid);
    //state = true;
   // toogleBodymodal("#tab3primary #machinetabprimary #machineModal");

}
function ItemDetailModal(id) {

    ShowLoader();
    //var categoryidFk = ItemCategoryIDFK;
    $.post("/Purchase/Item/ItemDetailModal", {}, function (data) {
        hideLoader();
        debugger;
        $("#tab3primary #machinetabprimary #machineModal").html(data)
        $("#tab3primary #machinetabprimary #machineModal #ItemIDFK").val(id);
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
        $('#tab3primary #machinetabprimary #machineModal .select2').select2();
        $('#tab3primary #machinetabprimary #machineModal form').on('focus', ':input', function () {
            $(this).attr('autocomplete', 'off');

        });
        $("#tab3primary #machinetabprimary #machineModal form").attr('autocomplete', 'off');
        $("#tab3primary #machinetabprimary #machineModal form").validationEngine({
            scroll: true
        });
        if (dTable != null) {
            dTable.dataTable().fnDestroy();
            dTable = getInstanceOfMachinaryDetail(id);
        }
        else
            dTable = getInstanceOfMachinaryDetail(id);
    });
}
function getInstanceOfMachinaryDetail(id) {
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
       { "data": "Model", "orderable": true },
       { "data": "Color", "orderable": true },
       { "data": "PurchasedPrice", "orderable": true },
       { "data": "RegistrationNum", "orderable": true },
        { "data": "Manufacturer", "orderable": true },
       { "data": null },
    ]

    return $("#itemdetailtable").dataTable({
        "bServerSide": true,
        //"iDisplayLength": pageSize,
        oLanguage: {
            sProcessing: ''
        },
        bProcessing: true,
        "sAjaxSource": "/Purchase/Item/getInstanceOfMachinaryDetail/",
        "columns": arr,
        "fnServerParams": function (aoData) {
            aoData.push({ "name": "page", "value": this.fnPagingInfo().iPage });
            aoData.push({ "name": "Itemid", "value": id });
        },
        "fnRowCallback": function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
            var id = aData.Id;
            $('td:last', nRow).html("<a href='javascript:void(0)' class='btn btn-warning' onclick='GetItemDetailByID(" + id + ")'>Edit</a>");
            //$('td:eq(2)', nRow).html(convertDate(aData.Date));
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
function GetItemDetailByID(id) {
    ShowLoader();
    $.get("/Purchase/Item/GetItemDetailByID/" + id, function (data) {
        hideLoader();
        //OnInfo("Data Loaded<br/>" + "Name: " + data.item.ItemName + "<br/>", true);
        $("#tab3primary #machinetabprimary #machineModal form").PrettyFormJs({
            serialize: false,
            populate: true,
            jsonData: data.itemdetail,
            reset: false,
            prefix: ['itemdetail\\.']

        });
        state = false;
        toogleBodymodal("#machineModal");
    });
}
function toogleBodymodal(id) {
    $(id + " #btnAddmodal").hide();
    $(id + " #div1").show();
    $(id + " #div2").hide();
}