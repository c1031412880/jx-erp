/**
 * Created by jiachenpan on 16/11/18.
 */

export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if (('' + time).length === 10) time = parseInt(time) * 1000
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') {
      return ['日', '一', '二', '三', '四', '五', '六'][value]
    }
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return time_str
}

export function formatDate(time, fmt) {
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if (('' + time).length === 10) time = parseInt(time) * 1000
    date = new Date(time)
  }
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  }
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + ''
      fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? str : padLeftZero(str))
    }
  }
  return fmt
}
// 判断月份补0
function padLeftZero(str) {
  return ('00' + str).substr(str.length)
}

export function formatTime(time, option) {
  time = +time * 1000
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() + 1 + '月' + d.getDate() + '日' + d.getHours() + '时' + d.getMinutes() + '分'
    )
  }
}

export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

function getType(obj) {
  if (Object.prototype.toString.call(obj) == '[object Object]') {
    return 'Object'
  } else if (Object.prototype.toString.call(obj) == '[object Array]') {
    return 'Array'
  } else {
    return 'nomal'
  }
}

/**
 * 深拷贝一个对象或数组
 * 深拷贝意味着创建一个新对象或数组，其所有嵌套的属性和元素都不会与原始对象共享
 * 这对于修改对象或数组的副本而不影响原始数据非常有用
 *
 * @param {Object|Array} obj - 需要深拷贝的对象或数组
 * @returns {Object|Array} - 深拷贝后的对象或数组
 */
export function deepCopy(obj) {
  let newObj = null
  if (getType(obj) === 'nomal') {
    return obj
  } else {
    newObj = getType(obj) === 'Object' ? {} : []
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        newObj[key] = deepCopy(obj[key])
      }
    }
  }
  return newObj
}

// 切割数组
export function chunk(arr, size) {
  let objArr = new Array()
  let index = 0
  let objArrLen = arr.length / size
  for (let i = 0; i < objArrLen; i++) {
    let arrTemp = new Array()
    for (let j = 0; j < size; j++) {
      arrTemp[j] = arr[index++]
      if (index == arr.length) {
        break
      }
    }
    objArr[i] = arrTemp
  }
  return objArr
}

export function outFormData(obj) {
  let newForm = null
  if (getType(obj) !== 'nomal') {
    newForm = getType(obj) === 'Object' ? {} : []
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (obj[key]) {
          newForm[key] = outFormData(obj[key])
        }
      }
    }
  } else {
    return obj
  }
  return newForm
}

/**
 * @param { string } date new Date()
// 转换为 yyyy-MM-dd HH:mm:ss
*/
export function formatDateTime(date) {
  // let date = new Date()
  let Y = date.getFullYear()
  let M = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
  let D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
  let hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
  let minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
  let seconds = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
  date = Y + '-' + M + '-' + D + ' ' + hours + ':' + minutes + ':' + seconds
  //  console.log(date)  //2021-10-20 11:37:09
  return date
}

//格式化时间
function formatTime(param) {
  let y = param.getFullYear()
  let m = param.getMonth() + 1
  let d = param.getDate()
  m = m < 10 ? '0' + m : m
  d = d < 10 ? '0' + d : d
  return y + '-' + m + '-' + d + ''
}

/**
 * 以当前时间为基础，便捷获取时间（最近2天，最近1周，最近2周，最近1月，最近2月，最近半年，最近一年，本周，本月，本年）
 * @param { string } code
 * @returns { Object }
 */
