<template>
  <el-dialog
    :visible="dialogBool"
    :title="title"
    :before-close="dialogClose"
    width="1080px"
    
    append-to-body
  >
    <div class="el-dialog-div">
      <el-tabs type="border-card" v-model="activeName">
        <el-tab-pane label="登记单" name="first" v-if="curSelecedType == 'edit' && curInfo.is_admin_add == 2">
          <div style="height:460px;overflow-y: scroll;">
            <el-card class="box-card" style="margin-bottom:15px;">
              <div slot="header" class="clearfix">
                <span>登记单</span>
                <!-- <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button> -->
              </div>
              <el-descriptions>
                <el-descriptions-item label="订单编号">CGDD202101030001</el-descriptions-item>
                <el-descriptions-item label="当前流程">待审核</el-descriptions-item>
              </el-descriptions>
            </el-card>
            <el-card class="box-card" style="margin-bottom:15px;">
              <div slot="header" class="clearfix">
                <span>基本信息</span>
                <!-- <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button> -->
              </div>
              <el-descriptions title="用户信息">
                <el-descriptions-item label="会员姓名">kooriookami</el-descriptions-item>
                <el-descriptions-item label="联系电话">18100000000</el-descriptions-item>
                <el-descriptions-item label="出生日期">苏州市</el-descriptions-item>
                <el-descriptions-item label="出生地点">江苏省苏州市吴中区吴中大道 1188 号</el-descriptions-item>
                <el-descriptions-item label="民族">汉</el-descriptions-item>
                <el-descriptions-item label="工资">18100</el-descriptions-item>
                <el-descriptions-item label="政治面貌">苏州市</el-descriptions-item>
                <el-descriptions-item label="学历">本科</el-descriptions-item>
                <el-descriptions-item label="工作单位及职务">kooriookami</el-descriptions-item>
                <el-descriptions-item label="籍贯">18100000000</el-descriptions-item>
                <el-descriptions-item label="家庭主要成员及其工作单位">苏州市</el-descriptions-item>
                <el-descriptions-item label="个人工作简历">江苏省苏州市吴中区吴中大道 1188 号</el-descriptions-item>
                <el-descriptions-item label="备注">江苏省苏州市吴中区吴中大道 1188 号</el-descriptions-item>
              </el-descriptions>
              <div class="show-flex-box-r">
                <span style="color:#606266;margin-right: 10px;">附件:</span>
                <div style="color:#606266; flex-grow:1;" v-if="ex_files && ex_files.length">
                   <multiple-files-upload :filesList="ex_files" :disabled="true" :acceptType="'.jpg,.jpeg,.doc,.docx,.pdf,.xls,.xlsx'" @upload-update-success="uploadUpdateSuccess"></multiple-files-upload>
                </div>
                <div style="color:#606266; flex-grow:1;" v-else>暂无附件</div>
                
              </div>
            </el-card>
            <el-card class="box-card" style="margin-bottom:15px;">
              <div slot="header" class="clearfix">
                <span>审核流程</span>
                <!-- <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button> -->
              </div>
              <div class="show-flex-box-r">
                <approve-schedule :flow_id="flow_id" :isFlow="true"></approve-schedule>
              </div>
            </el-card>
          </div>
        </el-tab-pane>
        <el-tab-pane label="会员档案" name="second">
          <div style="height:460px;overflow-y: scroll;">
            <el-form :model="form" :rules="basicRules" ref="form" label-width="140px" size="mini">
              <div class="show-flex-box-r" style="justify-content: space-between;align-items: center; margin-bottom: 10px;">
                <div class="show-flex-box-c">
                  <div class="show-flex-box-r">
                    <el-form-item label="档案编号:" prop="code">
                      <el-input v-model="form.code" placeholder="请输入档案编号" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="姓名:" prop="name">
                      <el-input v-model="form.name" placeholder="请输入姓名"></el-input>
                    </el-form-item>
                  </div>
                  <div class="show-flex-box-r">
                    <el-form-item label="性别:" prop="sex">
                      <el-radio-group v-model="form.sex" style="width: 180px;">
                        <el-radio :label="1"><span style="color:#606266">男</span></el-radio>
                        <el-radio :label="2"><span style="color:#606266">女</span> </el-radio>
                      </el-radio-group>
                    </el-form-item>
                    <el-form-item label="出生日期:" prop="birthday">
                      <el-date-picker
                        v-model="form.birthday"
                        type="date"
                        format="yyyy-MM-dd"
                        value-format="yyyy-MM-dd"
                        placeholder="选择日期"
                      >
                      </el-date-picker>
                    </el-form-item>
                  </div>
                </div>
                <div class="el-form-row-first-right show-flex-box-c" style="margin-right: 60px;">
                  <div
                    class="avatar-uploader"
                    :class="{ 'have-avatar-active': form.photo }"
                  >
                    <el-image 
                      v-if="form.photo"
                      class="avatar"
                      :src="form.photo" 
                      :preview-src-list="[form.photo]">
                    </el-image>
                    <i v-else class="avatar-uploader-icon"
                      ><el-button class="el-icon-upload2" @click="uploadFile">上传图片</el-button></i
                    >
                    <i class="delete-icon el-icon-delete" v-if="form.photo" @click.stop="deleteImage()"></i>
                  </div>
                  <el-button icon="el-icon-plus" size="mini" @click="uploadFile" v-if="form.photo">更换图片</el-button>
                </div>
              </div>
              <div class="show-flex-box-r">
                <el-form-item label="所属工会:" prop="trade">
                  <el-input v-model="form.trade" placeholder="请输入所属工会"></el-input>
                </el-form-item>
                <el-form-item label="户籍地:" prop="house">
                  <el-input v-model="form.house" placeholder="请输入户籍地"></el-input>
                </el-form-item>
                <el-form-item label="居住地址:" prop="live_temp_address">
                  <el-input v-model="form.live_temp_address" placeholder="请输入居住地址"></el-input>
                </el-form-item>
              </div>
              <div class="show-flex-box-r">
                <el-form-item label="联系电话:" prop="phone">
                  <el-input v-model="form.phone" placeholder="请输入联系电话" oninput="value=value.replace(/[^\d.-]/g,'')"
                @blur="form.phone = $event.target.value"></el-input>
                </el-form-item>
                <el-form-item label="学历:" prop="top_education">
                  <el-input v-model="form.top_education" placeholder="请输入学历"></el-input>
                </el-form-item>
                <el-form-item label="从业情况:" prop="practice">
                  <el-input v-model="form.practice" placeholder="请输入从业情况"></el-input>
                </el-form-item>
              </div>
              <div class="show-flex-box-r">
                <el-form-item label="出生地点:" prop="birth_place">
                  <el-input v-model="form.birth_place" placeholder="请输入出生地点"></el-input>
                </el-form-item>
                <el-form-item label="民族:" prop="nation">
                  <el-input v-model="form.nation" placeholder="请输入民族"></el-input>
                </el-form-item>
                <el-form-item label="工资:" prop="wages">
                  <el-input v-model="form.wages" @change="changeWages" placeholder="请输入工资" oninput="value=value.replace(/[^\d.-]/g,'')" @blur="form.wages = $event.target.value"></el-input>
                </el-form-item>
              </div>
              <div class="show-flex-box-r">
                <el-form-item label="工作单位及职务:" prop="position">
                  <el-input v-model="form.position" placeholder="请输入工作单位及职务"></el-input>
                </el-form-item>
                <el-form-item label="是否劳务派遣:" prop="labour">
                  <el-select v-model="form.labour" placeholder="请选择活">
                    <el-option label="是" :value="1"></el-option>
                    <el-option label="否" :value="2"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="加入工会时间:" prop="join_trade">
                  <el-date-picker
                    v-model="form.join_trade"
                    type="datetime"
                    format="yyyy-MM-dd HH:mm:ss"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    placeholder="选择日期"
                  >
                  </el-date-picker>
                </el-form-item>
              </div>
              <div class="show-flex-box-r">
                <el-form-item label="入职时间:" prop="join_date">
                  <el-date-picker
                    v-model="form.join_date"
                    type="datetime"
                    format="yyyy-MM-dd HH:mm:ss"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    placeholder="选择日期"
                  >
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="参保类型:" prop="insured_ids">
                  <tr-select-dictionaries
                    v-model="form.insured_ids"
                    :classKey="'会员参保类型'"
                    :placeholder="'请选择参保类型'"
                    :isMultiple="true"
                  ></tr-select-dictionaries>
                </el-form-item>
                <el-form-item label="籍贯:" prop="hometown">
                  <el-input v-model="form.hometown" placeholder="请输入籍贯"></el-input>
                </el-form-item>
              </div>
              <div class="show-flex-box-r">
                <el-form-item label="是否签订劳动协议:" prop="sign_labour">
                  <el-select v-model="form.sign_labour" placeholder="请选择">
                    <el-option label="是" :value="1"></el-option>
                    <el-option label="否" :value="2"></el-option>
                  </el-select>
                </el-form-item>
                <!-- <el-form-item label="是否审核:" prop="state">
                  <el-select v-model="form.state" placeholder="请选择">
                    <el-option label="已审核" :value="1"></el-option>
                    <el-option label="未审核" :value="2"></el-option>
                    <el-option label="待审核" :value="3"></el-option>
                  </el-select>
                </el-form-item> -->
                <el-form-item label="会员状态:" prop="state">
                  <el-select v-model="form.state" placeholder="请选择">
                    <el-option label="入会" :value="1"></el-option>
                    <el-option label="未入会" :value="2"></el-option>
                    <el-option label="待入会" :value="3"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="会员证号:" prop="trade_code">
                  <el-input v-model="form.trade_code" placeholder="请输入会员证号"></el-input>
                </el-form-item>
              </div>
              <div class="show-flex-box-r">
                <el-form-item label="是否会员:" prop="is_member">
                  <el-select v-model="form.is_member" placeholder="请选择">
                    <el-option label="是" :value="1"></el-option>
                    <el-option label="否" :value="2"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="政治面貌:" prop="politics_status">
                  <!-- <tr-select-dictionaries
                    v-model="form.order_type"
                    :classKey="'会员参保类型'"
                    :placeholder="'请选择参保类型'"
                    :isMultiple="true"
                  ></tr-select-dictionaries> -->
                  <el-select v-model="form.politics_status" placeholder="请选择">
                    <el-option
                      v-for="item in politicsStatusOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="职称:" prop="title">
                  <el-input v-model="form.title" placeholder="请输入职称"></el-input>
                </el-form-item>
              </div>
              <div class="show-flex-box-r">
                <el-form-item label="身份证号码:" prop="idcord">
                  <el-input v-model="form.idcord" placeholder="请输入身份证号码"></el-input>
                </el-form-item>
                <el-form-item label="邮政编码:" prop="postal_code">
                  <el-input v-model="form.postal_code" placeholder="请输入邮政编码"></el-input>
                </el-form-item>
                <el-form-item label="婚姻情况:" prop="marriage">
                  <el-select v-model="form.marriage" placeholder="请选择">
                    <el-option label="已婚" :value="'已婚'"></el-option>
                    <el-option label="未婚" :value="'未婚'"></el-option>
                  </el-select>
                </el-form-item>
              </div>
              <div class="show-flex-box-r">
                <el-form-item label="户口类型:" prop="residence_type">
                  <el-select v-model="form.residence_type" placeholder="请选择">
                    <el-option label="农业户口" :value="'农业户口'"></el-option>
                    <el-option label="非农业户口" :value="'非农业户口'"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="所属行业:" prop="industry">
                  <el-input v-model="form.industry" placeholder="请输入所属行业"></el-input>
                </el-form-item>
                <el-form-item label="所属单位:" prop="company">
                  <el-input v-model="form.company" placeholder="请输入所属单位"></el-input>
                </el-form-item>
              </div>
              <div class="show-flex-box-r">
                <el-form-item label="是否为困难职工:" prop="is_difficulty">
                  <el-select v-model="form.is_difficulty" placeholder="请选择是否为困难职工" clearable>
                    <el-option 
                      v-for="(item, index) in isStaffRepresentativeOptions" 
                      :key="index" 
                      :label="item.name"
                      :value="item.value" >
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="工会职务:" prop="trade_post">
                    <tr-select-dictionaries
                      v-model="form.trade_post"
                      :classKey="'岗位级别'"
                      :placeholder="'请选择职务'"
                      :isMultiple="false"
                    ></tr-select-dictionaries>
                </el-form-item>
                <el-form-item label="困难职工入选时间:" prop="join_difficulty">
                  <el-date-picker
                    v-model="form.join_difficulty"
                    type="date"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                    placeholder="选择困难职工入选时间">
                  </el-date-picker>
                </el-form-item>
              </div>
              <div class="show-flex-box-r">
                <el-form-item label="家庭人口数:" prop="house_number">
                  <el-input-number v-model="form.house_number" placeholder="请填写家庭人口数" clearable
                    :style="{width: '100%'}" :controls="false"></el-input-number>
                </el-form-item>
              </div> 
              <el-form-item label="上传附件:" prop="files">
                <multiple-files-upload :filesList="form.files" :acceptType="'.jpg,.jpeg,.doc,.docx,.pdf,.xls,.xlsx'" @upload-update-success="uploadUpdateSuccess"></multiple-files-upload>
              </el-form-item>
              <!-- <el-form-item label="岗位描述:" prop="c_remark">
                <el-input
                  v-model="form.c_remark" 
                  type="textarea"
                  maxlength="200"
                  :rows="4"
                  show-word-limit
                  placeholder="请输入岗位描述"></el-input>
              </el-form-item> -->
            </el-form>
          </div>
          
        </el-tab-pane>
        <el-tab-pane name="third" label="成长记录" v-if="curSelecedType !== 'add'">
          <grow-up-record ref="lifecycle" :curSelecedType="curSelecedType"></grow-up-record>
        </el-tab-pane>
      </el-tabs>
      
    </div>

    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogClose">取 消</el-button>
      <el-button type="primary" @click="updatePlaybill('form')">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import multipleFilesUpload from "@/components/multiple-files-upload";
