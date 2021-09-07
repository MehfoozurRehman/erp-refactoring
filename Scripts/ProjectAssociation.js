function OnComplete(data) {
    if (data.msg == "Record Save Successfully") {
        OnSuccess(data.msg);
    }
    else {
        OnWarning(data.msg);
    }
    $("#form3").PrettyFormJs({
        serialize: false,
        reset: true
    });
    $("#BOQProject select option").remove();
    $("#BOQItems select option").remove();
    $('#BOQItemSelection').modal('hide')
}

function GetBOQProjectDropDown(id) {
    ShowLoader();
    $.get("/TenderingModule/BOQ/BOQProjectDropDown/?ProjectId=" + id + "&selected=0", function (data) {
        hideLoader();
        $("#BOQProject").html(data);
        $("#BOQProjectIDFK").change(function () {
            var val = $(this).val();
            if (val != "") {
                ShowLoader();
                $.get("/TenderingModule/BOQ/BOQItemDropDown/" + val, function (html) {
                    hideLoader();
                    $("#BOQItems").html(html);
                    $("#BOQItems .select2").select2();
                })
            } else {
                $("#BOQItems").html('');
            }
        });
    });
}

function BOQItemSelection(id) {
    $("input[name=TemplateId]").val(id);
    $("#BOQItemSelection").modal('show');
}