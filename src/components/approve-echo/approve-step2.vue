<!--  -->
<template>
  <div class="approve-step-box" v-loading="loading">
    <div class="approve-title" v-if="showTitle">
      <div></div><p>审批流程</p>
    </div>
    <div class="step-bottom" style="">
      <el-button type="text" @click="addDraftStep">保存当前流程</el-button>
      <el-select v-model="draft_step_id" size="mini" placeholder="请选择替换流程" clearable @change="selectDraftStep">
        <el-option
          v-for="item in selectStepList"
          :key="item.id"
          :label="item.title"
          :value="item.id">
          <span style="float: left">{{ item.title }}</span>
          <span style="float: right;" @click.stop="delDraftStep(item.id)"><i class="el-icon-delete-solid"></i></span>
        </el-option>
      </el-select>
    </div>
    <el-steps direction="vertical" v-if="data.length">
      <el-step :title="item.title" v-for="(item,index) in data" :key="index">
        <i :class="'iconfont icon-content icon'+ '' + `${item.oper_type}`" slot="icon"></i>
        <template slot="description">
          <div class="description-content">
            <div class="description-left">
              <div v-if="item.is_empty == 1">
                <p>{{ '请选择审批人'}}</p>
                <p>{{ defaultName(item) }}</p>
              </div>
              <div v-else>
                <p v-if="item.user_type == 6 || item.user_type == 9">{{ item.oper_type == 1 ? '添加审批人' : '添加抄送人' }}</p>
                <p v-else>{{ outUserName(item) }}</p>
              </div>
              
            </div>
            <div class="description-right">
              <!-- 是否允许审批节点为空 -->
              <div v-if="item.is_empty == 1" style="width:100%;height:100%;display:flex">
                <div class="card-box" v-if="defaultList(item.users).length">
                  <div class="card-box-item" v-if="defaultList(item.users).length > 3" @click="isShowSelectPeo(item, defaultList(item.users), item.oper_type)">
                    <img :src="require('../../assets/approverStepIcon/quabu@2x.png')" style="background-color: #5E718E;cursor: pointer;"/>
                    <span>查看全部</span>
                  </div>
                  <div class="card-box-item" v-for="(zItem, zIndex) in defaultList(item.users).slice(0, 3)" :key="zItem.id">
                    <i class="el-icon-error" @click="deleteApproveUser(item, zIndex,true)"></i>
                    <img :src="require('../../assets/approverStepIcon/shenpi@2x.png')" style="background-color: #0087FF;" alt="">
                    <span>{{ zItem.name }}</span>
                  </div>
                </div>
                <div class="card-box">
                  <!-- <el-popover
                    class="card-box-item"
                    placement="top"
                    width="400"
                    v-model="item.popoverShow"
                    trigger="manual">
                    <div style="height: 300px;width: 250px;overflow:auto;">
                      <get-user-tree @on-check="userCheck" v-if="item.popoverShow"></get-user-tree>
                      <vue-user-role-tree
                        ref="vueUserRoleTree" 
                        placeholder="请选择人员"
                        :show_all="true" 
                        :func_type="0" 
                        :is_contain_emp="true" 
                        :isCheckSort="true"
                        :isShowCheckbox="true"
                        @on-change="changeSelectInfo"></vue-user-role-tree>
                    </div>
                    <div style="text-align: right; margin: 0">
                      <el-button size="mini" type="text" @click="endPush(item)">取消</el-button>
                      <el-button type="primary" size="mini" @click="openSelectUserPop(item,index,true)">确定</el-button>
                    </div>
                  </el-popover> -->
                    <div class="card-box-item">
                      <img 
                        :src="require('../../assets/approverStepIcon/tianjia@2x.png')" 
                        slot="reference" 
                        style="cursor: pointer;"
                        @click="openSelect(item, index)"/>
                    </div>
                </div>
              </div>
              <div v-else style="width:100%;height:100%">
                <div class="card-box" v-if="item.users">
                  <div class="card-box-item" v-if="item.users.length > 3" @click="isShowSelectPeo(item, item.users, item.oper_type)">
                    <img :src="require('../../assets/approverStepIcon/quabu@2x.png')" style="background-color: #5E718E;cursor: pointer;"/>
                    <span>查看全部</span>
                  </div>
                  <div class="card-box-item" v-for="(zItem, zIndex) in item.users.slice(0, 3)" :key="zItem.id">
                    <i v-if="(item.user_type == 6 && !zItem.state) || (item.user_type == 9 && !zItem.state)" class="el-icon-error" @click="deleteApproveUser(item, zIndex)"></i>
                    <img :src="require('../../assets/approverStepIcon/shenpi@2x.png')" style="background-color: #0087FF;" alt="">
                    <span>{{ zItem.name }}</span>
                  </div>
                  <!-- item.step_id > 0 =》 经办人主管和分管领导   -->
                  <div class="card-box-item" v-if="item.user_type == 6 || item.user_type == 9 || !item.users.length || item.step_id > 0">
                    <!-- <el-popover
                      v-if="item.user_type == 6 || !item.users.length"
                      class="card-box-item"
                      placement="top"
                      width="400"
                      v-model="item.popoverShow"
                      trigger="manual">
                      <div style="height: 300px;width: 250px;overflow:auto;">
                        <get-user-tree @on-check="userCheck" v-if="item.popoverShow"></get-user-tree>
                      </div>
                      <div style="text-align: right; margin: 0">
                        <el-button size="mini" type="text" @click="endPush(item)">取消</el-button>
                        <el-button type="primary" size="mini" @click="openSelectUserPop(item,index,)">确定</el-button>
                      </div>
                    </el-popover> -->
                      <img 
                        :src="require('../../assets/approverStepIcon/tianjia@2x.png')" 
                        slot="reference" 
                        style="cursor: pointer;"
                        @click="openSelect(item, index)"/>
                  </div>
                </div>
              </div>
              
            </div>
          </div>
        </template>
      </el-step>
    </el-steps>
    <el-empty v-else description="暂无数据"></el-empty>
    
    <!-- <el-dialog
      width="400px"
      title="选择人员"
      :visible.sync="selectPersonShow"
      append-to-body
      :close-on-click-modal="false">
      <el-form label-width="80px">
        <el-form-item label="人员: " required>
          <vue-user-role-tree
            ref="vueUserRoleTree" 
            placeholder="请选择人员"
            :show_all="true" 
            :func_type="0" 
            :is_contain_emp="true" 
            :isCheckSort="true"
            :isShowCheckbox="true"
            v-model="add_user_ids"
            @on-ok="saveSelectUsers"
            @on-close="closeSelect"
            @on-change="changeSelectInfo"></vue-user-role-tree>
        </el-form-item>
      </el-form>
    </el-dialog> -->
     <!-- <el-dialog
      width="740px"
      title="选择人员"
      :visible.sync="selectPersonShow"
      append-to-body
      :close-on-click-modal="false"> -->
      <!-- <el-form label-width="80px"> -->
        <!-- <el-form-item label="人员: " required> -->
          <vue-user-role-tree
            :selectPersonShow.sync="selectPersonShow"
            ref="vueUserRoleTree" 
            placeholder="请选择人员"
            :show_all="true" 
            :func_type="0" 
            :is_contain_emp="true" 
            :isCheckSort="true"
            :isShowCheckbox="true"
            v-model="add_user_ids"
            @on-ok="saveSelectUsers"
            @on-close="closeSelect"
            @on-change="changeSelectInfo"></vue-user-role-tree>
        <!-- </el-form-item> -->
      <!-- </el-form> -->
    <!-- </el-dialog> -->
    <el-dialog
      :visible.sync="dialogVisible"
      width="536px"
      append-to-body
      :before-close="handleClose"
       :close-on-click-modal="false">
      <div slot="title" style="font-size: 17px;font-family: Source Han Sans SC-Regular, Source Han Sans SC;font-weight: 400;color: #333333;line-height: 32px">
        {{this.selectTitle}}
      </div>
      <div style="height: 1px;width: 100%; margin: 0px 0px 10px 10px;background-color: #DCDFE6;"></div>
      <div style="margin: 0px 0px 10px 10px; font-size: 14px; font-family: Source Han Sans SC-Regular, Source Han Sans SC; font-weight: 400; color: #999999;">
        {{this.selectTitle}}{{this.userList.length}}人
      </div>
      <div style="display: flex; width: 100%; justify-content: flex-start; flex-wrap: wrap; max-height: 300px; overflow: auto">
        <div style="display: flex; flex-direction: column; align-items: center; margin: 10px 10px;" 
          v-for="(oItem, oIndex) in this.userList" :key="oIndex">
          <div style=" position: relative;">
            <i class="el-icon-error" 
              v-if="!oItem.state"
              style="color: #CACACA; position: absolute; right: -7px; top: -7px; font-size: 14px; cursor: pointer;"
              @click="deleteApprovePeo(oItem, oIndex)"></i>
            <img :src="require('../../assets/approverStepIcon/shenpi@2x.png')" style="background-color: #0087FF;" alt="">
          </div>
          <span style="font-size: 14px; font-family: Source Han Sans SC-Regular, Source Han Sans SC; font-weight: 400; color: #666666; white-space: nowrap">
            {{oItem.name}}
          </span>
        </div>
      </div>
    </el-dialog>
    <el-dialog
      width="400px"
      title="流程标题"
      :visible.sync="opinionShow"
      append-to-body
      :close-on-click-modal="false">
      <el-form label-width="80px">
        <el-form-item label="标题: " required>
          <el-input
            placeholder="请输入流程标题"
            v-model="stepTitle">
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="opinionShow = false">取消</el-button>
          <el-button type="primary" @click="saveDraftStep">保存</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import VueUserRoleTree from '@/components/base/formModel/tree/user-role-select-tree/list'
