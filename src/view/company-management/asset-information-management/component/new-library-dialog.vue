<template>
  <el-dialog
    :visible="dialogBool"
    :title="showTitle"
    :before-close="dialogClose"
    width="700px"
    >

    <div class="base-info">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
        :label-position="'right'"
        size="mini">
        <div class="content-box-t">
          <p style="font-size:250%;margin-left:15px;margin-bottom:15px;color:#409EFF;font-size:14px;font-weight:bold;margin-top:10px">基本信息</p>
          <div class="show-flex-box-r">
            <el-form-item label="资产编码:" prop="material_code">
              <el-input v-model="ruleForm.material_code" clearable placeholder="请输入资产编码" :disabled="this.curSelecedType === 'borrow' || this.curSelecedType === 'back'"> </el-input>
            </el-form-item>
            <el-form-item label="资产名称:" prop="material_name">
              <el-input v-model="ruleForm.material_name" clearable placeholder="请输入资产名称" :disabled="this.curSelecedType === 'borrow' || this.curSelecedType === 'back'"> </el-input>
            </el-form-item>
          </div>
          <div class="show-flex-box-r">
            <el-form-item label="所属分组:" prop="group_id">
              <get-assets-select 
                ref="driverTree1"
                v-model="ruleForm.group_id"
                :width="'220'"
                :disabled="this.curSelecedType === 'borrow' || this.curSelecedType === 'back'"
                :isShowCheckbox="false"
                :placeholder="'请选择分组'"
                :isExportMultiple="false"
              ></get-assets-select>
            </el-form-item>
            <el-form-item label="规格型号:" prop="specifications">
              <el-input v-model="ruleForm.specifications" clearable placeholder="请输入规格型号" :disabled="this.curSelecedType === 'borrow' || this.curSelecedType === 'back'"> </el-input>
            </el-form-item>
          </div>
          <div class="show-flex-box-r">
            <el-form-item label="计量单位:" prop="unit">
              <get-select-dictionaries v-model="ruleForm.unit" :classKey="'计量单位'" :placeholder="'请选择计量单位'" :disabled="this.curSelecedType === 'borrow' || this.curSelecedType === 'back'"></get-select-dictionaries>
            </el-form-item>
            <el-form-item label="购入日期:" prop="buy_date">
              <el-date-picker
                v-model="ruleForm.buy_date"
                :disabled="this.curSelecedType === 'borrow' || this.curSelecedType === 'back'"
                type="date"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </div>
          <div class="show-flex-box-r">
            <el-form-item label="金额:" prop="fee">
              <el-input v-model="ruleForm.fee" clearable placeholder="请输入金额" :disabled="this.curSelecedType === 'borrow' || this.curSelecedType === 'back'"> </el-input>
            </el-form-item>
            <el-form-item label="来源:" prop="source">
              <el-select v-model="ruleForm.source" placeholder="请选择来源" clearable  :disabled="this.curSelecedType === 'borrow' || this.curSelecedType === 'back'">
                <el-option
                  v-for="item in sourceOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="show-flex-box-r">
            <el-form-item label="备注:" prop="remark">
              <el-input type="textarea" v-model="ruleForm.remark" style="width: 540px" :disabled="this.curSelecedType === 'borrow' || this.curSelecedType === 'back'"></el-input>
            </el-form-item>
          </div>
        </div>        
        <div class="content-box-b" v-if="isShowContentBox">
          <p style="font-size:250%;margin-left:15px;margin-bottom:15px;color:#409EFF;font-size:14px;font-weight:bold;margin-top:10px">{{ curSelecedType === 'back' ? '归还信息' : '领用信息' }}</p>
          <div class="show-flex-box-r" v-if="curSelecedType === 'borrow'">
            <el-form-item :label="'领用部门'" prop="dept_id">
              <get-department-select
                ref="departmenTree"
                v-model="ruleForm.dept_id"
                :isShowCheckbox="false"
                :placeholder="'请选择部门'"
                :isContainEmp="false"
                :isExportMultiple="false"
                @on-change="onSelectChange"
              ></get-department-select>
            </el-form-item>
            <el-form-item :label="'领用人'" prop="user_id">
              <el-select v-model="ruleForm.user_id" placeholder="请先选择部门" clearable>
                <el-option
                  v-for="item in personOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="show-flex-box-r" v-if="curSelecedType === 'back'">
            <el-form-item :label="'归还部门'" prop="dept_name">
              <el-input v-model="ruleForm.dept_name" placeholder="暂无" clearable  :disabled="true"></el-input>
            </el-form-item>
            <el-form-item :label="'归还人'" prop="user_name">
              <el-input v-model="ruleForm.user_name" placeholder="暂无" clearable  :disabled="true"></el-input>
            </el-form-item>
          </div>
          <div class="show-flex-box-r">
            <el-form-item :label="curSelecedType === 'back' ? '归还时间' : '领用时间'">
              <el-date-picker
                v-model="date"
                type="date"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </div>
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
import { formatDateTime } from '@/utils/index'
import getAssetsSelect from 'components/base/formModel/tree/get-assets-select-tree'
import getSelectDictionaries from "@/components/base/formModel/select/get-select-dictionaries";
import getDepartmentSelect from "@/components/base/formModel/tree/get-department-select-tree";
export default {
  components: { getAssetsSelect, getSelectDictionaries, getDepartmentSelect},
  props: {
    dialogBool: {
      type: Boolean,
      default: false
    },
    curSelecedType: { 
      type: String,
      default: 'add'
     },
  },
  data() {
    return {
      showTitle: "",
      isShowContentBox: false,
      sourceOptions: [{value: '1',label: '采购'}, {value: '2',label: '赠送'}, {value: '3',label: '调入'}],
      personOptions: [],
      date: formatDateTime(new Date()),
      ruleForm: {
        state: 0,
        material_code: '',
        material_name: '',
        group_id: '',
        specifications: '',
        unit: '',
        buy_date: formatDateTime(new Date()),
        fee: '',
        source: '',
        remark: '',
        user_id: '',
        dept_id: '',
        user_name: '',
        dept_name: '',
      },
      rules: {},
      rulesAddEdit: {
        material_code: [
          { required: true, message: "请输入物料编号", trigger: "change" },
        ],
        material_name: [
          { required: true, message: "请输入物料名称", trigger: "change" },
        ],
        group_id: [
          { required: true, message: "请选择所属分组", trigger: "change" },
        ],
        buy_date: [
          { required: true, message: "请选择购入日期", trigger: "change" },
        ],
      },
      rulesBorrow: {
        dept_id: [
          { required: true, message: "请选择使用部门", trigger: "change" },
        ],
        user_id: [
          { required: true, message: "请选择使用人员", trigger: "change" },
        ]
      },
      rulesBack: {
        dept_name: [
          { required: true, message: "请选择使用部门", trigger: "change" },
        ],
        user_name: [
          { required: true, message: "请选择使用人员", trigger: "change" },
        ]
      }
    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        Object.assign(this.$data, this.$options.data());
      } else {
        this.configTitle();
        this.$nextTick(() => {
          this.$refs.ruleForm.resetFields();
          this.$refs.ruleForm.clearValidate();
        });
      }
    }
  },
  mounted() {
    
  },
  methods: {
    onSelectChange(vehs, nodes) {
      this.personOptions = []
      this.ruleForm.user_id = ''
      if(!vehs[0]) {
        return false
      }
      let params = { dept_id: vehs[0]}
      this.$client.getDeptPerson(params)
      .then(res => {
        if (res.head.result == "200") {
          // console.log(res);        
          this.personOptions = res.context;
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
      }).catch(err => {

      })
    },
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    configTitle() {
      switch (this.curSelecedType) {
        case "add":
          this.isShowContentBox = false
          this.rules = { ...this.rulesAddEdit}
          this.showTitle = '资产入库'
          break;
        case "edit":
          this.isShowContentBox = false;
          this.rules = { ...this.rulesAddEdit}
          this.showTitle = '资产入库'
          break;
        case "borrow":
          this.isShowContentBox = true;
          this.rules = { ...this.rulesAddEdit, ...this.rulesBorrow}
          this.showTitle = '领用'
          break;
        case "back": //删除
          this.isShowContentBox = true;
          this.rules = { ...this.rulesAddEdit, ...this.rulesBack}
          this.showTitle = '归还'
      }
    },
    updatePlaybill(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let info = {};
          for (let i in this.ruleForm) {
            if (this.ruleForm[i]) {
              info[i] = this.ruleForm[i];
            }
          }
          if(this.curSelecedType === 'add') {
            delete info.dept_id
            delete info.user_id
          }
          if(this.curSelecedType === 'borrow') {
            info = {
              assets_id: this.ruleForm.id,
              user_id: this.ruleForm.user_id,
              dept_id: this.ruleForm.dept_id,
              borrow_date: this.date
            }
          }
          if(this.curSelecedType === 'back') {
            info = {
              assets_id: this.ruleForm.id,
              back_date: this.date
            }
          }
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
.base-info /deep/ .el-input__inner {
  width: 220px
}

/deep/ .el-dialog .el-dialog__header {
  background-color: #F5F5F5;
  padding: 12px 20px;

  .el-dialog__title {
    font-size: 16px;
  }
}

</style>


