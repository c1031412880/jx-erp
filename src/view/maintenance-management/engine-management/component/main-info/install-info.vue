<template>
  <div class="install-info" style="height:400px;overflow-x:hidden">
      <el-form ref="formData" :model="formData" :rules="rules" size="mini" label-width="129px">
        <div v-if="status == 1 || status == 2">
          <el-form-item label="更换类型:" prop="type" v-if="curChangeType != 'detail'">
            <el-radio-group v-model="formData.type" @change="changeRadio" :disabled="curChangeType == 'detail'">
              <el-radio :label="1" :disabled="status == 1 || status == 3">安装</el-radio>
              <el-radio :label="2" :disabled="status == 2  || status == 3" v-if="curChangeType == 'edit'">拆卸</el-radio>
              <el-radio :label="3" :disabled="status == 2  || status == 3" v-if="curChangeType == 'edit'">更换车辆</el-radio>
            </el-radio-group>
          </el-form-item>
          <div v-if="formData.type == 1">
            <el-form-item label="安装车辆:" prop="cars">
              <get-vehicle-select-tree
                ref="vehicleTree"
                :width="'380'"
                :disabled="curChangeType=='detail'"
                :placeholder="'选择车辆'"
                :isShowCheckbox="false"
                v-model="formData.cars"
                :isExportMultiple="false"
              >
              </get-vehicle-select-tree>
            </el-form-item>
            <el-form-item label="安装日期:" prop="d_mount">
              <el-date-picker
                v-model="formData.d_mount"
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
            <el-form-item label="当前安装车辆:" prop="cars">
              <get-vehicle-select-tree
                ref="vehicleTree"
                :width="'380'"
                disabled
                :placeholder="'选择车辆'"
                :isShowCheckbox="false"
                :isExportMultiple="false"
                v-model="formData.cars"
              >
              </get-vehicle-select-tree>
            </el-form-item>
            <el-form-item label="安装日期:" prop="d_mount" v-if="curChangeType=='detail'">
              <el-date-picker
                v-model="formData.d_mount"
                type="date"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                placeholder="选择日期"
                :disabled="curChangeType=='detail'"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item label="拆卸日期:" prop="d_dismantle" v-else>
              <el-date-picker
                v-model="formData.d_dismantle"
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
            <el-form-item label="当前安装车辆:" prop="cars">
              <get-vehicle-select-tree
                ref="vehicleTree"
                :width="'380'"
                disabled
                :placeholder="'选择车辆'"
                :isShowCheckbox="false"
                :isExportMultiple="false"
                v-model="formData.cars"
              >
              </get-vehicle-select-tree>
            </el-form-item>
            <el-form-item label="新安装车辆:" prop="new_cars">
              <get-vehicle-select-tree
                ref="newVehicleTree"
                :width="'380'"
                :disabled="curChangeType=='detail'"
                :placeholder="'选择车辆'"
                :isShowCheckbox="false"
                :isExportMultiple="false"
                v-model="new_cars"
              >
              </get-vehicle-select-tree>
            </el-form-item>
            <el-form-item label="安装/拆卸日期:" prop="d_mount">
              <el-date-picker
                v-model="formData.d_mount"
                type="date"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                placeholder="选择日期"
                :disabled="curChangeType=='detail'"
              >
              </el-date-picker>
            </el-form-item>
          </div>

          <el-form-item label="安装人员或单位:" prop="c_content">
            <el-input
              placeholder="请输入安装人员或单位"
              v-model="formData.c_content"
              :disabled="curChangeType=='detail'"
            ></el-input>
          </el-form-item>
          <el-form-item label="备注:" prop="c_mount_remark">
            <el-input
              type="textarea"
              :autosize="{ minRows: 4, maxRows: 8}"
              placeholder="请输入备注"
              v-model="formData.c_mount_remark"
              :disabled="curChangeType=='detail'"
            ></el-input>
          </el-form-item>
          <el-form-item label="说明:" prop="c_da_remark">
              <span slot="label" style="font-size: 11px;font-weight: 400;font-style: normal;color: rgba(102, 102, 102, 0.5);">说明:</span>
              <span style="font-size: 12px;font-weight: 400;font-style: normal;color: rgba(102, 102, 102, 0.5);">每一次更改安装车辆后将会更新发动机信息到车辆信息中，并记录到历史档案中。</span>
          </el-form-item>
        </div>

      </el-form>
      <div class="use-table-record show-flex-box-c" style="margin:0 20px;" v-if="curChangeType != 'add'">
        <span style="font-size: 14px;color: #606266;font-weight: 700; margin-bottom:20px;">历史车辆使用记录:</span>
        <div class="table">
          <tr-table
              :selectionShow="false"
              :data="data"
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
    iState:[Number,String]
  },
  data() {
    return {
      formData: {
        type: 1,
        cars: '',
        d_mount: '',
        d_dismantle:'',
        c_content: '',
        c_mount_remark: '',
      },
      new_cars:'',
      rules: {
        // d_mount: [
        //   {
        //     required: true,
        //     message: "请选择安装日期",
        //     trigger: "blur",
        //   },
        // ],
        // d_dismantle: [
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
          prop: "vehicle_number",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: false,
        },
        {
          id: 2,
          label: "车牌号",
          prop: "vehicle_plate_number",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: false,
        },
        {
          id: 3,
          label: "安装日期",
          prop: "d_buy",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: false,
        },
        {
          id: 4,
          label: "拆卸日期",
          prop: "d_dismantle",
          width: "130",
          align: "center",
          signIndex: 3,
          sortable: false,
        },
        {
          id: 5,
          label: "随车行驶里程(KM)",
          prop: "n_mileage",
          width: "165",
          align: "center",
          signIndex: 4,
          sortable: false,
        },
        {
          id: 6,
          label: "备注",
          prop: "c_remark",
          width: "130",
          align: "center",
          signIndex: 5,
          sortable: false,
        }
      ],
      data:[], //历史车辆使用记录
      TableHeight:300,
      loading:false,
      curInfo: {}, //当前更换类型的信息
      status: 2, //发动机状态 1使用中 2闲置 3已报废 4 修理中
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    // 初始化数据
    resetData(){
      if(this.formData.type == 3) {
        // 清空新车辆选中
        this.$refs.newVehicleTree.onClear()
      }
      this.$refs['formData'].resetFields()
      this.formData.type = 1;
      this.formData.d_mount = '';
      this.formData.d_dismantle = '';
      this.formData.c_content = '';
      this.formData.c_mount_remark = '';
      this.status = 2;
      if(this.formData.type == 1 || this.formData.type == 2) {
        // 清空当前车辆选中
        setTimeout(() => {
          this.$refs.vehicleTree.onClear()
        }, 60);
      }
      this.data = [];
    },
    // 选择车辆
    onSelectVehicleChange(keys, nodes) {
      if (nodes && nodes.length > 0) {
        // if(this.formData.cars.length > 0) {
        //   this.rules.d_mount = [];
        //   this.rules.d_mount.push({
        //     required: true,
        //     message: "请选择安装日期",
        //     trigger: "blur",
        //   })
        // }
      }
    },
    // 数据回显
    setData(val){
      console.log(val)
      this.curInfo = val;
      if(!!val) {
        if(this.curChangeType == 'detail') {
          this.formData.d_mount = val.d_buy
          this.formData.c_content = val.c_content
          this.formData.c_mount_remark = val.c_remark
        }
        setTimeout(() => {
          if(val.cars && val.cars.length > 0) {
            this.formData.cars = val.cars[0].i_id
          }
          // this.$refs.vehicleTree.vehicleCheck(val.cars);
        }, 60)
        this.data = val.history;
      }
      this.status = this.iState;
      if(this.status == 2) {
        this.formData.type = 1
      }else if(this.status == 1) {
        this.formData.type = 2
      }else{
        this.formData.type = 0
      }

    },
    changeRadio() {

    },
    // 给父级页面提供得获取本页数据
    getData() {

      if( this.formData.type != 2 && !!this.formData.cars && !this.formData.d_mount) {
        this.$message({type: 'warning', message: '请选择安装日期'})
        return
      }
      // if(this.formData.type == 2 && !this.formData.d_dismantle) {
      //   delete this.formData.type
      //   delete this.formData.cars
      // }

      // if(this.formData.type == 3) {
      //   if(!!this.new_cars) {
      //     this.formData.cars = this.new_cars;
      //   }
      //   this.formData.d_dismantle = this.formData.d_mount;
      // }
      // 如果是报废、维修 type就不传
      if(this.status == 3 || this.status == 4) {
        delete this.formData.type
      }

      let form = JSON.parse(JSON.stringify(this.formData))

       if(form.type == 3) {
        if(!!this.new_cars) {
          console.log(form.cars, this.new_cars)
          form.cars = this.new_cars;
        }
        form.d_dismantle = form.d_mount;
      }
      form.cars = form.cars ? [form.cars] : [];
      console.log(form.cars, this.new_cars)

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
            formData: form,
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

