<template>
  <el-dialog
    :visible="dialogBool"
    :title="title"
    :before-close="dialogClose"
    width="1030px"
  >
    <div class="el-dialog-div">
      <el-radio-group size="mini" v-model="isCollapse" style="margin-bottom: 20px;" v-if="curSelecedType == 'edit'">
        <el-radio-button :label="true">基本信息</el-radio-button>
        <el-radio-button :label="false">流程进度</el-radio-button>
      </el-radio-group>
      <div v-show="isCollapse" style="height:470px;overflow-y: scroll;">
        <el-form :model="form" :rules="basicRules" ref="form" label-width="140px" size="mini">
          <div class="show-flex-box-r">
            <i style="float: left; width: 6px; height: 18px; background: #409eff"></i>
            <p style="margin-left: 15px;margin-bottom: 15px;color: #409eff;font-size: 16px;font-weight: bold;">发展阶段</p>
          </div>
          <div class="show-flex-box-r">
            <el-form-item label="发展阶段:" prop="state">
              <el-select v-model="form.state" placeholder="请选择发展阶段" clearable>
                <el-option v-for="(item, index) in developmentPhaseOptions" :key="index" :label="item.name"
                  :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="接收组织:" prop="organ_id">
              <get-party-org-select-tree
                ref="getPartyOrgSelectTree"
                :placeholder="'选择党组织'"
                :isShowCheckbox="false"
                v-model="form.organ_id"
                :isExportMultiple="false"
                :isCheckStrictly="false"
                :width="'180'"
                :disabled="false"
              >
              </get-party-org-select-tree>
            </el-form-item>
          </div>

          <div class="show-flex-box-r">
            <i style="float: left; width: 6px; height: 18px; background: #409eff"></i>
            <p style="margin-left: 15px;margin-bottom: 15px;color: #409eff;font-size: 16px;font-weight: bold;">用户基本信息</p>
          </div>
          <div class="show-flex-box-r">
            <!-- <el-form-item label="党组织名称:" prop="name">
              <el-input v-model="form.name" placeholder="请输入党组织名称"></el-input>
            </el-form-item> -->
            <el-form-item label="发展培养方式:" prop="way">
              <el-radio-group v-model="form.way">
                <el-radio :label="1"><span style="color:#606266">正常培养</span></el-radio>
                <el-radio :label="2"><span style="color:#606266">重点培养</span> </el-radio>
              </el-radio-group>
            </el-form-item>
            <!-- <el-form-item label="活动属性:" prop="address">
              <el-radio-group v-model="form.propety" style="width: 180px;">
              <el-radio :label="1"><span style="color:#606266">是</span></el-radio>
              <el-radio :label="0"><span style="color:#606266">否</span> </el-radio>
            </el-radio-group>
            </el-form-item> -->
          </div>
          <div class="show-flex-box-r">
            <el-form-item label="姓名:" prop="name">
              <el-input v-model="form.name" placeholder="请输入姓名"></el-input>
            </el-form-item>
            <el-form-item label="手机号:" prop="phone">
              <el-input  placeholder="请输入手机号"
                v-model="form.phone"
                oninput="value=value.replace(/[^\d.-]/g,'')"
                @blur="form.phone = $event.target.value"></el-input>
            </el-form-item>
            <el-form-item label="性别:" prop="sex">
              <el-select v-model="form.sex" placeholder="请选择">
                <el-option label="男" :value="1"></el-option>
                <el-option label="女" :value="2"></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="show-flex-box-r">
            <!-- <el-form-item label="活动类别:" prop="c_political">
              <el-select v-model="form.c_political" placeholder="请选择活动类别" clearable>
                <el-option v-for="(item, index) in activityTypeOptions" :key="index" :label="item.name"
                  :value="item.value"></el-option>
              </el-select>
            </el-form-item> -->
            <el-form-item label="是否台湾籍:" prop="taiwan">
              <el-radio-group v-model="form.taiwan" style="width: 180px;">
                <el-radio :label="2"><span style="color:#606266">是</span></el-radio>
                <el-radio :label="1"><span style="color:#606266">否</span> </el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="身份证:" prop="idcode">
              <el-input v-model="form.idcode" placeholder="请输入身份证"></el-input>
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

          <div class="show-flex-box-r">
            <el-form-item label="学历:" prop="top_education">
              <!-- <el-select v-model="form.top_education" placeholder="请选择" clearable>
                <el-option v-for="(item, index) in educationOptions" :key="index" :label="item.name"
                  :value="item.value"></el-option>
              </el-select> -->
              <tr-select-dictionaries v-model="form.top_education" :classKey="'发展党员学历'" :placeholder="'请选择学历'"></tr-select-dictionaries>
            </el-form-item>
            <el-form-item label="工作岗位:" prop="position">
              <el-input v-model="form.position" placeholder="请输入工作岗位"></el-input>
            </el-form-item>
            <el-form-item label="籍贯:" prop="hometown">
              <el-input v-model="form.hometown" placeholder="请输入籍贯"></el-input>
            </el-form-item>
          </div>
          <div class="show-flex-box-r">
            <el-form-item label="民族:" prop="nation">
              <el-input v-model="form.nation" placeholder="请输入民族"></el-input>
            </el-form-item>
            <el-form-item label="居住地:" prop="live_temp_adrress">
              <el-input v-model="form.live_temp_adrress" placeholder="请输入居住地" style="width: 500px;"></el-input>
            </el-form-item>
          </div>
          <div class="show-flex-box-r">
            <el-form-item label="是否为农民工:" prop="farmers">
              <el-radio-group v-model="form.farmers" style="width: 180px;">
                <el-radio :label="1"><span style="color:#606266">是</span></el-radio>
                <el-radio :label="2"><span style="color:#606266">否</span> </el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="是否线上考核:" prop="online">
              <el-radio-group v-model="form.online" style="width: 180px;">
                <el-radio :label="1"><span style="color:#606266">是</span></el-radio>
                <el-radio :label="2"><span style="color:#606266">否</span> </el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="专业技术职务级别:" prop="leave">
              <tr-select-dictionaries v-model="form.leave" :classKey="'专业技术职务级别'" :placeholder="'请选择专业技术职务级别'"></tr-select-dictionaries>
            </el-form-item>
          </div>
          <div>
            <el-form-item label="图片:" prop="ex_pics">
              <div class="list-data-list show-flex-box-r">
                <ul class="list-data" v-for="(item,index) in form.ex_pics" :key="index">
                  <li class="item" v-if="item">
                    <image-box :src="item" :id="index+1" @on-delete="imageDelete(index)"></image-box>
                  </li>
                  <!-- <li class="item unchecked" v-else @click="uploadFile()">
                    <i class="el-icon-plus" style="font-size: 60px;font-weight: 600;"></i>
                  </li> -->
                </ul>
                <div class="item unchecked" @click="uploadFile()">
                  <i class="el-icon-plus" style="font-size: 60px;font-weight: 600;"></i>
                </div>
              </div>
              
            </el-form-item>
          </div>
        </el-form>
      </div>
      <div class="show-flex-box-r" style="height:470px;" v-show="!isCollapse">
        <flow-chart ref="flowChart" :isShowNeedSubmitInfo="true" :isCheckSchedule="true" :exStepsList="exStepsList"></flow-chart>
      </div>
      
    </div>

    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogClose">取 消</el-button>
      <el-button type="primary" @click="updatePlaybill('form')">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import imageBox from './image-box'
