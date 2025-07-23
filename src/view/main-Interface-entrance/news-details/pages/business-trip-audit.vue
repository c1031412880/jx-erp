<template>
  <div class="travel-slip-audit" v-loading="loading">
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
        <el-col :span="12" class="only-show">
          <p>申请人</p>
          <em>{{formData.user_name}}</em>
        </el-col>
        <el-col :span="12" class="only-show">
          <p>申请部门</p>
          <em>{{formData.dept_name}}</em>
        </el-col>
        <el-col :span="12" class="only-show" v-if="!(flowFields.trip_user_names === 3)">
          <p>出差人员</p>
          <em v-if="flowFields.trip_user_names === 1">{{formData.trip_user_names}}</em>
          <user-role-tree 
            v-if="flowFields.trip_user_names === 2" 
            ref="tree" 
            :placeholder="'请选择项目/业务负责人'" 
            :is_contain_emp="true"
            :show_all="true" 
            :func_type="0"
            :isShowCheckbox="true"
            v-model="formData.trip_user_ids"
            @on-change="upDateAudit"></user-role-tree>
        </el-col>
        <el-col :span="12" class="only-show">
          <p>出行方式</p>
          <em>{{formData.str_ways}}</em>
        </el-col>
        <el-col :span="12" class="only-show" v-if="(!!formData.way_ids && formData.way_ids.includes(1) || !!formData.way_ids && formData.way_ids.includes(5)) &&  !(flowFields.vehicle_name === 3)">
          <p>车牌号</p>
          <span v-if="flowFields.vehicle_name === 1">{{formData.vehicle_name}}</span>
          <el-input 
            v-if="flowFields.vehicle_name === 2" 
            size="mini" 
            v-model="formData.vehicle_name"
            @blur="upDateAudit"></el-input>
        </el-col>
        <el-col :span="12" class="only-show">
          <p>总时长(天)</p>
          <em>{{formData.duration}}</em>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" class="only-show">
          <tr-table
            :selectionShow="false"
            :data="formData.trip_details? formData.trip_details: []"
            :tableHeaderList="tableHeaderData"
            :isShowBottomOptions="false"
            :TableHeight="220"
            :frontFixedNum="0"
            :backFixedNum="0"
            :isFixedEmptyPlaceholder="false">
            <template slot-scope="scope" slot="start_date">
             <span>{{setDateTime(scope.data, 'start_date')}}</span>
            </template>
            <template slot-scope="scope" slot="end_date">
             <span>{{setDateTime(scope.data, 'end_date')}}</span>
            </template>
          </tr-table>
        </el-col>
        <el-col :span="24" class="only-show">
          <p>出差事由</p>
          <el-input v-model="formData.trip_reason" autosize type="textarea" class="richText" disabled ></el-input>
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
import UserRoleTree from "@/components/base/formModel/tree/user-role-tree";
export default {
  name: "business-trip-audit",
  components: {
    itemBoxNew,
    titleBoxNew,
    UserRoleTree,
    imageFileUpload,
  },
  data() {
    return {
      timeObj: {
        1: '上午',
        2: '下午'
      },
      formData: {
        id: 0,
        flow_id:0,
        user_ids: [],
        files_list: [],
        thumbnail_imgs: [],
      },
      flowFields: {
        vehicle_name: 1,
        trip_user_names: 1,
      }, //表单字段权限
      tableHeaderData: [
        {
          id: 1,
          label: "出差始发地",
          prop: "start_address",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: false,
        },
        {
          id: 2,
          label: "出差目的地",
          prop: "end_address",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: true,
        },
        {
          id: 3,
          label: "开始时间",
          prop: "start_date",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: false,
        },
        {
          id: 4,
          label: "结束时间",
          prop: "end_date",
          width: "130",
          align: "center",
          signIndex: 3,
          sortable: false,
        },
        {
          id: 5,
          label: "时长(天)",
          prop: "duration",
          width: "130",
          align: "center",
          signIndex: 4,
          sortable: false,
        }
      ],
    };
  },
  props: {
    step_id: '',
    userId: '',
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
    setDateTime(val, type) {
      let day = val[type].slice(0, 10)
      let str = (type === 'start_date' ? val.start_time : val.end_time) === 1 ? '上午' : '下午'
      return day + ' ' + str
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
    // 更新信息
    upDateAudit() {
      if(this.formData.state == 1 && this.formData.user_ids.includes(this.userId)) {
        let params = {
          context: null
        }
        params.context = Object.assign({}, this.formData)
        this.$client.UpdateTripRecord(params).then((req) => {
          if (req.head.result === "200") {
          }
        })
      }
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.travel-slip-audit {
  .head-image {
    position: absolute
    top: 32px;
    right: 38px;
    img {
      height: 98px;
      width: 98px
    }
  }
  .work-processing-sheet{
    width: 100%;
    overflow: hidden;
    .work-processing-sheet-item{
      display:inline-block;
      padding: 0;
      margin: 0 10px 10px 0;
      color: #00a0e9;
      cursor: pointer;
    }
    .work-processing-sheet-item:hover{
      color #57c6ff
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
  .only-show {
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
