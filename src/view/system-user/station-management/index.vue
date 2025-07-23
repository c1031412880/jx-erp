<template>
  <div class="station-management">
    <sub-req
      ref="head"
      @on-add="openAddPage"
      @on-ok="onSubmit"
      @delete-Job="bacthDelete"
      @on-export="onExport"
    ></sub-req>
    <tr-table
      ref="trTable"
      :selectionShow="true"
      :data="data"
      :tableHeaderList="canRendererTableHeader"
      :isShowBottomOptions="false"
      :TableHeight="TableHeight"
      :loading="loading"
      :frontFixedNum="frontFixedNum"
      :backFixedNum="backFixedNum"
      @on-select-change-row="selectedUpkeepPlanList"
      :isFixedEmptyPlaceholder="false"
    >
      <template slot-scope="scope" slot="operation">
          <!-- <el-button type="primary" size="mini" @click="editRowInfo(scope.data)" v-if="$isPowerShow('edit')">编辑</el-button>
          <el-popconfirm
            @confirm="deleteRowInfo(scope.data)"
            title="确定删除此条记录吗？"
            v-if="$isPowerShow('del')">
            <el-button slot="reference" type="danger" size="mini">删除</el-button>
          </el-popconfirm> -->
          <el-button type="primary" size="mini" @click="checkMap(scope.data)">查看地图</el-button>
      </template>
    </tr-table>

    <el-pagination
      style="margin: 5px 0;display:flex; justify-content: flex-end;"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
      ref="paginationH"
      :current-page="pageInfo.pageIndex"
      :page-sizes="[10, 20, 30, 40, 50, 100]"
      :page-size="pageInfo.pageSize"
      layout="total,sizes, prev, pager, next, jumper"
      :total="pageInfo.pageCount"
    >
    </el-pagination>

    <div class="map-group">
      <map-dom ref="map"></map-dom>
    </div>

    <information-dialog
      ref="informationDialog"
      :dialogBool.sync="informationDialogShow"
      :curSelecedType="curSelecedType"
      :title="informationDialogTitle"
      @save-add-edit-job="saveAddEditJob"
    ></information-dialog>

    <custom-setting
      :dialogBool.sync="customSettingVialogVisible"
      :customSettingList="customSettingList"
      :canRendererTableHeader="canRendererTableHeader"
      :customSettingShowList="customSettingShowList"
      :frontFixedNum="frontFixedNum"
      :backFixedNum="backFixedNum"
    ></custom-setting>
  </div>
</template>