import getUserTree from 'components/base/formModel/tree/get-user-tree'
import {getUser} from '@/utils/auth'
export default {
  components: {getUserTree, VueUserRoleTree},
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
    },
    showTitle:{ 
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      dialogVisible: false, //添加人员
      selectTitle: '选择审批人',
      data: [],
      isOptional: false, //是否是自选、指定
      isOptionalMultiUser: false, //是否自选单人、自选多人
      loading: false,
      popoverShow: false,
      opinionShow: false,
      stepTitle: '',
      userNode: [],
      userList: [],
      changeId: 0,
      selectStepList: [],
      draft_step_id: '',
      selectPersonShow: false,
      selectIndex: 0,
      add_user_ids: [] //添加人员id
    };
  },
  computed: {},
  watch: {
    flow_id(newVul) {
      this.loadData()
      this.getDraftStep()
    },
    // object_id(value) {
    //   this.loadData()
    // },
    // form_data(value) {
    //   this.loadData()
    // }
  },
  created() {
  },
  mounted() {
    this.loadData();
    this.getDraftStep();
  },
  methods: {
    // 审批节点 可为空时 的默认人员
    defaultList(list) {
      return list.filter(item => {return item.is_default == 0})
    },
    defaultName(item) {
      console.log('item',item);
      let feeUser = item.users.filter(item => {return item.is_default == 1})
      if (feeUser.length == 0) {
        return '未添加审批人，将自动通过'
      } else {
        let name = []
        feeUser.forEach(child =>{
          name.push(child.name)
        })
        if (name.length >= 3) {
          let length = name.length
          name = name.slice(0,3).toString() + '等' + length + '人'
        }else {
          name = name.toString()
        }
        return `未添加审批人，默认由${name}审批`
      }
    },
    outUserName(item) {
      // console.log('item',JSON.parse(JSON.stringify(item)));
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
      if (item.user_type == 7) {
        strName += '分管领导'
      }
      if (item.user_type == 4) {
        strName += '职务'
      }
      if (item.confirm_type == 1 && item.users.length > 1 && !item.is_seq) {
        strName += '会签'
      }
      if (item.confirm_type == 2 && item.users.length > 1) {
        strName += '或签'
      }
      if (!!item.is_seq&& item.users.length > 1) {
        strName += '依次'
      }
      if (item.oper_type == 1 && !!item.is_seq) {
        strName += '审批'
      }
      if (item.oper_type == 3) {
        strName += '(抄送)'
      }
      if (item.oper_type == 4) {
        strName = ''
      }
      if(!item.users.length && item.user_type == 2) {
        let name = ''
        if (item.step_id > 0) {
          name = '经办人'
        } else {
          name = '发起人'
        }
        strName = `找不到${name}主管,请发起人自选`
      }
      if(!item.users.length && item.user_type == 7) {
        let name = ''
        if (item.step_id > 0) {
          name = '经办人'
        } else {
          name = '发起人'
        }
        strName = `找不到${name}分管领导,请发起人自选`
      }
      if(!item.users.length && item.user_type == 3) {
        strName = '找不到角色,请发起人自选'
      }
      if(!item.users.length && item.user_type == 4) {
        strName = '找不到职务,请发起人自选'
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
      if (this.isFlow) {
        this.loading = true
        this.$client.GetByFlowIdFlowManage({
          flow_init_id: this.flow_id
        })
          .then(res => {
            this.loading = false
            console.log('流程回显数据', res)
            if (res.head.result == '200') {
              // res.context.map(item => {
              //   item.popoverShow = false
              // })
              this.data = res.context;
            } else {
              //   
            }
            // 返回所有审核人
            this.$emit('on-users', res.context)
          }).catch(err => {})
      } else {
        if(this.object_id && this.form_data) {
          let userId = 0
          switch (this.object_id) {
            case 20:
              userId = !!this.form_data ? this.form_data.borrow_id : Number(JSON.parse(getUser()).user_id)
              break;
            case 5230:
              userId = !!this.form_data ? this.form_data.person_id : Number(JSON.parse(getUser()).user_id)
              break;
            default:
              userId = !!this.form_data ? this.form_data.user_id : Number(JSON.parse(getUser()).user_id)
              break;
          }
          this.loading = true
          this.$client.GetByFormDataFlowManage({
            object_id: this.object_id,
            form_data: this.form_data,
            user_id: userId,
          })
            .then(res => {
              this.loading = false
              console.log('流程回显数据', res)
              if (res.head.result == '200') {
                // res.context.map(item => {
                //   item.popoverShow = false
                // })
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
            }).catch(err => {})
        }
      }

    },
    // 删除审批成员
    deleteApproveUser(item, index,bool) {
      console.log('---',item,index,bool);
      if (bool) {
        let list = item.users.filter(item => {return item.is_default == 1})
        index = list.length + index
      }
      item.users.splice(index, 1)

      if (item.handled == 1) {
        let ids = item.users.map(item =>{
          return item.id
        })
        this.GetUsersLeader(ids)
      }
    },
    deleteApprovePeo(oItem, oIndex) {
      this.data.forEach(item => {
        if(item.id == this.changeId) {
          item.users.splice(oIndex, 1)
        }
      })
    },
    // 打开选择审批人员
    // openSelectUserPop(item, index,is_free) {
    //   console.log(item);
    //   item.popoverShow = false
    //   let list = []
    //   this.userNode.forEach(obj => {
    //     let bool = true
    //     item.users.forEach(node => {
    //       if (node.id === obj.id) {
    //         bool = false
    //       }
    //     })
    //     if (bool) {
    //       if (is_free) {
    //         obj.is_default = 0
    //       }
    //       list.push(obj)
    //     }
    //   })
    //   item.users.push(...list)
    //   console.log(item.users)
    // },
    // endPush(item) {
    //   this.userNode = []
    //   item.popoverShow = false
    // },
    // 关闭选择人员
    closeSelect() {
      this.$refs.vueUserRoleTree.onClear()
      this.selectPersonShow = false
    },
    // // 选中节点初始化
    // userCheck(nodes) {
    //   console.log(nodes)
    //   this.userNode = []
    //   nodes.forEach(node => {
    //     if (node.type === 0) {
    //       this.userNode.push({
    //         id: node.i_id,
    //         name: node.c_name
    //       })
    //     }
    //   })
    // },
    // 添加审批人弹窗
    openSelect(item, index) {
      let users = []
      item.users.forEach(item => {
        if(!item.state) {
          users.push(item.id)
        }
      }) 
      this.add_user_ids = users
      this.selectIndex = index
      this.selectPersonShow = true
    },
    // 选中节点初始化(改)
    changeSelectInfo(nodes, arr) {
      // console.log(nodes, arr);
      this.userNode = []
      nodes.forEach(node => {
        if (node.type === 0) {
          this.userNode.push({
            id: node.i_id,
            name: node.c_name,
            is_default: 0
          })
        }
      })
      
    },
    // 保存选择人员
    saveSelectUsers(nodes) {
      // if(!this.userNode.length) {
      //   this.$message.warning('请选择人员后保存')
      //   return
      // }
      let userNode = []
      nodes.forEach(node => {
        userNode.push({
          id: node.value,
          name: node.label,
          is_default: 0
        })
      })
      // console.log('this.data[this.selectIndex].users',this.data[this.selectIndex]);
      if (userNode.length > 0) {
        this.data[this.selectIndex].users = userNode
      }
      this.$refs.vueUserRoleTree.onClear()
      this.selectPersonShow = false

      // handled  1 为经办人  需要监听
      if (this.data[this.selectIndex].handled == 1) {
        let ids = userNode.map(item =>{
          return item.id
        })
        this.GetUsersLeader(ids)
      }
    },
    handleClose() {
      this.userList = []
      this.changeId = 0
      this.dialogVisible = false
    },
    isShowSelectPeo(item, users, type) {
      this.changeId = item.id
      this.userList = users
      this.selectTitle = type == 1 ? '审批人' : '抄送人'
      this.dialogVisible = true  
    },
    // 保存流程
    addDraftStep() {
      this.stepTitle = ''
      this.opinionShow = true
    },
    saveDraftStep() {
      if(!this.stepTitle) {
        this.$message.warning('请填写流程标题')
        return
      }
      let params = {
        type: this.isFlow ? this.flow_id : this.object_id,
        title: this.stepTitle,
        data: this.data
      }
      this.$client.AddStepFlowManage(params).then(res => {
        if (res.head.result == "200") {
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "success",
          });
          this.opinionShow = false
          this.getDraftStep()
        }else {
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error",
          });
        }
      }).catch((err) => {});
    },
    delDraftStep(id) {
      this.$confirm('此操作将永久删除该流程, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$client.DelStepFlowManage({context:id}).then(res => {
            if (res.head.result == "200") {
              this.$message({
                showClose: true,
                message: '成功删除',
                type: "success",
              });
              this.draft_step_id = ''
              this.getDraftStep()
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    },
    // 获取 流程草稿
    getDraftStep() {
      // console.log('this.flow_idthis.flow_idthis.flow_id',this.isFlow,this.flow_id,this.object_id);
      let type =  this.isFlow ? this.flow_id : this.object_id
      if(!type) return false
      this.$client.GetStepRecordFlowManage({type}).then(res => {
        if (res.head.result == "200") {
          this.selectStepList = res.context
        }
      }).catch((err) => {});
    },
    selectDraftStep(id) {
      let arr = this.selectStepList.find(item => item.id == id)
      this.data = !!arr ? arr.data : []
      if(!this.data.length) {
        this.loadData()
      } else {
        this.$emit('on-users', this.data)
      }
    },
    // 获取 主管和分管领导 
    GetUsersLeader(ids) {
      // 有选择 经办人 
      if (ids.length > 0) {
        this.$client.GetUsersLeader({context:ids}).then(res => {
          if (res.head.result == "200") {
            let data = res.context
            let manageList = []     //主管
            let directorList = []   //分管领导
            if (data.length > 0) {
              data.forEach(item => {
                if (item.manage_id && item.manage_name) {
                  let obj1 = {
                    id: item.manage_id,
                    name: item.manage_name,
                    is_default: 0
                  }
                  manageList.push(obj1)
                }
                if (item.director_id && item.director_name) {
                  let obj2 = {
                    id: item.director_id,
                    name: item.director_name,
                    is_default: 0
                  }
                  directorList.push(obj2)
                }
              })
            }
            manageList = this.unique(manageList)
            directorList = this.unique(directorList)
            this.setHandledUsers(manageList,directorList)
          }
        })
      } else {
        // 经办人节点为空 
        this.data.forEach(item => {
          // 主管 
          if (item.user_type == 2 && item.step_id) {
            item.users = []
          }
          // 分管领导 
          if (item.user_type == 7 && item.step_id) {
            item.users = []
          }
        })
      }

    },
    //去重
    unique(arr) {
      let map = new Map();
      for (let item of arr) {
        map.set(item.id, item);
      }
      return [...map.values()];
    },
    // 设置 经办人的主管和 分管领导 
    setHandledUsers(manageList = [], directorList = []){
      let hasManage = false
      let hasDirector = false
      this.data.forEach(item => {
        // 主管 
        if (item.user_type == 2 && item.step_id) {
          hasManage = true
          item.users = manageList
        }
        // 分管领导 
        if (item.user_type == 7 && item.step_id) {
          hasDirector = true
          item.users = directorList
        }
      })

      // 如果后续节点总有设置 主管  但接口没有查到节点主管信息  
      if (hasManage && manageList.length == 0) {
        this.$message({
          showClose: true,
          message: '没有查到该经办人主管',
          type: "warning",
        });
      } else  if (hasDirector && directorList.length == 0) {
      // 如果后续节点总有设置 分管领导  但接口没有查到节点分管领导信息  
        this.$message({
          showClose: true,
          message: '没有查到该经办人分管领导',
          type: "warning",
        });
      }
    }, 
    setApproveUsers(users, type) {
      let userList = users.map(item =>({id: item.i_id,name: item.c_name,is_default: 0}))
      this.data.forEach(item => {
        // 经办人 
        if (item.user_type == 9 && type == item.form_field) {
          item.users = this.unique([...item.users, ...userList])
        }
      })
    }
  },
};
</script>
<style lang='stylus' scoped>
.approve-step-box {
  width: 100%;
  height: 100%;
  .approve-title {
    display: flex
    margin-bottom: 20px;
    div {
      width: 4px; 
      height: 14px;
      background-color: #31A7FF;
      margin-right: 6px;
    }
    p {
      font-size: 14px;
      font-family: Source Han Sans SC-Bold, Source Han Sans SC;
      font-weight: bold;
    }
  }
  .step-bottom {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
  }
}
.approve-step-box /deep/ .el-step__head {
  width: 40px !important;
  min-height: 80px !important;
}
.approve-step-box /deep/ .el-step__line {
  background: none !important;
  border-left: 2px dashed #C9CCD2 !important;
  top: 42px !important;
  bottom: 2px !important;
  left: 20px !important;
  i {
    border-width: 0 !important
  }
}
.approve-step-box /deep/ .el-step__icon{
  height: 40px !important;
  width: 40px !important;
  border-radius: 4px !important;
  border-color: #fff !important;
  overflow: hidden !important;
  border: 0 !important;
}
.approve-step-box /deep/ .el-step__title {
  font-size: 14px !important;
  font-weight: bold !important;
  color: #333333 !important;
  padding-bottom: 4px !important;
}
.approve-step-box /deep/ .el-step__description {
  padding-right: 10% !important;
  margin-bottom 30px !important;
}
.icon1, .icon2, .icon3, .icon4, {
  width: 100%;
  height: 100%;
  background-size: 100% 100%;
}
.icon1, .icon2 {
  background-image: url('../../assets/approverStepIcon/shenpi@2x.png');
  background-color: #CBCDD0;
}
.icon3 {
  background-image: url('../../assets/approverStepIcon/chaosong@2x.png');
  background-color: #CBCDD0;
}
.icon4 {
  background-image: url('../../assets/approverStepIcon/faqi@2x.png');
  background-color: #0087FF;
}




.description-content {
  width: 100%;
  position: relative;
  p {
    color: #999999;
    font-size: 12px;
  }
  span {
    color: #333;
  }

  .description-right {
    position: absolute;
    // border: 1px solid #333
    max-width: 300px;
    height: 60px
    top: -22px;
    right: 0px;

    .card-box {
      height: 100%;
      width: 100%;
      display: flex;
      justify-content: flex-end;
      
      // align-items: center;
      // overflow-x: hidden;
      .card-box-item {
        position: relative;
        display: flex;
        height: 100%;
        width: 50px;
        flex-direction: column;
        align-items: center;
        margin-left: 10px;
        span {
          font-size: 14px;
          font-family: Source Han Sans SC-Regular, Source Han Sans SC;
          font-weight: 400;
          color: #666666;
          white-space: nowrap
        }
        i{
          color: #CACACA; 
          position: absolute; 
          right: 3px; 
          top: -7px; 
          font-size: 14px;
          cursor: pointer;
        }
      }
      img {
        height: 30px;
        width: 30px;
        border-radius: 4px;        
      }
    }
  }
}
</style>
