<template>
    <div class="pager-wrapper" v-if="totalPage > 0">
        <div class="pager-pages">
            <a :class="prevClasses" @click="go(1)"><i class='icon icon-diyiye'></i></a>
            <!-- <a v-show="currentPage > 1 && showPrev" @click="go(currentPage - 1)"><i class='icon icon-before'></i></a> -->
            <a :class="prevClasses" @click="go(currentPage - 1)"><i class='icon icon-before'></i></a>
            <a :class="{active: currentPage == 1 ? true : false}" @click="go(1)">1</a>
            <strong v-show="pages[0] > 2">...</strong>
            <a v-for="page in pages" :class="{active: currentPage == page ? true : false}" @click="go(page)">{{page}}</a>
            <strong v-show="pages[pages.length-1] < totalPage - 1">...</strong>
            <a v-if="totalPage > 1" :class="{active: currentPage == totalPage ? true : false}" @click="go(totalPage)">{{totalPage}}</a>
            <!-- <a v-show="currentPage < totalPage && showNext" @click="go(currentPage + 1)"><i class='icon icon-later'></i></a>
            <a v-show="currentPage < totalPage && showNext" @click="go(totalPage)"><i class='icon icon-zuihouye'></i></a>-->
            <a :class="nextClasses" @click="go(currentPage + 1)"><i class='icon icon-later'></i></a>
            <a :class="nextClasses" @click="go(totalPage)"><i class='icon icon-zuihouye'></i></a> 
        </div>
        <div v-if="showJump" v-show="totalPage > 1" class="pager-jump">
            <span v-show='showTotal'>共
                <em class="jump-total">{{totalPage}}</em>页 </span>
            <span v-show='showSelect'>
                <select v-model="currentPageSize" @change="changeSize">
                    <option value="5">5条/页</option>
                    <option value="10">10条/页</option>
                    <option value="15">15条/页</option>
                    <option value="20">20条/页</option>
                </select>
            </span>
            <input type="number" min="1" :max="totalPage" v-model="jumpPage" class="jump-input">
            <a @click="go(jumpPage)" class='jumpA'>go</a>
        </div>
    </div>
</template>
<script>
/*
 * component pager 翻页页码组件
 */
