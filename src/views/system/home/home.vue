<template lang="html">
  <section class="home_wrap">
    <div class="home_nav">
      <div
        v-for="(item, index) in navs"
        class="nav_item"
        :style="`background-image: url(${item.img})`"
        @mouseenter="enter($event, index)"
        @mouseleave="leave()"
        @click="enter($event)"
        >
        <span @click.stop class="title">{{item.title}}</span>
        <span @click.stop class="mask">
          <div class="content" v-if="index==0">
            <div
              class="brands"
              v-for="(item, i) in brands"
              :style="`top: ${i * 14.285714285714}%`"
              >
              <a
                :href="item.url"
                target="_blank"
                class="brands_item"
                >
                <div class="text">
                  <h1>— {{item.name}} —</h1>
                  <p>{{item.synopsis}}</p>
                </div>
              </a>
            </div>
          </div>
          <div v-if="index > 0" class="text_info">
            <dl class="text_wrap">
              <dt class="text_title">{{item.title}}</dt>
              <dd class="text_content" v-for="text in item.text">{{text}}</dd>
              <dd class="link_more"><a @click="toPicture(index, $event)" target="_blank" :href="item.url">查看详情</a></dd>
            </dl>
          </div>
        </span>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  data () {
    return {
      navs: [
        {
          img: '/static/img/home/1.jpg',
          title: '家居品牌'
        },
        {
          url: 'SchemeLibs',
          img: '/static/img/home/2.jpg',
          title: 'VR家装方案',
          text: ['我们用虚拟创造现实，以科技呈现未来，不仅为您提供一站式整体家装方案，更为您打造理想中的品质生活，所见即所得。']
        },
        {
          url: 'http://www.zjlixiangjia.in/',
          img: '/static/img/home/3.jpg',
          title: '公司简介',
          text: [
            '理享家-住宅软装整体解决全案设计与实现服务商。',
            '“先软装，后硬装”的设计手法，使软硬装设计更显融合，空间呈现完美效果。',
            '“先产品，后设计”的设计理念，效果与预算同步，让所见即所得变成可能。',
            '我们启用超强体验VR技术，为追求个性设计的业主提供了更广阔的畅想空间，提供先行赔付、居间担保、安装监理、价格闭口等免费服务，让装修施工不再有痛点。'
          ]
        },
        {
          url: 'http://www.ehometd.com/ehome/hezuo',
          img: '/static/img/home/4.jpg',
          title: '一站式方案',
          text: ['整合开发商、银行贷款、供应商的全方位生态圈，为客户带来一站式解决方案，真正做到拎包入住。']
        },
        {
          url: 'http://www.ehometd.com/picture',
          img: '/static/img/home/5.jpg',
          title: '设计素材库',
          text: ['获取分享设计灵感，让更多人发现设计之美。']
        }
      ],
      brands: [
        {name: '皇家爱菲', synopsis: '轻奢主义·欧式家具的领导者', url: '/brands/index_HJAF.html'},
        {name: '美林格', synopsis: '手工精湛·欧美家具品质标杆', url: '/brands/index_MLG.html'},
        {name: '玛利洛', synopsis: '极简主义·意大利人在中国', url: '/brands/index_MLL.html'},
        {name: '巴尔德', synopsis: '极简生活·自然主义', url: '/brands/index_BED.html'},
        {name: '诺高', synopsis: '致力于打造高品质的家居美学理念', url: '/brands/index_NG.html'},
        {name: '巴赫', synopsis: '兼具英式古典与现代的双重审美', url: '/brands/index_BH.html'},
        {name: '迈克世纪', synopsis: '新北欧风格·最具工匠精神', url: '/brands/index_MKSJ.html'}
      ]

    }
  },
  methods: {
    enter (event, index) {
      var target = event.target || window.event.srcElement
      var item = document.getElementsByClassName('nav_item')
      let brands = document.getElementsByClassName('brands')
      for (let i = 0; i < item.length; i++) {
        if (item[i] == target) {
          item[i].style.width = '33.3332%'
          item[i].childNodes[0].style.opacity = 0
          item[i].childNodes[2].style.opacity = 0.8
        }
        else item[i].style.width = '16.6667%'
        }
        if (index == 0) {
          this.brandEnter()
        }else {
          for (let i = 0; i < brands.length; i++) {
            brands[i].style.left = '-100%'
          }
      }
    },
    brandEnter () {
      let brands = document.getElementsByClassName('brands')
      for (let i = 0; i < brands.length; i++) {
        var time = i * 300
        setTimeout(() => {
          brands[i].style.left = 0
        },time)
      }
    },
    leave () {
      var item = document.getElementsByClassName('nav_item')
      let brands = document.getElementsByClassName('brands')
      for (let i = 0; i < item.length; i++) {
        item[i].style.width = '20%'
        item[i].childNodes[0].style.opacity = 1
        item[i].childNodes[2].style.opacity = 0
      }
      for (let i = 0; i < brands.length; i++) {
        brands[i].style.left = '-100%'
      }
    },
    toPicture (index,e) {
      if (index == 4) {
        let user = sessionStorage.getItem('user')
        localStorage.setItem('user', user)
        // e.preventDefault();
      }else if(index == 1) {
        e.preventDefault();
        this.$router.push('/SchemeLibs')
      }
    }
  }
}
</script>

