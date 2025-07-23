<template>
  <div class="tr-vxe-table" :style="{ height: typeof TableHeight === 'number' ? '' : '100%' }">
    <vxe-table
      ref="table"
      :key="tableKey"
      :data="data"
      :height="TableHeight"
      v-loading="loading"
      show-header-overflow
      show-overflow
      :show-footer="footerShow"
      border
      stripe
      align="center"
      size="small"
      style="width: 100%"
      :print-config="tablePrint"
      :scroll-y="{ enabled: true }"
      :footer-method="footerMethodFun"
      :header-cell-style="{
        background: '#EBECF0',
        color: '#333333',
        fontSize: '14px',
        padding: '2px 0px',
        fontWeight: '700',
        borderColor: '#DBDEE2',
        display: 'table-cell',
        verticalAlign: 'middle'
      }"
      :sort-config="{ defaultSort: defaultSort, trigger: 'cell' }"
      :checkbox-config="{ range: true, isShiftKey: true, reserve: isReserve }"
      :menu-config="tableMenu"
      :merge-cells="mergeCells"
      :cell-style="{ fontSize: '12px', padding: '2px 0px' }"
      :column-config="{ resizable: true }"
      :row-config="{
        isCurrent: isCurrent,
        isHover: isHover,
        height: lineHeight,
        keyField: keyField
      }"
      :seq-config="{
        startIndex: pageInfo.pageIndex ? (pageInfo.pageIndex - 1) * pageInfo.pageSize : 0
      }"
      :export-config="{
        columnFilterMethod: columnFilterMethod,
        beforeExportMethod: beforeExportMethod,
        afterExportMethod: afterExportMethod
      }"
      :mouse-config="{ selected: true }"
      :edit-config="
        isCellEdit
          ? { trigger: 'click', mode: 'cell', beforeEditMethod: activeCellMethod }
          : undefined
      "
      @checkbox-all="selectAllChangeEvent"
      @checkbox-change="selectChangeEvent"
      @checkbox-range-end="checkboxRangeEnd"
      @current-change="currentChangeEvent"
      @cell-menu="cellContextMenuEvent"
      @cell-click="cellClickEvent"
      @cell-dblclick="cellDBLClickEvent"
      @menu-click="menuClickEvent"
      :row-class-name="tableRowClassName"
      @resizable-change="resizableChange"
      @keydown="handleKeyDown"
    >
      <vxe-column
        v-if="selectionShow"
        fixed="left"
        type="checkbox"
        field="checkbox"
        width="50"
      ></vxe-column>
      <vxe-column
        v-if="indexShow"
        fixed="left"
        field="seq"
        :align="numberAlign"
        :width="getSeqWidth"
        type="seq"
        title="#"
      ></vxe-column>
      <template v-for="(item, index) in tableHeaderList">
        <vxe-colgroup v-if="item.isGroup" align="center" :title="item.label" :key="`col_${index}`">
          <vxe-column
            v-for="(obj, j) in item.children"
            :key="`col_${index}j${j}`"
            :field="obj.prop"
            :title="obj.label"
            :align="obj.align || 'left'"
            :width="!minWidthShow ? obj.width || '80' : null"
            :min-width="minWidthShow ? obj.width || '80' : null"
            :sortable="obj.sortable"
            :filters="obj.filters ? obj.filters : null"
            :show-overflow="!obj.notTooltip"
            :filter-method="obj.filterMethod ? filterMethod : null"
            :filter-multiple="obj.filterMultiple ? true : undefined"
          >
            <template #header>
              <slot :name="'header-' + obj.prop" :data="obj.label">
                <span>{{ obj.label }}</span>
              </slot>
            </template>
            <template #default="{ row, rowIndex }">
              <slot :name="obj.prop" :data="row" :rowIndex="rowIndex">
                <span>{{ row[obj.prop] }}</span>
              </slot>
            </template>
            <!-- input 筛选框 -->
            <template #filter="{ $panel, column }" v-if="obj.filterMethod">
              <el-input
                size="mini"
                type="type"
                v-for="(option, index) in column.filters"
                :key="index"
                v-model="option.data"
                @input="$panel.changeOption($event, !!option.data, option)"
              />
            </template>
          </vxe-column>
        </vxe-colgroup>
        <vxe-column
          :key="`col_${index}`"
          v-if="!listNoShow[index] && !item.isGroup"
          :field="item.prop"
          :title="item.label"
          :align="item.align || 'left'"
          :width="!minWidthShow ? item.width || '80' : null"
          :min-width="minWidthShow ? item.width || '80' : null"
          :fixed="
            item.fixed ||
            (index < frontFixedNum
              ? 'left'
              : index > tableHeaderList.length - backFixedNum - 1
              ? 'right'
              : '')
          "
          :show-overflow="!item.notTooltip"
          :sortable="item.sortable"
          :filters="item.filters ? item.filters : null"
          :filter-multiple="item.filterMultiple ? true : undefined"
          :filter-method="item.filterMethod ? filterMethod : null"
          :edit-render="isCellEdit ? { autofocus: '.vxe-input--inner' } : undefined"
        >
          <template #header>
            <slot :name="'header-' + item.prop" :data="item.label">
              <span>{{ item.label }}</span>
            </slot>
          </template>

          <template #edit="{ row }" v-if="isCellEdit">
            <vxe-input
              v-model="row[item.prop]"
              type="text"
              @input="e => getCellInput(e, row, item)"
            ></vxe-input>
          </template>
          <template #default="{ row, rowIndex }" v-if="!isCellEdit">
            <slot :name="item.prop" :data="row" :rowIndex="rowIndex">
              <span>{{ row[item.prop] }}</span>
            </slot>
          </template>

          <!-- input 筛选框 -->
          <template #filter="{ $panel, column }" v-if="item.filterMethod">
            <el-input
              size="mini"
              type="type"
              v-for="(option, index) in column.filters"
              :key="index"
              v-model="option.data"
              @input="$panel.changeOption($event, !!option.data, option)"
            />
          </template>
        </vxe-column>
      </template>
    </vxe-table>

    <vxe-pager
      v-if="pageShow"
      :loading="loading"
      :current-page="tablePage.currentPage"
      :page-size="tablePage.pageSize"
      :total="tablePage.totalResult"
      :page-sizes="tablePage.pageSizes"
      :layouts="['PrevPage', 'JumpNumber', 'NextPage', 'FullJump', 'Sizes', 'Total']"
      @page-change="handlePageChange"
    ></vxe-pager>

    <!--  工具箱：导出、设置列属性功能  -->
    <div
      style="margin-top: 10px; position: absolute; right: -5px; top: -10px; z-index: 99"
      v-if="toolsInfo.toolsShow"
    >
      <el-popover placement="left" trigger="hover">
        <el-button
          size="mini"
          type="primary"
          @click="$emit('importExcel')"
          style="padding: 5px"
          v-if="toolsInfo.importShow"
        >
          导入
        </el-button>
        <el-button
          size="mini"
          type="primary"
          @click="$emit('exportExcel')"
          style="padding: 5px"
          v-if="toolsInfo.exportShow"
        >
          导出
        </el-button>
        <el-button
          size="mini"
          type="primary"
          @click="$emit('setColumn')"
          style="padding: 5px"
          v-if="toolsInfo.columnShow"
        >
          设置列属性
        </el-button>
        <el-button
          size="mini"
          type="primary"
          @click="printEvent"
          style="padding: 5px"
          v-if="toolsInfo.printShow"
        >
          打印表格
        </el-button>
        <el-button
          slot="reference"
          size="mini"
          type="primary"
          style="padding: 5px; border-radius: 50%"
        >
          <i class="el-icon-arrow-left"></i>
        </el-button>
      </el-popover>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  name: 'tr-vxe-table',
  props: {
    footerShow: {
      type: Boolean,
      default: false
    },
    footerMethod: {
      type: Array,
      default: () => []
    },
    isValue:{
      type: Boolean,
      default: false
    },
    selectionShow: {
      type: Boolean,
      default: false,
    },
    indexShow: {
      type: Boolean,
      default: true,
    },
    //是否分页
    pageShow: {
      type: Boolean,
      default: false,
    },
    //分页默认配置项
    tablePage: [Array, Object],
    numberAlign: {
      type: String,
      default: 'left',
    },
    pageInfo: {
      type: Object,
      default: () => {
        return { pageIndex: 0, pageSize: 0 }
      },
    },
    data: {
      type: Array,
      default: () => [],
    },
    TableHeight: [Number,String],
    loading: {
      type: Boolean,
      default: false,
    },
    isShowBottomOptions: {
      type: Boolean,
      default: false,
    },
    isCurrent: {
      type: Boolean,
      default: false,
    },
    isHover: {
      type: Boolean,
      default: true,
    },
    minWidthShow: {
      type: Boolean,
      default: true,
    },
    lineHeight: {
      type: Number,
      default: 30,
    },
    // 记录勾选的数据，即使数据变化，只要此id相同，勾选就不会被取消
    keyField: {
      type: String,
      default: '_X_ROW_KEY',
    },
    tableHeaderList: [Array, Object],
    frontFixedNum: {
      type: Number,
      default: 0,
    },
    backFixedNum: {
      type: Number,
      default: 0,
    },
    listNoShow: {
      type: Object,
      default: () => ({}),
    },
    //默认排序
    defaultSort: {
      type: Object,
      default: () => {},
    },
    //右键菜单
    tableMenu: {
      type: Object,
      default: () => {},
    },
    //合并行或列(固定写死的合并方式，例如{row:0,col:1,rowspan: 2,colspan: 0})
    mergeCells:{
      type: Array,
      default: () => [],
    },
    //是否使用 row-class-name 方法
    rowClassNameShow: {
      type: Boolean,
      default: false,
    },
    //是否使用 rowIndex 点击高亮行
    isRowIndex: {
      type: Boolean,
      default: true,
    },
    // 是否保留勾选状态，比如数据被刷新之后还保留之前选中的状态（需要有 row-config.keyField）
    isReserve: {
      type: Boolean,
      default: false,
    },
    //是否使用工具箱
    toolsInfo: {
      type: Object,
      default: () => ({
        toolsShow: false, //是否使用工具箱
        importShow: false, //是否使用导入
        exportShow: false,//是否使用导出
        columnShow: false,//是否使用设置列
        printShow: true,//是否使用打印
      }),
    },
    columnFilterMethodList: {
      type: Array,
      default: () => ['options', 'operation']
    },
    // 是否编辑单元格
    isCellEdit: {
      type: Boolean,
      default: false,
    },

    // 限制单元格的编辑范围
    editCellRowIndexLm: {
      type: Number,
      default: 1,
    },
    editCellColumnIndexLm: {
      type: Number,
      default: 1,
    },
  },
  data() {
    //这里存放数据",
    return {
      tableKey: 0,//表格的唯一key
      visible: false,
      getRowKeys(row) {
        return row.id || row.i_id
      },
      multipleSelection: [],
      curSelectedRowInfo: null,
      rowIndex:'',
      columnIndex:'',
      tablePrint: {
        // 自定义打印的样式示例
        style: `
          .vxe-table {
            color: #000000; // 修改表格默认颜色
            font-size: 12px; // 修改表格默认字体大小
            font-family: "Microsoft YaHei",微软雅黑,"MicrosoftJhengHei",华文细黑,STHeiti,MingLiu; // 修改表格默认字体
          }
          .vxe-table,
          .vxe-table thead th,
          .vxe-table tbody td,
          .vxe-table tfoot td  {
            border-color: #000000; // 修改表格边框颜色
          }
          .vxe-table thead th {
            color: #000000; // 修改表头字体颜色
            font-size: 14px; // 修改表头默认字体大小
          }
          .vxe-table tfoot td {
            color: red; // 修改表尾字体颜色
          }
        `
      },
    }
  },
  computed:{
    //根据数据量自适应序号列宽度
    getSeqWidth(){
      let width = 45;
      let num = this.data.length.toString().length * 5;
      return width + num;
    },
  },
  mounted() {
    if(this.isCellEdit) {
      document.addEventListener('click', this.focusBlurTable);
    }
  },
  deactivated() {
    document.removeEventListener('click', this.focusBlurTable);
  },
  destroyed() {
    document.removeEventListener('click', this.focusBlurTable);
  },
  //方法集合
  methods: {
    // 是否点击了表格
    focusBlurTable(event){
      window.removeEventListener('keydown', this.initKeyboardNavigation);

      //点击了表格
      if(this.$refs.table.$el.contains(event.target)) {
        window.addEventListener('keydown', this.initKeyboardNavigation);
      }
    },
    // 输入框值变化
    getCellInput(ev, row, column){
      this.$emit('getCellInput', ev, row, column);
    },
    // 监听键盘事件
    initKeyboardNavigation(event) {
      if(!this.rowIndex) this.rowIndex = 0;
      if(!this.columnIndex) this.columnIndex = 0;

      let columnList = this.$refs.table.getColumns();
      switch (event.key) {
        case 'ArrowUp':
          if(this.rowIndex > this.editCellRowIndexLm) this.rowIndex--;
          break;
        case 'ArrowDown':
          if(this.rowIndex < this.data.length-1) this.rowIndex++;
          break;
        case 'ArrowLeft':
          if(this.columnIndex > this.editCellColumnIndexLm) this.columnIndex--;
          break;
        case 'ArrowRight':
          if(this.columnIndex < columnList.length-1) this.columnIndex++;
          break;
        default:
          break;
      }
      // this.$refs.table.setSelectCell(this.data[this.rowIndex], columnList[this.columnIndex]);
      this.$refs.table.setEditCell(this.data[this.rowIndex], columnList[this.columnIndex]);
    },
    // 限制单元格的编辑范围
    activeCellMethod ({ row, rowIndex, column, columnIndex }) {
      return rowIndex >= this.editCellRowIndexLm && columnIndex >= this.editCellColumnIndexLm;
    },
    // 单元格合并
    getMergeCellList(columns, data){
      let list = [];
      for (let j = 0; j < columns.length; j++) {
        let jt = columns[j];
        let idx = this.tableHeaderList.findIndex(tt => tt.prop == jt);
        if(idx!=-1){
          if(this.selectionShow) idx++;
          if(this.indexShow) idx++;
          let num = 0;
          for (let i = 0; i < data.length; i++) {
            if(!!data[i + 1] && data[i][jt] == data[i + 1][jt]) {} else {
              list.push({row: num, col: idx, rowspan: i - num + 1, colspan: 0});
              num = i + 1;
            }
          }
        }
      }
      return list;
    },
    // 打印表格
    printEvent () {
      this.$refs.table.print();
    },
    // 导出前事件
    beforeExportMethod() {
      this.$emit('on-before-export')
    },
    // 导出后事件
    afterExportMethod() {
      this.$emit('on-after-export')
    },
    // 导出列筛选
    columnFilterMethod(row) {
      // console.log('导出列表', row.column.property)
      return this.columnFilterMethodList.indexOf(row.column.property) <= -1;
    },
    // 当前表格导出
    exportDataEvent (fileName = '导出', sheetName = 'sheet1', data) {
      const $table = this.$refs.table
      if ($table) {
        $table.exportData({
          filename: fileName,
          sheetName: sheetName,
          data: !!this.pageInfo.pageIndex ? data : undefined, //指定数据
          type: 'xlsx',
          useStyle: true,
          isFooter: this.footerShow,
          isMerge: !!this.mergeCells.length,//支持临时合并的单元格
        })
      }
    },
    footerMethodFun({ columns, data, tableHeaderList}) {
      // console.log('footerMethodFun',columns, data, tableHeaderList);
      return this.footerMethod
      // return [
      //   columns.map((column, columnIndex) => {
      //       if (columnIndex === 0) {
      //         return '合计'
      //       }
      //       if (['one','two','three','four'].includes(column.property)) {
      //           return this.sumNum(data, column.property)
      //       }else if (columnIndex === 6) {
      //           return `${this.countAllAmount(data)}`
      //       }
      //       return null
      //   })
      // ]
    },
    //禁止上下按键滚动表格
    handleKeyDown(ev) {
      if (ev.$event.keyCode === 38 || ev.$event.keyCode === 40) {
        ev.$event.preventDefault();
      }
    },
    //改变key，值刷新列配置
    tableKeyChange(){
      this.tableKey = Math.random();
      // this.$refs.table.refreshColumn();
    },
    //刷新数据
    refreshData(){
      this.$refs.table.reloadData(this.data);
    },
    //筛选操作
    filterMethod ({option, row, column}) {
      if(row[column.field]){
        let str = row[column.field].toString();
        return (str.search(option.data) !== -1);
      }
    },
    // 排序table
    sortTable(field, order){
      this.$refs.table.sort(field, order);
    },
    // 右键菜单选项
    menuClickEvent({ menu, type, row, rowIndex, column, columnIndex, $event }){
      this.$emit('menuClickEvent',{id:menu.code,label: menu.label, meta: menu.meta, data:row});
    },
    //当列宽拖动发生变化时会触发该事件
    resizableChange({ $rowIndex, column, columnIndex, $columnIndex, $event }){
      let num = 0;
      if(this.selectionShow){//判断是否有复选列
        num = num - 1;
      }
      if(this.indexShow){//判断是否有序号列
        num = num - 1;
      }
      this.$emit('resizable-change', column, columnIndex + num);
    },
    //行类名
    tableRowClassName({row, rowIndex}) {
      if(this.rowClassNameShow===true){
        if (row.Lat_abc === 0 || row.Lng_abc === 0) {
          return 'row-back';
        }
      }
      if(this.isRowIndex){
        if(this.rowIndex === rowIndex){
          return 'row-back';
        }
      }
    },
    // 选中行
    currentChangeEvent({ newValue, oldValue, row, rowIndex, $rowIndex, column, columnIndex, $columnIndex, $event }) {
      this.rowIndex = rowIndex;
      this.$emit('current-change', row, column, newValue, oldValue, rowIndex)
    },
    // 右键行
    cellContextMenuEvent({ menu, row, rowIndex, column }) {
      this.rowIndex = rowIndex;
      this.$emit('cell-menu', { menu, row, column })
    },
    // 点击单元格
    cellClickEvent({ row, rowIndex, $rowIndex, column, columnIndex, $columnIndex, triggerRadio, triggerCheckbox, triggerTreeNode, triggerExpandNode, $event }) {
      this.rowIndex = rowIndex;
      this.columnIndex = columnIndex;
      this.$emit('cell-click', {row, rowIndex, $rowIndex, column, columnIndex, $columnIndex, triggerRadio, triggerCheckbox, triggerTreeNode, triggerExpandNode, $event });
    },
    // 全选
    selectAllChangeEvent(e) {
      // console.log(e,'selectAllChangeEvent')
      this.$emit('on-select-row', e.records)
    },
    // 普通复选
    selectChangeEvent(e) {
      // console.log(e,'selectChangeEvent')
      this.$emit('on-select-row', e.records)
    },
    // 拖动区域复选
    checkboxRangeEnd(e){
      this.$emit('on-select-row', e.records);
    },
    // 双击选中行
    cellDBLClickEvent({ row, rowIndex, $rowIndex, column, columnIndex, $columnIndex, $event }) {
      this.$emit('double-click', row, column);
    },
    setCurrent(row, index){
      if(this.rowIndex==index) return;
      this.$refs.table.scrollToRow(row);//把row滚入视图
      if(index || index==0) this.rowIndex = index;
      else this.$refs.table.setCurrentRow(row);//高亮row
    },
    //分页点击事件
    handlePageChange ({ currentPage, pageSize }) {
      this.$emit('page-change', currentPage, pageSize);
    },
    //此方法用于外界选中行
    getRowId(vid, key = 'ID'){
      let index = this.data.findIndex(item=>item[key]===vid);
      if(index==-1) return;
      let item = this.data[index];
      if(!item) return;
      this.rowIndex = index;
      // this.$refs.table.scrollTo(0,index*30);
      this.$refs.table.scrollToRow(item);//把row滚入视图
      this.$refs.table.setCurrentRow(item);//高亮row

    },
    // 取消所有选中行
    handleSelectionChange() {
      this.$refs.table.clearCheckboxRow();
    }
  },
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.tr-vxe-table{
  width 100%
  // position: relative;
  overflow: hidden;
  //background-color: #2d8cf0;
}
/deep/ .row-back {
  background-color: #dfedfd !important;
}
/deep/ .vxe-table--tooltip-wrapper {
  z-index 9999 !important;
}
/deep/.vxe-table--render-default .vxe-body--column.col--selected {
  box-shadow: none !important;
}
</style>
