<template>
  <el-dialog
    :visible="dialogBool"
    :title="title"
    :before-close="dialogClose"
    width="950px"
    
  >
    <div class="el-dialog-div">
      <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
        <el-tab-pane label="客户信息" name="first">
          <el-form :model="form" :rules="basicRules" ref="form" label-width="100px" size="mini">
            <el-card class="box-card" shadow="hover" style="margin-bottom: 10px;">
              <div slot="header" class="clearfix">
                <span>基本信息</span>
                <!-- <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button> -->
              </div>
              <div class="show-flex-box-r">
                <el-form-item label="客户名称:" prop="name">
                  <el-input v-model="form.name" placeholder="请输入客户名称" :disabled="curSelecedType == 'detail'"></el-input>
                </el-form-item>
                <el-form-item label="企业类型:" prop="firm_id">
                  <tr-select-dictionaries v-model="form.firm_id" :classKey="'企业类型'" :placeholder="'企业类型'" :disabled="curSelecedType == 'detail'"></tr-select-dictionaries>
                </el-form-item>
                <el-form-item label="客户标签:" prop="tag_id">
                  <tr-select-dictionaries v-model="form.tag_id" :classKey="'客户标签'" :placeholder="'客户标签'" :disabled="curSelecedType == 'detail'"></tr-select-dictionaries>
                </el-form-item>
              </div>
              <div class="show-flex-box-r">
                <el-form-item label="对接人:" prop="duty_id">
                  <get-department-select
                    ref="personalTree"
                    v-model="form.duty_id"
                    :isShowCheckbox="false"
                    :placeholder="'请选择对接人'"
                    :isContainEmp="true"
                    :show_all="true"
                    :isExportMultiple="false"
                    :disabled="curSelecedType == 'detail'"
                  ></get-department-select>
                </el-form-item>
                <el-form-item label="客户意向:" prop="target">
                  <tr-select-dictionaries v-model="form.target" :classKey="'客户意向'" :placeholder="'客户意向'" :disabled="curSelecedType == 'detail'"></tr-select-dictionaries>
                </el-form-item>
                <el-form-item label="客户来源:" prop="source">
                  <tr-select-dictionaries v-model="form.source" :classKey="'客户来源'" :placeholder="'客户来源'" :disabled="curSelecedType == 'detail'"></tr-select-dictionaries>
                </el-form-item>
              </div>
              <div>
                <el-form-item label="备注:" prop="remark">
                  <el-input
                    v-model="form.remark" 
                    type="textarea"
                    maxlength="100"
                    :rows="4"
                    show-word-limit
                    placeholder="请输入备注"
                    :disabled="curSelecedType == 'detail'"></el-input>
                </el-form-item>
              </div>
            </el-card>
            <el-card class="box-card" shadow="hover" style="margin-bottom: 10px;">
              <div slot="header" class="clearfix">
                <span>主要联系人</span>
                <!-- <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button> -->
              </div>
              <div class="show-flex-box-r">
                <el-form-item label="联系人姓名:" prop="contacts_name">
                  <el-input v-model="form.contacts_name" placeholder="请输入联系人姓名" :disabled="curSelecedType == 'detail'"></el-input>
                </el-form-item>
                <el-form-item label="性别:" prop="sex">
                  <el-select v-model="form.sex" placeholder="请选择性别" :disabled="curSelecedType == 'detail'">
                    <el-option label="男" :value="1"></el-option>
                    <el-option label="女" :value="2"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="部门:" prop="department">
                  <el-input v-model="form.department" placeholder="请输入联系人部门" :disabled="curSelecedType == 'detail'"></el-input>
                </el-form-item>
              </div>
              <div class="show-flex-box-r">
                <el-form-item label="职务:" prop="job">
                  <el-input v-model="form.job" placeholder="请输入联系人职务" :disabled="curSelecedType == 'detail'"></el-input>
                </el-form-item>
                <el-form-item label="电话号码:" prop="phone">
                  <el-input v-model="form.phone" placeholder="请输入联系人电话" oninput="value=value.replace(/[^\d.-]/g,'')"  @blur="form.phone = $event.target.value" :disabled="curSelecedType == 'detail'"></el-input>
                </el-form-item>
                <el-form-item label="QQ/微信:" prop="social">
                  <el-input v-model="form.social" placeholder="请输入联系人QQ/微信" :disabled="curSelecedType == 'detail'"></el-input>
                </el-form-item>
              </div>
            </el-card>
            
            <el-card class="box-card" shadow="hover" style="margin-bottom: 10px;">
              <div slot="header" class="clearfix">
                <span>其它联系人</span>
                <!-- <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button> -->
              </div>
              <div class="show-flex-box-c">
                <div style="margin-bottom: 5px;">
                  <el-button class="el-icon-plus" @click="addContacts()" type="primary" size="mini" v-if="curSelecedType != 'detail'">添加联系人</el-button
              >
                </div> 
                <tr-table
                  :selectionShow="false"
                  :data="form.persons"
                  :tableHeaderList="canRendererTableHeader"
                  :isShowBottomOptions="false"
                  :TableHeight="TableHeight"
                  :loading="false"
                  :frontFixedNum="1"
                  :backFixedNum="1"
                  :isFixedEmptyPlaceholder="false"
                >
                  <template slot-scope="scope" slot="sex">
                    <span>{{scope.data.sex === 1? '男':scope.data.sex === 2?'女':''}}</span>
                  </template>
                  <template slot-scope="scope" slot="operation">
                      <el-button type="primary" size="mini" @click="editRowInfo(scope.data,scope.index)" :disabled="curSelecedType == 'detail'">编辑</el-button>
                      <el-popconfirm
                        @confirm="deleteRowInfo(scope.data, scope.index)"
                        title="确定删除此条记录吗？">
                        <el-button slot="reference" type="danger" size="mini" :disabled="curSelecedType == 'detail'">删除</el-button>
                      </el-popconfirm>
                  </template>
                </tr-table>
              </div>

            </el-card>
            <el-card class="box-card" shadow="hover">
              <div slot="header" class="clearfix">
                <span>附件</span>
                <!-- <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button> -->
              </div>
              <div class="show-flex-box-r">
                <el-form-item label="上传附件:" prop="files">
                  <div>
                    <el-upload
                      class="upload-demo"
                      ref="uploadDocomnet"
                      action="string"
                      :on-change="handlePreview"
                      :on-remove="handleRemove"
                      accept=".jpg,.jpeg,.png,.rar,.zip,.doc,.docx,.pdf,.xls,.xlsx,"
                      :auto-upload="false">
                      <el-button slot="trigger" size="small" type="primary" class="el-icon-upload" :disabled="curSelecedType == 'detail'">上传文件</el-button>
                      <div slot="tip" class="el-upload__tip">支持格式：.jpg,.jpeg,.png,.rar,.zip,.doc,.docx,.pdf,.xls,.xlsx,单个文件不能超过10MB，最多只能保存5个文件</div>
                    </el-upload>
                    <ul class="document-content show-flex-box-c" v-loading="uploadDocumentLoading">
                      <li class="show-flex-box-r" style="margin-bottom:10px;" v-for="(item,index) in form.files" :key="index">
                        <span class="show-flex-box-r" style="align-items: center;">
                          <i class="el-icon-document-remove" style="margin-right:6px; font-size: 16px"></i>
                          <span>{{item.name}}</span> 
                        </span>
                        <strong class="show-flex-box-r">
                          <el-button type="text" @click="downloadDocument(item)">下载</el-button
                          >
                          <el-button type="text" :disabled="curSelecedType == 'detail'" @click="deleteDocument(item,index)">删除</el-button>
                        
                        </strong>
                      </li>
                    </ul>
                  </div>
                </el-form-item>
              </div>
            </el-card>
            
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="合同记录" name="second" v-if="curSelecedType == 'detail'">
          <el-card class="box-card" shadow="hover" style="margin-bottom: 10px;">
              <div slot="header" class="clearfix">
                <span>合同信息</span>
                <!-- <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button> -->
              </div> 
              <div>
                <el-descriptions title="" size="mini">
                    <el-descriptions-item label="合同编号">{{curContractsInfo.code}}</el-descriptions-item>
                    <el-descriptions-item label="合同名称">{{curContractsInfo.name}}</el-descriptions-item>
                    <el-descriptions-item label="开始日期">{{curContractsInfo.start_date}}</el-descriptions-item>

                    <el-descriptions-item label="结束日期">{{curContractsInfo.end_date}}</el-descriptions-item>
                    <el-descriptions-item label="客户名称">{{curContractsInfo.customer_name}}</el-descriptions-item>
                    <el-descriptions-item label="联系人">{{curContractsInfo.customer_person}}</el-descriptions-item>
                    <el-descriptions-item label="联系电话">{{curContractsInfo.customer_phone}}</el-descriptions-item>
                    <el-descriptions-item label="合同金额">{{curContractsInfo.fee}}</el-descriptions-item>
                    <el-descriptions-item label="收款方式">{{curContractsInfo.way_name}}</el-descriptions-item>
                    <el-descriptions-item label="合同状态">{{curContractsInfo.state_name}}</el-descriptions-item>
                    <el-descriptions-item label="合同类型">{{curContractsInfo.type_name}}</el-descriptions-item>
                    <el-descriptions-item label="每年缴费日期">{{curContractsInfo.timer_date}}</el-descriptions-item>
                    <el-descriptions-item label="合同金额年递增率">{{`${(!!curContractsInfo.rise_rate || curContractsInfo.rise_rate == 0)? `${curContractsInfo.rise_rate}%` :''}`}}</el-descriptions-item>
                    <el-descriptions-item label="备注">{{curContractsInfo.remark}}</el-descriptions-item>
                    
                    <el-descriptions-item label="附件">
                      <ul class="document-content show-flex-box-c" v-if="curContractsInfo.files && curContractsInfo.files.length > 0">
                        <li class="show-flex-box-r" style="margin-bottom:10px;" v-for="(item,index) in curContractsInfo.files" :key="index">
                          <span class="show-flex-box-r" style="align-items: center;">
                            <i class="el-icon-document-remove" style="margin-right:6px; font-size: 16px"></i>
                            <span>{{item.name}}</span> 
                          </span>
                          <strong class="show-flex-box-r">
                            <el-button type="text" @click="downloadDocument(item)">下载</el-button
                            >
                          </strong>
                        </li>
                      </ul>
                      <div v-else>
                        <span style="font-size: 12px;">暂无附件</span>
                      </div>
                    </el-descriptions-item>
                </el-descriptions>
                <el-card class="box-card" shadow="hover" style="margin-bottom: 10px;">
                  
                  <div slot="header" class="clearfix">
                    <span style="font-weight: 700;font-size: 14px;color: #606266;margin-bottom: 10px;">合同缴费记录：</span>
                    </div>
                    <tr-table
                      :selectionShow="false"
                      :data="contractPaymentData"
                      :tableHeaderList="contractPaymentTableHeader"
                      :isShowBottomOptions="false"
                      :TableHeight="200"
                      :loading="false"
                      :frontFixedNum="1"
                      :backFixedNum="0"
                    >
                      <template slot-scope="scope" slot="finish">
                        <span v-if="!!scope.data.finish">{{scope.data.finish === 1?'是':'否'}}</span>
                      </template>
                    </tr-table>
                </el-card>
              </div>
          </el-card>
          <el-card class="box-card" shadow="hover" style="margin-bottom: 10px;">
            <div slot="header" class="clearfix">
              <span>合同记录</span>
              <!-- <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button> -->
            </div>
            <div>
              <tr-table
                ref="trTable"
                :selectionShow="false"
                :data="contractsList"
                :tableHeaderList="canSecondRendererTableHeader"
                :isShowBottomOptions="false"
                :TableHeight="TableHeight"
                :loading="false"
                :frontFixedNum="1"
                :backFixedNum="1"
              >
              <template slot-scope="scope" slot="rise_rate">
                <span v-if="!!scope.data.rise_rate || scope.data.rise_rate == 0">{{scope.data.rise_rate}}%</span>
              </template>
                <template slot-scope="scope" slot="operation">
                    <el-button type="primary" size="mini" @click="checkContractsInfo(scope.data)">查看</el-button>
                </template>
              </tr-table>
            </div>
          </el-card>
        </el-tab-pane>
      </el-tabs>
    </div>

    <div class="dialog-box">
      <add-contacts-dialog
        ref="addContactsDialog"
        :dialogBool.sync="isAddContactsDialogShow"
        :curType="curType"
        @save-add-edit-contacts="saveAddEditContacts"
      ></add-contacts-dialog>
    </div>

    <span slot="footer" class="dialog-footer" v-if="curSelecedType != 'detail'">
      <el-button @click="dialogClose">取 消</el-button>
      <el-button type="primary" @click="updatePlaybill('form')">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import getDepartmentSelect from "@/components/base/formModel/tree/get-department-select-tree";
