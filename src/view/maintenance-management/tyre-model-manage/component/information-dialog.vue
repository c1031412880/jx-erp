<template>
  <el-dialog
    :visible="dialogBool"
    :title="title"
    :before-close="dialogClose"
    width="600px"
    
  >
    <div class="el-dialog-div">
      <el-form :model="form" :rules="basicRules" ref="form" label-width="140px" size="mini">
        <el-form-item label="规格型号:" prop="material_id">
          <!-- <el-input v-model="form.name" placeholder="请输入轮胎规格型号"></el-input> -->
          <el-select v-model="form.material_id" @change="changeModel" clearable placeholder="请选择轮胎品种">
            <el-option
              v-for="item in tyreSpecificationOptions"
              :key="item.id"
              :label="item.specification"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="轮胎品种:" prop="type">
          <el-select v-model="form.type" clearable placeholder="请选择轮胎品种">
            <el-option
              v-for="item in tyreClassifyOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="工作气压(Kpa):" prop="work_kpa">
          <el-input v-model="form.work_kpa" placeholder="请输入工作气压(Kpa)" oninput="value=value.replace(/[^\d.-]/g,'')" @blur="form.work_kpa = $event.target.value"></el-input>
        </el-form-item>
        <el-form-item label="花纹:" prop="lines">
          <el-select v-model="form.lines" clearable placeholder="请选择轮胎花纹">
            <el-option
              v-for="item in figureTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="轮胎厂牌:" prop="firm">
          <el-input v-model="form.firm" placeholder="请输入轮胎厂牌"></el-input>
        </el-form-item>
        <el-form-item label="轮胎品牌:" prop="brand">
          <el-input v-model="form.brand" placeholder="请输入轮胎品牌"></el-input>
        </el-form-item>
        <el-form-item label="保修方式:" prop="warranty_mode">
          <el-select v-model="form.warranty_mode" clearable placeholder="请选择保修方式">
            <el-option
              v-for="item in repairsTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
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
      tyreClassifyOptions: [
        {
          value: 1,
          label: "高压轮胎",
        },
        {
          value: 2,
          label: "低压轮胎",
        }
      ],
      figureTypeOptions:[
        {
          value: 1,
          label: "横向",
        },
        {
          value: 2,
          label: "纵向",
        },
        {
          value: 3,
          label: "交叉",
        }
      ],
      repairsTypeOptions:[
        {
          value: 1,
          label: "厂家负责",
        },
        {
          value: 2,
          label: "一年包换",
        },
      ],
      tyreSpecificationOptions: [],
      form: {
        id: "",
        material_id: "",
        type: "",
        work_kpa: "",
        lines: "",
        firm: "",
        brand: "",
        warranty_mode: "",
        remark: "",
      },
      basicRules: {
        material_id: [
          { required: true, message: "请选择轮胎型号", trigger: "change" },
        ]
      },
    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        Object.assign(this.$data, this.$options.data());
      }else {
        this.getTyreModelList();
      }
    },
  },
  methods: {
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    getTyreModelList() {
      this.$client.GetMaterialsTyreModel().then((res) => {
        if (res.head.result === "200") {
          this.tyreSpecificationOptions = res.context.list
        }
      })
    },
    // 选择轮胎型号时，根据轮胎型号获取轮胎型号信息
    changeModel(val) {
      let data = this.tyreSpecificationOptions.filter(item => {
        return item.id === val
      })
      this.form.brand = data[0].brand
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
.el-dialog-div /deep/ .el-input {
  width: 420px;
}
</style>

