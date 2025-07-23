<template>
  <div class="base-info" :style="`height:${curChangeType == 'detail'?'470':'400'}px; overflow-x: hidden`">
    <el-form
      size="mini"
      :model="formData"
      :rules="rules"
      ref="formData"
      label-width="150px"
    >
      <div class="show-flex-box-r">
        <el-form-item label="党员姓名:" prop="user_id">
          <get-department-select
            ref="personalTree"
            v-model="formData.user_id"
            :width="'180'"
            :isShowCheckbox="false"
            :placeholder="'请选择党员姓名'"
            :isContainEmp="true"
            :show_all="true"
            :isExportMultiple="false"
            @on-change="selectedPartyMembers"
            :disabled="curChangeType!='add'"
          ></get-department-select>
        </el-form-item>
        <el-form-item label="身份证号:" prop="idcode">
          <el-input v-model="formData.idcode" placeholder="请输入身份证号" clearable :disabled="curChangeType == 'detail'"></el-input>
        </el-form-item>
        <el-form-item label="性别:" prop="sex">
          <el-radio-group v-model="formData.sex" style="width: 180px;" :disabled="curChangeType == 'detail'">
            <el-radio :label="'男'"><span style="color:#606266">男</span></el-radio>
            <el-radio :label="'女'"><span style="color:#606266">女</span> </el-radio>
          </el-radio-group>
        </el-form-item>
      </div>
      <div class="show-flex-box-r">
        <el-form-item label="民族:" prop="nation">
          <el-input v-model="formData.nation" placeholder="请填写民族" clearable :disabled="curChangeType == 'detail'"></el-input>
        </el-form-item>
        <el-form-item label="出生日期:" prop="birthday">
          <el-date-picker
            v-model="formData.birthday"
            type="date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
            @change="selectedBirthday"
            :disabled="curChangeType == 'detail'"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="年龄:" prop="age">
          <el-input v-model="formData.age" placeholder="根据基本信息出生年月" clearable disabled></el-input>
        </el-form-item>
      </div>
      <div class="show-flex-box-r">
        <el-form-item label="毕业院校:" prop="school">
          <el-input v-model="formData.school" placeholder="请输入毕业院校" clearable :disabled="curChangeType == 'detail'"></el-input>
        </el-form-item>
        <el-form-item label="专业:" prop="major">
          <el-input v-model="formData.major" placeholder="请输入专业" clearable :disabled="curChangeType == 'detail'"></el-input>
        </el-form-item>
        <el-form-item label="学历:" prop="top_education">
          <el-input v-model="formData.top_education" placeholder="请输入学历" clearable :disabled="curChangeType == 'detail'"></el-input>
        </el-form-item>
      </div>
      <div class="show-flex-box-r">
        <el-form-item label="所在党支部:" prop="organ_id">
          <!-- <el-input v-model="formData.name" placeholder="请输入党组织书记" clearable></el-input> -->
          <get-party-org-select-tree
            ref="getPartyOrgSelectTree"
            :placeholder="'选择党支部'"
            :isShowCheckbox="false"
            v-model="formData.organ_id"
            :isExportMultiple="false"
            :isCheckStrictly="false"
            :width="'180'"
            @on-change="selectPartyOrg"
            :disabled="curChangeType == 'detail'"
          >
          </get-party-org-select-tree>

        </el-form-item>
        <el-form-item label="入党日期:" prop="join_party">
          <el-date-picker
            v-model="formData.join_party"
            type="date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
            @change="selectedJoinTime"
            @input="sendRelevance"
            :disabled="curChangeType == 'detail'"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="转正日期:" prop="positive_party">
          <el-date-picker
            v-model="formData.positive_party"
            type="date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
            @input="sendRelevance"
            :disabled="curChangeType == 'detail'"
          >
          </el-date-picker>
        </el-form-item>
      </div>
      <div class="show-flex-box-r">
        <el-form-item label="人员类别:" prop="type">
          <get-select-dictionaries v-model="formData.type" :classKey="'党员人员类别'" :placeholder="'请选择人员类别'" :disabled="curChangeType=='detail'"></get-select-dictionaries>
          <!-- <el-select v-model="formData.c_political" placeholder="请选择人员类别" clearable :disabled="curChangeType == 'detail'">
            <el-option v-for="(item, index) in politicalOptions" :key="index" :label="item.name"
              :value="item.value"></el-option>
          </el-select> -->
        </el-form-item>
        <el-form-item label="籍贯：" prop="hometown">
          <el-input v-model="formData.hometown" placeholder="请输入籍贯" clearable :disabled="curChangeType == 'detail'"></el-input>
        </el-form-item>
        <el-form-item label="手机号:" prop="phone">
          <el-input v-model="formData.phone" placeholder="请输入手机号" oninput="value=value.replace(/[^\d.-]/g,'')" @blur="formData.phone = $event.target.value" clearable :disabled="curChangeType == 'detail'"></el-input>
        </el-form-item>
      </div>
      <div>
        <el-form-item label="现居住地址:" prop="live_temp_adrress">
          <el-input v-model="formData.live_temp_adrress" placeholder="请输入现居住地址" style="width: 840px" clearable :disabled="curChangeType == 'detail'"></el-input>
        </el-form-item>
      </div>
      <div>
        <el-form-item label="户籍所在地详细地址:" prop="account_area">
          <el-input v-model="formData.account_area" placeholder="请输入户籍所在地详细地址" style="width: 840px" clearable :disabled="curChangeType == 'detail'"></el-input>
        </el-form-item>
      </div>
      <div class="show-flex-box-r">
        <el-form-item label="岗位:" prop="job_names">
          <!-- <get-position-list v-model="formData.position_id" :disabled="curChangeType == 'detail'"></get-position-list> -->
          <el-input
            placeholder="请选择岗位"
            v-model="formData.job_names"
            :disabled="curChangeType == 'detail'"
          ></el-input>
        </el-form-item>
        <el-form-item label="专业技术职务级别:" prop="position_leave">
          <get-select-dictionaries v-model="formData.position_leave" :classKey="'专业技术职务级别'" :placeholder="'请选择专业技术职务级别'" :disabled="curChangeType=='detail'"></get-select-dictionaries>
          <!-- <el-input v-model="formData.c_top_education" placeholder="请输入专业技术职务级别" clearable :disabled="curChangeType == 'detail'"></el-input> -->
        </el-form-item>
      </div>
      <div>
        <el-form-item label="工作单位及职务:" prop="position">
          <el-input v-model="formData.position" placeholder="请输入工作单位及职务" style="width: 840px" clearable :disabled="curChangeType == 'detail'"></el-input>
        </el-form-item>
      </div>
      <div>
        <el-form-item label="党员档案所在单位:" prop="unit">
          <el-input v-model="formData.unit" placeholder="请输入党员档案所在单位" style="width: 840px" clearable :disabled="curChangeType == 'detail'"></el-input>
        </el-form-item>
      </div>
      <div class="show-flex-box-r">
        <el-form-item label="是否为第一书记:" prop="is_first">
          <el-radio-group v-model="formData.is_first" style="width: 380px;" :disabled="curChangeType == 'detail'">
            <el-radio :label="2"><span style="color:#606266">是</span></el-radio>
            <el-radio :label="1"><span style="color:#606266">否</span> </el-radio>
          </el-radio-group>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>
