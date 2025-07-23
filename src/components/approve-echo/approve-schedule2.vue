
<template>
  <div  class="approve-schedule" v-loading="loading" style="width: 100%">
    <el-empty description="暂无流程数据" v-if="!data.length"></el-empty>
    <el-steps direction="vertical" v-else :active="curApproveIndex == data.length - 1 ? curApproveIndex + 1 : curApproveIndex" finish-status="finish">
      <el-step
        :title="item.title"
        v-for="(item,index) in data"
        :key="index"
        :class="{'to-be-reviewed' : item.state == '0' || item.oper_type == 3,'connecting': item.state == 1,'CcColor': isclose}">
        <div class="textIcon" slot="icon">
          <div class="textIcon-center">
            <img v-if="item.oper_type == 3" src="@/assets/technological-process/chaosong.png" alt="" style="width:100%;height:100%">
            <img v-else-if="item.users.length > 1" src="@/assets/technological-process/duoren.png" alt="" style="width:100%;height:100%">
            <img v-else-if="item.oper_type == 4" src="@/assets/technological-process/faqi.png" alt="" style="width:100%;height:100%">
            <img v-else src="@/assets/technological-process/shenpi.png" alt="" style="width:100%;height:100%">
          </div>
          <div class="textIcon-subscript">
            <div v-if="item.state == 0 || item.oper_type == 3"></div>
            <img v-else-if="item.oper_type == 5" src="@/assets/technological-process/pinglun.png" alt="" style="width:100%;height:100%">
            <img v-else-if="item.state == 1" src="@/assets/technological-process/daiban.png" alt="" style="width:100%;height:100%">
            <img v-else-if="item.state == 4" src="@/assets/technological-process/jujue.png" alt="" style="width:100%;height:100%">
            <img v-else-if="item.state == 5 || item.state == 10" src="@/assets/technological-process/tuihui.png" alt="" style="width:100%;height:100%">
            <img v-else-if="item.state == 6" src="@/assets/technological-process/zhuanfa.png" alt="" style="width:100%;height:100%">
            <img v-else-if="item.state == 8" src="@/assets/technological-process/chexiao.png" alt="" style="width:100%;height:100%">
            <img v-else src="@/assets/technological-process/wancheng.png" alt="" style="width:100%;height:100%">
          </div>
        </div>
        <!-- <i class="el-icon-circle-check" slot="icon" style="font-size: 28px;width:26px; height:26px; display: inline-block;background:#ffff;"
           v-if="item.state == 3"></i>
        <i class="el-icon-circle-close" slot="icon" style="font-size: 28px;width:26px; height:26px; display: inline-block;background:#fff;color: #F56C6C"
           v-if="item.state == 4 || item.state == 7"></i>
        <i class="el-icon-more" slot="icon"
           style="font-size: 26px;width:26px; height:26px; display: inline-block; background:#ffff;color: #ffff;"
           v-if="curApproveIndex == index && (item.state == 2 || item.state == 1) && item.oper_type !== 3"></i>
        <i class="el-icon-s-promotion" slot="icon"
           style="font-size: 26px;width:26px; height:26px; display: inline-block; color: #ffff;background:#ffff; border-radius: 50%"
           v-if="item.oper_type == 3"></i> -->
        <!-- <i class="el-icon-video-pause" slot="icon" style="font-size: 26px;width:26px; height:26px; display: inline-block; color: #409EFF" v-if="item.type != 2 && index != 0"></i> -->
        <template slot="title">
          <div v-if="item.oper_type == 5" class="comment-title" style="margin-right:10%;margin-top: 10px;">
            <div style="width: 100%;display: flex;justify-content: space-between;">
              <span>{{item.title}}</span>
              <span v-if="!isModifyTime" style="font-size: 12px;color: #999;">{{item.date}}</span>
              <div v-else>
                <el-date-picker
                  v-model="item.date"
                  @change="changeTime($event,item,index)"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  :clearable="false"
                  type="datetime"
                  :picker-options="pickerOptionsList[index]">
                </el-date-picker>
              </div>
            </div>
          </div>
        </template>
        <template slot="description">
          <div class="description-content">
            <div class="description-content-text show-flex-box-r" v-if="item.oper_type !== 5" style="width: 100%;">
              <span>
                {{checkShowApproveUseName(item,index)}}
                <span v-if="item.state == 10" style="color:red">{{"退回至发起人"}}</span>
                <el-tooltip v-if="item.oper_type == 3" class="item" effect="dark" content="添加抄送人" placement="top-start">
                  <el-tag size="mini" @click="showCopy(item)">+</el-tag>
                </el-tooltip>
              </span>
              <span v-if="item.oper_type !=5">
                <span v-if="!isModifyTime">{{item.date}}</span>
                <div v-else>
                  <el-date-picker
                    v-show="!!item.date"
                    v-model="item.date"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    @change="changeTime($event,item,index)"
                    :clearable="false"
                    type="datetime"
                    :picker-options="pickerOptionsList[index]">
                  </el-date-picker>
                </div>
              </span>
            </div>
            <div v-if="item.users.length > 1 || (item.oper_type ==3 && item.users.length > 0)" style="display:flex;margin-top:15px;">
              <div v-if="item.users.length > 7" @click="showAllUser(item)" style="margin-right:30px;text-align:center;cursor: pointer">
                <div style="margin:auto">
                  <img src="@/assets/technological-process/duoren.png" alt="" style="width:40px;height:40px;background-color:#86A1CB;padding:5px">
                  <div style="white-space:nowrap;color:#666;">{{"查看全部"}}</div>
                </div>
              </div>
              <div v-for="(child,index) in item.users.slice(0,7)" :key="index" style="margin-right: 10px">
                <div style="text-align: center;">
                  <img src="@/assets/technological-process/shenpi.png" alt="" style="width:40px;height:40px;background-color:#3399FE;padding:5px;">
                </div>
                <div style="text-align: center;">
                  <el-tooltip :disabled="!(child.name && child.name.length > 3)" class="item" effect="dark" :content="child.name" placement="top">
                    <span style="color:#666">{{item.oper_type == 3 ? setCopyUserName(child) : child.name ? child.name.slice(0,3) : ''}}</span>
                  </el-tooltip>
                </div>
              </div>
              <div v-if="item.users.length > 7" style="display: flex;align-items: center;">
                <span style="color:#666">● ● ●</span>
              </div>
            </div>
            <div v-if="item.users.length == 0 && item.oper_type == 1">
              未添加审批人，流程自动通过。
            </div>
            <div style="margin-top:15px">
              <el-alert
                v-if="item.remark && item.oper_type != 5"
                :description="item.remark"
                :closable="false"
                :type="item.state | outAlertType">
              </el-alert>

              <div v-if="item.oper_type == 5" style="background:#F4F4F5; padding: 5px 10px;">
                <div class="show-flex-box-r" style="align-items: center;">
                  <span style="flex-grow: 1;color:#666;margin-left:10px">{{item.remark}}</span>
                  <el-popconfirm
                    @confirm="deleteComment(item)"
                    title="确认删除评论?"
                    v-if="(computedTime(item.date,setDate()) < 300000 && item.remark.indexOf('原评论已删除') == -1) && userId == item.comment_user_id"
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
              <div v-if="item.oper_type == 6 && !!item.add_check_name" >
                <span>添加审批人:{{item.add_check_name}}</span>
              </div>
              <div v-if="item.sign_img" style="margin-top: 5px;">
                <el-image style="width: 150px;height: 100px;" :src="item.sign_img"></el-image>
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
          <el-form-item label="提醒人:" prop="">
            <span style="color:#D9001B">{{urgeForm.send_usersname}}</span>
          </el-form-item>
          <el-form-item label="" prop="is_sms">
            <el-checkbox v-model="urgeForm.is_sms" style="margin-left: 10px;">短信提醒</el-checkbox>
          </el-form-item>
          <el-form-item label="说明:" prop="">
           <span style="color:#909399;font-size:12px;">默认仅催办当前审批节点的审批人；提醒方式默认为系统通知.催办后1小时内无法再次催办</span>
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
      @close="$refs.vueUserRoleTree ? $refs.vueUserRoleTree.onClear() : null"
      >
      <div class="comment-div-dialog">
        <el-form ref="countersignForm" size="mini" :model="countersignForm" :rules="countersignRules"  label-width="100px">
          <el-form-item label="流程名称:" prop="flow_title">
            <el-input v-model="countersignForm.flow_title" placeholder="请输入流程名称"></el-input>
          </el-form-item>
          <el-form-item label="加签方式:" prop="add_type">
            <el-radio-group v-model="countersignForm.add_type">
              <el-radio :label="1">在我之前</el-radio>
              <el-radio :label="2">在我之后</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="加签审批人:" prop="add_user_ids">
            <!-- <get-dept-emp-select-tree placeholder="请选择加签审批人，最多选择3个" :is_contain_emp="true" :isShowCheckbox="true" v-model="countersignForm.add_user_ids"></get-dept-emp-select-tree> -->
             <vue-user-role-tree
               ref="vueUserRoleTree" placeholder="请选择加签审批人，最多选择6个"
               :show_all="true" :func_type="0" :is_contain_emp="true" :isCheckSort="true"
               :isShowCheckbox="true" v-model="countersignForm.add_user_ids"
               @on-change="changeSelectInfo"></vue-user-role-tree>
          </el-form-item>
          <el-form-item label="" prop="">
           <span style="color:#909399;font-size:12px;">说明:选择多人时默认为会签流程</span>
          </el-form-item>
          <el-form-item label="备注:" prop="remark">
            <el-input type="textarea" @focus="focusIndex = 1" v-model="countersignForm.remark" placeholder="请输入加签备注"></el-input>
          </el-form-item>
          <el-form-item label="加签备注:" prop="sign_remark" v-if="countersignForm.add_type == 2">
            <el-input type="textarea" @focus="focusIndex = 2" v-model="countersignForm.sign_remark" placeholder="请输入加签备注"></el-input>
          </el-form-item>
          <el-form-item label="加签备注:" prop="sign_img" v-if="countersignForm.add_type == 2 && configInfo.write_sign == 1">
            <handwritten-signature
              ref="signature"
              width="150"
              height="100"        
              @get-img="getSign">
            </handwritten-signature>
          </el-form-item>
        </el-form>
        <div class="itemBox" style="margin-left:10px">
          <el-row>
            <el-col :span="24" style="margin-bottom:10px">
              <span>审批常用语：</span> 
              <el-select v-model="wordIds" @change="getWordsList" filterable multiple collapse-tags placeholder="请选择">
                <el-option
                  v-for="item in commonWordsList"
                  :key="item.id"
                  :label="item.language"
                  :value="item.language">
                  <span style="float: left;max-width:110px;overflow: hidden;text-overflow: ellipsis;">{{ item.language }}</span>
                </el-option>
              </el-select>
              <el-button style="margin-left:10px" type="primary" @click="saveForm">设为常用语</el-button>
            </el-col>
            <el-col :span="6" v-for="(item,index) in wordsList" :key="index" class="commonWords">
                <div class="box" @click="addCommonWords(item.language)">
                  {{item.language}}
                </div>
            </el-col>
          </el-row>
        </div>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="countersignDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitCountersignForm('countersignForm')">确  定</el-button>
      </span>
    </el-dialog>
    <!-- ··················加签··········· -->

    <!-- ··················显示所有人员··········· -->
    <el-dialog
      :title="usersInfo.title"
      :visible.sync="userDialog"
      width="600px"
      append-to-body
      :close-on-click-modal="false"
    >
      <div style="margin-left:15px" v-if="this.usersInfo.oper_type == 3">
        <span>{{usersInfo.title + usersInfo.number + '人'}}</span>
        <el-tabs v-model="activeName">
          <el-tab-pane :label="`已读(${is_read.length})人`" name="first">
            <div style="display:flex;flex-wrap:wrap;max-height: 360px;overflow: auto;">
              <div v-for="(child,index) in is_read" :key="index" style="margin: 15px 30px 15px 0;text-align:center">
                <div style="width:40px;height:40px;background-color:#3399FE;margin-bottom: 5px;">
                  <img src="@/assets/technological-process/shenpi.png" alt="" style="width:100%;height:100%;padding:5px">
                </div>
                <el-tooltip :disabled="!(child.name && child.name.length > 3)" class="item" effect="dark" :content="child.name" placement="top">
                  <span style="color:#666">{{child.name ? child.name.slice(0,3) : ''}}</span>
                </el-tooltip>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane :label="`未读(${is_unread.length})人`" name="second">
            <div style="display:flex;flex-wrap:wrap;max-height: 360px;overflow: auto;">
              <div v-for="(child,index) in is_unread" :key="index" style="margin: 15px 30px 15px 0;text-align:center">
                <div style="width:40px;height:40px;background-color:#3399FE;margin-bottom: 5px;">
                  <img src="@/assets/technological-process/shenpi.png" alt="" style="width:100%;height:100%;padding:5px">
                </div>
                <el-tooltip :disabled="!(child.name && child.name.length > 3)" class="item" effect="dark" :content="child.name" placement="top">
                  <span style="color:#666">{{child.name ? child.name.slice(0,3) : ''}}</span>
                </el-tooltip>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>

      </div>
      <div style="margin-left:15px" v-else>
        <span>{{usersInfo.title + usersInfo.number + '人'}}</span>
        <div style="display:flex;flex-wrap:wrap;">
          <div v-for="(child,index) in usersInfo.users" :key="index" style="margin: 15px 30px 15px 0;text-align:center">
            <div style="width:40px;height:40px;background-color:#3399FE;margin-bottom: 5px;">
              <img src="@/assets/technological-process/shenpi.png" alt="" style="width:100%;height:100%;padding:5px">
            </div>
            <el-tooltip :disabled="!(child.name && child.name.length > 3)" class="item" effect="dark" :content="child.name" placement="top">
              <span style="color:#666">{{child.name ? child.name.slice(0,3) : ''}}</span>
            </el-tooltip>
          </div>
        </div>
      </div>
    </el-dialog>
    <!-- ··················显示所有人员··········· -->

    <!-- ··················新增抄送人··········· -->
    <el-dialog :visible.sync="dialogCopy" append-to-body :close-on-click-modal="false" width="740px" title="选择人员">
      <user-role-tree-list v-if="dialogCopy" ref="userRoleTreeList" ser-role-tree-list placeholder="选择抄送人员"  :show_all="true" :func_type="0" :is_contain_emp="true" :isShowCheckbox="true"></user-role-tree-list>
      <div style="text-align:right;margin-top:15px">
        <el-button @click="dialogCopy = false">取消</el-button>
        <el-button type="primary" @click="addCC">确认</el-button>
      </div>
    </el-dialog>
    <!-- ··················新增抄送人··········· -->
  </div>