import getDepartmentSelect from "@/components/base/formModel/tree/get-department-select-tree";
import getPartyOrgSelectTree from "@/components/base/formModel/tree/get-party-org-select-tree";
import flowChart from "./flow-chart";
export default {
  components: { imageBox,getDepartmentSelect,getPartyOrgSelectTree,flowChart},
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
      isCollapse: true,
      developmentPhaseOptions:[
        { value: 1, name: "入党申请" },
        { value: 2, name: "入党积极份子" },
        { value: 3, name: "发展对象" },
        { value: 4, name: "预备党员" },
        { value: 5, name: "正式党员" },
      ],
      educationOptions:[
        { value: "博士", name: "博士" },
        { value: "研究生", name: "研究生" },
        { value: "本科", name: "本科" },
        { value: "专科" , name: "专科" },
        { value: "高中/中专", name: "高中/中专" },
        { value: "初中", name: "初中" },
        { value: "小学", name: "小学" },
      ],
      exStepsList:[],
      form: {
        id: "",
        state: "",
        organ_id: "",
        way: "",
        name: "",
        phone: "",
        sex: "",
        taiwan: "",
        idcode: "",
        birthday: "",
        top_education: "",
        position: "",
        hometown: "",
        nation: "",
        live_temp_adrress: "",
        farmers: "",
        online: "",
        leave: "",
        ex_pics:[],
      },
      basicRules: {
        state: [
          { required: true, message: "请选择发展阶段", trigger: "change" },
        ],
        organ_id: [
          { required: true, message: "请选择接收组织", trigger: "change" },
        ],
        way: [
          { required: true, message: "请选择发展方式", trigger: "change" },
        ],
        name: [
          { required: true, message: "请输入姓名", trigger: "change" },
        ],
        phone: [
          { required: true, message: "请输入手机号", trigger: "change" },
        ],
        sex: [
          { required: true, message: "请选择性别", trigger: "change" },
        ],
        taiwan: [
          { required: true, message: "请选择是否台湾籍", trigger: "change" },
        ],
        idcode: [
          { required: true, message: "请输入身份证", trigger: "change" },
        ],
        birthday: [
          { required: true, message: "请输选择出生日期", trigger: "change" },
        ],
        top_education: [
          { required: true, message: "请选择学历", trigger: "change" },
        ],
        position: [
          { required: true, message: "请输入工作岗位", trigger: "change" },
        ],
        nation: [
          { required: true, message: "请输入民族", trigger: "change" },
        ],
        live_temp_adrress: [
          { required: true, message: "请输入居住地", trigger: "change" },
        ],
        farmers: [
          { required: true, message: "请选择是否为农民工", trigger: "change" },
        ],
        online: [
          { required: true, message: "请选择是否线上考核", trigger: "change" },
        ],
        leave: [
          { required: true, message: "请选择专业技术职务级别", trigger: "change" },
        ],
        ex_pics: [
          { required: true, message: "请上传图片", trigger: "change" },
        ]
      },
      curInfo:{}, //当前操作的记录
    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        // 重置流程数据
        this.$refs.flowChart.resetData();
        Object.assign(this.$data, this.$options.data());
      }else{
        if(this.isCollapse) {
          this.$nextTick(() => {
            this.$refs.form.clearValidate();
          })

        }
      }
    },
    // isCollapse() {
    //   if(!this.isCollapse && this.curSelecedType == 'edit') {
    //     this.echoFlowChartForm();
    //   }
    // }
  },
  methods: {
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    imageDelete(index) {
      this.form.ex_pics.splice(index,1)
    },
    // 自定义上传文件方法
    // :http-request="uploadFile"
    uploadFile() {
      let input = document.createElement("input");
      input.type = "file";
      input.accept = ".jpg,.gif,.png";
      input.onchange = () => {
        let reader = new FileReader();
        reader.readAsDataURL(input.files[0]);
        let file = input.files[0];
        reader.onload = (ev) => {
          input = undefined;
        };
        let params = new FormData
        params.append('file', file)
        this.$client.uploadPicture({file: params}, 'api/ERPWeb/DataBase/UploadFile').then((req) => {
          // console.log(req);
          if (req.head.result === "200") {
            this.form.ex_pics.push(req.context)
          }
        });
      };
      input.click();
    },
    // 设置流程提交内容
    setFlowChartForm(val) {
      this.curInfo = val;
      // this.curInfo = {
      //   ex_organ_id :'',
      //   ex_apply_time: '2022-01-08',
      //   ex_apply_files: ['dsada'],
      //   type: '1'
      // };
      this.echoFlowChartForm();
      // if(!this.isCollapse) {
      //   this.echoFlowChartForm();
      // }
    },
    // 设置赋值回显流程提交内容
    echoFlowChartForm() {
      setTimeout(() => {
        let flowChartForm = this.$refs.flowChart.$refs.submitFormCom
        Object.keys(flowChartForm.form).forEach(item => {
          // console.log(item)
          let singleForm = flowChartForm.form[item]
          for (const key in singleForm) {
            if (Object.hasOwnProperty.call(this.curInfo, key)) {
              singleForm[key] = this.curInfo[key]
            }
          }
        })

      },100)
    },


    updatePlaybill(formName) {
      //  console.log(this.$refs.flowChart.$refs.submitFormCom.form)
       let flowChartInfo = this.$refs.flowChart.$refs.submitFormCom.form;
      //  let flowChartKeys = Object.keys(flowChartInfo)
       let flowChartForm = {}
       for (const key in flowChartInfo) {
         if (Object.hasOwnProperty.call(flowChartInfo, key)) {
            let element = flowChartInfo[key];
            flowChartForm = {...flowChartForm, ...element}
         }
       }
       delete flowChartForm.type
      //  console.log(flowChartForm)
      //  return
      // this.isCollapse = true;
      this.$nextTick(() => {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let info = {...this.form, ...flowChartForm};
            // console.log(info)
            // return
            this.$emit("save-add-edit", info);
          } else {
            return false;
          }
        });
      })
       
    },
  },
};
</script>
  
<style lang="stylus" rel="stylesheet/stylus" scoped>
.el-dialog-div{
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

// .el-tag + .el-tag {
//     margin-left: 10px;
//   }
// .button-new-tag {
//   margin-left: 10px;
//   height: 32px;
//   line-height: 30px;
//   padding-top: 0;
//   padding-bottom: 0;
// }
// .input-new-tag {
//   width: 90px;
//   margin-left: 10px;
//   vertical-align: bottom;
// }

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
      
</style>

