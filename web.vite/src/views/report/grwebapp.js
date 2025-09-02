//變量 _grwebapp_url 指定WEB報表客户端安装程序的下載URL，當通過WebSocket通讯不成功時，提示用户用此URL下載程序進行安装。
//或用於自動更新WEB報表客户端時下載新版本，開發者應將 _grwebapp_url 改為自己服務器的URL，方便用户從可访問的WEB服務器下載
//變量 _grwebapp_version 指定自動更新時，客户端程序需要的版本號，如果小於此版本號，則自動進行更新
var _grwebapp_websocket = null,
    _grwebapp_url = "http://www.rubylong.cn/download/gridreport6-webapp.exe",
    _grwebapp_version = "6.8.3.0",
    webapp_onmessage ; //如果需要響應執行任務後的消息響應，應该寫一個名稱為 webapp_onmessage 的 function

function webapp_url_method_valid(url, method) {
    if (!method) {
        if (typeof url == "object") {
            method = url.method;
            url = url.url;
        }
        if (!method) {
            method = /.grf|.txt|.xml|.json/.test(url) ? "GET" : "POST";
        }
    }
    return method;
}

//此函數用於判斷一個變量是否為URL字符串，如果類型為字符串且首個非空白字符不為“<”與“{”即判定為URL
//如果參數是一個object對象，且其具有“url”屬性，則其是HTTPParam對象，是一個url參數
var webapp_is_url = function (p) {
    var index = 0,
        len = p.length,
        ch;

    //對象如果有url屬性，判定為url
    if (typeof p == "object") {
        return !!p.url;
    }

    if (typeof p != "string") {
        return 0;
    }

    //首先找到第一個非空白字符
    while (index < len) {
        ch = p[index];
        if (!/\s/g.test(ch))
            break;
        index++;
    }

    //如果不是xml或json文本串，則判定為url
    return (ch != "{") && (ch != "<") && (p.substr(index, 4) != "_WR_");
};

function webapp_ajax(method, url, callback, cbthis, params) {
    var xmlhttp = new XMLHttpRequest(),
        headers;

    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status > 0) {
            callback.call(cbthis, xmlhttp, xmlhttp.status == 200);
        }
    }

    xmlhttp.onerror = function () {
        callback.call(cbthis, xmlhttp, 0);
    }

    if (typeof url == "object") {
        headers = url.headers;
        if (typeof headers == "string") {
            headers = JSON.parse(headers)
        }

        if (!method) {
            method = url.method;
        }

        if (!params) {
            params = url.data;
        }

        url = url.url;
    }

    xmlhttp.open(webapp_url_method_valid(url, method), url, true); //異步請求數據

    if (headers && typeof headers == "object") {
        for (var key in headers) {
            xmlhttp.setRequestHeader(key, headers[key]);
        }
    }

    xmlhttp.send(params);  //POST 或 PUT 可以傳遞參數
}

/////////////////////////////////////////////////////////////////////////////
//創建啟動WEB報表客户端的URL协议參數
function _gr_up_href(args) {
    return "grwebapp://" + (args ? JSON.stringify(args) : "");
}

//通過URL协议啟動WEB報表客户端程序
//參數 appUpdate 指定是否自動更新WEB報表客户端程序，根據_grwebapp_version與已經安装的程序版本進行比较，按需進行自動升级
function webapp_urlprotocol_startup(appUpdate) {
    var arg = appUpdate ? {
        type: "update",
        url: _grwebapp_url,
        ver: _grwebapp_version
    } : 0;
    window.location.href = _gr_up_href(arg);
}

//如果WEB報表客户端程序未運行，先通過URL协议啟動WEB報表客户端程序
//通知WEB報表客户端程序根據模板與數據的URL，以及生成類型等相關參數進行報表生成，
function webapp_urlprotocol_run(args, report_url, data_url) {
    if (report_url) {
        args.report = report_url;
    }
    if (data_url) {
        args.data = data_url;
    }

    window.location.href = _gr_up_href(args);
}

/////////////////////////////////////////////////////////////////////////////
//检查WebSocket是否已經創建並通讯連接成功
function webapp_ws_check(slience) {
    if (!slience) {
        if (!_grwebapp_websocket) {
            alert("WebSocket没有創建，無法發送數據！");
        }
        else if (_grwebapp_websocket.readyState != 1) {
            alert("WebSocket正在連接中，暫不能發送數據！");
        }
    }
    return _grwebapp_websocket && (_grwebapp_websocket.readyState === 1);
}

