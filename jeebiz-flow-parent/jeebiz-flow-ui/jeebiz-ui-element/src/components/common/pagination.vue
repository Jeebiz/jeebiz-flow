<!-- 分页查询
<pager-query :pager=[分页对象] @query=[列表查询方法] />
-->

<template>
  <div class="mod-paging-query fn-clear" style="background: #fff">
    <el-pagination
      class="fn-right"
      layout="total, sizes, prev, pager, next, jumper"
      :total="pager.total"
      :current-page.sync="pager.pageNo"
      :page-size="pager.limit"
      :page-sizes="[10, 15, 30, 50]"
      @size-change="onChangeSize"
      @current-change="onChangePage">
    </el-pagination>
    <span v-if="refresh" class="btn-refresh fn-right" title="刷新" @click="$emit('query')">
      <i class="fas fa-redo"></i>
    </span>
  </div>
</template>

<script>
  export default {
    name: 'PagingQuery',
    props: {
      pager: {
        type: Object,
        required: true,
      },
      refresh: {
        type: Boolean,
      },
      props: {
        type: Object,
        required: false,
        default: () => ({
          pageNo: 'pageNo',   // 第几页
          limit: 'limit',   // 显示条数
          total: 'total', // 总记录条数
        }),
      },
    },
    // 设置绑定参数
    model: {
      prop: 'pager',
      event: 'setPager',
    },
    // computed: {
    //   total() {
    //     return this.pager[this.props.total] || 0;
    //   },
    //   // 检测获取到的数据是否为空
    //   isEmptyList() {
    //     return Math.ceil(this.pager[this.props.total] / this.pager[this.props.rows]) < this.pager[this.props.page];
    //   },
    // },
    // watch: {
    //   total() {
    //     // 存在记录但未获取到数据时, 重新请求
    //     if (this.pager[this.props.page] > 1 && this.isEmptyList) {
    //       this.$emit('setPager', Object.assign(this.pager, {
    //         [this.props.page]: this.pager[this.props.page] - 1,
    //       }));
    //       this.$emit('query');
    //     }
    //   },
    // },
    methods: {
      // 每页条数
      onChangeSize(rows) {
        const temp = {
          [this.props.limit]: rows,
          // 当显示条数小于或等于总条数时，重置页数
          [this.props.pageNo]: rows <= this.total ? 1 : this.pager[this.props.pageNo],
        };

        this.$emit('setPager', Object.assign(this.pager, temp));
        // 触发父组件查询请求
        this.$emit('query');
      },
      // 翻页
      onChangePage(page) {
        this.$emit('setPager', Object.assign(this.pager, { [this.props.pageNo]: page }));
        this.$emit('query');
      },
    },
  };
</script>
