var emp_table = null;
function init_emp_table(id) {
    if (emp_table == null)
        emp_table = getOfEmpUnPaidPayRolls(id);
    else {
        $(emp_table).dataTable().fnDestroy();
        emp_table = getOfEmpUnPaidPayRolls(id);
    }
}
function SumPayment() {
    var sum = 0;
    $(".payment").each(function (i, input) {
        sum += convertCurrencyToNumber($(input).val());
    });
    $("#TotalPayRoll").text(getCurrency(sum));
}
function getOfEmpUnPaidPayRolls(id) {
    var url = "/Accounts/CashPaymentVoucher/GetEmployeesForPayment/";
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
    arr.push({ "data": "AccountTitle", "className": 'AccountTitle' })

    //arr.push( { "data": "AccountTitle","className": 'AccountTitle'})
    arr.push({ "data": "PayRollNo", "className": 'PayRollNo' })
    arr.push({ "data": "DateRange", "className": 'DateRange' })
    arr.push({ "data": "Amount", "className": 'Amount' })
    arr.push({ "data": "AdvanceSalary", "className": 'AdvanceSalary' })
    arr.push({ "data": "PaidAmount", "className": 'PaidAmount' })
    arr.push({ "data": "OutStandingAmt", "className": 'OutStandingAmt' })

    var isPaginate = true;
    var isInfo = true;
    var isSearch = true;
    var tbl_id = "#EmployeeUnPaidPayRoll";

    arr.push({ "data": null, "className": 'remarks' })
    arr.push({ "data": null, "className": 'action' })
    isPaginate = false;
    isInfo = false;
    isSearch = false;

    return $(tbl_id).dataTable({
        "bServerSide": true,
        "iDisplayLength": PageSize,
        "searching": isSearch,
        "ordering": false,
        oLanguage: {
            sProcessing: ''
        },
        bProcessing: true,
        "sAjaxSource": url,
        "columns": arr,
        "ordering": false,
        "paging": isPaginate,
        "info": isInfo,
        "fnServerParams": function (aoData) {
            aoData.push({ "name": "page", "value": this.fnPagingInfo().iPage });
            aoData.push({ "name": "SalaryVoucherIDFK", "value": id });
        },
        "fnRowCallback": function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
           
            var numStart = this.fnPagingInfo().iStart;
            var index = numStart + iDisplayIndexFull + 1;
            $("td:first", nRow).html(index);
            var LCode = LabourCode.substring(0, 8);
            var ACode = aData.AccCode.substring(0, 8);
            //$(".InvoiceDate", nRow).html(convertDate(aData.InvoiceDate));

            $(".remarks", nRow).html("<input type='text' class='form-control validate[maxSize[100]]' name='Narration[" + index + "]' value='" + aData.EnterRemarks + "' /><input type='hidden' name='InvType[" + index + "]' value='PayRoll' /><input type='hidden' name='InvCode[" + index + "]' value=" + aData.StaffInvId + " /><input type='hidden' name='WagesInvCode[" + index + "]' value=" + aData.WagesInvId + " />");
            if(LCode != ACode)
                $(".action", nRow).html("<input type='text' class='form-control number payment validate[required,min[0],max[" + aData.OutStandingAmt + "]]' name='Debit[" + index + "]' value='" + aData.EnterPayment + "' /><input type='hidden' name='AccCode[" + index + "]' value=" + aData.AccCode + " />");
            else
                $(".action", nRow).html("<input type='text' class='form-control number payment validate[required,min[0],max[" + aData.OutStandingAmt + "]]' readonly name='Debit[" + index + "]' value='" + aData.EnterPayment + "' /><input type='hidden' name='AccCode[" + index + "]' value=" + aData.AccCode + " />");


        },
        "fnDrawCallBack": function () {

        },
        "footerCallback": function (row, data, start, end, display) {
        },
        "fnInitComplete": function (oSettings, json) {
            init_numberkeyup();
            init_numbers();
            SumPayment();
            $(".payment").keyup(function () {
                SumPayment();
            });
        }
    }).on('processing.dt', function (e, settings, processing) {
        console.log("Processing Call")
        if (processing) {
            $(".emp_div .overlay").attr('style', 'display:block;')
        } else {
            $(".emp_div .overlay").attr('style', 'display:none;')
        }
    });

}