<template>
  <el-dialog
    :visible="dialogBool"
    title="添加待报废车辆"
    :before-close="dialogClose"
    width="760px"
    
  >
    <div class="el-dialog-div show-flex-box-r">
      <el-card class="box-card left-box">
        <div slot="header" class="clearfix">
          <span>选择车辆</span>
        </div>
        <div style="height: 300px">
          <vehicle-tree
            ref="tree"
            v-model="id"
            :isShowCheckbox="true"
            :placeholder="'请输入关键词'"
            @on-check="vehicleCheckNew"
          ></vehicle-tree>
        </div>
         
      </el-card>
      <el-card  class="box-card center-box" ref="centerBox">
        <div slot="header" class="clearfix">
          <span>已选列表{{this.vehicle_list.length}}</span>
          <el-button style="float: right; padding: 3px 0" type="text" @click="onVehicleClear()">清空</el-button>
        </div>
        <tr-table
          :selectionShow="false"
          :data="vehicle_list"
          :tableHeaderList="canRendererTableHeader"
          :TableHeight="290"
          :frontFixedNum="0"
          :backFixedNum="0"
        >
          <template slot-scope="scope" slot="operation">
           <el-button type="danger" size="mini" @click="deleteVehicle(scope.data, scope.index)">删除</el-button>
          </template>
  
        </tr-table>
      </el-card>
    </div>

    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogClose" size="mini">取 消</el-button>
      <el-button type="primary" @click="ok" size="mini">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
  import vehicleTree from '@/components/base/formModel/tree/vehicle-tree.vue'
  export default {
    components: {
      vehicleTree
    },
    props: {
      dialogBool: Boolean,
    },
    data() {
      return {
        id:[],
        vehicle_list: [],
        canRendererTableHeader:[
           {
              id: 1,
              label: "自编号",
              prop: "c_name",
              width: "130",
              align: "center",
              signIndex: 0,
              sortable: true,
            },
            {
              id: 2,
              label: "操作",
              prop: "operation",
              width: "110",
              align: "center",
              signIndex: 1,
              sortable: false,
            },
        ]
      };
    },
    watch: {
      dialogBool(bool) {
        if (bool === false) {
          Object.assign(this.$data, this.$options.data());
        }
      },
    },
    methods: {
      dialogClose() {
        this.$emit("update:dialogBool", false);
      },
      vehicleCheckNew(value, node) {
        console.log(value, node)
        this.vehicle_list = [...[],...node]
        this.$refs.tree.notTypeKey = []
        this.id = value
      },
      deleteVehicle(row,index) {
        this.vehicle_list.splice(index, 1)
        this.$refs.tree.notTypeKey = []
        this.id = this.vehicle_list.map(item => {
          let i_id = item.i_id
          return i_id
        })
      },
      // 清空
      onVehicleClear() {
        this.$refs.tree.notTypeKey = []
        this.id = []
        this.vehicle_list = []
      },
      ok() {
        if(!this.id || this.id.length == 0) {
          this.$message({type: 'warning', message: '请选择添加待报废的车辆'})
          return 
        }
        this.$emit('on-ok', this.id)
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.el-dialog-div {
  width: 100%;
  height: 400px;

  .box-card {
    height: 100%;
    overflow: auto;
  }

  .left-box {
    // flex: 0 0 23vw;
    margin: 0 5px 0 0;
    width: 300px;
    height: 100%;
  }

  .center-box {
    flex: 1;
    height: 100%;
  }
}
.el-dialog-div /deep/ .el-card__header {
    background: #F5F5F5 !important;
  }

</style>