export function getDate(code, newdate = new Date()) {
  const date = newdate
  let endTime = formatTime(date)
  let date1 = Date.parse(date)
  let start = ''
  let end = ''
  let oneDay = 1000 * 3600 * 24

  switch (code) {
    //今天
    case 'today':
      start = new Date()
      break
    //最近1天
    case 'lastOneDay':
      start = date1 - oneDay * 1
      break
    //最近2天
    case 'lastTwoDay':
      start = date1 - oneDay * 2
      break
    //最近7天
    case 'lastSevenDay':
      start = date1 - oneDay * 6
      break
    //最近1周
    case 'lastOneWeek':
      start = date1 - oneDay * 7
      break
    //最近2周
    case 'lastTwoWeek':
      start = date1 - oneDay * 14
      break
    //最近1月
    case 'lastOneMonth':
      start = new Date()
      start.setMonth(start.getMonth() - 1)
      break
    //最近2月
    case 'lastTwoMonth':
      start = new Date()
      start.setMonth(start.getMonth() - 2)
      break
    //最近3月
    case 'lastThreeMonth':
      start = new Date()
      start.setMonth(start.getMonth() - 3)
      break
    //最近半年
    case 'lastHalfYear':
      start = date1 - oneDay * 183
      break
    //最近一年
    case 'lastOneYear':
      start = new Date()
      start.setYear(start.getFullYear() - 1)
      break
    //下一年
    case 'nextOneYear':
      start = date
      end = new Date(date)
      end.setYear(start.getFullYear() + 1)
      break
    //本周
    case 'thisWeek':
      let a = 6 - date.getDay()
      start = new Date(date1 - oneDay * a).setHours(0, 0, 0, 0)
      end = new Date(date1 + oneDay * (1 + date.getDay())).setHours(24, 0, 0, 0)
      break
    //本月
    case 'thisMonth':
      // start = new Date();
      // start.setHours(0, 0, 0, 0)
      // start.setMonth(start.getMonth(), 1)
      // end = new Date(start)
      // end.setHours(0, 0, 0, 0)
      // end.setMonth(start.getMonth() + 1, 1)
      start = new Date()
      start.setDate(1)
      end = new Date(start)
      end.setMonth(start.getMonth() + 1)
      end.setDate(0)
      break
    //本年
    case 'thisYear':
      start = new Date()
      start.setHours(0, 0, 0, 0)
      start.setMonth(0, 1)
      start.setYear(start.getFullYear())
      end = new Date(start)
      end.setHours(0, 0, 0, 0)
      end.setMonth(start.getMonth(), 1)
      end.setYear(start.getFullYear() + 1)
      break
    // 本季度
    case 'thisQuarter':
      start = new Date()
      let month = new Date().getMonth()
      let quarter = Math.floor(month / 3) + 1
      let startMonth = quarter * 3 - 2
      let endMonth = quarter * 3
      start.setMonth(startMonth - 1)
      start.setDate(1)
      end = new Date(start)
      end.setMonth(endMonth)
      end.setDate(0)
      break
  }

  return {
    startTime: formatTime(new Date(start)),
    endTime: end ? formatTime(new Date(end)) : endTime
  }
}

/**
 * 
 * @param { string } checkStartDate
 * @param { string }  checkEndDate
 * @returns { Boolean }
判断时间大小 时间格式为： 2021-12-25
*/
export function compareDate(checkStartDate, checkEndDate) {
  let arys1 = new Array()
  let arys2 = new Array()
  if (checkStartDate != null && checkEndDate != null) {
    arys1 = checkStartDate.split('-')
    let sdate = new Date(arys1[0], parseInt(arys1[1] - 1), arys1[2])
    arys2 = checkEndDate.split('-')
    let edate = new Date(arys2[0], parseInt(arys2[1] - 1), arys2[2])
    if (sdate > edate) {
      // alert("日期开始时间大于结束时间");
      return false
    } else {
      // alert("通过");
      return true
    }
  }
}

//计算两个日期之差
export function getDistanceDays(date1, date2) {
  // date1例如:'2022-03-05',date2例如:'2022-03-06'
  const date1_timeStamp = new Date(date1) - 0
  const date2_timeStamp = new Date(date2) - 0
  let max = '',
    min = ''
  if (date1_timeStamp > date2_timeStamp) {
    return false
  } else {
    max = date2_timeStamp
    min = date1_timeStamp
  }
  // 例如返回:'1'
  return (max - min) / (24 * 60 * 60 * 1000)
}

// 防抖
export function debounce(fn, delay = 500) {
  // timer 是在闭包中的
  let timer = null
  return function () {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      fn.apply(this, arguments)
      // 清空定时器
      timer = null
    }, delay)
  }
}

// 节流
export function throttle(fn, delay = 100) {
  let timer = null
  return function () {
    if (timer) {
      return
    }
    timer = setTimeout(() => {
      fn.apply(this, arguments)
      timer = null
    }, delay)
  }
}

// 判断数据类型
export function getDataType(data) {
  const temp = Object.prototype.toString.call(data)
  const type = temp.match(/\b\w+\b/g)
  return type.length < 2 ? 'Undefined' : type[1]
}

