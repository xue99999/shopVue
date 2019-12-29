<template>
  <div>
    <div class="navbar-div">
        <van-nav-bar title="类别列表" />
    </div>
    <div>
      <van-row>
        <van-col span="6">
          <div id="leftNav">
              <ul>
                <li v-for="(item, idx) in category" :class="{categoryActive: categoryIndex===idx}" @click="clickCategory(idx, item.ID)" :key="idx">
                    {{item.MALL_CATEGORY_NAME}}
                </li>
              </ul>
          </div>
        </van-col>
        <van-col span="18">
          <div class="tabCategorySub">
              <van-tabs v-model="active">
                  <van-tab v-for="(item, index) in categorySub" :key="index"
                    :title="item.MALL_SUB_NAME" @click="onClickCategorySub(index, item.MALL_SUB_NAME)">
                  </van-tab>
              </van-tabs>
          </div>

          <div id="list-div">
            <van-pull-refresh v-model="isRefresh" @refresh="onRefresh">
              <van-list
                  v-model="loading"
                  :finished="finished"
                  @load="onLoad"
                  >
                  <div class="list-item" @click="goGoodsInfo(item.ID)" v-for="(item, idx) in goodList" :key="idx">
                      <div class="list-item-img"><img :src="item.IMAGE1" width="100%" :onerror="errorImg"/></div>
                      <div class="list-item-text">
                          <div>{{item.NAME}}</div>
                          <div class="">￥{{item.ORI_PRICE}}</div>
                      </div>
                  </div>
              </van-list>
            </van-pull-refresh>
          </div>
        </van-col>
      </van-row>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import url from '@/serviceAPI.config.js'
import {Toast} from 'vant'

export default {
  data() {
    return {
      categoryIndex: 0,
      category: [],
      categorySub: [],
      // 子category，当前位置
      active: 0,
      page: 1,
      // 商品信息
      goodList: [],
      // 商品子分类ID
      categorySubId: '',
      // 上拉加载使用
      loading: false,
      // 下拉是否还有数据
      finished: false,
      // 下拉加载
      isRefresh: false,
      errorImg: 'this.src="' + require('@/assets/images/errorimg.png') + '"',
    }
  },
  created() {
    this.getCategory()
  },
  mounted() {
    let winHeight = document.documentElement.clientHeight
    document.getElementById("leftNav").style.height = winHeight -46-50 + 'px'
    document.getElementById('list-div').style.height=winHeight -90-50 +'px'
  },
  methods: {
    getCategory() {
      axios({
        url: url.getCategoryList,
        method: 'get',
      })
        .then(res => {
          if (res.data.code == 200 && res.data.message) {
            let arr = res.data.message
            this.category = arr.filter(item=>item.MALL_CATEGORY_NAME)
            this.getCategorySubByCategoryId(this.category[0].ID)
          } else {
            Toast('服务器错误，数据取得失败')
          }
          // console.log(this.category)
        })
        .catch(err => {
          console.error(err)
        })
    },
    getCategorySubByCategoryId(categoryId) {
      axios({
        url: url.getCategorySubList,
        method: 'POST',
        data: { categoryId }
      })
        .then(res => {
          if (res.data.code == 200 && res.data.message) {
            this.categorySub = res.data.message
            this.active = 0
          } else {
            Toast('服务器错误，数据取得失败')
          }
          // console.log(this.categorySub)
        })
        .catch(err => {
          console.error(err)
        })
    },
    clickCategory(idx, categoryId) {
      this.categoryIndex = idx
      this.getCategorySubByCategoryId(categoryId)
    },
    // 上拉加载
    onLoad(){
      setTimeout(()=>{
        this.categorySubId = this.categorySubId || this.categorySub[0].ID
        this.getGoodList()
      }, 1000)
    },
    // 下拉刷新
    onRefresh(){
        setTimeout(() => {
            this.isRefresh = false;
            this.resetPageParam()
            this.onLoad()
        }, 500);
    },
    getGoodList() {
      axios({
        url: url.getGoodsListByCategorySubID,
        method: 'POST',
        data: {
          categorySubId: this.categorySubId,
          page: this.page
        }
      })
        .then(response=>{
            if(response.data.code == 200 && response.data.message.length ){
                this.page++
                this.goodList=this.goodList.concat(response.data.message)
            }else{
                this.finished = true;
            }
            this.loading=false;
            // console.log('this.goodList', this.goodList)
        })
        .catch(error=>{
            console.log(error)
        })
    },
    onClickCategorySub(idx, title) {
      this.categorySubId = this.categorySub[idx].ID
      this.resetPageParam()
      this.onLoad()
    },
    // 重置分页参数和数据
    resetPageParam() {
      this.page = 1
      this.finished = false
      this.goodList = []
    },
    goGoodsInfo(id){
        this.$router.push({name:'Goods',params:{goodsId:id}})
    },
  }
}
</script>

<style scoped>
  #leftNav ul li {
      line-height: 2rem;
      border-bottom:1px solid #E4E7ED;
      padding:3px;
      font-size:0.8rem;
      text-align: center;
  }
  .categoryActive{
      background-color: red;
  }
  .list-item{
      display: flex;
      flex-direction: row;
      font-size:0.8rem;
      border-bottom: 1px solid #f0f0f0;
      background-color: #fff;
      padding:5px;
  }
  #list-div{
      overflow: scroll;
  }
  .list-item-img{
      flex:8;
  }
  .list-item-text{
      flex:16;
      margin-top:10px;
      margin-left:10px;
  }
</style>
