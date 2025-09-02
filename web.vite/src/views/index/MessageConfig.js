import * as signalR from '@microsoft/signalr';
import { ElNotification } from 'element-plus';
import { ElMessageBox } from 'element-plus';
import store from '@/store/index';

export default function(http, receive) {
  let connection;
  http.post('api/user/GetCurrentUserInfo').then((result) => {
    connection = new signalR.HubConnectionBuilder()
      .withAutomaticReconnect()
      .withUrl(`${http.ipAddress}message?userName=${result.data.userName}`)
      //.withUrl(`${http.ipAddress}message`)
      .build();

    connection.start().catch((err) => console.log(ex.message));
    //自動重連成功後的處理
    connection.onreconnected((connectionId) => {
      console.log(connectionId);
    });
    connection.on('ReceiveHomePageMessage', function(data) {
      //console.log(data);
      switch (data.value) {
        case 'logout':
          showLogoutMessage(data);
          return;
        default:
          ElNotification.success({
            title: data.title,
            message: data.message + '',
            type: 'warning'
          });
          receive && receive(data);
          break;
      }
    });
  });
}
//强制用户下線
function showLogoutMessage(data) {
  store.commit('clearUserInfo', '');
  const timerId = setTimeout(() => {
    clearTimeout(timerId);
    window.location.href = '/';
  }, 5000);
  ElMessageBox.confirm(data.msg, '警告', {
    center: true,
    showCancelButton: false,
    closeOnClickModal: false,
    closeOnPressEscape: false,
    showClose: false
  }).then(() => {
    clearTimeout(timerId);
    window.location.href = '/';
  });
}
