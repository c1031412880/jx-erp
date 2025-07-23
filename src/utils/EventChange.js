
// 消息事件队列分发响应
export function EventChange () {
  // 消息队列
  this._events = {}
}

// 响应
EventChange.prototype.$on = function (funName = '') {
  const cbs = toArray(arguments, 1)
  if (cbs.length) {
    this._events[funName] = cbs
  }
  console.log('events', this._events)
}

// 触发
EventChange.prototype.$emit = function (event) {
  let cbs = this._events[event]
  if (cbs) {
    cbs = cbs.length > 1 ? toArray(cbs) : cbs
    const args = toArray(arguments, 1)
    for (let i =0 , l = cbs.length; i < l; i++) {
      try {
        cbs[i].apply({}, args)
      } catch (e) {
        console.error(e, `event for ${event}`)
      }
    }
  }
}

function toArray(arg, idx = 0) {
  let array = []
  Object.keys(arg).forEach((key, i) => {
    if (idx <= i) {
      array.push(arg[key])
    }
  })
  return array
}