import approveSchedule from '@/components/approve-echo/approve-schedule.vue';
import growUpRecord from './grow-up-record';
export default {
  components: {multipleFilesUpload,approveSchedule,growUpRecord},
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
      activeName: 'second',
      flow_id: '',
      politicsStatusOptions: [{
        value: '1',
        label: '群众'
      }, {
        value: '2',
        label: '团员'
      }, {
        value: '3',
        label: '预备党员'
      }, {
        value: '4',
        label: '党员'
      }],
      form: {
        id: "",
        code: "",
        name: "",
        birthday: "",
        photo:"",
        sex:"",
        trade: "",
        house: "",
        live_temp_address: "",
        phone:"",

        top_education: "",
        practice: "",
        birth_place: "",
        nation:"",

        wages: "",
        position: "",
        labour: "",
        join_trade:"",

        join_date: "",
        insured_ids: [],
        hometown: "",
        sign_labour:"",

        state: "",
        trade_code: '',
        is_member: "",
        politics_status: "",
        title:"",

        idcord: "",
        postal_code: "",
        marriage: "",
        residence_type:"",
        industry: "",
        company: "",

        is_difficulty: "",
        trade_post: "",
        join_difficulty: "",
        house_number: "",
        files:[],
      },
      isStaffRepresentativeOptions:[
        { value: 1, name: "是" },
        { value: 0, name: "否" },
      ],
      basicRules: {
        code: [
          { required: true, message: "请输入档案编号", trigger: "change" },
        ],
        name: [
          { required: true, message: "请输入姓名", trigger: "change" },
        ],
        

        sex: [
          { required: true, message: "请选择性别", trigger: "change" },
        ],
        birthday: [
          { required: true, message: "请选择出生日期", trigger: "change" },
        ],
        trade: [
          { required: true, message: "请输入所属工会", trigger: "change" },
        ],
        house: [
          { required: true, message: "请输入户籍地", trigger: "change" },
        ],
        code: [
          { required: true, message: "请输入岗位名称", trigger: "change" },
        ],
        live_temp_address: [
          { required: true, message: "请输入居住地址", trigger: "change" },
        ],
        phone: [
          { required: true, message: "请输入联系电话", trigger: "change" },
        ],
        top_education: [
          { required: true, message: "请输入学历", trigger: "change" },
        ],
        practice: [
          { required: true, message: "请输入从业情况", trigger: "change" },
        ],
        birth_place: [
          { required: true, message: "请输入出生地点", trigger: "change" },
        ],
        nation: [
          { required: true, message: "请输入民族", trigger: "change" },
        ],
        join_trade: [
          { required: true, message: "请选择加入公会时间", trigger: "change" },
        ],
        politics_status: [
          { required: true, message: "请选择政治面貌", trigger: "change" },
        ],
      },
      ex_files:[
        {id:1, url:'dasd a',name:'这是附件'}
      ],
      curInfo:{},
    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        Object.assign(this.$data, this.$options.data());
        if(this.curSelecedType === 'detail') {
          this.$refs['lifecycle'].resetData()  // 成长记录清除
        }
      }else{
        this.$nextTick(() => {
          this.$refs.form.clearValidate();
        })
        if(this.curSelecedType == 'add') {
          this.reqCodeErpTradeMainManage()
        }
      }
    },
  },
  methods: {
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    changeWages() {
      this.form.wages = Number(this.form.wages)
      if(!isNaN(this.form.wages)) {
        this.form.wages = this.form.wages.toFixed(2)
      }else{
        this.form.wages = ''
      }
      // console.log(this.form.wages)
    },
    // 获取档案编号
    reqCodeErpTradeMainManage() {
      this.$client.GetCodeErpTradeMainManage().then(res => {
        if(res.head.result == '200') {
          this.form.code = res.context;
        }else{
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error",
          });
        }
      })
    },
    setData(val) {
      let info = {...val, ...val.person_info}
      this.curInfo = info;
      for (const key in this.form) {
        if (Object.hasOwnProperty.call(info, key)) {
          // const element = this.formData[key];
          this.form[key] = info[key]
        }
      }
      // if(this.curSelecedType === 'detail') {
      //   this.getGrowUpRecord(val)
      // }
      setTimeout(() => {
        this.$refs['lifecycle'].setData(val.user_id)
      }, 60);
    },
    // 自定义上传文件方法
    // :http-request="uploadFile"
    uploadFile() {
      let input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.onchange = () => {
        console.log(input.files);
        let reader = new FileReader();
        reader.readAsDataURL(input.files[0]);
        let file = input.files[0];
        reader.onload = (ev) => {
          input = undefined;
        };
        let formData = new FormData();
        formData.append("file", file);
        let params = {
          file: formData,
        };
        this.$client.AddCarInfoImageUpload(params)
        .then(res => {
          if(res.head.result == '200') {
            this.form.photo = res.context;
            console.log(this.form.photo)
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
       
      };
      input.click();
    },
    deleteImage() {
      this.form.photo = '';
    },

    // 上传文件
    uploadUpdateSuccess(filesList) {
      this.form.files = filesList;
    },
   
    updatePlaybill(formName) {
       this.$refs[formName].validate((valid) => {
        if (valid) {
          let info = {...this.form};
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
.el-dialog-div {
  height: 500px;
  // overflow-y: scroll;
}
.el-dialog-div /deep/ .el-date-editor {
  width: 180px;
}
.el-dialog-div /deep/.el-select,.el-select--mini {
  width: 180px;
}
.el-dialog-div /deep/ .el-input,.el-input--mini{
  width: 180px;
}

.el-dialog-div /deep/ .el-textarea {
  width: 820px;
}
.el-form-row-first-right {
  width: 200px;
  height: 100px;
  .avatar-uploader {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    // border: 1px dashed #d9d9d9;
    // border-radius: 6px;
    cursor: pointer;
    background: url('../../../../../src/assets/veh_svg/uploader-icon.svg') no-repeat center;
    background-size: 100% 100%;
    overflow: hidden;
    object-fit: cover !important;
    position: relative;
    .avatar {
      display: block;
      width: 100%;
      height: 100%;
    }
    .delete-icon{
      position: absolute;
      font-size: 22px;
      top: 0px;
      right: 0px;
      color: #409EFF;
      font-weight: 700;
    }
  }
  .have-avatar-active {
      background: none;

      div {
        width: 100% !important;
        height: 100% !important;
      }
    }
}
</style>

