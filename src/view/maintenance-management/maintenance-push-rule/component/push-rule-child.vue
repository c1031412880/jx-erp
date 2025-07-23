<template>
  <div class="push-rule-child">
    <sub-req
      ref="head"
      @on-ok="onSubmit"
      @on-add="onAddRowInfo"
    ></sub-req>
    <tr-table
      :indexShow="false"
      :selectionShow="false"
      :data="data"
      :tableHeaderList="customSettingList"
      :isShowBottomOptions="false"
      :TableHeight="TableHeight"
      :loading="loading"
      :frontFixedNum="frontFixedNum"
      :backFixedNum="backFixedNum">
      <template slot-scope="scope" slot="type">
        <el-select v-model="scope.data.type" clearable placeholder="请选择推送场景">
          <el-option
            v-for="item in pushSceneList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </template>
      <template slot-scope="scope" slot="user_id">
        <!-- <el-select v-model="scope.data.user_id" :loading="selectLoading" collapse-tags multiple clearable placeholder="请选择接收人">
          <el-option
            v-for="item in personList"
            :key="item.i_id"
            :label="item.c_name"
            :value="item.i_id">
          </el-option>
        </el-select> -->
        
        <get-department-select
          ref="personalTree"
          v-model="scope.data.user_id"
          :width="'180'"
          :show_all="true"
          :isShowCheckbox="true"
          :placeholder="'请选择接收人员'"
          :isContainEmp="true"
          :isExportMultiple="true"
          :isCheckStrictly="false"
        ></get-department-select>

      </template>
      <template slot-scope="scope" slot="receive_terminal">
        <el-select v-model="scope.data.receive_terminal" clearable  multiple placeholder="请选择接收方式">
          <el-option
            v-for="item in receiveModeList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </template>
      <template slot-scope="scope" slot="content">
         <!-- <div v-html="scope.data.content"></div> -->
        <div v-if="scope.data.type == 1" v-html="'您有一条新的车辆报修记录<br/>车牌号：自编号【车牌号】<br/>报修类型：【报修类型】'"></div>
        <div v-else-if="scope.data.type == 2" v-html="'您有一条报修记录被退回<br/>车牌号：自编号【车牌号】<br/>报修类型：【报修类型】'"></div>
        <div v-else-if="scope.data.type == 3" v-html="'您有一条新的维修工单记录<br/>工单号：【工单号】<br/>车牌号：自编号【车牌号】'"></div>
        <div v-else-if="scope.data.type == 4" v-html="'您有一条新的新的工单完工申请需要处理<br/>工单号：【工单号】<br/>车牌号：自编号【车牌号】'"></div>
        <div v-else-if="scope.data.type == 5" v-html="'您的工单完工检验未通过<br/>工单号：【工单号】<br/>车牌号：自编号【车牌号】'"></div>
        <div v-else-if="scope.data.type == 6" v-html="'您的工单完工检验已通过<br/>工单号：【工单号】<br/>车牌号：自编号【车牌号】'"></div>
        <div v-else-if="scope.data.type == 7" v-html="'您有一条领料单记录需要处理<br/>领料人：【领料人】<br/>工单号：【工单号】<br/>车牌号：自编号【车牌号】'"></div>
        <div v-else-if="scope.data.type == 8" v-html="'您有一条退料单记录需要处理<br/>退料人：【退料人】<br/>工单号：【工单号】<br/>车牌号：自编号【车牌号】'"></div>
        <div v-else-if="scope.data.type == 9" v-html="'您的车辆已完成维修<br/>车牌号：【车牌号】<br/>报修类型：【报修类型】<br/>报修描述：【报修描述】'"></div>
        <div v-else-if="scope.data.type == 10" v-html="'自编号【车牌号1】自编号【车牌号2】等X辆车【计划保养日期】未执行保养计划，请注意!'"></div>
        <div v-else-if="scope.data.type == 11" v-html="'您的车辆自编号【车牌号】已超计划完工日期还未完工，请注意!'"></div>
        <div v-else-if="scope.data.type == 12" v-html="'车辆自编号【车牌号】工单状态变更为[工单状态]，请注意！'"></div>
        <div v-else></div>
      </template>
      <template slot-scope="scope" slot="enable">
        <el-switch
          v-model="scope.data.enable"
          :active-value="1"
          :inactive-value="2"
          active-color="#409EFF"
          inactive-color="#ff4949"
          disabled>
        </el-switch>
      </template>
    </tr-table>
    <div class="save-reset-btn">
      <el-button type="primary" round @click="onSavePushRule">保 存</el-button>
      <el-button round @click="onResetAllPushRule">重 置</el-button>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import subReq from "./sub-req";