//創建並通讯連接WebSocket
function webapp_ws_create(onopen) {
    //如果已經創建，且連接正常，則不要再次創建
    if (_grwebapp_websocket && _grwebapp_websocket.readyState === 1) {
        return;
    }

    //判斷當前瀏覽器是否支持WebSocket
    if ('WebSocket' in window) {
        _grwebapp_websocket = new WebSocket("ws://127.0.0.1:22333");

        //連接成功建立的回調方法
        if (onopen) {
            _grwebapp_websocket.onopen = function () {
                //alert("_grwebapp_websocket.onopen");
                onopen();
            }
        }
        debugger;
        //接收到消息的回調方法
        if (window.webapp_onmessage) {
            _grwebapp_websocket.onmessage = function (event) {
                window.webapp_onmessage(event);
            }
        }

        _grwebapp_websocket.onerror = function () {
            var children = document.body.children,
                childrenLen = children.length,
                referNode = childrenLen ? children[0] : null,
                newNode = document.createElement("h3");

            _grwebapp_websocket = null;

            //彈出alert提示信息，可修改為更适合的表述
            //alert("創建WebSocket失敗，可能是‘WEB報表客户端程序’在本機没有安装，或在報表網頁加載時没有調用‘webapp_urlprotocol_startup’函數進行啟動。");
            alert("創建WebSocket失敗，可能是WEB報表客户端程序没有啟動，或其在本機没有安装，請根據網頁頂部的提示進行相應的操作。");

            //在網頁最前面加上提示下載的文字，可修改為更适合的表述與界面形式
            //newNode.innerHTML = '特别提示：<a href="' + _grwebapp_url + '">點擊下載WEB報表客户端程序</a>，下載後双擊下載的文件進行安装，安装完成後重新打開當前網頁。';
            newNode.innerHTML = '特别提示：尝試<a href="javascript:webapp_urlprotocol_startup();">啟動WEB報表客户端程序</a>。或<a href="' + _grwebapp_url + '">點擊下載WEB報表客户端程序</a>，下載後双擊下載的文件進行安装，安装完成後重新打開當前網頁。';
            document.body.insertBefore(newNode, referNode);
        };

        //連接關閉的回調方法
        _grwebapp_websocket.onclose = function () {
            _grwebapp_websocket = null;
        }

        //感觉這部分可以不要
        //监听窗口關閉事件，當窗口關閉時，主動去關閉_grwebapp_websocket連接，防止連接還没斷開就關閉窗口，server端會抛異常。
        //window.onbeforeunload = function () {
        //    if (_grwebapp_websocket) {
        //        _grwebapp_websocket.close();
        //    }
        //}
    }
    else {
        alert('當前瀏覽器不支持HTML5的WebSocket，請選用更新版本的瀏覽器！')
    }
}

function webapp_build_one(pack, report, report_method, data, data_method, callback_fun, dataParams) {
    if (!report) {
        alert("在參數中没有定義報表模板的url，報表不能生成！");
        return;
    }

    if (data) {
        if (webapp_is_url(data)) {
            webapp_ajax(data_method, data, function (xmlhttp, success) {
                if (success) {
                    pack.data = xmlhttp.responseText;
                    callback_fun();
                }
                else {
                    //alert("載入報表數據失敗，響應消息：" + xmlhttp.responseText);
                    window.open(data, "blank");
                }
            }, undefined, dataParams);
        }
        else {
            pack.data = (typeof data == "object") ? JSON.stringify(data) : data;
            callback_fun();
        }
    }
    else {
        pack.data = "";
    }

    if (webapp_is_url(report)) {
        webapp_ajax(report_method, report, function (xmlhttp, success) {
            if (success) {
                pack.report = xmlhttp.responseText;
                callback_fun();
            }
            else {
                //alert("載入報表模板失敗，響應消息：" + xmlhttp.responseText);
                window.open(report, "blank");
            }
        });
    }
    else {
        pack.report = (typeof report == "object") ? JSON.stringify(report) : report;
        callback_fun();
    }
}

