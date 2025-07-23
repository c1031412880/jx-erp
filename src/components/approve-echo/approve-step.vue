<template>
  <div class="approve-step-box" v-loading="loading">
    <el-steps direction="vertical" v-if="data.length">
      <el-step :title="item.title" v-for="(item,index) in data" :key="index">
        <i class="iconfont icon-content" slot="icon"></i>
        <template slot="description">
          <div class="description-content">
            <p style="" v-if="item.user_type == 6">{{ item.oper_type == 1 ? '请选择审批人' : '请选择抄送人' }}</p>
            <p style="" v-else>{{ outUserName(item) }}</p>
            <div class="approve-user show-flex-box-r" v-if="item.user_type != 6">
              <div class="">
                <span v-if="item.users">{{ showApproveUsreName(item.users, index) }}</span>
              </div>
            </div>

            <div class="approve-user show-flex-box-r" v-else>
              <div class="approve-user-select show-flex-box-r" v-if="!!item.users && item.users.length > 0">
                <div class="approve-user-select-item show-flex-box-r" v-for="(zItem, zIndex) in item.users"
                     :key="zIndex" v-show="zIndex < 3">
                  <el-tag
                    @close="deleteApproveUser(item, zIndex)"
                    size="mini"
                    closable>
                    {{ zItem.name }}
                  </el-tag>
                  <i v-if="(zIndex + 1) < item.users.length">&nbsp; -> &nbsp;</i>
                </div>
                <span v-if="item.users.length > 3">等{{item.users.length - 3}}个处理人</span>
              </div>
              <div class="show-flex-box-r show-flex-center" style="margin-left: 5px;">
                <span style="margin-right: 5px;" v-if="!!item.users && item.users.length > 0">+</span>
                <el-popover
                  placement="top"
                  width="400"
                  v-model="item.popoverShow"
                  trigger="manual">
                  <div style="height: 300px;width: 250px;overflow:auto;">
                    <get-user-tree @on-check="userCheck" v-if="item.popoverShow"></get-user-tree>
                  </div>
                  <div style="text-align: right; margin: 0">
                    <el-button size="mini" type="text" @click="endPush(item)">取消</el-button>
                    <el-button type="primary" size="mini" @click="openSelectUserPop(item,index)">确定</el-button>
                  </div>
                  <i style="color: #409EFF;cursor:pointer; font-size: 17px"
                     class="el-icon-circle-plus-outline"
                     slot="reference"
                     @click="item.popoverShow = true"></i>
                </el-popover>
              </div>
            </div>
          </div>
        </template>
      </el-step>
    </el-steps>
    <el-empty v-else description="暂无数据"></el-empty>
  </div>
</template>

<script>
import getUserTree from 'components/base/formModel/tree/get-user-tree'

