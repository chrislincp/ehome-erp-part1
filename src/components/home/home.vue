<template lang="html">
  <el-row class="container">
    <el-col :span="24" class="header">
      <el-col :span="10" class="logo" :class="collapsed?'logo-collapse-width':'logo-width'">
        <router-link :class="collapsed? 'home-link-close':'home-link-open'" to="/home">
          <span v-show="!collapsed">{{sysName}}</span>
          <i :class="collapsed?'fa fa-home':''"></i>
        </router-link>
      </el-col>
      <el-col :span="10">
        <!-- 折叠菜单按钮 -->
        <div class="tools" @click.prevent="collapse">
          <i class="fa fa-align-justify"></i>
        </div>
      </el-col>
      <el-col :span="4" class="userinfo">
        <el-dropdown trigger="hover">
          <span class="el-dropdown-link userinfo-inner"><img :src="this.sysUserAvatar + '?rnd=' + parseInt(Math.random() * 1000)" /> {{sysUserName}}</span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item><router-link to="/main">个人中心</router-link></el-dropdown-item>
            <!-- <el-dropdown-item>设置</el-dropdown-item> -->
            <el-dropdown-item divided @click.native="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-col>
    </el-col>
    <el-col :span="24" class="main">
      <aside class="menu-aside" :class="collapsed?'menu-collapsed':'menu-expanded'">
        <!--导航菜单-->
        <el-menu :default-active="$route.path" class="el-menu-vertical-demo" @open="handleopen" @close="handleclose" @select="handleselect"
           unique-opened router v-show="!collapsed">
          <template
            v-for="(item,index) in $router.options.routes"
            v-if="!item.hidden"
            >
            <el-submenu class="submenu" :index="index+''" v-if="!item.leaf">
              <template slot="title"><i :class="item.iconCls"></i>{{item.name}}</template>
              <el-menu-item
                v-for="(child, i) in item.children"
                :key = "i"
                :index="child.path"
                v-if="!child.hidden"
                >
                {{child.name}}
              </el-menu-item>
            </el-submenu>
            <el-menu-item v-if="item.leaf&&item.children.length>0" :index="item.children[0].path"><i :class="item.iconCls"></i>{{item.children[0].name}}</el-menu-item>
          </template>
        </el-menu>
        <!--导航菜单-折叠后-->
        <ul class="el-menu el-menu-vertical-demo collapsed" v-show="collapsed" ref="menuCollapsed">
          <li
            v-for="(item,index) in $router.options.routes"
            v-if="!item.hidden"
            class="el-submenu item"
            :key="index"
            >
            <template v-if="!item.leaf">
              <div class="el-submenu__title" style="padding-left: 20px;" @mouseover="showMenu(index,true)" @mouseout="showMenu(index,false)"><i :class="item.iconCls"></i></div>
              <ul class="el-menu submenu" :class="'submenu-hook-'+index" @mouseover="showMenu(index,true)" @mouseout="showMenu(index,false)">
                <router-link
                  tag="li"
                  v-for="child in item.children"
                  v-if="!child.hidden"
                  :key="child.path"
                  class="el-menu-item"
                  style="padding-left: 40px;"
                  :class="$route.path==child.path?'is-active':''"
                  :to="child.path"
                  >
                  {{child.name}}
                </router-link>
              </ul>
            </template>
            <template v-else>
              <li class="el-submenu">
                <div class="el-submenu__title el-menu-item" style="padding-left: 20px;height: 56px;line-height: 56px;padding: 0 20px;" :class="$route.path==item.children[0].path?'is-active':''" @click="$router.push(item.children[0].path)"><i :class="item.iconCls"></i></div>
              </li>
            </template>
          </li>
        </ul>
      </aside>
      <section class="content-container" :class="collapsed ? '' : 'content-expand'">
        <!-- <div class="grid-content bg-purple-light"> -->
          <!-- <el-col :span="24" class="content-wrapper"> -->
            <transition name="fade" mode="out-in">
              <router-view></router-view>
            </transition>
          <!-- </el-col> -->
        </div>
      </section>
    </el-col>
  </el-row>
</template>

