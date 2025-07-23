<template>
  <div class="process-info-manage">
    <sub-req
      ref="head"
      @on-add="
        addProcessDialogShow = true
        setType = 'addNewFlowFlowManager'
      "
      @on-ok="onSubmit"
      @on-edit="editVehInfo"
    ></sub-req>
    <tr-table
      ref="trTabelBox"
      :data="data"
      :tableHeaderList="canRendererTableHeader"
      :TableHeight="TableHeight"
      :loading="loading"
      :frontFixedNum="frontFixedNum"
      :backFixedNum="backFixedNum"
    >
      <template slot="type" slot-scope="scope">
        {{ scope.data.type === 1 ? '表单流程' : '固定流程' }}
      </template>
      <template slot="user" slot-scope="scope">
        <el-switch
          v-model="scope.data.user"
          :active-value="1"
          :inactive-value="0"
          active-color="#13ce66"
          inactive-color="#ff4949"
          @change="changeUser(scope.data)"
          :disabled="!$isPowerShow('edit')"
        ></el-switch>
      </template>
      <template slot="operation" slot-scope="scope">
        <el-button
          type="primary"
          size="mini"
          @click="tableSetShow(scope.data)"
          v-if="$isPowerShow('edit')"
        >
          编辑
        </el-button>
        <el-popconfirm
          @confirm="tableDel(scope.data)"
          title="确定删除此条记录吗？"
          v-if="$isPowerShow('del')"
        >
          <el-button slot="reference" type="danger" size="mini">作废</el-button>
        </el-popconfirm>
      </template>
    </tr-table>
    <el-pagination
      style="margin: 5px 0; display: flex; justify-content: flex-end"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
      ref="paginationH"
      :current-page="pageInfo.pageIndex"
      :page-sizes="[10, 20, 30, 40, 50, 100]"
      :page-size="pageInfo.pageSize"
      layout="total,sizes, prev, pager, next, jumper"
      :total="pageInfo.pageCount"
    ></el-pagination>

    <add-process-dialog
      ref="AddProcessDialog"
      @on-publish="ProcessPublish"
      :fieidList="fieidList"
      :dialogBool.sync="addProcessDialogShow"
    ></add-process-dialog>
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
import subReq from './component/sub-req'
import AddProcessDialog from './component/dialog/add-process-dialog'
export default {
  name: "process-manage",
  data() {
    return {
      pageInfo: {
        pageIndex: 1,
        pageSize: 20,
        pageCount: 0
      },
      // 添加addNewFlowFlowManager || 修改updateFlowDataFlowManager
      setType: 'addNewFlowFlowManager',
      form: {},
      data: [],
      loading: false,
      TableHeight: 500,
      informationDialogShow: false,
      addProcessDialogShow: false,
      customSettingVialogVisible: false,
      customSettingList:[
      {
        id: 1,
        label: "流程标题",
        prop: "name",
        width: "130",
        align: "center",
        signIndex:0,
        sortable:true
      },
      {
        id: 2,
        label: "流程类型",
        prop: "type",
        width: "130",
        align: "center",
        signIndex:1,
        sortable:true
      },
      {
        id: 3,
        label: "表单名称/分类名称",
        prop: "object_name",
        width: "130",
        align: "center",
        signIndex:2,
        sortable:true
      },
      // {
      //   id: 4,
      //   label: "启用状态",
      //   prop: "user",
      //   width: "130",
      //   align: "center",
      //   signIndex:3,
      //   sortable:false
      // },
      {
        id: 5,
        label: "操作",
        prop: "operation",
        width: "180",
        align: "center",
        signIndex:3,
        sortable:false
      }
    ],
    frontFixedNum:1, //前几行固定
    backFixedNum:1, //后几行固定
    canRendererTableHeader: null,
    customSettingShowList: null,
    fieidList: []
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.loadData()
      this.getConFlowFieid()
      this.setHead('initialize');
      window.eventOn.$on('view-resize' + this.$route.fullPath, () => {
        this.setHead()
      })
    })
  },
  methods: {
    getConFlowFieid() {
      this.$client.getConFlowFieid().then(res => {
        if (res.head.result === "200") {
          this.fieidList = res.context
        }
      })
    },
    updateTableHeader(newestTableHeaderList) {

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
      this.$forceUpdate()
    },
    openSettingPageEvent() {
      this.customSettingVialogVisible = true;
    },
    editVehInfo(){
      this.informationDialogShow = true
    },
    openfiledialog(){
      this.filedialogVisible = true
    },
    // 分页切换事件
    handleCurrentChange(idx) {
      this.pageInfo.pageIndex = idx
      this.loadData()
    },
    // 切换每页条数
    handleSizeChange(sizes) {
      this.pageInfo.pageIndex = 1;
      this.pageInfo.pageSize = sizes;
      this.pageInfo.pageCount = 0;
      this.loadData();
    },
    // 开关启用状态
    changeUser(row) {
      console.log('row',row);
      this.$client.UpdateFlowManage({context: row}).then(req => {
        if (req.head.result === "200") {
          this.$message.success(req.head.describle);
        } else {
          this.$message.error(req.head.describle);
        }
        this.loadData()
      })
    },
    onSubmit(form) {
      this.form = form;
      this.pageInfo.pageIndex = 1;
      this.pageInfo.pageCount = 0;
      this.loadData()
    },
    // 数据提交
    ProcessPublish(param) {
      let processData = param.processData
      // let loop = data => {
      //   if (data.type === 'condition') {
      //     if (data.properties.conditions) {
      //       for(let i=0,length = data.properties.conditions.length;i < length;i++) {
      //         console.log(typeof data.properties.conditions[i].conditionValue)
      //         data.properties.conditions[i].typeof = typeof data.properties.conditions[i].conditionValue
      //       }
      //     }
      //   }
      // }
      // loop(processData)
      // return false
      let context = {}
      context = param.basicSetting
      context.is_add_check = param.advancedSetting.is_add_check
      context.json_origin = param.processData
      context.json_origin.advancedSetting = param.advancedSetting
      context.json_origin = context.json_origin ? JSON.stringify(context.json_origin) : undefined
      context.behalfs = param.advancedSetting.behalfs ? JSON.parse(JSON.stringify(param.advancedSetting.behalfs)): undefined
      context.is_replace = param.advancedSetting.is_replace
      context.is_same_pass = param.advancedSetting.is_same_pass
      context.is_cancel = param.advancedSetting.is_cancel
      context.cancel_time = param.advancedSetting.cancel_time !==0 ? param.advancedSetting.cancel_time : 7;
      context.cancel_check = param.advancedSetting.cancel_check
      context.is_update_form = param.advancedSetting.is_update_form
      context.form_users = param.advancedSetting.form_users ? JSON.parse(JSON.stringify(param.advancedSetting.form_users)) : undefined;
      if (context.id) {
        this.$client.UpdateFlowManage({context: context}).then(req => {
          this.loadData()
          if (req.head.result === "200") {
            this.$message.success(req.head.describle);
            this.addProcessDialogShow = false
          } else {
            this.$message.error(req.head.describle);
          }
        })
      } else {
        this.$client.AddFlowManage({context: context}).then(req => {
          this.loadData()
          if (req.head.result === "200") {
            this.$message.success(req.head.describle);
            this.addProcessDialogShow = false
          } else {
            this.$message.error(req.head.describle);
          }
        })
      }

    },
    // 数据加载
    loadData() {
      this.form.page_index = this.pageInfo.pageIndex
      this.form.page_size = this.pageInfo.pageSize
      this.form.user = 1
      this.loading = true
      this.$client.GetListFlowManage(this.form).then(req => {
        // console.log(req)
        this.loading = false
          if (req.head.result === '200') {
            this.data = req.context.list
            this.pageInfo.pageCount = req.context.total;
            // this.$refs.trTabelBox.headerDragend()
          } else {
            this.data = []
            this.pageInfo.pageCount = 0
          }
      })
    },
    // 获取所有表单
    getAllForm() {
      return new Promise((resolve,reject) => {
        this.$client.GetFormTypeFlowManage({}).then(req => {
          if (req.head.result === "200") {
            resolve(req)
          }
        });
      })
    },
    // 获取流程分类
    getFlowType() {
      return new Promise((resolve,reject) => {
        this.$client.GetFlowTypeFlowManage({}).then(req => {
          if (req.head.result === "200") {
            resolve(req)
          }
        })
      });

    },
    // 编辑初始化
    tableSetShow(form) {
      // from.flow_type = form.flow_type
      this.setType = 'updateFlowDataFlowManager';
      this.addProcessDialogShow = true
      setTimeout(() => {
        this.$refs.AddProcessDialog.initData({
          formData: JSON.parse(JSON.stringify(form)),
          processData: JSON.parse(form.json_origin)
        });
      }, 300);
      // console.log(form,22222)

    },
    // 数据删除
    tableDel(form) {

      this.$client.UpdateScrapFlowManage({context:[form.id] }).then(req => {
        this.loadData()
        if (req.head.result === "200") {
          this.$message.success(req.head.describle);
        } else {
          this.$message.error(req.head.describle);
        }
      })
    },
    // 计算表格高度
    setHead(type) {
      if(type == 'initialize') {
        this.canRendererTableHeader = this.customSettingList;
        this.customSettingShowList = this.customSettingList;
      }
      setTimeout(() => {
        let maxh = this.$el.offsetHeight
        let th = this.$refs.head.$el.offsetHeight
        this.TableHeight = maxh - (th) - 30
        console.log(this.TableHeight)
      }, 60)
    }
  },
  components: {
    subReq,AddProcessDialog
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.process-info-manage
  width 100%
  height 100%
</style>
