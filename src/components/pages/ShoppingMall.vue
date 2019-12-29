<template>
  <div>
    <div class="search-bar">
      <van-row>
        <van-col span="3">
          <img :src="locationIcon" width="80%" class="location-icon" />
        </van-col>
        <van-col span="16">
          <input type="text" class="search-input">
        </van-col>
        <van-col span="5">
          <van-button type="default" size="mini">查找</van-button>
        </van-col>
      </van-row>
    </div>

    <div class="ad-banner">
      <img v-lazy="adBanner.PICTURE_ADDRESS" width="100%" alt="">
    </div>

    <div class="swiper-area">
      <van-swipe :autoplay="3000">
        <van-swipe-item v-for="(banner, index) in bannerPicArray" :key="index">
          <img v-lazy="banner.image" width="100%" />
        </van-swipe-item>
      </van-swipe>
    </div>

    <div class="type-bar">
      <div v-for="(cate, index) in category" :key="index">
        <img v-lazy="cate.image" width="90%" />
        <span>{{cate.mallCategoryName}}</span>
      </div>
    </div>

    <!--Recommend goods area-->
    <div class="recommend-area">
      <div class="recommend-title">
          商品推荐
      </div>
      <div class="recommend-body">
        <!--swiper-->
        <swiper :options="swiperOption">
          <swiper-slide v-for=" (item ,index) in recommendGoods" :key="index">
            <div class="recommend-item">
              <img :src="item.image" width="80%" />
              <div>{{item.goodsName}}</div>
              <div>￥{{item.price | moneyFilter}} (￥{{item.mallPrice}})</div>
            </div>
          </swiper-slide>
        </swiper>
      </div>
    </div>

    <floor-component :floorData="floor1" :floorTitle="floorName.floor1" />
    <floor-component :floorData="floor2" :floorTitle="floorName.floor2" />
    <floor-component :floorData="floor3" :floorTitle="floorName.floor3" />

    <!--Hot Area-->
    <div class="hot-area">
        <div class="hot-title">热卖商品</div>
        <div class="hot-goods">
            <van-list>
                <van-row gutter="20">
                    <van-col span="12" v-for="( item, index) in hotGoods" :key="index">
                        <div>{{item.name}}</div>
                        <goods-info :goodsImage="item.image" :goodsName="item.name" :goodsPrice="item.price" />
                    </van-col>
                </van-row>
            </van-list>
        </div>
    </div>



  </div>
</template>

<style scoped>
  .search-bar {
    height: 2.2rem;
    background-color: #e5017d;
    line-height:2.2rem;
  }
  .search-input{
      width:100%;
      height: 1.3rem;
      border-top:0px;
      border-left:0px;
      border-right:0px;
      border-bottom:1px solid #fff !important;
      background-color: #e5017d;
      color:#fff;
  }
  .location-icon {
    padding-left: .3rem;
    padding-top: .2rem;
  }
  .swiper-area{
    width:20rem;
    clear:both;
  }
  .type-bar{
    background-color: #fff;
    margin:0 .3rem .3rem .3rem;
    border-radius: .3rem;
    font-size:14px;
    display: flex;
    flex-direction:row;
    flex-wrap:nowrap;
  }
  .type-bar div{
    padding: .3rem;
    font-size: 12px;
    text-align: center;
  }
  .recommend-area{
       background-color: #fff;
       margin-top: .3rem;
  }
  .recommend-title{
      border-bottom:1px solid #eee;
      font-size:14px;
      padding:.2rem;
      color:#e5017d;
  }
  .recommend-body{
       border-bottom: 1px solid #eee;
   }

  .recommend-item{
      width:99%;
      border-right: 1px solid #eee;
      font-size: 12px;
      text-align: center;
  }
  .hot-area{
      text-align: center;
      font-size:14px;
      height: 1.8rem;
      line-height:1.8rem;
  }
  .hot-goods {
    min-height: 100vh;
    overflow: hidden;
    background-color: #fff;
  }
</style>

<script>
import axios from 'axios'
import 'swiper/dist/css/swiper.css'

import { swiper, swiperSlide } from 'vue-awesome-swiper'
import swiperDefault from '@/components/swiper/swiperDefault'
import floorComponent from '@/components/component/floorComponent'
import toMoney from '@/filter/moneyFilter'
import goodsInfo from '@/components/component/goodsInfoComponent'
import url from '@/serviceAPI.config.js'

export default {
  data() {
    return {
      swiperOption: {
        slidesPerView: 3,
      },
      locationIcon: require('@/assets/images/location.png'),
      category: [],
      // banner
      adBanner: '',
      // 轮播图
      bannerPicArray : [],
      // 推荐商品
      recommendGoods: [],
      // 楼层图片
      floor1: [],
      floor2: [],
      floor3: [],
      // 楼层名字
      floorName: [],
      // 热卖商品
      hotGoods: [],
    }
  },
  created() {
    axios({
      url: url.getShoppingMallInfo,
      method: 'get'
    })
      .then(res => {
        if (res.status == 200) {
          this.category =  res.data.data.category
          this.adBanner =  res.data.data.advertesPicture
          this.bannerPicArray =  res.data.data.slides
          this.recommendGoods = res.data.data.recommend
          this.floor1 = res.data.data.floor1
          this.floor2 = res.data.data.floor2
          this.floor3 = res.data.data.floor3
          this.floorName = res.data.data.floorName
          this.hotGoods = res.data.data.hotGoods
        }
      })
      .catch(console.error)
  },
  components: {
    swiper,
    swiperSlide,
    swiperDefault,
    floorComponent,
    goodsInfo,
  },
  filters: {
    moneyFilter(money) {
      return toMoney(money)
    }
  }
}
</script>