export default {
    props: {
        totalPage: { // 总页数
            type: Number,
            default: 1,
            required: true
        },
        showTotal:{// 是否显示总页数
            type: Boolean,
            default: true
        },
        showSelect:{// 是否显示下拉框
            type: Boolean,
            default: true
        },
        showItems: { // 显示出来的页数，如: 1 ... 34[5]67 ... 10
            type: Number,
            default: 5
        },
        showPrev: { // 是否显示“上一页”
            type: Boolean,
            default: true
        },
        showNext: { // 是否显示“下一页”
            type: Boolean,
            default: true
        },
        showJump: { // 是否显示“跳转”
            type: Boolean,
            default: true
        },
        initPage: {
            type: Number,
            default: 1
        },
        mode: {
            type: String,
            default: 'event' // 'event' | 'query' | 'params'
        },
        routeName: {
            type: String
        }
    },
    data() {
        return {
            currentPage: 0,
            jumpPage: 0,
            currentPageSize: 20
        }
    },
    route: {
            data ({to: {query, params}}) {
                if(params.page) {
                    this.paramsPage = parseInt(params.page) || 1
                } else {
                    this.paramsPage = 1
                }
                if(query.page) {
                    this.queryPage = parseInt(query.page) || 1
                } else {
                    this.queryPage = 1
                }
            }
        },
    created() {
        this.currentPage = this.initPage
        if (this.mode == 'params' && !this.routeName) {
            throw 'need a route name when choose params mode in pager component'
        }
    },
    computed: {
        prevClasses () {
                return [
                    {
                        [`disabled`]: this.currentPage === 1
                    }
                ];
        },
        nextClasses () {
            return [
                    {
                        [`disabled`]: this.currentPage === this.totalPage
                    }
                ];
        },
        pages() {
            let getPages = (start, end) => {
                if (start <= 1 || start > end || start >= this.totalPage) {
                    start = 2
                }
                if (end >= this.totalPage || end < start || end <= 1) {
                    end = this.totalPage - 1
                }
                let arr = []
                for (let i = start; i <= end; i++) {
                    arr.push(i)
                }
                return arr
            }
            let counts = this.showItems
            if (this.totalPage < counts + 2) {
                return getPages(2, this.totalPage)
            } else {
                if (this.currentPage <= Math.ceil(counts / 2)) {
                    return getPages(2, counts)
                } else if (this.currentPage >= this.totalPage - Math.floor(counts / 2)) {
                    return getPages(this.totalPage + 1 - counts, this.totalPage - 1)
                } else {
                    let half = Math.ceil(counts / 2) - 1
                    let end = this.currentPage + half
                    if (counts % 2 === 0) {
                        end++
                    }
                    return getPages(this.currentPage - half, end)
                }
            }
        }
    },
    methods: {
        changeSize () {
                this.$emit('on-size', this.currentPageSize);
            },
        go(page) {
            if (page < 1) {
                page = 1
            }
            if (page > this.totalPage) {
                page = this.totalPage
            }
            if (page === this.currentPage) {
                return
            }
            this.currentPage = parseInt(page, 10)
            if (this.mode == 'query') {
                let query = this.$route.query
                query.page = this.currentPage
                this.$router.go({ query: query })
            } else if (this.mode == 'params') {
                let params = this.$route.params
                params.page = this.currentPage
                this.$router.go({ name: this.routeName, params: params })
            } else {
                this.$emit('go-page', {
                    page: this.currentPage
                })
            }
        }
    },
    watch: {
        pageSize (newVal) {
            this.currentPageSize = newVal;
        },
        currentPage(newVal) {
            this.jumpPage = newVal
        },
        initPage(newVal) {
            if (this.currentPage !== newVal) {
                this.currentPage = newVal
            }
        }
    }
}
</script>
<style>
.pager-wrapper {
  margin-top: 15px;
  text-align: center;float: right;margin-right: -40px
}
.pager-wrapper .icon{font-size: 14px;}
.pager-pages {
  display: inline-block;
  height: 32px;
  font-size: 0;
}
.pager-wrapper a,
.pager-wrapper strong {
  display: inline-block;
  width: 32px;
  height: 32px;
  margin: 0 2px;
  font-size: 14px;
  line-height: 32px;
  text-align: center;
  color: #222;
}
.pager-wrapper a {
  border: 1px solid #ddd;
  border-radius: 2px;
  background-color: #fff;
  transition: all 0.2s;border: 1px solid #e7e7e7;
    border-radius: 16px;
}
.pager-wrapper a.disabled,
.pager-wrapper a.disabled:hover
{
    background-color: #fff;
    cursor: default;
    color: #ddd;
    border-color: #e7e7e7;
}
.pager-wrapper a:hover,
.pager-wrapper .active {
  background-color:#7e8fe1;
  color: #fff;
  border-color: #7e8fe1;
}
.pager-wrapper .active:hover {
  color: #fff;
}
.pager-jump {
  display: inline-block;
  height: 32px;
  margin-left: 5px;
}
.pager-jump span {
  line-height: 32px;
}
.pager-jump em {
  margin: 0 5px;
  font-style: normal;
}
.pager-jump .jump-input {
  width: 60px;
  height: 32px;
  outline: none;
  font-size: 14px;
  vertical-align: top;

    padding: 0;
    border: 1px solid #e7e7e7;
    text-align: left;
    text-indent: 16px;
    width: 70px;
    margin: 0 0 0 5px;
    vertical-align: middle;
    border-radius: 16px;




}
.pager-jump .jump-input:focus {
  border-color: #7e8fe1;
}
.pager-jump select{height: 28px;
    border-radius: 4px;
    border: 1px solid #ddd;
    color: #666;
}

.pager-jump .jumpA{
    vertical-align: middle;
    text-decoration: none;
    display: inline-block;
    height: 32px;
    width: 46px;
    position: relative;
    left: -40px;
    border: 1px solid #ddd;
    border-radius: 16px;
    line-height: 28px;
    cursor: pointer;
    margin-left: 5px;
    color: #fff;
    background: #7e8fe1
    }
.pager-jump .jumpA:hover{
    color: #fff;}
</style>