// 判断两个对象是否相等
export function isObjectChanged(source, comparison) {
  const iterable = data => ['Object', 'Array'].includes(getDataType(data))
  if (getDataType(source) !== getDataType(comparison)) {
    return true
  }
  const sourceKeys = Object.keys(source)

  const comparisonKeys = Object.keys({ ...source, ...comparison })

  if (sourceKeys.length !== comparisonKeys.length) {
    return true
  }

  return comparisonKeys.some(key => {
    if (iterable(source[key])) {
      return isObjectChanged(source[key], comparison[key])
    } else {
      return source[key] != comparison[key]
    }
  })
}

// 计算车龄
export function getVehicleAge(date) {
  let birthDay = new Date(date)
  let nowDate = new Date()
  let date1 = Date.parse(birthDay)
  let date2 = Date.parse(nowDate)
  let day = Math.ceil((date2 - date1) / (60 * 60 * 1000 * 24))
  let age = ''
  let year = Math.floor(day / 365)
  let y = day % 365
  let month = Math.floor(y / 30)
  let d = Math.floor((day % 365) % 30)
  // age += year + '年' + month + '月' +  d + '天'
  if (year) {
    age += year + '年'
  }
  if (month) {
    age += month + '月'
  }
  age += d + '天'
  return age
}

//  新增n个自然月
export function getMonthBeforeFormatAndDay(num, time) {
  let date = new Date(time)
  let year = date.getFullYear()
  let day = date.getDate()
  date.setMonth(date.getMonth() + num * 1, 1)
  //读取日期自动会减一，所以要加一
  let mo = date.getMonth() + 1
  //小月
  if (mo == 4 || mo == 6 || mo == 9 || mo == 11) {
    if (day > 30) {
      day = 30
    }
  }
  //2月
  else if (mo == 2) {
    if (isLeapYear(year)) {
      if (day > 29) {
        day = 29
      } else {
        day = 28
      }
    }
    if (day > 28) {
      day = 28
    }
  }
  //大月
  else {
    if (day > 31) {
      day = 31
    }
  }

  let retureValue = formatTime(new Date(year + '-' + mo + '-' + day))
  return retureValue
}

//JS判断闰年代码
export function isLeapYear(Year) {
  if ((Year % 4 == 0 && Year % 100 != 0) || Year % 400 == 0) {
    return true
  } else {
    return false
  }
}

// 获取两个时间相差月份
export function getGapMonth(s_date, e_date) {
  s_date = new Date(s_date)
  e_date = new Date(e_date)
  var a_31month = [1, 3, 5, 7, 8, 10, 12] //31天的月份，2月份也暂时按30天计算
  var pl_month = e_date.getMonth() == 0 ? 12 : e_date.getMonth()
  var t_prelastmonthdays = a_31month.indexOf(pl_month) >= 0 ? 31 : 30 //结束月上个月的天数
  var t_lastmonthdays = a_31month.indexOf(e_date.getMonth() + 1) >= 0 ? 31 : 30 //结束月的天数
  var predictnum = 0

  var t_year = e_date.getFullYear() - s_date.getFullYear()
  var t_month = e_date.getMonth() - s_date.getMonth()
  var t_day = e_date.getDate() + 1 - s_date.getDate() //结束日期比开始日期少一天，算一整月
  if (t_day < 0) {
    t_month = t_month - 1
    predictnum = (t_prelastmonthdays + t_day) / t_lastmonthdays //多出的不足一个月的天数除以结束月的天数
  } else {
    predictnum = t_day / t_lastmonthdays
  }
  return t_year * 12 + t_month + predictnum
}

// 获取某月的所有日期
export function getDaysInMonth(year, month) {
  const daysOfMonth = []
  month = parseInt(month, 10)
  const lastDayOfMonth = new Date(year, month, 0).getDate()
  for (let i = 1; i <= lastDayOfMonth; i++) {
    // if (i < 10) {
    //   daysOfMonth.push("0" + i); //判断是部否小于10，如果小于加0，，例如“01”
    // } else {
    daysOfMonth.push(i + '')
    // }
  }
  return daysOfMonth
}

