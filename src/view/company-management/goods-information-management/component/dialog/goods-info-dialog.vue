<template>
  <el-dialog
    :visible="dialogBool"
    :title="showTitle"
    :before-close="dialogClose"
    width="960px">
    <div class="dialog-div">
      <el-tabs v-model="activeName">
        <el-tab-pane label="物品信息" name="first">
          <goods-info 
            ref="goodsInfo" 
            :curEventType="curEventType"
            :classifyOptions1="classifyOptions1"></goods-info>
        </el-tab-pane>
        <el-tab-pane label="物品领用记录" name="second" v-if="curEventType == 'check'">
          <tr-table
            :data="tableData"
            :loading="loading"
            :TableHeight="TableHeight"
            :backFixedNum="1"
            :tableHeaderList="canRendererTableHeader">
            <template slot-scope="scope" slot="flow_code">
              <el-button type="text" @click="openDetail(scope.data)">{{scope.data.flow_code}}</el-button>
            </template>
          </tr-table>
        </el-tab-pane>
        <el-tab-pane label="入库记录" name="third" v-if="curEventType == 'check'">
          <goods-storage-dialog ref="goodsStorage"></goods-storage-dialog>
        </el-tab-pane>
      </el-tabs>
    </div>
    <span v-if="activeName == 'first' && curEventType != 'check'" slot="footer" class="dialog-footer">
      <el-button size="small" @click="dialogClose">取 消</el-button>
      <el-button size="small" type="primary" @click="saveAssetsInfo">保 存</el-button>
    </span>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import goodsInfo from "../base-info/goods-info";
import goodsStorageDialog from "./goods-storage-dialog/index";
export default {
  components: {
    goodsInfo,
    goodsStorageDialog
  },
  props: {
    dialogBool: Boolean,
    curEventType: { 
      type: String,
      default: 'add'
    },
    classifyOptions1:[Array],//所属类别
  },
  data() {
    return {
      showTitle: '添加',
      activeName: 'first',
      tableData: [],
      loading: false,
      TableHeight: 460,
      canRendererTableHeader: [
        {
          id: 1,
          label: "领用登记类型",
          prop: "create_type_name",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: false,
        },
        {
          id: 2,
          label: "申请人",
          prop: "apply_name",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: false,
        },
        {
          id: 3,
          label: "申请时间",
          prop: "created_date",
          width: "160",
          align: "center",
          signIndex: 2,
          sortable: false,
        },
        {
          id: 4,
          label: "领用数量",
          prop: "count",
          width: "130",
          align: "center",
          signIndex: 3,
          sortable: false,
        },
        {
          id: 5,
          label: "规格型号",
          prop: "model",
          width: "130",
          align: "center",
          signIndex: 4,
          sortable: false,
        },
        {
          id: 6,
          label: "使用人",
          prop: "apply_name",
          width: "130",
          align: "center",
          signIndex: 5,
          sortable: false,
        },
        {
          id: 7,
          label: "使用部门",
          prop: "dept_name",
          width: "130",
          align: "center",
          signIndex: 6,
          sortable: false,
        },
        {
          id: 8,
          label: "审批单号",
          prop: "flow_code",
          width: "160",
          align: "center",
          signIndex: 7,
          sortable: false,
        },
      ]
    }
  },
  watch: {
    dialogBool(bool) {
      if (bool) {
        this.configTitle();
        this.$nextTick(() => {
          this.$refs['goodsInfo'].clearValid();
        })
      }else {
        this.$refs['goodsInfo'].resetData();
        Object.assign(this.$data, this.$options.data());
      } 
    }
  },
  methods: {
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    // 设置dialog标题
    configTitle() {
      switch (this.curEventType) {
        case "check":
          this.showTitle = '查看'
          break;
        case "edit":
          this.showTitle = '编辑'
          break;
        case "add":
          this.showTitle = '新建'
          break;
      }
    },
    // 保存
    saveAssetsInfo() {
      let info = this.$refs.goodsInfo.getData()
      Promise.all([info]).then(res => {
        this.$emit('sure-save-info', res[0].formData)
      }).catch(err => {
        err.target
        err.msg && this.$message.warning(err.msg)
      })
    },
    openDetail(row) {
      let detail_id = 1300, title = '资产领用单'
      this.$router.push({
        path: `/news-details/${row.receive_id}/${title}/${detail_id}`
      })
    },
    // 回显
    setData(val) {
      setTimeout(() => {      
        this.$refs.goodsInfo.setData(val)
        if(this.curEventType == 'check') {
          this.$refs.goodsStorage.setData(val.id)
          let params = {}
          params.id = val.id
          this.$client.GetGoodsAssetsLife(params).then(res => {
            if(res.head.result == "200") {
              this.tableData = res.context
            }else{
              this.$message({
                showClose: true,
                message: res.head.describle,
                type: "error",
              });
            }
          })
        }
      }, 30);
    },
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>