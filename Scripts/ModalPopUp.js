var stateMd = true;


function create() {
    var itemid = $("#div1 #ItemIDFK").val();
    toogleBodymodal("#myUserModal");
    $("#myUserModal form").PrettyFormJs({
        serialize: false,
        reset: true,
    });
    $(".datepicker").val('');
    $("#div1 #ItemIDFK").val(itemid);
}
function cancel() {
    var id = "#myUserModal";
    $(id + " #btnAddmodal").show();
    $(id + " #div1").hide();
    $(id + " #div2").show();
}

function OnConsumablePriceComplete(data) {
    hideLoader();
    var id = "#myUserModal";
    $(id + " #btnAddmodal").show();
    $(id + " #div1").hide();
    $(id + " #div2").show();
    if (Pricetable != null) {

        Pricetable.dataTable().fnDestroy();
        Pricetable = getInstanceOfConsumeableitemPrice(data.itemid);

    } else {
        Pricetable = getInstanceOfConsumeableitemPrice(data.itemid);
    }
    if (otable != null) {
        otable.dataTable().fnDestroy();
        otable = getInstanceOfConsumeableitem(catid);
    }
    else {
        otable = getInstanceOfConsumeableitem(catid);

    }


    $("#myUserModal form").PrettyFormJs({
        serialize: false,
        reset: true,
    });
    $("#div1 #ItemIDFK").val(data.itemid);
  

}
function CosnumePriceModal(ItemCategoryIDFK, id) {

    ShowLoader();
    var categoryidFk = ItemCategoryIDFK;
    $.post("/Purchase/Items/CosnumePriceModal", { ItemCategoryIDFK: categoryidFk }, function (data) {
        hideLoader();
        $("#myUserModal").html(data)
        $("#div1 #ItemIDFK").val(id);
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
            Pricetable = getInstanceOfConsumeableitemPrice(id);
        }
        else
            Pricetable = getInstanceOfConsumeableitemPrice(id);
    });
}
function getInstanceOfConsumeableitemPrice(id) {
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
       { "data": "SupplierName", "orderable": true },
       { "data": "Price", "orderable": true },
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
        "sAjaxSource": "/Purchase/Items/getInstanceOfConsumeableitemPrice/",
        "columns": arr,
        "fnServerParams": function (aoData) {
            aoData.push({ "name": "page", "value": this.fnPagingInfo().iPage });
            aoData.push({ "name": "Itemid", "value": id });
        },
        "fnRowCallback": function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
            var id = aData.Id;
            var itemName = aData.ItemName;
            $("#sItemName").text(itemName);
            $('td:last', nRow).html("<a href='javascript:void(0)' class='btn btn-warning' onclick='GetItemPriceByID(" + id + ")'>Edit</a>");
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
function GetItemPriceByID(id) {
    ShowLoader();
    $.get("/Purchase/Items/GetItemPriceByID/" + id, function (data) {
        hideLoader();
       
        $("#myUserModal form").PrettyFormJs({
            serialize: false,
            populate: true,
            jsonData: data.itemprice,
            reset: false,
            prefix: ['itemprice\\.']

        });
        state = false;
        toogleBodymodal("#myUserModal");
    });
}
//function resetFormnew(id) {
//    debugger;
//    $(id + " form").PrettyFormJs({
//        serialize: false,
//        reset: true,
//    });
//    $(".datepicker").val('');
//}
function setStateMd(s) {
    stateMd = s;
}
function toogleBodymodal(id) {
    $(id + " #btnAddmodal").hide();
    $(id + " #div1").show();
    $(id + " #div2").hide();
 
}