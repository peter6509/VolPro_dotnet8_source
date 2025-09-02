function getAllUrlParams() {
    var arr = window.location.search.substr(1).split('#')[0].split("&"),
        Params = {},
        i;

    for (i = 0; i < arr.length; i++) {
        Params[arr[i].split("=")[0]] = arr[i].split("=")[1];
    }

    return Params;
}

function onReportLoaded(viewer) {
    var report = viewer.report,
        masterSQL = report.QuerySQL,
        detailSQL = report.DetailGrid ? report.DetailGrid.Recordset.QuerySQL : "",
        url = "../../data/SQLParam.ashx?QuerySQL=";

    if (!masterSQL && detailSQL) {
        masterSQL = detailSQL;
        detailSQL = "";
    }
    if (masterSQL) {
        url += encodeURIComponent(masterSQL)
        if (detailSQL) {
            url += "&QuerySQL2=" + encodeURIComponent(detailSQL);
        }

        window.rubylong.ajax(url, function (xmlhttp, success) {
            this.loadData(xmlhttp, success, 1);
        }, viewer);

        viewer.waitData = true; //阻止在報表模板定義後直接生成報表
    }
}

function runReport() {
    var params = getAllUrlParams(),
        reportid = params["report"],
        dataid = params["data"],
        reportURL = "../../grf/" + reportid + ".grf",
        dataURL,
        reportViewer;

    if (dataid) { //params.hasOwnProperty("data")) {
        dataURL = "../../data/DataCenter.ashx?";

        if (params.hasOwnProperty("report")) {
            delete params["report"];
        }

        for (var key in params) {
            var item = params[key];
            dataURL = dataURL + key + "=" + params[key] + "&"
        }

        dataURL = dataURL.slice(0, -1)
    }

    reportViewer = window.rubylong.grhtml5.insertReportViewer("report_holder", reportURL, dataURL);

    if (!dataURL) {
        //如果没有指定報表數據參數，則要從報表模板中設置的查詢SQL中獲取報表數據
        //此項任務只能在 onReportLoaded 事件中處理
        reportViewer.events.onReportLoaded = onReportLoaded;
    }

    reportViewer.start(); //啟動報表運行，生成報表

    //用於記錄輔助性的參數
    reportViewer.run_args = {
        reportid: reportid,
        dataid: dataid,
    };

    return reportViewer;
}

function prepareWebApp(viewer) {
    var path = window.location.pathname,
        index = path.lastIndexOf("/");

    webapp_urlprotocol_startup(); //啟動WEB報表客户端程序，以便侦听接受 WebSocket 數據。這句特别重要*：只有在WEB報表客户端程序後，才能進行WebSocket通讯

    //應该還有服務器端確定的方式
    window.rootURL = window.location.protocol + "//" + window.location.host;
    if (index >= 0) {
        path = path.substr(0, index);

        //demmo的根目錄在當前頁面的2级目錄之上
        index = path.lastIndexOf("/");
        if (index >= 0) {
            path = path.substr(0, index);

            index = path.lastIndexOf("/");
            if (index >= 0) {
                path = path.substr(0, index);
            }
        }

        window.rootURL += path;
    }
    window.rootURL += "/";
}