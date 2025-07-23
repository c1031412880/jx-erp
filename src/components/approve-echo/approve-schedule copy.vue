
<template>
  <div  class="approve-schedule" v-loading="loading" style="min-height: 300px;width: 100%">
    <el-empty description="暂无流程数据" v-if="!data.length"></el-empty>
    <el-steps direction="vertical" v-else :active="curApproveIndex === data.length - 1 ? curApproveIndex + 1 : curApproveIndex" finish-status="finish">
      <el-step :title="item.title" v-for="(item,index) in data" :key="index">
        <i class="el-icon-circle-check" slot="icon" style="font-size: 28px;width:26px; height:26px; display: inline-block;background:#ffff;"
           v-if="item.state == 3"></i>
        <i class="el-icon-circle-close" slot="icon" style="font-size: 28px;width:26px; height:26px; display: inline-block;background:#fff;color: #F56C6C"
           v-if="item.state == 4 || item.state == 7"></i>
        <i class="el-icon-more" slot="icon"
           style="font-size: 26px;width:26px; height:26px; display: inline-block; background:#ffff;color: #ffff;"
           v-if="curApproveIndex === index && (item.state == 2 || item.state == 1) && item.oper_type !== 3"></i>
        <i class="el-icon-s-promotion" slot="icon"
           style="font-size: 26px;width:26px; height:26px; display: inline-block; color: #ffff;background:#ffff; border-radius: 50%"
           v-if="item.oper_type == 3"></i>
        <!-- <i class="el-icon-video-pause" slot="icon" style="font-size: 26px;width:26px; height:26px; display: inline-block; color: #409EFF" v-if="item.type != 2 && index != 0"></i> -->
        <template slot="description">
          <div class="description-content">
            <div class="description-content-text show-flex-box-r" style="width: 100%;">
              <span>{{checkShowApproveUseName(item,index)}}</span>
              <span v-if="item.oper_type != 3">{{item.date}}</span>
            </div>
            <div>
              <el-alert
                v-if="item.remark && item.oper_type !== 5"
                :description="item.remark"
                :closable="false"
                :type="item.state | outAlertType">
              </el-alert>
              
              <div v-if="item.oper_type === 5" style="background:#F4F4F5; padding: 5px 10px;">
                <div class="show-flex-box-r" style="align-items: center;">
                  <span style="flex-grow: 1;">{{item.remark}}</span>
                  <el-popconfirm
                    @confirm="deleteComment(item)"
                    title="确认删除评论?" 
                    v-if="computedTime(item.date,setDate()) < 300000 && item.remark.indexOf('原评论已删除') == -1"
                    >
                    <el-button type="text" slot="reference" style="margin-right:10px;flex-shrink: 0; font-size: 12px;">删除</el-button>
                  </el-popconfirm>
                  <!-- <el-button type="text" style="flex-shrink: 0; font-size: 12px;" @click="deleteComment(item)" v-if="computedTime(item.date,setDate()) < 300000 && item.remark.indexOf('原评论已删除') == -1">删除</el-button> -->
                </div>
                <div class="list-data-list show-flex-box-r" style="margin-bottom:10px;">
                  <ul class="show-flex-box-r" style="flex-grow: 1; flex-wrap: wrap;align-items: center;" v-if="item.img_urls && item.img_urls.length > 0">
                    <li class="list-data show-flex-box-r" v-for="(Zitem,index) in item.img_urls" :key="index">
                      <span class="item show-flex-box-r" v-if="Zitem">
                        <image-box :src="Zitem" :id="index+1" :disabled="true"></image-box>
                      </span>
                    </li>
                  </ul>
                </div>
                <div class="multiple-files">
                  <multiple-files-upload :disabled="true" :filesList="item.file_urls? item.file_urls:[]" v-if="item.file_urls && item.file_urls.length > 0"></multiple-files-upload>
                </div>
              </div>
              <div v-if="item.oper_type === 6 && !!item.add_check_name" >
                <span>添加审批人:{{item.add_check_name}}</span>
              </div>
            </div>
            
          </div>
        </template>
      </el-step>
    </el-steps>
    <!-- ··················评论··········· -->
    <el-dialog
      title="评论"
      :visible.sync="commentDialogVisible"
      width="600px"
      append-to-body	
      :close-on-click-modal="false"
      >
      <div class="comment-div-dialog" style="height:400px; overflow-y: auto;">

        <el-form ref="form" size="mini" :model="form" :rules="rules"  label-width="150px">
          <el-form-item label="评论内容:" prop="content">
            <el-input type="textarea" v-model="form.content"></el-input>
          </el-form-item>
          <el-form-item label="上传图片:" prop="img_urls">
            <div class="list-data-list show-flex-box-r">
              <ul class="list-data" v-for="(item,index) in form.img_urls" :key="index">
                <li class="item" v-if="item.url">
                  <image-box :src="item.url" :id="index+1" @on-delete="imageDelete(index)"></image-box>
                </li>
              </ul>
              <div class="item unchecked" @click="uploadFile()" v-if="!form.img_urls || (!!form.img_urls && form.img_urls.length < 3)">
                <i class="el-icon-plus" style="font-size: 60px;font-weight: 600;"></i>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="上传附件:" prop="file_urls">
            <multiple-files-upload :filesList="form.file_urls" :acceptType="'.doc,.docx,.pdf,.xls,.xlsx'" :isPreviewable="false" :maxUpLoadSize="100" @upload-update-success="uploadUpdateSuccess" :maxUpLoadNum="3"></multiple-files-upload>
          </el-form-item>
          <el-form-item label="选择提醒人:" prop="user_ids">
            <el-select
              v-model="form.user_ids"
              multiple
              collapse-tags
              placeholder="请选择"
              @change="selectedReminderUser">
              <el-option
                v-for="item in reminderOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
            <el-checkbox v-model="form.is_sms" style="margin-left: 10px;">短信提醒</el-checkbox>
          </el-form-item>
        </el-form>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="commentDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitCommentForm('form')">确 定</el-button>
      </span>
    </el-dialog>
    <!-- ··················评论··········· -->
    <!-- ··················催办··········· -->
    <el-dialog
      title="催办"
      :visible.sync="urgeDialogVisible"
      width="600px"
      append-to-body
      :close-on-click-modal="false"	
      >
      <div class="comment-div-dialog" style="height:300px; overflow-y: auto;">

        <el-form ref="urgeForm" size="mini" :model="urgeForm" :rules="urgeRules"  label-width="150px">
          <el-form-item label="催办内容:" prop="content">
            <el-input type="textarea" v-model="urgeForm.content"></el-input>
          </el-form-item>
          <el-form-item label="选择提醒人:" prop="">
            <span style="color:#D9001B">{{urgeForm.send_usersname}}</span>
          </el-form-item>
          <el-form-item label="" prop="is_sms">
            <el-checkbox v-model="urgeForm.is_sms" style="margin-left: 10px;">短信提醒</el-checkbox>
          </el-form-item>
          <el-form-item label="说明:" prop="">
           <span style="color:#909399;font-size:12px;">默认仅催办当前审批节点的所有审批人；提醒方式默认为系统通知.催办后1小时内无法再次催办</span>
          </el-form-item>
        </el-form>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="urgeDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitUrgeForm('urgeForm')">发 送</el-button>
      </span>
    </el-dialog>
    <!-- ··················催办··········· -->

    <!-- ··················加签··········· -->
    <el-dialog
      title="加签"
      :visible.sync="countersignDialogVisible"
      width="600px"
      append-to-body	
      :close-on-click-modal="false"
      >
      <div class="comment-div-dialog" style="height:300px; overflow-y: auto;">
        <el-form ref="countersignForm" size="mini" :model="countersignForm" :rules="countersignRules"  label-width="150px">
          <el-form-item label="加签方式:" prop="add_type">
            <el-radio-group v-model="countersignForm.add_type">
              <el-radio :label="1">在我之前</el-radio>
              <el-radio :label="2">在我之后</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="加签审批人:" prop="add_user_ids">
            <!-- <get-dept-emp-select-tree placeholder="请选择加签审批人，最多选择3个" :is_contain_emp="true" :isShowCheckbox="true" v-model="countersignForm.add_user_ids"></get-dept-emp-select-tree> -->
            <vue-user-role-tree ref="vueUserRoleTree " placeholder="请选择加签审批人，最多选择3个"  :show_all="true" :func_type="0" :is_contain_emp="true" :isShowCheckbox="true" v-model="countersignForm.add_user_ids"></vue-user-role-tree>
          </el-form-item>
          <el-form-item label="" prop="">
           <span style="color:#909399;font-size:12px;">说明:选择多人时默认为会签流程</span>
          </el-form-item>
          <el-form-item label="备注:" prop="remark">
            <el-input type="textarea" v-model="countersignForm.remark" placeholder="请输入加签备注"></el-input>
          </el-form-item>
        </el-form>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="countersignDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitCountersignForm('countersignForm')">确  定</el-button>
      </span>
    </el-dialog>
    <!-- ··················加签··········· -->


  </div>
