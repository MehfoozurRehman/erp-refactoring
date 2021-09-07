var saleTable;
var detail_open = false;
function getInstanceOfAssetSaleUnPaidInvoices(CustomerId, acc_code, account_title) {
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
   
    arr.push({ "data": null, "className": "details-control" })
    if (CustomerId > 0) {
        arr.push({ "data": null, "className": 'AccCode' })
        arr.push({ "data": null, "className": 'AccountTitle' })
    }
    arr.push( { "data": "InvoiceNo","className": 'InvoiceNo'})
    arr.push( { "data": "SoldTo","className": 'SoldTo'})
    arr.push( { "data": "ProjectName","className": 'ProjectName'})
    arr.push( { "data": "ItemName","className": 'ItemName'})
    arr.push( { "data": "SaleDate","className": 'SaleDate'})
    arr.push( { "data": "TotalAmount","className": 'TotalAmount'})
    arr.push({ "data": "RecivedAmount", "className": 'RecivedAmount' })
    arr.push( { "data": "OutStandingAmount","className": 'OutStandingAmount'})

    var isPaginate = true;
    var isInfo = true;
    var table_id = "#tblSaleListViewModel1";
    var isSearch = true;
    if (CustomerId > 0) {
        table_id = "#tblSaleListViewModel";
        arr.push({ "data": null, "className": 'remarks' })
        arr.push({ "data": null, "className": 'action' })

        isPaginate = false;
        isInfo = false;
        isSearch = false;
    }
    return $(table_id).dataTable({
        "bServerSide": true,
        "iDisplayLength": 10,
        "ordering": false,
        "paging": isPaginate,
        "info": isInfo,
        "searching": isSearch,
        oLanguage: {
            sProcessing: ''
        },
        bProcessing: true,
        "sAjaxSource": "/Sales/SaleInvoices/SaleInvoicesDataProviderAction/",
        "columns": arr,
        "ordering":false,
        "fnServerParams": function (aoData) {
            aoData.push({ "name": "page", "value": this.fnPagingInfo().iPage });
            aoData.push({ "name": "StatusIDFK", "value": 1 });
            aoData.push({ "name": "CustomerId", "value": CustomerId });
        },
        "fnRowCallback": function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
            detail_open = false;
            var id = aData.Id;
            var numStart = this.fnPagingInfo().iStart;
            var index = numStart + iDisplayIndexFull + 1;

            $("td:first",nRow).html(index);
            $(".SaleDate",nRow).html(convertDate(aData.SaleDate));
            $(".TotalAmount",nRow).html(getCurrency(aData.TotalAmount))
            $(".RecivedAmount", nRow).html(getCurrency(aData.RecivedAmount))
            $(".OutStandingAmount", nRow).html(getCurrency(aData.OutStandingAmount))

            $(".AccCode", nRow).html(acc_code);
            $(".AccountTitle", nRow).html(account_title);

            if (CustomerId > 0) {
                $(".remarks", nRow).html("<input type='text' class='form-control validate[maxSize[100]]' name='Narration[" + index + "]' style='width:100%;' /><input type='hidden' name='InvCode[" + index + "]' value=" + aData.Id + " />");
                $(".action", nRow).html("<input type='text' class='form-control number validate[required,min[0],max[" + aData.OutStandingAmount + "]]' name='Credit[" + index + "]' style='width:100%;' value='0' /><input type='hidden' name='AccCode[" + index + "]' value=" + acc_code + " />");
            }
        },
        "footerCallback": function (row, data, start, end, display) {
        },
        "fnInitComplete": function (oSettings, json) {
            init_numberkeyup();
        }
    }).on('processing.dt', function (e, settings, processing) {
        console.log("Processing Call")
        if (processing && !detail_open) {
            $(".header_overlay").attr('style', 'display:block;')
        } else {
            $(".header_overlay").attr('style', 'display:none;');
        }
    });

}
function ChangeFunc(AccCode, AccountTitle, type) {
    var val = "";
    if (type == undefined) {
        val = $(".customer_div #CustomerIDFK").val();
    } else {
        val = $(".customerscrap_div #CustomerIDFK").val();
    }
    if (val == "") {
        OnWarning("Please Select Customer");
        return;
    }
    init_table(val, AccCode, AccountTitle, type);
}
function init_table(CustomerId, acc_code, account_title, type) {
    if (saleTable == null) {
        if(type == undefined)
            saleTable = getInstanceOfAssetSaleUnPaidInvoices(CustomerId, acc_code, account_title);
        else
            saleTable = getInstanceOfScrapSaleUnPaidInvoices(CustomerId, acc_code, account_title);
    } else {
        $(saleTable).dataTable().fnDestroy();
        if (type == undefined)
            saleTable = getInstanceOfAssetSaleUnPaidInvoices(CustomerId, acc_code, account_title);
        else
            saleTable = getInstanceOfScrapSaleUnPaidInvoices(CustomerId, acc_code, account_title);
    }
}

