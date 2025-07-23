<template>
  <div class="purchase-order-manage">
    <el-tabs v-model="paneActive">
      <el-tab-pane label="全部订单" name="全部订单" lazy v-if="$isPowerShow('all-look')">
        <div :style="{height: `${boxHeight}px`}" v-if="boxHeight">
          <page-index load-key="GetByPagePurchaseOrder">
            <template slot-scope="scope">
              <el-button type="text" size="mini"  @click="routerPush(scope.data)">查看</el-button>
            </template>
          </page-index>
        </div>
      </el-tab-pane>
      <el-tab-pane label="待我处理" name="待我处理" lazy>
        <div :style="{height: `${boxHeight}px`}" v-if="boxHeight">
          <page-index load-key="GetWaitMeByPagePurchaseOrder">
            <template slot-scope="scope">
              <el-button type="text" size="mini"  @click="routerPush(scope.data)">审批</el-button>
            </template>
          </page-index>
        </div>
      </el-tab-pane>
      <el-tab-pane label="我已处理" name="我已处理" lazy>
        <p slot="label">
          我已处理
          <el-dropdown trigger="click"  @command="comSub('GetFinishByPagePurchaseOrder', $event)">
            <span class="el-dropdown-link">
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="3">审核通过</el-dropdown-item>
              <el-dropdown-item command="4">审核拒绝</el-dropdown-item>
              <el-dropdown-item command="2">审核中</el-dropdown-item>
              <el-dropdown-item command="5">已撤销</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </p>
        <div :style="{height: `${boxHeight}px`}" v-if="boxHeight">
          <page-index load-key="GetFinishByPagePurchaseOrder" ref="GetFinishByPagePurchaseOrder">
            <template slot-scope="scope">
              <el-button type="text" size="mini"  @click="routerPush(scope.data)">查看</el-button>
            </template>
          </page-index>
        </div>
      </el-tab-pane>
      <el-tab-pane label="我提交的" name="我提交的" lazy>
        <p slot="label">
          我提交的
          <el-dropdown trigger="click"  @command="comSub('GetSubmitByPagePurchaseOrder', $event)">
            <span class="el-dropdown-link">
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="3">审核通过</el-dropdown-item>
              <el-dropdown-item command="4">审核拒绝</el-dropdown-item>
              <el-dropdown-item command="2">审核中</el-dropdown-item>
              <el-dropdown-item command="5">已撤销</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </p>
        <div :style="{height: `${boxHeight}px`}" v-if="boxHeight">
          <page-index load-key="GetSubmitByPagePurchaseOrder" ref="GetSubmitByPagePurchaseOrder">
            <template slot-scope="scope">
              <el-button type="text" size="mini"  @click="routerPush(scope.data)">查看</el-button>
            </template>
          </page-index>
        </div>
      </el-tab-pane>
      <el-tab-pane label="待提交" name="待提交" lazy>
        <div :style="{height: `${boxHeight}px`}" v-if="boxHeight">
          <page-index load-key="GetNoSubmitByPagePurchaseOrder" :isDel="true" ref="dtjRefs">
            <template slot-scope="scope">
              <el-button type="text" size="mini"  @click="setShow(scope.data)">编辑</el-button>
              <el-popconfirm
                title="确定删除当前草稿么？"
                @confirm="cgTableDel(scope.data)"
              >
                <el-button type="text" size="mini"  slot="reference">删除</el-button>
              </el-popconfirm>
            </template>
          </page-index>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script type="text/ecmascript-6">
import PageIndex from "./component/pageIndex";
export default {
  name: "purchase-order-manage",
  components: {PageIndex},
  data() {
    //这里存放数据
    return {
      boxHeight: 0,
      paneActive: '待我处理'
    }
  },
  mounted() {
    this.$nextTick(() => {
      window.eventOn.$on('view-resize' + this.$route.fullPath, () => {
        this.setHead()
      })
      this.setHead()
    })
  },
  //方法集合
  methods: {
    comSub(ref, state) {
      console.log(ref, state)
      this.$refs[ref].form.state = state
      this.$refs[ref].loadData()
    },
    setHead() {
      let maxh = this.$el.offsetHeight
      this.boxHeight = maxh - 55
      console.log(this.TableHeight)
    },
    // 查看审批跳转
    routerPush(data) {
      let title = `采购订单审批查看`
      this.$router.push({
        path: `/news-details/${data.id}/${title}/${1040}`
      })
    },
    // 删除草稿
    cgTableDel(item) {
      console.log(item)
      this.$client.DeletePurchaseOrder({context: [item.id]}).then(req => {
        if (req.head.result === '200') {
          this.$refs.dtjRefs.loadData()
          this.$message({message: req.head.describle, type: 'success'});
        } else {
          this.$message({message: req.head.describle, type: 'error'});
        }
      })
    },
    // 编辑初始化
    setShow(item) {
      this.$refs.dtjRefs.setShow(item)
    }
  },
}
</script>

<style lang="scss" scoped>
.purchase-order-manage{
  width: 100%;
  height: 100%;
}
</style>
