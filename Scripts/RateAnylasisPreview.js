function GetMaterialTotalCost(id) {
    var sum = 0;
    $(id+" #tableMaterial .total").each(function (index, item) {
        sum += parseFloat($(item).attr('data-amount'))
    });
    $(".total_material_cost").text(sum);
    return sum;
}

function GetLabourTotalCost(id) {
    var sum = 0;
    $(id+" #tableLabour .total").each(function (index, item) {
        sum += parseFloat($(item).attr('data-amount'))
    });
    $(".total_labour_cost").text(sum);
    return sum;
}
function GetMiscTotalCost(id) {
    var sum = 0;
    $(id + " #tableMisc .total").each(function (index, item) {
        sum += parseFloat($(item).attr('data-amount'))
    });
    $(".total_misc_cost").text(sum);
    return sum;
}
function GetMachineryTotalCost(id) {
    var sum = 0;
    $(id+" #tableMachinery .total").each(function (index, item) {
        sum += parseFloat($(item).attr('data-amount'))
    });
    $(".total_machinery_cost").text(sum);
    return sum;
}

function GetShutteringTotalCost(id) {
    var sum = 0;
    $(id+" #tableShuttering .total").each(function (index, item) {
        sum += parseFloat($(item).attr('data-amount'))
    });
    $(".total_shuttering_cost").text(sum);
    return sum;
}

function init_preview() {
    var material = GetMaterialTotalCost("#Preview");
    var labour = GetLabourTotalCost("#Preview");
    var machinery = GetMachineryTotalCost("#Preview");
    var shuttering = GetShutteringTotalCost("#Preview");
    var misc = GetMiscTotalCost("#Preview");

    if (material == 0) {
        $("#v_material").hide();
    } else {
        $("#v_material").show();
    }

    if (labour == 0) {
        $("#v_labour").hide();
    } else {
        $("#v_labour").show();
    }

    if (misc == 0) {
        $("#v_misc").hide();
    } else {
        $("#v_misc").show();
    }

    if (machinery == 0) {
        $("#v_machinery").hide();
    } else {
        $("#v_machinery").show();
    }

    if (shuttering == 0) {
        $("#v_shuttering").hide();
    } else {
        $("#v_shuttering").show();
    }
    if (UnitName != "Nos" && IsHundred) {
        material = material / 100;
        labour = labour / 100;
        machinery = machinery / 100;
        shuttering = shuttering / 100;
        misc = misc / 100;
    }
   return init_calculation_table(material, labour, machinery, shuttering, misc);
}

function init_calculation_table(per_material, per_labour, per_machinery, per_shuttering, per_misc) {
    var html = '<table class="table table-hover table-dynamic table-striped dataTable" id="tableCalculation">';

    html += '<thead>';
    html += '<tr>';
    html += '<th>Title</th>';
    html += '<th>Cost</th>';
    html += '</tr>';
    html += '</thead>';
    html += '<tbody>';

    if (per_material > 0) {
        html += '<tr>';
        html += '<td>Cost Of Material Per ' + UnitName + '</td>';
        html += '<td>' + round(per_material,2) + '</td>';
        html += '</tr>';
    }

    if (per_labour > 0) {
        html += '<tr>';
        html += '<td>Cost Of Labour Per ' + UnitName + '</td>';
        html += '<td>' + round(per_labour,2) + '</td>';
        html += '</tr>';
    }

    if (per_machinery > 0) {
        html += '<tr>';
        html += '<td>Cost Of Machinery Per ' + UnitName + '</td>';
        html += '<td>' + round(per_machinery,2) + '</td>';
        html += '</tr>';
    }

    if (per_shuttering > 0) {
        html += '<tr>';
        html += '<td>Cost Of Shuttering Per ' + UnitName + '</td>';
        html += '<td>' + round(per_shuttering,2) + '</td>';
        html += '</tr>';
    }
    if (per_misc > 0) {
        html += '<tr>';
        html += '<td>Cost Of Misc Per ' + UnitName + '</td>';
        html += '<td>' + round(per_misc, 2) + '</td>';
        html += '</tr>';
    }
    var total = round(per_material, 2) + round(per_labour, 2) + round(per_machinery, 2) + round(per_shuttering, 2) + round(per_misc, 2);
    var g_total = 0;
    if (total > 0)
    {
        html += '<tr>';
        //html += '<td><b>Total As Per ' + UnitName + '</b></td>';
        html += '<td><b>Total</b></td>';
        html += '<td style="border-top:1px solid #000;">' + total + '</td>';
        html += '</tr>';
        g_total += total;
        if (PremiumDetail > 0)
        {
                html += '<tr>';
                html += '<td><b>Add Premium ' + PremiumDetail + '%</b></td>';
                html += '<td>' + round(((g_total / 100) * PremiumDetail), 2) + '</td>';
                html += '</tr>';
                g_total += round(((g_total / 100) * PremiumDetail), 2);
        }
        html += '<td><b>Total As Per ' + UnitName + '</b></td>';
        html += '<td style="border-top:1px solid #000;">' + round(g_total,2) + '</td>';
        html += '</tr>';
        if (Multiplier > 1)
        {
            g_total = round(g_total * Multiplier,2);

            html += '<tr>';
            html += '<td><b>Total As Per ' + ConvertedUnitName + '</b></td>';
            html += '<td>' + g_total + '</td>';
            html += '</tr>';
        }
    }

    


    html += '</tbody>';
    html += '</table>';

    $("#calculation").html(html);

    if (IsPrint) {
        $("#tableMaterial tr:last-child td:first-child").attr('colspan',4);
       
    }

    return g_total;
}