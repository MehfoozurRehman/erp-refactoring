(function ($) {
    $.fn.PrettyFormJs = function (options) {

        var defaults = {
            serialize: true,
            populate: false,
            jsonData: {},
            isComplex: false,
            keys: [],
            hasNestedDropDown: false,
            dropDownCallBack: [],
            dropDownHierarchy: "",
            reset: false,
            prefix: [],
            last_index: 0,
            selection: false,
            oncomplete: function () { },
            bindDisabled: false
        };

        var properties = $.extend(defaults, options);

        var Finalresult = {};
        var methods = {
            serializeSimple: function (div, selector, replace) {
                var result = {};
                try {
                    if (replace == undefined)
                        replace = "";
                    $(div).find(selector).each(function () {
                        var t = $(this).attr("type");
                        var hasClassNumber = $(this).hasClass('number');
                        if (hasClassNumber) {
                            this.value = this.value.replace(/,/g, '');
                        }
                        var isDisabled = $(this).prop('disabled');
                        if (isDisabled && !properties.bindDisabled) {

                        } else {
                            var name = this.name.replace(replace, "");
                            var node = result[name];
                            if ((t == "checkbox" || t == "radio") && replace !== "") {
                                if (this.checked) {
                                    if ('undefined' !== typeof node && node !== null) {
                                        if ($.isArray(node)) {
                                            node.push((this.value));
                                        } else {
                                            result[name] = [node, this.value];
                                        }
                                    } else {
                                        result[name] = this.value;
                                    }
                                }

                            } else if ((t == "checkbox" || t == "radio") && replace === "") {

                                if ('undefined' !== typeof node && node !== null) {
                                    if ($.isArray(node)) {
                                        node.push((this.checked));
                                    } else {
                                        result[name] = [node, this.checked];
                                    }
                                } else {
                                    result[name] = this.checked;
                                }
                            }
                            else {
                                if ('undefined' !== typeof node && node !== null) {
                                    if ($.isArray(node)) {
                                        node.push(this.value);
                                    } else {
                                        result[name] = [node, this.value];
                                    }
                                } else {
                                    result[name] = this.value;
                                }
                            }
                        }
                    });
                } catch (e) {
                    console.log(e);
                }

                return result;

            },

            serializeList: function (div) {
                var list = [];
                try {
                    var arr = methods.getLastIndex(div);
                    var last_index = parseInt(arr[0]);
                    for (var i = 0; i <= last_index; i++) {

                        if (properties.selection) {
                            var res = methods.serializeSimple(div, "[name*='[" + i + "]'].selected", "[" + i + "]");
                            if (arr[1] != undefined) {
                                var nested_parent_last_div = $(div).find("[name]").last().closest('.nested');
                                var nested_last_index = methods.getLastIndex(nested_parent_div);
                                var nestedLst = [];
                                var fnalResult = {};
                                var n = "";
                                for (var j = 0; j <= parseInt(nested_last_index[1]) ; j++) {
                                    var nested_parent_first_div = $(div).find("[name*='[" + i + "," + j + "]']").closest('.nested');
                                    var result = methods.serializeSimple(nested_parent_first_div, "[name*='[" + i + "," + j + "]']", "[" + i + "," + j + "]");
                                    var nextDiv = $(nested_parent_first_div).find('[class*=obj]').first()
                                    var className = $(nextDiv).attr("class");
                                    if (className != undefined) {
                                        if (className.indexOf('_') > -1) {
                                            var arr = className.split("_");
                                            var type = arr[0];
                                            var name = arr[1];
                                            n = name;
                                            if (type == "obj") {
                                                nestedLst.push(result);
                                            }
                                        }
                                    }
                                }
                                res[n] = nestedLst;
                            }
                            if (!jQuery.isEmptyObject(res)) {
                                list.push(res);
                            }
                        } else {
                            var res = methods.serializeSimple(div, "[name*='[" + i + "]']", "[" + i + "]");
                            if (arr[1] != undefined) {
                                var nested_parent_last_div = $(div).find("[name]").last().closest('.nested');
                                var nested_last_index = methods.getLastIndex(nested_parent_last_div);
                                var nestedLst = [];
                                var fnalResult = {};
                                var n = "";
                                for (var j = 0; j <= parseInt(nested_last_index[1]) ; j++) {
                                    var nested_parent_first_div = $(div).find("[name*='[" + i + "," + j + "]']").closest('.nested');
                                    var result = methods.serializeSimple(nested_parent_first_div, "[name*='[" + i + "," + j + "]']", "[" + i + "," + j + "]");
                                    var nextDiv = $(nested_parent_first_div).find('[class*=obj]').first()
                                    var className = $(nextDiv).attr("class");
                                    if (className != undefined) {
                                        if (className.indexOf('_') > -1) {
                                            var arr = className.split("_");
                                            var type = arr[0];
                                            var name = arr[1];
                                            n = name;
                                            if (type == "obj") {
                                                nestedLst.push(result);
                                            }
                                        }
                                    }
                                }
                                res[n] = nestedLst;
                            }
                            if (!jQuery.isEmptyObject(res)) {
                                list.push(res);
                            }
                        }

                    }
                } catch (e) {
                    console.log(e);
                }
                return list;
            },
            getLastIndex: function (div) {
                if (properties.last_index == 0) {
                    var last_index_name = $(div).find("[name]").last().attr('name');
                    var split = last_index_name.split("[");
                    var last_index = split[1].replace("]", "");
                    var arr = last_index.split(",");
                    return arr;
                } else {
                    return [properties.last_index];
                }
            },
            convertDate: function (date) {
                if (date === null) return "";
                var pattern = /Date\(([^)]+)\)/;
                var results = pattern.exec(date);
                var dt = moment(new Date(parseFloat(results[1]))).format('DD/MM/YYYY');
                return dt;
            },
            getCurrency: function (number) {
                var strNumber = number + "";
                var afterDecimal = "";
                if (strNumber.includes(".")) {
                    afterDecimal = "." + strNumber.split(".")[1];
                    strNumber = strNumber.split(".")[0];
                }
                return (strNumber).replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",") + afterDecimal;
            },
            fillForm: function ($form, data, prefix) {
                $.each(data, function (key, value) {
                    var $ctrl = $form.find('[name=' + prefix + key + ']');
                    if ($ctrl.is('select')) {
                        if (properties.hasNestedDropDown) {
                            var arr = properties.dropDownHierarchy.split("__");
                            if ($ctrl.hasClass('nested')) {
                                for (var i = 0; i < arr.length; i++) {
                                    if (arr[i] == prefix + key) {
                                        var id = $form.find('[name=' + arr[i - 1] + ']').val();
                                        var callback = properties.dropDownCallBack[i - 1];
                                        callback(id, value);
                                    }
                                }
                            } else {
                                $('option', $ctrl).each(function () {
                                    if (this.value == value)
                                        this.selected = true;
                                });
                            }
                        } else {
                            $('option', $ctrl).each(function () {
                                if (this.value == value)
                                    this.selected = true;
                            });
                        }


                    } else if ($ctrl.is('textarea')) {
                        $ctrl.val(value);
                    } else {
                        switch ($ctrl.attr("type")) {
                            case "text":
                            case "number":
                            case "hidden":
                            case "datetime":
                                if ($ctrl.hasClass("datepicker") || $ctrl.hasClass("datetimepicker")) {
                                    $ctrl.datepicker("update", methods.convertDate(value));
                                } else if ($ctrl.hasClass('number')) {
                                    $ctrl.val(methods.getCurrency(value));
                                }
                                else {

                                    $ctrl.val(value);
                                }

                                break;
                            case "checkbox":
                                if (value == '1') {
                                    $ctrl.prop('checked', true);
                                    $ctrl.val('true');
                                }
                                else {
                                    $ctrl.prop('checked', false);
                                    $ctrl.val('true');
                                }
                                $ctrl.trigger('change');
                                break;
                        }
                    }
                });
            },
            populateForm: function ($form, data) {
                try {
                    methods.resetForm($form);
                    if (!properties.isComplex)
                        methods.fillForm($form, data, properties.prefix[0]);
                    else {
                        for (var i = 0; i < properties.keys.length; i++) {
                            methods.fillForm($form, data[properties.keys[i]], properties.prefix[i]);
                        }
                    }
                } catch (e) {
                    console.log(e);
                }
            },
            resetForm: function ($form) {
                $form.find('input:text,input:hidden, input:password, input:file,select, textarea').val('');
                $form.find('input[type=number]').val(null);
                $form.find('select option').removeAttr('selected');
                $form.find('select option:first').attr('selected', 'selected');
                //$form.find('input:radio, input:checkbox').removeAttr('checked').removeAttr('selected');
                $form.find('input:radio, input:checkbox').val('true');
                //$form.find('input:radio, input:checkbox').closest('.make-switch').addClass('deactivate');
                $form.find('input:radio, input:checkbox').closest('.switch-animate').addClass('switch-on').removeClass('switch-off');
            }
        };

        if (properties.serialize) {

            $.each(this.find("div,tr"), function () {
                var className = $(this).attr("class");
                if (className != undefined) {
                    if (className.indexOf('_') > -1) {
                        var arr = className.split("_");
                        var type = arr[0];
                        var name = arr[1];
                        switch (type) {
                            case "obj":
                                var res = methods.serializeSimple(this, "[name]");
                                if ($.isPlainObject(Finalresult[name])) {
                                    for (var prop in res) {
                                        var value = res[prop];
                                        Finalresult[name][prop] = value;
                                    }
                                } else {
                                    Finalresult[name] = res;
                                }
                                break;
                            case "list":
                                var list = methods.serializeList(this);
                                Finalresult[name] = list;
                                break;
                        }
                    }
                }
            });
            return Finalresult;
        }
        if (properties.populate) {
            methods.populateForm(this, properties.jsonData);
        }
        if (properties.reset) {
            methods.resetForm(this);
        }
    };
})(jQuery);