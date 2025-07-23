<template>
  <el-dialog
    :visible="dialogBool"
    :title="title"
    :before-close="dialogClose"
    width="600px"
    
  >
    <div class="el-dialog-div">
      <el-form :model="form" :rules="basicRules" ref="form" label-width="140px" size="mini">
        <el-form-item label="发动机型号:" prop="name">
          <el-input v-model="form.name" placeholder="请输入发动机型号"></el-input>
        </el-form-item>
        <el-form-item label="功率(KW):" prop="power">
          <el-input v-model="form.power" placeholder="请输入功率(KW)" oninput="value=value.replace(/[^\d.-]/g,'')"></el-input>
        </el-form-item>
        <el-form-item label="品牌:" prop="brand">
          <el-input v-model="form.brand" placeholder="请输入品牌"></el-input>
        </el-form-item>
        <el-form-item label="厂牌:" prop="firm">
          <el-input v-model="form.firm" placeholder="请输入厂牌"></el-input>
        </el-form-item>
        <el-form-item label="燃油种类:" prop="oil_type">
          <el-select v-model="form.oil_type" clearable placeholder="燃料类别">
            <el-option
              v-for="item in fuelTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="气缸数:" prop="cylinder_count">
          <el-input v-model="form.cylinder_count" oninput="value=value.replace(/[^\d.-]/g,'')" placeholder="请输入气缸数" @blur="form.cylinder_count = $event.target.value"></el-input>
        </el-form-item>
        <el-form-item label="备注:" prop="remark">
          <el-input
            v-model="form.remark" 
            type="textarea"
            maxlength="200"
            :rows="4"
            show-word-limit
            placeholder="请输入备注"></el-input>
        </el-form-item>
      </el-form>
    </div>

    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogClose">取 消</el-button>
      <el-button type="primary" @click="updatePlaybill('form')">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
export default {
  components: {},
  props: {
    dialogBool: Boolean,
    title: {
      type: String,
      default: "编辑",
    },
    curSelecedType: [String],
  },
  mounted() {
  },
  data() {
    return {
      date: [],
      fuelTypeOptions: [
        {
          value: 1,
          label: "汽油",
        },
        {
          value: 2,
          label: "柴油",
        },
        {
          value: 3,
          label: "LNG天然气",
        },
        {
          value: 4,
          label: "电动",
        },
        {
          value: 5,
          label: "油电混动",
        },
        {
          value: 6,
          label: "气电混动",
        },
      ],
      form: {
        id: "",
        name: "",
        power: "",
        brand: "",
        firm: "",
        oil_type: "",
        cylinder_count: "",
        remark: "",
      },
      basicRules: {
        name: [
          { required: true, message: "请输入发动机型号", trigger: "change" },
        ]
      },
    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        Object.assign(this.$data, this.$options.data());
      }else{
        this.$nextTick(() => {
          this.$refs.form.clearValidate();
        })
      }
    },
  },
  methods: {
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
   
    updatePlaybill(formName) {
       this.$refs[formName].validate((valid) => {
        if (valid) {
          let info = {};
          for (let i in this.form) {
            if (this.form[i]) {
              info[i] = this.form[i];
            }
          }
          this.$emit("save-add-edit-engine", info);
        } else {
          return false;
        }
      });
    },
  },
};
</script>
  
<style lang="stylus" rel="stylesheet/stylus" scoped>
.el-dialog-div /deep/ .el-input {
  width: 420px;
}
</style>

