/**
 * 金额转中文（有bug）
 * 思路：
 * 个 十   百   千   万
 *    十万 百万 千万 亿
 *    十亿 百亿 千亿
 * 1  2    3    4    5
 *    6    7    8    9
 *    10
 *
 */
export function getAmountChinese ( val ) {
  const amount = +val
  if ( Number.isNaN( amount ) || amount < 0 ) return ''
  const NUMBER = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖']
  const N_UNIT1 = ['', '拾', '佰', '仟']
  const N_UNIT2 = ['', '万', '亿']
  const D_UNIT = ['角', '分']
  let [integer, decimal] = amount.toFixed( 2 ).split( '.' )
  if ( integer && integer.length > 12 ) return '金额过大无法计算'
  let res = ''
  // 整数部分
  if ( integer ) {
    for ( let i = 0, len = integer.length; i < len; i++ ) {
      const num = integer.charAt( i )
      const pos = len - i - 1 // -1 排除个位干扰
      if ( i === len - 1 && num === '0' ) break
      res += NUMBER[num] + N_UNIT1[( pos ) % 4]
      if ( pos % 4 === 0 ) { // 排除个位数后 万和亿位置都是4的倍数
        res += N_UNIT2[Math.floor( ( pos ) / 4 )]
      }
    }
  }
  res += '圆'
  if ( decimal ) {
    // 小数部分
    for ( let i = 0; i < 2; i++ ) {
      const num = decimal.charAt( i )
      num !== '0' && ( res += NUMBER[num] + D_UNIT[i] )
    }
  }
  return res
}

/**
 *阿拉伯数字转大写，整数转大写（带小数点）
 *
 */
 export function upperNum(n) {
  if(n===0) return "零元整";
	let unit = "万仟佰拾亿仟佰拾万仟佰拾元角分", str = ""
	n = String(Math.round(n * Math.pow(10, 2)))
	unit = unit.substr(unit.length - n.length)
	for (let i = 0; i < n.length; i++){
		str += "零壹贰叁肆伍陆柒捌玖".charAt(n.charAt(i)) + unit.charAt(i);
	}
	return str.replace(/零(仟|佰|拾|角)/g, "零").replace(/(零)+/g, "零").replace(/零(万|亿|元)/g, "$1").replace(/(亿)万/g, "$1$2").replace(/^元零?|零分/g, "").replace(/元$/g, "元整")
	// return str.replace(/零(仟|佰|拾|角)/g, "零").replace(/(零)+/g, "零").replace(/零(万|亿|元)/g, "$1").replace(/(亿)万|壹(拾)/g, "$1$2").replace(/^元零?|零分/g, "").replace(/元$/g, "元整")
}

/**
 *阿拉伯数字转大写，整数转大写（带小数点）(不含元角分)
 *
 */
export function NoToChinese(num) { 
  if(!num) return ''
  var AA = new Array("零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖"); 
  var BB = new Array("", "拾", "佰", "仟", "萬", "億", "点", ""); 
  var a = ("" + num).replace(/(^0*)/g, "").split("."), k = 0, re = ""; 
  for (var i = a[0].length - 1; i >= 0; i--) { 
      switch (k) { 
          case 0: re = BB[7] + re; break; 
          case 4: if (!new RegExp("0{4}\\d{" + (a[0].length - i - 1) + "}$").test(a[0])) 
                  re = BB[4] + re; break; 
          case 8: re = BB[5] + re; BB[7] = BB[5]; k = 0; break; 
      } 
      if (k % 4 == 2 && a[0].charAt(i + 2) != 0 && a[0].charAt(i + 1) == 0) re = AA[0] + re; 
      if (a[0].charAt(i) != 0) re = AA[a[0].charAt(i)] + BB[k % 4] + re; k++; 
  } 
  if (a.length > 1) //加上小数部分(如果有小数部分) 
  { 
      if(a[1]=='00'){ 
          re+=BB[0];
      }else{
          re += BB[6]; 
      }
      for (var i = 0; i < a[1].length; i++)
          if(a[1]!='00'){
              re += AA[a[1].charAt(i)]; 
          }
      } 
  return re; 
} 


/**
 *阿拉伯数字转大写，整数转大写(不带小数)
 *
 */
 export function numToCapital(num, type = '') {
  if (!num) return 0
  const strNum = Number((num + '').replace(/[,，]*/g, '')) + '' // 记录字符
  num = parseInt(Number(strNum)) // 转为整数，
  let capitalAr = '零一二三四五六七八九十'
  let unitAr = ['十', '百', '千', '万', '十', '百', '千', '亿', '十', '百', '千']
  if (type) {
    capitalAr = '零壹贰叁肆伍陆柒捌玖拾'
    unitAr = ['拾', '佰', '仟', '万', '拾', '佰', '仟', '亿', '拾', '佰', '仟'] // 单位
  }
  const resultAr = [] // 记录结果，后边json.in就可
  let index = strNum.length - 1 //记录位数
  let idx = 0 // 记录单位
  let percent = 10
  const turnNum = (num, percent, index) => {
    const unit = num / percent
    const capital = capitalAr[Number(strNum[index])]
    if (unit < 1) {
      resultAr.push(capital)
      // 出现11【一十一】这种情况
      if (Number(strNum[index]) === 1 && (strNum.length === 2 || strNum.length === 6 || strNum.length === 10)) {
        resultAr.pop()
      }
      return false //结束递归
    } else {
      if (capital === '零') {
        // 万和亿单位不删除
        if (!['万', '亿'].includes(resultAr[resultAr.length - 1])) {
          resultAr.pop()
        }
        // 前面有零在删掉一个零
        if (resultAr[resultAr.length - 1] === '零') {
          resultAr.pop()
        }
      }
      resultAr.push(capital)
      // 过滤存在【零万】【零亿】这种情况
      if (['万', '亿'].includes(resultAr[resultAr.length - 2]) && capital === '零') {
        resultAr.pop()
      }
      // 过滤【1亿万】这种情况
      if (resultAr[0] === '万' && resultAr[1] === '亿') {
        resultAr.shift()
      }
      // 末尾【零】删掉
      if (resultAr[0] === '零') {
        resultAr.pop()
      }
      resultAr.push(unitAr[idx++])
      turnNum(num, percent * 10, --index)
    }
  }
  turnNum(num, percent, index)
  return resultAr.reverse().join('')
}

