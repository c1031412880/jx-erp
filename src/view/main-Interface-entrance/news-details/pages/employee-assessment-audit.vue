<template>
  <div class="monthly-work-audit" v-loading="loading">
    <div class="head-image">
      <img :src="require('../../launch-affair/component/tableData/img/zhang1.png')" v-if="formData.state === 2" alt="">
      <img :src="require('../../launch-affair/component/tableData/img/zhang2.png')" v-if="formData.state === 4" alt="">
      <img :src="require('../../launch-affair/component/tableData/img/zhang3.png')" v-if="formData.state === 3" alt="">
    </div>
    <title-box-new :title="formData.title">
      <div class="head-content">
        <p style="color: #BBBBBB;">审批编号:{{formData.flow_code}}</p>
        <p :style="{'color': outColor(formData.state)}">
          {{formData.state === 0  ? '发起审批' : formData.state_name}}
        </p>
      </div>
    </title-box-new>
    <item-box-new title="基本信息">
      <el-row :gutter="20">
        <el-col :span="12">
          <p>经办人</p>
          <em>{{formData.user_name}}</em>
        </el-col>
        <el-col :span="12">
          <p>所在部门</p>
          <em>{{formData.dept_name}}</em>
        </el-col>
        <el-col :span="12">
          <p>被考核人姓名</p>
          <em>{{formData.check_user_name}}</em>
        </el-col>
        <el-col :span="12">
          <p>被考核人部门（分公司）</p>
          <em>{{formData.check_dept_name}}</em>
        </el-col>
        <el-col :span="24" v-if="!(flowFields.task_finish === 3)">
          <p>工作任务完成情况</p>
          <el-input autosize type="textarea" class="richText" disabled v-model="formData.task_finish" v-if="flowFields.task_finish === 1"></el-input>
          <el-input autosize type="textarea" v-model="formData.task_finish" placeholder="请输入工作任务完成情况" v-if="flowFields.task_finish === 2" @change="changeInputContent"></el-input>
        </el-col>
        <el-col :span="24" v-if="!(flowFields.respect_situation === 3)">
          <p>尊章守纪情况</p>
          <el-input autosize type="textarea" class="richText" disabled v-model="formData.respect_situation" v-if="flowFields.respect_situation === 1"></el-input>
          <el-input autosize type="textarea" v-model="formData.respect_situation" placeholder="请输入尊章守纪情况" v-if="flowFields.respect_situation === 2" @change="changeInputContent"></el-input>
        </el-col>
        <el-col :span="24" v-if="!(flowFields.opinions === 3)">
          <p>综合评定意见</p>
          <el-input autosize type="textarea" class="richText" disabled v-model="formData.opinions" v-if="flowFields.opinions === 1"></el-input>
          <el-input autosize type="textarea" v-model="formData.opinions" placeholder="请输入综合评定意见" v-if="flowFields.opinions === 2" @change="changeInputContent"></el-input>
        </el-col>
        <el-col :span="12" v-if="!(flowFields.is_competent === 3)">
          <p>是否胜任岗位</p>
          <em v-if="flowFields.is_competent === 1">{{formData.is_competent == 1 ? '是' : '否'}}</em>
          <el-select v-model="form.handling_dept" v-if="flowFields.is_competent === 2" @change="changeInputContent" style="width:100%" placeholder="请选择是否胜任岗位">
            <el-option
              v-for="item in competentList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="12" v-if="!(flowFields.evaluate_id === 3)">
          <p>考评人员签名</p>
          <em v-if="flowFields.evaluate_id === 1">{{formData.evaluate_name}}</em>
          <get-department-select
            v-if="flowFields.evaluate_id === 2"
            ref="personalTree3"
            v-model="form.handling_user"
            :isShowCheckbox="false"
            :placeholder="'请选择考评人员签名'"
            :isContainEmp="true"
            :isExportMultiple="false"
            @on-change="changeInputContent"
          ></get-department-select>
        </el-col>
      </el-row>
      <el-row class="image-box">
        <image-file-upload
          :images="formData.thumbnail_imgs"
          :files="formData.files_list"
          :isShowBox="false"></image-file-upload>
      </el-row>
    </item-box-new>
  </div>
</template>

<script type="text/ecmascript-6">
import getDepartmentSelect from "@/components/base/formModel/tree/get-department-select-tree";
import imageFileUpload from "@/components/imageFileUpload/index";
import titleBoxNew from "../component/title-box-new";
import itemBoxNew from "../component/item-box-new";
export default {
  name: "employee-assessment-audit",
  components: {
    itemBoxNew,
    titleBoxNew,
    imageFileUpload,
    getDepartmentSelect,
  },
  mounted() {},
  props: {
    step_id: '',
    userId: '',
    loading:{
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      formData: {
        flow_id:0,
        thumbnail_imgs: [],
        files_list: []
      },
      flowFields: {
        task_finish: 1,
        respect_situation: 1,
        opinions: 1,
        is_competent: 1,
        evaluate_id: 1,
      },
    }
  },
  watch: {
    step_id(id) {
      if(this.formData.user_ids && this.formData.user_ids.includes(this.userId)) {
        this.getFlowFields(id)
      }else {
        Object.assign(this.flowFields, this.$options.data().flowFields)
      }
    },
  },
  methods: {
    // 审批单状态
    outColor(state) {
      switch (state) {
        case 0:
          return '#00ccff'
          break;
        case 1:
          return '#F58A40'
          break;
        case 2:
          return '#0CB780'
          break;
        case 3:
          return '#F2260E'
          break;
        case 4:
          return '#999999'
          break;
      }
    },
    // 获取表单字段控制
     getFlowFields(id) {
      let params = {
        flow_step_id: id
      }
      this.$client.GetFlowFieid(params).then((res) => {
        if (res.head.result == "200") {
          let data = res.context
          let fields = Object.keys(this.flowFields)
          if(data && data.length) {
            data.forEach(item => {
              if(fields.indexOf(item.fieid_code) > -1) {
                this.flowFields[item.fieid_code] = item.type
              }
            })
          }
        }
      }).catch((err) => {});
    },
    // 修改input内容
    changeInputContent() {
      if(this.formData.state) {
        let params = {
          context: {
            form_data: {},
            step_data: null
          }
        }
        params.context.form_data = Object.assign({}, this.formData)
        this.$client.UpdateNewPersonTryCheck(params).then((req) => {})
      }
    },
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.monthly-work-audit {
  .head-image {
    position: absolute
    top: 32px;
    right: 38px;
    img {
      height: 98px;
      width: 98px
    }
  }
  .head-content {
    position: relative
    width: 100%;
    p {
      font-size: 12px;
      font-weight: 400;
      margin-top: 15px
    }
  }
  .el-col {
    margin-bottom: 22px;
    p {
      font-family: Source Han Sans SC-Medium, Source Han Sans SC;
      font-size: 12px;
      font-weight: 400;
      color: #999999;
      margin-bottom: 6px
    }
    em, /deep/ .el-textarea__inner {
      font-size: 14px;
      font-weight: 500;
      color: #333333;
    }
    /deep/ .el-textarea__inner {
      min-height: 60px !important
    }
  }
  .image-box {
    margin-bottom: 0px;
  }

  .richText {
    width: 100%;
    /deep/ {
      .el-textarea__inner {
        background-color: #fff; 
        border: none;
        cursor: auto;
        padding: 0;
      }
    }
  }
}

</style>
