<template>
  <el-dialog
    :visible="dialogBool"
    :title="`${isShow ? '审核' : '详情'}`"
    :before-close="dialogClose"
    width="600px"
    
  >

    <div class="el-dialog-div">
      <el-card>
        <el-descriptions :column="2" :colon="Number(formSubObj.state) < 3" :title="formSubObj.title" contentClassName="title-content">
          <el-descriptions-item label="编号">{{formSubObj.code}}</el-descriptions-item>
          <el-descriptions-item label="状态" v-if="formSubObj.state != '3' && formSubObj.state != '4' && formSubObj.state != '7'">
            <el-tag
              size="small"
              type="warning"
            >{{formSubObj.state_child_name}}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item v-else >
            <img :src="urs[formSubObj.state]" class="image-badge">
          </el-descriptions-item>
        </el-descriptions>
      </el-card>
      <el-card style="margin-top: 10px">
        <el-descriptions :column="column" size="medium" :direction="column > 1 ?'horizontal' : 'vertical'">
          <el-descriptions-item
            :labelStyle="{fontSize: '13px', color: '#909399',lineHeight: '20px'}"
            :contentStyle="{fontSize: '15px',color: '#303133',fontWeight: 500, lineHeight: '20px'}"
            label="发起人部门">{{formSubObj.submit_dept}}
          </el-descriptions-item>
          <el-descriptions-item
            :labelStyle="{fontSize: '13px', color: '#909399',lineHeight: '20px'}"
            :contentStyle="{fontSize: '15px',color: '#303133',fontWeight: 500, lineHeight: '20px'}"
            :key="i" v-for="(key,i) in Object.keys(formSubObj.content_dic || {})"
            :label="key">{{formSubObj.content_dic[key]}}
          </el-descriptions-item>
        </el-descriptions>
        <el-empty v-if="!formSubObj.content_dic" description="暂无数据"></el-empty>
      </el-card>
      <el-card style="margin-top: 10px">
        <approve-schedule @out-node="setApproveNode" v-if="dialogBool" :flow_id="formSubObj.id"></approve-schedule>
      </el-card>
    </div>

    <span slot="footer" class="dialog-footer">
      <el-dropdown style="margin-right: 10px;" v-if="isShow" trigger="click" @command="dropdownChange">
        <el-button size="small">
          更多<i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="return">退  回</el-dropdown-item>
          <el-dropdown-item command="transfer">转  交</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-button size="small" @click="notOk" v-if="isShow">拒  绝</el-button>
      <el-button size="small" type="primary" @click="ok" v-if="isShow">同  意</el-button>
      <el-button size="small" v-if="isMy && !isShow">催办</el-button>
      <el-button size="small" @click="revoke" v-if="isMy && !isShow">撤销</el-button>
    </span>
    <el-dialog
      width="400px"
      :title="`审核${form.result === 3 ? '同意' : form.result === 4 ? '拒绝' : '撤销'}意见`"
      :visible.sync="innerVisible"
      append-to-body>
      <el-input
        type="textarea"
        :rows="4"
        placeholder="请输入理由"
        :show-word-limit="true"
        :maxlength="300"
        v-model="form.remark">
      </el-input>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="SubOk">提  交</el-button>
      </span>
    </el-dialog>
    <el-dialog
      width="400px"
      title="退回"
      :visible.sync="returnShow"
      append-to-body>
      <el-form label-width="90px">
        <el-form-item label="回退节点" v-if="form.result === 5">
          <el-select v-model="form.target" placeholder="选择回退节点">
            <el-option
              v-for="(item,i) in returnUsers"
              :key="i"
              :value="item.seq"
              :label="item.title"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择转交人" v-else>
          <get-user-select-tree v-if="returnShow" @on-change="userChange"></get-user-select-tree>
        </el-form-item>
        <el-form-item label="备注" v-if="form.result === 5">
          <el-input
            type="textarea"
            :rows="4"
            placeholder="请输入理由"
            :show-word-limit="true"
            :maxlength="300"
            v-model="form.remark">
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="returnOk">提  交</el-button>
      </span>
    </el-dialog>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
  import approveSchedule from 'components/approve-echo/approve-schedule'
  import getUserSelectTree from 'components/base/formModel/tree/get-user-select-tree'
  import a from './img/zhang1.png'
  import b from './img/zhang2.png'
  import c from './img/zhang3.png'
  export default {
    components: {approveSchedule, getUserSelectTree},
    props: {
      dialogBool: Boolean,
      isMy: {
        type: Boolean,
        default: false
      },
      isShow: {
        type: Boolean,
        default: false
      },
      title: {
        type: String,
        default: "编辑",
      },
      formSubObj: {
        type: Object,
        default: () => {
          return {
            title: '',
            form_id: '',
            record_id: '',
            flow_state: '',
            submit_dept: '',
            id: 0
          }
        }
      }
    },
    data() {
      return {
        form: {
          id: 0,
          flow_id: 0,
          step_id: 0,
          state: 0,
          object_id: '',
          remark: ''
        },
        innerVisible: false,
        returnShow: false,
        column: 2,
        urs: {
          '3': a,
          '4': c,
          '7': b
        },
        users: [],
        returnUsers: []
      };
    },
    watch: {
      dialogBool(bool) {
        if (bool === false) {
          Object.assign(this.$data, this.$options.data());
        } else {
          this.form.formid = this.formSubObj.i_form_id
          this.column = 2
          if (this.formSubObj.content) {
            Object.keys(this.formSubObj.content).forEach(key => {
              if (this.formSubObj.content[key].length > 15) {
                this.column = 1
              }
            })
          }
        }
      },
    },
    methods: {
      setApproveNode(node) {
        console.log('node', node)
        this.form.step_id = node.id
      },
      userChange(users,nodes) {
        this.form.target = users.toString()
      },
      // 设置用户信息
      scheduleData(data) {
        this.users = [...data]
      },
      // 退回/转交操作
      dropdownChange(cmd) {
        if (cmd === 'return') {
          this.returnUsers = []
          this.users.forEach(user => {
            if (user.state === '3') {
              this.returnUsers.push(user)
            }
          })
          if (!this.returnUsers.length) {
            this.$message({ message: '没有审核成功退回节点,不能退回!', type: "error"});
            return false
          }
          this.returnShow = true
          this.form.result = 5
          this.form.main_id = this.formSubObj.record_id
          this.form.form_id = this.formSubObj.form_id
        }
        if (cmd === 'transfer') {
          this.returnShow = true
          this.form.result = 6
          this.form.main_id = this.formSubObj.record_id
          this.form.form_id = this.formSubObj.form_id
        }
      },
      dialogClose() {
        this.$emit("update:dialogBool", false);
      },
      // 同意
      ok() {
        this.innerVisible = true
        this.form.state = 1
        this.form.flow_id = this.formSubObj.id
      },
      // 拒绝
      notOk() {
        this.innerVisible = true
        this.form.state = 2
      },
      // 撤销
      revoke() {
        this.innerVisible = true
        this.form.state = 5
      },
      // 回退操作
      returnOk() {
        if (!this.form.target) {
          this.$message({ message:this.form.result === 5 ? '请选择退回节点!' : '请选择转交人', type: "error"});
          return false
        }
        this.returnShow = false
        this.$emit('on-return', this.form)
      },
      SubOk() {
        this.innerVisible = false
        this.$emit('on-ok', this.form)
      }
    },
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
.el-dialog-div{
  .title-content{
    position relative
    .image-badge{
      position absolute
      top -60px
      left 155px
      width 92px
      height 92px
    }
  }
}
</style>

