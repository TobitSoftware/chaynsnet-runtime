window.CurrDate = new Date();
window.MinDate = undefined;
window.MaxDate = undefined;

window.MonthNames = undefined;
window.DayNames = undefined;
window.PreSelectedElement = undefined;
window.PreSelectedDate = undefined;
window.PreSelectedTime = undefined;

var TimeMode;

export default function Dialog(json, type) {
    //Initialisieren
    $(window).unbind('mousewheel DOMMouseScroll');

    var bg = $('<div>');
    bg.addClass('dialogBackgroundLayer');
    var BackgroundLayer;
    if (!document.querySelector('.dialogBackgroundLayer')) {
        if (document.querySelector('.chaynsIdBackgroundLayer')) {
            bg.css('width', 0);
        }

        $('body').append(bg);
        BackgroundLayer = bg;
    }

    var dlg = $('<div>');
    dlg.addClass('dialogBody');
    var Dlg = dlg;

    var $dialogBackgroundLayer = document.querySelector('.dialogBackgroundLayer');

    $dialogBackgroundLayer.addEventListener('click', function (evt) {
        evt.stopPropagation();
    }, false);

    //Interne Funktionen
    function removeTags(text) {
        if (text === undefined || text === null || typeof text !== 'string') {
            return text;
        }
        var scriptRegex = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/ig;
        return text.replace(scriptRegex, '');
    }

    //Werte setzen
    var Type = type || 'hint';
    var Text = removeTags(json.Text);
    var Headline = removeTags(json.Headline);
    var Buttons = json.Buttons || [];

    var Items = json.Items || [];
    for (var k = 0; k < Items.length; k++) {
        Items[k].Text = removeTags(Items[k].Text);
        Items[k].Value = removeTags(Items[k].Value);
    }

    var DisplayItems = [];
    var Quickfind = json.Quickfind === 1 || json.Quickfind === true;
    var Callback = json.Callback;
    var SrcIframe = json.SrcIframe;
    var FacebookIds = json.FacebookIds || [];
    var Selection = json.Selection || 0;
    //noinspection JSUnresolvedVariable
    var Form = json.Form || null;
    //noinspection JSUnresolvedVariable
    var Overflow = json.Overflow || null;
    var DisplayMe = json.DisplayMe === 1;
    var Query = null;
    //noinspection Eslint
    var UseFullHeight = json.UseFullHeight === 1;
    var Index = 0;
    var ItemSpace = 15;
    var MinTimestamp;
    var MaxTimestamp;
    TimeMode = json.TimeMode || TimeMode || 1; //1 only Date, 2 only Time, 3 both
    var Timestamp = json.Timestamp !== -1 ? json.Timestamp : Math.floor(Date.now() / 1000);
    window.PreSelectedDate = Timestamp > 0 ? new Date(Timestamp * 1000) : null;
    window.PreSelectedTime = Timestamp * 1000;

    if (TimeMode === 2) {
        MinTimestamp = json.MinTimestamp;
        MaxTimestamp = json.MaxTimestamp;
    } else {
        MinTimestamp = json.MinTimestamp !== -1 ? json.MinTimestamp : Math.floor(Date.now() / 1000) - 60 * 60 * 24 * 365 * 80;
        MaxTimestamp = json.MaxTimestamp !== -1 ? json.MaxTimestamp : Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 365 * 5;
    }
    window.MinDate = MinTimestamp !== -1 ? new Date(MinTimestamp * 1000) : null;
    window.MaxDate = MaxTimestamp !== -1 ? new Date(MaxTimestamp * 1000) : null;
    //noinspection JSUnusedLocalSymbols,Eslint
    var CallbackFunction = null;
    //noinspection JSUnusedLocalSymbols,Eslint
    var InitHeight = 0;
    var Waitcursor = `//chayns.tobit.com/Images/slitte/WebShadow/WaitCursor/WaitCursor_${window.ChaynsInfo.ColorScheme.Name}_64.gif`;
    var FinalFunctions = [];
    var IframeSource = json.src || null;
    var OriginalIframe = null;

    var PreClose = () => {
        if (!Dlg.is('.closing')) {
            Dlg.addClass('closing');
            BackgroundLayer.addClass('closing');
        }
    };

    var Close = () => {
        PreClose();
        Dlg.fadeOut(function () {
            Dlg.html('');
            $('body').find(Dlg).remove();
        });
        BackgroundLayer.remove();
        Buttons = [];
        Items = [];
        DisplayItems = [];
        Headline = null;
        Text = null;
        Index = 0;
        Query = null;
        Quickfind = 0;
        Callback = null;
        Selection = 0;
        if ($('.dialogBody').length === 1) {
            $('html').css({
                overflowY: '',
                paddingRight: ''
            });
        }

        if (window.ChaynsInfo.IsMobile) {
            window.Navigation.InitNavScroll();
            window.ChaynsWeb.initContentScroll();
        }

        if (Type === 'iframe') {
            window.ChaynsWeb.CustomTappIframe = OriginalIframe;
        }

        if (window.ChaynsInfo.IsFacebook) {
            $(window).unbind('mousewheel DOMMouseScroll');
        }
    };

    var AppendButtons = () => {
        var btnWrapper = $('<div></div>');
        btnWrapper.addClass('btnWrapper');

        function addButton(i) {
            var btn;

            if (Buttons[i].Icon) {
                btn = $(`<div>${removeTags(Buttons[i].Text)}</div>`);
                var rgba = window.ChaynsWeb.ConvertArgbHexToRgba(Buttons[i].Icon.color);
                if (rgba == null) {
                    rgba = {};
                    rgba.r = 255;
                    rgba.g = 255;
                    rgba.b = 255;
                    rgba.a = 1;
                }
                btn.prepend($(`<span style="font-size:${Buttons[i].Icon.size}px; color: rgba(${rgba.r},${rgba.g},${rgba.b},${rgba.a});" class="icon fa ${Buttons[i].Icon.name}"></span>)`));
            } else {
                btn = $('<div></div>');
                btn.html(removeTags(Buttons[i].Text));
            }

            btn.click(function () {
                PreClose();
                //noinspection Eslint
                if (is.existy(Buttons[i]) && Buttons[i].Value !== null && Buttons[i].Value !== undefined) {
                    ExecuteCallback(Buttons[i].Value);
                }
                Close();
            });
            btn.addClass('chaynsBtn').addClass('wide');
            return btn;
        }

        if (Buttons.length === 0 && (Selection !== 0 || (Type !== 'selection' || Type !== 'facebook')) && Type !== 'iframe') {
            var btn = {
                Text: 'OK',
                Value: 1
            };
            Buttons.push(btn);
        }

        for (var i = 0; i < Buttons.length; i++) {
            btnWrapper.append(addButton(i));
            if (i === 1) {
                break;
            }
        }

        if (Type === 'iframe') {
            var closeBtn = $('<span id="dlgCloser">');
            closeBtn.addClass('fa fa-times');
            closeBtn.click(Close);
            btnWrapper.append(closeBtn);
        }
        Dlg.append(btnWrapper);
    };

    var GenerateItemList = () => {
        var list = $('<div>');
        list.addClass('dialogItemList');
        list.scroll(function () {
            var lh = $(this).height();
            var scroll = $(this).scrollTop();
            //noinspection JSUnresolvedVariable
            if (this.scrollHeight - (lh + scroll) < 150) {
                GetItems();
            }
        });
        return list;
    };

    var GetItems = () => {
        if (Index === Infinity) {
            Index = 0;
            ItemSpace = 10;
        }
        var list = $('.dialogItemList');
        if (Index === 0) {
            list.find('.dialogItem').each(function () {
                $(this).remove();
            });
            DisplayItems = [];
        }

        function itemClick() {
            var sel = $(this).data('selected') !== 1;
            switch (Selection) {
                case 2:
                    break;
                case 0:
                    for (var i = 0; i < Items.length; i++) {
                        Items[i].Preselect = false;
                    }
                    $('.dialogItem').removeClass('ChaynsCS-BgColor-20Pcnt').data('selected', 0);
                    $(this).toggleClass('ChaynsCS-BgColor-20Pcnt');
                    Items[$(this).data('id')].Preselect = 1;
                    PreClose();
                    ExecuteCallback(1);
                    Close();
                    break;
                default:
                    $(this).toggleClass('ChaynsCS-BgColor-20Pcnt');
                    $(this).data('selected', sel ? 1 : 0);
                    Items[$(this).data('id')].Preselect = sel;
                    break;
            }
        }

        var tmp;
        if (Query !== '' && Query !== null) {
            var searchString = Query;
            tmp = Items.filter(function (item) {
                return item.Text != null && item.Text.toLowerCase().indexOf(searchString) > -1;
            });
            tmp = tmp.slice(Index, Index + ItemSpace);
        } else {
            tmp = Items.slice(Index, Index + ItemSpace);
        }

        DisplayItems = DisplayItems.concat(tmp);
        tmp.forEach(function (item) {
            var elem = $('<div>');
            elem.data('value', item.Value);
            elem.data('id', item.Id);
            elem.data('selected', item.Preselect ? 1 : 0);

            if (item.Preselect) {
                elem.addClass('ChaynsCS-BgColor-20Pcnt');
            }

            var div = $('<div>');
            div.html('<span>' + item.Text + '</span>');

            if (Overflow !== 0 && Overflow !== undefined) {
                div.prop('title', div.find('span').first().text());
            }

            div.appendTo(elem);
            elem.addClass('ChaynsCS-Border-30Pcnt');
            elem.addClass('dialogItem');
            if (typeof item.Image === 'string') {
                //noinspection JSUnusedLocalSymbols,Eslint
                var withImg = true;
                var img = $('<img>');
                div = $('<div>');
                div.addClass('itemImg');
                img.attr('src', item.Image);
                img.prependTo(div);
                div.prependTo(elem);
            } else if (item.Icon) {
                const rgba = window.ChaynsWeb.ConvertArgbHexToRgba(item.Icon.color);
                var icon = $(rgba == null ? `<span style="font-size:20px; width:25px;" class="ChaynsCS-Color fa ${item.Icon.name}"></span>` : `<span style="color: rgba(${rgba.r},${rgba.g},${rgba.b},${rgba.a}); font-size:20px; width:25px;" class="fa ${item.Icon.name}"></span>`);

                elem.prepend(icon);
            }
            elem.click(itemClick);
            elem.appendTo(list);
        });
        if (list.find('img').length > 0) {
            list.find('.dialogItem').each(function () {
                $(this).addClass('withImg');
            });
        }
        Index = Index + ItemSpace;
    };

    var GenerateQuickfind = () => {
        var elem = $('<input>');
        elem.addClass('dialogQuickfind').addClass('ChaynsCS-Color');
        elem.attr('placeholder', 'Suchen');
        elem.html('Suchen');

        function Quicksearch(val) {
            Query = val.toLowerCase();
            Index = 0;
            GetItems();
        }

        elem.on('search', function () {
            Quicksearch($(this).val());
        }).on('keyup', function () {
            Quicksearch($(this).val());
        });
        return elem;
    };

    var GenerateFacebookItems = () => {
        var createList = function () {
            Items = [];
            var apiString = DisplayMe ? 'v2.3/me?fields=id,gender,first_name,last_name,friends.limit(5000){first_name,last_name,gender}' : 'v2.3/me/friends?fields=gender,first_name,last_name&limit=5000';
            //noinspection Eslint,JSCheckFunctionSignatures
            window.TFB.api(apiString, 'get', {
                access_token: window.Facebook.accessToken
            }, function (res) {
                if (DisplayMe) {
                    if (res.friends === undefined) {
                        res.friends = {
                            data: []
                        };
                    }
                    //noinspection Eslint
                    res.friends.data.unshift({
                        id: res.id,
                        gender: res.gender,
                        first_name: res.first_name,
                        last_name: res.last_name
                    });
                }
                var data = DisplayMe ? res.friends.data : res.data;
                for (var i = 0; i < data.length; i++) {
                    var item = {};
                    item.Text = `${data[i].first_name} ${data[i].last_name}`;
                    item.Image = `https://graph.facebook.com/${data[i].id}/picture`;
                    item.Id = i;
                    item.FacebookObject = data[i];
                    if (FacebookIds.indexOf(data[i].id) > -1) {
                        item.Preselect = true;
                    }
                    Items.push(item);
                }
                GetItems();
            });
        };
        window.TFB.getPermissions(function () {
            if (window.TFB.checkPermissions('user_friends')) {
                createList();
            } else {
                if (!window.TFB.checkPermissionDeclined('user_friends')) {
                    //noinspection JSUnresolvedVariable,JSUnresolvedFunction
                    new Dialog({
                        Text: window.LangRes.Get('txt_chayns_friends_permission_hint').replace(/##LocationName##/, window.ChaynsInfo.LocationName),
                        Callback: function () {
                            //noinspection JSCheckFunctionSignatures
                            window.TFB.askForPermissions('user_friends', createList);
                        }
                    });
                } else {
                    //noinspection JSUnresolvedFunction,JSUnresolvedVariable
                    new Dialog({
                        Text: window.LangRes.Get('txt_chayns_friends_permission_hint_reask'),
                        Callback: function () {
                            //noinspection JSCheckFunctionSignatures
                            window.TFB.askForPermissions('user_friends', createList, true);
                        }
                    });
                }
            }
        });
    };

    var InitDays = tmp => {
        var tmp1 = tmp.splice(0, 7);
        var tmp2 = tmp1.splice(0, 1);
        tmp1.push(tmp2[0]);
        window.DayNames = tmp1.concat(tmp);
        tmp = window.DayNames.splice(7, 1);
        window.DayNames.push(tmp[0]);
    };

    var GenerateDatePicker = () => {
        Buttons = [{
            Text: 'Ok',
            Value: 1
        }, {
            Text: 'Abbrechen',
            Value: 0
        }];

        switch (TimeMode) {
            case 1:
                return selectDate(1);
            case 2:
                return selectTime();
            case 3:
                return selectDate(3);
            default:
                return selectDate();
        }

        function selectDate(TimeMode) {
            //noinspection JSUnresolvedVariable,JSUnresolvedFunction
            InitDays(window.LangRes.Get('txt_default_days_array').split(','));
            //noinspection JSUnresolvedVariable,JSUnresolvedFunction
            window.MonthNames = window.LangRes.Get('txt_default_months_array').split(',');

            if (MinTimestamp > 0) {
                if (window.MinDate.getMonth() > window.CurrDate.getMonth() && parseInt(window.MinDate.getFullYear(), 10) > parseInt(window.CurrDate.getFullYear(), 10)) {
                    window.CurrDate = window.MinDate;
                }
            }

            if (window.PreSelectedDate) {
                window.CurrDate = new Date(window.PreSelectedDate);
            }

            var dateDialog = $('<div id="datePickOuter"></div>');
            var dateHeader = $('<div id="dateHeader" class="ChaynsCS-BgColor"></div>');
            dateHeader.append($(`<div id="currentYear">${window.CurrDate.getFullYear()}</div>`));
            dateHeader.append($(`<div id="selectedDate">${selectedDate()}</div>`));
            dateDialog.append(dateHeader);

            var monthPicker = $('<div id="monthPicker" class="hiddenElement"></div>');
            monthPicker.append($(`<div class="tableCaption"><div style="padding-left:20px; padding-right:20px;"><span onclick="DatePicker.changeYear(1)" id="yearLeft" class="fa fa-angle-left arrowLeft ChaynsCS-Color"></span><span onclick="DatePicker.changeYear(2)" class="fa fa-angle-right arrowRight ChaynsCS-Color" id="yearRight"></span><div style="background-color:white;"><span id="year" onclick="window.DatePicker.hideElement($(monthPicker).attr('id'))">${window.CurrDate.getFullYear()}</span></div></div></div>`));

            var monthRows = '';
            for (let i = 0; i < 12;) {
                monthRows += '<div class="monthRow"><div style="display:table-cell;"><span class="monthCell"">' + window.MonthNames[i] + '</span></div><div  style="display:table-cell;"><span class="monthCell">' + window.MonthNames[i + 1] + '</span></div><div style="display:table-cell;"><span class="monthCell">' + window.MonthNames[i + 2] +
                    '</span></div></div>';
                i = i + 3;
            }
            monthPicker.append($(monthRows));
            dateDialog.append(monthPicker);

            $('body').on('click', '.monthCell', function () {
                window.DatePicker.monthPicked(this);
            });

            var visibilityRight = '', visibilityLeft = '';

            if (window.CurrDate.getMonth() === window.MaxDate.getMonth() && window.CurrDate.getFullYear() === window.MaxDate.getFullYear()) {
                visibilityRight = 'hiddenElement';
            }
            if (window.CurrDate.getMonth() === window.MinDate.getMonth() && window.CurrDate.getFullYear() === window.MinDate.getFullYear()) {
                visibilityLeft = 'hiddenElement';
            }

            var selectMonth = $(`<div id="selectMonth"><div><span id="monthLeft" onclick="window.DatePicker.changeMonth(1)" class="fa fa-angle-left ChaynsCS-Color arrowLeft ${visibilityLeft}" ></span><span id="monthRight" onclick="DatePicker.changeMonth(2)" class="fa fa-angle-right arrowRight ${visibilityRight} ChaynsCS-Color"></span><div><span id="month" onclick="window.DatePicker.pickMonth()">${GetMonth()}</span></div></div></div>`);

            var dayTable = $('<div id="dayTable"></div>');
            dayTable.append(selectMonth);
            var dayString = '<div id="dayNames">';

            for (var n = 0; n < 7; n++) {
                dayString = `${dayString}<div class="dayName ChaynsCS-Color">${window.DayNames[n]}</div>`;
            }

            dayTable.append($(dayString));

            for (var k = 0; k < 6; k++) {
                dayTable.append($('<div class="dayRow"></div>'));
            }

            var i = 0;

            for (var m = 2; m < 8; m++) {
                for (var l = 0; l < 7; l++) {
                    i++;
                    $(dayTable.children()[m]).append(getDay(i));
                }
            }

            dateDialog.append(dayTable);
            dateDialog.append($('<input id="dlgDate" type="datetime">'));

            FinalFunctions.push(function () {
                if (window.PreSelectedDate) {
                    $('#dlgDate').val(window.PreSelectedDate.getTime());
                }
            });

            /**
             * @return {string}
             */
            function GetMonth() {
                var date = window.CurrDate;
                var year = date.getFullYear();
                var month = date.getMonth();
                return `${window.MonthNames[month + 12]} ${year}`;
            }

            function selectedDate() {
                if (window.PreSelectedDate) {
                    return window.DayNames[window.PreSelectedDate.getDay() + 6] + ', ' + window.PreSelectedDate.getDate() + '. ' + window.MonthNames[window.PreSelectedDate.getMonth() + 12];
                }

                return window.DayNames[window.CurrDate.getDay() + 6] + ', ' + window.CurrDate.getDate() + '. ' + window.MonthNames[window.CurrDate.getMonth() + 12];
            }

            function getDay(position) {
                var retVal;
                var startCurrMonth;
                var endCurrMonth = new Date(window.CurrDate.getFullYear(), window.CurrDate.getMonth() + 1, 0).getDate();
                var startDay = new Date(window.CurrDate.getFullYear(), window.CurrDate.getMonth(), 1).getDay();
                var prevDate = new Date(window.CurrDate.getFullYear(), window.CurrDate.getMonth() - 1);
                var endPrevMonth = new Date(prevDate.getFullYear(), prevDate.getMonth() + 1, 0).getDate();
                var nextDate = new Date(window.CurrDate.getFullYear(), window.CurrDate.getMonth() + 1);
                var createdDate;
                switch (startDay) {
                    case 0:
                        startCurrMonth = 7;
                        break;
                    default:
                        startCurrMonth = startDay;
                }

                if (position < startCurrMonth) {
                    createdDate = new Date(prevDate.setDate(endPrevMonth - startCurrMonth + 1 + position)).setHours(5, 5, 5, 5);
                    retVal = $('<div onclick="DatePicker.getSelectedDate(this)" class="greyDayCell" data-date="' + createdDate + '">' + (endPrevMonth - startCurrMonth + 1 + position) + '</div>');
                } else if (position >= startCurrMonth && position - startCurrMonth < endCurrMonth) {
                    if (new Date(window.CurrDate.setDate(position + 1 - startCurrMonth)).getDate() === new Date().getDate()) {
                        createdDate = new Date(window.CurrDate.setDate(position + 1 - startCurrMonth)).setHours(5, 5, 5, 5);
                        retVal = $('<div onclick="DatePicker.getSelectedDate(this)" class="dayCell ChaynsCS-Color" data-date="' + createdDate + '">' + (position + 1 - startCurrMonth) + '</div>');
                    } else {
                        createdDate = new Date(window.CurrDate.setDate(position + 1 - startCurrMonth)).setHours(5, 5, 5, 5);
                        retVal = $('<div onclick="DatePicker.getSelectedDate(this)" class="dayCell" data-date="' + createdDate + '">' + (position + 1 - startCurrMonth) + '</div>');
                    }
                } else {
                    createdDate = new Date(nextDate.setDate(position - startCurrMonth + 1 - endCurrMonth)).setHours(5, 5, 5, 5);
                    retVal = $('<div onclick="DatePicker.getSelectedDate(this)" class="greyDayCell" data-date="' + createdDate + '">' + (position - startCurrMonth + 1 - endCurrMonth) + '</div>');
                }
                if (window.PreSelectedDate) {
                    if (new Date(parseInt($(retVal).attr('data-date'), 10)).toDateString() === window.PreSelectedDate.toDateString()) {
                        $(retVal).addClass('selected ChaynsCS-BgColor');
                    }
                }
                createdDate = new Date(parseInt($(retVal).attr('data-date'), 10));
                if (createdDate.getFullYear() === window.MaxDate.getFullYear() && createdDate.getMonth() === window.MaxDate.getMonth() && window.MaxDate.getDate() < createdDate.getDate() || window.MaxDate.getMonth() < createdDate.getMonth() && window.MaxDate.getFullYear() === createdDate.getFullYear()) {
                    $(retVal).addClass('disabledDate');
                }
                if (createdDate.getFullYear() === window.MinDate.getFullYear() && createdDate.getMonth() === window.MinDate.getMonth() && window.MinDate.getDate() > createdDate.getDate() || window.MinDate.getMonth() > createdDate.getMonth() && window.MinDate.getFullYear() === createdDate.getFullYear()) {
                    $(retVal).addClass('disabledDate');
                }
                return retVal;
            }

            if (TimeMode === 3) {
                dateDialog.append(window.DatePicker.buildTimePicker);
            }
            return dateDialog;
        }

        function selectTime() {
            var currTime = new Date();
            var $timeDialog = window.DatePicker.buildTimePicker();
            $timeDialog.append($('<input id="dlgDate" type="datetime">'));

            FinalFunctions.push(() => {
                $('.dialogBody').css('width', '300px');
                $('#dlgDate').val(currTime.getTime());
            });

            return $timeDialog;
        }
    };

    var GenerateForm = () => {
        var form = $('<div>');
        form.addClass('dialogForm');
        for (var i = 0; i < Form.length; i++) {
            var formItem = Form[i];
            var elem = $('<div>');
            elem.addClass('dialogFormItem');
            elem.html(formItem.Text);
            var item;

            switch (formItem.Type) {
                case 'text':
                    item = $('<input>');
                    item.prop('type', 'text');
                    item.prop('value', formItem.Value);
                    item.data('id', formItem.Id);
                    item.data('index', i);
                    break;
                default:
                    break;
            }
            item.addClass('ChaynsCS-Color');

            item.on('change', function () {
                Form[$(this).data('index')].Value = $(this).val();
            });

            elem.append(item);
            form.append(elem);
        }
        return form;
    };

    var GenerateInput = () => {
        var form = $('<div>');
        var input = $('<textarea>');

        input.prop('type', 'text');
        input.prop('placeholder', json.Placeholder);
        input.width('90%');
        input.css('margin-bottom', '20px');
        input.addClass('input');
        input.attr('id', 'dlgInput');
        input.attr('autogrow', 'true');

        form.append(input);

        return form;
    };

    var GenerateIframe = function () {
        UseFullHeight = true;
        var frame = $('<iframe id="DialogIframe">');
        frame.attr('src', IframeSource);
        OriginalIframe = window.ChaynsWeb.CustomTappIframe;
        window.ChaynsWeb.CustomTappIframe = frame;
        return frame;
    };

    var ExecuteCallback = val => {
        if (navigator.userAgent.indexOf('Edge') > -1) {
            if (!window.ChaynsInfo.IsMobile && !window.ChaynsInfo.IsFacebook) {
                jQuery.scrollSpeed(100, 800);
            }
        }
        if (Callback !== null && Callback !== undefined) {
            var ret = 0;
            if (val > 0) {
                switch (Type) {
                    case 'selection':
                        if (Selection === 2) {
                            ret = val;
                        } else {
                            ret = Items.filter(function (x) {
                                return x.Preselect;
                            });

                            if (ret === null || ret.length === 0 || ret === undefined) {
                                if ($($('.chaynsBtn')[1]).text() === 'OK') {
                                    ret = Items[0];
                                } else {
                                    ret = val;
                                }

                            }
                        }
                        break;
                    case 'hint':
                        ret = val;
                        break;
                    case 'facebook':
                        ret = Items.filter(function (x) {
                            return x.Preselect && x.FacebookObject;
                        });
                        break;
                    case 'form':
                        ret = Form.map(function (item) {
                            return {Id: item.Id, Value: item.Value};
                        });

                        break;
                    case 'datepicker':
                        var d = new Date(parseInt($('#dlgDate').val(), 10));
                        if (TimeMode === 1) {
                            d.setHours(0, 0, 0);
                        }
                        ret = Math.floor(d.getTime() / 1000);
                        break;
                    default:
                        break;
                }
            } else {
                val = Type === 'datepicker' ? -1 : val; //Nur für Datepicker, damit das gleich ist mit den Apps
                ret = val;
            }
            if (Selection === 0 && ret.length > 0 && (Type === 'selection' || Type === 'facebook')) {
                ret = ret[0]; //Nur Objekt zurückgeben
            } else if (Type === 'input') {
                ret = {
                    buttonType: val
                };

                if (val >= 0) {
                    //noinspection JSPrimitiveTypeWrapperUsage
                    ret.text = $('#dlgInput').val() || '';
                }
            }
            if (typeof Callback === 'string') {
                window.CustomTappCommunication.PostMessage(Callback, JSON.stringify(ret), SrcIframe);
            } else if (typeof Callback === 'function' && val !== 0) {
                Callback(ret);
            }
        }
    };

    if (BackgroundLayer) {
        BackgroundLayer.fadeIn();
    }

    window.Navigation.DestroyNavScroll();

    if (Headline !== null && Headline !== '' && Headline !== undefined) {
        var caption = $('<div>');
        caption.html('<h1>' + Headline + '</h1>');
        Dlg.prepend(caption);
    }

    if (Text !== null && Text !== '' && Text !== undefined) {
        var description = $('<div>');
        description.addClass('dialogDescription');
        description.html(Text);
        Dlg.append(description);
    }

    var content = $('<div>');
    content.addClass('dialogContentWrapper');

    if (Type !== 'hint') {
        for (var i = 0; i < Items.length; i++) {
            Items[i].Id = i;
        }
        switch (Type) {
            case 'selection':
                content.html(GenerateItemList());
                break;
            case 'facebook':
                GenerateFacebookItems();
                content.html(GenerateItemList());
                break;
            case 'datepicker':
                content.html(GenerateDatePicker());
                Dlg.addClass('dialogBody--date');
                break;
            case 'form':
                if (Form === null || Form === undefined) {
                    content.html('[Missing Form-Data]');
                } else {
                    content.html(GenerateForm());
                }
                break;
            case 'input':
                content.html(GenerateInput());
                break;
            case 'iframe':
                if (IframeSource === null || IframeSource === undefined) {
                    content.html('[Missing Source]');
                } else {
                    content.html(GenerateIframe());
                }
                break;
            case 'wait':
                Dlg.append($('<div align="center"><img src="' + Waitcursor + '"></div>'));
                break;
            default:
                break;
        }
        if (Quickfind) {
            content.prepend(GenerateQuickfind());
        }
    }

    Dlg.append(content);

    if (Type !== 'wait') {
        AppendButtons();
    }

    BackgroundLayer.append(Dlg);
    GetItems();

    Dlg.fadeIn(function () {
        if (document.activeElement && typeof document.activeElement.blur === 'function') {
            document.activeElement.blur();
        }
        if (Quickfind) {
            Dlg.find('.dialogQuickfind').select();
            Dlg.find('.dialogQuickfind').blur();
        }
        if (Type === 'form') {
            Dlg.find('input').first().focus();
        } else if (Type === 'hint' && Buttons.length === 1) {
            $(window).focus();
            $(window).keyup(function (event) {
                if (event.which === 13) {
                    Close();
                }
            });
        }
    });

    for (var j = 0; j < FinalFunctions.length; j++) {
        if (typeof FinalFunctions[j] === 'function') {
            FinalFunctions[j]();
        }
    }

    $('.up').on('click', function () {
        window.DatePicker.increaseTime(this);
    });

    $('.down').on('click', function () {
        window.DatePicker.increaseTime(this);
    });
}

(function (module, window, $) {

    module.getSelectedTime = () => {
        var $pickerHours = $('#picker__hours');
        var $pickerMinutes = $('#picker__minutes');
        var $dlgDate = $('#dlgDate');

        if (isNaN(parseInt($dlgDate.val(), 10))) {
            $dlgDate.val(new Date().getTime());
        }

        var selectedTime = new Date(parseInt($dlgDate.val(), 10));
        var hours = parseInt($pickerHours.val(), 10);
        var minutes = parseInt($pickerMinutes.val(), 10);
        var minDate = new Date(window.MinDate);
        minDate.setSeconds(0);
        minDate = minDate.getTime();
        var maxDate = new Date(window.MaxDate);
        maxDate.setSeconds(59);
        maxDate = maxDate.getTime();
        selectedTime.setHours(hours, minutes, 0);

        if (window.MinDate.getTime() > selectedTime.getTime()) {
            window.alert('Ein früherer Zeitpunkt ist für diesen Tag nicht verfügbar!');
            window.MinDate = new Date(minDate);
            window.MaxDate = new Date(maxDate);

            if (window.MinDate.getHours() < 10) {
                $pickerHours.val(`0${window.MinDate.getHours()}`);
            } else {
                $pickerHours.val(window.MinDate.getHours());
            }

            if (window.MinDate.getMinutes() < 10) {
                $pickerMinutes.val(`0${window.MinDate.getMinutes()}`);
            } else {
                $pickerMinutes.val(window.MinDate.getMinutes());
            }

            window.PreSelectedTime = window.MinDate.getTime();
            $dlgDate.val(window.MinDate.getTime());
        } else if (window.MaxDate.getTime() < selectedTime.getTime()) {
            window.alert('Ein späterer Zeitpunkt ist für diesen Tag nicht verfügbar!');
            window.MinDate = new Date(minDate);
            window.MaxDate = new Date(maxDate);

            if (window.MaxDate.getHours() < 10) {
                $pickerHours.val(`0${window.MaxDate.getHours()}`);
            } else {
                $pickerHours.val(window.MaxDate.getHours());
            }

            if (window.MaxDate.getMinutes() < 10) {
                $pickerMinutes.val(`0${window.MaxDate.getMinutes()}`);
            } else {
                $pickerMinutes.val(window.MaxDate.getMinutes());
            }
            window.PreSelectedTime = window.MaxDate.getTime();
            $dlgDate.val(window.MaxDate.getTime());
        } else {
            window.PreSelectedTime = selectedTime.getTime();
            $dlgDate.val(selectedTime.getTime());
        }
    };

    module.buildTimePicker = function () {
        var currTime = new Date();
        var hours, minutes;

        if (window.PreSelectedTime) {
            hours = new Date(window.PreSelectedTime).getHours();
            minutes = new Date(window.PreSelectedTime).getMinutes();
        } else {
            hours = currTime.getHours();
            minutes = currTime.getMinutes();
        }

        if (hours < 10) {
            hours = `0${hours}`;
        }
        if (minutes < 10) {
            minutes = `0${minutes}`;
        }

        var timeDialog = $('<div id="timePicker"></div>');

        timeDialog.append($('<div class="table" style="margin: 0 auto;">' +
            '<div class="table__row">' +
            '<div class="table__cell hours"><i class="fa fa-angle-up arrow up"></i></div>' +
            '<div class="table__cell"></div>' +
            '<div class="table__cell"><i class="fa fa-angle-up arrow up"></i></div>' +
            '</div>' +
            '<div class="table__row">' +
            '<div class="table__cell table-width">' +
            '<div class="timepicker__hours">' +
            '<input type="text" id="picker__hours" value="' + hours + '" onchange="window.DatePicker.checkTimeValue()" class="timepicker__hours" />' +
            '</div>' +
            '</div>' +
            '<div class="table__cell" style="width: 10px !important;">' +
            '<div class="timepicker__seperator">:</div>' +
            '</div>' +
            '<div class="table__cell table-width">' +
            '<div class="timepicker__minutes">' +
            '<input type="text" id="picker__minutes" onchange="window.DatePicker.checkTimeValue()" value="' + minutes + '" class="timepicker__minutes" />' +
            '</div>' +
            '</div>' +
            '</div>' +
            '<div class="table__row">' +
            '<div class="table__cell hours"><i class="fa fa-angle-down arrow down"></i></div>' +
            '<div class="table__cell"></div>' +
            '<div class="table__cell"><i class="fa fa-angle-down arrow down"></i></div>' +
            '</div>' +
            '</div>'));
        $(document).on('change', '.timeInput', function () {
            window.DatePicker.getSelectedTime();
        });
        return timeDialog;
    };

    module.checkTimeValue = () => {
        var $pickerHours = $('#picker__hours');
        var $pickerMinutes = $('#picker__minutes');
        var currHours = parseInt($pickerHours.val(), 10);
        var currMinutes = parseInt($pickerMinutes.val(), 10);

        if (isNaN(currHours) || currHours < 0 || currHours > 23) {
            currHours = '00';
        } else if (currHours < 10) {
            currHours = `0${currHours}`;
        }

        if (isNaN(currMinutes) || currMinutes < 0 || currMinutes > 59) {
            currMinutes = '00';
        } else if (currMinutes < 10) {
            currMinutes = `0${currMinutes}`;
        }

        $pickerHours.val(currHours);
        $pickerMinutes.val(currMinutes);
        window.DatePicker.getSelectedTime();
    };

    module.increaseTime = elem => {
        var $pickerHours = $('#picker__hours');
        var $pickerMinutes = $('#picker__minutes');
        var $button = $(elem);
        var currHours = parseInt($pickerHours.val(), 10);
        var currMinutes = parseInt($pickerMinutes.val(), 10);

        if ($button.parent().hasClass('hours')) {
            if ($button.hasClass('up')) {
                currHours++;

                if (currHours < 10) {
                    currHours = `0${currHours}`;
                } else if (currHours === 24) {
                    currHours = '00';
                }

                $pickerHours.val(currHours);
            } else {
                currHours--;

                if (currHours < 10 && currHours > 0) {
                    currHours = `0${currHours}`;
                } else if (currHours === 0) {
                    currHours = '00';
                } else if (currHours < 0) {
                    currHours = 23;
                }

                $pickerHours.val(currHours);
            }
        } else {
            if ($button.hasClass('up')) {
                currMinutes++;

                if (currMinutes < 10 && currMinutes > 0) {
                    currMinutes = '0' + currMinutes;
                } else if (currMinutes === 60) {
                    currMinutes = '00';
                    currHours++;
                    if (currHours === 24) {
                        currHours = '00';
                    } else if (currHours < 10) {
                        currHours = `0${currHours}`;
                    }
                    $pickerHours.val(currHours);
                }

                $pickerMinutes.val(currMinutes);
            } else {
                currMinutes--;
                if (currMinutes < 10 && currMinutes > 0) {
                    currMinutes = '0' + currMinutes;
                } else if (currMinutes === 0) {
                    currMinutes = '00';
                } else if (currMinutes < 0) {
                    currMinutes = 59;
                    currHours--;

                    if (currHours < 0) {
                        currHours = 23;
                    } else if (currHours < 10) {
                        currHours = `0${currHours}`;
                    }
                    $pickerHours.val(currHours);
                }
                $pickerMinutes.val(currMinutes);
            }
        }
        window.DatePicker.getSelectedTime();
    };

    module.getSelectedDate = element => {
        if (!$(element).hasClass('disabledDate')) {
            var selectedTimestamp = parseInt($(element).attr('data-date'), 10);
            var date = new Date(selectedTimestamp);

            if (TimeMode === 3) {
                selectedTimestamp = date.setHours(parseInt($('#picker__hours').val(), 10), parseInt($('#picker__minutes').val(), 10));
            }

            $('.selected').removeClass('selected ChaynsCS-BgColor');

            if (window.PreSelectedElement && new Date(parseInt($(window.PreSelectedElement).attr('data-date'), 10)).toDateString() === new Date().toDateString()) {
                $(window.PreSelectedElement).addClass('ChaynsCS-Color');
            }

            $(element).addClass('ChaynsCS-BgColor selected');
            $('#currentYear').html(date.getFullYear());

            if (date.getDay() === 0) {
                $('#selectedDate').html(`${window.DayNames[date.getDay() + 13]}, ${date.getDate()}. ${window.MonthNames[date.getMonth() + 12]}`);
            } else {
                $('#selectedDate').html(`${window.DayNames[date.getDay() + 6]}, ${date.getDate()}. ${window.MonthNames[date.getMonth() + 12]}`);
            }

            $('#dlgDate').val(selectedTimestamp);
            window.PreSelectedDate = date;
            window.PreSelectedElement = element;

            if ($(element).hasClass('greyDayCell')) {
                if (date.getMonth() < window.CurrDate.getMonth() && date.getFullYear() <= window.CurrDate.getFullYear() || date.getMonth() > window.CurrDate.getMonth() && date.getFullYear() < window.CurrDate.getFullYear()) {
                    window.DatePicker.changeMonth(1);
                } else {
                    window.DatePicker.changeMonth(2);
                }
                markSelectedDate();
            }
        }
    };

    module.changeMonth = direction => {
        var nextDate;
        window.CurrDate.setDate(10);
        $('.selected').removeClass('selected ChaynsCS-BgColor');

        if (direction === 1) {
            window.CurrDate.setMonth(window.CurrDate.getMonth() - 1);
            nextDate = new Date(window.CurrDate.getFullYear(), window.CurrDate.getMonth(), 1);
        } else if (direction === 2) {
            window.CurrDate.setMonth(window.CurrDate.getMonth() + 1);
            nextDate = new Date(window.CurrDate.getFullYear(), window.CurrDate.getMonth(), 1);
        }

        $('#month').html(`${window.MonthNames[nextDate.getMonth() + 12]} ${nextDate.getFullYear()}`);
        window.DatePicker.updateDays();

        if (window.PreSelectedDate) {
            markSelectedDate();
        }

        $('#year').html(window.CurrDate.getFullYear());
        toogleMonthChange();
    };

    module.updateDays = () => {
        var $greyDayCell = $('.greyDayCell');
        $greyDayCell.addClass('dayCell');
        $greyDayCell.removeClass('greyDayCell');

        var dayCells = $('.dayCell').toArray();
        var dateForValue = new Date(Date.UTC(window.CurrDate.getFullYear(), window.CurrDate.getMonth(), 1));
        var prevDate = new Date(Date.UTC(dateForValue.getFullYear(), dateForValue.getMonth(), 0));
        var nextDate = new Date(Date.UTC(dateForValue.getFullYear(), dateForValue.getMonth() + 1, 1));
        var startPosition = dateForValue.getDay() - 1;

        if (startPosition === -1) {
            startPosition = 6;
        }
        var endPosition = new Date(window.CurrDate.getFullYear(), window.CurrDate.getMonth() + 1, 0).getDate();
        prevDate.setDate(prevDate.getDate() - startPosition);

        for (var i = 0; i < dayCells.length; i++) {
            if (i < startPosition) {
                prevDate.setDate(prevDate.getDate() + 1);
                $(dayCells[i]).attr('data-date', new Date(prevDate.getFullYear(), prevDate.getMonth(), prevDate.getDate() + 1, -3).getTime());
                $(dayCells[i]).addClass('greyDayCell');
                $(dayCells[i]).html(prevDate.getDate());
            } else if (i - startPosition >= endPosition) {
                $(dayCells[i]).attr('data-date', new Date(nextDate.getFullYear(), nextDate.getMonth(), nextDate.getDate() + 1, -3).getTime());
                $(dayCells[i]).html(nextDate.getDate());
                nextDate.setDate(nextDate.getDate() + 1);
                $(dayCells[i]).addClass('greyDayCell');
            } else {
                $(dayCells[i]).attr('data-date', new Date(dateForValue.getFullYear(), dateForValue.getMonth(), dateForValue.getDate() + 1, -3).getTime());
                $(dayCells[i]).removeClass('greyDayCell');

                if (dateForValue.getDate() === new Date().getDate() && dateForValue.getMonth() === new Date().getMonth() && dateForValue.getFullYear() === new Date().getFullYear()) {
                    $(dayCells[i]).addClass('ChaynsCS-Color');
                }

                $(dayCells[i]).html(dateForValue.getDate());
                dateForValue.setDate(dateForValue.getDate() + 1);
            }

            var createdDate = new Date(parseInt($(dayCells[i]).attr('data-date'), 10));
            createdDate.setHours(0, 0, 0, 0);

            if (createdDate.getTime() === new Date().setHours(0, 0, 0, 0)) {
                $(dayCells[i]).addClass('ChaynsCS-Color');
            } else {
                $(dayCells[i]).removeClass('ChaynsCS-Color');
            }

            if (createdDate < window.MinDate.setHours(0, 0, 0, 0) || createdDate > window.MaxDate.setHours(0, 0, 0, 0)) {
                $(dayCells[i]).addClass('disabledDate');
            } else {
                $(dayCells[i]).removeClass('disabledDate');
            }
        }
    };

    module.pickMonth = () => {
        window.CurrDate.setDate(1);

        if (window.CurrDate.getFullYear() === window.MaxDate.getFullYear()) {
            window.DatePicker.hideElement('#yearRight');
        } else {
            window.DatePicker.showElement('#yearRight');
        }

        if (window.CurrDate.getFullYear() === window.MinDate.getFullYear()) {
            window.DatePicker.hideElement('#yearLeft');
        } else {
            window.DatePicker.showElement('#yearLeft');
        }

        $('#year').html(window.CurrDate.getFullYear());
        toggleMonthCells();
        $('#timePicker').css('display', 'none');
        window.DatePicker.showElement('#monthPicker');
    };

    module.monthPicked = element => {
        if (!$(element).hasClass('disabledDate')) {
            var monthName = $(element).html();
            var monthValue = window.MonthNames.indexOf(monthName);

            window.CurrDate.setMonth(monthValue);
            $('#month').html(`${window.MonthNames[window.CurrDate.getMonth() + 12]} ${window.CurrDate.getFullYear()}`);
            window.DatePicker.updateDays();

            var dayCells = $('.dayCell');

            if (window.PreSelectedDate) {
                for (var i = 0; i < dayCells.length; i++) {
                    if (new Date(parseInt($(dayCells[i]).attr('data-date'), 10)).setHours(0, 0, 0, 0) === window.PreSelectedDate.setHours(0, 0, 0, 0)) {
                        $(dayCells[i]).addClass('ChaynsCS-BgColor selected');
                    } else {
                        $(dayCells[i]).removeClass('ChaynsCS-BgColor selected');
                    }
                }
            }

            window.DatePicker.hideElement('#monthPicker');
            window.DatePicker.hideElement('#yearLeft');
            window.DatePicker.hideElement('#yearRight');
            $('#timePicker').css('display', '');
            toogleMonthChange();
        }
    };

    module.changeYear = direction => {
        if (direction === 1) {
            window.CurrDate.setFullYear(parseInt(window.CurrDate.getFullYear(), 10) - 1);
            $('#year').html(window.CurrDate.getFullYear());
        } else if (direction === 2) {
            window.CurrDate.setFullYear(parseInt(window.CurrDate.getFullYear(), 10) + 1);
            $('#year').html(window.CurrDate.getFullYear());
        }

        $('currentYear').html(window.CurrDate.getFullYear());

        if (window.CurrDate.getFullYear() >= window.MaxDate.getFullYear()) {
            window.DatePicker.hideElement('#yearRight');
        } else {
            window.DatePicker.showElement('#yearRight');
        }

        if (window.CurrDate.getFullYear() <= window.MinDate.getFullYear()) {
            window.DatePicker.hideElement('#yearLeft');
        } else {
            window.DatePicker.showElement('#yearLeft');
        }

        toggleMonthCells();
    };

    module.hideElement = elem => {
        $(elem).addClass('hiddenElement');

        if (elem.id === 'monthPicker') {
            $('#timePicker').css('display', '');
            $('#month').html(`${window.MonthNames[window.CurrDate.getMonth() + 12]} ${window.CurrDate.getFullYear()}`);

            if (window.CurrDate.getMonth() < window.MaxDate.getMonth() || window.CurrDate.getFullYear() < window.MaxDate.getFullYear()) {
                window.DatePicker.showElement('#monthRight');
            }

            if (window.CurrDate.getMonth() > window.MinDate.getMonth() || window.CurrDate.getFullYear() > window.MinDate.getFullYear()) {
                window.DatePicker.showElement('#monthLeft');
            }
        }
    };

    function toggleMonthCells() {
        var monthCells = $('.monthCell');
        var monthValue;
        for (var i = 0; i < 12; i++) {
            monthValue = window.MonthNames.indexOf($(monthCells[i]).html());

            if (monthValue > window.MaxDate.getMonth() && window.CurrDate.getFullYear() === window.MaxDate.getFullYear() || monthValue < window.MinDate.getMonth() && window.CurrDate.getFullYear() === window.MinDate.getFullYear()) {
                $(monthCells[i]).addClass('disabledDate');
            } else {
                $(monthCells[i]).removeClass('disabledDate');
            }
        }
    }

    function toogleMonthChange() {
        if (window.CurrDate.getMonth() === window.MaxDate.getMonth() && window.CurrDate.getFullYear() === window.MaxDate.getFullYear()) {
            window.DatePicker.hideElement('#monthRight');
        } else {
            window.DatePicker.showElement('#monthRight');
        }
        if (window.CurrDate.getMonth() === window.MinDate.getMonth() && window.CurrDate.getFullYear() === window.MinDate.getFullYear()) {
            window.DatePicker.hideElement('#monthLeft');
        } else {
            window.DatePicker.showElement('#monthLeft');
        }
    }

    module.showElement = elem => $(elem).removeClass('hiddenElement');

    function markSelectedDate() {
        var dayArray = $('.dayCell').toArray();
        for (var i = 0; i < 42; i++) {
            if (new Date(parseInt($(dayArray[i]).attr('data-date'), 10)).toDateString() === window.PreSelectedDate.toDateString()) {
                $(dayArray[i]).addClass('ChaynsCS-BgColor selected');
            }
        }
    }

})((window.DatePicker = {}), window, $);