import getDepartmentSelect from "@/components/base/formModel/tree/get-department-select-tree";
export default {
  components: {
    subReq,
    getDepartmentSelect
  },
  data() {
    return {
      form: {},
      data: [],
      loading: false,
      selectLoading: false,
      TableHeight: 500,
      pushSceneList: [
        {value: 1,label: "添加报修",},
        {value: 2,label: "检验未通过",},
        {value: 3,label: "检验通过",},
        {value: 4,label: "完工申请",},
        {value: 5,label: "完工未通过",},
        {value: 6,label: "完工通过",},
        {value: 7,label: "领料单提交",},
        {value: 8,label: "退料单提交",},
        {value: 9,label: "完工后通知分公司机务",},
        {value: 10,label: "保养未执行提醒机务员",},
        {value: 11,label: "超出计划完工日期",},
        {value: 12,label: "工单状态变动",},
      ],
      personList: [],
      receiveModeList: [
        {value: '1',label: "ERP"},
        // {value: '2',label: "企业app"},
        // {value: '3',label: "维修app"},
        {value: '4',label: "短信发送"},
        {value: '5',label: "小程序"},
      ],
      customSettingList: [
        {
          id: 1,
          label: "推送场景",
          prop: "type",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: false,
        },
        {
          id: 2,
          label: "接收人",
          prop: "user_id",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: false,
        },
        {
          id: 3,
          label: "接收方式",
          prop: "receive_terminal",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: false,
        },
        {
          id: 4,
          label: "发送内容",
          prop: "content",
          width: "160",
          align: "left",
          signIndex: 3,
          sortable: false,
        },
        {
          id: 5,
          label: "启用状态",
          prop: "enable",
          width: "80",
          align: "center",
          signIndex: 4,
          sortable: false,
        }
      ],
      frontFixedNum: 0, //前几行固定
      backFixedNum: 0, //后几行固定
    };
  },
  mounted() {
    // this.loadData();
    this.$nextTick(() => {
      this.setHead();
      window.eventOn.$on('view-resize' + this.$route.fullPath, () => {
        this.setHead()
      })
    });
  },
  methods: {
    // 查询
    onSubmit(form) {
      if(!form.shop_id) {
        this.data = []
        this.$message({showClose: true,message: '请选择维修车间',type: "warning",});
        return
      }
      this.form = Object.assign({}, form);
      this.getPersonList()
      this.loadData();
    },
    // 数据加载
    loadData() {
      this.loading = true;
      let params = Object.assign({}, this.form);
      this.$client.GeRuleDataMaintNoticeRule(params)
      .then(res => {
        // console.log(JSON.stringify(res));
        if (res.head.result == "200") {
          res.context.forEach((item) => {
            item.receive_terminal = item.receive_terminal ? item.receive_terminal.split(',') : []
            item.user_id = []
            if(item.details) {
              for(let i = 0; i < item.details.length; i++) {
                item.user_id.push(item.details[i].user_id)
              }
            }
          })
          console.log(res.context);
          this.data = res.context;
          setTimeout(() =>{
            this.loading = false;
          },500)
        } else {
          this.loading = false;
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error",
          });
        }
      }).catch(err => {
        // console.log(err);
           this.loading = false;
          this.$message({
          showClose: true,
          message: err.body.message,
          type: "error",
        });
      })
    },
    // 获取所选择车间的所有人员
    getPersonList() {
      let params = {
        i_id:this.form.shop_id,
        type: 4
      }
      this.selectLoading = true
      this.$client.getMaintainOrgDetail(params)
      .then(res => {
        if (res.head.result == "200") {
          this.personList = res.context.emps     
        } else {
          this.$message({
            showClose: true,
            message: "获取接收人失败",
            type: "error",
          });
        }
        this.selectLoading = false
      })
    },
    // 保存
    onSavePushRule() {
      let params = {}
      params.context = []
      this.data.forEach(item => {
        if(item.id) {
          params.context.push({
            id: item.id,
            type: item.type,
            receive_terminal: item.receive_terminal.join(','),
            enable: item.enable,
            shop_id: this.form.shop_id, 
            details: []
          })
        }else {
          params.context.push({
            type: item.type,
            receive_terminal: item.receive_terminal.join(','),
            enable: item.enable,
            shop_id: this.form.shop_id,
            details: []
          })
        }
      })
      let state = true
      params.context.forEach((item,index )=> {
        for(let key of this.data[index].user_id) {
          item.details.push({
            user_id: key
          })
        }
        if(!item.type || !item.receive_terminal) {
          state = false
          return
        }
      })
      if(!state) {
        this.$message({showClose: true,message: '推送场景和接收方式不能为空!',type: "warning",});
        return false
      }
      this.$client.SaveRulesMaintNoticeRule(params).then(res => {
        if(res.head.result == "200") {
          this.loadData()
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "success",
          });
        } else {
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error",
          });
        }
      })
    },
    // 添加
    onAddRowInfo() {
      if(this.data.length < 12) {
        this.data.push({
          enable: 1,type: '', user_id: [],receive_terminal: []
        })
      }else {
        this.$message({showClose: true,message: '暂只支持12种推送场景',type: "warning",});
      }
    },
    // 重置
    onResetAllPushRule() {
      if(!this.form.shop_id) return
      let params = {}
      params.context = this.form.shop_id
      this.$client.DeleteRulesMaintNoticeRule(params).then(res => {
        if(res.head.result == "200") {
          this.loadData()
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "success",
          });
        } else {
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error",
          });
        }
      })
    },
    // 计算表格高度 和初始化表头
    setHead() {
      setTimeout(() => {
        let maxh = this.$el.offsetHeight;
        let th = this.$refs.head.$el.offsetHeight;
        this.TableHeight = maxh - th - 60;
        console.log(maxh, th, this.TableHeight);
        
      }, 60);
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.push-rule-child {
  width: 100%;
  height: 100%;
  .save-reset-btn {
    margin-top: 20px;
    display: flex;
    justify-content: center;
  }
}
</style>
