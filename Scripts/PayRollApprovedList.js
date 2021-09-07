var SelectedInvoiceId = 0;
$(document).ready(function () {
    init_payroll_table();
});
var payroll_table = null;
function init_payroll_table() {
    if (payroll_table != null) {
        $(payroll_table).dataTable().fnDestroy();
        payroll_table = getInstanceOfPayrollSalaryDataTable();
    } else {
        payroll_table = getInstanceOfPayrollSalaryDataTable();
    }
}
function getInstanceOfPayrollSalaryDataTable() {
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
       { "data": "InvoiceNo", "orderable": true,className:"InvoiceNo" },
       { "data": "StartDate", "orderable": true },
       { "data": "EndDate", "orderable": true },
       { "data": "ProjectName", "orderable": true },
        //{ "data": "ApprovedBy", "orderable": true },
       { "data": "TabName", "orderable": true },
       { "data": "TotalAmount", "orderable": true, className: "TotalAmount" },
       { "data": "TotalApprovedAmt", "orderable": true, className: "TotalApprovedAmt" },
       { "data": "TotalDeductionAmt", "orderable": true, className: "TotalDeductionAmt" },
        { "data": "TotalPaidAmt", "orderable": true, className: "TotalPaidAmt" },
       { "data": "TotalOutStandingAmt", "orderable": true, className: "TotalOutStandingAmt" },
       { "data": "Status", "orderable": true, className: "Status" },
       //{ "data": null },
    ]

    return $("#SalaryApprove").dataTable({
        "bServerSide": true,
        "ordering": false,
        "iDisplayLength": PageSize,
        oLanguage: {
            sProcessing: ''
        },
        bProcessing: true,
        "sAjaxSource": "/HRModule/LabourSalary/PayrollDataProviderAction/",
        "columns": arr,
        "fnServerParams": function (aoData) {
            aoData.push({ "name": "page", "value": this.fnPagingInfo().iPage });
            aoData.push({ "name": "InProcess", "value": false });
            aoData.push({ "name": "isOutStandingGTFrmZero", "value": true });
        },
        "fnRowCallback": function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
            var id = aData.Id;
            var startdate = convertDate(aData.StartDate);
            var Enddate = convertDate(aData.EndDate);
            $('.InvoiceNo', nRow).html('<input type="radio" name="r1" value="' + id + '" class="mycheckbox" /> ' + aData.InvoiceNo)
            $('td:eq(1)', nRow).html(startdate);
            $('td:eq(2)', nRow).html(Enddate);
            $(".TotalAmount", nRow).html(getCurrency(aData.TotalAmount))
            $(".TotalApprovedAmt", nRow).html(getCurrency(aData.TotalApprovedAmt))
            $(".TotalDeductionAmt", nRow).html(getCurrency(aData.TotalDeductionAmt))
            $(".TotalPaidAmt", nRow).html(getCurrency(aData.TotalPaidAmt))
            $(".TotalOutStandingAmt", nRow).html(getCurrency(aData.TotalOutStandingAmt))
        },
        "footerCallback": function (row, data, start, end, display) {
        },
        "fnInitComplete": function (oSettings, json) {

        }
    }).on('processing.dt', function (e, settings, processing) {
        $('.mycheckbox').iCheck({
            checkboxClass: 'icheckbox_flat-green',
            radioClass: 'iradio_flat-green'
        });
        $('.mycheckbox').on('ifChecked', function (event) {
            SelectedInvoiceId = parseInt($(this).closest('tr').attr('id'));
        });
        if (processing) {
            $(".overlay").attr('style', 'display:block;')
        } else {
            $(".overlay").attr('style', 'display:none;')
        }
    });

}