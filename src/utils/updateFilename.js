import {getUser, getSession} from '@/utils/auth'

/**
 * 获取 blob
 * @param  {String} url 目标文件地址
 * @return {cb} 
 */
function getBlob(url,cb) {
  let token = getSession()
  let xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.setRequestHeader('Authorization', token)
  xhr.responseType = 'blob';
  xhr.onload = function() {
    if (xhr.status === 200) {
        cb(xhr.response);
    }else {
      alert('下载失败，请联系开发人员')
    }
  };
  xhr.send();
}

/**
 * 保存
 * @param  {Blob} blob     
 * @param  {String} filename 想要保存的文件名称
 */
function saveAs(blob, filename) {
  if (window.navigator.msSaveOrOpenBlob) {
    navigator.msSaveBlob(blob, filename);
  } else {
    let link = document.createElement('a');
    let body = document.querySelector('body');

    link.href = window.URL.createObjectURL(blob);
    link.download = filename;

    // fix Firefox
    link.style.display = 'none';
    body.appendChild(link);
    
    link.click();
    body.removeChild(link);

    window.URL.revokeObjectURL(link.href);
  };
}

/**
 * 下载
 * @param  {String} url 目标文件地址
 * @param  {String} filename 想要保存的文件名称
 */
export function download(url, filename) {
  getBlob(url, function(blob) {
      saveAs(blob, filename);
  });
};