// 获取某天为星期几
// 传参 (年 月 日)
export function oneDay(y, m, d) {
  var myDate = new Date()
  myDate.setFullYear(y, m - 1, d)
  var week = myDate.getDay()
  switch (week) {
    case 0:
      return '日'
    case 1:
      return '一'
    case 2:
      return '二'
    case 3:
      return '三'
    case 4:
      return '四'
    case 5:
      return '五'
    case 6:
      return '六'
  }
}
// 获取某天为星期几
// 传参 ("年-月-日")
export function getWeekDay(day) {
  var myDate = day ? new Date(day) : new Date()
  var week = myDate.getDay()
  switch (week) {
    case 0:
      return '日'
    case 1:
      return '一'
    case 2:
      return '二'
    case 3:
      return '三'
    case 4:
      return '四'
    case 5:
      return '五'
    case 6:
      return '六'
  }
}

// 生成唯一id
export function uuid() {
  const len = 32 //32长度
  let radix = 16 //16进制
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('')
  let uuid = [],
    i
  radix = radix || chars.length
  if (len) {
    for (i = 0; i < len; i++) {
      uuid[i] = chars[0 | (Math.random() * radix)]
    }
  } else {
    let r
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-'
    uuid[14] = '4'
    for (i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | (Math.random() * 16)
        uuid[i] = chars[i == 19 ? (r & 0x3) | 0x8 : r]
      }
    }
  }
  return uuid.join('')
}

// 简单的做一个加密
/**
 *
 * @param { string }  加密数字
 * @param { Number }  前几位不加密
 * @param { Number }  后几位不加密
 */
export function encryptionNum(num, start_L, end_L) {
  let num_L = (num + '').length

  // 长度不够 直接返回原始数据
  if (num_L < start_L + end_L) {
    return num
  }
  // 生成加密 *
  let x = '*'.repeat(num_L - (start_L + end_L))

  return num.substring(0, start_L) + x + num.substr(num_L - end_L)
}

/**
 * @description: 之前或之后某天所在周信息
 * @param 时间对象
 * @return: 数组
 */
export function getWeekDataList(date = new Date(), n = 0) {
  //根据日期获取本周周一~周日的年-月-日
  var weekList = {}
  let oneDayTime = 1000 * 60 * 60 * 24
  let strWeek = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
  let today = date.setDate(date.getDate() + n)
  // console.log(today);
  let week = new Date(today).getDay() || 7
  let startDate = today - oneDayTime * (week - 1)
  for (let i = 0; i < 7; i++) {
    let temp = new Date(startDate + i * oneDayTime)
    let year = temp.getFullYear()
    let month = temp.getMonth() + 1
    let day = temp.getDate()
    month = month < 10 ? '0' + month : month
    day = day < 10 ? '0' + day : day
    weekList[strWeek[i]] = `${year}-${month}-${day}`
  }
  return weekList
}

/**
 * @description: 根据时间获取第多少周
 * @param 时间对象
 * @return: 数字
 */
export function getYearWeek(date) {
  let start = new Date(date.getFullYear(), 0, 1)
  let startWeek = start.getDay() || 7
  console.log(start, startWeek)
  return Math.floor(((date.getTime() - start.getTime()) / (24 * 60 * 60 * 1000) + startWeek) / 7)
}

