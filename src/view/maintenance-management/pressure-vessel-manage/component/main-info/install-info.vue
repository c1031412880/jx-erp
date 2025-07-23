<template>
  <div class="install-info" style="height:400px;overflow-x:hidden">
      <el-form ref="elForm" :model="formData" :rules="rules" size="mini" label-width="129px">
        <div v-if="status == 'container_1' || status == 'container_2'">
           <el-form-item label="更换类型:" prop="type" v-if="curChangeType != 'detail'">
            <el-radio-group v-model="formData.type" @change="changeRadio" :disabled="curChangeType=='detail'">
              <el-radio :label="1" :disabled="status == 'container_1' || status == 'container_3'">安装</el-radio>
              <el-radio :label="2" v-if="curChangeType == 'edit'" :disabled="status == 'container_2'  || status == 'container_3'">拆卸</el-radio>
              <el-radio :label="3" v-if="curChangeType == 'edit'" :disabled="status == 'container_2'  || status == 'container_3'">更换车辆</el-radio>
            </el-radio-group>
          </el-form-item>

          <div v-if="formData.type == 1">
            <el-form-item label="安装车辆:" prop="install_vehicle_id">
              <get-vehicle-select-tree
                ref="vehicleTree"
                :width="'380'"
                :disabled="curChangeType=='detail'"
                :placeholder="'选择车辆'"
                :isShowCheckbox="false"
                :isExportMultiple="false"
                v-model="formData.install_vehicle_id"
              >
              </get-vehicle-select-tree>
            </el-form-item>
            <el-form-item label="安装日期:" prop="install_date">
              <el-date-picker
                v-model="formData.install_date"
                type="date"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                placeholder="选择日期"
                :disabled="curChangeType=='detail'"
              >
              </el-date-picker>
            </el-form-item>
          </div>

          <div v-if="formData.type == 2">
            <el-form-item label="当前安装车辆:" prop="dismantle_vehicle_id">
              <!-- <get-vehicle-select-tree
                ref="vehicleTree"
                :width="'380'"
                disabled
                :placeholder="'选择车辆'"
                :isShowCheckbox="false"
                v-model="formData.dismantle_vehicle_id"
              >
              </get-vehicle-select-tree> -->
              <el-input
                placeholder="选择车辆"
                v-model="vehicleName"
                disabled
              ></el-input>
            </el-form-item>
            <el-form-item label="拆卸日期:" prop="dismantle_date">
              <el-date-picker
                v-model="formData.dismantle_date"
                type="date"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                placeholder="选择日期"
                :disabled="curChangeType=='detail'"
              >
              </el-date-picker>
            </el-form-item>
          </div>
          <div v-if="formData.type == 3">
            <el-form-item label="当前安装车辆:" prop="dismantle_vehicle_id">
              <!-- <get-vehicle-select-tree
                ref="vehicleTree"
                :width="'380'"
                disabled
                :placeholder="'选择车辆'"
                :isShowCheckbox="false"
                v-model="formData.dismantle_vehicle_id"
              >
              </get-vehicle-select-tree> -->
              <el-input
                placeholder="选择车辆"
                v-model="vehicleName"
                disabled
              ></el-input>
            </el-form-item>
            <el-form-item label="新安装车辆:" prop="install_vehicle_id">
              <get-vehicle-select-tree
                ref="newVehicleTree"
                :width="'380'"
                :disabled="curChangeType=='detail'"
                :placeholder="'选择车辆'"
                :isShowCheckbox="false"
                :isExportMultiple="false"
                v-model="formData.install_vehicle_id"
              >
              </get-vehicle-select-tree>
            </el-form-item>
            <el-form-item label="安装/拆卸日期:" prop="install_date">
              <el-date-picker
                v-model="formData.install_date"
                type="date"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                placeholder="选择日期"
                :disabled="curChangeType=='detail'"
              >
              </el-date-picker>
            </el-form-item>
          </div>
          <el-form-item label="安装人员或单位:" prop="content">
            <el-input
              placeholder="请输入安装人员或单位"
              v-model="formData.content"
              :disabled="curChangeType=='detail'"
            ></el-input>
          </el-form-item>
          <el-form-item label="备注:" prop="remark">
            <el-input
              type="textarea"
              :autosize="{ minRows: 4, maxRows: 8}"
              placeholder="请输入备注"
              v-model="formData.remark"
              :disabled="curChangeType=='detail'"
            ></el-input>
          </el-form-item>
          <el-form-item label="说明:">
              <span slot="label" style="font-size: 11px;font-weight: 400;font-style: normal;color: rgba(102, 102, 102, 0.5);">说明:</span>
              <span style="font-size: 12px;font-weight: 400;font-style: normal;color: rgba(102, 102, 102, 0.5);">每一次更改安装车辆后将会更新电瓶信息到车辆信息中，并记录到历史档案中。</span>
          </el-form-item>
        </div>
       
      </el-form>
      <div class="use-table-record show-flex-box-c" style="margin:0 20px;" v-if="curChangeType != 'add'">
        <span style="font-size: 14px;color: #606266;font-weight: 700; margin-bottom:20px;">历史车辆使用记录:</span>
        <div class="table">
          <tr-table
              :selectionShow="false"
              :data="containerVehicleRecode"
              :tableHeaderList="canRendererTableHeader"
              :isShowBottomOptions="false"
              :TableHeight="TableHeight"
              :loading="loading"
              :frontFixedNum="frontFixedNum"
              :backFixedNum="backFixedNum"
            >
            <template slot-scope="scope" slot="c_lincense_plate_number">
              <span v-if="scope.data.vehicle_info">{{scope.data.vehicle_info.c_name}}</span>
            </template>
            <template slot-scope="scope" slot="c_vehicle_number">
               <span v-if="scope.data.vehicle_info">{{scope.data.vehicle_info.c_number}}</span>
            </template>
            </tr-table>
        </div>
      </div>
  </div>
