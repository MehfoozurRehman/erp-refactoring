var saleTaxTable;
var osaleTaxTable;
var detail_open = false;


$(document.body).delegate('.innertable tbody tr .Debit,.innertable tbody tr .Credit', 'keyup', function () {
    calculateTotalDebitAndCredit();
});


function calculateIR(table_id) {
     var ir = 0;
     $("#" + table_id + " tbody tr .ir").each(function (i, input) {
        ir += parseFloat(convertCurrencyToNumber($(input).val()))
     });
     return ir;
}
function validateIR(field, rules, i, options) {
    var table_id = $(field).closest('tr').closest('table').attr('id');
    var id = $(field).closest('tr').closest('table').attr('data-id');
    var selector = "#outstanding_" + id;
    var totalInvOutStanding = convertCurrencyToNumber($(selector).text());

    var result = calculateIR(table_id);
    var balance = totalInvOutStanding - result;
    if (balance < 0) {
        return "Your received amount is exceeding from " + totalInvOutStanding + " Total Entered Amount is: " + result;
    }
}
function calculateTotalDebitAndCredit() {
    var Amount = parseFloat(convertCurrencyToNumber($("#DebitSum").text()));
    var Debit = 0, Credit = 0;
    $(".innertable tbody tr .Debit").each(function (i, input) {
        Debit += parseFloat(convertCurrencyToNumber($(input).val()))
    });

    $(".innertable tbody tr .Credit").each(function (i, input) {
        Credit += parseFloat(convertCurrencyToNumber($(input).val()))
    });
   
    Debit = Debit + Amount;
    $(".totalDebit").text(getCurrency(Debit));
    $(".totalCredit").text(getCurrency(Credit));
}

