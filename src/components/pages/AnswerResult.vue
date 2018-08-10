<template>
  <div class="container">
    <Header
      :title="title"
      :href="href"
      :close='true'
      @warning="warning"
    />
    <div class="result">
      <div class="result-top"></div>
      <div class="result-content">
        <div class="result-score">
          <h1>{{score}}<span>分</span></h1>
          <div class="tips">
            <em></em>
            <span>得分</span>
            <em></em>
          </div>
          <img src="../../assets/pass-x.png" alt="" v-if="pass">
          <img class="no" src="../../assets/no-x.png" alt="" v-if="!pass">
        </div>
        <div class="result-img">
          <img src="../../assets/pass-lg.png" alt="" v-if="pass">
          <img src="../../assets/no-lg.png" alt="" v-if="!pass">
        </div>
        <div class="result-description">
          <p v-if="pass">恭喜你，通过测试!</p>
          <p class="no" v-if="!pass">请再接再厉呀!</p>
        </div>
      </div>

    </div>
    <!--loading-->
    <Loading v-if="loading"/>
  </div>
</template>

<script>
  import Header from '../common/Header';
  import Loading from '../common/Loading';
  import {_post} from '../../api/index'
  import {__BASE64} from "../../api/base64";
  import req from '../../api/index';
  import browser from '../../api/checkVersion';
  /*setTimeout(() => {
    window['closeCurrentPage'] = function () {
      _ActionJS.exitCurrentPage();//关闭
    };
  }, 3000)*/

 /* setTimeout(() => {
    window['closeCurrentPage'] = function () {
      _ActionJS.exitCurrentPage();//关闭
    };
  }, 3000);*/

  export default {
    name: 'Answer',
    components: {
      Header,
      Loading,
    },
    data() {
      return {
        title: '考试结果',
        /* message: '',*/
        href: '/',
        score: 0,
        pass: 0,
        loading: true,
        classid: '',
        userid: '',
        studentid: '',
        clo: true,
        android: false,
        ios: false,
      }
    },
    created: function () {
      window['closeCurrentPage'] = this.vueClosePage;
      // console.log(this.$router.go(-2))
      console.log(this.$route.query)
      console.log(this.$route.query.userid)
      console.log(this.$route.query.classid)
      this.userid = this.$route.query.userid;
      this.studentid = this.$route.query.studentid;
      this.classid = this.$route.query.classid;
      this.android = browser.versions.android;
      this.ios = browser.versions.ios;
      /*console.log(this.$route.query)
      console.log(this.$route.query.message)
      this.message = __BASE64.adecode(this.$route.query.message);*/
      this.loading = true;
      req.request({
          "key": ["getLastExamDetailsInfo"],
          "postData": {
            "classid": this.classid,
            "userid": this.studentid,
            // "classid": "b8d3f418-d024-11e7-8f29-005056bf154b",
            // "userid": "5cff189e-9690-11e6-a71f-00fffab6298f"
          }
        },
        '/api/commonhandle',
        true,
        (data) => {
          console.log(data);
          console.log(data.userexam[0]);
          console.log(data.userexam[0].isexampass);
          console.log(data.userexam[0].examscore);
          this.pass = data.userexam[0].isexampass;
          this.score = data.userexam[0].examscore;
          this.loading = false;
        });
    },
    methods: {
      vueClosePage(){
        // alert('new3')
        _ActionJS.exitCurrentPage();
      },
      warning(data, tip) {
        console.log(data);
        console.log(tip)

        this.version = data;
        this.tip = tip;
        this.message = true;
        if (this.version == 'android' && !this.tip) {
          _ActionJS.exitCurrentPage();
        }
        else if (this.version == 'ios' && !this.tip) {
          exitCurrentPage();
        }
      },
    }
  }
</script>

<style scoped lang="less">
  @import '../../variable';

  .container {
    height: @max;
    /*background-color: #f6f6f6;*/
  }

  .result {
    width: @max;
    top: 88px;
    position: relative;
    .result-top {
      background: url(../../assets/result-top.png) no-repeat;
      background-size: cover;
      width: @max;
      height: 400px;
    }
    .result-content {
      border:1px solid @answer-col-c9;/*no*/
      padding: 59px;
      box-sizing: border-box;
      width: 660px;
      height: 870px;
      position: absolute;
      top: 36%;
      left: 50%;
      margin-left: -330px;
      background-color: @white;
      border-radius: 5px;
      .result-score {
        color: #ffa800;
        position: relative;
        h1 {
          font-size: 120px;
          text-align: center;
          line-height: 220px;
          span {
            font-size: 24px;
          }
        }
        .tips {
          font-size: 28px;
          color: #757575;
          text-align: center;
          em {
            border-bottom: 1px solid #dbdbdb; /*no*/
            display: inline-block;
            width: 117px;
            vertical-align: middle;
          }
        }
        img {
          position: absolute;
          top: 0;
          right: -50px;
          width: 171px;
          height: 149px;
        }
        img.no {
          width: 153px;
          height: 153px;
        }
      }
      .result-img {
        padding-top: 62px;
        img {
          width: 528px;
          height: 182px;
        }

      }
      .result-description {
        padding-top: 119px;
        p {
          text-align: center;
          color: @theme;
          font-size: 34px;
        }
      }
    }
  }

  .modal {
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    width: @max;
    height: @max;
    background-color: rgba(0, 0, 0, .4);
    img {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 300px;
      height: 300px;
      margin-left: -150px;
      margin-top: -150px;
    }
  }
</style>
