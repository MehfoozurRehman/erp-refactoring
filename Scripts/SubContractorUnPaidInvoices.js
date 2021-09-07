var sub_url_table = "/Engineering/ContractorInvoice/UnPaidInvoicesDataProviderAction/";
var pptable = null;
var potable = null;
var ptable = [];
var detail_open = false;
$(document).ready(function () {
    $("#ContractorIDFK").change(function () {
        ChangeContractorFunc();
    });
    $('#partialContractorUnPaidInvoices tbody,#partialContractorUnPaidInvoices1 tbody').on('click', 'td.details-control', function () {

        var tr = $(this).closest('tr')
            , row = potable.row(tr);

        if (row.child.isShown()) {
            // This row is already open - close it
            row.child.hide();
            tr.removeClass('shown');
            detail_open = false;
        }
        else {
            // Open this row
            row.child(sub_format(row.data())).show();
            tr.addClass('shown');
            detail_open = true;
        }
    });
});
function ChangeContractorFunc() {
    var val = $("#ContractorIDFK").val();
    if (val == "") {
        OnWarning("Please Select Contractor");
        return;
    }
    init_subtable(val);
}
function init_subtable(id) {
    if (pptable == null) {
        pptable = getPartialInstanceOfContractorUnPaidInvoices(id);
    }
    else {
        pptable.dataTable().fnDestroy();
        pptable = getPartialInstanceOfContractorUnPaidInvoices(id);
    }
    potable = $(pptable).dataTable().api();
}
function sub_format(d) {
    var div = $(' <div class="loading"><i class="fa fa-refresh fa-spin"></i></div>');
    //$.get("/Purchase/ContractorServiceInvoice/ContractorServiceDetail/" + d.Id, function (html) {
    //    div.removeClass("loading");
    //    div.html(html);
    //});
    return div;
}
function getPartialInstanceOfContractorUnPaidInvoices(id) {

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
    if (id == 0) {
        arr.push({ "data": "SupplierName", "className": 'SupplierName' })
    }

    arr.push({ "data": "ProjectName", "className": 'ProjectName' })
    arr.push({ "data": "InvoiceNo", "className": 'InvoiceNo' })
    arr.push({ "data": "InvoiceDate", "className": 'InvoiceDate' })
    if (id > 0)
        arr.push({ "data": "AdvanceAmount", "className": 'AdvanceAmount' })
    arr.push({ "data": "InvoiceAmount", "className": 'InvoiceAmount' })
    arr.push({ "data": "PaidAmount", "className": 'PaidAmount' })
    arr.push({ "data": "OutStandingAmt", "className": 'OutStandingAmt' })

    var isPaginate = true;
    var isInfo = true;
    var isSearch = true;
    var tbl_id = "#partialContractorUnPaidInvoices";
    if (id == 0) {
        tbl_id = "#partialContractorUnPaidInvoices1";
    } else {
        arr.push({ "data": null, "className": 'remarks' })
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
        "sAjaxSource": sub_url_table,
        "columns": arr,
        "ordering": false,
        "paging": isPaginate,
        "info": isInfo,
        "fnServerParams": function (aoData) {
            aoData.push({ "name": "page", "value": this.fnPagingInfo().iPage });
            aoData.push({ "name": "ContractorIDFK", "value": id });
        },
        "fnRowCallback": function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
            detail_open = false;
            var numStart = this.fnPagingInfo().iStart;
            var index = numStart + iDisplayIndexFull + 1;
            $("td:first", nRow).html(index);
            $(".AdvanceAmount", nRow).html("<input type='text' class='form-control number validate[required,min[0],max[" + aData.OutStandingAmt + "]]' name='Credit1[" + index + "]' value='" + getCurrency(aData.AdvanceAmount) + "' style='width:100%;' /><input type='hidden' name='AccCode3[" + index + "]' value=" + aData.AdvanceAccount + " />");
            $(".InvoiceAmount", nRow).html(getCurrency(aData.InvoiceAmount));
            $(".PaidAmount", nRow).html(getCurrency(aData.PaidAmount));
            $(".OutStandingAmt", nRow).html(getCurrency(aData.OutStandingAmt));
            $(".InvoiceDate", nRow).html(convertDate(aData.InvoiceDate));
            if (id > 0) {
                $(".remarks", nRow).html("<input type='text' class='form-control validate[maxSize[100]]' name='Narration[" + index + "]' /><input type='hidden' name='InvCode[" + index + "]' value=" + aData.Id + " />");
                $(".action", nRow).html("<input type='text' class='form-control number validate[required,min[0],max[" + aData.OutStandingAmt + "]]' name='Debit[" + index + "]' value='0' /><input type='hidden' name='AccCode[" + index + "]' value=" + aData.AccCode + " />");
            }

        },
        "fnDrawCallBack": function () {

        },
        "footerCallback": function (row, data, start, end, display) {
        },
        "fnInitComplete": function (oSettings, json) {
            init_numberkeyup();
        }
    }).on('processing.dt', function (e, settings, processing) {
        console.log("Processing Call")
        id = parseInt(id);
        if (id > 0) {
            if (processing && !detail_open) {
                $(".contractor_div .header_overlay").attr('style', 'display:block;')
            } else {
                $(".contractor_div .header_overlay").attr('style', 'display:none;')
            }
        } else {

            if (processing && !detail_open) {
                $(".sub_invoices .header_overlay").attr('style', 'display:block;')
            } else {
                $(".sub_invoices .header_overlay").attr('style', 'display:none;')
            }
        }
    });

}