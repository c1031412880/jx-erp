<template>
  <el-dialog
    :visible="dialogBool"
    :title="title"
    :before-close="dialogClose"
    width="600px"
    
  >
    <div class="el-dialog-div">
      <div class="el-dialog-div-content">
        <el-form
          :model="form"
          :rules="basicRules"
          ref="form"
          label-width="140px"
          size="mini"
        >
          <el-form-item label="日期:" prop="date">
            <el-date-picker
              v-model="form.date"
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd"
              type="date"
              placeholder="年-月-日"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="值班人员:" prop="duty_ids">
            <get-department-select
              ref="personalTreeOne"
              v-model="form.duty_ids"
              :isShowCheckbox="true"
              :placeholder="'请选择值班人员'"
              :isContainEmp="true"
              :show_all="true"
              :isExportMultiple="true"
              :width="'380'"
              :isCheckStrictly="false"
            ></get-department-select>
          </el-form-item>
          <el-form-item label="存款人员:" prop="entry_ids">
            <get-department-select
              ref="personalTreeTwo"
              v-model="form.entry_ids"
              :isShowCheckbox="true"
              :placeholder="'请选择值存款人员'"
              :isContainEmp="true"
              :show_all="true"
              :isExportMultiple="true"
              :width="'380'"
              :isCheckStrictly="false"
            ></get-department-select>
          </el-form-item>
          <el-form-item label="点钞人员:" prop="reckon_ids">
            <get-department-select
              ref="personalTreeThree"
              v-model="form.reckon_ids"
              :isShowCheckbox="true"
              :placeholder="'请选择值点钞人员'"
              :isContainEmp="true"
              :show_all="true"
              :isExportMultiple="true"
              :width="'380'"
              :isCheckStrictly="false"
            ></get-department-select>
          </el-form-item>

          <el-form-item label="五元及以上纸币:" prop="five">
            <el-input
              v-model="form.five"
              placeholder="请输入五元及以上纸币金额"
              oninput="value=value.replace(/[^\d.-]/g,'')"
              @blur="form.five = $event.target.value"
              @input="calculationAmount"
            ></el-input>
          </el-form-item>
          <el-form-item label="一元纸币:" prop="one_notes">
            <el-input
              v-model="form.one_notes"
              placeholder="请输入一元纸币金额"
              oninput="value=value.replace(/[^\d.-]/g,'')"
              @blur="form.one_notes = $event.target.value"
              @input="calculationAmount"
            ></el-input>
          </el-form-item>
          <el-form-item label="一元硬币:" prop="one_coins">
            <el-input
              v-model="form.one_coins"
              placeholder="请输入一元硬币金额"
              oninput="value=value.replace(/[^\d.-]/g,'')"
              @blur="form.one_coins = $event.target.value"
              @input="calculationAmount"
            ></el-input>
          </el-form-item>
          <el-form-item label="五角纸币:" prop="half_notes">
            <el-input
              v-model="form.half_notes"
              placeholder="请输入五角纸币金额"
              oninput="value=value.replace(/[^\d.-]/g,'')"
              @blur="form.half_notes = $event.target.value"
              @input="calculationAmount"
            ></el-input>
          </el-form-item>
          <el-form-item label="五角硬币:" prop="half_coins">
            <el-input
              v-model="form.half_coins"
              placeholder="请输入五角硬币金额"
              oninput="value=value.replace(/[^\d.-]/g,'')"
              @blur="form.half_coins = $event.target.value"
              @input="calculationAmount"
            ></el-input>
          </el-form-item>
          <el-form-item label="零头:" prop="fraction">
            <el-input
              v-model="form.fraction"
              placeholder="请输入纸币金额"
              oninput="value=value.replace(/[^\d.-]/g,'')"
              @blur="form.fraction = $event.target.value"
              @input="calculationAmount"
            ></el-input>
          </el-form-item>
          <el-form-item label="合计:" prop="tyre_number">
            <span style="color: #d9001b">{{ allMoneynumber }}</span>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <span slot="footer" class="dialog-footer" v-if="curSelecedType != 'detail'">
      <el-button @click="dialogClose">取 消</el-button>
      <el-button type="primary" @click="updatePlaybill('form')"
        >保 存</el-button
      >
    </span>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import getDepartmentSelect from "@/components/base/formModel/tree/get-department-select-tree";
export default {
  components: { getDepartmentSelect },
  props: {
    dialogBool: Boolean,
    title: {
      type: String,
      default: "编辑",
    },
    curSelecedType: [String],
  },
  mounted() {},
  data() {
    return {
      allMoneynumber: 0, //总金额
      form: {
        id: "",
        date: "",
        duty_ids: [],
        entry_ids: [],
        reckon_ids: [],
        five: "",
        one_coins: "",
        one_notes: "",
        half_coins: "",
        half_notes: "",
        fraction: "",
      },
      basicRules: {
        date: [{ required: true, message: "请选择日期", trigger: "change" }],
        duty_ids: [
          { required: true, message: "请选择值班人员", trigger: "change" },
        ],
        entry_ids: [
          { required: true, message: "请选择值存款人员", trigger: "change" },
        ],
        reckon_ids: [
          { required: true, message: "请选择点钞人员", trigger: "change" },
        ],
      },
    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        this.reastFrom()
        Object.assign(this.$data, this.$options.data());
      }else{
        if(this.curSelecedType == 'add') {
          this.setSearchtime()
        }
        this.$nextTick(()=> {
          this.$refs.form.clearValidate();
        })
      }
    },
  },
  methods: {
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    // 重置表单
    reastFrom() {
      setTimeout(() => {
        this.$refs.personalTreeOne.onClear();
        this.$refs.personalTreeTwo.onClear();
        this.$refs.personalTreeThree.onClear();
      },100)
    },
    setSearchtime() {
      let date = new Date();
      date.setTime(date.getTime()-24*60*60*1000);
      let Y = date.getFullYear()
      let M = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)
      let D = date.getDate() < 10 ? ('0' + date.getDate()) : date.getDate()
      date = Y + '-' + M + '-' + D
      this.form.date = date;
    },
    // 计算总金额
    calculationAmount() {
      // let info = Object.assign({},this.form)
      let info = { ...this.form };
      // console.log(info)
      this.allMoneynumber = 0;
      for (const key in info) {
        if (Object.hasOwnProperty.call(info, key)) {
          switch (key) {
            case "five":
            case "one_coins":
            case "one_notes":
            case "half_coins":
            case "half_notes":
            case "fraction":
              this.allMoneynumber = this.allMoneynumber + Number(info[key]);
              break;
          }
        }
      }
    },

    updatePlaybill(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let info = {...this.form};
          for (let i in info) {
            if (i == 'duty_ids' || i == 'entry_ids' || i == 'reckon_ids') {
              if(info[i].length > 0)
              info[i] = info[i].join();
            }
          }
          // console.log(info)
          // return
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
.el-dialog-div-content {
  height: 400px;
  overflow-y: scroll;
}

.el-dialog-div /deep/ .el-input {
  width: 400px;
}
</style>