<style lang="scss">
  .home_wrap {
    width: calc(100% - 60px);
    height: calc(100% - 60px);
    position: fixed;
    .home_nav {
      width: calc(100% - 60px);
      height: calc(100% - 60px);
      padding: 30px;
      overflow: hidden;
      .nav_item {
        height: 100%;
        width: 20%;
        display: inline-block;
        background-repeat: no-repeat;
        background-position: center;
        transition: all 0.8s;
        position: relative;
        .title {
          display: block;
          width: 100px;
          height: 30px;
          line-height: 30px;
          font-size: 16px;
          text-align: center;
          padding: 10px;
          color: #48576a;
          background: rgba(255, 255, 255, 0.8);
          position: absolute;
          top: 50%;
          left: 50%;
          margin: -25px 0 0 -60px;
          transition: all .8s;
          border-radius: 10px;
        }
        .mask {
          display: block;
          position: absolute;
          width: 100%;
          height: 100%;
          background: #fff;
          transition: all .8s;
          opacity: 0;
          .content {
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            position: relative;
            overflow: hidden;
            .brands {
              width: calc(100% - 20px);
              height: calc(14.285714285714% - 20px);
              color: #fff;
              padding: 8px 12px 12px 8px;
              position: absolute;
              left: -100%;
              transition: all .3s;
              .brands_item {
                display: block;
                width: 100%;
                height: 100%;
                color: #fff;
                text-decoration: none;
                border-radius: 10px;
                border: 2px solid #fff;
                text-align: center;
                position: relative;
              }
              .text {
                position: absolute;
                width: 100%;
                height: 50px;
                top: 50%;
                margin-top: -25px;
                h1 {
                  margin: 0 0 10px 0;
                }
                p {
                  margin: 0;
                }
              }
            }
            .brands_item:hover {
              background: rgba(255,255,255, 0.5);
              color: #333;
              border: 2px solid #000;
            }
          }
          .text_info {
            color: #333;
            .text_wrap {
              margin: 0 auto;
              position: absolute;
              top: 20%;
              left: 50%;
              .text_title {
                font-weight: 700;
                font-size: 20px;
                margin-bottom: 10px;
              }
              .text_content {
                margin: 10px 0;
              }
              .link_more {
                margin: 20px 0;
                a {
                  text-decoration: none;
                  color: #333;
                  font-weight: 700;
                }
                a:hover {
                  color: #ccc;
                }
              }
            }
          }
        }
      }
    }
  }

@media screen and (min-width: 1400px) {
  .text_wrap {
    width: 400px;
    margin-left: -200px !important;
  }
}
@media screen and (min-width: 1024px) and (max-width: 1399px) {
  .text_wrap {
    width: 300px;
    margin-left: -150px !important;
  }
}

@media screen and (max-width: 1023px) {
  .text_wrap {
    left: 0 !important;
    width: 100% !important;
  }
}


</style>
