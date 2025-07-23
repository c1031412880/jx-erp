<template>
  <div style="width:100%;height:100%;">
    <div class="map" tabindex="0">
    </div>
    <el-input
      id="pickerInput"
      v-model="addres"
      placeholder="输入关键字选取地点"
      style="width: 250px;z-index: 999;position: absolute; top: 10px; left: 10px;"
      size="mini"
      v-if="isNeedPoiPicker"
    />
  </div>
</template>

<script type="text/ecmascript-6">
  import AMap from 'AMap'
  import AMapUI from 'AMapUI'
  export default {
    name: "mapDom",
    data() {
      return {
        map: null,
        marker: null,
        lnglatXY: [], //当前点击的地图经纬度
        enclosureMap: [], // 电子围栏数据
        addres:'',
        pickerInfo:{
          source: '',
          id: '',
          name: '',
          // location: poi.location.toString(),
          location: [],
          address: ''
        }
      }
    },
    props:{
      isNeedPoiPicker:{
        type: Boolean,
        default: false
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.initMaps()
        if(this.isNeedPoiPicker) {
          this.loadSearchPoiPicker()
        }
      })
    },
    beforeDestroy() {
      if (!this.map) {
        return
      }
      this.map.destroy()
      this.map = null
    },
    methods: {
      initMaps() {
        this.map = new AMap.Map(this.$el, {
          zoom: 11,
          center: window.newHttpConfig.mapCenrter
        })
        this.map.on('click', e=> {
          this.lnglatXY = [e.lnglat.getLng(),e.lnglat.getLat()]
          this.addMarker(this.lnglatXY)
          this.pickerInfo = {
              source: '',
              id:'',
              name: '',
              location: this.lnglatXY,
              address: ''
          }
          this.regeoCode()
        });
      },
      regeoCode() {
        let geocoder = new AMap.Geocoder({
            radius: 1000 //范围，默认：500
        });
        let that = this
        geocoder.getAddress(that.lnglatXY, function(status, result) {
            if (status === 'complete'&&result.regeocode) {
                // var address = result.regeocode.formattedAddress;
                let addressComponent = result.regeocode.addressComponent

                // console.log('=======',addressComponent);
                let { street,streetNumber,township } = addressComponent
                let address = street + streetNumber
                that.pickerInfo.name = address
            }else{
                that.$message({
                  showClose: true,
                  message: '根据经纬度查询地址失败',
                  type: "error",
                });
            }
        });
      },
      addMarker(lnglatXY = []) {
        if(!this.marker){
          this.marker = new AMap.Marker();
          this.map.add(this.marker);
          console.log('添加marker')
        } else {
          this.map.remove(this.marker)
        }
        this.marker.setMap(this.map);
        this.marker.setPosition(lnglatXY)
      },
      clearMarker() {
        this.marker.setMap(null)
        this.marker = null
        this.lnglatXY = []
      },
      // 地图选址
      pickAddress(lnglatXY = [],zoomValue) {
        let zoom = zoomValue|| Math.floor(Math.random() * 7) + 11;
        this.map.setZoomAndCenter(zoom,lnglatXY)
      },
      // 加载UI组件
      uiLoad(poltgonList = []) {
        this.poltgonList = poltgonList
        AMapUI.loadUI(['misc/PathSimplifier'], (PathSimplifier) => {
          if (!PathSimplifier.supportCanvas) {
            alert('当前环境不支持 Canvas！');
            return;
          }
          this.initPage(PathSimplifier)
        })
      },
      // 绘制线路
      initPage(PathSimplifier) {
        //创建组件实例
        const {map} = this
        const pathSimplifierIns = new PathSimplifier({
          zIndex: 100,
          map: map, //所属的地图实例
          getPath: function(pathData, pathIndex) {
            //返回轨迹数据中的节点坐标信息，[AMap.LngLat, AMap.LngLat...] 或者 [[lng|number,lat|number],...]
            return pathData.path;
          },
          renderOptions: {
            // renderAllPointsIfNumberBelow: 20, //绘制路线节点，如不需要可设置为-1
            // keyPointTolerance: -1,
            eventSupport: false,
            pathLineStyle: {
              strokeStyle: "#00BE4C",//{string} 线颜色，比如 red, rgb(255,0,0), rgba(0,0,0,1)等
              lineWidth: 5, //{number}   线宽度
              borderStyle: "#207E46",//{string}  描边颜色
              borderWidth: 1,//{number}  描边宽度
              dirArrowStyle: true
            },
            keyPointStyle: {
              radius: 5, //{number} 点的半径
              fillStyle: "#fffeef", //{string}  填充色，比如 red, rgb(255,0,0), rgba(0,0,0,1)等
              strokeStyle: "#00BE4C", //{string} 描边色
              lineWidth: 3//{number} 描边宽度
            },
            startPointStyle: {
              radius: 5, //{number} 点的半径
              fillStyle: "#f8f8f9", //{string}  填充色，比如 red, rgb(255,0,0), rgba(0,0,0,1)等
              strokeStyle: "#1BB82B", //{string} 描边色
              lineWidth: 3//{number} 描边宽度
            },
            endPointStyle: {
              radius: 6, //{number} 点的半径
              fillStyle: "#f8f8f9", //{string}  填充色，比如 red, rgb(255,0,0), rgba(0,0,0,1)等
              strokeStyle: "#ED0402", //{string} 描边色
              lineWidth: 3//{number} 描边宽度
            }
          }
        });

        //这里构建两条简单的轨迹，仅作示例
        pathSimplifierIns.setData([{
          name: '轨迹0',
          path: this.poltgonList
        }])
      },
      // 电子围栏
      getEnclosure(val) {
        const polygon = new AMap.Polygon({
          path: val,
          // path: JSON.parse(item.electronic_fence_position),
          strokeColor: '#FC876F',
          strokeWeight: 4,
          strokeOpacity: 0.7,
          fillOpacity: 0.4,
          fillColor: '#1791fc',
          zIndex: 50
        })
        this.map.add(polygon)
        this.enclosureMap.push(polygon)
      },
      // 删除电子围栏
      deleteEnclosure() {
        this.map.remove(this.enclosureMap)
      },
      // 初始化搜索选择地点
      loadSearchPoiPicker() {
         AMapUI.loadUI(['misc/PoiPicker'], (PoiPicker) => {
          let poiPicker = new PoiPicker({
              //city:'杭州',
              input: 'pickerInput'
          });
          this.poiPickerReady(poiPicker)
        })
      },
      //初始化poiPicker
      poiPickerReady(poiPicker) {
         window.poiPicker = poiPicker;
         this.marker = new AMap.Marker();
         let infoWindow = new AMap.InfoWindow({
            offset: new AMap.Pixel(0, -20)
        });
         poiPicker.on('poiPicked', (poiResult) => {
          let source = poiResult.source
          let poi = poiResult.item
          this.pickerInfo = {
                  source: source,
                  id: poi.id,
                  name: poi.name,
                  // location: poi.location.toString(),
                  location: [poi.location.lng,poi.location.lat],
                  address: poi.address
              };
          this.marker.setMap(this.map);
          infoWindow.setMap(this.map);

          this.marker.setPosition(poi.location);
          infoWindow.setPosition(poi.location);
          this.addres = this.pickerInfo.name
          this.lnglatXY = [poi.location.lng,poi.location.lat]
          this.map.setCenter(new AMap.LngLat(poi.location.lng,poi.location.lat))
        })
      },
      // 回显锚点
      addPlace(row) {
        setTimeout(() => {
          this.addMarker([row.lon,row.lat])
          this.pickerInfo = {
            source: '',
            id: row.id,
            name: row.address.split('-')[0],
            location: [row.lon,row.lat],
            address: row.address.split('-')[1] || ''
          }

          this.map.setCenter(new AMap.LngLat(row.lon,row.lat))
        }, 300);

      },
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.map
  width: 100%
  height: 100%
// #keyword {
//   z-index: 1000000000000000;
// }
</style>