function getInstanceOfScrapSaleUnPaidInvoices(CustomerId, acc_code, account_title) {
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

    arr.push({ "data": null, "className": "details-control" })
    if (CustomerId > 0) {
        arr.push({ "data": null, "className": 'AccCode' })
        arr.push({ "data": null, "className": 'AccountTitle' })
    }
    arr.push({ "data": "InvoiceNo", "className": 'InvoiceNo' })
 
    arr.push({ "data": "CustomerName", "className": 'CustomerName' })
    arr.push({ "data": "ProjectName", "className": 'ProjectName' })
    arr.push({ "data": "SaleDate", "className": 'SaleDate' })
    arr.push({ "data": "TotalAmount", "className": 'TotalAmount' })
    arr.push({ "data": "ReceivedAmount", "className": 'ReceivedAmount' })
    arr.push({ "data": "OutStandingAmount", "className": 'OutStandingAmount' })

    var isPaginate = true;
    var isInfo = true;
    var table_id = "#tblScrapSaleListViewModel1";
    var isSearch = true;
    if (CustomerId > 0) {
        table_id = "#tblScrapSaleListViewModel";
        arr.push({ "data": null, "className": 'remarks' })
        arr.push({ "data": null, "className": 'action' })

        isPaginate = false;
        isInfo = false;
        isSearch = false;
    }
    return $(table_id).dataTable({
        "bServerSide": true,
        "iDisplayLength": 10,
        "ordering": false,
        "paging": isPaginate,
        "info": isInfo,
        "searching": isSearch,
        oLanguage: {
            sProcessing: ''
        },
        bProcessing: true,
        "sAjaxSource": "/Sales/ScrapSales/ScrapSaleDataProviderAction/",
        "columns": arr,
        "ordering": false,
        "fnServerParams": function (aoData) {
            aoData.push({ "name": "page", "value": this.fnPagingInfo().iPage });
            aoData.push({ "name": "StatusIDFK", "value": 1 });
            aoData.push({ "name": "CustomerId", "value": CustomerId });
        },
        "fnRowCallback": function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
            detail_open = false;
            var id = aData.Id;
            var numStart = this.fnPagingInfo().iStart;
            var index = numStart + iDisplayIndexFull + 1;

            $("td:first", nRow).html(index);
            $(".SaleDate", nRow).html(convertDate(aData.SaleDate));
            $(".TotalAmount", nRow).html(getCurrency(aData.TotalAmount))
            $(".ReceivedAmount", nRow).html(getCurrency(aData.ReceivedAmount))
            $(".OutStandingAmount", nRow).html(getCurrency(aData.OutStandingAmount))

            $(".AccCode", nRow).html(acc_code);
            $(".AccountTitle", nRow).html(account_title);

            if (CustomerId > 0) {
                $(".remarks", nRow).html("<input type='text' class='form-control validate[maxSize[100]]' name='Narration[" + index + "]' style='width:100%;' /><input type='hidden' name='InvCode[" + index + "]' value=" + aData.Id + " />");
                $(".action", nRow).html("<input type='text' class='form-control number validate[required,min[0],max[" + aData.OutStandingAmount + "]]' name='Credit[" + index + "]' style='width:100%;' value='0' /><input type='hidden' name='AccCode[" + index + "]' value=" + acc_code + " />");
            }
        },
        "footerCallback": function (row, data, start, end, display) {
        },
        "fnInitComplete": function (oSettings, json) {
            init_numberkeyup();
        }
    }).on('processing.dt', function (e, settings, processing) {
        console.log("Processing Call")
        if (processing && !detail_open) {
            $(".header_overlay").attr('style', 'display:block;')
        } else {
            $(".header_overlay").attr('style', 'display:none;');
        }
    });
}