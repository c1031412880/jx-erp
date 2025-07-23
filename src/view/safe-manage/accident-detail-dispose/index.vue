<template>
  <div class="accident-detail-dispose">
    <el-card class="box-card" style="margin-bottom: 20px;">
      <div class="show-flex-box-r" style="justify-content: space-between;align-items: center; margin-bottom:20px;">
        <span style="font-weight: 700;font-size: 18px;">事故详情</span>
        <div>
          <el-button type="primary" size="mini">同意</el-button>
          <el-button type="primary" size="mini">驳回</el-button>
          <el-button type="" size="mini" class="el-icon-arrow-left">返回</el-button>
        </div>
      </div>
      <div style="padding: 0 20px;">
        <el-descriptions title="">
          <el-descriptions-item label="事故编号">kooriookami</el-descriptions-item>
          <el-descriptions-item label="处理流程状态">18100000000</el-descriptions-item>
      </el-descriptions>
      </div>
    </el-card>
    <el-card class="box-card">
      <div style="margin-bottom: 20px;">
        <div class="show-flex-box-r" style="align-items: center; margin-bottom:20px;">
          <i style="float: left; width: 6px; height: 15px; background: #409eff"></i>
          <span style="font-weight: 700;font-size: 15px;margin-left: 12px;">基本信息</span>
        </div>
        <div style="padding: 0 20px;">
          <el-descriptions title="">
            <el-descriptions-item label="自编号">kooriookami</el-descriptions-item>
            <el-descriptions-item label="车牌号">18100000000</el-descriptions-item>
            <el-descriptions-item label="线路">kooriookami</el-descriptions-item>
            <el-descriptions-item label="所属组织">18100000000</el-descriptions-item>
            <el-descriptions-item label="事故驾驶员">kooriookami</el-descriptions-item>
            <el-descriptions-item label="事故责任">18100000000</el-descriptions-item>
            <el-descriptions-item label="事故发生时间">kooriookami</el-descriptions-item>
            <el-descriptions-item label="事故类别">18100000000</el-descriptions-item>
            <el-descriptions-item label="事故类型">kooriookami</el-descriptions-item>
            <el-descriptions-item label="事故地点类别">18100000000</el-descriptions-item>
            <el-descriptions-item label="事故原因">kooriookami</el-descriptions-item>
            <el-descriptions-item label="事故天气 ">18100000000</el-descriptions-item>
            <el-descriptions-item label="事故地点">kooriookami</el-descriptions-item>
            <el-descriptions-item label="事故描述">18100000000</el-descriptions-item>
            <!-- <el-descriptions-item label="事故图片">
          
            </el-descriptions-item> -->
            <!-- <el-descriptions-item label="附件">18100000000</el-descriptions-item> -->
            
          </el-descriptions>
          <div class="list-data-list show-flex-box-r" style="margin-bottom:10px;">
            <span style="font-size: 14px;color: #606266;">事故图片:</span>
            <ul class="list-data" v-for="(item,index) in imagesList" :key="index">
              <li class="item" v-if="item">
                <image-box :src="item" :id="index+1"></image-box>
              </li>
              <!-- <li class="item unchecked" v-else @click="uploadFile()">
                <i class="el-icon-plus" style="font-size: 60px;font-weight: 600;"></i>
              </li> -->
            </ul>
          </div>
          <div class="list-data-list show-flex-box-r">
            <span style="font-size: 14px;color: #606266;height: 100px; margin-right: 10px; flex-shrink: 0;">附件:</span>
            <div v-if="ex_files && ex_files.length" style="flex-grow: 1;">
              <multiple-files-upload :filesList="ex_files" :disabled="true"></multiple-files-upload>
            </div>
            <span v-else style="height: 100px; font-size: 12px; color:#909399">暂无附件</span>
          </div>

        </div>
      </div>
      <div style="margin-bottom: 20px;">
        <div class="show-flex-box-r" style="align-items: center; margin-bottom:20px;">
          <i style="float: left; width: 6px; height: 15px; background: #409eff"></i>
          <span style="font-weight: 700;font-size: 15px;margin-left: 12px;">费用信息</span>
        </div>
        <div style="padding: 0 20px;">
          <el-descriptions title="">
            <el-descriptions-item label="预估费用(元)">kooriookami</el-descriptions-item>
            <el-descriptions-item label="医疗费用(元)">18100000000</el-descriptions-item>
            <el-descriptions-item label="误工费用(元)">kooriookami</el-descriptions-item>
            <el-descriptions-item label="护理费用(元)">18100000000</el-descriptions-item>
            <el-descriptions-item label="伙食费用(元)">kooriookami</el-descriptions-item>
            <el-descriptions-item label="交通费用(元)">18100000000</el-descriptions-item>
            <el-descriptions-item label="实际维修费用(元)">kooriookami</el-descriptions-item>
            <el-descriptions-item label="保险提交金额(元)">18100000000</el-descriptions-item>
            <el-descriptions-item label="保险赔付金额(元)">kooriookami</el-descriptions-item>
            <el-descriptions-item label="他人赔付金额(元)">18100000000</el-descriptions-item>
            <el-descriptions-item label="事故净损失(元)"><span style="color: #D9001B">500.00</span></el-descriptions-item>
          </el-descriptions>
        </div>
      </div>

      <div style="margin-bottom: 20px;" v-for="(item,index) in tableHeaderKey" :key="index">
        <div class="show-flex-box-r" style="align-items: center; margin-bottom:20px;">
          <i style="float: left; width: 6px; height: 15px; background: #409eff"></i>
          <span style="font-weight: 700;font-size: 15px;margin-left: 12px;">{{tableHeaderKeyName[item]}}</span>
        </div>
        <div style="padding: 0 20px;">
          <tr-table
            :selectionShow="false"
            :data="data"
            :tableHeaderList="tableHeaderData[item]"
            :isShowBottomOptions="false"
            :TableHeight="TableHeight"
            :loading="loading"
            :frontFixedNum="0"
            :backFixedNum="0"
          >
          </tr-table>
        </div>
      </div>

      <div style="margin-bottom: 20px;">
        <div class="show-flex-box-r" style="align-items: center; margin-bottom:20px;">
          <i style="float: left; width: 6px; height: 15px; background: #409eff"></i>
          <span style="font-weight: 700;font-size: 15px;margin-left: 12px;">事故处理</span>
        </div>
        <div style="padding: 0 20px;">
          <el-descriptions title="">
            <el-descriptions-item label="事故经办人">kooriookami</el-descriptions-item>
            <el-descriptions-item label="处理日期">18100000000</el-descriptions-item>
            <el-descriptions-item label="处理人">kooriookami</el-descriptions-item>
            <el-descriptions-item label="安全里程">18100000000</el-descriptions-item>
            <el-descriptions-item label="处理意见">kooriookami</el-descriptions-item>
            <el-descriptions-item label="罚款">18100000000</el-descriptions-item>
            <el-descriptions-item label="实际维修费用(元)">kooriookami</el-descriptions-item>
          </el-descriptions>
        </div>
      </div>
      <div style="margin-bottom: 20px;">
        <approve-schedule :flow_id="form.flow_id" :isFlow="true"></approve-schedule>
      </div>
    </el-card>
  
  </div>
