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
      <el-form-item label="审批名称" prop="name">
        <el-input
          v-model="formData.name"
          placeholder="请输入审批名称"
          clearable
          :style="{width: '100%'}"
        ></el-input>
      </el-form-item>
      <el-form-item label="流程类型">
        <el-select v-model="formData.type">
          <el-option label="表单流程" :value="1"></el-option>
          <el-option label="固定流程" :value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="固定类型" prop="object_id" v-if="formData.type === 2">
       <el-select v-model="formData.object_id">
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
        >
          <el-option :label="item.label" :value="Number(item.id)" v-for="item in contactFormOptions" :key="item.id"></el-option>
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="是否允许加签">
        <el-select v-model="formData.is_add_check" placeholder="请选择是否允许加签">
          <el-option label="否" :value="0"></el-option>
          <el-option label="是" :value="1"></el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item label="审批说明">
        <el-input
          v-model="formData.remark"
          type="textarea"
          placeholder="请输入审批说明"
          :maxlength="100"
          show-word-limit
          :autosize="{minRows: 4, maxRows: 4}"
          :style="{width: '100%'}"
        ></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import getSelectDictionaries from "@/components/base/formModel/select/get-select-dictionaries";
export default {
  components: {getSelectDictionaries},
  props: ["tabName"],
  data() {
    return {
      dialogVisible: false,
      formData: {
        id: 0,
        name: "",
        remark: "",
        type:1,
        object_id: '',
        user: 1,
        // is_add_check:0
      },
      rules: {
        name: [
          {
            required: true,
            message: "请输入审批名称",
            trigger: "blur"
          }
        ],
        object_id: [
          {
            required: true,
            message: "请选择关联表单",
            trigger: "blur"
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
      if (val) {
        //传进来的val是select组件选中的value值，也就是一个fruitEnName
        this.$emit("on-change", val);
      }
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
  height: calc(100% - 5px);
  margin: auto;
  background: white;
  padding: 16px;

  >>>.el-form--label-top .el-form-item__label {
    padding-bottom: 0;
  }
}
</style>>

