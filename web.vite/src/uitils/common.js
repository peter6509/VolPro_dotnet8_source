let base = {
  addDays(date, days) {
    //给指定日期增加天數
    if (!days) {
      return date;
    }
    let dateArr = date.split(' ');
    date = new Date(new Date(date).setDate(new Date(date).getDate() + days));
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    if (month < 10) {
      month = '0' + month;
    }
    var day = date.getDate();
    if (day < 10) {
      day = '0' + day;
    }
    date = year + '-' + month + '-' + day;
    if (dateArr.length == 1) {
      return date;
    }
    return date + ' ' + dateArr[1];
  },
  //獲取當前時間，time是否带時分秒
  getDate(time) {
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();

    let datetime =
      year +
      '-' +
      (month < 10 ? '0' + month : month) +
      '-' +
      (day < 10 ? '0' + day : day);

    if (!time) {
      return datetime;
    }

    let hour = date.getHours();
    let minutes = date.getMinutes();
    let second = date.getSeconds();

    return (
      datetime +
      '' +
      ' ' +
      (hour < 10 ? '0' + hour : hour) +
      ':' +
      (minutes < 10 ? '0' + minutes : minutes) +
      ':' +
      (second < 10 ? '0' + second : second)
    );
  },
  isPhone(val) {
    return /^[1][3,4,5,6,7,8,9][0-9]{9}$/.test(val);
  },
  isDecimal(val) {
    return /(^[\-0-9][0-9]*(.[0-9]+)?)$/.test(val);
  },
  isNumber(val) {
    return /(^[\-0-9][0-9]*([0-9]+)?)$/.test(val);
  },
  isMail(val) {
    return /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/.test(val);
  },
  isUrl(url) {
    return this.checkUrl(url);
  },
  checkUrl(url) {
    if (url.startsWith("http")) {
      return url;
    }
    return false;
  },
  matchUrlIp(url, ip) {
    // url使用是否使用的當前ip
    if (!url || !ip) {
      return false;
    }
    return url.indexOf(ip.replace('https://', '').replace('http://', '')) >= 0;
  },
  getImgSrc(src, httpUrl) {
    if (this.isUrl(src)) {
      return src;
    }
    if (httpUrl) {
      return httpUrl + src;
    }
    return src;
  },
  previewImg(src, httpUrl) {
    // 圖片預覽，目前只支持單圖片預覽
    if (src && !this.isUrl(src) && httpUrl) {
      if (
        src.substr(0, 1) == '/' &&
        httpUrl.substr(httpUrl.length - 1, 1) == '/'
      ) {
        src = src.substr(1);
      }
      src = httpUrl + src;
    }
    let id = 'vol-preview';
    let $div = document.getElementById(id);
    if (!$div) {
      $div = document.createElement('div');
      $div.setAttribute('id', 'vol-preview');
      let $mask = document.createElement('div');
      $mask.style.position = 'absolute';
      $mask.style.width = '100%';
      $mask.style.height = '100%';
      $mask.style.background = 'black';
      $mask.style.opacity = '0.6';
      $div.appendChild($mask);
      $div.style.position = 'fixed';
      $div.style.width = '100%';
      $div.style.height = '100%';
      // $div.style.overflow = "scroll";
      $div.style.top = 0;
      $div.style['z-index'] = 9999999;
      let $img = document.createElement('img');
      $img.setAttribute('class', 'vol-preview-img');
      $img.style.position = 'absolute';
      $img.style.top = '50%';
      $img.style.left = '50%';
      $img.style['max-width'] = '90%';
      $img.style['max-height'] = '90%';
      $img.style.transform = 'translate(-50%,-50%)';
      // $img.src = src;
      $img.setAttribute('src', src);
      $div.appendChild($img);
      $div.addEventListener('click', function() {
        this.style.display = 'none';
      });
      document.body.appendChild($div);
      return;
    }
    let $img1 = document.body
      .appendChild($div)
      .querySelector('.vol-preview-img');
    // img.src = src;
    $img1.setAttribute('src', src);
    $div.style.display = 'block';
  },
  // 下載文件 $element 標籤, url完整url, fileName 文件名, header 以key/value傳值
  // backGroundUrl 後台url，如果後台url直接從後台下載，其他全部通過點擊a標籤下載
  dowloadFile(url, fileName, header, backGroundUrl) {
    if (!url) return alert('此文件没有url不能下載');
    if (!this.isUrl(url)) {
      url = backGroundUrl + url;
    }
    window.open(url);
  },
  downloadImg(data) {
    if (!data.url || !data.callback || typeof data.callback !== 'function') {
      return;
    }
    // url, backGroundUrl, header, callback
    if (
      this.isUrl(data.url) &&
      !this.matchUrlIp(data.url, data.backGroundUrl)
    ) {
      return data.url;
    }
    // 通過後台api服務器下載
    if (!this.isUrl(data.url)) {
      if (!this.isUrl(data.backGroundUrl + data.url)) {
        return;
      }
      data.url = data.backGroundUrl + data.url;
    }
    var xmlResquest = new XMLHttpRequest();
    xmlResquest.open('get', data.url, true);
    xmlResquest.responseType = 'blob';
    xmlResquest.setRequestHeader('Content-Type', 'application/json');
    if (data.header && typeof data.header === 'object') {
      for (const key in data.header) {
        xmlResquest.setRequestHeader(key, data.header[key]);
      }
    }
    xmlResquest.onload = function() {
      if (this.status == 200) {
        var blob = this.response;
        callback(window.URL.createObjectURL(blob));
      }
    };
    xmlResquest.send();
  },
  // 2020.06.01增加通用方法，將普通對象轉換為tree结構
  // data數據格式[
  //     { name: 'tree1', id: 1, parentId: 0 },
  //     { name: 'tree2', id: 2, parentId: 0 }]

  // 1、id與parentId這兩個字段必須有
  // 2、樹形tree需要注意Id與parentId循環依赖的問題
  // 3、callback每次生成一新的節點的時回調的方法

  convertTree(data, callback,idField='id',parentField='parentId') {
    var treeIds = [];
    var root_data = [];
    data.forEach((x) => {
      // if (!x.children) {
      //   x.children = []
      // }
     
      if (
        !x.hidden &&
        x[idField] !== undefined &&
        x[idField] !== x[parentField] &&
        !data.some((s) => {
          return x[parentField] == s[idField];
        })
      ) {
        x.isRoot = true;
        callback && callback(x, data, true, treeIds);
        root_data.push(x);
        getTree(x[idField], x, data, callback, treeIds,idField,parentField);
      } else {
        callback && callback(x, data, true, treeIds);
      }
    });
    var exceptionNodes = data.filter((f) => {
      return treeIds.indexOf(f[idField]) == -1 && !f.hidden;
    });

    root_data.push(...exceptionNodes);
    return root_data;
  },
  getTreeAllParent(id, data) {
    // 獲取某個節點的所有父節點信息2020.11.01
    var nodes = [];
    if (!(data instanceof Array)) {
      return nodes;
    }

    data.forEach((x) => {
      if (x.id === x.parentId) {
        x.parentId = 0;
      } 
      // else if (data.some((c) => c.parentId === x.id && c.id === x.parentId)) {
      //   x.parentId = 0;
      // }
    });

    var _child = data.find((x) => {
      return x.id === id;
    });
    if (!_child) {
      return [];
    }
    nodes.push(_child);
    var _parentIds = [_child.parentId];
    for (let index = 0; index < _parentIds.length; index++) {
      var _node = data.find((x) => {
        return x.id === _parentIds[index] && x.id !== x.parentId;
      });
      if (!_node) {
        return nodes;
      }
      _parentIds.push(_node.parentId);
      nodes.unshift(_node);
    }
    return nodes;
  },
  //獲取所有節點的子節點
  // data數據格式[
  //     { name: 'tree1', id: 1, parentId: 0 },
  //     { name: 'tree2', id: 2, parentId: 0 }]
  getTreeAllChildren(id, data) {
    //遞归獲取某個節點的所有子節點信息
    var nodes = [];
    if (!(data instanceof Array)) {
      return nodes;
    }

    var _child = data.find((x) => {
      return x.id === id;
    });
    if (!_child) {
      return [];
    }
    nodes.push(_child);
    var _parentIds = [_child.id];
    for (let index = 0; index < _parentIds.length; index++) {
      data.forEach((_node) => {
        if (
          _node.parentId === _parentIds[index] &&
          _node.parentId !== _node.id
        ) {
          _parentIds.push(_node.id);
          nodes.unshift(_node);
        }
      });
    }
    return nodes;
  },
  //獲取所有子節點的id
  // data數據格式[
  //     { name: 'tree1', id: 1, parentId: 0 },
  //     { name: 'tree2', id: 2, parentId: 0 }]
  getTreeAllChildrenId(id, data) {
    return this.getTreeAllChildren(id, data).map((c) => {
      return c.id;
    });
  }
};
export default base;

// 2020.06.01增加通用方法，將普通對象轉換為tree结構
function getTree(id, node, data, callback, treeIds,idField,parentField) {
  if (treeIds.indexOf(id) == -1) {
    treeIds.push(id);
  }
  data.forEach((x) => {
    if (!x.hidden && x[parentField] == id) {
      if (!node.children) node.children = [];
      callback && callback(x, node, false);
      node.children.push(x);
      getTree(x[idField], x, data, callback, treeIds,idField,parentField);
    }
  });
}
