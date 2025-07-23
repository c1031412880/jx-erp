<template>
  <div class="work-overtime-audit" v-loading="loading">
    <div class="head-image">
      <img :src="require('../../launch-affair/component/tableData/img/zhang1.png')" v-if="formData.state === 2" alt="">
      <img :src="require('../../launch-affair/component/tableData/img/zhang2.png')" v-if="formData.state === 4" alt="">
      <img :src="require('../../launch-affair/component/tableData/img/zhang3.png')" v-if="formData.state === 3" alt="">
    </div>
    <title-box-new :title="`${formData.title + (formData.replace_name ? formData.replace_name : '')}`">
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
          <p>申请人</p>
          <em>{{formData.user_name}}</em>
        </el-col>
        <el-col :span="12">
          <p>所在部门</p>
          <em>{{formData.department}}</em>
        </el-col>
        <el-col :span="12">
          <p>开始日期</p>
          <em>{{formData.start_time}}</em>
        </el-col>
        <el-col :span="12">
          <p>结束日期</p>
          <em>{{formData.end_time}}</em>
        </el-col>
        <el-col :span="24" v-if="!!formData.overTimeDayDetails && !!formData.overTimeDayDetails.length">
          <el-table
            border
            stripe
            highlight-current-row
            :size="'mini'"
            style="width: 100%"
            :row-key="getRowKeys"
            :cell-style="{fontSize: '13px', padding: '2px 0px'}"
            :header-cell-style="{background:'#E0F3FF',color:'#333333',fontSize:'16px',padding: '2px 0px',fontWeight: '700'}"
            :data="formData.overTimeDayDetails">
            <el-table-column
              min-width="180"
              align="center">
              <template slot="header">
                <span style="color:red;">*</span> <span>加班时间</span>
              </template>
              <template slot-scope="scope">
                <span>{{scope.row.over_time}}</span>
              </template>
            </el-table-column>
            <el-table-column
              min-width="180"
              align="center">
              <template slot="header">
                <span style="color:red;">*</span> <span>(小时)</span>
              </template>
              <template slot-scope="scope">
                <span>{{scope.row.hour}}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
        <el-col :span="24">
          <p>加班人员</p>
          <em>{{formData.overtime_user_name}}</em>
        </el-col>
        <el-col :span="12" v-show="!!formData.compensate_name">
          <p>补偿类型</p>
          <em>{{formData.compensate_name}}</em>
          
        </el-col>
        <el-col :span="12" v-if="!(flowFields.hour === 3)">
          <p>时长（小时）</p>
          <em  v-if="flowFields.hour === 1">{{formData.hour}}</em>
          <el-input-number v-else v-model="formData.hour" :controls="false" :precision="2" @change="changeInputContent"></el-input-number>
          <span v-show="formData.compensate == 1" style=" color: #333333; font-size: 14px; font-weight: 500; line-height: 14px;">
            <span>转调休( </span>
            <span style="color: red;">{{ formData.leave_days || 0 }}</span>
            <span> )天</span>
          </span>
        </el-col>
        <el-col :span="24">
          <p>申请事由</p>
          <el-input v-model="formData.reason" autosize type="textarea" class="richText" disabled ></el-input>
        </el-col>
      </el-row>
      <el-row class="image-box">
        <image-file-upload
          :images="formData.thumbnail_imgs"
          :files="formData.files_list"
          :isEdit="formData.user_ids.indexOf(userId) === -1 ? false : true"
          :isShowBox="false"></image-file-upload>
      </el-row>
    </item-box-new>
  </div>
</template>

<script type="text/ecmascript-6">
import itemBoxNew from "../component/item-box-new";
import titleBoxNew from "../component/title-box-new";
import imageFileUpload from "@/components/imageFileUpload/index";

export default {
  name: "work-overtime-audit",
  components: {
    itemBoxNew,
    titleBoxNew,
    imageFileUpload,
  },
  data() {
    return {
      getRowKeys(row){
        return row.over_time
      },
      formData: {
        flow_id: 0,
        user_ids: [],
        thumbnail_imgs: [],
        files_list: []
      },
      flowFields: {
        hour: 1
      },
    };
  },
  props: {
    userId: '',
    step_id: '',
    loading:{
      type: Boolean,
      default: false
    },
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
        this.$client.UpdateOaWorkOvertime(params).then((req) => {})
      }
    },
  },
};
</script>

<style rel="stylesheet/stylus" lang="stylus" scoped>
.work-overtime-audit {
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
  .el-row {
    .el-col {
      margin-bottom: 22px;
    }
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
