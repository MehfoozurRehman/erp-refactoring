var stateMd = true;
function create() {
    debugger;
    var ItemCategoryIDFK = $("#div1 #ItemCategoryIDFK").val();
    toogleBodymodal("#ItemTypeModal");
    $("#ItemTypeModal form").PrettyFormJs({
        serialize: false,
        reset: true,
    });
    $("#div1 #ItemCategoryIDFK").val(ItemCategoryIDFK);
}
function cancel() {
    var id = "#ItemTypeModal";
    $(id + " #btnAddmodal").show();
    $(id + " #div1").hide();
    $(id + " #div2").show();
}
function GetItemTypeListByCategoryID(id) {

    ShowLoader();
    $.post("/Settings/ItemCategories/ItemTypeModal", { Id: id }, function (data) {
        hideLoader();
        $("#ItemTypeModal").html(data);
        $("#div1 #ItemCategoryIDFK").val(id);
        $('#ItemTypeModal form').on('focus', ':input', function () {
            $(this).attr('autocomplete', 'off');

        });
        $("#ItemTypeModal form").attr('autocomplete', 'off');
        $("#ItemTypeModal form").validationEngine({
            scroll: true
        });

        ITInitial(id)
    });
}
function ITInitial(id) {
    if (ITtable != null) {
        ITtable.dataTable().fnDestroy();
        ITtable = getInstanceOfItemTypeList(id);
    }
    else
        ITtable = getInstanceOfItemTypeList(id);
}
function getInstanceOfItemTypeList(id) {
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
       { "data": "TypeName", "orderable": true },
       { "data": null },
    ]

    return $("#ItemTypeList").dataTable({
        "bServerSide": true,
        "bFilter": false,
        //"iDisplayLength": pageSize,
        oLanguage: {
            sProcessing: ''
        },
        bProcessing: true,
        "sAjaxSource": "/Settings/ItemCategories/getInstanceOfItemTypeList/",
        "columns": arr,
        "fnServerParams": function (aoData) {
            aoData.push({ "name": "page", "value": this.fnPagingInfo().iPage });
            aoData.push({ "name": "ItemCategoryIDFK", "value": id });
        },
        "fnRowCallback": function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
            var id = aData.Id;
            $('td:last', nRow).html("<a href='javascript:void(0)' class='btn btn-warning' onclick='GetItemTypeByID(" + id + ")'>Edit</a>");

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
function OnItemTypeComplete(data) {
    hideLoader();
    var id = "#ItemTypeModal";
    $(id + " #btnAddmodal").show();
    $(id + " #div1").hide();
    $(id + " #div2").show();
    ITInitial(data.ItemCategoryIDFK)
    $("#ItemTypeModal form").PrettyFormJs({
        serialize: false,
        reset: true,
    });
    $("#div1 #ItemCategoryIDFK").val(data.ItemCategoryIDFK);
}
function GetItemTypeByID(id) {
    ShowLoader();
    $.get("/Settings/ItemCategories/GetItemTypeByID/" + id, function (data) {
        hideLoader();
        debugger;
        $("#ItemTypeModal form").PrettyFormJs({
            serialize: false,
            populate: true,
            jsonData: data.detail,
            reset: false,
            prefix: [""]
        });
        state = false;
        toogleBodymodal("#ItemTypeModal");
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