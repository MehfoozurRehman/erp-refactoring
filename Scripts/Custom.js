var config = {

    showCaption: false,
    dropZoneEnabled: false,
    overwriteInitial: false,
    showUpload: false,
    showRemove: false,
    showDrag: false,
    maxFileSize: 11240,
    preferIconicPreview: true, // this will force thumbnails to display icons for following file extensions
    previewFileIconSettings: {
        // configure your icon file extensions
        'doc': '<i class="fa fa-file-word-o text-primary"></i>',
        'xls': '<i class="fa fa-file-excel-o text-success"></i>',
        'ppt': '<i class="fa fa-file-powerpoint-o text-danger"></i>',

    },
    previewFileExtSettings: {
        // configure the logic for determining icon file extensions
        'doc': function (ext) {
            return ext.match(/(doc|docx)$/i);
        },
        'xls': function (ext) {
            return ext.match(/(xls|xlsx)$/i);
        },
        'ppt': function (ext) {
            return ext.match(/(ppt|pptx)$/i);
        }
    }

};
var switchState = function (selector) {
    var state = $(selector).closest('.switch-animate').hasClass('switch-on');
    return state;
}
var changeState = function (selector, bool) {
    if (!bool) {
        $(selector).closest('.switch-animate').addClass('switch-off').removeClass('switch-on');
        $(selector).attr('checked', bool);
    } else {
        $(selector).closest('.switch-animate').addClass('switch-on').removeClass('switch-off');
        $(selector).attr('checked', bool);
    }
}
var fileExtension = function (url) {
    return url.split('.').pop().split(/\#|\?/)[0];
}
var fileName = function (url) {
    return url.substring(url.lastIndexOf('/') + 1);
}
fileInputTypes = function (ext) {
    var type = ext;
    switch (ext) {
        case "doc":
        case "xls":
        case "docx":
        case "xlsx":
        case "ppt":
        case "pptx":
            type = "office";
            break;
        case "ai":
        case "eps":
            type = "gdocs";
            break;
        case "txt":
            type = "text";
            break;
        case "html":
            type = "html";
            break;
        case "mp4":
        case "avi":
        case "mov":
        case "flv":
        case "wmv":
            type = "video";
            break;
        case "tif":
        case "jpg":
        case "jpeg":
        case "png":
            type = "";
    }
    return type;
}
var fileInputGetAllowedExt = function (ext) {
    var exts;
    if (ext == undefined) {
        exts = ["doc", "docx", "xls", "xlsx", "ppt", "pptx", "ai", "eps", "txt", "html", "mp4", "avi", "mov", "flv", "wmv", "tif", "jpg", "jpeg", "png", "pdf"];
        return exts;
    } else {
        exts = ["tif", "jpg", "jpeg", "png"];
        return exts;
    }
}
fileInputTypeObj = function (type, url, ext, filename) {

    if (type === "") {
        return {
            downloadUrl: url, showRemove: false,
            showDrag: false
        };
    } else if (type === "video") {
        return {
            type: "video", filetype: "video/mp4", downloadUrl: url, showRemove: false,
            showDrag: false
        }
    } else if (type === "pdf") {
        return {
            type: type, downloadUrl: url, showRemove: false,
            showDrag: false
        };
    } else if (type === "office") {
        var caption = (filename.split(".")[0]).split("__")[1];
        return {
            type: type, downloadUrl: url, showRemove: false, caption: caption, filename: filename, showZoom: false,
            showDrag: false
        };
    } else {
        return {
            type: type,
            downloadUrl: url,
            showRemove: false,
            showDrag: false
        };
    }
}
scaleTable = function (markupId) {

    //This hacky stuff is used because the table is invisible in IE.
    function realWidth(obj) {
        var clone = obj.clone();
        clone.css("visibility", "hidden");
        $('body').append(clone);
        var width = clone.outerWidth();
        clone.remove();
        return width;
    }
    function realHeight(obj) {
        var clone = obj.clone();
        clone.css("visibility", "hidden");
        $('body').append(clone);
        var height = clone.outerHeight();
        clone.remove();
        return height;
    }

    var table = $("#" + markupId);

    var tablecontainer = $("#" + markupId).parents(".scalabletablecontainer");
    var scalex = tablecontainer.innerWidth() / realWidth(table);
    var scaley = tablecontainer.innerHeight() / realHeight(table);

    var scale = Math.min(scalex, scaley);

    if (scale < 1.0) {
        var fontsize = 12.0 * scale;
        var padding = 5.0 * scale;
        $("#" + markupId + " table tbody").css("font-size", fontsize + "px");
        $("#" + markupId + " table tbody TD").css("padding", padding + "px");
        $("#" + markupId + " table TH").css("padding", padding + "px");
    }
};
function initFileInput(url, id, exts) {
    if (url != null && url != "" && url != undefined) {
        var ext = fileExtension(url).toLowerCase();
        var type = fileInputTypes(ext);

        var obj = fileInputTypeObj(type, url, ext, fileName(url));

        var configs = {

            showCaption: false,
            dropZoneEnabled: false,
            overwriteInitial: false,
            showUpload: false,
            showRemove: false,
            showDrag: false,
            maxFileSize: 11240,
            initialPreview: [

            ],
            initialPreviewAsData: true, // defaults markup
            initialPreviewFileType: 'image', // image is the default and can be overridden in config below
            initialPreviewConfig: [
                //{ caption: "Business 1", filename: "Business-1.jpg", size: 762980, url: "/site/file-delete", key: 11 },
                //{ previewAsData: false, size: 823782, caption: "Business 2", filename: "Business-2.jpg", url: "/site/file-delete", key: 13 },
                //{ caption: "Lorem Ipsum", filename: "LoremIpsum.txt", type: "text", size: 1430, url: "/site/file-delete", key: 12 },
                //{ type: "pdf", size: 8000, caption: "PDF Sample", filename: "PDF-Sample.pdf", url: "/file-upload-batch/2", key: 14 },
                //{ type: "video", size: 375000, filetype: "video/mp4", caption: "Krajee Sample", filename: "KrajeeSample.mp4", url: "/file-upload-batch/2", key: 15 }
            ],
            preferIconicPreview: true, // this will force thumbnails to display icons for following file extensions
            previewFileIconSettings: {
                // configure your icon file extensions
                'doc': '<i class="fa fa-file-word-o text-primary"></i>',
                'xls': '<i class="fa fa-file-excel-o text-success"></i>',
                'ppt': '<i class="fa fa-file-powerpoint-o text-danger"></i>',
                //'pdf': '<i class="fa fa-file-pdf-o text-danger"></i>',
                //'zip': '<i class="fa fa-file-archive-o text-muted"></i>',
                //'htm': '<i class="fa fa-file-code-o text-info"></i>',
                //'txt': '<i class="fa fa-file-alt-o text-info"></i>',
                //'mov': '<i class="fa fa-file-video-o text-warning"></i>',
                //'mp3': '<i class="fa fa-file-audio-o text-warning"></i>'
                // note for these file types below no extension determination logic
                // has been configured (the keys itself will be used as extensions)

            },
            previewFileExtSettings: {
                // configure the logic for determining icon file extensions
                'doc': function (ext) {
                    return ext.match(/(doc|docx)$/i);
                },
                'xls': function (ext) {
                    return ext.match(/(xls|xlsx)$/i);
                },
                'ppt': function (ext) {
                    return ext.match(/(ppt|pptx)$/i);
                },
                'zip': function (ext) {
                    return ext.match(/(zip|rar|tar|gzip|gz|7z)$/i);
                },
                'htm': function (ext) {
                    return ext.match(/(htm|html)$/i);
                },
                'txt': function (ext) {
                    return ext.match(/(txt|ini|csv|java|php|js|css)$/i);
                },
                'mov': function (ext) {
                    return ext.match(/(avi|mpg|mkv|mov|mp4|3gp|webm|wmv)$/i);
                },
                'mp3': function (ext) {
                    return ext.match(/(mp3|wav)$/i);
                }
            }

        };
        configs["allowedFileExtensions"] = fileInputGetAllowedExt(exts);
        configs.initialPreview.push(url);
        configs.initialPreviewConfig.push(obj);
        $(id).fileinput(configs);
    }
}
function initMultiFileInput(urls, id, exts) {

    var configs = {

        showCaption: false,
        dropZoneEnabled: false,
        overwriteInitial: false,
        showUpload: false,
        showRemove: false,
        showDrag: false,
        maxFileSize: 11240,
        initialPreview: [

        ],
        initialPreviewAsData: true, // defaults markup
        initialPreviewFileType: 'image', // image is the default and can be overridden in config below
        initialPreviewConfig: [
            //{ caption: "Business 1", filename: "Business-1.jpg", size: 762980, url: "/site/file-delete", key: 11 },
            //{ previewAsData: false, size: 823782, caption: "Business 2", filename: "Business-2.jpg", url: "/site/file-delete", key: 13 },
            //{ caption: "Lorem Ipsum", filename: "LoremIpsum.txt", type: "text", size: 1430, url: "/site/file-delete", key: 12 },
            //{ type: "pdf", size: 8000, caption: "PDF Sample", filename: "PDF-Sample.pdf", url: "/file-upload-batch/2", key: 14 },
            //{ type: "video", size: 375000, filetype: "video/mp4", caption: "Krajee Sample", filename: "KrajeeSample.mp4", url: "/file-upload-batch/2", key: 15 }
        ],
        preferIconicPreview: true, // this will force thumbnails to display icons for following file extensions
        previewFileIconSettings: {
            // configure your icon file extensions
            'doc': '<i class="fa fa-file-word-o text-primary"></i>',
            'xls': '<i class="fa fa-file-excel-o text-success"></i>',
            'ppt': '<i class="fa fa-file-powerpoint-o text-danger"></i>',
            //'pdf': '<i class="fa fa-file-pdf-o text-danger"></i>',
            //'zip': '<i class="fa fa-file-archive-o text-muted"></i>',
            //'htm': '<i class="fa fa-file-code-o text-info"></i>',
            //'txt': '<i class="fa fa-file-alt-o text-info"></i>',
            //'mov': '<i class="fa fa-file-video-o text-warning"></i>',
            //'mp3': '<i class="fa fa-file-audio-o text-warning"></i>'
            // note for these file types below no extension determination logic
            // has been configured (the keys itself will be used as extensions)

        },
        previewFileExtSettings: {
            // configure the logic for determining icon file extensions
            'doc': function (ext) {
                return ext.match(/(doc|docx)$/i);
            },
            'xls': function (ext) {
                return ext.match(/(xls|xlsx)$/i);
            },
            'ppt': function (ext) {
                return ext.match(/(ppt|pptx)$/i);
            },
            'zip': function (ext) {
                return ext.match(/(zip|rar|tar|gzip|gz|7z)$/i);
            },
            'htm': function (ext) {
                return ext.match(/(htm|html)$/i);
            },
            'txt': function (ext) {
                return ext.match(/(txt|ini|csv|java|php|js|css)$/i);
            },
            'mov': function (ext) {
                return ext.match(/(avi|mpg|mkv|mov|mp4|3gp|webm|wmv)$/i);
            },
            'mp3': function (ext) {
                return ext.match(/(mp3|wav)$/i);
            }
        }

    };
    urls.forEach(function (url, index) {

        if (url != null && url != "" && url != undefined) {
            var ext = fileExtension(url).toLowerCase();
            var type = fileInputTypes(ext);

            var obj = fileInputTypeObj(type, url, ext, fileName(url));


            configs["allowedFileExtensions"] = fileInputGetAllowedExt(exts);
            configs.initialPreview.push(url);
            configs.initialPreviewConfig.push(obj);

        }
    });
    $(id).fileinput(configs);
}
if (typeof window.FormData === 'undefined') {
    alert("This browser doesn't support HTML5 file uploads!");
}
window.addEventListener("submit", function (e) {
    var form = e.target;
    if (form.getAttribute("enctype") === "multipart/form-data") {
        if (form.dataset.ajax) {
            var validate = $("form").validationEngine('validate');
            if (validate) {
                var body = "function(){ " + form.dataset.ajaxBegin + "() }";
                var wrap = s => "{ return " + body + " };" //return the block having function expression
                var func = new Function(wrap(body));
                func.call(null).call(null);
                e.preventDefault();
                e.stopImmediatePropagation();
                var xhr = new XMLHttpRequest();
                xhr.open(form.method, form.action);
                xhr.setRequestHeader("x-Requested-With", "XMLHttpRequest");
            }// this allows 'Request.IsAjaxRequest()' to work in the controller code
            xhr.onreadystatechange = function () {
                if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
                    var returnedData; //this variable needs to be named the same as the parameter in the function call specified for the AjaxOptions.OnSuccess
                    try {
                        returnedData = JSON.parse(xhr.responseText); //I also want my returned data to be parsed if it is a JSON object
                    } catch (e) {
                        returnedData = xhr.responseText;
                    }
                    if (form.dataset.ajaxSuccess) {
                        var body = "function(a){ " + form.dataset.ajaxSuccess + "(a) }";
                        var wrap = s => "{ return " + body + " };" //return the block having function expression
                        var func = new Function(wrap(body));
                        func.call(null).call(null, returnedData); //invoke the function using arguments
                    }
                    else if (form.dataset.ajaxFailure) {
                        var body = "function(a){ " + form.dataset.ajaxFailure + "(a) }";
                        var wrap = s => "{ return " + body + " };" //return the block having function expression
                        var func = new Function(wrap(body));
                        func.call(null).call(null, returnedData); //invoke the function using arguments
                    }
                    if (form.dataset.ajaxUpdate) {
                        var updateTarget = document.querySelector(form.dataset.ajaxUpdate);
                        if (updateTarget) {
                            updateTarget.innerHTML = data;
                        }
                    }
                } else if (xhr.readyState === 3 && xhr.status === 500) {
                    var returnedData;
                    try {
                        returnedData = JSON.parse(xhr.responseText); //I also want my returned data to be parsed if it is a JSON object
                    } catch (e) {
                        returnedData = xhr.responseText;
                    }
                    if (form.dataset.ajaxFailure && returnedData != "") {
                        var body = "function(a){ " + form.dataset.ajaxFailure + "(a) }";
                        var wrap = s => "{ return " + body + " };" //return the block having function expression
                        var func = new Function(wrap(body));
                        var obj = {
                            responseJSON: returnedData,
                            statusText: xhr.statusText,
                            status: xhr.status
                        }
                        func.call(null).call(null, obj); //invoke the function using arguments
                    }
                } else {

                }
            };
            xhr.send(new FormData(form));
        }
    }
}, true);

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
function formattedDate(d) {
    var month = String(d.getMonth() + 1);
    var day = String(d.getDate());
    var year = String(d.getFullYear());

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return `${day}/${month}/${year}`;
}
function validateDate(input) {
    var reg = /(0[1-9]|[12][0-9]|3[01])[- /.](0[1-9]|1[012])[- /.](19|20)\d\d/;
    if (input.match(reg)) {
        return true;
    }
    else {
        return false;
    }
}
function convertDate(date) {
    if (date === null) return "";
    var pattern = /Date\(([^)]+)\)/;
    var results = pattern.exec(date);
    var dt = moment(new Date(parseFloat(results[1]))).format('DD-MMM-YYYY');
    return dt;
}
function toDate(dateStr) {
    var parts = dateStr.split("/")
    return new Date(parts[2], parts[1] - 1, parts[0])
}
Date.prototype.addDays = function (days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}
function convertDate2(date) {
    if (date === null) return "";
    var pattern = /Date\(([^)]+)\)/;
    var results = pattern.exec(date);
    var dt = moment(new Date(parseFloat(results[1]))).format('DD/MM/YYYY');
    return dt;
}
function getCurrency(number) {
    var strNumber = number + "";
    var afterDecimal = "";
    if (strNumber.includes(".")) {
        afterDecimal = "." + strNumber.split(".")[1];
        strNumber = strNumber.split(".")[0];
    }
    return (strNumber).replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",") + afterDecimal;
}
function init_numberkeyup() {
    $('input.number').keyup(function (event) {

        // skip for arrow keys
        if (event.which >= 37 && event.which <= 40) return;

        // format number
        $(this).val(function (index, value) {
            return getCurrency(value);
        });
    });
}
function convertCurrencyToNumber(value) {
    return parseFloat(value.replace(/,/g, ''));
}
function init_numbers() {
    $('input.number').each(function (index, input) {
        var val = getCurrency($(input).val());
        $(this).val(val);
    });
}

