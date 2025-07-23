<!-- 证件信息页面 -->
<template>
  <div style="height: 510px; overflow-x: hidden">
    <el-row style="margin-bottom:40px" v-for="(data,i) in listData" :key="`i${i}`">
      <el-col :span="11" :offset="item.offset || 0" style="height:300px;margin-bottom: 10px;" v-for="(item,j) in data" :key="`i${i}j${j}`">
        <div style="float:left;width: 6px;height: 18px; background: #409EFF;"></div>
        <p style="margin-left:15px;margin-bottom:15px;color:#409EFF;font-size:16px;font-weight:bold">{{item.title}}</p>
        <img-box
          action="/api/ERPWeb/VehicleManager/AddCarInfoImage"
          :imgData='$data[item.key]'
          :picturePathList="outImageS($data[item.key])"
          :ImageBoxName="item.key"
          :imageHeight="310"
          @on-add-img ='addImg'
          @on-del='deleteImg'
          @on-del-all='deleteAllImg'></img-box>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import ImgBox from '../veh-info/img-box';
export default {
  components: { ImgBox },
  data() {
    return {
      listData: [
        [
          {
            title: '行驶证',
            key: 'VehicleLicenseData',
          },
          {
            title: '车辆登记证书',
            key: 'VehRegisterData',
            offset: 1
          },
        ],
        [
          {
            title: '车辆保险单',
            key: 'VehInsuranceData',
          },
          {
            title: '免税证明',
            key: 'DutyFreeData',
            offset: 1
          },
        ],
        [
          {
            title: '检验报告合格证',
            key: 'InspectionReportData',
          },
          {
            title: '车辆购车发票',
            key: 'PurchaseInvoiceData',
            offset: 1
          },
        ],
        [
          {
            title: '车辆一致性证书',
            key: 'VehConsistentData',
          },
        ]
      ],
      VehicleLicenseData: [], //行驶证
      VehRegisterData: [], //车辆登记证书
      VehInsuranceData: [],//车辆保险单
      DutyFreeData: [], //免税证明
      InspectionReportData: [],//检验报告合格证
      PurchaseInvoiceData: [],//车辆购车发票
      VehConsistentData: [],//车辆一致性证书
      v_num: ''
    };
  },

  methods: {
    outImageS(data) {
      let list = []
      data.forEach(item => {
        if (item.id) {
          list.push(item.image_path)
        } else {
          list.push(item)
        }
      })
      return list
    },
    // 给父级页面提供得获取本页数据
    getData() {
      return new Promise((resolve, reject) => {
        let objKey = {
          1: 'VehicleLicenseData',
          2: 'VehRegisterData',
          3: 'VehInsuranceData',
          4: 'DutyFreeData',
          5: 'InspectionReportData',
          6: 'PurchaseInvoiceData',
          7: 'VehConsistentData'
        }
        let data = []
        Object.keys(objKey).forEach(key => {
          this[objKey[key]].forEach(item => {
            if (!item.id) {
              data.push({
                c_image_path: item,
                c_image_type: key
              })
            }
          })
        })
        resolve({
          formData: data,
          result:200,
          msg: '获取成功'
        })
      })
    },
    // 初始化数据
    resetData(){
      Object.assign(this.$data, this.$options.data());
    },
    loadData(v_num = this.v_num) {
      this.v_num = v_num
      this.$client.GetCarCerficateVehicleManager({
        v_num: v_num
      }).then(req => {
        if (req.head.result === '200') {
          let data = req.context
          this.outData(data)
        }
      })
    },
    // 根据类型设置图片地址
    outData(data) {
      let objKey = {
        1: 'VehicleLicenseData',
        2: 'VehRegisterData',
        3: 'VehInsuranceData',
        4: 'DutyFreeData',
        5: 'InspectionReportData',
        6: 'PurchaseInvoiceData',
        7: 'VehConsistentData'
      }
      Object.keys(objKey).forEach(key => {
        this[objKey[key]] = []
      })
      data.forEach(item => {
        this[objKey[item.image_type]].push(item)
      })
    },
    // 删除图片
    deleteImg(item, key){
      if (item.id) {
        this.$client.DeletetCarCerficateVehicleManager({context: [item.id]}).then(req => {
          this.loadData()
          if(req.head.result === "200") {
            this.$message({ message: req.head.describle, type: "success" });
          }else{
            this.$message({ message: req.head.describle, type: "error" });
          }
        })
        return false
      }
      if (this[key].indexOf(item) > -1) {
        let i = this[key].indexOf(item)
        this[key].splice(i,1)
      }
    },
    // 添加图片
    addImg(path, key) {
      this[key].push(path)
    },
    // 删除所有图片
    deleteAllImg(key){
      let imageArr = this[key]
      let ids = []
      imageArr.forEach(item => {
        if (item.id) {
          ids.push(item.id)
        }
      })
      this.$client.DeletetCarCerficateVehicleManager({context: ids}).then(req => {
        this.loadData()
        if(req.head.result === "200") {
          this.$message({ message: req.head.describle, type: "success" });
        }else{
          this.$message({ message: req.head.describle, type: "error" });
        }
      })
      this[key] = []
    }
  }
};
</script>
<style lang='scss' scoped>
</style>
