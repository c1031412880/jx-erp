<template>
  <div style="height: 400px; overflow-x: hidden">
    <div v-if="groupUpList.length > 0">
      <el-timeline>
        <el-timeline-item
          :timestamp="item.happen_date | setHappenDate"
          placement="top" v-for="(item,index) in groupUpList"
          :key="index"
          :icon="'el-icon-timer'"
          :color="'#6CB4FF'">
          <el-card>
            <el-button style="margin-bottom: 10px" :disabled="curSelecedType !== 'edit'" v-if="!item.happen_date" size="mini" @click="setJoinDateTime(item)">添加入会时间</el-button>
            <div style="line-height: 22px" v-html="item.content"></div>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </div>
    <div v-else>
      <el-empty description="暂无该员工成长记录"></el-empty>
    </div>
    <el-dialog
      :visible="dialogBool"
      title="添加入会时间"
      append-to-body
      width="400px">
      <div class="dialog-div">
        <el-form ref="form" :model="form" :rules="rules" size="mini">
          <el-form-item label="入会时间" prop="join_date">
            <el-date-picker
              v-model="form.join_date"
              type="date"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogBool = false">取 消</el-button>
        <el-button type="primary" @click="updatePlaybill('form')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    curSelecedType: String,
  },
  data() {
    return {
      dialogBool: false,
      groupUpList: [],
      user_id: '',
      form: {
        id: '',
        join_date: '',
      },
      rules: {
        join_date: [
          { required: true, message: "请选择时间", trigger: "change" },
        ],
      }
    };
  },

  methods: {
    // 初始化数据
    resetData(){ 
      this.groupUpList = []
      this.user_id = ''
      Object.assign(this.$data.form, this.$options.data().form)
    },
    // 数据回显
    setData(val){
      if(val) {
        this.user_id = val
        let params = {}
        params.user_id = val
        this.$client.GetByPageTradeEmployeesLife(params).then(res => {
          this.groupUpList = (!!res.context && res.context.length > 0) ? res.context: []
        })
      }
    },
    setJoinDateTime(val) {
      this.form.id = val.id
      this.dialogBool = true
    },
    updatePlaybill(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let params = {
            context: {}
          }
          params.context = Object.assign({}, this.form)
          this.$client.SetDraftRecordTradeEmployeesLife(params).then(res => {
            if(res.head.result == '200') {
              this.setData(this.user_id)
              this.$message({
                showClose: true,
                message: '添加成功',
                type: "success",
              });
              this.dialogBool = false
            }else{
              this.$message({
                showClose: true,
                message: res.head.describle,
                type: "error",
              });
            }
          })
        } else {
          return false;
        }
      });
    }
  },
  filters: {
    setHappenDate(date) {
      if(date) {
        return date.replace('T', ' ')
      }
    }
  }
};
</script>
<style lang='scss' scoped>
</style>