</template>

<script type="text/ecmascript-6">
import imageBox from '@/components/image-box/index';
import multipleFilesUpload from "@/components/multiple-files-upload";
import VueUserRoleTree from '@/components/base/formModel/tree/user-role-tree/index'
export default {
  components: {imageBox,multipleFilesUpload,multipleFilesUpload,VueUserRoleTree},
  data() {
    return {
      curApproveIndex: 1,
      data:[],
      loading: false,
      commentDialogVisible: false,//是否评论弹窗
      reminderOptions:[],// 提醒人
      form:{
        flow_id:'',
        content:'',
        file_urls:[],
        img_urls:[],
        user_ids:[],
        is_sms: false
      },
      rules: {
        content: [
          {
            required: true,
            message: "请输入评论内容",
            trigger: "change",
          },
        ],
      },

      urgeDialogVisible: false, //是否催办弹窗
      urgeForm:{
        flow_id:'',
        content:'',
        send_users:[],
        is_sms: false,
        send_usersname:''
      },
      urgeRules: {
        content: [
          {
            required: true,
            message: "请输入催办内容",
            trigger: "change",
          },
        ],
      },
      curApproveUserIds:[],

      countersignDialogVisible: false,
      countersignForm:{
        flow_id:'',
        step_id:'',
        state:7,
        add_type:1,
        add_user_ids:[],
        remark:'',
      },
      countersignRules: {
        add_type: [
          {
            required: true,
            message: "请选择加签方式",
            trigger: "change",
          },
        ],
        add_user_ids: [
          {
            required: true,
            message: "请选择加签审批人",
            trigger: "change",
          },
        ],
      },
    };
  },
  filters: {
    outAlertType(state) {
      let type = 'info'
      if (state == 3) {
        type = 'success'
      }
      if (state == 4 || state == 5) {
        type = 'error'
      }
      if (state == 6) {
        type = 'warning'
      }
      return type
    }
  },
  props:{
    plan_id: {},
    form_id: {},
    isFlow: {
      type: Boolean,
      default: false
    },
    flow_id: {},
    doc_id: {},
    type: {
      type: Number,
      default: 1
    },
    flow_record_id: {}
  },
  computed: {},
  mounted() {
    this.loadData()
  },
  methods: {
    // 获取数据
    loadData() {
      this.loading = true
      if (this.isFlow) {
        if (!this.flow_id) {
          this.loading = false
          return false
        }
        this.$client.GetReviewProcessDocumentFlow({
          flow_id: this.flow_id,
          doc_id: this.doc_id,
          type: this.type,
          flow_record_id: this.flow_record_id
        }).then(res => {
          // console.log('流程', res)
          this.loading = false
          if(res.head.result === '200') {
            this.data = res.context;
            this.$emit('out-data', this.data)
            let bool = true
            this.curApproveIndex = this.data.length - 1
            for(let i=0;i<this.data.length;i++){
              let item = this.data[i]
              if (item.state == 1 && bool) {
                this.curApproveIndex = i
                console.log(item, this.curApproveIndex, '下标')
                this.urgeForm.send_users = item.users.length? item.users.map(item => item.id):[]; //获取当前催办节点审批人的id
                this.urgeForm.send_usersname = item.users.length? item.users.map(item => item.name).join('、'):''; //获取当前催办节点审批人的名字
                bool = false
              }
              if (!item.users) {
                  item.users = []
                }
            }
            this.reminderOptions = this.bulidreminderOptions(this.data)
            this.reqCurApproveStepId() //获取当前审批节点id
          }else{
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
        })
      } else {
        this.$client.GetFlowStepFlowRecord({flow_id: this.flow_id})
          .then(res => {
            this.loading = false
            if(res.head.result === '200') {
              this.data = res.context;
              this.$emit('out-data', this.data)
              let bool = true
              this.curApproveIndex = this.data.length - 1
              for(let i=0;i<this.data.length;i++){
                let item = this.data[i]
                if (item.state === 1 && bool) {
                  this.curApproveIndex = i
                  console.log(item, this.curApproveIndex, '下标')

                  this.urgeForm.send_users = item.users.length? item.users.map(item => item.id):[]; //获取当前催办节点审批人的id
                  this.urgeForm.send_usersname = item.users.length? item.users.map(item => item.name).join('、'):''; //获取当前催办节点审批人的名字
                  this.$emit('out-node', item)
                  bool = false
                }
                if (!item.users) {
                  item.users = []
                }
              }
              this.reminderOptions = this.bulidreminderOptions(this.data)
              this.reqCurApproveStepId() //获取当前审批节点id
            }else{
              this.$message({
                showClose: true,
                message: res.head.describle,
                type: "error",
              });
            }
          }).catch(err => {
        })
      }
    },
    //获取当前审批节点id
    reqCurApproveStepId(){
      let isFirst= true;
      if(this.data && !!this.data.length) {
        this.data.forEach((item,index) => {
          if(isFirst && item.state == 1) {
            this.countersignForm.step_id = item.id
            isFirst = false
          }
        });
      }
    },
    checkShowApproveUseName(item,index) {
      let showApproveUseName = '';
      if (item.oper_type == 4) {
        if(item.is_self == 1) {
          showApproveUseName = '我'
          return showApproveUseName
        } else {
          if (!!item.users.length) {
            showApproveUseName = item.users[0].name
          }
          return showApproveUseName
        }
      }
      if (item.oper_type == 5) {
        
          return showApproveUseName
      }
      if(item.state == 3) {
        // this.curApproveIndex = index;
        if (item.users) {
          item.users.forEach((zItem,zIndex) => {
            showApproveUseName +=  `${zItem.name} ,`
          });
        }
        showApproveUseName = showApproveUseName.substring(0, showApproveUseName.length - 1)
        if(item.is_self == 1) {
          showApproveUseName = '我'
        }
        showApproveUseName = showApproveUseName + '(已同意)';
      }
      if(item.state == 4) {
        if (item.users) {
          // this.curApproveIndex = index;
          item.users.forEach((zItem,zIndex) => {
            showApproveUseName +=  `${zItem.name} ,`
          });
        }
        showApproveUseName = showApproveUseName.substring(0, showApproveUseName.length - 1)
        if(item.is_self == 1) {
          showApproveUseName = '我'
        }
        showApproveUseName = showApproveUseName + '(已拒绝)';
      }
      if(item.state == 8) {
        if (item.users) {
          // this.curApproveIndex = index;
          item.users.forEach((zItem,zIndex) => {
            showApproveUseName +=  `${zItem.name} ,`
          });
        }
        showApproveUseName = showApproveUseName.substring(0, showApproveUseName.length - 1)
        if(item.is_self == 1) {
          showApproveUseName = '我'
        }
        showApproveUseName = showApproveUseName + '(已撤销)';
      }
      if(item.state == 6) {
        // this.curApproveIndex = index;
        if (item.users) {
          item.users.forEach((zItem,zIndex) => {
            showApproveUseName +=  `${zItem.name} ,`
          });
        }
        showApproveUseName = showApproveUseName.substring(0, showApproveUseName.length - 1)
        if(item.is_self == 1) {
          showApproveUseName = '我'
        }
        showApproveUseName = showApproveUseName + '(已转交)';
      }
      if(item.state == 5) {
        // this.curApproveIndex = index;
        if (item.users) {
          item.users.forEach((zItem,zIndex) => {
            showApproveUseName +=  `${zItem.name} ,`
          });
        }
        showApproveUseName = showApproveUseName.substring(0, showApproveUseName.length - 1)
        if(item.is_self == 1) {
          showApproveUseName = '我'
        }
        showApproveUseName = showApproveUseName + '(已退回)';
      }

      if(item.state == 1) {
        // this.curApproveIndex = index;
        if (item.users) {
          item.users.forEach((zItem,zIndex) => {
            showApproveUseName +=  `${zItem.name} ,`
          });
        }
        showApproveUseName = showApproveUseName.substring(0, showApproveUseName.length - 1)
        if(item.is_self == 1) {
          showApproveUseName = '我'
        }
        showApproveUseName = showApproveUseName + '(待审核)';
      }
      if(item.state == 2) {
        if (item.users) {
          item.users.forEach((zItem,zIndex) => {
            showApproveUseName +=  `${zItem.name} 、`
          });
        }
        showApproveUseName = showApproveUseName.substring(0, showApproveUseName.length - 1)
        if(item.users.length > 1) {
          showApproveUseName = `${item.users.length}人审批(${showApproveUseName})`
        }
        // showApproveUseName = showApproveUseName + '(审批中)';
      }

      if(item.state == 9) {
        if (item.users) {
          item.users.forEach((zItem,zIndex) => {
            showApproveUseName +=  `${zItem.name} 、`
          });
        }
        showApproveUseName = showApproveUseName.substring(0, showApproveUseName.length - 1)+'(加签)';
        // if(item.users.length > 1) {
        //   showApproveUseName = `${item.users.length}人审批(${showApproveUseName})`
        // }
      }

     if(item.oper_type == 3) {
       showApproveUseName = ''
        item.users.forEach((zItem,zIndex) => {
            showApproveUseName +=  `${zItem.name} + `
        });
        showApproveUseName = showApproveUseName.substring(0, showApproveUseName.length - 2)
        if(item.users.length > 1) {
          showApproveUseName = `抄送${item.users.length}人(${showApproveUseName})`
        }
     }


      return showApproveUseName
    },
    // 构建提醒人选择下拉选项
    bulidreminderOptions(data) {
      let userList = []
      let uerIds = []
      let reminderUserList = []
      data.forEach(item => {
        if(item.users.length) {
          userList = [...userList,...item.users]
        }
      })
      uerIds = [...new Set(userList.map(item =>item.id))]
      uerIds.forEach(id =>{ 
        const uerObj = userList.find(t => t.id === id)
        reminderUserList.push(uerObj)
      })
      console.log(userList,uerIds,reminderUserList)
      return reminderUserList
    },
    // 删除照片
    imageDelete(index) {
      this.form.img_urls.splice(index,1)
    },
    // 自定义上传文件方法
    // :http-request="uploadFile"
    uploadFile() {
      let input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      // input.accept = ".jpg,.jpeg";
      input.onchange = () => {
        let reader = new FileReader();
        reader.readAsDataURL(input.files[0]);
        let file = input.files[0];
        console.log(file)
        reader.onload = (ev) => {
          input = undefined;
        };
        let params = new FormData
        params.append('file', file)
        this.$client.uploadPicture({file: params}, '/api/ERPWeb/PartyHonor/UploadPicture').then((req) => {
          // console.log(req);
          if (req.head.result === "200") {
            let obj = {
              name: file.name,
              url: req.context
            }
            this.form.img_urls.push(obj)
          }
        });
      };
      input.click();
    },
     // 上传文件
    uploadUpdateSuccess(filesList) {
      this.form.file_urls = filesList;
    },
    // 计算时差
    computedTime(startDate,endDate) {
      // console.log(this.$moment(endDate).valueOf(), this.$moment(startDate).valueOf())
      return this.$moment(endDate).valueOf() - this.$moment(startDate).valueOf()
    },
    // 获取当前时间
    setDate() {
      let curTime = ''
      let date = new Date();
      // date.setTime(new Date().getTime());
      let Y = date.getFullYear()
      let M = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)
      let D = date.getDate() < 10 ? ('0' + date.getDate()) : date.getDate()
      let hours = date.getHours() < 10 ? ('0' + date.getHours()) : date.getHours()
      let minutes = date.getMinutes() < 10 ? ('0' + date.getMinutes()) : date.getMinutes()
      let seconds = date.getSeconds() < 10 ? ('0' + date.getSeconds()) : date.getSeconds()
      return curTime = Y + '-' + M + '-' + D + ' ' + hours + ':' + minutes + ':' + seconds
    },
    // 获取提醒人员
    selectedReminderUser(val) {
      // console.log(val)
      this.form.content = this.form.content.slice(this.form.content.lastIndexOf('"')+1,this.form.content.length)
      if(val.length) {
        let str = ''
        val.forEach(id =>{
          this.reminderOptions.forEach(item => {
            if(id == item.id) {
              str = str + '@' + item.name + ' ' 
            }
          })
        })
        this.form.content = '"'+ str + '"'+ this.form.content 
      }
    },
    // 删除评论
    deleteComment(item) {
      let params = {
        id:item.id,
        time: this.setDate()
      }
      // console.log(params)
      // return
      this.$client.DeleteFlowComment(params).then(req => {
        if (req.head.result === '200') {
          this.loadData()
          this.$message({message: req.head.describle, type: 'success'});
        } else {
          this.$message({message: req.head.describle, type: 'error'});
        }
      })
    },
    // 提交评论
    submitCommentForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let context = Object.assign({},this.form) 
          context.flow_id = this.flow_id
          context.is_sms = this.form.is_sms? 1:0
          context.img_urls = this.form.img_urls.map(item => item.url)
          context.file_urls = this.form.file_urls.map(item => {
            let obj = {
              file_name: item.name,
              url:item.url
            }
            return obj
          })
          let parmas = {
            context: context
          };
          this.$client.AddFlowComment(parmas).then((res) => {
            if (res.head.result == "200") {
              this.loadData();
              this.commentDialogVisible = false;
              this.$message({
                showClose: true,
                message: '评论成功',
                type: "success",
              });
            } else {
              this.$message({
                showClose: true,
                message: res.head.describle,
                type: "error",
              });
            }
          }).catch((err) => {});
        } else {
          return false;
        }
      });
    },
    // 发送催办 
    submitUrgeForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let context = Object.assign({},this.urgeForm) 
          context.flow_id = this.flow_id
          context.is_sms = this.urgeForm.is_sms? 1:0
          delete context.send_usersname
          this.$client.RushFlowRecord(context).then((res) => {
            if (res.head.result == "200") {
              this.loadData();
              this.urgeDialogVisible = false;
              this.$message({
                showClose: true,
                message: '发送成功',
                type: "success",
              });
            } else {
              this.$message({
                showClose: true,
                message: res.head.describle,
                type: "error",
              });
            }
          }).catch((err) => {});
        } else {
          return false;
        }
      });
    },
    // 提交加签
    submitCountersignForm(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let context = Object.assign({},this.countersignForm)
          context.flow_id = this.flow_id
          let parmas = {
            context: context
          };
          this.$client.checkFlowRecord(parmas).then((res) => {
            if (res.head.result == "200") {
              this.loadData();
              this.countersignDialogVisible = false;
              this.$message({
                showClose: true,
                message: '加签成功',
                type: "success",
              });
            } else {
              this.$message({
                showClose: true,
                message: res.head.describle,
                type: "error",
              });
            }
          }).catch((err) => {});
        } else {
          return false;
        }
      });
    },
    getFlowFields(id) {
      let params = {
        flow_step_id: id
      }
      this.$client.GetFlowFieid(params).then((res) => {
        console.log(res);
            if (res.head.result == "200") {
              this.$emit('out-field', res.context)
            }else {
              this.$message({
                showClose: true,
                message: res.head.describle,
                type: "error",
              });
            }
          }).catch((err) => {});
    },
    // 重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  },
  watch: {
    flow_id(newval) {
      this.loadData()
    },
    commentDialogVisible() {
      if(!this.commentDialogVisible) {
         this.resetForm('form')
         this.form.is_sms = false
      }
    },
    urgeDialogVisible() {
      if(!this.urgeDialogVisible) {
         this.resetForm('urgeForm')
      }else{
        this.urgeForm.content = this.data.length && this.data[0].users && this.data[0].users[0].name + '提醒您审批他(她)的审批单'
      }
    },
    countersignDialogVisible() {
      if(!this.countersignDialogVisible) {
         this.resetForm('countersignForm')
      }
    },
    'countersignForm.add_user_ids'(){
      if(this.countersignForm.add_user_ids.length > 15) {
        this.countersignForm.add_user_ids = []
        this.$message({
          showClose: true,
          message: '最多只能选择十五个加签审批人',
          type: 'warning'
        });
      }
    },
    // 'countersignForm.step_id'(id) {
    //   // 获取流程表单字段
    //   this.getFlowFields(id)
    // }
  },
};
</script>
<style lang='stylus' rel="stylesheet/stylus" scoped>
.icon-content {
  width: 100%;
  height: 100%;
}