</template>

<script type="text/ecmascript-6">
import imageBox from './component/image-box'
import approveSchedule from '@/components/approve-echo/approve-schedule.vue'
import tableHeader from './component/table-header'
import multipleFilesUpload from "@/components/multiple-files-upload";
export default {
  name: "accident-detail-dispose",
  components: {
    imageBox,
    approveSchedule,
    multipleFilesUpload
  },
  data() {
    return {
      form: {},
      data: [],
      loading: false,
      TableHeight: 200,
      drawerdialogVisible: false,
      customSettingList: [
        {
          id: 1,
          label: "岗位名称",
          prop: "c_name",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: false,
        },
        {
          id: 2,
          label: "岗位描述",
          prop: "c_remark",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: false,
        },
        {
          id: 3,
          label: "在职岗位人数",
          prop: "position_count",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: true,
        },
        {
          id: 4,
          label: "涉及部门",
          prop: "ref_org",
          width: "130",
          align: "center",
          signIndex: 3,
          sortable: false,
        },
        {
          id: 5,
          label: "操作",
          prop: "operation",
          width: "140",
          align: "center",
          signIndex: 4,
          sortable: false,
        },
      ],
      form:{
        flow_id:''
      },
      tableHeaderKey:[],
      tableHeaderData:{},
      tableHeaderKeyName:{
        'peopleHurt':'人伤',
        'carDamage': '车损',
        'claimSettlement': '理赔'
      },
      imagesList:['https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg','https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg','https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'],
      ex_files:[
        {id:1,name:'事故责任书', url:''},
        {id:1,name:'事故责任书', url:''},
        {id:1,name:'事故责任书', url:''},
      ]
    };
  },
  mounted() {
    // this.loadData();
    this.tableHeaderData = tableHeader
    this.tableHeaderKey = Object.keys(tableHeader)
    console.log(this.tableHeaderData)
    this.$nextTick(() => {
      this.setHead();
    });
  },
  methods: {

    // 数据加载
    loadData() {
      this.loading = true;
      let params = Object.assign({}, this.form);
      this.$client.getSysPositionList(params)
        .then(res => {
          console.log(JSON.stringify(res));
          if (res.head.result == "200") {
            this.loading = false;
            this.data = res.context.list;
          } else {
            this.loading = false;
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
        }).catch(err => {
           this.$message({
            showClose: true,
            message: err.body.message,
            type: "error",
          });
        })
    },

    // 计算表格高度 和初始化表头
    setHead() {
      setTimeout(() => {
        // let maxh = this.$el.offsetHeight;
        // let th = this.$refs.head.$el.offsetHeight;
        // this.TableHeight = maxh - th - 30;
      }, 60);
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.accident-detail-dispose {
  width: 100%;
  height: 100%;
}

.list-data-list
  // flex-wrap: wrap;
  // align-items: center;
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
