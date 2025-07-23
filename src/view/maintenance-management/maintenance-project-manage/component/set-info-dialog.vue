<template>
  <el-dialog
    :visible="dialogBool"
    :title="showTitle"
    :before-close="dialogClose"
    width="620px"
  >
    <div class="el-dialog-div">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="140px"
        class="demo-ruleForm"
        :label-position="'right'" 
        size="mini"
      >
        <el-form-item label="维修项目名称:" prop="c_name" >
          <el-input v-model="ruleForm.c_name" placeholder="请输入维修项目名称"></el-input>
        </el-form-item>
        <el-form-item label="所属类别:" prop="i_group_id" >
          <el-select style="width: 100%" v-model="ruleForm.i_group_id" placeholder="请选择所属类别">
            <el-option
              v-for="item in classifyOptions"
              :key="item.i_id"
              :label="item.c_name"
              :value="item.i_id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="编码:" prop="c_code" >
          <el-input v-model="ruleForm.c_code" placeholder="请输入编码"></el-input>
        </el-form-item>
        <el-form-item label="维修车间:" prop="maint_dept" >
          <getmaintaindep
              @on-change="getMaintDept"
              :width="'100%'"
              ref="maintainde"
              v-model="ruleForm.maint_dept"
              placeholder="选择维修车间"
            ></getmaintaindep>
        </el-form-item>
        <!-- <el-form-item label="" prop="radio" >
          <el-radio-group v-model="radio">
            <el-radio :label="1">总工时</el-radio>
            <el-radio :label="2">班组工时</el-radio>
          </el-radio-group>
        </el-form-item> -->
        <el-form-item label="工时:" prop="i_hours" >
          <el-input v-model="ruleForm.i_hours" placeholder="请输入工时" oninput="value=value.replace(/[^\d.-]/g,'')" @blur="ruleForm.i_hours = $event.target.value"></el-input>
        </el-form-item>
        <el-form-item label="班组工时:" prop="hour" label-width="120px">
          <tr-table
            :indexShow="false"
            :selectionShow="false"
            :data="ruleForm.details"
            :tableHeaderList="canRendererTableHeader"
            :isShowBottomOptions="false"
            :TableHeight="TableHeight"
            :loading="loading">
            <template slot-scope="scope" slot="hour">
              <el-input-number v-model="scope.data.hour" :min="0" :controls="false" label="请输入工时,可为空" @change="setTotalHours"></el-input-number>
            </template>
          </tr-table>
          <!-- <el-button type="primary" v-if="curSelecedType == 'eidt'"  @click="getShopList">更新班组</el-button> -->
        </el-form-item>
        <el-form-item label="单价(元):" prop="n_price" >
          <el-input v-model="ruleForm.n_price" placeholder="请输入单价(元)" oninput="value=value.replace(/[^\d.-]/g,'')" @blur="ruleForm.n_price = $event.target.value"></el-input>
        </el-form-item>
        <el-form-item label="维修保障天数(天):" prop="repair_guarantee_day" >
          <el-input v-model="ruleForm.repair_guarantee_day" placeholder="请输入维修保障天数(天)" oninput="value=value.replace(/[^\d]/g,'')" @blur="ruleForm.repair_guarantee_day = $event.target.value"></el-input>
        </el-form-item>
        <el-form-item label="备注:" prop="c_remark">
          <el-input
            type="textarea"
            :rows="4"
            placeholder="请输入备注"
            v-model="ruleForm.c_remark">
          </el-input>
        </el-form-item>
      </el-form>
    </div>

    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogClose" size="mini">取 消</el-button>
      <el-button type="primary" @click="updatePlaybill('ruleForm')" size="mini">保 存</el-button>
    </span>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import getmaintaindep from "@/components/base/formModel/select/get-maintain-dep";
