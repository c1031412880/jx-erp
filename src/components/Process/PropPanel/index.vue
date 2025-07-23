
<template>
  <el-drawer
    size="550px"
    class="drawer"
    :visible.sync="visible"
    :show-close="false"
    style="text-align:left;"
    @close="cancel"
    v-if="properties"
    :append-to-body="true"
  >
    <!-- 标题 -->
    <header slot="title" class="header"  v-if="value && value.type=='start' && properties.title">{{properties.title}}</header>
    <header slot="title" class="header" v-else>
      <span @click="titleInputVisible = true" v-show="!titleInputVisible" style="cursor:pointer;">
        {{properties.title}}
        <i class="el-icon-edit"></i>
      </span>
      <el-input
        size="mini"
        v-model="properties.title"
        v-show="titleInputVisible"
        v-clickoutside="_ => titleInputVisible=false"
        style="z-index:9;max-width: 200px;"
      ></el-input>
      <el-select
        v-if="isConditionNode()"
        v-model="properties.priority"
        size="mini"
        class="priority-select" >
        <el-option v-for="item in priorityLength" :key="item" :value="item-1" :label="'优先级'+item"></el-option>
      </el-select>
    </header>

    <!-- 条件  -->
    <section class="condition-pane" v-if="value && isConditionNode()">
      <row-wrapper title="发起人" v-if="showingPCons.includes(-1)">
          <fc-org-select ref="condition-org" :tabList="['dep&user']" v-model="initiator" />
      </row-wrapper>

      <template v-for="(item, index) in pconditions">
        <!-- 计数 -->
        <row-wrapper
          :key="index"
          :title="item.label"
          v-if="couldShowIt(item,'el-input-number','fc-date-duration','fc-time-duration','fc-amount', 'fc-calculate')">
          <num-input
            :key="index"
            :title="timeTangeLabel(item)"
            v-model="item.conditionValue"
            style="padding-right: 6px;"
          ></num-input>
          <template v-slot:action>
            <i  class="el-icon-delete" style="cursor: pointer;" @click="onDelCondition(item)"></i>
          </template>
        </row-wrapper>
        <!-- 单选组 -->
        <row-wrapper
          :key="index"
          :title="item.label"
          v-if="couldShowIt(item,'el-radio-group')">
          <el-radio-group v-model="item.conditionValue" class="radio-group">
            <el-radio v-for="item in item.options" :label="item.label" :key="item.label">{{item.label}}</el-radio>
          </el-radio-group>
          <template v-slot:action>
            <i  class="el-icon-delete" style="cursor: pointer;" @click="onDelCondition(item)"></i>
          </template>
        </row-wrapper>

        <!-- 下拉 -->
        <row-wrapper
          :key="index"
          :title="item.label"
          v-if="couldShowIt(item,'el-select')">
          <el-select v-model="item.conditionValue" multiple placeholder="请选择" size="small">
            <el-option
              v-for="item in item.options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <template v-slot:action>
              <i  class="el-icon-delete" style="cursor: pointer;" @click="onDelCondition(item)"></i>
            </template>
        </row-wrapper>
        
        <!-- 数据字典 -->
        <row-wrapper
          :key="index"
          :title="item.label"
          v-if="couldShowIt(item,'select-dictionaries')">
          <!-- <el-select v-model="item.conditionValue" multiple placeholder="请选择" size="small">
            <el-option
              v-for="item in item.options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select> -->
          <get-select-dictionaries 
            v-model="item.conditionValue"
            :ref="'dictionaries' + index" 
            :classKey="item.key" 
            :placeholder="'请选择' + item.label"
            :isMultiple="true"
          ></get-select-dictionaries>

          <template v-slot:action>
              <i  class="el-icon-delete" style="cursor: pointer;" @click="onDelCondition(item)"></i>
            </template>
        </row-wrapper>

          <!-- 组织机构 -->
        <row-wrapper :key="index" :title="item.label" v-if="couldShowIt(item,'fc-org-select')">
          <fc-org-select
          v-model="item.conditionValue"
          :ref="'org' + index"
          :maxNum="item.maxNum"
          :tabList="item.tabList"
          />
          <template v-slot:action>
            <i  class="el-icon-delete" style="cursor: pointer;" @click="onDelCondition(item)"></i>
          </template>
        </row-wrapper>
      </template>
      <div style="padding-left:10px;margin-top:2em;">
        <el-button type="primary" size="small" icon="el-icon-plus" @click="dialogVisible=true">添加条件</el-button>
        <span style="color:#aaa;margin-left:16px;">还有{{notUseConNum}}个可用条件</span>
      </div>
    </section>

    <!-- 审批人 -->
    <section class="approver-pane" style="height:100%;" v-if="value && (isApproverNode() || isStartNode())">
      <el-tabs v-model="activeName"  class="pane-tab">
        <el-tab-pane :label="'设置' + (value.type === 'approver' ? '审批人' : '发起人')" name="config">
          <!-- 开始节点 -->
          <el-row style="padding: 10px;"  v-if="value.type === 'start'">
            <el-col :span="4" style="font-size: 12px;">发起人</el-col>
            <el-col :span="18" style="padding-left: 12px;">
              <fc-org-select ref="start-org" :tabList="['dep&user']" v-model="initiator" />
            </el-col>
          </el-row>

          <div v-else-if="value.type === 'approver'">
            <div style="padding: 12px;">
              <el-radio-group v-model="approverForm.assigneeType" style="line-height: 32px;" @change="resetOrgColl">
                <el-radio v-for="item in assigneeTypeOptions" :label="item.value" :key="item.value" class="radio-item">{{item.label}}</el-radio>
              </el-radio-group>
            </div>
            <div style="border-bottom: 1px solid #e5e5e5;padding-bottom: 1rem;">
              <div v-if="approverForm.assigneeType === 'myself'"  class="option-box" style="color: #a5a5a5;">
                <div style="padding:20px 0;color:#333;font-size:14px;font-weight:600;">发起人自己将作为审批人处理审批单</div>
                <el-radio :v-model="true" >自选审批人</el-radio>
              </div>
              <div v-else-if="approverForm.assigneeType === 'optional'"  class="option-box">
                <p>可选多人</p>
                <el-switch v-model="approverForm.optionalMultiUser" active-color="#13ce66"> </el-switch>
                <p>选择范围</p>
                <el-select v-model="approverForm.optionalRange" size="mini">
                  <el-option v-for="(item, index) in rangeOptions" :key="index" :label="item.label" :value="item.value"
                    :disabled="item.disabled"></el-option>
                </el-select>
              </div>
              <div v-else-if="approverForm.assigneeType === 'director'">
                <div style="font-size: 14px;padding-left: 1rem;">
                  <el-select v-model="approverForm.nodeType" size="small">
                    <el-option :value="1" :label="'发起人'"></el-option>
                    <el-option :value="2" :label="'经办人'"></el-option>
                  </el-select>
                  的
                  <el-select v-model="directorLevel" size="small">
                    <el-option v-for="item in 5" :key="item" :label="item === 1 ? '直接主管': `第${item}级主管`" :value="item"
                    ></el-option>
                  </el-select>
                  <br>
                  <el-checkbox v-model="useDirectorProxy" style="margin-top: 1rem;">找不到主管时，由上级主管代审批</el-checkbox>
                </div>
              </div>
              <div v-else-if="approverForm.assigneeType === 'chargeDirector'" style="padding:0 18px">
                <div style="font-size: 14px;padding-left: 1rem;">
                  <el-select v-model="approverForm.nodeType" size="small">
                    <el-option :value="1" :label="'发起人'"></el-option>
                    <el-option :value="2" :label="'经办人'"></el-option>
                  </el-select>
                  的分管领导
                </div>
                <div style="padding:20px 0;color:#333;font-size:14px;font-weight:600;">当前层级无分管领导时</div>
                <el-radio :v-model="true" >自选审批人</el-radio>
              </div>
              <div v-else-if="approverForm.assigneeType === 'relevance'" class="option-box">
                <span>关联字段：</span>
                <el-radio-group v-model="approverForm.form_field">
                  <el-radio v-for="item in AssociatedFieldObj[this.ObjectId]" :key="item.field_key" :label="item.field_key">{{item.field_name}}</el-radio>
                </el-radio-group>
              </div>
              <div v-else class="option-box">
                <fc-org-select
                ref="approver-org"
                buttonType="button"
                :maxNum="['role','position_job'].includes(approverForm.assigneeType) ? 1 : 99"
                v-model="orgCollection"
                :title="getAssignTypeLabel()"
                :tabList="fcOrgTabList.includes(approverForm.assigneeType) ? [approverForm.assigneeType] : ['dep']"
                @change="onOrgChange" />
              </div>
            </div>
            <div
              class="option-box"
              style="border-bottom: 1px solid #e5e5e5;padding-bottom:10px"
              v-if="orgCollection[approverForm.assigneeType]
              && (orgCollection[approverForm.assigneeType] ? orgCollection[approverForm.assigneeType].length > 1 : false)
              || (['role','optional','position_job'].includes(approverForm.assigneeType))">
              <p style="padding:10px 0">多人审批时采用的审批方式</p>
              <!-- <el-radio v-model="approverForm.counterSign" :label="true" class="radio-item">会签（须所有审批人同意）</el-radio>
              <br>
              <el-radio  v-model="approverForm.counterSign"  :label="false" class="radio-item">或签（一名审批人同意或拒绝即可）</el-radio> -->
              <el-select v-model="approverForm.counterSign" @change="changeSign" size="mini" style="width:250px">
                <el-option :value="true" label="会签（须所有审批人同意）"></el-option>
                <el-option :value="false" label="或签（一名审批人同意或拒绝即可）"></el-option>
              </el-select>
              <div v-if="approverForm.counterSign" style="padding-top:10px">
                <span>依次审批：</span>
                <el-radio v-model="approverForm.is_seq" :label="true" class="radio-item">是</el-radio>
                <el-radio v-model="approverForm.is_seq" :label="false" class="radio-item">否</el-radio>
              </div>
            </div>

            <div style="padding: 12px;" v-if="approverForm.assigneeType !== 'myself'">
              <el-checkbox v-model="approverForm.handled">设为经办人</el-checkbox>
              <p style="padding: 20px 0px;color: rgb(51, 51, 51);font-size: 14px;font-weight: 600;">
                设置为经办人后可在后续流程节点中设置其主管或分管领导</p>
              <br>
            </div>
          </div>

        </el-tab-pane>
        <el-tab-pane label="表单权限" name="formAuth" v-if="isApproverNode()">
          <div class="form-auth-table">
            <header class="auth-table-header">
              <div style="padding:0 12px;color:#e6a23c">注意：可编辑字段编辑后不影响流程。</div>
              <div class="row">
                <div class="label">表单字段</div>
                <el-radio-group v-model="globalFormOperate"  class="radio-group haeder-radio">
                  <el-radio :label="2" style="margin-left: 1rem;">可编辑</el-radio>
                  <el-radio :label="1">只读</el-radio>
                  <el-radio :label="3">隐藏</el-radio>
                </el-radio-group>
              </div>
            </header>
            <div class="auth-table-body">
              <div v-for="(item,index) in formPermissions" :key="item.fieid_id + index" class="row">
                <div class="label">
                  <!-- <span class="required" v-show="item.required">*</span> -->
                  {{item.label}}
                </div>
                <el-radio-group v-model="item.type" :key="item.fieid_id" class="radio-group">
                  <el-radio :label="2" style="margin-left: 1rem;"><span style="opacity: 0;">可编辑</span></el-radio>
                  <el-radio :label="1"><span style="opacity: 0;">只读</span></el-radio>
                  <el-radio :label="3"><span style="opacity: 0;">隐藏</span></el-radio>
                </el-radio-group>
              </div>
              <div v-if="formPermissions.length === 0" class="no-dada">
                {{"当前无字段可设置"}}
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="审批人是否可为空" name="canBeEmpty" v-if="isApproverNode()">
          <div style="padding:12px">
            <el-switch v-model="approverForm.optionalCanBeEmpty" active-color="#13ce66" active-text="可为空" inactive-text="不可为空"> </el-switch>
          </div>
        </el-tab-pane>
      </el-tabs>
    </section>

    <section  v-if="value && isCopyNode()" style="padding-left: 1rem;">
      <p>抄送人</p>
      <fc-org-select ref="copy-org" :tabList="['user']" v-model="properties.menbers" buttonType="button" title="抄送人" />
      <br>
      <el-checkbox v-model="properties.userOptional">允许发起人自选抄送人</el-checkbox>
    </section>

    <el-dialog title="选择条件" :visible.sync="dialogVisible" width="500px" :append-to-body="true" custom-class="condition-dialog">
      <el-checkbox-group v-model="showingPCons">
        <!-- 发起人默认就有 -->
        <el-checkbox :label="-1">发起人</el-checkbox>
        <el-checkbox v-for="(item,index) in pconditions" :key="index" :label="item.formId">
         {{item.label}}
        </el-checkbox>
      </el-checkbox-group>
    </el-dialog>

    <div class="actions">
      <el-button size="small" @click="cancel">取消</el-button>
      <el-button size="small" type="primary" @click="confirm">确定</el-button>
    </div>
  </el-drawer>