// 时间戳转时间格式
export function TimestampToDate(Timestamp) {
  let date1 = new Date(Timestamp)
  return date1.toLocaleDateString().replace(/\//g, '-') + ' ' + date1.toTimeString().substr(0, 8)
}

// 判断时间开始时间和结束时间
/**
 * @param { string } startTime
 * @param { string }  endTime
 * @returns { Boolean }
判断时间大小 时间格式为： 
*/
export function endGreaterStart(startTime, endTime) {
  if (startTime != null && endTime != null) {
    //转化为时间戳
    let startTimestamp = new Date(startTime).getTime()
    let endTimestamp = new Date(endTime).getTime()
    if (startTimestamp > endTimestamp) {
      // alert("日期开始时间大于结束时间");
      return false
    } else {
      // alert("通过");
      return true
    }
  }
}

/**
 * @param { string } startTime 2024-08-12
 * @param { string }  endTime 2024-08-15
 * @returns { Array } [2024-08-12,2024-08-13,2024-08-14,2024-08-15]
获取开始日期到结束日期之间的所有日期包含开始日期和结束日期,小于10的月份补0： 
*/
export function getDays(startTime, endTime) {
  let startDate = new Date(startTime)
  let endDate = new Date(endTime)
  let days = []
  let day = startDate
  while (day <= endDate) {
    let year = day.getFullYear()
    let month = day.getMonth() + 1
    let date = day.getDate()
    let dateStr =
      year + '-' + (month < 10 ? '0' + month : month) + '-' + (date < 10 ? '0' + date : date)
    days.push(dateStr)
    day.setDate(day.getDate() + 1)
  }
  return days
}

// 计算时间（基准时间yyyy-MM-dd HH:mm:ss，增加或减少(add|minus)，天，小时，分钟，秒）
export function computeDate(times, type, days, hours, minutes, seconds) {
  // 全部需要减掉的时间戳
  let all_time = new Date(times).getTime()
  switch (type) {
    case 'add':
      all_time +=
        days * 24 * 60 * 60 * 1000 + hours * 60 * 60 * 1000 + minutes * 60 * 1000 + seconds * 1000
      break
    case 'minus':
      all_time -=
        days * 24 * 60 * 60 * 1000 + hours * 60 * 60 * 1000 + minutes * 60 * 1000 + seconds * 1000
      break
  }
  let end_time = new Date(all_time)
  // 转换时间戳格式
  return formatDateTime(end_time)
}

/**
 * 将数字金额转换为大写汉字金额
 * @param {*} num
 * @returns
 */
export function numberToChineseMoney(num) {
  if (typeof num !== 'number' || isNaN(num)) {
    return ''
  }

  // 最大支持金额 9999999999999.99
  if (num > 999999999999.99) {
    return ''
  }

  const units = ['', '拾', '佰', '仟']
  const bigUnits = ['', '万', '亿']
  const decimals = ['角', '分']
  const digitToChinese = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖']
  let [integerPart, decimalPart] = num.toFixed(2).split('.')

  // 处理整数部分
  let chineseInteger = ''
  let integerLen = integerPart.length

  for (let i = 0; i < integerLen; i++) {
    const digit = integerPart[i]
    const position = integerLen - i - 1
    const unitIndex = position % 4
    const bigUnitIndex = Math.floor(position / 4)

    if (digit === '0') {
      // 连续零只输出一个
      if (!chineseInteger.endsWith('零')) {
        chineseInteger += '零'
      }
    } else {
      chineseInteger += digitToChinese[parseInt(digit)] + units[unitIndex]
    }

    if (unitIndex === 0 && chineseInteger.slice(-1) !== '零') {
      chineseInteger += bigUnits[bigUnitIndex]
    }
  }

  // 去掉末尾多余的 "零"
  chineseInteger = chineseInteger.replace(/零+$/, '')
  // 如果整数部分为空，表示为零
  chineseInteger = chineseInteger || '零'

  // 处理小数部分
  let chineseDecimal = ''
  for (let i = 0; i < decimalPart.length; i++) {
    const digit = decimalPart[i]
    if (digit !== '0') {
      chineseDecimal += digitToChinese[parseInt(digit)] + decimals[i]
    }
  }

  // 拼接结果
  return chineseInteger + '元' + (chineseDecimal || '整')
}

/**
 * 判断一个字符串是不是大写汉字金额
 * @param {*} str
 * @returns
 */
export function isChineseMoneyString(str) {
  if (typeof str !== 'string') {
    return false
  }

  // 大写汉字金额的正则表达式
  const chineseMoneyRegex =
    /^([壹贰叁肆伍陆柒捌玖](拾|佰|仟)?(零[壹贰叁肆伍陆柒捌玖](拾|佰|仟)?)?|零)*(万([壹贰叁肆伍陆柒捌玖](拾|佰|仟)?(零[壹贰叁肆伍陆柒捌玖](拾|佰|仟)?)?|零)*)?(亿([壹贰叁肆伍陆柒捌玖](拾|佰|仟)?(零[壹贰叁肆伍陆柒捌玖](拾|佰|仟)?)?|零)*)?(元零?)?(壹角|贰角|叁角|肆角|伍角|陆角|柒角|捌角|玖角|零)?(壹分|贰分|叁分|肆分|伍分|陆分|柒分|捌分|玖分)?(整)?$/

  return chineseMoneyRegex.test(str)
}
