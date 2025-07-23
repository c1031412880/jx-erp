<template>
  <div class="setting-container">
    <el-form
      ref="elForm"
      :model="formData"
      :rules="rules"
      size="medium"
      label-width="100px"
      label-position="top"
    >
      <el-form-item label="打印模板名称" prop="temp_name">
        <el-input
          v-model="formData.temp_name"
          placeholder="请输入模板名称"
          clearable
          :style="{width: '100%'}"
          maxlength="20"
          show-word-limit
          :disabled="disabled"
        ></el-input>
      </el-form-item>
      <el-form-item label="关联表单类型">
        <el-radio-group v-model="formData.flow_type" :disabled="processType !== 'add'" @change="formData.object_id = ''">
          <el-radio :label="1">流程表单</el-radio>
          <el-radio :label="2">固定表单</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="固定类型" prop="object_id" v-if="formData.flow_type === 2">
       <el-select v-model="formData.object_id" @change="selectChanged" :disabled="processType !== 'add'">
         <el-option :label="item.label" :value="Number(item.id)" v-for="item in typeOptions" :key="item.id"></el-option>
       </el-select>
      </el-form-item>
      <el-form-item label="关联表单" prop="object_id" v-else>
        <el-select
          v-model="formData.object_id"
          placeholder="请选择选择表单"
          clearable
          filterable
          :style="{width: '100%'}"
          @change="selectChanged"
          :disabled="processType !== 'add'"
        >
          <el-option :label="item.label" :value="Number(item.id)" v-for="item in contactFormOptions" :key="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="模板说明">
        <el-input
          v-model="formData.c_remark"
          type="textarea"
          placeholder="请输入模板说明"
          :maxlength="100"
          show-word-limit
          :autosize="{minRows: 4, maxRows: 4}"
          :style="{width: '100%'}"
          :disabled="disabled"
        ></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import getSelectDictionaries from "@/components/base/formModel/select/get-select-dictionaries";
export default {
  components: {getSelectDictionaries},
  props: {
    title: {
      type: String,
      default: 'basicSetting'
    },
    processType: {
      type: String,
      default: 'add'
    },
    disabled: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      dialogVisible: false,
      formData: {
        id: 0,
        temp_name: "",
        c_remark: "",
        flow_type:1,
        object_id: '',
        user: 1,
        // is_add_check:0
      },
      rules: {
        temp_name: [
          {
            required: true,
            message: "请输入模板名称",
            trigger: "blur"
          }
        ],
        object_id: [
          {
            required: true,
            message: "请选择关联表单",
            trigger: "change"
          }
        ]
      },
      contactFormOptions: [],
      optionsAll: [],
      typeOptions: []
    };
  },
  created() {
    this.getAllForm();
    this.getFlowType()
  },
  watch: {
    'formData.form_id'(val) {
      this.selectChanged(val)
    }
  },
  methods: {
    // 获取所有表单
    getAllForm() {
      this.contactFormOptions = [];
      this.$client.GetFormTypeFlowManage({}).then(req => {
        console.log("新表单接口", req);
        if (req.head.result === "200") {
          Object.keys(req.context).forEach(key => {
            this.contactFormOptions.push({
              id: key,
              label: req.context[key]
            })
          })
          this.selectChanged(this.formData.object_id)
        }
      });
    },
    // 获取流程分类
    getFlowType() {
      this.typeOptions = []
      this.$client.GetFlowTypeFlowManage({}).then(req => {
        console.log('流程分类', req)
        if (req.head.result === "200") {
          Object.keys(req.context).forEach(key => {
            this.typeOptions.push({
              id: key,
              label: req.context[key]
            })
          })
        }
      })
    },
    selectChanged(val) {
      //传进来的val是select组件选中的value值，也就是一个fruitEnName
      this.$emit("on-change", val);
    },
    // 给父级页面提供得获取本页数据得方法
    getData() {
      return new Promise((resolve, reject) => {
        this.$refs["elForm"].validate(valid => {
          if (!valid) {
            reject({ target: this.tabName });
            return;
          }
          resolve({ formData: this.formData, target: this.tabName }); // TODO 提交表单
        });
      });
    }
  }
};
</script>
<style lang="stylus" scoped>
.icon-item {
  width: 40px;
  height: 40px;
  margin: 6px;
  position: relative;
  cursor: pointer;
  opacity: 0.5;

  &.active {
    opacity: 1;
  }

  &:hover {
    opacity: 1;
  }
}

.setting-container {
  width: 600px;
  height: 100%;
  margin: auto;
  background: white;
  padding: 16px;

  >>>.el-form--label-top .el-form-item__label {
    padding-bottom: 0;
  }
}
</style>>

