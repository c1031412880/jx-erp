<template>
  <el-dialog
    :visible="dialogBool"
    :title="title"
    :before-close="dialogClose"
    width="900px"
    append-to-body
  >
    <div slot="title">
      <div class="show-flex-box-r" style="height: 50px; background: #f5f5f5f5; padding-left: 15px;">
        <em style="line-height: 50px;" v-if="!!form.date">{{form.date[0]}} {{week}}</em>
      </div>
    </div>
    <div class="el-dialog-div">
      <div class="show-flex-box-c show-flex-center" style="margin-bottom: 10px; font-size: 17px;font-weight: 700;">
        <span style="margin-bottom: 10px;color: #409EFF;">{{userName}}</span>
        <span v-if="deptName">考勤组:&nbsp;{{deptName}}</span>
        <span v-if="kqzTime">{{kqzTime}}</span>
      </div>
       <div class="show-flex-box-c" style="margin-bottom: 10px;">
        <div class="show-flex-box-r" style="justify-content: space-between; padding:10px 20px;">
          <span>今日打卡次数：{{count}}次</span>
          <!-- <span>工时共计：{{total_hour}}分钟</span> -->
          <span>工时共计：{{parseInt(Number(total_hour*60)/60)}}个小时{{parseInt(Number(total_hour*60)%60)}}分钟</span>
        </div>
        <ul class="show-flex-box-c" v-if="data.length > 0">
          <li class="show-flex-box-r" style="margin-bottom: 8px;padding:0px 20px;align-items: center;" v-for="(item,index) in data" :key="index">
            <span style="font-weight: 800">{{item.name}}:&nbsp;&nbsp;</span>
            <span>{{item.start_end}}&nbsp;&nbsp;</span>
            <em>{{item.day}}</em>
          </li>
        </ul>
      </div>
      <tr-table
        :selectionShow="false"
        :data="tableData"
        :tableHeaderList="canRendererTableHeader"
        :isShowBottomOptions="false"
        :TableHeight="TableHeight"
        :loading="loading"
        :frontFixedNum="0"
        :backFixedNum="0"
        :isFixedEmptyPlaceholder="false"
      >
        <template slot-scope="scope" slot="state_name">
          <span :style="`${(scope.data.state == 1 || scope.data.state == 12)? '':'color:#D9001B;cursor: pointer;'}`" @click="updateKqInfo(scope.data)">{{showText(scope.data)}}</span>
        </template>
        <template slot-scope="scope" slot="img_url">
          <el-image 
            style="width: 40px; height: 40px"
            :src="scope.data.img_url" 
            :preview-src-list="[scope.data.img_url]"
            v-if="!!scope.data.img_url ">
          </el-image>
          <span v-else>暂无打卡图片</span>
        </template>
      </tr-table>
    </div>
    <el-dialog
      width="400px"
      title="修改打卡结果"
      :visible.sync="innerVisible"
      append-to-body
      center>
      <div class="show-flex-box-r show-flex-center"  style="height: 80px">
        <el-form
          size="mini"
          :model="updateForm"
          ref="formData"
          label-width="0px"
        >
            <el-form-item label="" prop="">
              <div class="show-flex-box-r" style="align-items:center">
                <el-radio-group v-model="updateForm.state">
                  <el-radio :label="1">正常</el-radio>
                  <el-radio :label="5" v-if="(curSelectInfo.type == 1 && (curSelectInfo.state == 2 || curSelectInfo.state == 3 || curSelectInfo.state == 11 || curSelectInfo.state == 10)) || (curSelectInfo.type == 2 && (curSelectInfo.state == 3 || curSelectInfo.state == 10)) ">缺卡</el-radio>
                  <el-radio :label="2"  v-if="curSelectInfo.type == 1 && (curSelectInfo.state == 5 || curSelectInfo.state == 2 || curSelectInfo.state == 6 || curSelectInfo.state == 11)">迟到</el-radio>
                  <el-radio :label="3" v-if="curSelectInfo.type == 2 && (curSelectInfo.state == 3 || curSelectInfo.state == 5 || curSelectInfo.state == 10)">早退</el-radio>

                </el-radio-group>
                <el-input
                  placeholder="请输入"
                  v-model="updateForm.minutes"
                  clearable
                  style="width: 150px;margin-left: 10px;"
                  oninput="value=value.replace(/[^\d.]/g,'')" @blur="updateForm.minutes = $event.target.value" 
                  v-if="updateForm.state == 2 || updateForm.state == 3"
                  >
                   <template slot="append">分钟</template>
                </el-input>
              </div>
            </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="innerVisible = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="sureUpdate()" size="mini">确 定</el-button>
      </span>
    </el-dialog>

  </el-dialog>
</template>