import addContactsDialog from "./add-contacts-dialog.vue";
export default {
  components: {
    getDepartmentSelect,
    addContactsDialog
  },
  props: {
    dialogBool: Boolean,
    title: {
      type: String,
      default: "编辑",
    },
    curSelecedType: [String],
  },
  mounted() {
  },
  data() {
    return {
      activeName: 'first',
      TableHeight:200,
      canRendererTableHeader:[
        {
          id: 1,
          label: "姓名",
          prop: "name",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: false,
        },
        {
          id: 2,
          label: "电话号码",
          prop: "phone",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: false,
        },
        {
          id: 3,
          label: "性别",
          prop: "sex",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: false,
        },
        {
          id: 4,
          label: "部门",
          prop: "department",
          width: "130",
          align: "center",
          signIndex: 3,
          sortable: false,
        },
        {
          id: 5,
          label: "职务",
          prop: "job",
          width: "130",
          align: "center",
          signIndex: 4,
          sortable: false,
        },
        {
          id: 6,
          label: "QQ/微信",
          prop: "social",
          width: "130",
          align: "center",
          signIndex: 5,
          sortable: false,
        },
        {
          id: 7,
          label: "操作",
          prop: "operation",
          width: "140",
          align: "center",
          signIndex: 6,
          sortable: false,
        }
      ],
      canSecondRendererTableHeader:[
        {
          id: 1,
          label: "合同编号",
          prop: "code",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: false,
        },
        {
          id: 2,
          label: "合同名称",
          prop: "name",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: false,
        },
        {
          id: 3,
          label: "开始日期",
          prop: "start_date",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: false,
        },
        {
          id: 4,
          label: "结束日期",
          prop: "end_date",
          width: "130",
          align: "center",
          signIndex: 3,
          sortable: false,
        },

        {
          id: 5,
          label: "客户名称",
          prop: "customer_name",
          width: "130",
          align: "center",
          signIndex: 4,
          sortable: false,
        },
        {
          id: 6,
          label: "联系人",
          prop: "customer_person",
          width: "130",
          align: "center",
          signIndex: 5,
          sortable: false,
        },
        {
          id: 7,
          label: "联系电话",
          prop: "customer_phone",
          width: "130",
          align: "center",
          signIndex: 6,
          sortable: false,
        },
        {
          id: 8,
          label: "合同金额",
          prop: "fee",
          width: "130",
          align: "center",
          signIndex: 7,
          sortable: false,
        },
        {
          id: 9,
          label: "每年缴费日期",
          prop: "timer_date",
          width: "130",
          align: "center",
          signIndex: 8,
          sortable: false,
        },
        {
          id: 10,
          label: "合同金额年递增率",
          prop: "rise_rate",
          width: "160",
          align: "center",
          signIndex: 9,
          sortable: false,
        },


        // {
        //   id: 5,
        //   label: "合同金额",
        //   prop: "fee",
        //   width: "130",
        //   align: "center",
        //   signIndex: 4,
        //   sortable: false,
        // },
        {
          id: 11,
          label: "收款方式",
          prop: "way_name",
          width: "130",
          align: "center",
          signIndex: 10,
          sortable: false,
        },
        {
          id: 12,
          label: "合同状态",
          prop: "state_name",
          width: "130",
          align: "center",
          signIndex: 11,
          sortable: false,
        },
        {
          id: 13,
          label: "合同类型",
          prop: "type_name",
          width: "130",
          align: "center",
          signIndex: 12,
          sortable: false,
        },

        {
          id: 14,
          label: "创建人",
          prop: "created_name",
          width: "130",
          align: "center",
          signIndex: 13,
          sortable: false,
        },
        {
          id: 15,
          label: "创建时间",
          prop: "created_date",
          width: "130",
          align: "center",
          signIndex: 14,
          sortable: false,
        },

        {
          id: 16,
          label: "操作",
          prop: "operation",
          width: "140",
          align: "center",
          signIndex: 15,
          sortable: false,
        }
      ],
      curType:"add", //其他联系人添加add, 其他联系人编辑edit
      isAddContactsDialogShow: false,
      form: {
        id: '',
        name: '',
        firm_id: '',
        tag_id: '',
        duty_id:'',
        target: '',
        source: '',
        remark: '',
        persons:[],
        files:[],
        // 主要联系人
        contacts_name:'',
        phone:'',
        sex: '',
        department: '',
        job: '',
        social:'',
      },
      basicRules: {
        name: [
          { required: true, message: "请输入客户名称", trigger: "change" },
        ],
        firm_id: [
          { required: true, message: "请选择企业类型", trigger: "change" },
        ],
        // duty_id: [
        //   { required: true, message: "请选择对接人", trigger: "change" },
        // ],
        contacts_name: [{ required: true, message: "请填写联系人名称", trigger: "change" }],
        phone: [
          { required: true, message: "请填写联系人电话", trigger: "change" },
        ],
        // sex: [{ required: true, message: "请选择联系人性别", trigger: "change" }],
        // department: [
        //   { required: true, message: "请填写联系人部门", trigger: "change" },
        // ],
        // job: [{ required: true, message: "请填写联系人职务", trigger: "change" }],
      },
      uploadDocumentLoading: false,
      limitNum: 5,
      contractsList:[],
      curContractsInfo:{}, //当前现在显示的合同信息
      curFuncType:"add",  //添加联系疼add  , 编辑联系edit
      editIndex: -1, //编辑联系人的index
      contractPaymentData:[],  //当前查看合同的缴费记录
      contractPaymentTableHeader:[ {
          id: 1,
          label: "缴费人",
          prop: "user_name",
          width: "100",
          align: "center",
          signIndex: 0,
          sortable: false,
        },
        {
          id: 2,
          label: "缴费日期",
          prop: "post_date",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: false,
        },
        {
          id: 3,
          label: "缴费金额（元）",
          prop: "fee",
          width: "150",
          align: "center",
          signIndex: 2,
          sortable: false,
        },
        {
          id: 4,
          label: "本年缴费是否结清",
          prop: "finish",
          width: "150",
          align: "center",
          signIndex: 3,
          sortable: false,
        },
        {
          id: 5,
          label: "备注",
          prop: "remark",
          width: "130",
          align: "center",
          signIndex: 4,
          sortable: false,
        },
        {
          id: 6,
          label: "创建人",
          prop: "created_name",
          width: "100",
          align: "center",
          signIndex: 5,
          sortable: false,
        },
        {
          id: 7,
          label: "创建时间",
          prop: "created_date",
          width: "130",
          align: "center",
          signIndex: 6,
          sortable: false,
        }]
    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        this.$refs.personalTree.onClear();
        Object.assign(this.$data, this.$options.data());
      }else{
        this.$nextTick(() => {
          // this.$refs.ruleForm.resetFields();
          if(this.curSelecedType === 'detail') {
            this.seleteFirstRowBright()
          }
          this.$refs.form.clearValidate();
        })
      }
    },
  },
  methods: {
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    handleClick(tab, event) {
      // console.log(tab, event);
    },
    // 设置第一行高亮
    seleteFirstRowBright() {   
      if(!!this.contractsList && this.contractsList.length > 0){
        this.$refs.trTable.$refs.table.setCurrentRow(this.contractsList[0])
      }       
    },
    // 添加联系人
    addContacts() {
      this.curFuncType = 'add';
      this.isAddContactsDialogShow = true
    },
    //保存添加联系人 
    saveAddEditContacts(info) {
      if(this.curFuncType == 'add') {
        this.form.persons.push(info)
      }
      if(this.curFuncType == 'edit') {
        let obj = this.form.persons[this.editIndex];
        obj.name = info.name;
        obj.sex = info.sex;
        obj.department = info.department;
        obj.job = info.job;
        obj.social = info.social;
        obj.name = info.name;
        obj.type = info.type;
      }
      this.isAddContactsDialogShow = false;
    },
    // 编辑
    editRowInfo(row,index) {
      this.curFuncType = 'edit';
      this.editIndex = index;
      this.isAddContactsDialogShow = true;
      let newForm = {...row}
      setTimeout(() => {
        for (const key in this.$refs.addContactsDialog.form) {
          if (Object.hasOwnProperty.call(newForm, key)) {
            this.$refs.addContactsDialog.form[key] = newForm[key]
          }
        }
      },100)
    },
    // 删除
    deleteRowInfo(row,index) {
      this.form.persons.splice(index, 1)
    },

    // 判断文件大小
    beforeFileUpload (file) {
      const isLt1M = file.size / 1024 / 1024 < 10
      if (isLt1M) {
        return true
      }
      this.$message({type: 'error', message: '请不要上载大小超过10M的文件', showClose: true})
      return false
    },
    // 上传资料
    handlePreview(file) {
      if(this.curSelecedType == 'detail') {
        this.$message({type: 'warning', message: '详情不支持上传，如需上传请到编辑页面', showClose: true})
        return
      }
      if( this.form.files.length > 4) {
         this.$message({type: 'warning', message: '最多只能上传五个文件', showClose: true})
        return
      }
      if (this.beforeFileUpload(file)) {
        this.uploadAccidentDataFiles(file)
      }
    },
    // 上传相关资料文件
    uploadAccidentDataFiles(file) {
       // let parmas ={
      //   file: file.row
      // };
      console.log(file)
      let formData = new FormData();
      formData.append("file", file.raw);

      let params = {
        file: formData,
      };
      let fileName = file.name;
      this.$client.AddTxtfileUpload(params).then(res => {
        if(res.head.result == "200") {
          let fileObj = {
            name: fileName,
            url: res.context
          }
          this.form.files.push(fileObj)
          this.$message({
            showClose: true,
            message: "上传成功",
            type: "success"
          });
        }else{
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error",
          });
        }
      })
    },
    // 删除相关资料
    handleRemove(file, fileList){
      console.log(file, fileList)
      // this.$emit('on-reset')
    },
    // 下载文件
    downloadDocument(item) {
      // console.log(item)
      window.location.href = item.url
      this.$message({type: 'success', message: '下载成功'})
    },
    // 删除文件
    deleteDocument(item,index) {
      this.fileDocumentIndex = index;
       this.form.files.splice(index, 1)
      // this.$refs.uploadDocomnet.uploadFiles.splice(index, 1)
    },
    // 查看合同信息
    checkContractsInfo(row) {
      this.curContractsInfo = row
      this.contractPaymentData = !!row.fee_records? row.fee_records : []
    },

    updatePlaybill(formName) {
       this.$refs[formName].validate((valid) => {
        if (valid) {
          let info = JSON.parse(JSON.stringify(this.form));
          // delete info.contacts_name;
          // delete info.phone;
          // delete info.sex;
          // delete info.department;
          // delete info.job;
          // delete info.social;
          let mainContactsInfo = {
            name: info.contacts_name,
            phone: info.phone,
            sex: info.sex,
            department: info.department,
            job: info.job,
            social: info.social,
            type: 1
          }
          info.persons.push(mainContactsInfo)
          delete info.contacts_name;
          delete info.phone;
          delete info.sex;
          delete info.department;
          delete info.job;
          delete info.social;
          
          // console.log(info)
          // return
          this.$emit("save-add-edit", info);
        } else {
          return false;
        }
      });
    },
  },
};
</script>
  
<style lang="stylus" rel="stylesheet/stylus" scoped>
.el-dialog-div{
  height: 500px;
  overflow-y: scroll;
}
// .el-dialog-div /deep/ .el-input {
//   width: 150px;
// }
.el-dialog-div /deep/ .el-date-editor {
  width: 175px;
}
.el-dialog-div /deep/.el-select,.el-select--mini {
  width: 175px;
}
.el-dialog-div /deep/ .el-input,.el-input--mini{
  width: 175px;
}

.el-dialog-div /deep/ .el-textarea {
  width: 725px;
}

.document-content{
  padding: 5px 4px 40px;
  
  // width: 100%;
  >li{
    width: 100%;
    // padding: 8px 0;
    justify-content: space-between;
    align-items: center;
    border-bottom: 3px solid #19be6b;
  }
}
.el-dialog-div /deep/ .el-upload-list{
  display: none
}

</style>

