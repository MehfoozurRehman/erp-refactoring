var stateMd = true;
var SiteQtys = [];
var itemidfk="";

$(document.body).delegate("#tab #myUserModal #btnAddmodal", 'click', function (event) {
    toogleBodymodal("#myUserModal");
    var itemid = $("#tab #myUserModal #ItemIDFK").val();
    $("#tab #myUserModal form").PrettyFormJs({
        serialize: false,
        reset: true,
    });


})
$(document.body).delegate("#tab #myUserModal #btnCancel", "click", function (event) {
    var id = "#tab #myUserModal";
    $(id + " #btnAddmodal").show();
    $(id + " #div1").hide();
    $(id + " .div2").show();
});
function setStateMd(s) {
    stateMd = s;
}
function toogleBodymodal(id) {
    $(id + " #btnAddmodal").hide();
    $(id + " #div1").show();
    $(id + " .div2").hide();

}

function LocationModal(ItemCategoryIDFK, id) {

    ShowLoader();
    var categoryidFk = ItemCategoryIDFK;
    itemidfk=id;
    $.post("/Purchase/Items/LocationModal", { ItemCategoryIDFK: categoryidFk, itemid :id}, function (data) {
        hideLoader();
        $("#tab #myUserModal").html(data);
        $("#tab #myUserModal #ItemIDFK").val(id);
        $('#tab #myUserModal form').on('focus', ':input', function () {
            $(this).attr('autocomplete', 'off');

        });
        $("#tab #myUserModal form").attr('autocomplete', 'off');
        $("#tab #myUserModal form").validationEngine({
            scroll: true
        }); 

    });
}
$("#tab #myUserModal").on("hidden.bs.modal", function () {
    SiteQtys = [];
});
$(document.body).delegate('#tab #myUserModal #btnSave', 'click', function () {
    var tr = $('#POITable tbody tr:last');
    var lastTrSr = parseInt($(tr).find("td:first").text());
    var lastSr = SiteQtys.length;
    //var o = GetObjById(SiteQtys, "sr", lastSr);
    if (lastTrSr > lastSr) {
        var bool = $(tr).find("form").validationEngine('validate');
        if (!bool) return;
        var obj = {
            sr: (SiteQtys.length + 1),
            ProjectId: $(tr).find("select[name=Projectid]").val(),
            Qty: $(tr).find("input[name=qty]").val(),
            GradeIDFK: $(tr).find("select[name=gradeId]").val(),
           // Comment: $(tr).find("input[name=comment]").val()
        };
        var res = GetObjByTwoProps(SiteQtys, "ProjectId", obj.ProjectId, "GradeId", obj.GradeIDFK);
        if (res == null) {
            SiteQtys.push(obj);
        } else {
            if (obj.sr != res.sr) {
                OnWarningModal("You Already Add Quantity in this Grade and Project");
                return;
            }
        }
    } 
        var arr = [];
        $("#POITable tbody tr").each(function (i, tr) {
            var obj = {
                sr: (i + 1),
                ProjectId: $(tr).find("select[name=Projectid]").val(),
                Qty: $(tr).find("input[name=qty]").val(),
                GradeIDFK: $(tr).find("select[name=gradeId]").val(),
                Comment: $(tr).find("input[name=comment]").val()
            };
            arr.push(obj);
        });
        $.post("/Purchase/Items/NonConsumablePurchaseRegister", { ItemId: itemidfk, siteqty: arr }, function (data) {
            OnSuccessModal(data.msg);
            hideLoader();
            var id = "#tab #myUserModal";
            $(id + " #btnAddmodal").show();
            $(id + " #div1").hide();
            $(id + " .div2").show();
            if (Loctable[itemidfk] != null) {
                Loctable[itemidfk].dataTable().fnDestroy();
                Loctable[itemidfk] = getInstancePurchaselist(itemidfk);
            }
            else
                Loctable[itemidfk] = getInstancePurchaselist(itemidfk);
        });
        toogleBodymodal();
        //console.log(arr);
});