<script>
export default {
  data() {
    return {
      sysName:'理享家',
      collapsed:true,
      sysUserName: '',
      sysUserAvatar: '',
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      }
    }
  },
  methods: {
    onSubmit() {
      console.log('submit!');
    },
    handleopen() {
      //console.log('handleopen');
    },
    handleclose() {
      //console.log('handleclose');
    },
    handleselect: function (a, b) {
    },
    //退出登录
    logout: function () {
      var _this = this;
      this.$confirm('确认退出吗?', '提示', {
        //type: 'warning'
      }).then(() => {
        sessionStorage.removeItem('user');
        _this.$router.push('/login');
      }).catch(() => {

      });


    },
    //折叠导航栏
    collapse:function(){
      this.collapsed=!this.collapsed;
    },
    showMenu(i,status){
      this.$refs.menuCollapsed.getElementsByClassName('submenu-hook-'+i)[0].style.display=status?'block':'none';
    }
  },
  mounted() {
    var user = sessionStorage.getItem('user');
    if (user) {
      user = JSON.parse(user);
      // console.log(user)
      // console.log(user.uname)
      this.sysUserName = user.name || '';
      this.sysUserAvatar = user.avatar;
    }

  }
}
</script>

  <style scoped lang="scss">
  	@import '../../common/style/vars';
    a {
      text-decoration: none;
      display: block;
      width: 100%;
      height: 100%;
      color: #000;
    }
    .home-link-close {
      color: #fff;
      width: 60px;
      height: 60px;
      position: absolute;
      top: 0;
      left: 0;
    }
    .home-link-open {
      color: #fff;
      width: 200px;
      height: 60px;
      position: absolute;
      top: 0;
      left: 0;
    }
    .home-link-close i {
      font-size: 30px;
      margin: 15px;
    }
    .home-link-open span {
      display: block;
      text-align: center;
    }

  	.container {
  		position: relative;
  		// top: 0px;
  		// bottom: 0px;
  		width: 100%;
      height: 100%;
  		.header {
  			height: 60px;
  			line-height: 60px;
  			background: $color-primary;
        position: fixed;
  			color:#fff;
        z-index: 99;
  			.userinfo {
  				text-align: right;
  				padding-right: 35px;
  				float: right;
  				.userinfo-inner {
  					cursor: pointer;
  					color:#fff;
  					img {
  						width: 40px;
  						height: 40px;
  						border-radius: 20px;
  						margin: 10px 0px 10px 10px;
  						float: right;
  					}
  				}
  			}
  			.logo {
  				//width:230px;
  				height:60px;
  				font-size: 22px;
  				padding-left:20px;
  				padding-right:20px;
  				border-color: rgba(238,241,146,0.3);
  				border-right-width: 1px;
  				border-right-style: solid;
  				// img {
  				// 	width: 40px;
  				// 	float: left;
  				// 	margin: 10px 10px 10px 18px;
  				// }
  				.txt {
  					color:#fff;
  				}
  			}
  			.logo-width{
  				width:200px;
  			}
  			.logo-collapse-width{
  				width:60px
  			}
  			.tools{
  				padding: 0px 23px;
  				width:14px;
  				height: 60px;
  				line-height: 60px;
  				cursor: pointer;
  			}
  		}
  		.main {
  			// display: flex;
  			// background: #324057;
  			// position: absolute;
        // position: relative;
        height: calc(100% - 60px);
        margin-top: 60px;
  			// top: 60px;
  			// bottom: 0px;
  			// overflow: hidden;
  			aside {
  				// flex:0 0 200px;
  				width: 200px;
          position: fixed;
          z-index: 99;
          height: calc(100% - 60px);
  				// position: absolute;
  				// top: 0px;
  				// bottom: 0px;
  				.el-menu{
  					height: 100%;
  				}
  				.collapsed{
  					width:60px;
  					.item{
  						position: relative;
  					}
  					.submenu{
  						position:absolute;
  						top:0px;
  						left:60px;
  						z-index:99999;
  						height:auto;
  						display:none;
  					}

  				}
  			}
        .menu-aside {
          background-color: #eef1f6;
        }
  			.menu-collapsed{
  				flex:0 0 60px;
  				width: 60px;
  			}
  			.menu-expanded{
  				flex:0 0 200px;
  				width: 200px;
  			}
  			.content-container {
  				// flex:1;
          width: calc(100% - 60px);
          // min-height: 100%;
  				// position: relative;
          // left: 60px;
          margin-left: 60px;
          // overflow: auto;
          -webkit-overflow-scrolling: touch;
  				padding: 0;
  				.breadcrumb-container {
  					//margin-bottom: 15px;
  					.title {
  						width: 200px;
  						float: left;
  						color: #475669;
  					}
  					.breadcrumb-inner {
  						float: right;
  					}
  				}
  				.content-wrapper {
            // position: relative;
            overflow: auto;
            -webkit-overflow-scrolling: touch;
            height: 100%;
  					background-color: #fff;
  					box-sizing: border-box;
  				}
  			}
        .content-expand {
          width: calc(100% - 200px);
          margin-left: 200px;
        }
  		}
  	}
  </style>
