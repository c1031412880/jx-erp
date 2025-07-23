<template>
  <div class="base-info" :style="`height:${curChangeType == 'detail'?'470':'400'}px; overflow-x: hidden`">
    <el-form
      size="mini"
      :model="formData"
      :rules="rules"
      ref="formData"
      label-width="160px"
    >
      <el-card class="box-card" shadow="hover" style="margin-bottom: 10px;">
          <div slot="header" class="clearfix">
            <span>党组织信息</span>
            <!-- <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button> -->
          </div>
          <div class="show-flex-box-r">
            <el-form-item label="党组织全称：" prop="full_name">
              <el-input v-model="formData.full_name" placeholder="请输入党组织全称" clearable style="width: 830px;" :disabled="curChangeType=='detail'"></el-input>
            </el-form-item>
            <!-- <el-form-item label="单位性质类别:" prop="c_describe">
              <el-input v-model="formData.name" placeholder="请输入单位性质类别" clearable></el-input>
            </el-form-item> -->
          </div>
          <div class="show-flex-box-r">
            <el-form-item label="上级党组织:" prop="parents_id" v-if="formData.parents_id !== 0">
              <!-- <el-input v-model="formData.parents_id" placeholder="请输入上级党组织" clearable></el-input> -->
              <get-party-org-select-tree
                ref="getPartyOrgSelectTree"
                :placeholder="'选择上级党组织'"
                :isShowCheckbox="false"
                v-model="formData.parents_id"
                :isExportMultiple="false"
                :width="'140'"
                :disabled="curChangeType=='detail'"
              >
              </get-party-org-select-tree>
            </el-form-item>
            <el-form-item label="上级党组织:" prop="parent_name" v-else>
              <el-input v-model="formData.parent_name" placeholder="请输入上级党组织" clearable></el-input>
            </el-form-item>
            <el-form-item label="党组织简称：" prop="name">
              <el-input v-model="formData.name" placeholder="请输入党组织简称" :disabled="curChangeType=='detail'" clearable></el-input>
            </el-form-item>
            <el-form-item label="组织成立时间: " prop="setup_date">
              <el-date-picker
                v-model="formData.setup_date"
                value-format="yyyy-MM-dd HH:mm:ss"
                format="yyyy-MM-dd HH:mm:ss"
                type="datetime"
                placeholder="请选择组织成立时间"
                :disabled="curChangeType == 'detail'">
              </el-date-picker>
            </el-form-item>
          </div>

          <div class="show-flex-box-r" v-if="curChangeType != 'add'">
            <el-form-item label="党组织书记:" prop="ex_party_clerk">
              <el-input v-model="formData.ex_party_clerk" placeholder="暂无当前界次党组织书记信息" clearable disabled></el-input>
            </el-form-item>
            <el-form-item label="组织书记身份证号:" prop="ex_party_clerk_idcode">
              <el-input v-model="formData.ex_party_clerk_idcode" placeholder="暂无当前界次党组织书记信息" clearable disabled></el-input>
            </el-form-item>
          </div>

          <div class="show-flex-box-r">
            <el-form-item label="党组织类别:" prop="type">
              <get-select-dictionaries v-model="formData.type" :classKey="'党组织类别'" :placeholder="'党组织类别'" :disabled="curChangeType=='detail'"></get-select-dictionaries>
            </el-form-item>
            <el-form-item label="党组织属地关系:" prop="relation">
              <get-select-dictionaries v-model="formData.relation" :classKey="'党组织属地关系'" :placeholder="'党组织属地关系'" :disabled="curChangeType=='detail'"></get-select-dictionaries>
            </el-form-item>
            <!-- <el-form-item label="党组织所在单位: " prop="c_describe">
              <el-input v-model="formData.name" placeholder="请输入党组织所在单位" clearable ></el-input>
            </el-form-item> -->
            <el-form-item label="党组织所在行政区划:" prop="area">
               <el-cascader
                v-model="selectedValue"
                :options="provinceOptions"
                :props="{ checkStrictly: true, value: 'value', label: 'label', children:'children'}"
                @change="selectedAreaCode"
                :disabled="curChangeType=='detail'"
                clearable></el-cascader>
            </el-form-item>
          </div>
          <div class="show-flex-box-r">
            <!-- <el-form-item label="党组织所在单位性质:" prop="c_describe">
              <el-input v-model="formData.name" placeholder="请输入党组织所在单位性质" clearable></el-input>
            </el-form-item> -->
            <!-- <el-form-item label="党组织所在行政区划:" prop="c_describe">
               <el-cascader
                :options="provinceOptions"
                :props="{ checkStrictly: true }"
                clearable></el-cascader>
            </el-form-item> -->
            <!-- <el-form-item label="通讯地址: " prop="c_describe">
              <el-input v-model="formData.name" placeholder="请输入通讯地址" clearable></el-input>
            </el-form-item> -->
          </div>
          <div class="show-flex-box-r">
            <el-form-item label="通讯地址: " prop="address">
              <el-input v-model="formData.address" placeholder="请输入通讯地址" clearable :disabled="curChangeType=='detail'"></el-input>
            </el-form-item>
            <el-form-item label="是否最强党支部:" prop="strong">
              <el-radio-group v-model="formData.strong" style="width: 180px;" :disabled="curChangeType=='detail'">
                <el-radio :label="2"><span style="color:#606266">是</span></el-radio>
                <el-radio :label="1"><span style="color:#606266">否</span> </el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="是否离退休党组织:" prop="retired">
              <el-radio-group v-model="formData.retired" :disabled="curChangeType=='detail'">
                <el-radio :label="2"><span style="color:#606266">是</span></el-radio>
                <el-radio :label="1"><span style="color:#606266">否</span> </el-radio>
              </el-radio-group>
            </el-form-item>
          </div>
        </el-card>
        <el-card class="box-card" shadow="hover" style="margin-bottom: 10px;">
          <div slot="header" class="clearfix">
            <span>所在单位信息</span>
            <!-- <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button> -->
          </div>
          <div class="show-flex-box-r">
            <el-form-item label="单位名称（全称）：" prop="unit">
              <el-input v-model="formData.unit" placeholder="请输入单位名称（全称）" clearable style="width: 500px;" :disabled="curChangeType=='detail'"></el-input>
            </el-form-item>
            <el-form-item label="单位性质类别:" prop="unit_type">
              <el-input v-model="formData.unit_type" placeholder="请输入单位性质类别" clearable :disabled="curChangeType=='detail'"></el-input>
            </el-form-item>
          </div>
        </el-card>
        <el-card class="box-card" shadow="hover" style="margin-bottom: 10px;">
          <div slot="header" class="clearfix">
            <span>主要联系人</span>
            <!-- <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button> -->
          </div>
          <div class="show-flex-box-r">
            <el-form-item label="党组织联系人：" prop="contact_name">
              <el-input v-model="formData.contact_name" placeholder="请输入党组织联系人" clearable :disabled="curChangeType=='detail'"></el-input>
            </el-form-item>
            <el-form-item label="电话号码: " prop="phone">
              <el-input v-model="formData.phone" placeholder="请输入电话号码" clearable :disabled="curChangeType=='detail'"></el-input>
            </el-form-item>
            <el-form-item label="部门:" prop="department_name">
              <el-input v-model="formData.department_name" placeholder="请输入部门" clearable :disabled="curChangeType=='detail'"></el-input>
            </el-form-item>
          </div>
        </el-card>
    </el-form>
  </div>