function deleteRow(row) {
    var i = row.parentNode.parentNode.rowIndex;
    if (i > 1) {
        row = jQuery(row);
        var tr = $(row).closest('tr');
        var projectId = $(tr).find("select[name=Projectid]").val();
        var GradeId = $(tr).find("select[name=gradeId]").val();
        findAndRemoveTwoProps(SiteQtys, "ProjectId", projectId, "GradeId", GradeId);
        document.getElementById('POITable').deleteRow(i);
        var lastSerial = UpdateSerialNo();
        $("#POITable tbody tr:nth-child(" + (lastSerial + 1) + ") td:first").text(lastSerial + 1);
    }
    if (i == 1) {
        SiteQtys = [];
        var tr = $(row).closest('tr');
        $(tr).find("input,select").attr("disabled", false);
        $("#POITable tbody tr:not(:first-child)").remove();
    }
}
function UpdateSerialNo() {
    var lastSerial = 1;
    for (var i = 0; i < SiteQtys.length; i++) {
        SiteQtys[i].sr = i + 1;
        var nthchild = i + 1;
        $("#POITable tbody tr:nth-child(" + nthchild + ") td:first").text(i + 1);
        lastSerial = i + 1;
    }
    return lastSerial;
}
function insRow() {
    var tr = $('#POITable tbody tr:last');
    var bool = $(tr).find("form").validationEngine('validate');
    if (!bool) return;
    var obj = {
        sr: $(tr).find("td:first").text(),
        ProjectId: $(tr).find("select[name=Projectid]").val(),
        Qty: $(tr).find("input[name=qty]").val(),
        GradeId: $(tr).find("select[name=gradeId]").val(),
        //Comment: $(tr).find("input[name=comment]").val()
    };
    var res = GetObjByTwoProps(SiteQtys, "ProjectId", obj.ProjectId, "GradeId", obj.GradeId);
    if (res == null) {
        SiteQtys.push(obj);
        $(tr).find("input,select").attr("disabled", true);
    } else {
        if (obj.sr != res.sr) {
            OnWarningModal("You Already Add Quantity in this Grade and Project");
            return;
        }
    }
   
    var x = document.getElementById('POITable');
    var new_row = x.rows[1].cloneNode(true);
    var len = x.rows.length;
    new_row.cells[0].innerHTML = len;
    var inp1 = new_row.cells[1].getElementsByTagName('select')[0];
    inp1.id += len;
    inp1.value = '';
    var inp2 = new_row.cells[2].getElementsByTagName('input')[0];
    inp2.id += len;
    inp2.value = '';
    var inp3 = new_row.cells[3].getElementsByTagName('select')[0];
    inp3.id += len;
    inp3.value = '';
    var inp4 = new_row.cells[4].getElementsByTagName('input')[0];
    inp4.id += len;
    inp4.value = '';
    var y = document.getElementById('tbody');
    y.appendChild(new_row);
    var lastTr = $('#POITable tbody tr:last');
    $(lastTr).find("form").removeClass('validating');
    $(lastTr).find("input,select").attr("disabled", false);
    var lastSerial = UpdateSerialNo();
    $("#POITable tbody tr:nth-child(" + (lastSerial + 1) + ") td:first").text(lastSerial + 1);
  
}
function getInstancePurchaselist(id) {
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
       { "data": "ProjectName", "orderable": true },
       { "data": "Quantity", "orderable": true },
       { "data": "Grade", "orderable": true },
       { "data": "Location", "orderable": true },
       
    ]

    return $("#Grntable" + id).dataTable({
        "bServerSide": true,
         oLanguage: {
            sProcessing: ''
        },
        bProcessing: true,
        "sAjaxSource": "/Purchase/Items/getInstancePurchaselist/",
        "columns": arr,
        "fnServerParams": function (aoData) {
            aoData.push({ "name": "page", "value": this.fnPagingInfo().iPage });
            aoData.push({ "name": "Itemid", "value": id });
        },
        "fnRowCallback": function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
        },
        "footerCallback": function (row, data, start, end, display) {
        },
        "fnInitComplete": function (oSettings, json) {
            var record = json.iTotalRecords;
            if (record > 0) {
                $("#myUserModal #btnAddmodal").remove();
            }
        }
    }).on('processing.dt', function (e, settings, processing) {
        if (processing) {
            $("#div2"+id+" .overlay").attr('style', 'display:block;')
        } else {
            $("#div2" + id + " .overlay").attr('style', 'display:none;')
        }
    });

}