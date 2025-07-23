<template>
  <el-dialog
    title="提醒设置"
    width="860px"
    :visible="dialogBool"
    :before-close="dialogClose">
    <div class="el-dialog-div">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="140px"
        class="demo-ruleForm"
        :label-position="'right'" 
        size="mini">
        <el-row :gutter="20" v-for="(item,index) in dataList" :key="index">
          <el-col :span="24">
            <el-form-item :label="typeList[item.type]">
              <el-radio-group style="display: flex; align-items: center;" v-model="item.remind_type">
                <el-radio :label="1">不提醒</el-radio>
                <el-radio :label="2">仅当天提醒</el-radio>
                <el-radio :label="3" v-show="item.type != 5">
                  提前提醒，当天再次提醒。提前
                  <el-input-number v-model="item.before_day" :min="0" :controls="false" :precision="0" label="描述文字"></el-input-number>
                  天提醒
                </el-radio>
                <el-input 
                  v-model="item.notice_content" 
                  v-show="item.type == 5"
                  type="textarea" 
                  placeholder="请输入祝福内容"
                  :autosize="{minRows: 4, maxRows: 4}"
                ></el-input>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col>
            <el-divider></el-divider>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogClose" size="mini">取 消</el-button>
      <el-button type="primary" @click="updatePlaybill('ruleForm')" size="mini">保 存</el-button>
    </span>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
export default {
  components: {},
  props: {
    dialogBool: Boolean,
  },
  data() {
    return {
      ruleForm: {},
      rules: {},
      typeList: {
        1: '待离职',
        2: '合同到期',
        3: '生日',
        4: '退休',
        5: '生日提醒内容设置',
      },
      dataList: [
        {
          id: 0,
          type: 1,
          remind_type: 1,
          before_day: 0,
          notice_content: '',
        },
        {
          id: 0,
          type: 2,
          remind_type: 1,
          before_day: 0,
          notice_content: '',
        },
        {
          id: 0,
          type: 3,
          remind_type: 1,
          before_day: 0,
          notice_content: '',
        },
        {
          id: 0,
          type: 4,
          remind_type: 1,
          before_day: 0,
          notice_content: '',
        },
        {
          id: 0,
          type: 5,
          remind_type: 1,
          before_day: 0,
          notice_content: '',
        },
      ],
    };
  },
  watch: {
    dialogBool(bool) {
      if (bool) {
        this.loadData();
      }else {
        Object.assign(this.$data, this.$options.data())
      }
    },
  },
  methods: {
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    loadData() {
      this.loading = true;
      this.$client.GetListErpUserCare()
        .then(res => {
          this.loading = false;
          if (res.head.result == "200") {
            this.dataList = res.context.list.length ? res.context.list : this.dataList
          } else {
            this.loading = false;
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
        }).catch(err => {
           this.$message({
            showClose: true,
            message: err.body.message,
            type: "error",
          });
        })
    },
    updatePlaybill() {
      this.$client
        .BatchModifyErpUserCare(this.dataList)
        .then((res) => {
          if (res.head.result == "200") {
            this.dialogClose();
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "success",
            });
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
        })
        .catch((err) => {});
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>