<script type="text/ecmascript-6">
export default {
  components: {},
  props: {
    dialogBool: Boolean,
    title: {
      type: String,
      default: "详情",
    },
    userName:[String],
    deptName:[String],
    kqzTime:[String],
    curSelecedType: [String],
  },
  mounted() {
  },
  data() {
    return {
      innerVisible:false,
      data: [],
      tableData:[],
      canRendererTableHeader: [
        {
          id: 1,
          label: "考勤时间",
          prop: "ls_time",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: false,
        },{
          id: 2,
          label: "打卡时间",
          prop: "sj_time",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: false,
        },{
          id: 3,
          label: "打卡结果",
          prop: "state_name",
          width: "150",
          align: "center",
          signIndex: 2,
          sortable: false,
        },{
          id: 4,
          label: "打卡地址",
          prop: "address",
          width: "240",
          align: "center",
          signIndex: 3,
          sortable: false,
        },{
          id: 5,
          label: "打卡备注",
          prop: "remark",
          width: "240",
          align: "center",
          signIndex: 4,
          sortable: false,
        },{
          id: 6,
          label: "照片打卡",
          prop: "img_url",
          width: "240",
          align: "center",
          signIndex: 5,
          sortable: false,
        },
      ],
      TableHeight: 380,
      loading: false,
      form:{
        date: '',
        userId: 0,
      },
      showTitle:'',
      week:'',
      count: 0,
      total_hour: 0,
      updateForm:{
        id:'',
        state:'',
        minutes: ''
      },
      curSelectInfo:{}, //当前点中的行
    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        Object.assign(this.$data, this.$options.data());
      }else{
        this.$nextTick(() => {
          // this.reqBusRequest()
        })
      }
    },
    innerVisible() {
      if(!this.innerVisible) {
        this.updateForm.minutes = ''
        this.updateForm.id = ''
        this.updateForm.state = ''
      }
    }
  },
  methods: {
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    getweekday(date){
      // date例如:'2022-03-05'
      const weekArray = new Array("星期日","星期一", "星期二", "星期三", "星期四", "星期五", "星期六")
      const week  = weekArray[new Date(date).getDay()]
      return week
    },
    setDateInfo() {
      if(!!this.form.date) {
        this.week =  this.getweekday(this.form.date[0])
      }
      // 获取详情
      this.reqKqRequest()
    },
    // state ：状态;0未打卡1正常2迟到3早退4异常打卡5缺卡6外勤打卡
    showText(row) {
      let textStr = ''
      if(!!row.state_name) {
        textStr = row.state_name
      }else{
        switch (row.state) {
          case 0:
            textStr = '未打卡'
            break;
          case 1:
            textStr = '正常'
            break;
          case 2:
            textStr = '迟到' + row.value + '分钟'
            break;
          case 10:
            textStr = '旷工早退' + row.value + '分钟'
            break;
          case 11:
            textStr = '旷工迟到' + row.value + '分钟'
            break;
          case 3:
            textStr = '早退' + row.value + '分钟'
            break;
          case 4:
            textStr = '异常打卡'
            break;
          case 5:
            textStr = '缺卡'
            break;
          case 6:
            textStr = '外勤打卡'
            break;
          case 12:
            textStr = '未加入考勤组'
            break;
        }
      }
      
      return textStr
    },
    // 打卡记录详情
    reqKqRequest() {
      this.loading = true
      let params = {
        user_id: this.form.userId,
        date: this.form.date[0],
      }

      this.$client.DetailKqRecord(params)
      .then(res => {
        if (res.head.result == "200") {
          this.loading = false;
          this.tableData = res.context.oaClockRecords || [];
          this.data =  res.context.responseRests || [];
          this.count = res.context.count;
          this.total_hour = res.context.total_hour
        } else {
          this.loading = false;
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error",
          });
        }
      }).catch(err => {
        this.loading = false;
          this.$message({
          showClose: true,
          message: err.body.message,
          type: "error",
        });
      })
    },
    // 修改考勤信息
    updateKqInfo(row) {
      if(row.state == 12 || row.state == 1) {
        return
      }
      this.curSelectInfo = row
      this.updateForm.id = row.id
      this.innerVisible = true
    },
    // 确定修改
    sureUpdate() {
      if(!this.updateForm.state) {
         this.$message({
            showClose: true,
            message: '请选择修改打卡状态',
            type: "warning",
          });
        return
      }

      if(this.updateForm.state == 1 || this.updateForm.state == 5) {
        this.updateForm.minutes = 0
      }
      if(this.updateForm.state == 2 && !this.updateForm.minutes) {
        this.$message({
          showClose: true,
          message: '请输入迟到的时间',
          type: "warning",
        });
        return
      }
      if(this.updateForm.state == 3  && !this.updateForm.minutes) {
        this.$message({
          showClose: true,
          message: '请输入早退的时间',
          type: "warning",
        });
        return
      }

      this.$client.UpdateClockKqRecord(this.updateForm).then((res) => {
        if (res.head.result == "200") {
          this.reqKqRequest();
          this.curSelectInfo = {};
          this.updateForm.state = '';
          this.updateForm.minutes = '';
          this.updateForm.id = '';
          this.innerVisible = false;
          this.$parent.loadData();
          this.$message({
            showClose: true,
            message: '修改成功',
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
    }
  },
};
</script>
  
<style lang="stylus" rel="stylesheet/stylus" scoped>
.el-dialog__wrapper /deep/ .el-dialog__header{
  padding: 0 !important;
}
.el-dialog__wrapper /deep/ .el-dialog__body{
  padding: 10px 20px !important;
}
.el-dialog-div{
  height: 450px;
  overflow-y: scroll;
}
.el-dialog-div /deep/ .el-input {
  width: 420px;
}
</style>