</template>
<script>
import getVehicleSelectTree from "@/components/base/formModel/tree/get-vehicle-select-tree";
export default {
  components: {getVehicleSelectTree},
  props: {
    curChangeType: {
      type: String,
      default: "add",
    },
    containerVehicleRecode:[Array]//历史车辆使用记录
  },
  data() {
    return {
      formData: {
        container_id: '', //记录ID
        type: 1,
        install_vehicle_id: '',
        dismantle_vehicle_id: '',
        content: '',
        install_date: '',
        dismantle_date: '',
        remark: ''
      },
      
      rules: {
        // install_date: [
        //   {
        //     required: true,
        //     message: "安装日期",
        //     trigger: "blur",
        //   },
        // ],
        // dismantle_date: [
        //   {
        //     required: true,
        //     message: "拆卸日期",
        //     trigger: "blur",
        //   },
        // ],
      },
      frontFixedNum: 0, //前几行固定
      backFixedNum: 0, //后几行固定
      canRendererTableHeader: [
        {
          id: 1,
          label: "自编号",
          prop: "c_vehicle_number",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: true,
        },
        {
          id: 2,
          label: "车牌号",
          prop: "c_lincense_plate_number",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: true,
        },
        {
          id: 3,
          label: "安装日期",
          prop: "install",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: true,
        },
        {
          id: 4,
          label: "拆卸日期",
          prop: "dismantle",
          width: "130",
          align: "center",
          signIndex: 3,
          sortable: true,
        },
        {
          id: 5,
          label: "随车行驶里程(KM)",
          prop: "mileage",
          width: "165",
          align: "center",
          signIndex: 4,
          sortable: true,
        },
        {
          id: 6,
          label: "备注",
          prop: "remark",
          width: "130",
          align: "center",
          signIndex: 5,
          sortable: false,
        }
      ],
      data:[], //历史车辆使用记录
      TableHeight:350,
      loading:false,
      vehicleName:"",
      status: "container_2", //发动机状态 1使用中 2闲置 3已报废 4 修理中
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    // 初始化数据
    resetData(){ 
      this.$refs['elForm'].resetFields()
      this.status = "container_2";
      if(this.formData.type == 1 || this.formData.type == 2 || this.formData.type == 3) {
        // 清空当前车辆选中
        setTimeout(() => {
          this.$refs.vehicleTree.onClear()
        }, 60);
      }
      if(this.formData.type == 3) {
        // 清空新车辆选中
        this.$refs.newVehicleTree.onClear()
      }
    },
    // 选择车辆
    onSelectVehicleChange(keys, nodes) {
      if (nodes && nodes.length > 0) {

      }
    },
    // 数据回显
    setData(val){
      this.status = val.state;
      if(this.curChangeType == 'detail' && this.status != "container_3") {
        this.formData.type = 1
        if(!!val.install_vehicle) {
          this.formData.install_date = val.install_vehicle.date
          this.formData.content = val.install_vehicle.content
          this.formData.remark = val.install_vehicle.remark
        }
        setTimeout(() => {
          if(val.vehicle_info && val.vehicle_info.length > 0)
          this.$refs.vehicleTree.vehicleCheck(val.vehicle_info);
        }, 60)
        return
      }
      if(this.curChangeType == 'edit' && val.vehicle_info.length > 0) {
        this.vehicleName = val.vehicle_info[0].c_name
        this.formData.dismantle_vehicle_id = val.vehicle_info[0].i_id
      }
      if(this.status == "container_2") {
        this.formData.type =  1
      }else if(this.status == "container_1") {
        this.formData.type = 2
      }else{
        this.formData.type = 0
      }

    },
    // 选择类型给表单赋值
    changeRadio(type) {
    
      switch (type) {
        case 1:
          this.formData.install_date = "";
          this.$refs.vehicleTree.onClear()
          break;
        case 2:
          this.formData.dismantle_date = "";
          break;
        case 3:
          this.formData.install_date = "";
          this.formData.dismantle_date = "";
          this.$refs.newVehicleTree.onClear()
          break;
      }
    },
    // 给父级页面提供得获取本页数据
    getData() {

      if( this.formData.type != 2 && !!this.formData.install_vehicle_id && !this.formData.install_date) {
        this.$message({type: 'warning', message: '请选择安装日期'})
        return
      }
      // if(this.formData.type == 2 && !!this.formData.install_vehicle_id && !this.formData.dismantle_date) {
      //   this.$message({type: 'warning', message: '请选择拆卸日期'})
      //   return
      // }
      if(this.formData.type == 3) {
        this.formData.dismantle_date = this.formData.install_date
      }
      return new Promise((resolve, reject) => {
        this.$refs['elForm'].validate(valid => {
          if (!valid) {
            reject({
              result: 400,
              msg: '获取失败,带星号的为必填项'
            })
            return
          }
          resolve({ 
            formData: this.formData,
            result:200,
            msg: '获取成功'

          })
        })
      })
    },
  }
}

</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>

  .install-info /deep/ .el-input{
    width: 420px;
  }

  .install-info /deep/ .el-input--mini{
    width: 420px;
  }

  .install-info/deep/ .el-date-editor {
    width: 420px;
  }
</style>

