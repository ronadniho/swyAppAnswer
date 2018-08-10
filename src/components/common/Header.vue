<template>
  <header :class="[ios?'ios':'android']">
    <div>
      <a @click="clo" v-if="closes" class="close"></a>
      <a @click="go" v-if="!closes"></a>
      <span>{{title}}</span>
    </div>
  </header>
</template>

<script>
  import browser from '../../api/checkVersion';

  export default {
    name: 'Header',
    props: ['title', 'href', 'close','state'],
    data() {
      return {
        closes: this.close,
        android: false,
        ios: false,
        states:this.states
      }
    },
    created: function () {
      console.log(this.closes)
      console.log(browser)
      console.log('android:' + browser.versions.android)
      console.log('ios:' + browser.versions.ios)
      this.android = browser.versions.android;
      this.ios = browser.versions.ios;
    },
    methods: {
      go() {
        console.log(this.href)
        // this.$router.push(this.href)
        if (this.android) {
          this.$emit('warning', 'android', 'list');
          //_ActionJS.exitCurrentPage();
        }
        else if (this.ios) {
          this.$emit('warning', 'ios', 'list');
          // exitCurrentPage();
        }
        // this.$router.go(-1)
      },
      clo() {
        if (this.android) {
          this.$emit('warning', 'android');
          //_ActionJS.exitCurrentPage();
        }
        else if (this.ios) {
          this.$emit('warning', 'ios');
          // exitCurrentPage();
        }
      },
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  @import '../../variable';

  header.ios {
    height: 88px;
    padding: 0;
    display: flex;
    align-items: center;
    div {
      height: 88px;
      width: @max;
      display: flex;
      align-items: center;
      justify-content: center;
      a {
        display: inline;
        /*margin-top: 0;*/
        /*position: static;*/
      }
      span {
        display: block;
      }
    }
  }

  header.android {
    height: 88px;
    padding: 0;
    display: flex;
    align-items: center;
    div {
      width: @max;
      display: flex;
      align-items: center;
      justify-content: center;
      a {
        display: inline;
        /*margin-top: 0;*/
        /*position: static;*/
      }
      span {
        display: block;
      }
    }
  }

  header {
    background-color: @theme;
    padding: 0 15px;
    box-sizing: border-box;
    position: fixed;
    width: @max;
    z-index: 1000;
    div {
      .base(@white, @Header-font-28);
      text-align: center;
      position: relative;
      box-sizing: border-box;
      a {
        display: inline-block;
        width: 26px;
        height: 42px;
        background: url(../../assets/back.png) no-repeat center center;
        background-size: 26px 42px;
        vertical-align: middle;
        position: absolute;
        left: 0px;
        top: 50%;
        padding-right: 40px; /*no*/
        margin-top: -21px;
      }
      span {
        vertical-align: middle;
        padding-left: 40px;
        font-size: 34px;
      }
    }
  }
</style>
