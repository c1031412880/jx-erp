<template>
  <div class="v-tree">
    <!-- <el-input placeholder="搜索功能关键字" v-model="filterText" style="margin-bottom: 20px;" size="mini">
       <i slot="prefix" class="el-input__icon el-icon-search"></i>
    </el-input> -->
    <el-tree
      ref="tree"
      :data="manuTree"
      show-checkbox
      :node-key="'c_privilege'"
      :props="defaultProps"
      :default-expanded-keys="expandedKeys"
      :default-checked-keys="expandedKeys"
      :filter-node-method="filterNode"
      :expand-on-click-node="false"
      @check="onCheck"
      >
    </el-tree>

    <!-- <span class="show-flex-box-r show-flex-center" style="margin-top: 100px" v-if="$isPowerShow('save_fuc')">
      <el-button type="primary" size="mini" @click="updatePlaybill()"
        >保 存</el-button
      >
    </span> -->

  </div>
</template>

<script type="text/ecmascript-6">
export default {
  props: {
    curRolePriIds: [Array],
  },
  data() {
    return {
      datalist:[],
      filterText: "",
      manuTree: [
        {
          label: '功能权限菜单',
          children: [
            {
              label: '仓库',
              children: [
                {
                  label: '材料类别',
                  children: [{label: '查看', key: 11001}, {label: '编辑', key: 11002}]
                },
                {
                  label: '物资基本信息',
                  children: [{label: '查看', key: 11101}, {label: '编辑', key: 11102}]
                },
                {
                  label: '供货商',
                  children: [{label: '查看', key: 11201}, {label: '编辑', key: 11202}]
                },
                {
                  label: '物资仓库',
                  children: [{label: '查看', key: 11301}, {label: '编辑', key: 11302}]
                },
                {
                  label: '入库明细',
                  children: [{label: '查看', key: 11401}, {label: '编辑', key: 11402}]
                },
                {
                  label: '出库明细',
                  children: [{label: '查看', key: 11501}, {label: '编辑', key: 11502}]
                },
                {
                  label: '物资领用',
                  children: [{label: '查看', key: 11601}, {label: '编辑', key: 11602}]
                },
                {
                  label: '物资库存量',
                  children: [{label: '查看', key: 11701}, {label: '编辑', key: 11702}]
                },
                {
                  label: '物资收发汇总',
                  children: [{label: '查看', key: 11801}, {label: '编辑', key: 11802}]
                },
                {
                  label: '库存交易',
                  children: [{label: '查看', key: 11901}, {label: '编辑', key: 11902}]
                },
                {
                  label: '物资盘点',
                  children: [{label: '查看', key: 12001}, {label: '编辑', key: 12002}]
                }
              ]
            },
            {
              label: '系统管理',
              children: [
                {
                  label: '角色管理',
                  children: [{label: '查看', key: 70001}, {label: '编辑', key: 70002}]
                },
                {
                  label: '用户管理',
                  children: [{label: '查看', key: 70101}, {label: '编辑', key: 70102}]
                }
              ]
            }
          ]
        }
      ],
      loading: false,
      paneName: 'tree',
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      expandedKeys: [],
      role_id: 0,
      selectedNodeIds:[],
    }
  },
  
  mounted() {
    this.loadData();
  },
  methods:{
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    loadData() {
      this.loading = true;
      this.$client.getPriTree()
      .then(res => {
        // console.log(JSON.stringify(res))
        if (res.head.result == "200") {
          this.manuTree = res.context;
          // debugger
          this.loading = false;
          } else {
            this.loading = false;
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
      }).catch(err => {

      })
    },
    getCheckedKeys () {
      const compact = arr => arr.filter(res=>res!== undefined)
      return compact(this.$refs.tree.getCheckedKeys())
    },
    setCheckedKeys (data) {
      this.$refs.tree.setCheckedKeys(data)
    },
     // 节点多选事件
    onCheck(data, nodes) {
      console.log(data,nodes)
      this.selectedNodeIds = [...nodes.checkedKeys,...nodes.halfCheckedKeys];
      // nodes.checkedNodes.forEach(item => {
      //   if(item.type == 3) {
      //     this.selectedNodeIds.push(item.id)
      //   }
      // });
      // this.$emit("on-check", nodes.checkedNodes, nodes.checkedKeys);
    },
    // 保存
    updatePlaybill() {
      if(this.selectedNodeIds.length < 1) {
         this.$message({
            showClose: true,
            message: "请勾选角色功能权限",
            type: "warning",
          });
        return
      }
      // console.log(this.selectedNodeIds)
      // return
       this.$emit("save-menu-function-authority", this.selectedNodeIds);
    },
    setSelecedCheckedKeys(ids) {
    
      // alert(JSON.stringify(ids))
      this.expandedKeys = ids;
      this.resetChecked();
      if(ids.length == 0){
         this.$refs.tree.setCheckedNodes(this.manuTree)
         return
      }
      setTimeout(() => {
        this.$refs.tree.setCheckedKeys(ids);
      }, 60);
      
      // this.$refs.tree.setCurrentKey(ids[0]);
    },
    // 清除选中
    resetChecked() {
      this.expandedKeys = [];
      this.$refs.tree.setCheckedKeys([]);
    }
  },
  watch:{
    filterText(val) {
      this.$refs.tree.filter(val);
    },
    // curRolePriIds: {
    //   handler(newVal, oldVal) {
    //     this.resetChecked();
    //     this.setSelecedCheckedKeys(this.curRolePriIds);
    //   },
    //   deep: true,
    // },
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .v-tree
    text-align center
    height: 50vh
    overflow: auto
</style>