var notifications = {
    success: "<div class='alert alert-success alert-dismissible'  id='{0}Alert'><button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;</button> <h4><i class='icon fa fa-check'></i> Success!</h4>{1}</div>",
    danger: "<div class='alert alert-danger alert-dismissible' id='{0}Alert'><button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;</button><h4><i class='icon fa fa-ban'></i> Danger!</h4>{1}</div>",
    info: "<div class='alert alert-info alert-dismissible' id='{0}Alert'><button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;</button><h4><i class='icon fa fa-info'></i> Info!</h4>{1}</div>",
    warning: "<div class='alert alert-warning alert-dismissible' id='{0}Alert'><button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;</button><h4><i class='icon fa fa-warning'></i> Warning!</h4>{1}</div>",
};
$(document).ready(function () {
    $("form").validationEngine({
        scroll: true
    });
    init_numbers();
    init_numberkeyup();
    $(".select2").select2();
    $('[data-toggle="tooltip"]').tooltip()
    $(window).resize();
    // $("body").addClass('sidebar-collapse');
    var template = '<li><a href="#"><img src width="50" height="50" /> <span></span></a></li>';

    $('#EmployeeAutoComplete').typeahead({
        item: template,
        ajax: {
            url: '/HRModule/Employee/GetEmployeeSuggestion',
            method: 'post',
            triggerLength: 1
        },
        onSelect: function (data) {
            setEmployeeParameters(data)
        },
        onNonSelect: function (data) {
            setEmployeeParameters(data)
        }
    });
    $('#EmployeeWithoutWageAutoComplete').typeahead({
        item: template,
        ajax: {
            url: '/HRModule/Employee/GetEmployeeWithoutWageSuggestion',
            method: 'post',
            triggerLength: 1
        },
        onSelect: function (data) {
            setEmployeeParameters(data)
        },
        onNonSelect: function (data) {
            setEmployeeParameters(data)
        }
    });
    $("#ItemSugg").typeahead({
        item: '<li><a href="#"><span></span></a></li>',
        ajax: {
            url: '/Purchase/Items/GetItemSuggestion',
            method: 'post',
            triggerLength: 1
        },
        onSelect: function (data) {
            setItemParameters(data)
        },
        onNonSelect: function (data) {
            setItemParameters(data)
        }
    });
  
    $("#FixedItemSugg").typeahead({
        item: '<li><a href="#"><span></span></a></li>',
        ajax: {
            url: '/Purchase/Items/GetFixedItemSuggestion',
            method: 'post',
            triggerLength: 1
        },
        onSelect: function (data) {
            setItemParameters(data)
        },
        onNonSelect: function (data) {
            setItemParameters(data)
        }
    });

    $("#RawItemSugg").typeahead({
        item: '<li><a href="#"><span></span></a></li>',
        ajax: {
            url: '/Purchase/Items/GetRawMaterialSuggestion',
            method: 'post',
            triggerLength: 1
        },
        onSelect: function (data) {
            setItemParameters(data)
        },
        onNonSelect: function (data) {
            setItemParameters(data)
        }
    });

    $("#MaintainceItemSugg").typeahead({
        item: '<li><a href="#"><span></span></a></li>',
        ajax: {
            url: '/Purchase/Items/GetMaintainceMaterialSuggestion',
            method: 'post',
            triggerLength: 1
        },
        onSelect: function (data) {
            setItemParameters(data)
        },
        onNonSelect: function (data) {
            setItemParameters(data)
        }
    });
   
    $("#AccountSugg").typeahead({
        item: '<li><a href="#"><span></span></a></li>',
        ajax: {
            url: '/Accounts/GLAccounts/GetAccountSuggestion',
            method: 'post',
            triggerLength: 1
        },
        onSelect: function (data) {
            setAccountParameters(data)
        },
        onNonSelect: function (data) {
            setAccountParameters(data)
        }
    });
    $('#PTEmployeeAutoComplete').typeahead({
        item: template,
        ajax: {
            url: '/HRModule/Employee/GetPTEmployeeSuggestion',
            method: 'post',
            triggerLength: 1
        },
        onSelect: function (data) {
            setEmployeeParameters(data)
        },
        onNonSelect: function (data) {
            setEmployeeParameters(data)
        }
    });

    $('#PermanentEmployeeAutoComplete').typeahead({
        item: template,
        ajax: {
            url: '/HRModule/Employee/GetPermanentEmployeeSuggestion',
            method: 'post',
            triggerLength: 1
        },
        onSelect: function (data) {
            setEmployeeParameters(data)
        },
        onNonSelect: function (data) {
            setEmployeeParameters(data)
        }
    });

    $('#TemporaryEmployeeAutoComplete').typeahead({
        item: template,
        ajax: {
            url: '/HRModule/Employee/GetTemporaryEmployeeSuggestion',
            method: 'post',
            triggerLength: 1
        },
        onSelect: function (data) {
            setEmployeeParameters(data)
        },
        onNonSelect: function (data) {
            setEmployeeParameters(data)
        }
    });

    $('#FornightEmployeeAutoComplete').typeahead({
        item: template,
        ajax: {
            url: '/HRModule/Employee/GetFornightEmployeeSuggestion',
            method: 'post',
            triggerLength: 1
        },
        onSelect: function (data) {
            setEmployeeParameters(data)
        },
        onNonSelect: function (data) {
            setEmployeeParameters(data)
        }
    });

    $('#DailyWageEmployeeAutoComplete').typeahead({
        item: template,
        ajax: {
            url: '/HRModule/Employee/GetDailyWageEmployeeSuggestion',
            method: 'post',
            triggerLength: 1
        },
        onSelect: function (data) {
            setEmployeeParameters(data)
        },
        onNonSelect: function (data) {
            setEmployeeParameters(data)
        }
    });
    $('#FornightAndDailyWageEmployeeAutoComplete').typeahead({
        item: template,
        ajax: {
            url: '/HRModule/Employee/GetFornightAndDailyWageEmployeeSuggestion',
            method: 'post',
            triggerLength: 1
        },
        onSelect: function (data) {
            setEmployeeParameters(data)
        },
        onNonSelect: function (data) {
            setEmployeeParameters(data)
        }
    });
    $('#MateEmployeeAutoComplete').typeahead({
        item: template,
        ajax: {
            url: '/HRModule/Employee/GetMateEmployeeSuggestion',
            method: 'post',
            triggerLength: 1
        },
        onSelect: function (data) {
            setEmployeeParameters(data)
        },
        onNonSelect: function (data) {
            setEmployeeParameters(data)
        }
    });
    $('#MateAndFornightEmployeeAutoComplete').typeahead({
        item: template,
        ajax: {
            url: '/HRModule/Employee/GetMateAndFornightEmployeeSuggestion',
            method: 'post',
            triggerLength: 1
        },
        onSelect: function (data) {
            setEmployeeParameters(data)
        },
        onNonSelect: function (data) {
            setEmployeeParameters(data)
        }
    });




    $('form').on('focus', ':input', function () {
        $(this).attr('autocomplete', 'off');

    });

    $("form").attr('autocomplete', 'off');


    $('input[type="checkbox"].minimal, input[type="radio"].minimal').iCheck({
        checkboxClass: 'icheckbox_minimal-blue',
        radioClass: 'iradio_minimal-blue'
    })
    //Red color scheme for iCheck
    $('input[type="checkbox"].minimal-red, input[type="radio"].minimal-red').iCheck({
        checkboxClass: 'icheckbox_minimal-red',
        radioClass: 'iradio_minimal-red'
    })
    //Flat red color scheme for iCheck
    $('input[type="checkbox"].flat-red, input[type="radio"].flat-red').iCheck({
        checkboxClass: 'icheckbox_flat-green',
        radioClass: 'iradio_flat-green'
    })

});
function setEmployeeParameters(data) {
    var div = data.element.closest(".EmpDropDown");
    var arr = data.other.split(",");
    var EmpTypeIDFK = arr[0];
    var ProjectIDFK = arr[1];
    $(div).find(".EmpIDFK").val(data.value).trigger('change');
    $(div).find("input[name=img]").val(data.img).trigger('change');
    $(div).find("input[name=text]").val(data.text).trigger('change');
    $(div).find(".EmpTypeIDFK").val(EmpTypeIDFK).trigger('change');
    $(div).find("input[name=projectId]").val(ProjectIDFK).trigger('change');
}
function setItemParameters(data) {
    var div = data.element.closest(".ItemDropDown");
    $(div).find("#hdfItemId").val(data.value).trigger('change');
    $(div).find("#hdfItemText").val(data.text).trigger('change');
    $(div).find("#hdfCategoryId").val(data.other).trigger('change');
}
function setAccountParameters(data) {
    var div = data.element.closest(".AccountDropDown");
    $(div).find("#hdfAccountId").val(data.value).trigger('change');
    $(div).find("#hdfAccountText").val(data.text).trigger('change');
    $(div).find("#hdfAccountCode").val(data.other).trigger('change');
}
function GetSelectedItemCode() {
    var search_text = $("#ItemSugg,#PurchaseItemSugg").val().trim();
    var ItemCode = search_text.split('--')[0].trim();;
    return ItemCode;
}
function round(value, decimals) {
    return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
}
function employeModal(employeid) {
   
    var empid = employeid;
    $.post("/HRModule/Employee/EmployeDataView", { Employeid: empid }, function (data) {
       
        $("#myUserModal").html(data)
    });
}
function validateEmpDropDown(field, rules, i, options) {
    var required = rules[0];
    if (required == "required") {
        var EmpId = $(field).closest(".EmpDropDown").find("input[type=hidden]:first").val();
        if (EmpId == 0) {
            return "Please Select Employee";
        }
    } else {
        var EmpId = $(field).closest(".EmpDropDown").find("input[type=hidden]:first").val() == "" ? 0 : parseInt($(field).closest(".EmpDropDown").find("input[type=hidden]:first").val());
        var val = $(field).val();
        if (EmpId == 0 && val == "")
            $(field).closest(".EmpDropDown").find("input[type=hidden]:first").val(null);
        else if (val !== "" && EmpId == 0)
            return "Employee not selected correctly";
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
    var html = String.format(notifications.danger, random, "<b>Message : </b>" + err.responseJSON.error + "<br/> <b>Error Type : </b>" + err.statusText + "<br/> <b>Error Code : </b>" + err.status);
    $("#alerts").append(html).fadeIn(600);
    setTimeout(function () {
        $('#' + random + 'Alert').fadeOut(600).remove();
    }, 5000);
}
function OnFailureAjax(err) {
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
function OnWarningModal(data) {
    hideLoader();
    var num = Math.random();
    var radixPos = String(num).indexOf('.');
    var random = (String(num).slice(radixPos)).replace(".", "");
    var html = String.format(notifications.warning, random, data);
    $(".modal-dialog #alerts").append(html).fadeIn(600);
    setTimeout(function () {
        $('#' + random + 'Alert').fadeOut(600).remove();
    }, 5000);
}

function OnSuccessModal(data) {
    hideLoader();
    var num = Math.random();
    var radixPos = String(num).indexOf('.');
    var random = (String(num).slice(radixPos)).replace(".", "");
    var html = String.format(notifications.success, random, data);
    $(".modal-dialog #alerts").append(html).fadeIn(600);
    setTimeout(function () {
        $('#' + random + 'Alert').fadeOut(600).remove();
    }, 5000);
}
function OnFailureModal(err) {
    hideLoader();
    var num = Math.random();
    var radixPos = String(num).indexOf('.');
    var random = (String(num).slice(radixPos)).replace(".", "");
    var html = String.format(notifications.danger, random, "<b>Message : </b>" + err.responseJSON.error + "<br/> <b>Error Type : </b>" + err.statusText + "<br/> <b>Error Code : </b>" + err.status);
    $(".modal-dialog #alerts").append(html).fadeIn(600);
    setTimeout(function () {
        $('#' + random + 'Alert').fadeOut(600).remove();
    }, 5000);
}
function OnInfoModal(data, isQuick) {
    hideLoader();
    var num = Math.random();
    var radixPos = String(num).indexOf('.');
    var random = (String(num).slice(radixPos)).replace(".", "");
    var html = String.format(notifications.info, random, data);
    $(".modal-dialog #alerts").append(html).fadeIn(600);
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
function OnWarningModal(data) {
    hideLoader();
    var num = Math.random();
    var radixPos = String(num).indexOf('.');
    var random = (String(num).slice(radixPos)).replace(".", "");
    var html = String.format(notifications.warning, random, data);
    $(".modal-dialog #alerts").append(html).fadeIn(600);
    setTimeout(function () {
        $('#' + random + 'Alert').fadeOut(600).remove();
    }, 5000);
}
function ShowLoader() {
    $("button[type=submit]").attr('disabled', true);
    $("#loader").show();
}
function hideLoader() {
    $("button[type=submit]").attr('disabled', false);
    $("#loader").attr("style", "display:none");
}
function GetObjById(array, property, value) {
    var res = null;
    array.forEach(function (result, index) {
        if (result[property] === value) {
            res = result;
            return;
        }
    });
    return res;
}
function GetObjByTwoProps(array, property, value, property1, value1) {
    var res = null;
    array.forEach(function (result, index) {
        if (result[property] === value && result[property1] === value1) {
            res = result;
            return;
        }
    });
    return res;
}
function GetObjByThreeProps(array, property, value, property1, value1, property2, value2) {
    var res = null;
    array.forEach(function (result, index) {
        if (result[property] === value && result[property1] === value1 && result[property2] === value2) {
            res = result;
            return;
        }
    });
    return res;
}
function sum(array, property) {
    var sum = 0;
    array.forEach(function (result, index) {
        sum += result[property];
    });
    return sum;
}
function countWhereZero(array, property) {
    var sum = 0;
    array.forEach(function (result, index) {
        if (result[property] === 0)
            sum += 1;
    });
    return sum;
}
function findAndRemove(array, property, value) {
    array.forEach(function (result, index) {
        if (result[property] === value) {
            //Remove from array
            array.splice(index, 1);
        }
    });
}
function findAndRemoveTwoProps(array, property, value, property1, value1) {
    array.forEach(function (result, index) {
        if (result[property] === value && result[property1] === value1) {
            //Remove from array
            array.splice(index, 1);
        }
    });
}
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
function findAndRemoveThreeProps(array, property, value, property1, value1, property2, value2) {
    array.forEach(function (result, index) {
        if (result[property] === value && result[property1] === value1 && result[property2] === value2) {
            //Remove from array
            array.splice(index, 1);
        }
    });
}

function ajax(url, type) {
    var s;
    switch (type) {
        case "text":
            s = $.ajax({
                type: "GET",
                url: url,
                cache: false,
                async: false,
                beforeSend: function (sender) {
                },
                success: function (data) {
                    return data;
                }
            }).responseText;
            break;
        case "json":
            s = $.ajax({
                url: url,
                dataType: "json",
                contentType: "application/json",
                param: '{}',
                type: "GET",
                async: false,
                beforeSend: function (sender) {
                },
                success: function (data) {
                },
                error: function (err) {
                    alert(err.responseText);
                }
            }).responseJSON;
            break;
    }

    return s;
}
function confirmDialog(message, onConfirm) {
    var fClose = function () {
        modal.modal("hide");
    };
    var modal = $("#confirmModal");
    modal.modal("show");
    $("#confirmMessage").empty().append(message);
    $("#confirmOk").unbind().one('click', onConfirm).one('click', fClose);
    $("#confirmCancel").unbind().one("click", fClose);
}

