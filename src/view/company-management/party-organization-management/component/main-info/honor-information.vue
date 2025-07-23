<template>
  <div class="claim-settlement" style="height:470px;overflow-x:hidden">
      
      <div class="use-table-record show-flex-box-c" style="margin:0 20px;">
        <span style="margin-bottom:20px; color:#D9001B; font-size: 14px;">注意：请至荣誉墙模块进行新增和修改</span>
        <div class="table">
          <tr-table
            :selectionShow="false"
            :data="recordList"
            :tableHeaderList="canRendererTableHeader"
            :isShowBottomOptions="false"
            :TableHeight="TableHeight"
            :loading="loading"
            :frontFixedNum="1"
            :backFixedNum="0"
          >
            <template slot-scope="scope" slot="pics">
              <span class="show-flex-box-r show-flex-center" v-if="scope.data.pics && scope.data.pics.length > 0">
                <el-image 
                  style="width: 40px; height: 40px"
                  :src="scope.data.pics[0].url" 
                  :preview-src-list="scope.data.pics.map(item => {return item.url})">
                </el-image>
                <span style="color:red">({{scope.data.pics.length}})</span>
              </span>
              <span v-else>暂无荣誉图片</span>
              
            </template>
            <template slot-scope="scope" slot="files">
              <span v-if="scope.data.files && scope.data.files.length > 0">
                <el-dropdown @command="handleCommand">
                  <span class="el-dropdown-link">
                    查看附件预览<i class="el-icon-arrow-down el-icon--right"></i>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item :command="item.url" v-for="(item, index) in scope.data.files" :key="index">{{item.name}}</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </span>
              <span v-else>暂无附件</span>
            </template>
          </tr-table>
        </div>
      </div>

      <el-dialog title="文件预览" :visible.sync="dialogTableVisible" append-to-body width="800px">
        <div class="previewable-content-box" >
          <iframe class="iframe-box"
            v-if="curFilesUrl"
            :src="curFilesUrl"
            frameborder="0"
            ref="iframe"
            allowfullscreen="true" allowtransparency="true"
            scrolling="no"/>
          <el-empty v-else description="暂无文件信息"></el-empty>

        </div>
      </el-dialog>



  </div>
</template>
<script>
export default {
  components: {},
  props: {
    curChangeType: {
      type: String,
      default: "add",
    },
  },
  data() {
    return {
      dialogTableVisible: false,
      canRendererTableHeader: [
        {
          id: 1,
          label: "荣誉类型",
          prop: "ex_honor_name",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: false,
        },
        {
          id: 2,
          label: "荣誉级别",
          prop: "ex_honor_level",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: false,
        },
        {
          id: 3,
          label: "批准机关", 
          prop: "ex_organ",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: false,
        },
        {
          id: 4,
          label: "批准时间",
          prop: "ex_ratify_date",
          width: "165",
          align: "center",
          signIndex: 3,
          sortable: false,
        },
        {
          id: 5,
          label: "荣誉截图",
          prop: "pics",
          width: "130",
          align: "center",
          signIndex: 4,
          sortable: false,
        },
        {
          id: 6,
          label: "附件",
          prop: "files",
          width: "130",
          align: "center",
          signIndex: 5,
          sortable: false,
        },
        {
          id: 7,
          label: "备注",
          prop: "ex_remark",
          width: "130",
          align: "center",
          signIndex: 6,
          sortable: false,
        },
      ],
      TableHeight:380,
      curType: 'add',
      recordList:[],
      loading: false,
      curFilesUrl:'',
      curInfo:{},
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    // 初始化数据
    resetData(){ 
      this.recordList = [];
    },
    // 数据回显
    setData(val){
      this.curInfo = val;
      // console.log(val)
      this.reqListCostAccidentManage()
    },
    // 获取理赔记录
    reqListCostAccidentManage() {
      this.loading = true
      let parmas = {
        organ_id: this.curInfo.id,
      }
      this.$client.ListPartyHonorPartyOrgan(parmas)
        .then(res => {
          if (res.head.result == "200") {
            this.recordList = res.context.list || [];
            // this.recordList[0].pics[0].url = 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'
            // let obj = {
            //   url: 'https://fuss10.elemecdn.com/8/27/f01c15bb73e1ef3793e64e6b7bbccjpeg.jpeg'
            // }
            // this.recordList[0].pics.push(obj)
            this.loading = false
          } else {
            this.loading = false
            this.recordList = [];
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          };
          this.loading = false;
        })
    },
    handleCommand(command) {
      // this.$message('click on item ' + command);
      this.curFilesUrl =  'http://view.xdocin.com/xdoc?_pdf=true&_xdoc=' + command;
      this.dialogTableVisible = true
    }
  
    
  }
}

</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>

  .claim-settlement /deep/ .el-input{
    width: 420px;
  }

  .claim-settlement /deep/ .el-input--mini{
    width: 420px;
  }

  .claim-settlement/deep/ .el-date-editor {
    width: 420px;
  }

  .previewable-content-box{
    width:100%;
    height:550px;
    .iframe-box{
      width: 100%;
      height: calc(100% - 65px);
      padding: 0;
      margin: 0;
      border: none;
    }
  }
</style>

