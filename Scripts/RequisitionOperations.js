$(document).ready(function () {
    $(document.body).delegate('.duplicate_row', 'click', function () {
        var IsDisabled = $(this).attr('disabled');
        if (!IsDisabled) {
            ShowLoader();
            var id = $(this).attr('data-id');
            var HeaderIDFK = $(this).attr('data-headeridfk');
            var ItemIDFK = $(this).attr('data-itemidfk');
            $.post("/Purchase/PurchaseRequisition/DuplicateRow/" + id, function (data) {
                if (data.msg == "Record Save Successfully") {
                    OnSuccess(data.msg)
                } else {
                    OnWarning(data.msg);
                }
                if (itable[HeaderIDFK + "_" + ItemIDFK] != null) {
                    itable[HeaderIDFK + "_" + ItemIDFK].dataTable().fnDestroy();
                    itable[HeaderIDFK + "_" + ItemIDFK] = getPartialInstanceOfPurchaseRequisitionDetailViewModel(HeaderIDFK, ItemIDFK);
                }

            });
        }
    });
    $(document.body).delegate('.Delete_duplicate_row', 'click', function () {
        var IsDisabled = $(this).attr('disabled');
        if (!IsDisabled) {
            ShowLoader();
            var id = $(this).attr('data-id');
            var HeaderIDFK = $(this).attr('data-headeridfk');
            var ItemIDFK = $(this).attr('data-itemidfk');
            $.get("/Purchase/PurchaseRequisition/DeleteDuplicateRow/" + id, function (data) {
                if (data.msg == "Record Deleted Successfully") {
                    OnSuccess(data.msg)
                } else {
                    OnWarning(data.msg);
                }
                if (itable[HeaderIDFK + "_" + ItemIDFK] != null) {
                    itable[HeaderIDFK + "_" + ItemIDFK].dataTable().fnDestroy();
                    itable[HeaderIDFK + "_" + ItemIDFK] = getPartialInstanceOfPurchaseRequisitionDetailViewModel(HeaderIDFK, ItemIDFK);
                }

            });
        }
    });
    //function Delete(obj, id) {
    //    ShowLoader();
    //    $.get("/Purchase/PurchaseRequisition/DeleteDuplicateRow/" + id, function (data) {
    //        OnSuccess(data.msg == "Record Deleted Successfully");
    //        otableinitialize();
    //    })
    //}
});

function SaveRequisitionDetail(RQty,id,frm) {
    var list = $(frm).PrettyFormJs();
    //console.log(list.RequisitionDetail);
    ShowLoader();
    $.post("/Purchase/PurchaseRequisition/SaveRequisitionDetail/", { list: list.RequisitionDetail,RQty : RQty }, function (data) {
        if (data.msg == "Record Save Successfully") {
            OnSuccess(data.msg);
            init_uperpartialtable(id);
        } else {
            OnWarning(data.msg);
        }
    });
    return false;
}
function SendForApproval(clubNo) {
    ShowLoader();
    $.get("/Purchase/PurchaseRequisition/SendForApproval/?clubNo=" + clubNo, function (data) {
        if (data.msg == "Successfully Send") {
            OnSuccess(data.msg);
            init_table(open);
        } else {
            OnWarning(data.msg);
        }
    });
}
function Approved(clubNo) {
    ShowLoader();
    $.get("/Purchase/PurchaseRequisition/Approved/?clubNo=" + clubNo, function (data) {
        if (data.msg == "Successfully Approved") {
            OnSuccess(data.msg);
            init_table(inprocess);
        } else {
            OnWarning(data.msg);
        }
    });
}