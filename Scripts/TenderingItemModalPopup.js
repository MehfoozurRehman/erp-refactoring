var stateMd = true;
var StatusId = 0;
function create() {

    var ProjectIDFK = $("#div1 #ProjectIDFK").val();
    toogleBodymodal("#myUserModal");
    $("#myUserModal form").PrettyFormJs({
        serialize: false,
        reset: true,
    });
    $("#div1 #ProjectIDFK").val(ProjectIDFK);
}
function cancel() {
    var id = "#myUserModal";
    $(id + " #btnAddmodal").show();
    $(id + " #div1").hide();
    $(id + " #div2").show();
}
function GetTenderingItemList(id) {
    debugger;
    ShowLoader();
    $.post("/TenderingModule/BOQ/TenderingItems", { Id: id }, function (data) {
        hideLoader();
        $("#myUserModal").html(data);
       
        $("#div1 #ProjectIDFK").val(id);
       
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
        $('input.number').keyup(function (event) {

            // skip for arrow keys
            if (event.which >= 37 && event.which <= 40) return;

            // format number
            $(this).val(function (index, value) {
                return getCurrency(value);
            });
        });

        $('#myUserModal form').on('focus', ':input', function () {
            $(this).attr('autocomplete', 'off');

        });
        $("#myUserModal form").attr('autocomplete', 'off');
        $("#myUserModal form").validationEngine({
            scroll: true
        });
        StatusId = $("#StatusTab .active a").attr('id');
        debugger;
        tenInitial(id, StatusId)
    });
}
function RateState(id) {
    StatusId = id;
    var ProjectIDFK = $("#div1 #ProjectIDFK").val();
    if (StatusId != open)
    {
        cancel();
    }
    if (id == undefined)
    {
        id = $(".active a").attr('id');
        
        tenInitial(ProjectIDFK, StatusId)
    }
    else
    {
        
        tenInitial(ProjectIDFK, StatusId)
    }
    if (StatusId == open || StatusId == inprocess)
    {
        $("#Ratebtn .btnRate").removeAttr('hidden');
        if (StatusId == open)
        {
            $("#Ratebtn .btncreaterate").removeAttr("hidden");
        }
    }
    else {
        $("#Ratebtn .btnRate").attr("hidden", true);
        $("#Ratebtn .btncreaterate").attr("hidden", true);
    }

}
function tenInitial(id, StatusId) {
    if (tentable != null) {
        tentable.dataTable().fnDestroy();
        tentable = getInstanceOfTenderingItemsList(id, StatusId);
    }
    else
        tentable = getInstanceOfTenderingItemsList(id, StatusId);
}
function getInstanceOfTenderingItemsList(id, StatusId) {
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
    arr =
     [
       { "data": "ItemName", "orderable": true },
       { "data": "ItemCode", "orderable": true },
       { "data": "unit", "orderable": true },
       { "data": "Qty", "orderable": true },
       { "data": "TenderingRate", "orderable": true },
       { "data": "PurchaserRate", "orderable": true },
       { "data": null },
     ]

    return $("#TenderingItems").dataTable({
        "bServerSide": true,
        //"iDisplayLength": pageSize,
        oLanguage:
        {
            sProcessing: ''
        },
        bProcessing: true,
        "sAjaxSource": "/TenderingModule/BOQ/GetInstanceOfTenderingItem/",
        "columns": arr,
        "fnServerParams": function (aoData) {
            aoData.push({ "name": "page", "value": this.fnPagingInfo().iPage });
            aoData.push({ "name": "ProjectIDFK", "value": id });
            aoData.push({ "name": "StatusId", "value": StatusId });
        },
        "fnRowCallback": function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
            var id = aData.Id;
            var html = ""
            if (aData.StatusIDFK !== 9)
            {
                if (canEditTenderingItem) {
                    html += "<a href='javascript:void(0)' class='btn btn-warning' onclick='GetTenderingItemByID(" + id + ")'>Edit</a>";
                }
                if (canDeleteTenderingItem) {
                    html += " <a href='javascript:void(0)' class='btn btn-danger' onclick='DeleteTenderingItemByID(" + id + ")'>Delete</a>";
                }
            }
            $('td:last', nRow).html(html);

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
function OnComplete(data) {
    
    debugger;
    if (data.msg == "Record Save Successfully")
    {
        OnSuccessModal(data.msg);
        var id = "#myUserModal";
        $(id + " #btnAddmodal").show();
        $(id + " #div1").hide();
        $(id + " #div2").show();
        tenInitial(data.ProjectIDFK, StatusId)
        $("#myUserModal form").PrettyFormJs({
            serialize: false,
            reset: true,
        });
        $("#div1 #ProjectIDFK").val(data.ProjectIDFK);
    }
    else
    {
        OnWarningModal(data.msg);
    }
}
function GetTenderingItemByID(id) {
    ShowLoader();
    $.get("/TenderingModule/BOQ/GetTenderingItemByID/" + id, function (data) {
        hideLoader();
        debugger;
        $("#myUserModal form").PrettyFormJs({
            serialize: false,
            populate: true,
            jsonData: data.detail,
            reset: false,
            prefix: [""]
        });
        $("#hdfItemId").val(data.dropdown.id);
        $("#hdfItemText").val(data.dropdown.name);
        $("#hdfCategoryId").val(data.dropdown.type);
        $("#RawItemSugg").val(data.dropdown.name)
        state = false;
        toogleBodymodal("#myUserModal");
    });
}
function DeleteTenderingItemByID(id) {
    ShowLoader();
    $.get("/TenderingModule/BOQ/DeleteTenderingItemByID/" + id, function (data) {
        OnSuccessModal(data.msg);
        var ProjectIDFK = $("#div1 #ProjectIDFK").val();
        tenInitial(ProjectIDFK, StatusId)
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
function PostToPurchaser() {
    var status = StatusId;
    if (StatusId == open) {
        status = pending;
    }
    if (StatusId == inprocess) {
        status = complete;
    }
    ShowLoader();
    $.get('/TenderingModule/BOQ/PostToPurchaser', { StatusID: status }, function (data) {
        if (data.msg == 'Record Save Successfully') {
            OnSuccessModal(data.msg)
        }
        else if (data.msg == 'Record Successfully Update') {
            OnSuccessModal(data.msg)
        }
        else {
            OnFailureModal(data);
        }
        var ProjectIDFK = $("#div1 #ProjectIDFK").val();
        tenInitial(ProjectIDFK, StatusId)
    });

}