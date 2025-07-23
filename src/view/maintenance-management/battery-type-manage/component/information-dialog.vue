<template>
  <el-dialog
    :visible="dialogBool"
    :title="title"
    :before-close="dialogClose"
    width="600px"
    
  >
    <div class="el-dialog-div">
      <el-form :model="form" :rules="basicRules" ref="form" label-width="140px" size="mini">
        <el-form-item label="电瓶类型:" prop="name">
          <el-input v-model="form.name" placeholder="请输入电瓶类型"></el-input>
        </el-form-item>
        <el-form-item label="电瓶种类:" prop="type">
          <el-select v-model="form.type" clearable placeholder="请选择电瓶种类">
            <el-option
              v-for="item in batteryClassifyOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="额定电压(v):" prop="rated_voltage">
          <el-input v-model="form.rated_voltage" placeholder="请输入额定电压(v)" oninput="value=value.replace(/[^\d.-]/g,'')" @blur="form.rated_voltage = $event.target.value"></el-input>
        </el-form-item>
        <el-form-item label="长度(mm):" prop="length">
          <el-input v-model="form.length" oninput="value=value.replace(/[^\d.]/g,'')" placeholder="请输入长度(mm)"></el-input>
        </el-form-item>
        <el-form-item label="宽度(mm):" prop="width">
          <el-input v-model="form.width" oninput="value=value.replace(/[^\d.]/g,'')" placeholder="请输入宽度(mm)"></el-input>
        </el-form-item>
        <el-form-item label="高度(mm):" prop="height">
          <el-input v-model="form.height" oninput="value=value.replace(/[^\d.]/g,'')" placeholder="请输入高度(mm)"></el-input>
        </el-form-item>
        <el-form-item label="重量(kg):" prop="weight">
          <el-input v-model="form.weight" oninput="value=value.replace(/[^\d.]/g,'')" placeholder="请输入重量(kg)"></el-input>
        </el-form-item>
        <el-form-item label="品牌:" prop="brand">
          <el-input v-model="form.brand" placeholder="请输入品牌"></el-input>
        </el-form-item>
        <el-form-item label="额定容量(AH):" prop="rated_capacity">
          <el-input v-model="form.rated_capacity" oninput="value=value.replace(/[^\d.]/g,'')" placeholder="请输入额定容量(AH)"></el-input>
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
      batteryClassifyOptions: [
        {
          value: 1,
          label: "锂电型",
        },
        {
          value: 2,
          label: "离子电池",
        }
      ],
      form: {
        id: "",
        name: "",
        type: "",
        rated_voltage: "",
        length: "",
        width: "",
        height: "",
        weight: "",
        brand: "",
        rated_capacity: "",
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
          this.$emit("save-add-edit-job", info);
        } else {
          return false;
        }
      });
    },
  },
};
</script>
  
<style lang="stylus" rel="stylesheet/stylus" scoped>
.el-dialog-div {
  height: 400px;
  overflow-y:scroll;
}
.el-dialog-div /deep/ .el-input {
  width: 400px;
}
</style>