//將參數通過WebSocket發送给WEB報表客户端，WEB報表客户端執行對應的任務
//參數說明：
//args：
//  報表生成相關的參數，為一個结構體對象或结構體對象數组。
//  當參數為數组時，表示是執行批量任務。此時後面的 report 與 data 參數不會被用到。
//  结構體對象的各個數據項說明請參考帮助中“WEB報表(B/S報表)->WEB報表客户端->啟動參數說明”部分
//report：
//  報表模板文本，報表定義格式必須為JSON格式。此參數可空，為空表示執行非報表生成任務，或WEB報表客户端通過URL獲取報表模板。
//data：
//  報表數據文本，此參數可空，報表無需提供數據，或WEB報表客户端通過URL獲取報表數據。
//
//  報表數據對應的 XML 或 JSON 文本，請參考帮助“WEB報表(B/S報表)->WEB報表數據”中的說明。 
function webapp_ws_run(variant_args, report, data) {
    function run_one(args, reportText, dataText) {
        var msg;

        if (webapp_ws_check()) {
            if (typeof args === "string") {
                args = {
                    type: args
                };
            }
            msg = JSON.stringify(args);

            if (reportText) {
                if (reportText.substr(0, 4) === "_WR_") {
                    msg += reportText.length;
                }
                msg += reportText;

                if (dataText) {
                    msg += dataText;
                }
            }

            _grwebapp_websocket.send(msg);
        }
    } //end of run_one

    if (!webapp_ws_check(1)) {
        //如果WebSocket没有連接，則首先創建並連接WebSocket，並在onopen事件中執行相關的任務
        webapp_ws_create(function () {
            webapp_ws_run(variant_args, report, data);
        });
        return;
    }

    if (Array.isArray(variant_args)) {
        variant_args.forEach(function (args) {
            run_one(args);
        })
    }
    else {
        run_one(variant_args, report, data);
    }
}

//通過 ajax 方式獲取報表模板與報表數據，然後通過 WebSocket 發送相關數據给WEB報表客户端並生成報表
//參數既可以是單個结構體對象，也可以是结構體對象數组。如果是數组，表示成批生成多個報表。
//结構體對象的各個數據項說明請參考帮助中“WEB報表(B/S報表)->WEB報表客户端->啟動參數說明”部分。
function webapp_ws_ajax_run(variant_args) {
    function run_one(args) {
        var report = args.report,
        data = args.data,
        report_method = args.report_method,
        data_method = args.data_method,
        dataUrlParams = args.dataUrlParams,
        pack = {};

        function run() {
            //只有當report與data都赋值之後才運行，即向WEB報表客户端程序發送數據
            if (pack.report && pack.data !== undefined) {
                webapp_ws_run(args, pack.report, pack.data);
            }
        }

        //因為args需要傳遞给WEBAPP，report與data的url相關的參數不需要傳遞，所以將其删除掉
        delete args.report;
        delete args.data;
        delete args.report_method;
        delete args.data_method;
        delete args.dataUrlParams;

        webapp_build_one(pack, report, report_method, data, data_method, run, dataUrlParams);
    } //end of run_one

    if (!webapp_ws_check(1)) {
        //如果WebSocket没有連接，則首先創建並連接WebSocket，並在onopen事件中執行相關的任務
        webapp_ws_create(function () {
            webapp_ws_ajax_run(variant_args);
        });
        return;
    }

    if (Array.isArray(variant_args)) {
        variant_args.forEach(function (args) {
            run_one(args);
        });
    }
    else {
        run_one(variant_args);
    }
}