export default {
  components: {getUserTree},
  props: {
    flow_id: {},
    isFlow: {
      type: Boolean,
      default: false
    },
    object_id: {},
    form_data: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      data: [],
      isOptional: false, //是否是自选、指定
      isOptionalMultiUser: false, //是否自选单人、自选多人
      loading: false,
      popoverShow: false,
      userNode: []
    };
  },
  computed: {},
  watch: {
    flow_id(newVul) {
      this.loadData()
    },
    object_id(value) {
      this.loadData()
    },
    form_data(value) {
      console.log('formdata')
      this.loadData()
    }
  },
  created() {
  },
  mounted() {
    this.loadData();
  },
  methods: {
    outUserName(item) {
      let strName = '';
      if (item.user_type == 6) {
        return strName;
      }
      if (item.users.length) {
        strName = item.users.length + '个'
      }
      if (item.user_type == 1) {
        strName += '指定成员'
      }
      if (item.user_type == 2) {
        strName += '主管'
      }
      if (item.user_type == 3) {
        strName += '角色'
      }
      if (item.confirm_type == 1) {
        strName += '会签'
      }
      if (item.confirm_type == 2) {
        strName += '或签'
      }
      if (item.confirm_type == 1) {
        strName += '依次会签'
      }
      if (item.oper_type == 1) {
        strName += '(审批)'
      }
      if (item.oper_type == 3) {
        strName += '(抄送)'
      }
      if (item.oper_type == 4) {
        strName += '(发起人)'
      }
      return strName
    },
    showApproveUsreName(userNameList, approveIndex) {
      console.log(userNameList)
      let showUserText = '';
      // let showUserText = userNameList.join('->');
      userNameList.forEach((zItem, zIndex) => {
        if ((approveIndex + 1) == this.data.length) {
          showUserText += `${zItem.name} + `
        } else {
          showUserText += `${zItem.name} -> `
        }
      });
      if ((approveIndex + 1) == this.data.length) {
        showUserText = showUserText.substring(0, showUserText.length - 2)
      } else {
        showUserText = showUserText.substring(0, showUserText.length - 3)
      }
      return showUserText
    },
    // 获取数据
    loadData() {
      this.loading = true
      if (this.isFlow) {
        this.$client.GetByFlowIdFlowManage({
          flow_init_id: this.flow_id
        })
          .then(res => {
            this.loading = false
            console.log('流程回显数据', res)
            if (res.head.result == '200') {
              res.context.map(item => {
                item.popoverShow = false
              })
              this.data = res.context;
            } else {
              // this.$message({
              //   showClose: true,
              //   message: res.head.describle,
              //   type: "error",
              // });
            }
            // 返回所有审核人
            this.$emit('on-users', res.context)
          }).catch(err => {

        })
      } else {
        this.$client.GetByFormDataFlowManage({
          object_id: this.object_id,
          form_data: this.form_data,
          user_id: this.form_data ? this.form_data.user_id : Number(JSON.parse(getUser()).user_id),
        })
          .then(res => {
            this.loading = false
            console.log('流程回显数据', res)
            if (res.head.result == '200') {
              res.context.map(item => {
                item.popoverShow = false
              })
              this.data = res.context;
            } else {
              // this.$message({
              //   showClose: true,
              //   message: res.head.describle,
              //   type: "error",
              // });
            }
            // 返回所有审核人
            this.$emit('on-users', res.context)
          }).catch(err => {

        })
      }

    },
    // 删除审批成员
    deleteApproveUser(item, index) {
      item.users.splice(index, 1)
    },
    // 打开选择审批人员
    openSelectUserPop(item, index) {
      item.popoverShow = false
      let list = []
      this.userNode.forEach(obj => {
        let bool = true
        item.users.forEach(node => {
          if (node.id === obj.id) {
            bool = false
          }
        })
        if (bool) {
          list.push(obj)
        }
      })
      item.users.push(...list)
      console.log(item.users)
    },
    endPush(item) {
      this.userNode = []
      item.popoverShow = false
    },
    // 选中节点初始化
    userCheck(nodes) {
      console.log(nodes)
      this.userNode = []
      nodes.forEach(node => {
        if (node.type === 0) {
          this.userNode.push({
            id: node.i_id,
            name: node.c_name
          })
        }
      })
    }
  },
};
</script>
<style lang='stylus' scoped>
.approve-step-box{
  width: 100%;
  height: 100%;
}
.icon-content {
  width: 100%;
  height: 100%;
}

.description-content {
  width: 100%;
  height: 100%;
  position: relative;
  color: #333;

  p {
    color: #333;
  }

  .approve-user {
    position: absolute;
    top: -15px;
    right: 0px;
  }
}

.approve-step-box /deep/ .el-step__title {
  color: #333 !important;
}

.approve-step-box /deep/ .el-step__description {
  padding-right: 10% !important;
  margin-bottom 30px !important;
}

.approve-step-box /deep/ .el-step__icon {
  border: 4px solid;
  border-color: #409EFF;
  width: 20px;
  height: 20px;
}

.approve-step-box /deep/ .el-step__line {
  left: 9px;
}

// .approve-step-box /deep/ .

// .icon-content{
//   background: url("../../../../../src/assets/icons/yuanquan.png") center center no-repeat;
//   background-size: 100% 100%;
//   overflow hidden
// }

.approve-step-box >>> .el-step.is-vertical {
  height: 20%;
}

.approve-user-select-item {
  span {
    position: relative;

    em {
      position: absolute;
      top: -3px;
      right: -6px;
      z-index: 99;
      cursor: pointer;
    }

  }
}


</style>