/**
 * 计算两个时间差经历的时间的文字描述
 * @param {*} timestamp - 毫秒
 */
export const timeCalculate = ( start, end ) => {
  const label = ['分钟', '小时', '天', '月', '年']
  const unit = [60, 60, 24, 30, 12]
  let restTime = Math.floor( ( end - start ) / 1000 )
  let res = ''
  for ( let i = 0, len = unit.length; i < len; i++ ) {
    const pos = len - i // 从年开始算，分钟换算成年 === Math.pow(60, 4)
    const temp = unit.slice( 0, pos ).reduce( ( p, c ) => p * c, 1 )
    const time = Math.floor( restTime / temp )
    time > 0 && ( res += time + label[pos - 1] )
    restTime -= time * temp
  }
  return res
}


/**
 * 简易防抖函数
 * @param {Function} func -防抖目标函数
 * @param {Number}} gap - 防抖时间间隔
 */
export const debounce = ( func, gap ) => {
  let timer
  return function () {
    timer && clearTimeout( timer )
    timer = setTimeout( () => {
      func.apply( this, arguments )
    }, gap )
  }
}
/**
 * 下划线转驼峰
 * @param {String} name - 字符串
 */
export const toHump = name => name.replace( /\_(\w)/g, function ( all, letter ) {
  return letter.toUpperCase()
} )
/**
 * 将用户输入的连续单个数字合并为一个数
 * @param {Array} expressions - 记录计算表达式的数组
 * @returns {Array} 新的数组
 */
export const mergeNumberOfExps = expressions => {
  const res = []
  const isNumChar = n => /^[\d|\.]$/.test( n )
  for ( let i = 0; i < expressions.length; i++ ) {
    if ( i > 0 && isNumChar( expressions[i - 1] ) && isNumChar( expressions[i] ) ) {
      res[res.length - 1] += expressions[i]
      continue
    }
    res.push( expressions[i] )
  }
  return res
}
/**
 * 校验表达式是否符合计算法则
 * @param {Array} expressions - 合并数字后的表达式数组
 * @returns {Boolean}
 */
export const validExp = ( expressions, mergeNum = true ) => {
  const temp = mergeNum ? mergeNumberOfExps( expressions ) : expressions
  const arr = temp.filter( t => !'()'.includes( t ) )
  // 去括号后 length应该为奇数  并且第一个字符和最后一个字符应该为数字而非计算符号
  if ( temp.length % 2 === 0 || arr.length % 2 === 0 || Number.isNaN( +arr[0] ) || Number.isNaN( +arr[arr.length - 1] ) ) {
    return false
  }
  for ( let i = 0; i < arr.length - 1; i += 2 ) {
    if ( typeof ( +arr[i] ) !== 'number' || !Number.isNaN( +arr[i + 1] ) ) return false
  }
  return true
}

/**
 * 中缀转后缀（逆波兰 Reverse Polish Notation）
 * @param {Array} exps - 中缀表达式数组
 */
export const toRPN = exps => {
  const s1 = [] // 符号栈
  const s2 = [] // 输出栈
  const getTopVal = ( stack ) => stack.length > 0 ? stack[stack.length - 1] : null
  const levelCompare = ( c1, c2 ) => {
    const getIndex = c => ['+-', '×÷', '()'].findIndex( t => t.includes( c ) )
    return getIndex( c1 ) - getIndex( c2 )
  }
  exps.forEach( t => {
    if ( typeof t === 'string' && Number.isNaN( Number( t ) ) ) { // 是符号
      if ( t === '(' ) {
        s1.push( t )
      } else if ( t === ')' ) {
        let popVal
        do {
          popVal = s1.pop()
          popVal !== '(' && s2.push( popVal )
        } while ( s1.length && popVal !== '(' )
      } else {
        let topVal = getTopVal( s1 )
        if ( !topVal ) { // s1 为空 直接push
          s1.push( t )
        } else {
          while ( topVal && topVal !== '(' && levelCompare( topVal, t ) >= 0 ) { // 优先级 >= t 弹出到s2
            s2.push( s1.pop() )
            topVal = getTopVal( s1 )
          }
          s1.push( t )
        }
      }
      return
    }
    s2.push( t ) // 数字直接入栈
  } )
  while ( s1.length ) {
    s2.push( s1.pop() )
  }
  return s2
}
/**
 * 计算后缀表达式的值
 * @param {Array} rpnExps - 后缀表达式
 */
export const calcRPN = rpnExps => {
  rpnExps = rpnExps.concat()
  const calc = ( x, y, type ) => {
    let a1 = Number( x ), a2 = Number( y )
    switch ( type ) {
      case '+': return a1 + a2;
      case '-': return a1 - a2;
      case '×': return a1 * a2;
      case '÷': return a1 / a2;
    }
  }
  for ( let i = 2; i < rpnExps.length; i++ ) {
    if ( '+-×÷'.includes( rpnExps[i] ) ) {
      let val = calc( rpnExps[i - 2], rpnExps[i - 1], rpnExps[i] )
      rpnExps.splice( i - 2, 3, val )
      i = i - 2
    }
  }
  return rpnExps[0]
}
