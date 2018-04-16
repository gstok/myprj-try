<style type="less">
    .top {
        margin-top: 12px;
        margin-bottom: 12px;
        .desc {
            float: left;
            margin-left: 20px;
        }
        .page {
            float: right;
        }
    }

    .bottom {
        margin-top: 12px;
        .page {
            float: right;
        }
    }
</style>
<template>
    <div class="gtable">
        <Row class="top">
            <div class="desc">共{{currentTotal}}，已选择{{currentSelectTotal}}</div>
            <Page class="page" :current="currentPage" :total="currentTotal" :page-size="currentPageSize" simple
                  @on-change="handlePageNumberChange"
                  @on-page-size-change="handlePageSizeChange"></Page>
        </Row>

        <Table ref="table" :columns="columnss" :data="data" :size="size"
               :width="width" :height="height" :stripe="stripe"
               :border="border" :showHeader="showHeader"
               :highlightRow="highlightRow"
               :rowClassName="rowClassName" :context="context"
               :noDataText="noDataText" :noFilteredDataText="noFilteredDataText"
               :disabledHover="disabledHover" :loading="loading"
               @on-selection-change="handleTableSelectionChange"
               @on-select="handleTableSelect"
               @on-select-cancel="handleTableSelectCancel"
               @on-sort-change="handleTableSortChange"
               @on-select-all="handleTableSelectAll"></Table>

        <Row class="bottom">
            <Page class="page" :current="currentPage" :total="currentTotal" :page-size="currentPageSize"
                  :page-size-opts="pageSizeOpts" :placement="placement"
                  :simple="simple" :show-total="showTotal"
                  :show-elevator="showElevator" :show-sizer="showSizer"
                  :class-name="className" :styles="styles"
                  @on-change="handlePageNumberChange"
                  @on-page-size-change="handlePageSizeChange"></Page>
        </Row>
    </div>
</template>
<script>
    export default {
        props: {
            data: {
                type: Array,
                default () {
                    return [];
                }
            },
            columns: {
                type: Array,
                default () {
                    return [];
                }
            },
            size: {
                validator (value) {
                    return oneOf(value, ['small', 'large', 'default']);
                }
            },
            width: {
                type: [Number, String]
            },
            height: {
                type: [Number, String]
            },
            stripe: {
                type: Boolean,
                default: false
            },
            border: {
                type: Boolean,
                default: false
            },
            showHeader: {
                type: Boolean,
                default: true
            },
            highlightRow: {
                type: Boolean,
                default: false
            },
            rowClassName: {
                type: Function,
                default () {
                    return '';
                }
            },
            context: {
                type: Object
            },
            noDataText: {
                type: String
            },
            noFilteredDataText: {
                type: String
            },
            disabledHover: {
                type: Boolean
            },
            loading: {
                type: Boolean,
                default: false
            },

            current: {
                type: Number,
                default: 1
            },
            total: {
                type: Number,
                default: 0
            },
            pageSize: {
                type: Number,
                default: 10
            },
            pageSizeOpts: {
                type: Array,
                default () {
                    return [10, 20, 30, 40];
                }
            },
            placement: {
                default: 'top'
            },
            simple: {
                type: Boolean,
                default: false
            },
            showTotal: {
                type: Boolean,
                default: true
            },
            showElevator: {
                type: Boolean,
                default: true
            },
            showSizer: {
                type: Boolean,
                default: true
            },
            className: {
                type: String
            },
            styles: {
                type: Object
            }
        },
        data() {
            return {
                currentPage: this.current,
                currentPageSize: this.pageSize,
                currentTotal: this.total,
                currentSelectTotal: 0,
                columnss:this.columns,
                selectAll: false,
            }
        },
        watch: {
            total (val) {
                let maxPage = Math.ceil(val / this.currentPageSize);
                if (maxPage < this.currentPage && maxPage > 0) {
                    this.currentPage = maxPage;
                }
                this.currentTotal = val
            },
            current (val) {
                this.currentPage = val;
            },
            pageSize (val) {
                this.currentPageSize = val;
            },
            columns(val) {
                this.columnss = val;
            }
        },
        methods: {
            handlePageNumberChange: function (page) {
                this.currentPage = page;
                this.$emit('update:current', page);
                this.$emit('on-change', page);
            },
            handlePageSizeChange (pageSize) {
                this.currentPageSize = pageSize;
                this.$emit('on-page-size-change', pageSize);
                this.handlePageNumberChange(1);
            },
            handleTableSelect(selection, row) {
                this.$emit('on-select', selection, row);
            },
            handleTableSelectCancel(selection, row) {
                this.selectAll = false;
                this.currentSelectTotal = selection.length;
                this.$emit('on-select-cancel', selection, row);
            },
            handleTableSelectionChange(selection) {
                if (selection.length === 0) {
                    this.selectAll = false;
                }
                if (!this.selectAll) {
                    this.currentSelectTotal = selection.length;
                }
                this.$emit('on-selection-change', selection);
            },
            handleTableSortChange(column, key, order) {
                console.log(column);
                this.$emit('on-sort-change', column, column.key, column.order);
            },
            handleTableSelectAll(selection) {
                this.selectAll = true;
                this.currentSelectTotal = this.currentTotal;
                this.$emit('on-select-all', selection);
            },
            tableSelectAll(status) {
                this.selectAll = status;
                if (status) {
                    this.currentSelectTotal = this.currentTotal;
                } else {
                    this.currentSelectTotal = 0;
                }
                this.$refs.table.selectAll(status);
            }
        }
    }
</script>