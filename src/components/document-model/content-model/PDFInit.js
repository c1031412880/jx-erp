import {chunk} from '@/utils/index'
export function PDFInit (event) {
  this.element = event ? event.nodeType === 1 ? event : null : null
  // 初始总高度
  this.allHeight = 0
  // 上部高度
  this.topHeight = 0
  // 上边距
  this.upMargin = 172.0278
  // 下边距
  this.dowMargin = 162.729
  // A4纸比例高度
  this.A4height = 1380.87
  // 一行文字高度
  this.pHeight = 47.55
  // 印章蒙层
  this.sealContent = null
  // 内容节点
  this.contentNode = null
  // 尾部节点
  this.fontEnd = null
  // 正文内容
  this.newContentArr = []

  // 初始化
  this.init()
  console.log('总体高度',this.allHeight)
  console.log('印章节点',this.sealContent)
  console.log('内容节点',this.contentNode)
  console.log('尾部节点',this.fontEnd)

  this.outContent(this.contentNode)
  this.setNodeContent()
  console.log('正文内容', this.newContentArr)
  this.setCalculationPaging()
  this.sealContent.style.top = (this.element.offsetHeight - this.sealContent.offsetHeight) + 43 + 'px'
}

// 克隆节点
function cloneNodeData(node) {
  let dom = node.cloneNode(true)
  return dom
}

// 初始化
PDFInit.prototype.init = function () {
  console.log(this.element)
  if (this.element) {
    this.element.childNodes.forEach(node => {
      if (node.className) {
        if (node.className.indexOf('seal-content') === -1) {
          this.allHeight += getDomHeight(node)
        } else {
          this.sealContent = node
        }
        if (node.className.indexOf('content-html') > -1) {
          this.contentNode = node
        }
        if (node.className.indexOf('font-end') > -1) {
          this.fontEnd = node
        }
      }
    })
  }
}

// 抽取节点内容
PDFInit.prototype.outContent = function (nodes) {
  if (nodes.childNodes.length) {
    nodes.childNodes.forEach(node => {
      this.outContent(node)
    })
  } else {
    if (nodes.nodeType !== 1) {
      if (nodes.nodeValue) {
        this.newContentArr.push(nodes.nodeValue)
      }
    } else {
      if (nodes.innerHTML.length) {
        this.newContentArr.push(nodes.innerHTML)
      }
    }
  }
}

// 分解正文内容
PDFInit.prototype.setNodeContent = function () {
  let newArr = []
  this.newContentArr.forEach(node => {
    if (node.length > 28) {
      newArr.push(...chunk(node.split(''), 28))
    } else {
      newArr.push(node.split(''))
    }
  })
  this.newContentArr = newArr
}

// 计算分页
PDFInit.prototype.setCalculationPaging = function () {
  this.topHeight = this.allHeight
  if (this.topHeight > (this.A4height - this.upMargin - this.dowMargin)) {
    this.topHeight = this.allHeight - getDomHeight(this.fontEnd) - getDomHeight(this.contentNode)
    this.contentNode.innerHTML = ''
    let pageHeader = 1
    this.newContentArr.forEach((node_data, i) => {
      if (this.topHeight + this.pHeight > (this.A4height - this.upMargin - this.dowMargin)) {
        this.contentNode.appendChild(builderDiv(this.dowMargin, pageHeader))
        this.contentNode.appendChild(builderDiv(this.upMargin))
        this.contentNode.appendChild(builderDom('p', builderDom('font', node_data.join('')), node_data.length < 28 ? 'left' : 'justify'))
        this.topHeight = this.pHeight
        pageHeader++
      } else {
        this.topHeight += this.pHeight
        this.contentNode.appendChild(builderDom('p', builderDom('font', node_data.join('')), node_data.length < 28 ? 'left' : 'justify'))
      }
      if (i + 1 === this.newContentArr.length) {
        if (this.topHeight + getDomHeight(this.fontEnd) > (this.A4height - this.upMargin - this.dowMargin)) {
          let towHeight = (this.A4height - this.upMargin) - getDomHeight(this.fontEnd)
          let oneHeight = (this.A4height - this.upMargin) - this.topHeight
          this.contentNode.appendChild(builderDiv(oneHeight))
          this.contentNode.appendChild(builderDiv(towHeight))
          this.sealContent.appendChild(builderDiv(100,pageHeader,true))
        } else {
          let height = (this.A4height - this.upMargin - this.dowMargin) - (this.topHeight + getDomHeight(this.fontEnd))
          this.contentNode.appendChild(builderDiv(height))
          this.sealContent.appendChild(builderDiv(100,pageHeader,true))
        }
      }
    })
  } else {
    this.contentNode.appendChild(builderDiv((this.A4height - this.upMargin - this.dowMargin - this.allHeight)))
    this.sealContent.appendChild(builderDiv(100,1,true))
  }
}

// 获取dom高度
function getDomHeight (dom) {
  let height = 0
  if (dom && dom.nodeType === 1) {
    height = dom.offsetHeight +
      Number(getComputedStyle(dom).marginTop.slice(0,-2)) +
      Number(getComputedStyle(dom).marginBottom.slice(0,-2))
  }
  return height
}

// 生成dom节点
function builderDom (type = 'p', content = '', align = 'justify') {
  let p = document.createElement(type)
  if (content.nodeType === 1) {
    p.style.textAlignLast = align
    p.style.letterSpacing = '-1px'
    p.append(content)
  } else {
    p.setAttribute('face', '仿宋_GB2312')
    p.setAttribute('size', '5')
    p.style.lineHeight = '1.812'
    p.innerText = content
  }
  return p
}

function builderDiv(height, pageNum = 0, json = null) {
  let div = document.createElement('div')
  div.style.height = height + 'px'
  div.style.width = '100%'
  div.style.position = 'relative'
  if (pageNum) {
    let font = document.createElement('font')
    font.setAttribute('face', '仿宋_GB2312')
    font.setAttribute('size', '7')
    font.style.lineHeight = '1'
    font.innerText = `- ${pageNum} -`
    let p = document.createElement('p')
    p.style.position = 'absolute'
    p.style.textAlignLast = (pageNum % 2 === 0) ? 'left' : 'right'
    p.style.letterSpacing = '-1px'
    if(pageNum % 2 === 0){
      p.style.left = '23px'
    } else {
      p.style.right = '23px'
    }
    p.style.bottom = '81.36px'
    p.appendChild(font)
    div.appendChild(p)
  }
  if (json) {
    div.style.position = 'absolute'
    div.style.bottom = '0px'
    if(pageNum % 2 === 0){
      div.style.left = 2.8 * 1.23 * 37.8 + 'px'
    } else {
      div.style.right = 2.8 * 1.23 * 37.8 + 'px'
    }
  }
  return div
}
