<template>
  <div>
    <Header
      :title="title"
      :href="href"
      :close='clo'
    />
    <!--modal-->
    <div class="modal" v-if="result">
      <div class="modal-diag">
        <div class="modal-bg">
          <p>你有一次考试没完成，是否继续?</p>
        </div>
        <div class="btn-group">
          <button @click="continuer">继续</button>
          <button @click="again">重新开始</button>
        </div>
      </div>
    </div>
    <Loading v-if="loading"/>
  </div>
</template>

<script>
  import Header from '../common/Header';
  import Loading from '../common/Loading';
  import req from '../../api/index';

  export default {
    name: 'LocalStorage',
    components: {
      Header,
      Loading
    },
    data() {
      return {
        title: '考试',
        href: '',
        data: [],//页面渲染的数据
        notTest: [],//没有考试
        alreadyTest: [],//可以考试
        result: false,
        classid: '',
        userid: '',
        studentid: '',
        loading: true,//加载动画
        clo: true,
      }
    },
    created: function () {
      this.loading = true;
      this.userid = this.$route.query.userid;
      this.studentid = this.$route.query.studentid;
      this.classid = this.$route.query.classid;
      // this.classid = 'b8d3f418-d024-11e7-8f29-005056bf154b';
      console.log(this.classid)
      this.getLoginSession();

    },
    methods: {
      getLoginSession() {
        req.request({
            "key": ["SignLoginOn"],
            "postData": {
              "clienttype": "wechatapp",
              // "userid": "488c5c77-e642-4a88-8f51-171ede6bcd99",
              "uid": this.userid
            }
          },
          '/api/commonhandle',
          true,
          (data) => {
            console.log(data.loginUser);

            var state = this.getSession(this.classid)
            console.log(state)
            if (state) {//有数据
              this.result = !this.result;
              this.loading = false;
            }
            else {//没有数据
              this.continuer();
            }

          });

      },
      getSession(classid) {
        return JSON.parse(localStorage.getItem([classid]));
      },
      continuer() {
        this.$router.push({path: 'answer', query: {'classid': this.classid,'studentid':this.studentid,'userid':this.userid,}});
      },
      again() {
        localStorage.removeItem([this.classid]);
        this.$router.push({
          path: 'answer',
          query: {'classid': this.classid, 'studentid': this.studentid, 'userid': this.userid, }
        });
      }
    }
  }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  @import '../../variable';
  .container {
    position: absolute;
    top: 88px;
    width: @max;
    .title {
      background-color: @answerList-title-bg-col;
      font-size: @answerList-font-24;
      color: @answerList-col-62;
      padding: 0 25px;
      box-sizing: border-box;
      line-height: 62px;
    }
    ul {
      li {
        border-bottom: 1px solid @answerList-col-dc; /*no*/
        div.lf {
          width: 590px;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
          padding: 17px 0 17px 25px;
          box-sizing: border-box;
          span {
            color: @answerList-col-62;
            font-size: @answerList-font-32;
            height: 88px;
            line-height: 48px;
          }
          p {
            font-size: @answerList-font-24;
            color: @theme;
            line-height: 32px;
          }
          .progress {
            color: @theme;

          }
          .tips {
            font-size: 24px;
            line-height: 41px;
            color: #a8a8a8;

          }
        }
        div.rf {
          flex-grow: 1;
          button {
            border-radius: 25px; /*no*/
            border: 0;
            color: @white;
            font-size: @answerList-font-24;
            background-color: @theme;
            height: 60px;
            line-height: 60px;
            padding: 0 37px;
            box-sizing: border-box;
          }
          button.back {
            color: @theme;
            background-color: @answerList-col-feecec;
          }
          button:disabled {
            background-color: @answerList-col-dc;
          }
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
    .modal-diag {
      position: absolute;
      top: 50%;
      left: 50%;
      margin-left: -310px;
      margin-top: -309px;
      .modal-bg {
        width: 620px;
        height: 520px;
        background: url(../../assets/modal-bg.png) no-repeat;
        background-size: cover;
        position: relative;
        p {
          width: 520px;
          color: @theme;
          font-size: 30px;
          position: absolute;
          bottom: 46px;
          left: 50%;
          margin-left: -260px;
          text-align: center;
        }
      }
      .btn-group {
        width: @max;
        height: 98px;
        display: table;
        content: '';
        clear: both;
        button {
          color: @white;
          font-size: 30px;
          background-color: @theme;
          height: 98px;
          line-height: 98px;
          border: 0;
          width: @max/2;
          box-sizing: border-box;
          padding: 0;
          margin: 0;
          float: left;
        }
        button:last-child {
          background-color: #918181;
        }
      }
    }
  }
</style>
