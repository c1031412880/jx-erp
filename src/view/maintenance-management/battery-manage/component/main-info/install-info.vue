<template>
  <div class="install-info" style="height:400px;overflow-x:hidden">
      <el-form ref="formData" :model="formData" :rules="rules" size="mini" label-width="129px">
        <div v-if="status == 1 || status == 2">
          <el-form-item label="更换类型:" prop="oper_type" v-if="curChangeType != 'detail'">
            <el-radio-group v-model="formData.oper_type" @change="changeRadio" :disabled="curChangeType == 'detail'">
              <el-radio :label="1" :disabled="status == 1 || status == 3">安装</el-radio>
              <el-radio :label="2" :disabled="status == 2  || status == 3" v-if="curChangeType == 'edit'">拆卸</el-radio>
              <el-radio :label="3" :disabled="status == 2  || status == 3" v-if="curChangeType == 'edit'">更换车辆</el-radio>
            </el-radio-group>
          </el-form-item>
          <div v-if="formData.oper_type == 1">
            <el-form-item label="安装车辆:" prop="vehicle">
              <get-vehicle-select-tree
                ref="vehicleTree"
                :width="'380'"
                :disabled="curChangeType=='detail'"
                :placeholder="'选择车辆'"
                :isShowCheckbox="false"
                :isExportMultiple="false"
                v-model="formData.vehicle"
              >
              </get-vehicle-select-tree>
            </el-form-item>
            <el-form-item label="安装日期:" prop="d_install_dismantle">
              <el-date-picker
                v-model="formData.d_install_dismantle"
                type="date"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                placeholder="选择日期"
                :disabled="curChangeType=='detail'"
              >
              </el-date-picker>
            </el-form-item>
          </div>
          <div v-if="formData.oper_type == 2">
            <el-form-item label="当前安装车辆:" prop="cars">
              <el-input
                placeholder="选择车辆"
                v-model="vehicleName"
                disabled
              ></el-input>
             
            </el-form-item>
            <el-form-item label="拆卸日期:" prop="d_install_dismantle">
              <el-date-picker
                v-model="formData.d_install_dismantle"
                type="date"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                placeholder="选择日期"
                :disabled="curChangeType=='detail'"
              >
              </el-date-picker>
            </el-form-item>
          </div>
          <div v-if="formData.oper_type == 3">
            <el-form-item label="当前安装车辆:" prop="cars">
              <el-input
                placeholder="选择车辆"
                v-model="vehicleName"
                disabled
              ></el-input>
            </el-form-item>
            <el-form-item label="新安装车辆:" prop="vehicle">
              <get-vehicle-select-tree
                ref="newVehicleTree"
                :width="'380'"
                :disabled="curChangeType=='detail'"
                :placeholder="'选择车辆'"
                :isShowCheckbox="false"
                :isExportMultiple="false"
                v-model="formData.vehicle"
              >
              </get-vehicle-select-tree>
            </el-form-item>
            <el-form-item label="安装/拆卸日期:" prop="d_install_dismantle">
              <el-date-picker
                v-model="formData.d_install_dismantle"
                type="date"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                placeholder="选择日期"
                :disabled="curChangeType=='detail'"
              >
              </el-date-picker>
            </el-form-item>
          </div>
          
          <el-form-item label="安装人员或单位:" prop="installer">
            <el-input
              placeholder="请输入安装人员或单位"
              v-model="formData.installer"
              :disabled="curChangeType=='detail'"
            ></el-input>
          </el-form-item>
          <el-form-item label="备注:" prop="remark1">
            <el-input
              type="textarea"
              :autosize="{ minRows: 4, maxRows: 8}"
              placeholder="请输入备注"
              v-model="formData.remark1"
              :disabled="curChangeType=='detail'"
            ></el-input>
          </el-form-item>
          <el-form-item label="说明:" prop="c_da_remark">
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
              :data="batBottleVehicleRecode"
              :tableHeaderList="canRendererTableHeader"
              :isShowBottomOptions="false"
              :TableHeight="TableHeight"
              :loading="loading"
              :frontFixedNum="frontFixedNum"
              :backFixedNum="backFixedNum"
            >
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
    batBottleVehicleRecode:[Array], //历史车辆使用记录
  },
  data() {
    return {
      formData: {
        oper_type: 1,
        vehicle: "",
        d_install_dismantle: '',
        installer: '',
        remark1: '',
      },
      new_cars:[],
      rules: {
        // d_mount: [
        //   {
        //     required: true,
        //     message: "请选择安装日期",
        //     trigger: "blur",
        //   },
        // ],
        // d_install_dismantle: [
        //   {
        //     required: true,
        //     message: "请选择拆卸日期",
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
          prop: "v_num",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: false,
        },
        {
          id: 2,
          label: "车牌号",
          prop: "lp_num",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: false,
        },
        {
          id: 3,
          label: "安装日期",
          prop: "install_date",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: false,
        },
        {
          id: 4,
          label: "拆卸日期",
          prop: "dismantle_date",
          width: "130",
          align: "center",
          signIndex: 3,
          sortable: false,
        },
        {
          id: 5,
          label: "随车行驶里程(KM)",
          prop: "miles",
          width: "165",
          align: "center",
          signIndex: 4,
          sortable: false,
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
      TableHeight: 350,
      loading: false,
      status: 2, //状态 1使用中 2闲置 3已报废 4 修理中
      vehicleName:"",
      curInfo: null,
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    // 初始化数据
    resetData(){ 
      this.$refs['formData'].resetFields()
      this.formData.oper_type = 1;
      this.formData.vehicle = '';
      this.formData.d_install_dismantle = '';
      this.formData.installer = '';
      this.formData.remark1 = '';
      this.status = 2;
      if(this.formData.oper_type == 1 || this.formData.oper_type == 2) {
        // 清空当前车辆选中
        setTimeout(() => {
          this.$refs.vehicleTree.onClear()
        }, 60);
      }
      if(this.formData.oper_type == 3) {
        // 清空新车辆选中
        this.$refs.newVehicleTree.onClear()
      }
      this.data = [];
    },
    // 数据回显
    setData(val){
      // alert(111)
      this.curInfo = val;
      this.status = val.i_state;
      if(!!val) {
        if(this.curChangeType == 'detail' && this.status != 3) {
          this.formData.d_install_dismantle = val.install_date || ''
          this.formData.installer = val.content || ''
          this.formData.remark1 = val.remark1 || ''
          setTimeout(() => {
            if(val.vehicle_info && val.vehicle_info.length > 0)
            this.$refs.vehicleTree.vehicleCheck(val.vehicle_info);
          }, 60)
          return
        }
      }
      if(this.curChangeType == 'edit' && val.vehicle_info.length > 0) {
        this.vehicleName = val.vehicle_info[0].c_name
        this.formData.vehicle = val.vehicle_info[0].i_id
      }
      if(this.status == 2) {
        this.formData.oper_type = 1
      }else if(this.status == 1) {
        this.formData.oper_type = 2
      }else{
        this.formData.oper_type = 0
      }
      
    },
    changeRadio(type) {
      if(!!this.curInfo) {
        switch (type) {
          case 1:
            
            break;
          case 2:
            if(this.curInfo.vehicle_info.length > 0) {
              this.formData.vehicle = this.curInfo.vehicle_info[0].i_id;
            }
            break;
          case 3:
            this.formData.vehicle = ''
            break;
        }
      }
      
    },
    // 给父级页面提供得获取本页数据
    getData() {
      if( this.formData.oper_type != 2 && !!this.formData.vehicle && !this.formData.d_install_dismantle) {
        this.$message({type: 'warning', message: '请选择安装日期'})
        return
      }
      // 如果是报废、维修 type就不传
      if(this.status == 3 || this.status == 4) {
        delete this.formData.oper_type
      }

      return new Promise((resolve, reject) => {
        this.$refs['formData'].validate(valid => {
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