<script type="text/ecmascript-6">
import subReq from "./component/sub-req";
import informationDialog from "./component/information-dialog";
import mapDom from "@/components/base/maps/map";
export default {
  name: "station-management",
  components: {
    subReq,
    informationDialog,
    mapDom
  },
  data() {
    return {
      pageInfo: {
        pageIndex: 1,
        pageSize: 20,
        pageCount: 0,
      },
      form: {},
      data: [],
      loading: false,
      TableHeight: 500,
      informationDialogShow: false,
      customSettingVialogVisible: false,
      curSelecedType: "",
      informationDialogTitle: "添加",
      drawerdialogVisible: false,
      customSettingList: [
        {
          id: 1,
          label: "场站编号",
          prop: "id",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: false,
        },
        {
          id: 2,
          label: "场站名称",
          prop: "name",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: false,
        },
        {
          id: 3,
          label: "场站类型",
          prop: "type",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: false,
        },
        {
          id: 4,
          label: "场站功能",
          prop: "SimpleName",
          width: "130",
          align: "center",
          signIndex: 3,
          sortable: false,
        },
        {
          id: 5,
          label: "所属组织",
          prop: "SimpleName",
          width: "130",
          align: "center",
          signIndex: 4,
          sortable: false,
        },
        {
          id: 6,
          label: "中心区域经度",
          prop: "lon",
          width: "130",
          align: "center",
          signIndex: 5,
          sortable: false,
        },
        {
          id: 7,
          label: "中心区域纬度",
          prop: "lat",
          width: "130",
          align: "center",
          signIndex: 6,
          sortable: false,
        },
        {
          id: 8,
          label: "使用状态",
          prop: "use_Status",
          width: "130",
          align: "center",
          signIndex: 7,
          sortable: false,
        },
        {
          id: 9,
          label: "地址",
          prop: "address",
          width: "130",
          align: "center",
          signIndex: 8,
          sortable: false,
        },
        {
          id: 10,
          label: "产权归属",
          prop: "property",
          width: "130",
          align: "center",
          signIndex: 9,
          sortable: false,
        },
        {
          id: 11,
          label: "占地面积",
          prop: "area_Covered",
          width: "130",
          align: "center",
          signIndex: 10,
          sortable: false,
        },
        {
          id: 12,
          label: "停车面积",
          prop: "stopveh_Area",
          width: "130",
          align: "center",
          signIndex: 11,
          sortable: false,
        },
        {
          id: 13,
          label: "房屋建筑面积",
          prop: "house_Area",
          width: "130",
          align: "center",
          signIndex: 12,
          sortable: false,
        },
        {
          id: 14,
          label: "停车位数量",
          prop: "parking_Space",
          width: "130",
          align: "center",
          signIndex: 13,
          sortable: false,
        },
        {
          id: 15,
          label: "发车位数量",
          prop: "parking",
          width: "130",
          align: "center",
          signIndex: 14,
          sortable: false,
        },
        {
          id: 16,
          label: "关联线路",
          prop: "line_Name",
          width: "130",
          align: "center",
          signIndex: 15,
          sortable: false,
        },
        {
          id: 17,
          label: "关联客流设备id",
          prop: "equipment",
          width: "150",
          align: "center",
          signIndex: 16,
          sortable: false,
        },
        {
          id: 18,
          label: "操作",
          prop: "operation",
          width: "140",
          align: "center",
          signIndex: 17,
          sortable: false,
        },
      ],
      frontFixedNum: 1, //前几行固定
      backFixedNum: 1, //后几行固定
      canRendererTableHeader: null,
      customSettingShowList: null,
      filedialogVisible: false,
      selectedIds:[],
    };
  },
  mounted() {
    this.loadData();
    this.$nextTick(() => {
      this.setHead('initialize');
      window.eventOn.$on('view-resize' + this.$route.fullPath, () => {
        this.setHead()
      })
    });
  },
  methods: {
    updateTableHeader(newestTableHeaderList) {
      this.canRendererTableHeader = null;
      this.customSettingShowList = null;
      this.customSettingShowList = newestTableHeaderList;
      this.canRendererTableHeader = newestTableHeaderList.filter(item => item.isSelected).map((sing,index) => {
        let obj = {
          id: index +1,
          label: sing.label,
          prop: sing.prop,
          width: sing.width,
          align: sing.align,
          signIndex: index,
          sortable: sing.sortable,
        }
        return obj
      });
      this.$forceUpdate();
    },
    // 导出
    onExport() {
      let params = Object.assign({},this.form);
      let ids = [ ...this.selectedIds ]
      if(ids.length) {
        params.ids = ids.toString()
      }
      this.$client.ExportSiteStationsStationManage(params)
      .then(res => {
        if(res.head.result == '200') {
          window.location.href = res.context
          this.$message({type: 'success', message: '导出成功'})
        }else{
          this.$message({type: 'error', message: '导出失败'})
        }
      })
    },

    onSubmit(form) {
      this.form = form
      console.log(this.form);
      this.pageInfo.pageIndex = 1;
      this.pageInfo.pageCount = 0;
      this.loadData();
    },
    // 数据加载
    loadData() {
      this.loading = true;
      let params = Object.assign({}, this.form);
      params.page_index = this.pageInfo.pageIndex;
      params.page_size = this.pageInfo.pageSize;
      this.$client.GetSiteStationsStationManage(params)
        .then(res => {
          if (res.head.result == "200") {
            this.loading = false;
            this.data = res.context.list;
            this.pageInfo.pageCount = res.context.total
            if(this.data.length > 0) {
              this.checkMap(this.data[0])
              this.$refs.trTable.$refs.table.setCurrentRow(this.data[0])
            }
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

    // 编辑、添加
    saveAddEditJob(form) {
      let successrMessage = "";
      let parmas = {
        context: form
      };
      if (this.curSelecedType == "add") {
        delete parmas.context.id;
        successrMessage = "添加成功";
      } else {
        successrMessage = "编辑成功";
      }
      this.$client
        .addSysPositionInfo(parmas)
        .then((res) => {
          if (res.head.result == "200") {
            this.loadData();
            this.informationDialogShow = false;
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
        })
        .catch((err) => {});
    },
    // 批量删除
    bacthDelete() {
      if(this.selectedIds.length == 0) {
        this.$message({
          showClose: true,
          message: '请勾选要删除的信息',
          type: "warning",
        });
        return
      }
      this.deleteRowInfo(null);
    },
    restTableList() {
      this.form = {};
      this.pageInfo.pageIndex = 1;
      this.pageInfo.pageCount = 0;
      this.loadData();
    },
    openSettingPageEvent() {
      this.customSettingVialogVisible = true;
    },
    openAddPage(type) {
      this.$message({
        showClose: true,
        message: '如需修改场站信息请到调度系统中修改，该系统暂未开放修改场站功能',
        type: "warning",
      });
      return
      this.curSelecedType = type;
      this.informationDialogTitle = "添加";
      this.informationDialogShow = true;
    },
    // 分页切换事件
    handleCurrentChange(idx) {
      this.pageInfo.pageIndex = idx;
      this.loadData();
    },
    // 切换每页条数
    handleSizeChange(sizes) {
      this.pageInfo.pageIndex = 1;
      this.pageInfo.pageSize = sizes;
      this.pageInfo.pageCount = 0;
      this.loadData();
    },

    selectedUpkeepPlanList(list) {
      this.selectedIds = [];
      list.forEach((item,index) => {
        this.selectedIds.push(item.id)
      });
    },
    
    // 编辑
    editRowInfo(form) {
      this.curSelecedType = "edit";
      this.$refs.informationDialog.form.id = form.id;
      this.$refs.informationDialog.form.c_name = form.c_name;
      this.$refs.informationDialog.form.c_remark = form.c_remark;
      this.informationDialogTitle = "编辑";
      this.informationDialogShow = true;
    },
    // 删除
    deleteRowInfo(info) {
       let params = {
        context: []
      };
      if(!!info) {
        params.context[0] = info.id
      }else{
        params.context = this.selectedIds
      }

      this.$message({
        showClose: true,
        message: '如需删除场站信息请到调度系统中删除，该系统暂未开放删场站功能',
        type: "warning",
      });
      return
      
      this.$client.deleteSysPositionInfo(params)
      .then(res => {
        if (res.head.result == "200") {
          this.loadData();
          this.$message({
            showClose: true,
            message: "删除成功",
            type: "success",
          });
        } else {
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
    // 查看地图
    checkMap(row) {
      // 先清除电子围栏
      this.$refs.map.deleteEnclosure()
        //  [120.213066,30.288735]  
      //                 经度  row.lon   纬度 row.lat
      let lnglatXY = [row.lon,row.lat]  
      // 设计当前中心坐标点 
      // this.$refs.map.addMarker(lnglatXY)
      // 设置设计缩放区域
      this.$refs.map.pickAddress(lnglatXY,18)
      
      let enclosureList = this.bulidEnclosureList(row.anchor)
      // 设置电子围栏
      // [[120.213366,30.294405], [120.207873,30.290996], [120.211778,30.286438],[120.216284,30.290329]]
      this.$refs.map.getEnclosure(enclosureList)
    },
    bulidEnclosureList(anchor) {
      let list = []
      if(!!anchor && anchor.length> 0) {
        anchor.forEach(item => {
          let lnglatList = []
          lnglatList.push(item.offLon)
          lnglatList.push(item.offLat)
          list.push(lnglatList)
        });
      }
      return list
    },
    // 计算表格高度 和初始化表头
    setHead(type) {
      if(type == 'initialize') {
        this.canRendererTableHeader = this.customSettingList;
        this.customSettingShowList = this.customSettingList;
      }
      setTimeout(() => {
        let maxh = this.$el.offsetHeight;
        let th = this.$refs.head.$el.offsetHeight;
        let mapHeight = this.$refs.map.$el.offsetHeight;
        this.TableHeight = maxh - th- mapHeight;
      }, 60);
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.station-management {
  width: 100%;
  height: 100%;
  .map-group{
    padding-top: 20px;
    padding-bottom: 20px;
    width: 100%;
    height: 350px;
  }
}
</style>
