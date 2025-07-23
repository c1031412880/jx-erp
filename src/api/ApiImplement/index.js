import config from "./config";

const ApiImplement = function () {
  this.apiMap = {}
}

ApiImplement.prototype.testingApi = function (id) {
  if (config.whiteList.indexOf(id) < 0) {
    return true
  }
  if (this.apiMap[id]) {
    if (contrastTime(this.apiMap[id])) {
      this.apiMap[id] = new Date()
      return true
    } else {
      return false
    }
  } else {
    this.apiMap[id] = new Date()
    return true
  }
}

// 和当前时间对比
function contrastTime(date, difference = 2000) {
  let new_date = new Date()
  if (new_date - date > difference) {
    return true
  } else {
    return false
  }
}

export default ApiImplement
