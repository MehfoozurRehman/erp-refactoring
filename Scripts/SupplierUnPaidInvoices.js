var url_table = "/Purchase/PurchaseInvoice/PurchaseUnPaidInvoicesDataProviderAction/";
var pptable = null;
var potable = null;
var ptable = [];
var detail_open = false;
var with_table = null;
var itemIds = [];
$(document).ready(function () {
    $("#SupplierIDFK").change(function () {
        ChangeFunc();
    });
    $('#partialSupplierUnPaidInvoices tbody,#partialSupplierUnPaidInvoices1 tbody').on('click', 'td.details-control', function () {

        var tr = $(this).closest('tr')
            , row = potable.row(tr);
        console.log(tr);
        if (row.child.isShown()) {
            // This row is already open - close it
            row.child.hide();
            tr.removeClass('shown');
            detail_open = false;
        }
        else {
            // Open this row
            row.child(format_purchase(row.data())).show();
            tr.addClass('shown');
            detail_open = true;
        }
    });
});
function ChangeFunc() {
    var val = $("#SupplierIDFK").val();
    if (val == "") {
        OnWarning("Please Select Supplier");
        return;
    }
    init_table(val);
}
function init_with_table() {
    if (with_table == null) {
        with_table = getInstanceOfWithHoldingUnPaidInvoices();
    } else {
        $(with_table).dataTable().fnDestroy();
        with_table = getInstanceOfWithHoldingUnPaidInvoices();
    }
}
function init_table(id) {
    if (pptable == null) {
        pptable = getPartialInstanceOfSupplierUnPaidInvoices(id);
    }
    else {
        pptable.dataTable().fnDestroy();
        pptable = getPartialInstanceOfSupplierUnPaidInvoices(id);
    }
    potable = $(pptable).dataTable().api();
}
function format_purchase(d) {
    var div = $(' <div class="loading"><i class="fa fa-refresh fa-spin"></i></div>');
    $.get("/Purchase/PurchaseInvoice/InvoiceDetail/" + d.Id, function (html) {
        div.removeClass("loading");
        div.html(html);
    });
    return div;
}
function getPartialInstanceOfSupplierUnPaidInvoices(id) {

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
    arr.push({ "data": null, "className": 'details-control' })
    //arr.push( { "data": "AccountId","className": 'AccountId'})
    arr.push({ "data": "AccCode", "className": 'AccCode' })
    //if (id > 0) {
    //    arr.push({ "data": "WithHoldingAccCode", "className": 'WithHoldingAccCode' })
    //}
    if (id == 0) {
        arr.push({ "data": "SupplierName", "className": 'SupplierName' })
    }
    arr.push({ "data": "ProjectName", "className": 'ProjectName' })
    arr.push({ "data": "InvoiceNo", "className": 'InvoiceNo' })
    arr.push({ "data": "InvoiceDate", "className": 'InvoiceDate' })
    arr.push({ "data": "GSTAmount", "className": 'GSTAmount' })
    arr.push({ "data": "WithHoldingAmount", "className": 'WithHoldingAmount' })
    if (id > 0)
        arr.push({ "data": "AdvanceAmount", "className": 'AdvanceAmount' })
    arr.push({ "data": "SubTotal", "className": 'SubTotal' })
    arr.push({ "data": "TotalAmount", "className": 'TotalAmount' })
    arr.push({ "data": "PaidAmount", "className": 'PaidAmount' })
    arr.push({ "data": "OutStandingAmt", "className": 'OutStandingAmt' })

    var isPaginate = true;
    var isInfo = true;
    var isSearch = true;
    var tbl_id = "#partialSupplierUnPaidInvoices";
    if (id == 0) {
        tbl_id = "#partialSupplierUnPaidInvoices1";
    } else {
        arr.push({ "data": null, "className": 'remarks' })
        arr.push({ "data": null, "className": 'with' })
        arr.push({ "data": null, "className": 'action' })
        isPaginate = false;
        isInfo = false;
        isSearch = false;
    }
    return $(tbl_id).dataTable({
        "bServerSide": true,
        "iDisplayLength": PageSize,
        "searching": isSearch,
        "ordering": false,
        oLanguage: {
            sProcessing: ''
        },
        bProcessing: true,
        "sAjaxSource": url_table,
        "columns": arr,
        "ordering": false,
        "paging": isPaginate,
        "info": isInfo,
        "fnServerParams": function (aoData) {
            aoData.push({ "name": "page", "value": this.fnPagingInfo().iPage });
            aoData.push({ "name": "SupplierIDFK", "value": id });
        },
        "fnRowCallback": function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
            detail_open = false;
            var numStart = this.fnPagingInfo().iStart;
            var index = numStart + iDisplayIndexFull + 1;
            if (id > 0)
            {
                $("td:first", nRow).html('<input type="checkbox" class="mycheckbox" name="IsChecked[' + index + ']">');
            }
            else
            {
                $("td:first", nRow).html(index);
            }
            
            $(".AdvanceAmount", nRow).html("<input type='text' class='form-control number validate[required,min[0],max[" + aData.OutStandingAmt + "]]' name='Credit1[" + index + "]' value='" + getCurrency(aData.AdvanceAmount) + "' style='width:100%;' /><input type='hidden' name='AccCode3[" + index + "]' value=" + aData.AdvanceAccount + " />");
            $(".GSTAmount", nRow).html(getCurrency(aData.GSTAmount));
            $(".WithHoldingAmount", nRow).html(getCurrency(aData.WithHoldingAmount));
            $(".SubTotal", nRow).html(getCurrency(aData.SubTotal));
            $(".TotalAmount", nRow).html(getCurrency(aData.TotalAmount));
            $(".PaidAmount", nRow).html(getCurrency(aData.PaidAmount));
            $(".OutStandingAmt", nRow).html(getCurrency(aData.OutStandingAmt));
            $(".InvoiceDate", nRow).html(convertDate(aData.InvoiceDate));
            if (id > 0) {
                $(".remarks", nRow).html("<input type='text' class='form-control validate[maxSize[100]]' name='Narration[" + index + "]' style='width:100%;' /><input type='hidden' name='InvCode[" + index + "]' value=" + aData.Id + " />");
                if (!aData.IsWithHoldingPayableEntered && aData.IsSaleTaxInvoice)
                    $(".with", nRow).html("<input type='text' class='form-control number validate[required,min[0],max[" + aData.OutStandingAmt + "]]' name='Credit[" + index + "]' value='" + getCurrency(aData.WithHodlingSuggestion) + "' style='width:100%;' /><input type='hidden' name='AccCode2[" + index + "]' value=" + aData.WithHoldingAccCode + " />");
                
                else
                    $(".with", nRow).html("");
                $(".action", nRow).html("<input type='text' class='form-control number validate[required,min[0],max[" + aData.OutStandingAmt + "]]' name='Debit[" + index + "]' style='width:100%;' value='"+aData.OutStandingAmt+"' /><input type='hidden' name='AccCode[" + index + "]' value=" + aData.AccCode + " />");
            }
            else {
                $(".SupplierName", nRow).html("<a href='javascript:void(0)' data-toggle='modal' data-target='#SupllierAccountModal' onclick='SupplierBankModal(" + aData.SupplierId + ")'>" + aData.SupplierName + "</a>");

            }

        },
        "fnDrawCallBack": function () {

        },
        "footerCallback": function (row, data, start, end, display) {
        },
        "fnInitComplete": function (oSettings, json) {
            init_numberkeyup();
            $('.mycheckbox').iCheck({
                checkboxClass: 'icheckbox_flat-green',
                radioClass: 'iradio_flat-green'
            });
        }
    }).on('processing.dt', function (e, settings, processing) {
        console.log("Processing Call")
        $('.mycheckbox').iCheck({
            checkboxClass: 'icheckbox_flat-green',
            radioClass: 'iradio_flat-green'
        });
        $('.mycheckbox').on('ifChecked', function (event) {
            
        });

        $('.mycheckbox').on('ifUnchecked', function (event) {
            //var itemid = parseInt($(this).closest('tr').attr('id'));
            //findAndRemove(itemIds, "ItemId", itemid);
        });
        id = parseInt(id);
        if (id > 0) {
            if (processing && !detail_open) {
                $(".supplier_div .header_overlay").attr('style', 'display:block;')
            } else {
                $(".supplier_div .header_overlay").attr('style', 'display:none;')
            }
        } else {

            if (processing && !detail_open) {
                $(".invoices .header_overlay").attr('style', 'display:block;')
            } else {
                $(".invoices .header_overlay").attr('style', 'display:none;')
            }
        }
    });

}
function SupplierBankModal(Id) {
    $.get("/Purchase/Suppliers/SupplierBankAccontDetail/" + Id, function (html) {
        $("#SupllierAccountModal").html(html);
        
    });
}
function copyText(obj) {
    var tmpInput = $("<input>");
    $("body").append(tmpInput);
    var tdVal = $(obj).parent().prev().text();
    tmpInput.val(tdVal).select();
    document.execCommand("copy");
    tmpInput.remove();
}
function getInstanceOfWithHoldingUnPaidInvoices() {
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
    arr.push({ "data": null, "className": 'sr' })
    arr.push({ "data": "AccCode", "className": 'AccCode' })
    arr.push({ "data": "AccountTitle", "className": 'AccountTitle' })
    arr.push({ "data": "InvoiceNo", "className": 'InvoiceNo' })
    arr.push({ "data": "ProjectName", "className": 'ProjectName' })
    arr.push({ "data": "Date", "className": 'Date' })
    arr.push({ "data": "TotalAmount", "className": 'TotalAmount' })
    arr.push({ "data": "PaidAmount", "className": 'PaidAmount' })
    arr.push({ "data": "OutStandingAmount", "className": 'OutStandingAmount' })
    arr.push({ "data": null, "className": 'remarks' })
    arr.push({ "data": null, "className": 'action' })
    return $("#tblWithHoldingUnPaidInvoices").dataTable({
        "bServerSide": true,
        "iDisplayLength": PageSize,
        "searching": false,
        "ordering": false,
        oLanguage: {
            sProcessing: ''
        },
        bProcessing: true,
        "sAjaxSource": "/Purchase/PurchaseInvoice/WithHoldingUnPaidInvoicesDataProviderAction/",
        "columns": arr,
        "ordering": false,
        "paging": false,
        "info": false,
        "fnServerParams": function (aoData) {
            aoData.push({ "name": "page", "value": this.fnPagingInfo().iPage });
        },
        "fnRowCallback": function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
            var numStart = this.fnPagingInfo().iStart;
            var index = numStart + iDisplayIndexFull + 1;
            $("td:first", nRow).html(index);
            $(".TotalAmount", nRow).html(getCurrency(aData.TotalAmount));
            $(".PaidAmount", nRow).html(getCurrency(aData.PaidAmount));
            $(".OutStandingAmount", nRow).html(getCurrency(aData.OutStandingAmount));
            $(".Date", nRow).html(convertDate(aData.Date));
            $(".remarks", nRow).html("<input type='text' class='form-control validate[maxSize[100]]' name='Narration[" + index + "]' style='width:100%;' /><input type='hidden' name='InvCode[" + index + "]' value=" + aData.Id + " /><input type='hidden' name='InvType[" + index + "]' value=" + aData.InvoiceType + " />");
            $(".action", nRow).html("<input type='text' class='form-control number validate[required,min[0],max[" + aData.OutStandingAmount + "]]' name='Debit[" + index + "]' style='width:100%;' value='0' /><input type='hidden' name='AccCode[" + index + "]' value=" + aData.AccCode + " />");
        },
        "fnInitComplete": function (oSettings, json) {
            init_numberkeyup();
        }
    }).on('processing.dt', function (e, settings, processing) {

        if (processing) {
            $(".with_div .header_overlay").attr('style', 'display:block;')
        } else {
            $(".with_div .header_overlay").attr('style', 'display:none;')
        }

    });
}