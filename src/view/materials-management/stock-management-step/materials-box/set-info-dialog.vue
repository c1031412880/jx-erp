<template>
  <el-dialog
    :visible="dialogBool"
    :title="showTitle"
    :before-close="dialogClose"
    :close-on-click-modal="false"
    append-to-body
    width="820px"
    
  >
    <div class="base-info">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="120px"
        class="demo-ruleForm"
        :label-position="'right'"
        size="mini"
      >
        <div class="show-flex-box-r">
          <el-form-item label="物料编号:" prop="code">
            <el-input v-model="ruleForm.code" :width="'420'"> </el-input>
          </el-form-item>
          <el-form-item label="物料名称:" prop="name">
            <el-input v-model="ruleForm.name" :width="'420'"> </el-input>
          </el-form-item>
        </div>
        <div class="show-flex-box-r">
          <el-form-item label="所属分组:" v-if="dialogBool">
             <get-materials-select 
                ref="driverTree1"
                v-model="ruleForm.main_id"
                :width="'390'"
                :isShowCheckbox="false"
                :placeholder="'请选择分组'"
                :isExportMultiple="false"
              ></get-materials-select>
          </el-form-item>
          <el-form-item label="商品条码:" >
            <el-input v-model="ruleForm.barcode" :width="'420'"> </el-input>
          </el-form-item>
        </div>
        <div class="show-flex-box-r">
          <el-form-item label="规格型号:" prop="specification">
            <el-input v-model="ruleForm.specification" :width="'420'"> </el-input>
          </el-form-item>
          <el-form-item label="计量单位:" prop="measure_unit">
             <get-select-dictionaries v-model="ruleForm.measure_unit" :classKey="'计量单位'" :placeholder="'请选择计量单位'"></get-select-dictionaries>
          </el-form-item>
        </div>
        <div class="show-flex-box-r">
          <el-form-item label="品牌:" >
            <el-input v-model="ruleForm.brand" :width="'420'"> </el-input>
          </el-form-item>
          <el-form-item label="关键尺寸:">
            <el-input v-model="ruleForm.key_size" :width="'420'"> </el-input>
          </el-form-item>
        </div>
        <div class="show-flex-box-r">
          <el-form-item label="厂商:">
            <el-input v-model="ruleForm.vendor" :width="'420'"> </el-input>
          </el-form-item>
          <el-form-item label="物资属性:">
            <get-select-dictionaries v-model="ruleForm.material_property" :classKey="'物资属性'" :placeholder="'请选择物资属性'"></get-select-dictionaries>
          </el-form-item>
        </div>
        <div class="show-flex-box-r">
          <el-form-item label="物料价格（元）:" >
             <el-input-number v-model="ruleForm.price" :min="0" :width="'420'"></el-input-number>
          </el-form-item>
          <el-form-item label="使用车型:" >
             <el-select multiple collapse-tags v-model="ruleForm.vehicle_kind_ids" placeholder="请输入车辆型号" clearable :style="{width: '100%'}">
              <el-option v-for="(item, index) in veh_typeOptions" :key="index" :label="item.name"
                :value="Number(item.id)"></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="show-flex-box-r">
          <el-form-item label="备注:">
            <el-input v-model="ruleForm.remark"  type="textarea" style="width: 420px"> </el-input>
          </el-form-item>
          <el-form-item label-width="0">
            <el-form-item label="是否临时物资:"  style="margin-bottom:0">
              <el-checkbox v-model="ruleForm.temp_meterial"  true-label= '1' false-label='2'></el-checkbox>
            </el-form-item>
            <el-form-item label="启用状态:" >
              <el-switch
                v-model="ruleForm.usable"
                active-color="#13ce66"
                inactive-color="#ff4949"
                active-value="1"
                inactive-value="2"
                >
              </el-switch>
            </el-form-item>
          </el-form-item>
        </div>
        <p style="font-size:250%;margin-left:15px;margin-bottom:15px;color:#409EFF;font-size:14px;font-weight:bold;margin-top:10px">安全预警设置</p>
        <div class="show-flex-box-r">
          <el-form-item label="最低库存量:">
            <el-input v-model="ruleForm.min_inventory" :width="'420'"> </el-input>
          </el-form-item>
          <el-form-item label="最高库存量:">
            <el-input v-model="ruleForm.max_inventory" :width="'420'"> </el-input>
          </el-form-item>
        </div>
        <div class="show-flex-box-r">
          <el-form-item label="安全库存量:">
            <el-input v-model="ruleForm.safty_inventory" :width="'420'"> </el-input>
          </el-form-item>
          <el-form-item label="预警值:">
            <el-input v-model="ruleForm.warn_inventory" :width="'420'"> </el-input>
          </el-form-item>
        </div>
      </el-form>
    </div>

    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogClose" size="mini">取 消</el-button>
      <el-button type="primary" @click="updatePlaybill('ruleForm')" size="mini"
        >保 存</el-button
      >
    </span>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import getMaterialsSelect from 'components/base/formModel/tree/get-materials-select'