</template>
<script>
import {getUser} from '@/utils/auth'
import getSelectDictionaries from "@/components/base/formModel/select/get-select-dictionaries";
import getPartyOrgSelectTree from "@/components/base/formModel/tree/get-party-org-select-tree";
export default {
  components: {
    getSelectDictionaries,
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
      selectedValue:[],
      formData: {
        full_name: "",
        name: "",
        parents_id: "",
        setup_date: "",
        type: "",
        relation: "",
        unit: "",
        unit_type: "",
        area: "",
        address: "",
        strong: "",
        retired: "",
        contact_name: "",
        phone: "",
        department_name: "",

        ex_party_clerk: "",
        ex_party_clerk_idcode: "",

        parent_name: "", //党组织
      },
      rules: {
        full_name: [
          {
            required: true,
            message: "请输入党组织全称",
            trigger: "change",
          },
        ],
        name: [
          {
            required: true,
            message: "请输入党组织简称",
            trigger: "change",
          },
        ],
        parents_id: [
          {
            required: true,
            message: "请选择上级党组织",
            trigger: "change",
          },
        ],

        parent_name: [
          {
            required: true,
            message: "请输入上级党组织",
            trigger: "change",
          },
        ],

        type: [
          {
            required: true,
            message: "请选择党组织类别",
            trigger: "change",
          },
        ],
        relation: [
          {
            required: true,
            message: "请选择党组织属地关系",
            trigger: "change",
          },
        ],
        unit: [
          {
            required: true,
            message: "请输入党组织所在单位",
            trigger: "change",
          },
        ],
        unit_type: [
          {
            required: true,
            message: "请输入党组织所在单位性质",
            trigger: "change",
          },
        ],
        area: [
          {
            required: true,
            message: "请选择党组织所在行政区划",
            trigger: "change",
          },
        ],
        contact_name: [
          {
            required: true,
            message: "请输入党组织联系人",
            trigger: "change",
          },
        ],
        phone: [
          {
            required: true,
            message: "请输入电话号码",
            trigger: "change",
          },
        ],
      },
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    this.provinceOptions = this.$mapDistrict.getData()
    // let userInfo = JSON.parse(getUser());
    // console.log(userInfo)

    // this.formData.i_result_person = Number(userInfo.user_id)
    // console.log(this.formData.i_result_person)
  },
  methods: {
    // 初始化数据
    resetData() {
      this.selectedValue = [];
      this.formData.parents_id = '';
      this.$refs["formData"].resetFields();
    },
    // 选择党组织所在行政区
    selectedAreaCode() {
      if(this.selectedValue.length > 0) {
        this.formData.area = this.selectedValue.slice(-1)[0]
      }
    },
    // 数据回显
    setData(val) {
      console.log(val,'sj')
      for (const key in this.formData) {
        if (Object.hasOwnProperty.call(val, key)) {
          // const element = this.formData[key];
          this.formData[key] = val[key]
        }
      }
      if(val.area) {
        this.selectedValue = this.$mapDistrict.outValues(val.area)
        // console.log(this.$mapDistrict.outValues(val.area))
      }

      if(val.ex_parent_name) {
        this.formData.parent_name = val.ex_parent_name
        // console.log(this.$mapDistrict.outValues(val.area))
      }

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
  width: 170px;
}
.base-info /deep/.el-select,.el-select--mini {
  width: 170px;
}
.base-info /deep/ .el-input,.el-input--mini{
  width: 170px;
}

.base-info /deep/ .el-textarea {
  width: 605px;
}


</style>
