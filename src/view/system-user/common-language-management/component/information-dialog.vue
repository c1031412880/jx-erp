<template>
  <el-dialog
    :visible="dialogBool"
    :title="title"
    :before-close="dialogClose"
    :close-on-click-modal="false"
    width="600px"
    
  >
    <div class="el-dialog-div">
      <el-form :model="form" :rules="basicRules" ref="form" label-width="140px" size="mini">
        <el-form-item label="排序:" prop="sort">
          <el-input v-model="form.sort"  placeholder="请输入排序" clearable></el-input>
        </el-form-item>
        <el-form-item label="常用语分类:" prop="type"> 
          <get-select-dictionaries v-model="form.type" :isMultiple="false" :classKey="'常用语分类'" :placeholder="'请选择所属分组:'"></get-select-dictionaries>
        </el-form-item>
        <el-form-item label="常用语:" prop="language">
          <el-input v-model="form.language"  placeholder="请输入常用语" clearable></el-input>
        </el-form-item>
        <!-- <el-form-item label="关联审批单:" prop="form_ids">
          <el-row>
            <el-col :span="16">
              <el-select v-model="form.form_ids" filterable collapse-tags :disabled="form.is_all == 1" multiple placeholder="请选择关联审批单">
                <el-option
                  v-for="(item,index) in formList"
                  :key="index"
                  :label="item.label"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="8">
              <el-checkbox v-model="form.is_all" :true-label="1" :false-label="0">全部审批单</el-checkbox>
            </el-col>
          </el-row>
        </el-form-item> -->
        <el-form-item label="关联按键:" prop="buttons">
          <el-select v-model="form.buttons" multiple placeholder="请选择关联按键">
            <el-option
              v-for="item in buttonList"
              :key="item.id"
              :label="item.label"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>

    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogClose">取 消</el-button>
      <el-button type="primary" v-if="curSelecedType == 'add'" @click="updatePlaybill(1)">继续添加</el-button>
      <el-button type="primary" @click="updatePlaybill(2)">保 存</el-button>
    </span>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import getSelectDictionaries from "@/components/base/formModel/select/get-select-dictionaries";
import getDepartmentSelect from "@/components/base/formModel/tree/get-department-select-tree";
export default {
  components: { getDepartmentSelect, getSelectDictionaries },
  props: {
    dialogBool: Boolean,
    title: {
      type: String,
      default: "编辑",
    },
    curSelecedType: [String],
    formList: {
      type: Array,
      default: []
    }
  },
  mounted() {

  },
  data() {
    return {
      form: {
        sort: "",
        type: "",
        language: '',
        is_all: 1,
        form_ids: [],
        buttons: [1,2,3,4],
        id: 0,
      },
      buttonList:[
        { id: 1 , label: '退回'},
        { id: 2 , label: '加签'},
        { id: 3 , label: '拒绝'},
        { id: 4 , label: '同意'},
        { id: 5 , label: '乘客服务'},
      ],
      basicRules: {
        sort: [
          { required: true, message: "请输入排序", trigger: "change" },
        ],
        type: [
          { required: true, message: "请选择常用语分类", trigger: "change" },
        ],
        language: [
          { required: true, message: "请输入常用语", trigger: "change" },
        ],
        buttons: [
          { required: true, message: "请选择关联按键", trigger: "change" },
        ],
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
    updatePlaybill(type) {
       this.$refs['form'].validate((valid) => {
        if (valid) {
          let info = {...this.form};
          if (info.is_all == 0 && info.form_ids.length == 0) {
            this.$message({
              showClose: true,
              message: '关联审批单不能为空',
              type: "warning",
            });
          }
          if (Number.isNaN(Number(info.sort))) {
            this.$message({
              showClose: true,
              message: '排序必须为数字',
              type: "warning",
            });
            return
          } else {
            info.sort = Number(info.sort)
          }
          this.$emit("save-add-edit-form", info, type);
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