</template>

<script type="text/ecmascript-6">
import handwrittenSignature from '@/components/handwritten-signature'
import imageBox from '@/components/image-box/index';
import multipleFilesUpload from "@/components/multiple-files-upload";
import VueUserRoleTree from '@/components/base/formModel/tree/user-role-select-tree/index'
import UserRoleTreeList from '@/components/base/formModel/tree/user-role-tree/list'
import { getUser } from '@/utils/auth';
import { formatTime } from '@/utils/index';
export default {
  components: {imageBox,multipleFilesUpload,VueUserRoleTree, UserRoleTreeList,handwrittenSignature},
  data() {
    return {
      curApproveIndex: 1,
      userId: Number(JSON.parse(getUser()).user_id),
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
        flow_title:'',
        flow_id:'',
        step_id:'',
        state:7,
        add_type:1,
        add_user_ids:[],
        remark:'',
        sign_remark:'',
        sign_img: '',
      },
      countersignRules: {
        flow_title: [
          {
            required: true,
            message: "请输入流程名称",
            trigger: "change",
          },
        ],
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
        sign_img: [
          {
            required: true,
            message: "请签字",
            trigger: "change",
          }
        ]
      },

      usersInfo: {
        title: '',
        number: 0,
        users: [],
        oper_type: 0
      },
      userDialog: false,
      isclose: false,
      is_read: [], //已读人员
      is_unread: [], //已读人员
      activeName: 'first',
      copy_step_id:'',  //抄送节点id
      dialogCopy: false,  // 抄送人员弹窗
      initiator: 0, //发起人id
      isModifyTime: false,

      commonWordsList: [],
      wordsList: [],
      wordIds: [],
      model: '',
      focusIndex: 1,
      configInfo: {},       // 流程配置参数
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
    // 是否为公文
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
    flow_record_id: {},
    flowData: {
      type: Array,
      default: () => []
    },
    // 是否为撤销流程
    isCancel: {
      type: Boolean,
      default: false
    },
  },
  computed: {},
  mounted() {
    if (this.isCancel) {
      this.data = this.flowData      
    }else {
      this.$nextTick(() => {
        this.loadData()
        this.GetFlowConfigByFlowId()
      })
    }
  },
  methods: {
    // 获取流程配置信息(已发起后使用) 
    GetFlowConfigByFlowId() {
      let flow_id = this.isFlow ? this.flow_record_id : this.flow_id
      this.$client.GetFlowConfigByFlowId({flow_id:flow_id})
        .then(res => {
          if (res.head.result == "200") {
            this.configInfo = res.context
            this.$emit('on-config',this.configInfo)
          } else {
          }
        })
    },
    // 签字 
    getSign(url) {
      this.countersignForm.sign_img = url
    },
    // 添加常用语
    saveForm() {
      let info = this.focusIndex == 1 ? this.countersignForm.remark : this.countersignForm.sign_remark
      if (!info) {
        this.$message({
          showClose: true,
          message: "常用语不能为空，请输入内容",
          type: "warning",
        });
        return
      }
      let parmas = {
        context: {
          sort: -1,
          type: -1,
          buttons: [1,2,3,4],
          is_all: 1,
          form_ids: [],
          language: info,
        }
      };
      this.$client.AddCommonPhrase(parmas)
        .then((res) => {
          if (res.head.result == "200") {
            this.$message({
              showClose: true,
              message: '添加成功',
              type: "success",
            });
            this.GetListCommonPhrase()
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
    // 获取常用语列表
    getWordsList(list) {
      let info = ''
      list.forEach(item => {
        info += item
      })
      if (this.focusIndex == 1) {
        this.countersignForm.remark += info
      } else {
        this.countersignForm.sign_remark += info
      }
      this.wordIds = []
    },
    addCommonWords(info){
      if (this.focusIndex == 1) {
        this.countersignForm.remark += info
      } else {
        this.countersignForm.sign_remark += info
      }
    },
    // 获取常用语
    GetListCommonPhrase() {
      let params = {
        context: {
          page_index: 1,
          page_size: 999,
          buttons: [2],
          form_ids: [Number(this.model)],
          is_enable: 1
        }
      }
      this.wordIds = []
      this.$client.GetListCommonPhrase(params)
        .then(res => {
          if (res.head.result == "200") {
            this.commonWordsList = res.context.list;
            this.wordsList = this.commonWordsList.slice(0,8)
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
        })
    },
    // 抄送人是否已读
    setCopyUserName(val) {
      let isReadForUser = `${val.name ? val.name.slice(0,3) : ''}(${!val.read ? '未读' : '已读'})+ `
      isReadForUser = isReadForUser.substring(0, isReadForUser.length - 2)
      return isReadForUser
    },
    // 显示所有人员
    showAllUser(val) {
      this.usersInfo.title = val.title
      this.usersInfo.number = val.users.length
      this.usersInfo.users = val.users
      this.usersInfo.oper_type = val.oper_type
      this.userDialog = true
    },
    // 获取数据
    loadData() {
      this.loading = true
      this.is_read = []
      this.is_unread = []
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
          if(res.head.result == '200') {
            this.data = res.context.review_state;
            // let list = res.context
            let obj = {
              state: res.context.mark ? res.context.mark : '',
              remark: res.context.remark ? res.context.remark : ''
            }
            this.$emit('out-data', this.data, obj, res.context.check_ids)
            let bool = true
            this.curApproveIndex = this.data.length - 1
            for(let i=0;i<this.data.length;i++){
              let item = this.data[i]
              if (item.state == 1 && bool) {
                this.curApproveIndex = i
                console.log(item, this.curApproveIndex, '下标')
                if(item.users.length) {
                  this.urgeForm.send_users = (item.is_seq == 1) ? (item.users.map(item => item.id)).slice(0,1):item.users.map(item => item.id); //获取当前催办节点审批人的id
                  this.urgeForm.send_usersname = (item.is_seq == 1)? (item.users.map(item => item.name).slice(0, 1)).toString(): item.users.map(item => item.name).join('、'); //获取当前催办节点审批人的名字
                }else {
                  this.urgeForm.send_users = []; //获取当前催办节点审批人的id
                  this.urgeForm.send_usersname = ''; //获取当前催办节点审批人的名字
                }
                // console.log(this.urgeForm);
                bool = false
              }
              if(item.oper_type == 3 && item.users.length) {
                for(let k = 0; k < item.users.length; k++) {
                  if(item.users[k].read) {
                    this.is_read.push(item.users[k])
                  }else {
                    this.is_unread.push(item.users[k])
                  }
                }
              }

              if (!item.users) {
                  item.users = []
                }
            }
            this.reminderOptions = this.bulidreminderOptions(this.data)
            this.reqCurApproveStepId() //获取当前审批节点id
            let isCompleted =  this.data.findIndex(item => {return item.state === 1})
            //  如果节点中没有待处理   即已完成
            this.isModifyTime = false
            if (isCompleted === -1) {
              this.GetUpdateFormById()
            }
            this.processIsEnd()
          }else{
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
        })
      } else {
        if (!this.flow_id) {
          this.loading = false
          return false
        }
        this.$client.GetFlowStepFlowRecord({flow_id: this.flow_id})
          .then(res => {
            this.loading = false
            if(res.head.result == '200') {
              this.data = res.context.flow_steps
              let list = (res.context.cancel_flow_steps && res.context.cancel_flow_steps.length) ? res.context.cancel_flow_steps : []
              let obj = {
                state: res.context.mark ? res.context.mark : '',
                remark: res.context.remark ? res.context.remark : ''
              }
              this.$emit('out-data', this.data, obj, list)
              let bool = true
              this.curApproveIndex = this.data.length - 1
              for(let i=0;i<this.data.length;i++){
                let item = this.data[i]
                if (item.state == 1 && bool) {
                  this.curApproveIndex = i
                  console.log(item, this.curApproveIndex, '下标')
                  if(item.users.length) {
                    this.urgeForm.send_users = (item.is_seq == 1) ? (item.users.map(item => item.id)).slice(0,1):item.users.map(item => item.id); //获取当前催办节点审批人的id
                    this.urgeForm.send_usersname = (item.is_seq == 1)? (item.users.map(item => item.name).slice(0, 1)).toString(): item.users.map(item => item.name).join('、'); //获取当前催办节点审批人的名字
                  }else {
                    this.urgeForm.send_users = []; //获取当前催办节点审批人的id
                    this.urgeForm.send_usersname = ''; //获取当前催办节点审批人的名字
                  }
                  // this.urgeForm.send_users = item.users.length? item.users.map(item => item.id):[]; //获取当前催办节点审批人的id
                  // this.urgeForm.send_usersname = item.users.length? item.users.map(item => item.name).join('、'):''; //获取当前催办节点审批人的名字
                  this.$emit('out-node', item)
                  bool = false
                }
                if (!item.users) {
                  item.users = []
                }
                if(item.oper_type == 3 && item.users.length) {
                  for(let k = 0; k < item.users.length; k++) {
                    if(item.users[k].read) {
                      this.is_read.push(item.users[k])
                    }else {
                      this.is_unread.push(item.users[k])
                    }
                  }
                }
              }
              this.reminderOptions = this.bulidreminderOptions(this.data)
              this.reqCurApproveStepId() //获取当前审批节点id
              let isCompleted =  this.data.findIndex(item => {return item.state === 1})
              //  如果节点中没有待处理   即已完成
              this.isModifyTime = false
              if (isCompleted === -1) {
                this.GetUpdateFormById()
              }
              this.processIsEnd()
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
    // 根据state 是否包含 待审核  来判断流程是否结束
    processIsEnd() {
      let state = this.data.find(item => item.state == 1)
      // console.log(state,'1111111111111111111');
      if (state) {
        this.isclose = false
      }else{
        this.isclose = true
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
          if(item.oper_type == 4) {
            this.initiator = item.users[0].id
          }
        });
      }
      // console.log(this.countersignForm.step_id, '-------------------');
    },
    checkShowApproveUseName(item,index) {
      let showApproveUseName = '';
      let confirmName = '';
      if (item.oper_type == 4) {
        if(item.is_self == 1) {
          showApproveUseName = '我'
          return showApproveUseName
        } else {
          if (!!item.users.length) {
            showApproveUseName = item.users[0].name + (item.users[0].replace_name ? item.users[0].replace_name : '')
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
        // showApproveUseName = showApproveUseName.substring(0, showApproveUseName.length - 1)
        showApproveUseName = item.users.length > 1 ? item.users.length + '人' : item.users[0].name
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
        // showApproveUseName = showApproveUseName.substring(0, showApproveUseName.length - 1)
        showApproveUseName = item.users.length > 1 ? item.users.length + '人' : item.users[0].name
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
        // showApproveUseName = showApproveUseName.substring(0, showApproveUseName.length - 1)
        showApproveUseName = item.users.length > 1 ? item.users.length + '人' : item.users[0].name
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
        // showApproveUseName = showApproveUseName.substring(0, showApproveUseName.length - 1)
        showApproveUseName = item.users.length > 1 ? item.users.length + '人' : item.users[0].name
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
        // showApproveUseName = showApproveUseName.substring(0, showApproveUseName.length - 1)
        showApproveUseName = item.users.length > 1 ? item.users.length + '人' : item.users[0].name
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
        // showApproveUseName = item.users.length > 1 ? item.users.length + '人' : item.users[0].name
        if(item.is_self == 1) {
          showApproveUseName = '我'
        }
        if (item.confirm_type == 1) {
          if (item.is_seq) {
            confirmName = "依次审批"
          }else {
            confirmName = "会签"
          }
        } else {
          confirmName =  "或签"
        }
        if(item.users.length > 1) {
          // showApproveUseName = `${item.users.length}人审批(${showApproveUseName})`
          showApproveUseName = `${item.users.length}人${confirmName}(待审核)`
        }else {
          showApproveUseName = showApproveUseName + '(待审核)';
        }
        // showApproveUseName = showApproveUseName + confirmName + '(待审核)';
      }
      if(item.state == 2) {
        if (item.users) {
          item.users.forEach((zItem,zIndex) => {
            showApproveUseName +=  `${zItem.name} 、`
          });
        }
        showApproveUseName = showApproveUseName.substring(0, showApproveUseName.length - 1)
        if (item.confirm_type == 1) {
          if (item.is_seq) {
            confirmName = "依次审批"
          }else {
            confirmName = "会签"
          }
        } else {
          confirmName =  "或签"
        }
        if(item.users.length > 1) {
          // showApproveUseName = `${item.users.length}人审批(${showApproveUseName})`
          showApproveUseName = `${item.users.length}人${confirmName}(审批中)`
        }else {
          showApproveUseName = showApproveUseName + '(审批中)';
        }
        // showApproveUseName = showApproveUseName + '(审批中)';
      }

      if(item.state == 9) {
        if (item.users) {
          item.users.forEach((zItem,zIndex) => {
            showApproveUseName +=  `${zItem.name} 、`
          });
        }
        showApproveUseName = showApproveUseName.substring(0, showApproveUseName.length - 1);
        if(item.users.length > 1) {
          showApproveUseName = `${item.users.length}人(加签)`
        } else {
         showApproveUseName = `${showApproveUseName}(加签)`
        }
      }

      if(item.state == 10) {
        if (item.users) {
          item.users.forEach((zItem,zIndex) => {
            showApproveUseName +=  `${zItem.name} 、`
          });
        }
        showApproveUseName = showApproveUseName.substring(0, showApproveUseName.length - 1);
        showApproveUseName = `${showApproveUseName}`
      }


      if(item.state == 0) {
        if (item.users) {
          item.users.forEach((zItem,zIndex) => {
            showApproveUseName +=  `${zItem.name} 、`
          });
        }
        showApproveUseName = showApproveUseName.substring(0, showApproveUseName.length - 2)
        if (item.confirm_type == 1) {
          if (item.is_seq) {
            confirmName = "依次审批"
          }else {
            confirmName = "会签"
          }
        } else {
          confirmName =  "或签"
        }
        if(item.users.length > 1) {
          // showApproveUseName = `${item.users.length}人审批(${showApproveUseName})`
          showApproveUseName = `${item.users.length}人${confirmName}`
        }else {
          showApproveUseName = showApproveUseName;
        }
      }

      if(item.state == 11) {
        // this.curApproveIndex = index;
        if (item.users) {
          item.users.forEach((zItem,zIndex) => {
            showApproveUseName +=  `${zItem.name} ,`
          });
        }
        // showApproveUseName = showApproveUseName.substring(0, showApproveUseName.length - 1)
        showApproveUseName = item.users.length > 1 ? item.users.length + '人' : item.users[0].name
        showApproveUseName = showApproveUseName + '(已提交)';
      }

      if(item.oper_type == 3) {
        showApproveUseName = ''
        item.users.forEach((zItem,zIndex) => {
            showApproveUseName +=  `${zItem.name}、 `
        });
        let readList = []
        if(!!item.users.length) {
          readList = item.users.filter(it => {
            return !!it.read
          })
        }
        showApproveUseName = showApproveUseName.substring(0, showApproveUseName.length - 2)
        // if(item.users.length > 8) {
          // showApproveUseName = `抄送${item.users.length}人(${showApproveUseName})`
        showApproveUseName = `抄送${item.users.length}人 (${readList.length}人已读)`
        // }else {
          // showApproveUseName = `${showApproveUseName} (${this.is_read.length}人已读)`
        // }
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
        const uerObj = userList.find(t => t.id == id)
        reminderUserList.push(uerObj)
      })
      // console.log(userList,uerIds,reminderUserList)
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
          if (req.head.result == "200") {
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
        if (req.head.result == '200') {
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
          context.flow_id = this.isFlow ? this.flow_record_id : this.flow_id
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
          context.flow_id = this.isFlow ? this.flow_record_id : this.flow_id
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
    //nodeArr(节点数组) nodeIdArr(节点id数组)
    changeSelectInfo(nodeArr, nodeIdArr) {
      // console.log(nodeArr, 'nodeArr');
      // console.log(nodeIdArr, 'nodeIdArr');
      this.countersignForm.add_user_ids = Array.from(new Set(nodeIdArr));
    },
    // 提交加签
    submitCountersignForm(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let context = Object.assign({},this.countersignForm)
          context.flow_id = this.isFlow ? this.flow_record_id : this.flow_id
          let parmas = {
            context: context
          };
          this.$client.checkFlowRecord(parmas).then((res) => {
            if (res.head.result == "200") {
              this.loadData();
              this.$emit('on-get')
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
    // 重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    // 打开抄送弹窗
    showCopy(item) {
      this.copy_step_id = item.id
      this.dialogCopy = true
    },
    // 流程结束后新增抄送人
    addCC() {
      let ids = this.$refs.userRoleTreeList.id
      if(!ids || !ids.length) {
        this.$message.warning('请选择抄送人员')
        return
      }
      let params = {
        flow_id: this.isFlow ? this.flow_record_id : this.flow_id,
        user_ids: ids,
        step_id: this.copy_step_id
      }
      this.$client.FlowCopyFlowRecord(params).then(res => {
        if (res.head.result == '200') {
          this.dialogCopy = false
          this.loadData()
          this.$message({message:'抄送成功',type: 'success'});
        } else {
          this.$message({message:res.head.describle,type: 'error'});
        }
      })
    },
    // 根据id获取是否可以更改流程时间
    GetUpdateFormById() {
      let form_id
      if (this.$route && this.$route.params && this.$route.params.model) {
        form_id = this.$route.params.model
      }
      this.pickerOptionsList = []
      let now_date = formatTime(new Date())
      let one_date = 24 * 60 * 60 * 1000
      this.$client.GetUpdateFormById({form_id}).then(req => {
        if (req.head.result == '200') {
          if (req.context) {
            this.data.forEach((item,index) => {
              let obj
              if (index === 0) {
                let date = formatTime(new Date(this.data[index + 1].date))
                obj = {
                  disabledDate(time) {
                    return time.getTime(now_date) > new Date(date).getTime();
                  },
                }
              }
              else if (index === this.data.length - 1) {
                let date = formatTime(new Date(this.data[index - 1].date))
                obj = {
                  disabledDate(time) {
                    return time.getTime(now_date) < (new Date(date).getTime() - one_date);
                  },
                }
              } else {
                let date1 = formatTime(new Date(this.data[index - 1].date))
                let date2 = formatTime(new Date(this.data[index + 1].date))
                obj = {
                  disabledDate(time) {
                    return time.getTime(now_date) < (new Date(date1).getTime() - one_date) || time.getTime(now_date) > new Date(date2).getTime()
                  },
                }
              }
              this.pickerOptionsList.push(obj)
            })
          }
          this.isModifyTime = req.context
        }
      })
    },
    // 修改节点时间
    changeTime(val,item,index){
      console.log('val',val);
      if (index === 0) {
        let date = this.data[index + 1].date
        if (new Date(val).getTime() > new Date(date).getTime()) {
          this.$message({message: '修改时间不能大于下一个节点', type: 'warning'});
          return
        }
      } else if (index === this.data.length - 1) {
        let date = this.data[index - 1].date
        if (new Date(val).getTime() < new Date(date).getTime()) {
          this.$message({message: '修改时间不能小于上一个节点', type: 'warning'});
          return
        }
      } else {
        let date1 = this.data[index - 1].date
        let date2 = this.data[index + 1].date
        if (new Date(val).getTime() < new Date(date1).getTime()) {
          this.$message({message: '修改时间不能小于上一个节点', type: 'warning'});
          return
        }
        if (new Date(val).getTime() > new Date(date2).getTime()) {
          this.$message({message: '修改时间不能大于下一个节点', type: 'warning'});
          return
        }
      }
      let context = {
        check_date: val,
        step_id: item.id,
        title: item.title,
        oper_type: item.oper_type
      }
      this.$client.UpdateCheckDate({context}).then(req => {
        if (req.head.result == '200') {
          this.loadData()
        }
      })
    },
  },
  watch: {
    // flow_id(newval) {
    //   this.loadData()
    // },
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
      } else {
        if (this.$route && this.$route.params && this.$route.params.model) {
          this.model = this.$route.params.model
          this.GetListCommonPhrase()
        }
      }
    },
    'countersignForm.add_user_ids'(){
      if(this.countersignForm.add_user_ids.length > 15) {
        this.countersignForm.add_user_ids = []
        this.$refs.vueUserRoleTree.onClear();
        this.$message({
          showClose: true,
          message: '最多只能选择十五个加签审批人',
          type: 'warning'
        });
      }
    },
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
    color: #999;
  }
  span:nth-child(2n - 1) {
    color: #333333;
    font-size: 15px;
    // font-weight: bold;
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

<style lang='stylus' rel="stylesheet/stylus" scoped>
.textIcon {
  position: relative;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  .textIcon-center {
    width: 20px
    height: 20px
  }
  .textIcon-subscript {
    position: absolute;
    right: -5px;
    bottom: -5px;
    font-size: 12px;
    width: 15px;
    height: 15px;
  }
}
.approve-schedule /deep/ .el-step__icon {
  width: 35px
  height: 35px
}
.approve-schedule /deep/  .is-text {
  border: none
  border-radius: 4px
  background-color: #3399FE
}
/deep/.el-step.is-vertical {
  min-height: 100px
}
/deep/ .el-step.is-vertical .el-step__title {
  line-height: 16px
  padding-bottom: 5px
  font-size: 12px
  font-weight: normal
}
/deep/ .el-step__title.is-finish {
  color: #999999
}
/deep/ .el-step__title.is-process {
  color: #999;
}
/deep/.el-step.is-vertical .el-step__line {
  left: 18px
  top: 42px
  bottom: 2px
  background-color: #3399FE
}
/deep/.el-step.is-vertical .el-step__head{
  width: 35px
}
/deep/.el-alert--success.is-light {
  color: #666
  background-color: #f4f4f5
}
/deep/ .el-alert--success.is-light .el-alert__description{
  color: #666
}
/deep/ .el-step__title.is-wait{
  color: #999
}
.comment-title {
  color: #333333;
  font-size: 15px;
  // font-weight: bold;
}
.to-be-reviewed {
  /deep/ .el-step__line {
    background: none !important
    border-left: 2px dashed #C9CCD2
    i {
      border-width: 0 !important
    }
  }
  /deep/ .is-text {
    background-color: #C9CCD2 !important
  }
}
.connecting {
  /deep/ .el-step__line {
    background: none !important
    border-left: 2px dashed #C9CCD2
    i {
      border-width: 0 !important
    }
  }
}
.CcColor {
  /deep/ .el-step__line {
    background: #3399fe!important
    border: none
    i {
      border-width: 1 !important
    }
  }
  /deep/ .is-text {
    background-color: #3399fe!important
  }
}
.itemBox {
  .commonWords {
    .box {
      padding: 10px;  
      cursor: pointer;
      margin: 5px;
      word-break: keep-all;
      overflow: hidden;
      text-overflow: ellipsis;
      text-align: left;
      border-radius: 5px;
      background: #E8E7E7;
      color: #333333;
    }
  }
}
</style>
