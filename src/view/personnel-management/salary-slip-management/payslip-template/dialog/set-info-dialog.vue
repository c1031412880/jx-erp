<template>
  <el-dialog
    :visible="dialogBool"
    title="添加工资条模板"
    :before-close="dialogClose"
    :close-on-click-modal="false"
    append-to-body
    width="820px"
  >
    <div class="base-info">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="120px"
        :label-position="'right'"
        size="mini"
      >
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="工资模板:" prop="template_id">
              <el-select v-model="ruleForm.template_id" placeholder="请选择" style="width:100%">
                <el-option
                  v-for="item in organizationTreeList"
                  :key="item.id"
                  :label="item.template_name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="工资项目库:" prop="item_ids">
              <el-select v-model="ruleForm.item_ids" multiple placeholder="请选择" style="width:100%">
                <el-option
                  v-for="item in typeList"
                  :key="item.id"
                  :label="item.item_name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogClose" size="mini">取 消</el-button>
      <el-button type="primary" @click="updatePlaybill('ruleForm')" size="mini"
        >保 存</el-button>
    </span>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
export default {
  components: {  },
  props: {
    dialogBool: Boolean,
    organizationTreeList: [Array],
    requiredIDs: [Array]
  },
  data() {
    return {
      ruleForm: {
        template_id: '',
        item_ids: [],
      },
      rules: {
        template_id: [
          { required: true, message: "请选择工资模板", trigger: "change" },
        ],
        item_ids: [
          { required: true, message: "请选择工资项目库", trigger: "change" },
        ],
      },
      typeList: [],
    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        Object.assign(this.$data, this.$options.data());
      } else {
        this.loadOrganizationTree()
      }
    },
  },
  mounted() {
  },
  methods: {
    // 获取组织tree信息
    loadOrganizationTree() {
      this.$client.GetCheckTemplateTrees()
      .then(res => {
        if (res.head.result == "200") {
          this.typeList = res.context
        } else {
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error",
          });
        }
      })
    },
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    updatePlaybill(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let isHave = this.getInclude(this.ruleForm.item_ids,this.requiredIDs)
          if (!isHave) {
            this.$message({
              showClose: true,
              message: '工资库中姓名、手机号和实发工资必选',
              type: "warning",
            });
            return
          }
          let info = JSON.parse(JSON.stringify(this.ruleForm))
          this.$emit("save-add-edit", info,'新增成功');
        } else {
          return false;
        }
      });
    },
    // 判断 第一个数组 是否包含 第二个数组 
    getInclude(arr1,arr2) {
      let temp = []
      for (const item of arr2) {
        arr1.find(i => i == item) ? temp.push(item) : ''
      }
      return temp.length == 3 ? true : false
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>


