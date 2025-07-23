<template>
  <div class="base-info" :style="`height:${curChangeType == 'detail'?'470':'400'}px; overflow-x: hidden`">
    <el-form
      size="mini"
      :model="formData"
      :rules="rules"
      ref="formData"
      label-width="150px"
    >
      <div class="show-flex-box-r">
        <el-form-item label="入党日期:" prop="join_party">
          <el-date-picker
            v-model="formData.join_party"
            type="date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
            @change="selectedJoinTime"
            disabled
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="转正日期:" prop="positive_party">
          <el-date-picker
            v-model="formData.positive_party"
            type="date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
            disabled
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="入党时所在的党支部:" prop="ex_join_party_branch">
          <el-input v-model="formData.ex_join_party_branch" placeholder="请输入入党时所在的党支部" clearable></el-input>
        </el-form-item>
      </div>
      <div class="show-flex-box-r">
        <el-form-item label="入党介绍人:" prop="ex_references">
          <el-input v-model="formData.ex_references" placeholder="请输入党介绍人" clearable :disabled="curChangeType == 'detail'"></el-input>
        </el-form-item>
        <el-form-item label="党龄:" prop="ex_party_age">
          <el-input v-model="formData.ex_party_age"  placeholder="从转正日期开始算，自动计算更新" clearable disabled ></el-input>
        </el-form-item>
        <el-form-item label="党籍校正值:" prop="ex_revise_month">
          <el-input v-model="formData.ex_revise_month" oninput="value=value.replace(/[^\d.-]/g,'')" @blur="formData.ex_revise_month = $event.target.value" placeholder="请输入党籍校正值" clearable :disabled="curChangeType == 'detail'"><template slot="append">月</template></el-input>
        </el-form-item>
      </div>
      <div class="show-flex-box-r">
        <el-form-item label="当前所在党支部:" prop="organ_id">
          <get-party-org-select-tree
            ref="getPartyOrgSelectTree"
            :placeholder="'选择上级党组织'"
            :isShowCheckbox="false"
            v-model="formData.organ_id"
            :isExportMultiple="false"
            :width="'140'"
            :disabled="true"
          >
          </get-party-org-select-tree>
        </el-form-item>
        <el-form-item label="其它党团:" prop="ex_other_party">
          <el-input v-model="formData.ex_other_party" placeholder="请输入其它党团" clearable :disabled="curChangeType == 'detail'"></el-input>
        </el-form-item>
        <el-form-item label="加入其它党团时间:" prop="ex_in_other_date">
          <el-date-picker
            v-model="formData.ex_in_other_date"
            type="datetime"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期"
            :disabled="curChangeType == 'detail'"
          >
          </el-date-picker>
        </el-form-item>
      </div>
      <div class="show-flex-box-r">
        <el-form-item label="离开其它党团时间:" prop="ex_out_other_date">
          <el-date-picker
            v-model="formData.ex_out_other_date"
            type="datetime"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期"
            :disabled="curChangeType == 'detail'"
          >
          </el-date-picker>
        </el-form-item>
      </div>
      
    </el-form>
  </div>
</template>
<script>
import getPartyOrgSelectTree from "@/components/base/formModel/tree/get-party-org-select-tree";
export default {
  components: {
    getPartyOrgSelectTree
  },
  props: {
    curChangeType: {
      type: String,
      default: "add",
    },
  },
  data() {
    return {
      formData: {
        ex_join_party_branch: "",
        ex_references: "",
        ex_party_age: "",
        ex_revise_month: "",
        ex_other_party: "",
        ex_in_other_date: "",
        ex_out_other_date: "",

        organ_id: "",
        join_party: "",
        positive_party: "",
      },
      rules: {},
    };
  },
  watch: {},
  mounted() {},
  methods: {
    // 初始化数据
    resetData() {
      // 清空部门选中
      this.$refs["formData"].resetFields();
    },
    //算出党龄
    selectedJoinTime(val) {
      // console.log(val);
      let pamras = {
        birth_day: val
      }
      this.$client.getRelatedAge(pamras)
      .then(res => {
        console.log(res)
        if(res.head.result == '200') {
          this.formData.ex_party_age = res.context;
        }else{
          this.$message({type: 'error', message: '获取党龄失败'})
        }
      })
    },
    // 和党员基本联动
    setFormData(form) {
      this.formData.join_party = form.join_party;
      this.formData.positive_party = form.positive_party;
      this.formData.organ_id = form.organ_id;
      this.selectedJoinTime(this.formData.join_party)
    },
    // // 选择入党时间算出一年后的转为正式党员时间
    // selectedJoinTime(val) {

    // },
    // 数据回显
    setData(val) {
      // console.log(val,'sj')
      for (const key in this.formData) {
        if (Object.hasOwnProperty.call(val, key)) {
          // const element = this.formData[key];
          this.formData[key] = val[key]
        }
      }
      if(this.formData.join_party) {
        this.selectedJoinTime(this.formData.join_party)
      }
    },
    // 给父级页面提供得获取本页数据
    getData() {
      return new Promise((resolve, reject) => {
        this.$refs["formData"].validate((valid) => {
          if (!valid) {
            reject({
              result: 400,
              msg: '获取失败,带星号的为必填项'
            });
            return;
          }
          resolve({
            formData: this.formData,
            result: 200,
            msg: "获取成功",
          });
        });
      });
    },
    
  },
};
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
.base-info /deep/ .el-date-editor {
  width: 180px;
}
.base-info /deep/.el-select,.el-select--mini {
  width: 180px;
}
.base-info /deep/ .el-input,.el-input--mini{
  width: 180px;
}

.base-info /deep/ .el-textarea {
  width: 605px;
}

.base-info /deep/ .el-form-item__label {
  font-size: 12px !important;
}



</style>