<script>
import getDepartmentSelect from "@/components/base/formModel/tree/get-department-select-tree";
import getSelectDictionaries from "@/components/base/formModel/select/get-select-dictionaries";
import getPositionList from "@/components/base/formModel/select/get-position-list";
import getPartyOrgSelectTree from "@/components/base/formModel/tree/get-party-org-select-tree";
export default {
  components: {
    getDepartmentSelect,
    getSelectDictionaries,
    getPositionList,
    getPartyOrgSelectTree
  },
  props: {
    curChangeType: {
      type: String,
      default: "add",
    },
  },
  data() {
    return {
      provinceOptions:[],
      politicalOptions:[
        { value: "群众", name: "群众" },
        { value: "团员", name: "团员" },
        { value: "党员", name: "党员" },
        { value: "预备党员", name: "预备党员" },
        { value: "入党积极份子", name: "入党积极份子" },
      ],
      formData: {
        // id: '',
        user_id: "",
        name: "",
        idcode: "",
        sex: "",
        nation: "",
        birthday: "",
        age: "",
        school: "",
        major: "",
        top_education: "",
        organ_id: "",
        join_party: "",
        positive_party: "",
        type: "",
        hometown: "",
        phone: "",
        live_temp_adrress: "",
        account_area: "",
        job_names: "",
        position_leave: "",
        position: "",
        unit: "",
        is_first: "",
      },
      rules: {
        user_id: [
          {
            required: true,
            message: "请选择姓名",
            trigger: "change",
          },
        ],
        idcode: [
          {
            required: true,
            message: "请输入身份证号",
            trigger: "change",
          },
        ],
        sex: [
          {
            required: true,
            message: "请选择性别",
            trigger: "change",
          },
        ],
        nation: [
          {
            required: true,
            message: "请输入民族",
            trigger: "change",
          },
        ],
        birthday: [
          {
            required: true,
            message: "请选择出生日期",
            trigger: "change",
          },
        ],
        top_education: [
          {
            required: true,
            message: "请输入学历",
            trigger: "change",
          },
        ],
        organ_id: [
          {
            required: true,
            message: "请选择所在党支部",
            trigger: "change",
          },
        ],
        join_party: [
          {
            required: true,
            message: "请选择加入党组织日期",
            trigger: "change",
          },
        ],
        type: [
          {
            required: true,
            message: "请选择人员类别",
            trigger: "change",
          },
        ],
        phone: [
          {
            required: true,
            message: "请输入手机号",
            trigger: "change",
          },
        ],
        live_temp_adrress: [
          {
            required: true,
            message: "请输入现居住地址",
            trigger: "change",
          },
        ],
        job_names: [
          {
            required: true,
            message: "请选择工作岗位",
            trigger: "change",
          },
        ],
        // c_accident_address: [
        //   {
        //     required: true,
        //     message: "请输入事故地点",
        //     trigger: "change",
        //   },
        // ],
      },
      isFirstLoad: true
    };
  },
  mounted() {},
  methods: {
    // 初始化数据
    resetData() {
      // 清空部门选中
      // this.$refs.carcodeTree.onClear();
      // this.$refs.vehicleTree.onClear();
      // this.$refs.lineTree.onClear();
      this.$refs.personalTree.onClear();
      this.$refs["formData"].resetFields();
      this.isFirstLoad = true;
    },
    //选择出生日期 
    selectedBirthday(val) {
      console.log(val);
      let pamras = {
        birth_day: val
      }
      this.$client.getRelatedAge(pamras)
      .then(res => {
        // console.log(res)
        if(res.head.result == '200') {
          this.formData.age = res.context;
        }else{
          this.$message({type: 'error', message: '获取年龄失败'})
        }
      })
    },
    // 选择人员带出人员基本信息
    selectedPartyMembers(val,node) {
      console.log(val,node)
      if(this.curChangeType != 'add' && this.isFirstLoad) {
        this.isFirstLoad = false;
        return
      }else{
        this.isFirstLoad = false;
      }
      // if(this.isFirstLoad) {

      // }
      if(val && val.length && !this.isFirstLoad) {
        let parmas = {
          id: val[0]
        }
        this.$client.getEmployeeManageDetail(parmas).then((res) => {
          if (res.head.result == "200") {
            // console.log(res)
            let staffInfo = res.context;
            if(staffInfo) {
              this.formData.name = staffInfo.name || '';
              this.formData.job_names = staffInfo.job_names|| '';
              this.formData.idcode = staffInfo.id_card || '';
              this.formData.sex = staffInfo.gender == 0 ? '男' : '女' 
              this.formData.nation = staffInfo.nation || '';
              this.formData.birthday = staffInfo.date_of_birth || '';
              this.formData.age = staffInfo.age || '';
              this.formData.school = staffInfo.qrz_byyx || '';
              this.formData.major = staffInfo.qrz_sxzy || '';
              this.formData.top_education = staffInfo.qrz_xl || '';
              this.formData.hometown = staffInfo.native_place || '';
              this.formData.phone = staffInfo.phone || '';
              this.formData.join_party = staffInfo.rd_time || '';
              this.formData.live_temp_adrress = staffInfo.current_address || '';
              this.formData.account_area = staffInfo.hj_address || '';
              this.$nextTick(() => {
                this.$refs.formData.clearValidate();
              })
            }
            this.$message({
              showClose: true,
              message: successrMessage,
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
      }
    },
    // 选择党组织
    selectPartyOrg(value, node) {
      console.log(value, node)
      this.sendRelevance();
    },
    // 选择入党时间算出一年后的转为正式党员时间
    selectedJoinTime(val) {
      this.formData.positive_party = String(Number(this.formData.join_party.slice(0,4))+1) + this.formData.join_party.slice(4)
    },
    // 数据回显
    setData(val) {
      // console.log(val,'sj')
      let info = {...val}
      for (const key in this.formData) {
        if (Object.hasOwnProperty.call(info, key)) {
          // const element = this.formData[key];
          this.formData[key] = info[key]
        }
      }
    },
    // 发送关联信息
    sendRelevance() {
      this.$emit('send-relevance', this.formData)
    },
    // 给父级页面提供得获取本页数据
    getData() {
      return new Promise((resolve, reject) => {
        this.$refs["formData"].validate((valid) => {
          if (!valid) {
            reject({
              result: 400,
              msg: '获取失败,带星号的为必填项'
            });
            return;
          }
          resolve({
            formData: this.formData,
            result: 200,
            msg: "获取成功",
          });
        });
      });
    },
    
  },
};
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
.base-info /deep/ .el-date-editor {
  width: 180px;
}
.base-info /deep/.el-select,.el-select--mini {
  width: 180px;
}
.base-info /deep/ .el-input,.el-input--mini{
  width: 180px;
}

.base-info /deep/ .el-textarea {
  width: 605px;
}
.base-info /deep/ .el-form-item__label {
  font-size: 12px !important;
}



</style>
