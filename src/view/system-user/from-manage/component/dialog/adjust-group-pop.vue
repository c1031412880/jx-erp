<template>
  <el-dialog
    :visible="dialogBool"
    :title="title"
    :before-close="dialogClose"
    width="420px">
    <div class="content-box">
      <ul>
        <li>
          <p>{{this.curGroupName}}</p>
          <el-tag type="info" size="mini">当前所在组</el-tag>
        </li>
        <li v-for="(item, index) in groupOptions" :key="index" @click="selectGroupHandle(item)">
          <p>{{item.label}}</p>
          <input type="radio" name="groupName" :checked="ruleForm.id == item.value">
        </li> 
      </ul>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogClose">取 消</el-button>
      <el-button type="primary" @click="updatePlaybill">保存</el-button>
    </span>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
export default {
  props: {
    dialogBool: Boolean,
    title: {
      type: String,
      default: "将「表单」移动到...",
    },
    curGroupName: [String],
    fromGroupList: [Object, Array],
  },
  data() {
    return {
      ruleForm: {
        id: "",
      },
      groupOptions: [],
    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        Object.assign(this.$data, this.$options.data());
      } else {
        this.configGroupOptions();
      }
    },
  },
  methods: {
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    configGroupOptions() {
      this.fromGroupList.forEach((item, index) => {
        if(item.c_type_name == '已停用' || item.c_type_name == this.curGroupName) {      
          if(item.c_type_name != this.curGroupName) {
            this.ruleForm.id = item.i_id
          }
        }else {
          let childObj = {
            value: item.i_id,
            label: item.c_type_name,
          };
          this.groupOptions.push(childObj);
        }
      });
    },
    selectGroupHandle(row) {
      this.ruleForm.id = row.value
    },
    updatePlaybill() {
      this.$emit('submit-adjust-group', this.ruleForm)
      this.dialogClose();
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.content-box {
  max-height: 300px;
  overflow-y: auto;
  .el-radio-group {
    width: 100%
  }
  li {
    width: 100%;
    padding: 10px;
    border: 1px #eeee solid;
    border-radius: 5px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: 10px;
    p {
      font-size: 15px
    }
  }
}
</style>