import getSelectDictionaries from "@/components/base/formModel/select/get-select-dictionaries";
import getDepartmentSelect from "@/components/base/formModel/tree/get-department-select-tree";
export default {
  components: { getMaterialsSelect,getDepartmentSelect,getSelectDictionaries },
  props: {
    dialogBool: Boolean,
    curSelecedType: [String],
    classifyOptions: [Array], //所属类别
  },
  data() {
    return {
      electricMeterOptions: [],
      showTitle: "",
      veh_typeOptions: [],
      // use:"",
      // total_fee: "",
      ruleForm: {
        main_id:'',
        parent_id: "",
        usable:'1',
        temp_meterial:'2',
        code:'',
        name:'',
        barcode:'',
        specification:'',
        measure_unit:'',
        brand:'',
        key_size:'',
        vendor:'',
        material_property:'',
        remark:'',
        min_inventory:'',
        max_inventory:'',
        safty_inventory:'',
        warn_inventory:'',
        price: 0,
        vehicle_kind_ids: [],
        id:'',
      },
      rules: {
        code: [
          { required: true, message: "请输入物料编号", trigger: "change" },
        ],
        name: [
          { required: true, message: "请输入物料名称", trigger: "change" },
        ],
        //  specification: [
        //   { required: true, message: "请输入规格型号", trigger: "change" },
        // ],
        //  measure_unit: [
        //   { required: true, message: "请选择计量单位", trigger: "change" },
        // ],
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
      },
    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        Object.assign(this.$data, this.$options.data());
        // this.$refs.driverTree1.onClear()
        this.ruleForm.temp_meterial ='2'
        this.ruleForm.usable ='1'
      } else {
        this.configTitle();
        this.$nextTick(() => {
          // this.$refs.ruleForm.resetFields();
          // this.$refs.ruleForm.clearValidate();
        });
      }
       this.getVehType()
    },
    "ruleForm.parent_id": {
      deep: true,
      handler: function (newV, oldV) {
        this.selectedParentsId(newV);
      },
    },
  },
  computed: {
    use: function () {
      // if(this.ruleForm.this_value &&  this.ruleForm.last_value) {
      //   this.ruleForm.use = Number((this.ruleForm.this_value * 100 - this.ruleForm.last_value*100)/100).toFixed(2)
      //   return Number((this.ruleForm.this_value *100 - this.ruleForm.last_value*100)/100).toFixed(2)
      // }

      this.ruleForm.use = Number(
        (this.ruleForm.this_value * 100 - this.ruleForm.last_value * 100) / 100
      ).toFixed(2);
      return Number(
        (this.ruleForm.this_value * 100 - this.ruleForm.last_value * 100) / 100
      ).toFixed(2);
    },
    total_fee: function () {
      // if(this.ruleForm.price && this.ruleForm.use) {
      //   this.ruleForm.total_fee =  Number(((this.ruleForm.price*100) * (this.ruleForm.use*100))/10000).toFixed(2)
      //   return Number(((this.ruleForm.price*100) * (this.ruleForm.use*100))/10000).toFixed(2)
      // }
      this.ruleForm.total_fee = Number(
        (this.ruleForm.price * 100 * (this.ruleForm.use * 100)) / 10000
      ).toFixed(2);
      return Number(
        (this.ruleForm.price * 100 * (this.ruleForm.use * 100)) / 10000
      ).toFixed(2);
    },
  },
  mounted() {
    this.getVehType()
  },
  methods: {
    // 获取车辆型号列表
    getVehType(){
      this.$client.GetCarModelVehicleManager({}).then(req => {
        this.veh_typeOptions = []
        if (req.head.result === '200') {
          this.veh_typeOptions = req.context.list
          console.log(this.veh_typeOptions)
        }
      })
    },
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    configTitle() {
      if (this.curSelecedType == "add") {
        this.showTitle = "添加物料";
      } else {
        this.showTitle = "编辑物料";
      }
    },
    // 选择所属地址之后加载地址下所有的水表
    selectedParentsId(val) {
      if (!val) {
        return;
      }
      let params = {
        id: val,
      };
      this.$client.getWaterUnitChild(params).then((res) => {
        console.log(res);
        if (res.head.result == "200") {
          this.electricMeterOptions = res.context;
        } else {
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error",
          });
        }
      });
    },
    // 监听输入数字变化
    inputNumberChange(type) {
      let re = /([0-9]+.[0-9]{2})[0-9]*/;
      this.ruleForm[type] = this.ruleForm[type].replace(re, "$1");
    },

    updatePlaybill(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let info = JSON.parse(JSON.stringify(this.ruleForm))
          // if(!!info.vehicle_kind_ids && info.vehicle_kind_ids.length){
            info.vehicle_kind_ids = info.vehicle_kind_ids.toString()
          // }
          this.$emit("save-add-edit", info);
        } else {
          return false;
        }
      });
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.base-info /deep/ .el-date-editor {
  width: 250px;
}

.base-info /deep/.el-select, .el-select--mini {
  width: 250px;
}

.base-info /deep/ .el-input, .el-input--mini {
  width: 250px;
}

.base-info /deep/ .el-textarea {
  width: 620px;
}

.base-info /deep/ .el-input-number--mini {
  width: 100%;
}

.el-dialog__wrapper {
  // display: flex;
  // flex-direction: row;
  // justify-content: center;
  // align-items: center;
}

.el-dialog-div {
  height: 400px;
  overflow-y: scroll;
}

.el-dialog-div /deep/ .el-input {
  width: 320px;
}

.el-dialog-div /deep/ .el-input__inner {
  width: 320px;
}

.el-dialog-div /deep/ .el-date-editor .el-range-separator {
  width: 10%;
}

.el-cascader {
  width: 100% !important;
}
</style>