import getDepartmentSelect from "@/components/base/formModel/tree/get-department-select-tree";
export default {
  components: {getmaintaindep,getDepartmentSelect},
  props: {
    dialogBool: Boolean,
    curSelecedType: [String],
    classifyOptions:[Array],//所属类别
  },
  data() {
    return {
      showTitle: "",
      radio: 1,
      canRendererTableHeader: [
        {
          id: 1,
          label: "维修车间",
          prop: "main_name",
          width: "120",
          align: "center",
          signIndex:0,
          sortable:false
        },
          {
          id: 2,
          label: "班组名称",
          prop: "shop_name",
          width: "120",
          align: "center",
          signIndex:1,
          sortable:false
        },
        {
          id: 3,
          label: "工时",
          prop: "hour",
          width: "205",
          align: "center",
          signIndex:2,
          sortable:false
        },
      ],
      TableHeight: 200,
      loading: false,
      isFirst: true,
      ruleForm: {
        i_id: 0,
        c_name: "",
        i_group_id: "",
        maint_dept: "",
        c_code: "",
        i_hours: "",
        n_price: "",
        c_remark: "",
        repair_guarantee_day: 0,
        details: []
      },
      rules: {
        c_name: [
          { required: true, message: "请填写维修项目名称", trigger: "change" },
        ],
        i_group_id: [
          { required: true, message: "请选择所属类别", trigger: "change" },
        ],
        i_hours:[
          { required: true, message: "请输入工时", trigger: "change" },
        ],
        repair_guarantee_day:[
          { required: true, message: "请输入", trigger: "change" },
        ],
      },
    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        Object.assign(this.$data, this.$options.data());
        this.$refs.ruleForm.clearValidate();
      } else {
        this.configTitle();
        this.$nextTick(() => {
          this.$refs.ruleForm.clearValidate();
        });
      }
    },
  },
  methods: {
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    configTitle() {
      if (this.curSelecedType == "add") {
        this.showTitle = "添加维修项目";  
        // this.getShopList({id:this.ruleForm.maint_dept})
      } else{
        this.showTitle = "编辑维修项目";
      }
    },
    updatePlaybill(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // console.log(this.ruleForm)
          let info = {...this.ruleForm};
          // for (let i in this.ruleForm) {
          //   if (this.ruleForm[i]) {
          //     info[i] = this.ruleForm[i];
          //   }
          // }
          this.$emit("save-add-edit",info);
        } else {
          return false;
        }
      });

    },
    getMaintDept(val) {
      // console.log(val,this.ruleForm.maint_dept, 'chusihua111111111111111111');
      if(val.id) {
        this.getShopList(val)
      }
    },
    // 获取班组
    getShopList(val) {
      if(this.curSelecedType == "eidt" && this.isFirst) {
        this.isFirst = false
        return
      }
      this.$client.getMaintainShop({dept_id:val.id}).then(res => {
        if(res.head.result == "200") {
          // console.log(res.context);
          this.ruleForm.details = []
          res.context.forEach(item => {
            this.ruleForm.details.push({
              main_name: item.main_name,
              i_main_id: item.i_main_id,
              shop_id: item.i_id,
              shop_name: item.c_name,
              hour: 0
            })
          })
          this.setTotalHours()
        }else {
          this.$message({
            type: "error",
            message: res.head.describle,
            showClose: true,
          });
        }
      })
    },
    // 计算总工时
    setTotalHours() {
      this.ruleForm.i_hours = this.ruleForm.details.reduce((pre, item) => {
        return pre += Number(item.hour) ? Number(item.hour) : 0
      },0)
    },
    
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.el-dialog__wrapper {
  // display: flex;
  // flex-direction: row;
  // justify-content: center;
  // align-items: center;
}
// .el-dialog-div {
//   height: 300px;
// }

// .el-dialog-div /deep/ .el-input {
//   width:320px;
// }

// .el-dialog-div /deep/ .el-input__inner {
//   width:320px;
// }
// .el-dialog-div /deep/ .el-date-editor .el-range-separator {
//   width 10%
// }
// .el-cascader {
//   width: 100% !important;
// }
</style>


