<template>
  <el-dialog
    :visible="dialogBool"
    :title="title"
    append-to-body
    :before-close="dialogClose"
    width="860px">
    <el-form 
      :model="form" 
      :rules="changeRules" 
      ref="form" 
      label-width="140px" 
      size="mini">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="安装位置:" prop="position">
            <get-select-dictionaries
              v-model="form.position"
              :classKey="'轮胎安装位置'"
              :width="'100%'"
              :placeholder="'请选择安装位置'"
              :isMultiple="false"
            ></get-select-dictionaries>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="安装日期:" prop="install_date">
            <el-date-picker
              v-model="form.install_date"
              style="width: 100%;"
              type="date"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="随车里程(km):" prop="total_miles" v-if="curSelecedType=='change'">
            <el-input
              placeholder="随车里程"
              v-model="form.total_miles"
              disabled
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="轮胎编号:" prop="code">
            <el-select
              v-model="form.code" 
              v-if="curSelecedType=='install2'"
              placeholder="轮胎编号" 
              style="width: 100%;"
              @change="getTyreCodeInfo">
              <el-option
                v-for="(item,index) in tyreCodeList"
                :key="item.code"
                :label="item.code"
                :value="item.code">
              </el-option>
            </el-select>
            <el-input
              placeholder="轮胎编号"
              v-model="form.code"
              v-else
              :disabled="curSelecedType=='change' || curSelecedType=='install2'"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="轮胎类别:" prop="type">
            <el-select
              v-model="form.type" 
              placeholder="轮胎类别" 
              style="width: 100%;"
              :disabled="curSelecedType=='change'">
              <el-option
                v-for="(item,index) in tyreTypeList"
                :key="index"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="物料编码:" prop="tire_code">
            <el-input
              placeholder="物料编码"
              v-model="form.tire_code"
              disabled
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="物料名称:" prop="tire_name">
            <el-input
              placeholder="物料名称"
              v-model="form.tire_name"
              disabled
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="单价(元):" prop="price">
            <el-input
              placeholder="单价"
              v-model="form.price"
              disabled
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="轮胎品牌:" prop="brand">
            <el-input
              placeholder="轮胎品牌"
              v-model="form.brand"
              disabled
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="关联维修单号:" prop="repair_code">
            <el-input
              placeholder="维修工单"
              v-model="form.repair_code"
              disabled
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="备注:" prop="remark">
            <el-input
              v-model="form.remark" 
              type="textarea"
              maxlength="200"
              :rows="4"
              show-word-limit
              placeholder="请输入备注"
              :disabled="curSelecedType=='change'"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogClose">取 消</el-button>
      <el-button type="primary" @click="updatePlaybill('form')">
        {{curSelecedType=='change' ?  '确认转移' : '确认安装'}}
      </el-button>
    </span>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import { formatDate } from '@/utils'
import getTyreCode from "@/components/base/formModel/select/get-tyre-code"
import getSelectDictionaries from '@/components/base/formModel/select/get-select-dictionaries'
export default {
  components: { getTyreCode, getSelectDictionaries },
  props: {
    dialogBool: Boolean,
    title: {
      type: String,
      default: "编辑",
    },
    vehicleId: {
      type: [String, Number],
      default: 0,
    },
    curSelecedType: {
      type: String,
      default: "change",
    },
  },
  mounted() {
  },
  data() {
    return {
      tyreTypeList: [
        { label: '新胎', value: 1 },
        { label: '返修胎', value: 2 },
      ],
      tyreCodeList: [],
      form: {
        id: "",
        old_position: "",
        position: "",
        install_date: "",
        total_miles: "",
        code: "",
        type: "",
        tire_code: "",
        tire_name: "",
        price: "",
        brand: "",
        repair_code: "",
        remark: "",
      },
      basicRules: {},
      changeRules: {
        position: [
          { required: true, message: "请选择安装位置", trigger: "change" },
        ],
        install_date: [
          { required: true, message: "请选择安装日期", trigger: "change" },
        ],
      },
      installRules: {
        position: [
          { required: true, message: "请选择安装位置", trigger: "change" },
        ],
        install_date: [
          { required: true, message: "请选择安装日期", trigger: "change" },
        ],
        code: [
          { required: true, message: "请输入轮胎编号", trigger: "change" },
        ],
        type: [
          { required: true, message: "请选择轮胎类别", trigger: "change" },
        ],
      },
    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        Object.assign(this.$data.form, this.$options.data().form);
        // this.basicRules = {}
        this.tyreCodeList = []
        this.$refs.form.clearValidate()
      }else {
        this.getTyreDataList()
      }
    },
  },
  methods: {
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    // 获取闲置中的轮胎
    getTyreDataList() {
      let params = { state: 2 }
      this.$client.getByPageTyreManage(params)
        .then((res) => {
          if (res.head.result == "200") {
              this.tyreCodeList = res.context.list;
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
        })
        .catch((err) => {
            this.$message({
            showClose: true,
            message: err.body.message,
            type: "error",
          });
        });
    },
    // 回显
    setData(val, type) {
      this.basicRules = type == "change" ? this.changeRules : this.installRules
      Object.assign(this.$data.form, val);
      this.form.old_position = val.position
      if(!val.type) this.form.type = ''
      this.form.install_date = formatDate(new Date(), 'yyyy-MM-dd')
    },
    getTyreCodeInfo(val) {
      let info = this.tyreCodeList.filter(item => item.code === val)[0]
      this.form.id = info.id
      this.form.type = info.type ? info.type : ''
      this.form.tire_code = info.tire_code ? info.tire_code : ''
      this.form.tire_name = info.tire_name ? info.tire_name : ''
      this.form.price = info.price ? info.price : ''
      this.form.brand = info.tire_info && info.tire_info.brand ? info.tire_info.brand : ''
      this.form.repair_code = info.repair_code ? info.repair_code : ''
      this.form.remark = info.remark ? info.remark : ''
    },
    updatePlaybill(formName) {
      let params = {} 
      if(this.curSelecedType === 'change') {
        params = {
          vehicle_id: this.vehicleId,
          old_position: this.form.old_position,
          target_position: this.form.position,
          install_date: this.form.install_date,
        }
      }else if(this.curSelecedType === 'install') {
        params = {
          id: this.form.id,
          code: this.form.code,
          tyre_vehicle: {
            type: 1,
            tyre_id: this.form.id,
            position: this.form.position,
            install_vehicle_id: this.vehicleId,
            install_date: this.form.install_date,
            remark: this.form.remark,
          }
        }
      }else if(this.curSelecedType === 'install2') {
        params = {
          id: this.form.id,
          code: this.form.code,
          tyre_vehicle: {
            type: 1,
            tyre_id: this.form.id,
            position: this.form.position,
            install_vehicle_id: this.vehicleId,
            install_date: this.form.install_date,
            remark: this.form.remark,
          }
        }
      }
      if(this.curSelecedType === 'change' && params.old_position === params.target_position) {
        this.$message({
          showClose: true,
          message: '安装位置不能与原安装位置一致',
          type: "error",
        })
        return
      }
       this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$emit("save-change", params);
        } else {
          return false;
        }
      });
    },
  },
};
</script>
  
<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>