</template>
<script>
import AssociatedFieldObj from './AssociatedFieldObj.js'
import Clickoutside from "element-ui/src/utils/clickoutside"
import { NodeUtils } from "../FlowCard/util.js"
import RowWrapper from './RowWrapper'
import NumInput from "./NumInput"
import getSelectDictionaries from "@/components/base/formModel/select/get-select-dictionaries/list";
const rangeType = {
  'lt': '<',
  'lte':'≤',
  'gt':'>',
  'gte':'≥',
  'eq': '=',
}
const defaultApproverForm = {
  approvers:[], // 审批人集合
  assigneeType: "user", // 指定审批人
  formOperates:[], // 表单操作权限集合
  formPermissions:[], // 表单操作权限集合
  counterSign: true, //是否为会签
  is_seq:true,  //会签时  是否依次审批
  // 审批类型为自选 出现 optionalMultiUser optionalRange
  optionalMultiUser: false,
  // 审批人是否可为空
  optionalCanBeEmpty: false,
  optionalRange: 'ALL', // USER<最多十个> / ALL / ROLE
  handled: false,      // 是否设置为经办人
  nodeType: 1,
  form_field: '',
}
export default {
  props: [/*当前节点数据*/"value", /*整个节点数据*/"processData", /*审批单key值*/"ObjectId"],
  data() {
    return {
      fcOrgTabList:['dep', 'role', 'user', 'position', 'position_job'],
      visible: false,  // 控制面板显隐
      globalFormOperate: null,  // 统一设置节点表单权限
      titleInputVisible: false, // 是否显示标题输入框  startNode 不显示
      activeName: "config", // or formAuth  Tab面板key
      showingPCons: [], // 用户选择了得条件  被选中的才会被展示在面板上编辑
      pconditions: [], // 从vuex中获取的可以作为流程图条件的集合
      dialogVisible: false, // 控制流程条件选项Dialog显隐
      // 当前节点数据
      properties: {},
      // 发起人  start节点和condition节点需要
      initiator:{
        'dep&user': []
      },
      priorityLength: 0, // 当为条件节点时  显示节点优先级选项的数据
      orgCollection:{
        dep: [],
        role: [],
        user: [],
        position: []
      },
      useDirectorProxy: true, // 找不到主管时 上级主管代理审批
      directorLevel: 1,  // 审批主管级别
      startForm:{
        formPermissions: []
      },
      approverForm: JSON.parse(JSON.stringify(defaultApproverForm)),
      optionalOptions: [
        {
          label: '自选一个人',
          value: false
        }, {
          label: '自选多个人',
          value: true
        }],
        rangeOptions: [
          {
          label: '全公司',
          value: 'ALL'
        }, {
          label: '指定成员',
          value: 'USER'
        }, {
          label: '角色',
          value: 'ROLE'
      }],

      assigneeTypeOptions:[
        {
          label:'指定成员',
          value: 'user'
        },
        {
          label:'主管',
          value: 'director'
        },
        {
          label:'角色',
          value: 'role'
        },
        {
          label:'职务',
          value: 'position_job'
        },
        // {
        //   label:'岗位',
        //   value: 'position'
        // },
        {
          label:'发起人自己',
          value: 'myself'
        },
        {
          label:'发起人自选',
          value: 'optional'
        },
        {
          label:'分管领导',
          value: 'chargeDirector'
        },
        {
          label:'自选或关联人员',
          value: 'relevance'
        }
      ],
      formPermissions:[],
      isfind: false,
      AssociatedFieldObj: AssociatedFieldObj,
    };
  },
  computed: {
    // 未使用的条件个数
    notUseConNum() {
      // 发起人是默认就有得  所以需要加 1
      return this.pconditions.length - this.showingPCons.length + 1;
    },
    usedFormItems(){
      return this.$store.state.formItemList
    },
  },
  directives: {
    Clickoutside
  },
  methods: {
    changeSign(val){
      if (val) {
        this.approverForm.is_seq = true
      } else {
        this.approverForm.is_seq = false
      }
    },
    getFormOperates(){
      let res = []
      this.isApproverNode() && (res = this.approverForm.formPermissions)
      this.isStartNode() && (res = this.startForm.formPermissions)
      this.formPermissions = res
      // return res
    },
    resetOrgColl(){
      for(let key in this.orgCollection){
        this.$set(this.orgCollection, key, [])
      }
    },
    onOrgChange(data){
      // console.log(data)
    },
    timeTangeLabel(item){
      const index = ['fc-time-duration','fc-date-duration'].findIndex(t => t === item.tag)
      if(index > -1){
        return '时长' + ['(小时)','(天)'][index]
      }else{
        return item.label
      }
    },
    getAssignTypeLabel(){
      const res = this.assigneeTypeOptions.find(t => t.value === this.approverForm.assigneeType)
      return res ? res.label : ''
    },
    changeAllFormOperate(val){
      const target = this.isStartNode() ? this.startForm : this.approverForm
      target.formPermissions.forEach(t => t.type = val)
    },
    // 是否可以显示当前条件组件
    couldShowIt(item, ...tag) {
      return tag.includes(item.tag)  && this.showingPCons.includes(item.formId);
    },

    initFormOperates(target){
      console.log('数据组装',JSON.parse(JSON.stringify(target)));
      const formPermissions = target.properties && target.properties.formPermissions || []
      console.log(formPermissions)
      // 自定义组件不加入权限控制
      const res = []
      const defaultType = this.isApproverNode() ? 1 : 2 // 操作权限 0 隐藏 1 只读 2 可编辑
      const getPermissionById = id => {
        const permission = formPermissions.find(t => t.fieid_id === id)
        return permission !== undefined ? permission.type : defaultType
      }
      const format = (list, parentName = '') => list.map(t => {
        const data = {
            fieid_id: t.fieid_id,
            // required: t.required,
            label: parentName ? [parentName, t.label].join('.') : t.label,
            type: getPermissionById(t.fieid_id)
        }
        res.push(data)
        Array.isArray(t.children) && format(t.children, t.label)
      })
      // const formItems = getDrawingList().filter(t => t.cmpType == 'custom')
      let formItems = this.$store.state.formItemList
      format(formItems)
      return res
    },

    initCopyNode () {
      this.properties = this.value.properties
    },

    initStartNodeData(){
      this.initInitiator()
      this.startForm.formPermissions = this.initFormOperates(this.value)
    },

    copyNodeConfirm () {
      this.$emit("confirm", this.properties, this.getOrgSelectLabel('copy') || '发起人自选');
      this.visible = false;
    },

    /**
     * 条件节点确认保存得回调
     */
    conditionNodeComfirm() {
      let nodeContent = ''
      const conditions = []
      this.showingPCons
      .map(fid => this.pconditions.find(t => t.formId === fid))
      .forEach((t)=> {
        if(!t) return // 发起人条件时 t 为空 发起人在其他地方获取
        const cValue = t.conditionValue
        if(cValue === undefined || cValue === null){
          return
        }
        const numberTypeCmp = ['el-input-number','fc-date-duration','fc-time-duration','fc-amount', 'fc-calculate']
        console.log('t.tag',t.tag, 't', t);
        if(numberTypeCmp.includes(t.tag)){
          if(cValue.type === 'bet'){
            const numVal = cValue.value
            nodeContent += `[${numVal[0]} ${rangeType[numVal[1]]} ${t.label} ${rangeType[numVal[2]]} ${numVal[3]}] ` + '\n'
          }else{
            nodeContent +=  `[${t.label} ${rangeType[cValue.type]} ${cValue.value}] ` + '\n'
          }
        }else if(t.tag === 'fc-org-select'){
          const index = this.pconditions.findIndex(p => p.formId === t.formId)
          const labels = this.$refs['org' + index][0].selectedLabels
          nodeContent += `[${t.label} = ${labels}] ` + '\n'
        } else if(t.tag === 'select-dictionaries') {
          const index = this.pconditions.findIndex(p => p.formId === t.formId)
          // let option = this.pconditions[index].options
          let label = this.$refs['dictionaries' + index][0].selectedLabels(this.pconditions[index].conditionValue)
          // let label = []
          let labelName = ""
          // option.forEach(item => {
          //   this.pconditions[index].conditionValue.forEach(ele =>{
          //     if (item.value === ele) {
          //       label.push(item.label)
          //     }
          //   })
          // })
          if (label.length > 1) {
            labelName = label.join("或")
          }else {
            labelName = label[0]
          }
          if (this.pconditions[index].conditionValue.length == 0) {
            labelName = ""
          }
          // option.forEach(item => {
          //   if (item.value === this.pconditions[index].conditionValue) {
          //     label = item.label
          //   }
          // })
          nodeContent +=  `[${t.label} = ${labelName}] ` + '\n'
        } else if(t.tag === 'el-select'){
          const index = this.pconditions.findIndex(p => p.formId === t.formId)
          let option = this.pconditions[index].options
          let label = []
          let labelName = ""
          option.forEach(item => {
            this.pconditions[index].conditionValue.forEach(ele =>{
              if (item.value === ele) {
                label.push(item.label)
              }
            })
          })
          if (label.length > 1) {
            labelName = label.join("或")
          }else {
            labelName = label[0]
          }
          if (this.pconditions[index].conditionValue.length == 0) {
            labelName = ""
          }
          nodeContent +=  `[${t.label} = ${labelName}] ` + '\n'
        }else{
          nodeContent +=  `[${t.label} = ${cValue}] ` + '\n'
        }
        const res = { 
          formId: t.formId, 
          model: t.model, 
          field: t.field, 
          conditionValue: cValue 
        }
        conditions.push(res)
      }, [])
      this.properties.conditions = conditions
      // 发起人虽然是条件 但是这里把发起人放到外部单独判断
      this.properties.initiator = this.initiator['dep&user']
      this.showingPCons.includes(-1) && this.initiator['dep&user'] && (nodeContent = `[发起人: ${this.getOrgSelectLabel('condition')}]` + '\n' + nodeContent)
      this.$emit("confirm", this.properties, nodeContent || '请设置条件');
      this.visible = false;
    },

    getOrgSelectLabel (type) {
      return this.$refs[type + '-org']['selectedLabels']
    },
    /**
     * 开始节点确认保存
     */
    startNodeComfirm() {
      this.properties.initiator = this.initiator['dep&user']
      const formPermissions = this.startForm.formPermissions.map(t=>({fieid_id: t.fieid_id, type: t.type}))
      Object.assign(this.properties, {formPermissions})
      this.$emit("confirm", this.properties, this.getOrgSelectLabel('start') || '所有人');
      this.visible = false;
    },
    /**
     * 审批节点确认保存
     */
    approverNodeComfirm() {
      const assigneeType = this.approverForm.assigneeType
      let content = ''
      if (['optional','myself','chargeDirector','relevance'].includes(assigneeType)) {
        content = this.assigneeTypeOptions.find(t => t.value === assigneeType).label
      } else if('director' === assigneeType){
        content = this.directorLevel === 1 ? '直接主管' : `第${this.directorLevel}级主管`
      } else{
        content = this.getOrgSelectLabel('approver')
      }

      if (this.approverForm.handled) {
        this.properties.title = `${this.properties.title}(${'经办人'})`
      }
      if (this.approverForm.assigneeType === 'director' || this.approverForm.assigneeType === 'chargeDirector') {
        if (this.approverForm.nodeType == 2) {
          content = `经办人的${content}`
        } else {
          content = `发起人的${content}`
        }
      }
      const formPermissions = this.approverForm.formPermissions.map(t=>({fieid_id: t.fieid_id, type: t.type}))
      this.approverForm.approvers = this.orgCollection[assigneeType]
      Object.assign(this.properties, this.approverForm, {formPermissions})
      this.$emit("confirm", this.properties, content || '请设置审批人')
      this.visible = false
    },
    // 确认修改
    confirm() {
      this.isCopyNode() && this.copyNodeConfirm()
      this.isStartNode() && this.startNodeComfirm()
      this.isApproverNode() && this.approverNodeComfirm()
      this.isConditionNode() && this.conditionNodeComfirm()
    },
    // 关闭抽屉
    cancel() {
      setTimeout(()=>{
        this.$emit("cancel");
        this.visible = false;
      }, 0)
    },
    /**
     * 删除流程条件
     */
    onDelCondition(condition){
      const index = this.showingPCons.findIndex(id => id === condition.fieid_id)
      if(index > -1){
        this.showingPCons.splice(index, 1)
        this.pconditions.find(t => t.fieid_id === condition.fieid_id).conditionValue = undefined
      }
    },
    // 配合getPriorityLength 获取前一个节点条件数组长度 用于设置优先级
    getPrevData() {
      return NodeUtils.getPreviousNode(this.value.prevId, this.processData);
    },
    // 用于获取节点优先级范围
    getPriorityLength() {
      this.priorityLength = this.getPrevData().conditionNodes.length;
    },
    // 判断是否是条件节点
    isConditionNode() {
      return this.value ? NodeUtils.isConditionNode(this.value) : false;
    },
    /** 判断是否是审批节点*/
    isApproverNode(){
      return this.value ? NodeUtils.isApproverNode(this.value) : false;
    },

    isStartNode(){
      return this.value ? NodeUtils.isStartNode(this.value) : false;
    },

    isCopyNode () {
      // console.log(NodeUtils,NodeUtils.getPreviousNode)
      return this.value ? NodeUtils.isCopyNode(this.value) : false
    },

    initInitiator(){
      const initiator = this.value.properties && this.value.properties.initiator
      this.initiator['dep&user'] = Array.isArray(initiator) ? initiator : []
    },
    /**
     * 初始化审批节点所需数据
     */
    initApproverNodeData() {
      // const drawingListInDB = getDrawingList()
      // let formOperates = []
      // drawingListInDB.forEach(item => {
      //   let formItem = {}
      //   formItem.fieid_id = item.fieid_id
      //   formItem.type = 2
      //   formOperates.push(formItem)
      // });
      for (const key in this.approverForm) {
        if (this.value.properties.hasOwnProperty(key)) {
          this.approverForm[key] = this.value.properties[key];
        }
      }
      const approvers = this.approverForm.approvers
      this.resetOrgColl()
      if (Array.isArray(this.approverForm.approvers)) {
        this.orgCollection[this.approverForm.assigneeType] = approvers
      }
      // this.value.properties.formOperates = formOperates
      // this.$store.commit('updateFormItemList', drawingListInDB)
      this.approverForm.formPermissions = this.initFormOperates(this.value)
      console.log('审批人节点',JSON.parse(JSON.stringify(this.approverForm)));
    },
    /**
     * 初始化条件节点数据
     */
    initConditionNodeData(){
      // 初始化条件表单数据
      let nodeConditions = this.value.properties && this.value.properties.conditions
      this.pconditions = JSON.parse(JSON.stringify(this.$store.state.processConditions));
      this.initiator['dep&user'] = this.value.properties.initiator
      if(Array.isArray(this.pconditions)){
        let temp = undefined
        this.showingPCons = [-1] // 默认显示发起人
        this.pconditions.forEach(t => {
          if(Array.isArray(nodeConditions)){
            const con = nodeConditions.find(item => item.formId == t.formId)
            // 判断是否为el-select
            const isSelect = nodeConditions.find(item => item.formId == t.formId)
            con && con.conditionValue && (temp = con.conditionValue, this.showingPCons.push(t.formId))
          }
          if (t.tag === "el-select" || t.tag === 'select-dictionaries') {
            if (!temp  || temp.length == 0) {
              temp = ""
            } else {
              temp = temp.toString().split(',')
              if ([100121,100122,100123].indexOf(t.formId) == -1) {
                for (let index = 0; index < temp.length; index++) {
                  temp[index] = Number(temp[index])
                }
              }
              
            }
          }
          this.$set(t, 'conditionValue', temp)
        })
      }
    },
  },
  watch: {
    visible(val) {
      console.log('this.processData',this.processData)
      if (!val) {
        this.approverForm = JSON.parse(JSON.stringify(defaultApproverForm)) // 重置数据为默认状态
        return
      }
      this.processData.properties.formPermissions =
        this.initFormOperates(this.processData)
        .map(t=>({fieid_id: t.fieid_id, type: t.type}))
      this.isStartNode() && this.initStartNodeData()
      this.isApproverNode() && this.initApproverNodeData()
      this.isConditionNode() && this.initConditionNodeData()
      this.getFormOperates()
    },

    value(newVal) {
      if (newVal && newVal.properties) {
        this.visible = true;
        this.properties = JSON.parse(JSON.stringify(newVal.properties));
        if (this.properties) {
          NodeUtils.isConditionNode(newVal) && this.getPriorityLength();
        }
      }
    }
  },
  components: {
    "num-input": NumInput,
    "row-wrapper": RowWrapper,
    getSelectDictionaries
  }
};
</script>
<style lang="stylus">
.condition-dialog {
  .el-dialog__header{
    border-bottom : 1px solid #eee;
  }
}

