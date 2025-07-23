// signalr连接通信
export function SignalDom() {
  this.isOpen = true
  this.user_id = ''
  this.conn_id = ''

}

SignalDom.prototype.outConnId = function () {
  console.log(this.conn_id)
  return this.conn_id
}


// 初始化
SignalDom.prototype.init = function (token) {
  this.connection = new signalR.HubConnectionBuilder()
    .withAutomaticReconnect()//断线自动重连
    .withUrl(window.newHttpConfig.signalrURl,{ accessTokenFactory: () => token })//传递参数Query["access_token"]
    .build();
}

// 开始连接
SignalDom.prototype.start = function () {
  return new Promise((resolve, reject) => {
    this.connection.start().then(req => {
      this.isOpen = true
      console.log('连接成功',req)
      resolve(req)
    }).catch(err => {
      this.isOpen = false
      reject(err)
    })
  })
}

// 调用后端方法
SignalDom.prototype.invoke = function (cmd = '', content= []) {
  return new Promise((resolve, reject) => {
    if (this.isOpen) {
      this.connection.invoke(cmd, ...content).then(req => {
        resolve(req)
      }).catch(err => {
        reject(err)
      })
    } else {
      reject()
    }
  })
}


// 事件响应
SignalDom.prototype.on = function (cmd = '', fun) {
  if (this.isOpen) {
    this.connection.on(cmd, (data) => {
      this.conn_id = data.conn_id
      this.user_id = data.user_id
      fun(data)
    })
  } else {
    fun({state: 400})
  }
}