function openRows() {
    $("#tblSaleTaxListViewModel tbody tr").each(function (i, tr) {
        var td = $(tr).find('td.details-control');
        tr = $(td).closest('tr');
        var row = osaleTaxTable.row(tr);
        //var api = osaleTaxTable.api();
        var json = osaleTaxTable.ajax.json();
        if (row.child.isShown()) {
            // This row is already open - close it
            row.child.hide();
            tr.removeClass('shown');
            //detail_open = false;
        }
        else {
            // Open this row
            row.child(format(row.data(), tr.attr('id'), json.dropdown)).show();
            tr.addClass('shown');
            //detail_open = true;
        }
    });

   

}
function format(d, index, dropdown) {
    console.log(d);
    var html = '<div class="col-md-12">';

    html += '<div class="col-md-4">';

    html += '<div class="box box-widget widget-user-2">';

    html += '<div class="bg-aqua">';
    html += '<h3 class="widget-user-username" style="margin-left:25px;">Total</h3>';
    html += '</div>';
    html += '<div class="box-footer no-padding">';
    html += '<ul class="nav nav-stacked">';
    //html += '<li><a href="#"><b>SSTPercent</b> <span class="pull-right badge bg-blue" id="BookValue">' + d.SSTPercent + '</span></a></li>';
    html += '<li><a href="#"><b>InvoiceAmount</b> <span class="pull-right badge bg-aqua" id="Depreciation">' + getCurrency(d.TotalAmount) + '</span></a></li>';
    html += '<li><a href="#"><b>TaxAmount</b> <span class="pull-right badge bg-green" id="NewBookValue">' + getCurrency(d.SSTAmount) + '</span></a></li>';
    //html += '<li><a href="#"><b>TotalAmount</b> <span class="pull-right badge bg-red" id="Sale">' + getCurrency(d.TotalAmount) + '</span></a></li>';
    html += '<li><a href="#"><b>ReceivedInvoiceAmount</b> <span class="pull-right badge bg-yellow" id="Profit">' + getCurrency(d.ReceivedAmount) + '</span></a></li>';
    html += '<li><a href="#"><b>ReceivedTaxAmount</b> <span class="pull-right badge bg-aqua" id="Profit">' + getCurrency(d.ReceivedTaxAmount) + '</span></a></li>';
    html += '<li><a href="#"><b>OutStandingInvoiceAmount</b> <span class="pull-right badge bg-green" id="outstanding_' + d.Id + '">' + getCurrency(d.OutStandingAmount) + '</span></a></li>';
    html += '<li><a href="#"><b>OutStandingTaxAmount</b> <span class="pull-right badge bg-red" id="Profit">' + getCurrency(d.OutStandingTaxAmount) + '</span></a></li>';
    html += '<li><a href="#"><b>Adhoc Advance Payment</b> <span class="pull-right badge bg-red" id="Profit">' + getCurrency(d.AdhocBalance) + '</span></a></li>';
    html += '</ul>';
    html += '</div>';
    html += '</div>';

    html += '</div>';


    html += '<div class="col-md-8">';
    html += '<form class="frmSSTDetail"><div class="list_SSTViewModel"><table class="table table-striped table-bordered table-middle dataTable no-footer innertable" data-id='+d.Id+' id="tbl_'+d.Id+'">';


    html += '<thead>';
    html += '<tr>';
    html += '<th>Sr.No</th>';
    html += '<th>AccCode</th>';
    html += '<th>Account Title</th>';
    html += '<th>Remarks</th>';
    html += '<th>Debit</th>';
    html += '<th>Credit</th>';
    html += '</tr>';
    html += '</thead>';



    html += '<tr>';
    html += '<td>1</td>';
    html += '<td>' + with_holding_tax + '</td>';
    html += '<td>WithHolding Tax Expense<input type="hidden" value="' + with_holding_tax + '" name="AccCode[1]" /><input type="hidden" value="WithHolding Tax Expense" name="AccountTitle[1]" /></td>';
    html += '<td><input type="text" class="form-control" name="Narration[1]"  /></td>';
    html += '<td><input type="text" class="number validate[required] form-control Debit" name="Debit[1]" value="0.00" /></td>';
    html += '<td>0.00<input type="hidden" value="0.00" name="Credit[1]" /><input type="hidden" name="InvCode[1]" value=' + d.Id + '><input type="hidden" name="InvType[1]" value="PWH"></td>';
    html += '</tr>';

    html += '<tr>';
    html += '<td>2</td>';
    html += '<td>' + d.PSSTAccountCode + '</td>';
    html += '<td>PSST Recoverable<input type="hidden" value="' + d.PSSTAccountCode + '" name="AccCode[2]" /><input type="hidden" value="PSST Recoverable" name="AccountTitle[2]" /></td>';
    html += '<td><input type="text" class="form-control" name="Narration[2]"  /></td>';
    html += '<td>0.00<input type="hidden" value="0.00" name="Debit[2]" /></td>';
    html += '<td><input type="text" class="number validate[required,funcCall[validateRPSST]] form-control Credit" data-outstanding="' + d.OutStandingTaxAmount + '" name="Credit[2]" value="0.00" /><input type="hidden" name="InvCode[2]" value=' + d.Id + '><input type="hidden" name="InvType[2]" value="RPSST"></td>';
    html += '</tr>';

    html += '<tr>';
    html += '<td>3</td>';
    html += '<td>' + d.PSSTPayableAccCode + '</td>';
    html += '<td>PSST Payable<input type="hidden" value="' + d.PSSTPayableAccCode + '" name="AccCode[3]" /><input type="hidden" value="PSST Payable" name="AccountTitle[3]" /></td>';
    html += '<td><input type="text" class="form-control" name="Narration[3]"  /></td>';
    html += '<td><input type="text" class="number validate[required,max[' + d.OutStandingTaxPaidAmount + ']] form-control Debit" name="Debit[3]" value="0.00" /></td>';
    html += '<td>0.00<input type="hidden" value="0.00" name="Credit[3]" /><input type="hidden" name="InvCode[3]" value=' + d.Id + '><input type="hidden" name="InvType[3]" value="PPSST"></td>';
    html += '</tr>';

    html += '<tr>';
    html += '<td>4</td>';
    html += '<td>' + d.InComeReceivableAccountCode + '</td>';
    html += '<td>Income Receivable<input type="hidden" value="' + d.InComeReceivableAccountCode + '" name="AccCode[4]" /><input type="hidden" value="SST Receivable" name="AccountTitle[4]" /></td>';
    html += '<td><input type="text" class="form-control" name="Narration[4]"  /></td>';
    html += '<td>0.00<input type="hidden" value="0.00" name="Debit[4]" /></td>';
    html += '<td><input type="text" class="number validate[required,max[' + d.OutStandingAmount + '],funcCall[validateIR]] form-control Credit ir" name="Credit[4]" value="0.00" /><input type="hidden" name="InvCode[4]" value=' + d.Id + '><input type="hidden" name="InvType[4]" value="SST"></td>';
    html += '</tr>';

    html += '<tr>';
    html += '<td>5</td>';
    html += '<td>' + d.InComeReceivableAccountCode + '</td>';
    html += '<td>Income Receivable<input type="hidden" value="' + d.InComeReceivableAccountCode + '" name="AccCode[5]" /><input type="hidden" value="SST Receivable" name="AccountTitle[5]" /></td>';
    html += '<td><input type="text" class="form-control" name="Narration[5]"  /></td>';
    html += '<td>0.00<input type="hidden" value="0.00" name="Debit[5]" /></td>';
    html += '<td><input type="text" class="number validate[required,max[' + d.OutStandingAmount + '],funcCall[validateIR]] form-control Credit ir" name="Credit[5]" value="0.00" /><input type="hidden" name="InvCode[5]" value=' + d.Id + '><input type="hidden" name="InvType[5]" value="SST"></td>';
    html += '</tr>';

    html += '<tr>';
    html += '<td>6</td>';
    html += '<td>' + d.InComeReceivableAccountCode + '</td>';
    html += '<td>Income Receivable<input type="hidden" value="' + d.InComeReceivableAccountCode + '" name="AccCode[6]" /><input type="hidden" value="SST Receivable" name="AccountTitle[6]" /></td>';
    html += '<td><input type="text" class="form-control" name="Narration[6]"  /></td>';
    html += '<td>0.00<input type="hidden" value="0.00" name="Debit[6]" /></td>';
    html += '<td><input type="text" class="number validate[required,max[' + d.OutStandingAmount + '],funcCall[validateIR]] form-control Credit ir" name="Credit[6]" value="0.00" /><input type="hidden" name="InvCode[6]" value=' + d.Id + '><input type="hidden" name="InvType[6]"  value="SST"></td>';
    html += '</tr>';



    html += '<tr>';
    html += '<td>7</td>';
    html += '<td colspan="2"><select name="AccCode[7]" class="form-control">';
    html += "<option value>Select Expenses</option>";
    dropdown.forEach(function (item, index) {
        html += '<option value="' + item.type + '">' + item.type + "--" + item.name + '</option>';
    });
    html += '</select><input type="hidden" value="Expense" name="AccountTitle[7]" /></td>';
    html += '<td><input type="text" class="form-control" name="Narration[7]"  /></td>';
    html += '<td><input type="text" class="number validate[required] form-control Debit" name="Debit[7]" value="0.00" /></td>';
    html += '<td>0.00<input type="hidden" value="0.00" name="Credit[7]" /><input type="hidden" name="InvCode[7]" value=""><input type="hidden" name="InvType[7]" value=""></td>';
    html += '</tr>';


    html += '<tr>';
    html += '<td>8</td>';
    html += '<td>' + d.AdhocAccCode + '</td>';
    html += '<td>Adhoc<input type="hidden" value="' + d.AdhocAccCode + '" name="AccCode[8]" /><input type="hidden" value="Adhoc Payment" name="AccountTitle[8]" /></td>';
    html += '<td><input type="text" class="form-control" name="Narration[1]"  /></td>';
    html += '<td><input type="text" class="number validate[required] form-control Debit" name="Debit[8]" value="0.00" /></td>';
    html += '<td>0.00<input type="hidden" value="0.00" name="Credit[8]" /><input type="hidden" name="InvCode[8]" value=' + d.Id + '><input type="hidden" name="InvType[8]" value="Adhoc"></td>';
    html += '</tr>';

    html += '</tbody>';




    html += '</table></div></form>';
    html += '</div>';
    html += '</div>';
    return html;
}
function validateRPSST(field, rules, i, options) {
    var val = convertCurrencyToNumber($(field).val());
    var outstanding = $(field).attr('data-outstanding');
    if (val == outstanding || val == 0) { } else { return "RPPST value is must be zero or " + getCurrency(outstanding); }
}
function getInstanceOfSaleTaxUnPaidInvoices(ProjectId) {
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

    arr.push({ "data": "ProjectName", "className": 'ProjectName' })

    arr.push({ "data": "InvoiceNo", "className": 'InvoiceNo' })
    arr.push({ "data": "LetterReference", "className": 'LetterReference' })
    arr.push({ "data": "PO_DO", "className": 'PO_DO' })
    arr.push({ "data": "NatureOfWork", "className": 'NatureOfWork' })
    arr.push({ "data": "InvoiceDate", "className": 'InvoiceDate' })
    arr.push({ "data": "TotalAmount", "className": 'TotalAmount' })
    arr.push({ "data": "ReceivedAmount", "className": 'ReceivedAmount' })
    arr.push({ "data": "OutStandingAmount", "className": 'OutStandingAmount' })

    var isPaginate = true;
    var isInfo = true;
    var table_id = "#tblSaleTaxListViewModel1";
    var isSearch = true;
    if (ProjectId > 0) {
        table_id = "#tblSaleTaxListViewModel";
        //arr.push({ "data": null, "className": 'remarks' })
        //arr.push({ "data": null, "className": 'action' })

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
        "sAjaxSource": "/Sales/ServiceSaleTaxInvoices/ServiceSaleTaxUnPaidDataTable/",
        "columns": arr,
        "ordering": false,
        "fnServerParams": function (aoData) {
            aoData.push({ "name": "page", "value": this.fnPagingInfo().iPage });
            aoData.push({ "name": "ProjectId", "value": ProjectId });
        },
        "fnRowCallback": function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
            detail_open = false;
            var id = aData.Id;
            var numStart = this.fnPagingInfo().iStart;
            var index = numStart + iDisplayIndexFull + 1;
            $(nRow).attr('id', index);
            $("td:first", nRow).html(index);
            $(".InvoiceDate", nRow).html(convertDate(aData.InvoiceDate));
            $(".TotalAmount", nRow).html(getCurrency(aData.TotalAmount + aData.SSTAmount))
            $(".ReceivedAmount", nRow).html(getCurrency(aData.ReceivedAmount + aData.ReceivedTaxAmount))
            var OutStanding = aData.OutStandingAmount + aData.OutStandingTaxAmount;
            $(".OutStandingAmount", nRow).html(getCurrency(OutStanding))

            //if (ProjectId > 0) {
            //    $(".remarks", nRow).html("<input type='text' class='form-control validate[maxSize[100]]' name='Narration[" + index + "]' style='width:100%;' /><input type='hidden' name='InvCode[" + index + "]' value=" + aData.Id + " />");
            //    $(".action", nRow).html("<input type='text' class='form-control number validate[required,min[0],max[" + OutStanding + "]]' name='Credit[" + index + "]' style='width:100%;' value='0' /><input type='hidden' name='AccCode[" + index + "]' value=" + aData.InComeReceivableAccountCode + " />");
            //}
        },

        "footerCallback": function (row, data, start, end, display) {
        },
        "fnDrawCallback": function (settings) {
            var api = this.api();
            var json = api.ajax.json();
            // console.log(json);
        },
        "fnInitComplete": function (oSettings, json) {


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
function SaleTaxChangeFunc(type) {
    var val = "";
    if (type == undefined) {
        val = $(".income_div #ProjectIDFK").val();
    } else {
        val = $(".psst_div #ProjectIDFK").val();
    }
    if (val == "") {
        OnWarning("Please Select Project");
        return;
    }
    init_sale_tax_table(val, type);
}
function init_sale_tax_table(ProjectId, type) {
    if (saleTaxTable == null) {
        if (type == undefined) {
            saleTaxTable = getInstanceOfSaleTaxUnPaidInvoices(ProjectId);
            osaleTaxTable = $(saleTaxTable).dataTable().api();

        }
        else
            saleTaxTable = getInstanceOfPSSTUnPaidInvoices(ProjectId);
    } else {
        $(saleTaxTable).dataTable().fnDestroy();
        if (type == undefined) {
            saleTaxTable = getInstanceOfSaleTaxUnPaidInvoices(ProjectId);
            osaleTaxTable = $(saleTaxTable).dataTable().api();

        }
        else
            saleTaxTable = getInstanceOfPSSTUnPaidInvoices(ProjectId);
    }

}

$(document).on('init.dt', function (e, settings) {
    openRows();
    init_numberkeyup();
});

function getInstanceOfPSSTUnPaidInvoices(ProjectId) {
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
    if (ProjectId > 0) {
        arr.push({ "data": "PSSTPayableAccCode", "className": 'AccCode' })
        arr.push({ "data": "PSSTPayableAccountTitle", "className": 'AccountTitle' })
    } else {
        arr.push({ "data": "ProjectName", "className": 'ProjectName' })
    }
    arr.push({ "data": "InvoiceNo", "className": 'InvoiceNo' })
    arr.push({ "data": "LetterReference", "className": 'LetterReference' })
    arr.push({ "data": "PO_DO", "className": 'PO_DO' })
    arr.push({ "data": "NatureOfWork", "className": 'NatureOfWork' })
    arr.push({ "data": "InvoiceDate", "className": 'InvoiceDate' })
    arr.push({ "data": "SSTAmount", "className": 'SSTAmount' })
    arr.push({ "data": "PaidTaxAmount", "className": 'PaidTaxAmount' })
    arr.push({ "data": "OutStandingTaxPaidAmount", "className": 'OutStandingTaxPaidAmount' })

    var isPaginate = true;
    var isInfo = true;
    var table_id = "#tblPSSTListViewModel1";
    var isSearch = true;
    if (ProjectId > 0) {
        table_id = "#tblPSSTListViewModel";
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
        "sAjaxSource": "/Sales/ServiceSaleTaxInvoices/ServiceSaleTaxUnPaidTaxDataTable/",
        "columns": arr,
        "ordering": false,
        "fnServerParams": function (aoData) {
            aoData.push({ "name": "page", "value": this.fnPagingInfo().iPage });
            aoData.push({ "name": "ProjectId", "value": ProjectId });
        },
        "fnRowCallback": function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
            detail_open = false;
            var id = aData.Id;
            var numStart = this.fnPagingInfo().iStart;
            var index = numStart + iDisplayIndexFull + 1;

            $("td:first", nRow).html(index);
            $(".InvoiceDate", nRow).html(convertDate(aData.InvoiceDate));
            $(".SSTAmount", nRow).html(getCurrency(aData.SSTAmount))
            $(".PaidTaxAmount", nRow).html(getCurrency(aData.PaidTaxAmount))
            $(".OutStandingTaxPaidAmount", nRow).html(getCurrency(aData.OutStandingTaxPaidAmount))



            if (ProjectId > 0) {
                $(".remarks", nRow).html("<input type='text' class='form-control validate[maxSize[100]]' name='Narration[" + index + "]' style='width:100%;' /><input type='hidden' name='InvCode[" + index + "]' value=" + aData.Id + " /><input type='hidden' name='InvType[" + index + "]' value='PPSST' />");
                $(".action", nRow).html("<input type='text' class='form-control number validate[required,min[0],max[" + aData.OutStandingTaxPaidAmount + "]]' name='Debit[" + index + "]' style='width:100%;' value='0' /><input type='hidden' name='AccCode[" + index + "]' value=" + aData.PSSTPayableAccCode + " />");
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