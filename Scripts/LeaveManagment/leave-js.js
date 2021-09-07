var otable;
var employeeInfo;
var baseUrl = "";
var notifications = {
    success: "<div class='alert alert-success alert-dismissible'  id='{0}Alert'> <strong>Success!</strong> {1}</div>",
    danger: "<div class='alert alert-danger alert-dismissible' id='{0}Alert'><strong>Danger!</strong>{1}</div>",
    info: "<div class='alert alert-info alert-dismissible' id='{0}Alert'><strong>Info!</strong>{1}</div>",
    warning: "<div class='alert alert-warning alert-dismissible' id='{0}Alert'><strong>Warning!</h4>{1}</div>",
};
$(document).ready(function () {
    $.cookie.json = true;
    employeeInfo = $.cookie("employeeInfo");
    if (employeeInfo != null) {
        GetFrontPage(employeeInfo, true);
    }
    $("#btnLogin").click(function () {
        var username = $("#login input[name=username]").val();
        var password = $("#login input[name=password]").val();
        if (username == "") {
            OnWarning("Please Enter UserName");
            return;
        }
        if (username.length > 256) {
            OnWarning("UserName characters are not more than 256 characters");
            return;
        }
        if (password == "") {
            OnWarning("Please Enter Password");
            return;
        }
        ShowLoader();
        $.get(baseUrl + "/api/Login/?username=" + username + "&password=" + password, function (res) {
            GetFrontPage(res, false);
        })
    });
   
    $("#btnSave").click(function () {
        var info = $.cookie("employeeInfo");
        var Id = $("input[name=id]").val();
        var StartDate = $("#StartDate").val();
        var EndDate = $("#EndDate").val();

        var dateString = StartDate;
        var dateParts = dateString.split("/");
        var dateObject = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
       

        var endString = EndDate;
        var endParts = endString.split("/");
        var enddateObject = new Date(+endParts[2], endParts[1] - 1, +endParts[0]);
        
        if (dateObject > enddateObject) {
            OnWarning("Date range is not correct");
            return;
        }


        var DateRange = StartDate + "-" + EndDate;
        var LeaveTypeIDFK = $("#LeaveTypeIDFK").val();
        var LeaveDescription = $("#reason").val();
        if (LeaveTypeIDFK == "") {
            OnWarning("Please Select Leave Type");
            return;
        }
        if (LeaveDescription == "") {
            OnWarning("Please Enter Reason");
            return
        }
        if (LeaveDescription.length > 256) {
            OnWarning("Reason characters are not more than 256 characters");
            return
        }

        var StatusIDFK = 1;
        var EmpIDFK = employeeInfo.EmployeeId;
        var obj = {
            Id: parseInt(Id),
            DateRange: DateRange,
            LeaveTypeIDFK: LeaveTypeIDFK,
            LeaveDescription: LeaveDescription,
            StatusIDFK: StatusIDFK,
            EmpIDFK: EmpIDFK
        }
        console.log(obj);
        ShowLoader();
        $.ajax({
            type: "POST",
            contentType: "application/json",
            url: baseUrl + '/api/Save/' + employeeInfo.UserId,
            data: JSON.stringify(obj),
            dataType: "json",
            success: function (res) {
                if (res == "Record Save Successfully") {

                    OnSuccess("Record Save Successfully");
                    $("#leaveCreate").fadeOut();
                    $("#leaveApp").fadeIn();
                    if (otable != null) {
                        otable.dataTable().fnDestroy();
                        otable = getInstanceOfLeaveList(employeeInfo.EmployeeId, employeeInfo.UserId);
                    } else {
                        otable = getInstanceOfLeaveList(employeeInfo.EmployeeId, employeeInfo.UserId);
                    }

                    ResetCreateForm();

                   

                } else {
                    OnFailure(res);
                }


            },
            error: function (response) {
                OnFailure("Error!");
            }
        });


    });
    $("#btnLogout,#btnLogout2").click(function () {
        Logout();
    });
    $("#btnPassword,#btnPassword2").click(function () {
        $("#leaveApp").fadeOut();
        $("#ChangePassword").fadeIn();
    });
    $("#btnCancel").click(function () {
        $("#ChangePassword").fadeOut();
        $("#leaveApp").fadeIn();
    });
    $("#btnCreateCancel").click(function () {
        $("#leaveCreate").fadeOut();
        $("#leaveApp").fadeIn();
        ResetCreateForm();
    });
    $("#btnCreate,#btnCreate2").click(function () {
        $("#leaveApp").fadeOut();
        $("#leaveCreate").fadeIn();
        initDatePicker();
    });
    $("#btnApplied").click(function () {
        var info = $.cookie("employeeInfo");
        $("#ApprovedLeaveList").fadeOut();
        $("#LeaveList").fadeIn();
        if (otable != null) {
            otable.dataTable().fnDestroy();
            otable = getInstanceOfLeaveList(info.EmployeeId, info.UserId);
        } else {
            otable = getInstanceOfLeaveList(info.EmployeeId, info.UserId);
        }
    });
    $("#btnApproved").click(function () {
        var info = $.cookie("employeeInfo");
        $("#LeaveList").fadeOut();
        $("#ApprovedLeaveList").fadeIn();
        if (otable != null) {
            otable.dataTable().fnDestroy();
            otable = getInstanceOfApprovedLeaveList(info.EmployeeId, info.UserId);
        } else {
            otable = getInstanceOfApprovedLeaveList(info.EmployeeId, info.UserId);
        }
    })
    $("#btnSavePassword").click(function () {
        var CurrentPassword = $("#ChangePassword input[name=Password]").val();
        var NewPassword = $("#ChangePassword input[name=NewPassword]").val();
        var ConfirmPassword = $("#ChangePassword input[name=ConfirmPassword]").val();
        if (CurrentPassword == "") {
            OnWarning("Please Enter Old Password");
            return;
        }
        if (NewPassword == "") {
            OnWarning("Please Enter New Password");
            return;
        }
        if (ConfirmPassword == "") {
            OnWarning("Please Enter Confirm Password");
            return;
        }
        if (NewPassword != ConfirmPassword) {
            OnWarning("Confirm password is not correct");
            return;
        }
        employeeInfo = $.cookie("employeeInfo");
        if (employeeInfo != null && employeeInfo.UserId > 0) {
            var url = String.format(baseUrl + "/api/ChangePassword/{0}/{1}/{2}", employeeInfo.UserId, employeeInfo.UserName, CurrentPassword);
            var obj = {
                Password: CurrentPassword,
                NewPassword: NewPassword,
                ConfirmPassword: ConfirmPassword
            };
            ShowLoader();
            $.ajax({
                type: "POST",
                contentType: "application/json",
                url: url,
                data: JSON.stringify(obj),
                dataType: "json",
                success: function (res) {
                    if (res == "Password Change Successfully") {
                        OnSuccess(res);
                        $("#ChangePassword input[name=Password]").val('');
                        $("#ChangePassword input[name=NewPassword]").val('');
                        $("#ChangePassword input[name=ConfirmPassword]").val('');
                        $("#ChangePassword").fadeOut();
                        Logout(true);
                    } else {
                        OnFailure(res);
                    }
                },
                error: function (response) {
                    OnFailure("Error!");
                }
            });


        }

    });
});
function Logout(isChange) {
    $.cookie("employeeInfo", null);
    $("#leaveApp").fadeOut();
    $("#login").fadeIn();
    if (isChange) {
        $("#login input[name=password]").val('');
    }
}
function ResetCreateForm() {
    $("input[name=id]").val("0");
    $("#StartDate").val("");
    $("#EndDate").val("");
    $("#LeaveTypeIDFK").val("");
    $("#reason").val("");
    $(".datepicker").datepicker("destroy");
}
function formatDate(today) {
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!

    var yyyy = today.getFullYear();
    if (dd < 10) {
        dd = '0' + dd;
    }
    if (mm < 10) {
        mm = '0' + mm;
    }
    var formated = dd + '/' + mm + '/' + yyyy;
    return formated;
}
function GetFrontPage(res, isReferesh) {
    if (res.UserId > 0) {
        if (!isReferesh) {
            OnSuccess("WelCome! " + res.EmpName);
            $("#login").fadeOut();
        } else {
            $("#login").hide();
        }
        var options = "<option value=''>Select Leave Status</option>";
        res.DropDown.forEach(function (item) {
            options += "<option value='" + item.Value + "'>" + item.Text + "</option>"
        });
        $("#LeaveTypeIDFK").html(options);
        $("#leaveApp").fadeIn();
        var anual = "<b>Anual Leaves:</b> " + res.AnualLeaves;
        var sick = " <b>Sick Leaves:</b> " + res.SickLeaves;
        var casual = " <b>Casual Leaves:</b> " + res.CasualLeaves;
        var rest = " <b>Rest Leaves:</b> " + res.RestLeaves;
        $(".available").html(anual + sick + casual + rest);
        if (otable != null) {
            otable.dataTable().fnDestroy();
            otable = getInstanceOfLeaveList(res.EmployeeId, res.UserId);
        } else {
            otable = getInstanceOfLeaveList(res.EmployeeId, res.UserId);
        }
        $.cookie("employeeInfo", res);
        employeeInfo = $.cookie("employeeInfo");
    } else {
        OnFailure(res.msg);
    }
}
function OnSuccess(data) {
    hideLoader();
    var num = Math.random();
    var radixPos = String(num).indexOf('.');
    var random = (String(num).slice(radixPos)).replace(".", "");
    var html = String.format(notifications.success, random, data);
    $("#alerts").append(html).fadeIn(600);
    setTimeout(function () {
        $('#' + random + 'Alert').fadeOut(600).remove();
    }, 5000);
}
function OnFailure(err) {
    hideLoader();
    var num = Math.random();
    var radixPos = String(num).indexOf('.');
    var random = (String(num).slice(radixPos)).replace(".", "");
    var html = String.format(notifications.danger, random, err);
    $("#alerts").append(html).fadeIn(600);
    setTimeout(function () {
        $('#' + random + 'Alert').fadeOut(600).remove();
    }, 5000);
}
function OnInfo(data, isQuick) {
    hideLoader();
    var num = Math.random();
    var radixPos = String(num).indexOf('.');
    var random = (String(num).slice(radixPos)).replace(".", "");
    var html = String.format(notifications.info, random, data);
    $("#alerts").append(html).fadeIn(600);
    if (isQuick == undefined) {
        setTimeout(function () {
            $('#' + random + 'Alert').fadeOut(600).remove();
        }, 5000);
    } else {
        setTimeout(function () {
            $('#' + random + 'Alert').fadeOut(600).remove();
        }, 2000);
    }
}
function OnWarning(data) {
    hideLoader();
    var num = Math.random();
    var radixPos = String(num).indexOf('.');
    var random = (String(num).slice(radixPos)).replace(".", "");
    var html = String.format(notifications.warning, random, data);
    $("#alerts").append(html).fadeIn(600);
    setTimeout(function () {
        $('#' + random + 'Alert').fadeOut(600).remove();
    }, 5000);
}
function ShowLoader() {
    $("button[type=submit]").attr('disabled', true);
    $("#loader").show();
}
function initDatePicker() {
    $('.datepicker').datepicker({
        //autoclose: true,
        format: "dd/mm/yyyy",
        showStatus: true,
        showWeeks: true,
        currentText: 'Now',
        autoSize: true,
        gotoCurrent: true,
        showAnim: 'blind',
        highlightWeek: true
    }).on('changeDate', function (e) {
        $(this).datepicker('hide');
    });
}
if (!String.format) {
    String.format = function (format) {
        var args = Array.prototype.slice.call(arguments, 1);
        return format.replace(/{(\d+)}/g, function (match, number) {
            return typeof args[number] != 'undefined'
                    ? args[number]
                    : match
            ;
        });
    };
}
function hideLoader() {
    $("button[type=submit]").attr('disabled', false);
    $("#loader").attr("style", "display:none");
}
function GetLeave(id) {
    ShowLoader();
    $.get(baseUrl + "/api/Wordpress/" + id, function (res) {
        hideLoader();
        $("input[name=id]").val(res.Id);
        var start = res.DateRange.split("-")[0].trimEnd();
        var end = res.DateRange.split("-")[1].trimEnd();
        $("#StartDate").val(start).trigger('change');
        $("#EndDate").val(end).trigger('change');
        initDatePicker();
        $("#LeaveTypeIDFK").val(res.LeaveTypeIDFK);
        $("#reason").val(res.LeaveDescription);
        $("#leaveApp").fadeOut();
        $("#leaveCreate").fadeIn();

    })
}
function Delete(id) {
    ShowLoader();
    $.get(baseUrl + "/api/Delete/" + id, function () {
        OnSuccess("Record Delete Successfully");
        var res = $.cookie("employeeInfo");
        if (otable != null) {
            otable.dataTable().fnDestroy();
            otable = getInstanceOfLeaveList(res.EmployeeId, res.UserId);
        } else {
            otable = getInstanceOfLeaveList(res.EmployeeId, res.UserId);
        }
    });
}
function getInstanceOfLeaveList(empId, userId) {
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
       //{ "data": null },
       { "data": "LeaveType", "orderable": true },
       { "data": "LeaveDescription", "orderable": true },
       { "data": "StartDate", "orderable": true, "className": 'start' },
       { "data": "EndDate", "orderable": true, "className": 'end' },
       { "data": "days", "orderable": true },
       { "data": "Status", "orderable": true, "className": 'status' },
       { "data": null },

    ]

    return $("#LeaveList").dataTable({
        "bServerSide": true,
        "iDisplayLength": 10,
        oLanguage: {
            sProcessing: ''
        },
        bProcessing: true,
        "sAjaxSource": baseUrl + "/api/LeavesDataProviderAction/" + empId,
        "columns": arr,
        "ordering": false,
        "fnServerParams": function (aoData) {
            aoData.push({ "name": "page", "value": this.fnPagingInfo().iPage });
            aoData.push({ "name": "UserId", "value": userId });
        },
        "fnRowCallback": function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
            var id = aData.Id;
            var canEdit = '@ViewBag.editleave';
            canEdit = canEdit == 'True' ? true : false;

            var canApprove = '@ViewBag.approveleave';
            canApprove = canApprove == 'True' ? true : false;

            var status = aData.StatusIDFK;

            var numStart = this.fnPagingInfo().iStart;
            var index = numStart + iDisplayIndexFull + 1;
            //$("td:first", nRow).html(index);
            var start = formatDate(new Date(aData.StartDate.replace("T00:00:00", "")));
            var end = formatDate(new Date(aData.EndDate.replace("T00:00:00", "")));
            $(".start", nRow).html(start);
            $(".end", nRow).html(end);
            //if (aData.ApprovedDate != null) {
            //    $(".Approved", nRow).html(aData.ApprovedDate.replace("T00:00:00", ""))
            //} else {
            //    $(".Approved", nRow).html('No Date');
            //    $(".ApprovedUser", nRow).html('No User');
            //}
            var html = "<button onclick='GetLeave(" + aData.Id + ")' type='button' class='btn btn-warning'><i class='fa fa-pencil'></i></button> <button onclick='Delete(" + aData.Id + ")' type='button' class='btn btn-danger'><i class='fa fa-close'></i></button>";
            if (aData.Status == "Complete") {
                $(".status", nRow).html("Process Finish");
            }
            if (aData.Status == "Open")
                $("td:last", nRow).html(html);
            else
                $("td:last", nRow).html('NoAction');
        },
        "footerCallback": function (row, data, start, end, display) {
        },
        "fnDrawCallback": function (oSettings) {
            var res = oSettings.json.extra;
            var info = $.cookie("employeeInfo");
            info.AnualLeaves = res.anualLeaves;
            info.SickLeaves = res.sickLeaves;
            info.CasualLeaves = res.casualLeaves;
            info.RestLeaves = res.restLeaves;
            $.cookie("employeeInfo", info);
            var anual = "<b>Anual Leaves:</b> " + info.AnualLeaves;
            var sick = " <b>Sick Leaves:</b> " + info.SickLeaves;
            var casual = " <b>Casual Leaves:</b> " + info.CasualLeaves;
            var rest = " <b>Rest Leaves:</b> " + info.RestLeaves;
            $("#available").html(anual + sick + casual + rest);
            //$('').insertBefore('#LeaveList thead');
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


function getInstanceOfApprovedLeaveList(empId, userId) {
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
       //{ "data": null },
       { "data": "LeaveType", "orderable": true },
       { "data": "LeaveDescription", "orderable": true },
       { "data": "StartDate", "orderable": true, "className": 'start' },
       { "data": "EndDate", "orderable": true, "className": 'end' },
       { "data": "Days", "orderable": true },
       { "data": "Status", "orderable": true },
       { "data": "FirstApprovedBy", "orderable": true },
       { "data": "FirstApprovedDate", "orderable": true },
       { "data": "FinalApprovedBy", "orderable": true },
       { "data": "FinalApprovedDate", "orderable": true },
       

    ]

    return $("#ApprovedLeaveList").dataTable({
        "bServerSide": true,
        "iDisplayLength": 10,
        oLanguage: {
            sProcessing: ''
        },
        bProcessing: true,
        "sAjaxSource": baseUrl + "/api/ApprovedLeavesDataProviderAction/" + empId,
        "columns": arr,
        "ordering": false,
        "fnServerParams": function (aoData) {
            aoData.push({ "name": "page", "value": this.fnPagingInfo().iPage });
            aoData.push({ "name": "UserId", "value": userId });
        },
        "fnRowCallback": function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
            var id = aData.Id;
            var canEdit = '@ViewBag.editleave';
            canEdit = canEdit == 'True' ? true : false;

            var canApprove = '@ViewBag.approveleave';
            canApprove = canApprove == 'True' ? true : false;

            var status = aData.StatusIDFK;

            var numStart = this.fnPagingInfo().iStart;
            var index = numStart + iDisplayIndexFull + 1;
            
           
        },
        "footerCallback": function (row, data, start, end, display) {
        },
        "fnDrawCallback": function (oSettings) {
            var res = oSettings.json.extra;
            var info = $.cookie("employeeInfo");
            info.AnualLeaves = res.anualLeaves;
            info.SickLeaves = res.sickLeaves;
            info.CasualLeaves = res.casualLeaves;
            info.RestLeaves = res.restLeaves;
            $.cookie("employeeInfo", info);
            var anual = "<b>Anual Leaves:</b> " + info.AnualLeaves;
            var sick = " <b>Sick Leaves:</b> " + info.SickLeaves;
            var casual = " <b>Casual Leaves:</b> " + info.CasualLeaves;
            var rest = " <b>Rest Leaves:</b> " + info.RestLeaves;
            $("#available").html(anual + sick + casual + rest);
            //$('').insertBefore('#LeaveList thead');
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