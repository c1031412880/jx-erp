<template>
  <div class="veh-tyre-info">
    <el-row :gutter="20">
      <el-col :span="24">
        <div style="float:left;width: 6px;height: 16px; background: #409EFF;"></div>
        <p style="margin-left:15px;margin-bottom:15px;color:#409EFF;font-size:14px;font-weight:bold;">车辆信息</p>
      </el-col>
      <el-col :span="6">
        <span>自编号：</span><span class="text">{{ vehicle_number }}</span>
      </el-col>
      <el-col :span="6">
        <span>车牌号：</span><span class="text">{{ vehicle_name }}</span>
      </el-col>
      <el-col :span="6">
        <span>所属组织：</span><span class="text">{{ dept_name }}</span>
      </el-col>
      <el-col :span="24" style="display: flex;align-items: center;margin: 10px 0;">
        <div style="width: 6px;height: 16px; background: #409EFF;"></div>
        <p style="margin-left:9px;color:#409EFF;font-size:14px;font-weight:bold;">车辆信息</p>
        <el-button  
          style="margin-left:20px;" 
          size="mini" 
          type="primary" 
          v-if="$isPowerShow('install')"
          @click="editInfoDialog({}, 'install2')" 
        >安装轮胎</el-button>
      </el-col>
      <el-col :span="24">
        <tr-table
          :data="data"
          :loading="loading"
          :TableHeight="TableHeight"
          :tableHeaderList="canRendererTableHeader"
          :frontFixedNum="frontFixedNum"
          :backFixedNum="backFixedNum">
          <template slot-scope="scope" slot="operation">
            <el-button 
              type="primary" size="mini" 
              @click="editInfoDialog(scope.data, 'change')"
              v-if="$isPowerShow('change') && scope.data.position_name !== '未安装'">转移</el-button>
            <el-button 
              type="primary" size="mini" 
              @click="editInfoDialog(scope.data, 'install')"
              v-if="$isPowerShow('install') && scope.data.position_name === '未安装'">安装</el-button>
          </template>
        </tr-table>
      </el-col>
    </el-row>

    <install-dialog
      :title="title"
      :dialogBool.sync="installDialogShow"
      :curSelecedType="curSelecedType"
      :vehicleId="vehicle_id"
      @save-change="saveValidateInfo"
      ref="installDialog"></install-dialog>
  </div>
</template>
<script>
import installDialog from './install-dialog';
export default {
  components: {
    installDialog
  },
  data() {
    return {
      vehicle_id: 0,
      vehicle_number: '',
      vehicle_name: '',
      dept_name: '',
      tyre_model_brand: '',
      data: [],
      loading: false,
      TableHeight: 500,
      frontFixedNum: 1,
      backFixedNum: 1,
      title: '转移',
      curSelecedType: 'change',
      installDialogShow: false,
      canRendererTableHeader: [
        {
          id: 1,
          label: "安装位置",
          prop: "position_name",
          width: "130",
          align: "center",
          signIndex: 0,
        },
        {
          id: 2,
          label: "安装日期",
          prop: "install_date",
          width: "160",
          align: "center",
          signIndex: 1,
        },
        {
          id: 3,
          label: "随车里程(km)",
          prop: "total_miles",
          width: "160",
          align: "center",
          signIndex: 2,
        },
        {
          id: 4,
          label: "轮胎编号",
          prop: "code",
          width: "160",
          align: "center",
          signIndex: 3,
        },
        {
          id: 5,
          label: "物料编号",
          prop: "tire_code",
          width: "160",
          align: "center",
          signIndex: 4,
        },
        {
          id: 6,
          label: "物料名称",
          prop: "tire_name",
          width: "160",
          align: "center",
          signIndex: 5,
        },
        // {
        //   id: 7,
        //   label: "规格型号",
        //   prop: "tyre_model_brand",
        //   width: "160",
        //   align: "center",
        //   signIndex: 6,
        // },
        {
          id: 7,
          label: "单价(元)",
          prop: "price",
          width: "160",
          align: "center",
          signIndex: 6,
        },
        {
          id: 8,
          label: "轮胎品牌",
          prop: "brand",
          width: "160",
          align: "center",
          signIndex: 7,
        },
        {
          id: 9,
          label: "关联维修单号",
          prop: "repair_code",
          width: "160",
          align: "center",
          signIndex: 8,
        },
        {
          id: 10,
          label: "备注",
          prop: "remark",
          width: "160",
          align: "center",
          signIndex: 9,
        },
        {
          id: 11,
          label: "操作",
          prop: "operation",
          width: "130",
          align: "center",
          signIndex: 10,
        },
      ],
    };
  },
  methods: {
    resetData() {
      Object.assign(this.$data, this.$options.data());
    },
    // 回显
    setData(val) {
      let info = Object.assign({}, val);
      this.vehicle_id = info.vehicle_id;
      this.vehicle_number = info.vehicle_number;
      this.vehicle_name = info.vehicle_name;
      this.dept_name = info.dept_name;
      this.data = [...info.details]
    },
    // 打开安装转移弹窗
    editInfoDialog(row, type) {
      this.curSelecedType = type;
      this.title = type === 'change' ? '轮胎转移' : '轮胎安装';
      this.installDialogShow = true;
      this.$refs.installDialog.setData(row, type);
    },
    saveValidateInfo(val) {
      let address = this.curSelecedType === 'change' ? val.target_position : val.tyre_vehicle.position;
      let info = this.data.filter(item => item.position === address)[0];
      if(!info) {
        this.saveChangeInstallInfo(val)
        return
      }
      this.$confirm('该位置已有轮胎, 请确定是否拆卸后安装?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			})
				.then(() => {
					this.saveChangeInstallInfo(val)
				})
				.catch(() => {
					this.$message({
						type: 'info',
						message: '已取消撤回'
					})
				})
    },
    // 保存安装转移信息
    saveChangeInstallInfo(info) {
      let obj = {
        'change': 'ChangeTyreManage',
        'install': 'addTyreManage',
        'install2': 'addTyreManage',
      }
      let params = {context: {}}
      params.context = Object.assign({}, info);
      this.$client[obj[this.curSelecedType]](params)
        .then((res) => {
          if (res.head.result == "200") {
            this.installDialogShow = false;
            // 重新加载数据
            // this.loadVehicleTyreInfo();
            this.$emit('update-load')
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
        .catch((err) => {});
    },
    loadVehicleTyreInfo() {
      let params = { vehicle_ids: [this.vehicle_id] }
      this.$client.getByPageTyreManage(params)
        .then((res) => {
          if (res.head.result == "200") {
            let data = res.context.list;
            this.data = data.map((item, index) => {
              return {
                ...item,
                position_name: !item.position ? '未安装' : item.tyre_vehicle_info.position_name,
                install_date: item.tyre_vehicle_info.install_date ? item.tyre_vehicle_info.install_date : ''
              };
            });
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
        })
        .catch((err) => {
            this.$message({
            showClose: true,
            message: err.body.message,
            type: "error",
          });
        });
    },
  }
};
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
.veh-tyre-info {
  .text {
    color: #333;
    font-size: 14px;
    font-weight: 400;
  }
}
</style>