</style>
<style lang="stylus" scoped>
.drawer {
  >>> .el-drawer__header {
    margin-bottom: 0;
    border-bottom: 1px solid #c5c5c5;
    padding-bottom: 8px;
  }

  >>> .el-drawer__body {
    padding-bottom: 44px;
    overflow: hidden;
  }

  .pane-tab{
    height: 100%;
  }

  .pane-tab >>>  .el-tabs__item.is-top:nth-child(2) {
    padding-left: 20px;
  }

  >>> .el-tabs__item:focus{
    box-shadow: none !important;
  }

  >>> .el-tabs__header {
    margin-bottom: 0;
  }
}

.header {
  line-height: 28px;
}

.actions {
  position: absolute;
  bottom: 0;
  left: 0;
  padding: 6px 12px;
  width: 100%;
  box-sizing: border-box;
  text-align: right;
}

.radio-item {
  width: 110px;
  padding: 6px;
}

.priority-select {
  width: 118px;
  position: absolute;
  right: 26px;
}

.form-auth-table{
  font-size: 14px;
  .auth-table-header{
    background: #fafafa
    line-height: 40px;
  }
  .row{
    display: flex;
    align-items: center;
    line-height: 32px;
    padding: 8px 12px;
    border-bottom: 1px solid #efefef;
    &:hover{
      background: #f5f7fa;
    }
    .label{
      flex:1;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;

      .required{
        color: #f2725e;
      }
    }
    .radio-group{
      flex: 2;
      display: flex;
      justify-content: space-between;
    }
    .haeder-radio {
      /deep/ .el-radio__input {
        display: none;
      }
    }
  }
  .no-dada {
    text-align: center;
    color: #999;
    padding-top: 15px;
  }
}

.approver-pane{
  overflow-y: scroll;
  overflow-x: hidden;
  .option-box {
    font-size 14px
    padding-left 1rem
  }
}

.condition-pane{
  height 100%
  overflow scroll
}
</style>