//通過 ajax 方式獲取多個報表的模板與數據，然後用 WebSocket 將數據一次性發送给WEB報表客户端程序。
//實現多個報表同時生成在一個任務中(應用Grid++Report的獨立子報表功能實現)，達到多個報表同時預覽、打印與數據導出
function webapp_ws_ajax_together(args, reports) {
    var reportCount = reports.length,
        reportPacks = [],
        gettedCount = 0; //指示已經獲取到數據的報表個數

    function ajaxRequestOne(arg, index) {
        var report = arg.report,
        data = arg.data,
        report_method = arg.report_method,
        data_method = arg.data_method,
        dataUrlParams = arg.dataUrlParams,
        pack = reportPacks[index];

        function try_ws_send() {
            var msg,
                dataMsg = "",
                lengths = [];

            if (pack.report && pack.data !== undefined) {
                if (++gettedCount >= reportCount) { //只有當全部報表的模板與數據都已經獲取到之後，才會向WEB報表客户端發送數據
                    msg = JSON.stringify(args);

                    reportPacks.forEach(function (item) {
                        var report = item.report,
                            data = item.data,
                            reportLen = report.length,
                            reportLenText = "";

                        if (report.substr(0, 4) === "_WR_") {
                            reportLenText += reportLen;
                            dataMsg += reportLenText;
                            reportLen += reportLenText.length;
                        }
                        dataMsg += report;

                        if (data) {
                            dataMsg += data;
                        }

                        lengths.push(reportLen + data.length);
                    });

                    msg += JSON.stringify(lengths);
                    msg += dataMsg;

                    _grwebapp_websocket.send(msg);
                }
            }
        }

        webapp_build_one(pack, report, report_method, data, data_method, try_ws_send, dataUrlParams);
    } //end of ajaxRequestOne

    if (!webapp_ws_check(1)) {
        //如果WebSocket没有連接，則首先創建並連接WebSocket，並在onopen事件中執行相關的任務
        webapp_ws_create(function () {
            webapp_ws_ajax_together(args, reports);
        });
        return;
    }

    reports.forEach(function (report, index) {
        reportPacks.push({});
        ajaxRequestOne(report, index);
    });
}

/////////////////////////////////////////////////////////////////////////////
//通過WebSocket向WEB報表客户端發送枚舉出當前電脑的所有打印機信息的指令
//在網頁的 webapp_onmessage 函數中接收WEB報表客户端返回的结果，具體請參考例子。
function webapp_ws_fun_Printers() {
    webapp_ws_run({
        type: "fun",
        fun: "Printers"
    });
}

//通過WebSocket向WEB報表客户端發送枚舉出當前電脑的指定打印機的全部可用纸張的指令
//在網頁的 webapp_onmessage 函數中接收WEB報表客户端返回的结果，具體請參考例子
function webapp_ws_fun_PrinterPapers(printer) {
    webapp_ws_run({
        type: "fun",
        fun: "PrinterPapers",
        printer: printer
    });
}

//通過WebSocket向WEB報表客户端發送停止當前報表預覽並關閉預覽窗口的指令
function webapp_ws_fun_StopPreview() {
    webapp_ws_run({
        type: "fun",
        fun: "StopPreview"
    });
}

/////////////////////////////////////////////////////////////////////////////
//通過WebSocket向WEB報表客户端發送消息進行自動更新检查處理
function webapp_ws_autoupdate() {
    webapp_ws_run({
        type: "update",
        url: _grwebapp_url,
        ver: _grwebapp_version
    });
}

/////////////////////////////////////////////////////////////////////////////
//為URL追加一個名為id的隨機數參數，用於防止瀏覽器缓存。
//報表模板重新設計後，因為瀏覽器缓存而让報表生成不能反映出新修改的設計结果，URL後追加一個隨機數參數可以避免這樣的問題
//參數url必須是静態的URL，其後本身無任何參數
//如果模板幾乎不怎么修改，可以去掉對本函數的調用
function urlAddRandomNo(url) {
    return url + "?id=" + Math.floor(Math.random() * 10000);
}

//根據當前網頁URL獲取到當前WEB服務器的根URL，並記錄在 window.rootURL 中
function gr_extractRootURL() {
    var path = window.location.pathname,
        index = path.lastIndexOf("/");

    window.rootURL = window.location.protocol + "//" + window.location.host;
    if (index >= 0) {
        path = path.substr(0, index);

        //demmo的根目錄在當前頁面的1级目錄之上
        index = path.lastIndexOf("/");
        if (index >= 0) {
            path = path.substr(0, index);
        }

        window.rootURL += path;
    }
    window.rootURL += "/";
}

//如果是在VUE下使用，請將本段代碼的注释去掉
export { 
    webapp_url_method_valid, 
    webapp_urlprotocol_startup, 
    webapp_ajax, 
    webapp_ws_ajax_run, 
    webapp_urlprotocol_run, 
    urlAddRandomNo, 
    webapp_onmessage, 
    webapp_ws_fun_StopPreview, 
    webapp_ws_fun_PrinterPapers, 
    webapp_ws_fun_Printers, 
    webapp_ws_ajax_together, 
    webapp_ws_autoupdate, 
    gr_extractRootURL 
}