.approve-schedule /deep/ .el-icon-video-pause {
    // width: 2px;
    // top: 1px;
    // bottom: 0px;
    // left: 12px;
}

.approve-schedule /deep/ .el-step__description {
  padding-right: 10% !important;
}


// .approve-schedule /deep/ .el-step__icon {
//    border: 0px solid;
// }
.approve-schedule /deep/ .el-step__icon-inner {
  padding-bottom: 2px;
}
.description-content{
  margin-bottom 30px;
}

.description-content-text {
  justify-content:space-between;
  span{
    color: #999999;
  }
}
.approve-schedule /deep/ .el-icon-s-promotion:before {
  width: 22px;
  height: 22px;
  // border: 2px #409EFF solid;
  border-radius: 50%;
  background:#409EFF;
}

.approve-schedule /deep/ .el-icon-more:before {
  width: 22px;
  height: 22px;
  // border: 2px #409EFF solid;
  border-radius: 50%;
  background:#409EFF;
}

.list-data-list
  flex-wrap: wrap;
  align-items: center;
  .list-data
    // width: 450px
    overflow: hidden
  .item
    float: left
    width: 100px
    height: 100px
    margin: 5px
  .unchecked
    border-radius: 4px
    border: 2px dashed #606266
    text-align: center
    line-height: 130px
    &:hover
      border-color: #409EFF
      color: #409EFF

.multiple-files /deep/ .document-content {
  padding: 5px 4px 10px;
}
</style>
