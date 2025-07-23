import config from './config'

export default function mapDistrict () {
  this.DataMapRelat = {}
  this.DataMapParent = {}
  this.DataMap = {}
  this.name = ''
  this.ids = ''
  let map = config.districts
  this.setDataRelat(map[0])
  this.init()
}

// 数值初始化
mapDistrict.prototype.init = function () {
  let arr = this.DataMapParent['100000']
  let node = this.DataMapRelat['100000']
  let newNode = {
    value: node.value,
    label: node.label,
    children: []
  }
  arr.forEach(item => {
    this.structureData(newNode, {
      value: item.value,
      label: item.label,
      children: null
    })
  })
  this.DataMap = newNode
}

// 获取值
mapDistrict.prototype.getData = function () {
  return JSON.parse(JSON.stringify(this.DataMap.children))
}

// 初始化关系字典
mapDistrict.prototype.setDataRelat = function (map, parent) {
  this.DataMapRelat[map.adcode] = {
    value: map.adcode,
    label: map.name,
    parent: parent
  }
  if (parent) {
    if (this.DataMapParent.hasOwnProperty(parent)) {
      if (parent !== map.adcode) {
        this.DataMapParent[parent].push({
          value: map.adcode,
          label: map.name,
          parent: parent
        })
      }
    } else {
      if (parent !== map.adcode) {
        this.DataMapParent[parent] = [{
          value: map.adcode,
          label: map.name,
          parent: parent
        }]
      }
    }
  }
  if (map.districts) {
    for(let i=0,length = map.districts.length;i<length;i++) {
      let item = map.districts[i]
      this.setDataRelat(item, map.adcode)
    }
  }
}

// 获取组织名称
mapDistrict.prototype.setName = function (node, name = '') {
  name = name ? `${node.label}/${name}` : node.label
  this.name = name
  if (node.parent) {
    let item = this.DataMapRelat[node.parent]
    if (item.value !== '100000' && item) {
      this.setName(item, name)
    }
  }
}

// 获取id
mapDistrict.prototype.setValue = function (node, id = '') {
  id = id ? `${node.value}/${id}` : node.value
  this.ids = id
  if (node.parent) {
    let item = this.DataMapRelat[node.parent]
    if (item.value !== '100000' && item) {
      this.setValue(item, id)
    }
  }
}

// 根据节点返回组合节点名称
mapDistrict.prototype.outName = function (value) {
  let name = ''
  this.name = ''
  if (this.DataMapRelat[value]) {
    this.setName(this.DataMapRelat[value], name)
  }
  return this.name
}

// 根据节点返回组合节点value集合
mapDistrict.prototype.outValues = function (value) {
  let id = ''
  this.ids = ''
  if (this.DataMapRelat[value]) {
    this.setValue(this.DataMapRelat[value], id)
  }
  return this.ids.split("/")
}

// 初始化对象
mapDistrict.prototype.structureData = function (node, item) {
  let arr = this.DataMapParent[item.value] || []
  if (node.children) {
    node.children.push(item)
  } else {
    node.children = [item]
  }
  arr.forEach(newItem => {
    this.structureData(item, {
      value: newItem.value,
      label: newItem.label,
      children: null
    })
  })
}




