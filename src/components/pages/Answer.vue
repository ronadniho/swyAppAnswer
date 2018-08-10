<template>
  <div>
    <Header
      :title="title"
      :href="href"
      :close="clo"
      @warning="warning"
    />
    <!--答题-->
    <div class="container answer" v-if="layerToggle">
      <!--页码-->
      <div class="action flex">
        <div class="tip">
          <span>{{page}}</span>
          <span>/{{totalPage}}</span>
        </div>
        <div class="action-btn flex flex-align-center">
          <a @click="answerCardToggle">
            <img src="../../assets/answer.png" alt="">
            <span>答题卡</span>
          </a>
          <a @click="signToggle" v-for="(item,index) in examlist" v-if="index+1==page">
            <img src="../../assets/sign.png" alt="">
            <span>{{item.sign?'已标记':'标记'}}</span>
          </a>
        </div>
      </div>
      <!--主内容-->
      <div class="content">
        <!--标题-->
        <div class="subject">
          <b>{{examName}}</b>
        </div>
        <!--答案-->
        <div class="result">
          <!--item-->
          <div class="result-item" v-for="(item,index) in examlist" :key="item.id">
            <div v-if="index+1==page">
              <!--题目-->
              <div class="title">
                {{item.examtitle}}
              </div>
              <!--item-->
              <div class="box-item single" v-if="item.examcategory==0||item.examcategory==2">

                <div class="box" v-for="child in item.answerList" :key="child.answerid">
                  <input type="radio"
                         :id="'radio'+child.answerid"
                         name="radio"
                         v-model="item.selectid"
                         :value="child.answerid"/>
                  <label :for="'radio'+child.answerid">{{child.answer}}</label>
                </div>

              </div><!--单选-->

              <div class="box-item multi" v-if="item.examcategory==1">

                <div class="box" v-for="child in item.answerList" :key="child.answerid">
                  <input type="checkbox"
                         :id="'checkbox'+child.answerid"
                         :value="child.answerid"
                         v-model="item.selectid"/>
                  <label :for="'checkbox'+child.answerid">{{child.answer}}</label>
                </div>
              </div><!--多选-->
            </div>
          </div>
        </div>

      </div>
      <!--控制器-->
      <div class="submit flex flex-justify-center">
        <div>
          <button :class="page>1?'':'no'" @click="prev">上一题</button>
        </div>
        <div v-if="page<totalPage">
          <button :class="page<totalPage?'':'no'" @click="next">下一题</button>
        </div>
        <div v-if="page==totalPage">
          <button @click="submit">交卷</button>
        </div>
      </div>
    </div>

    <!--答题卡-->
    <div class="container answerCard" v-if="!layerToggle">
      <div class="subject flex">
        <b>
          学习贯彻党的十九大精神专题班结业考试
        </b>
        <a @click="answerCardToggle">&times;</a>
      </div>

      <div class="guide">
        <dl class="clr">
          <dt>单选题</dt>

          <dd class="lt" v-for="(item,index) in examlist" v-if="item.examcategory==0">
            <a @click="guides(index)" :data-index="index+1"
               :class="[item.selectid?'sel':'', item.sign?'sign':'']">{{index+1}}</a>
          </dd>
        </dl>
      </div>
      <div class="guide">
        <dl class="clr">
          <dt>多选题</dt>

          <dd class="lt" v-for="(item,index) in examlist" v-if="item.examcategory==1">
            <a @click="guides(index)" :data-index="index+1"
               :class="[item.selectid.length?'sel':'', item.sign?'sign':'']">{{index+1}}</a>
          </dd>
        </dl>
      </div>
      <div class="guide">
        <dl class="clr">
          <dt>判断题</dt>

          <dd class="lt" v-for="(item,index) in examlist" v-if="item.examcategory==2">
            <a @click="guides(index)" :data-index="index+1"
               :class="[item.selectid?'sel':'', item.sign?'sign':'']">{{index+1}}</a>
          </dd>
        </dl>
      </div>
      <div class="submit">
        <button @click="submit">交卷并查看结果</button>
      </div>
    </div>

    <!--loading-->
    <Loading v-if="loading"/>
    <!--warning-->
    <div class="modal warning" v-if="message">
      <div class="modal-diag">
        <div class="modal-bg">
          <p>你有一次考试没提交，是否退出考试?</p>
        </div>
        <div class="btn-group">
          <button @click="close">退出</button>
          <button @click="back">取消</button>
        </div>
      </div>
    </div>
    <!--jquery-->
    <div class="modal warning" id="jq">
      <div class="modal-diag">
        <div class="modal-bg">
          <p>jquery你有一次考试没提交，是否退出考试?</p>
        </div>
        <div class="btn-group">
          <button id="jqclose">退出</button>
          <button id="jqback">取消</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Header from '../common/Header';
  import Loading from '../common/Loading';
  import {_post} from '../../api/index'
  import {__BASE64} from '../../api/base64';
  import req from '../../api/index';
  import browser from '../../api/checkVersion';
  import jQuery from 'jquery';
  /* setTimeout(()=>{
     window['closeCurrentPage'] = function () {
       alert('jQuery(\'#jq\').css(\'display\',\'block\')')
       jQuery('#jq').css('display','block');
       console.log(jQuery('.jqclose'))
     };

     jQuery('#jqclose').click(()=>{
      _ActionJS.exitCurrentPage();
    });
     jQuery('#jqback').click(()=>{
      jQuery('#jq').css('display','none');
    });

   },3000);*/


  /*window['closeCurrentPage'] = function () {
    _ActionJS.exitCurrentPage();
  };*/
  /*setTimeout(() => {
    window['closeCurrentPage'] = function () {
      _ActionJS.exitCurrentPage();//关闭
    };
  }, 3000);
*/

  export default {
    name: 'Answer',
    components: {
      Header,
      Loading,
    },
    props: [
      'id',
      'mode'
    ],
    data() {
      return {
        title: '考试',
        href: '/',
        layerToggle: true,//true为默认答题状态
        totalPage: 0,//总页数
        page: 1,//page
        classid: '',
        studentid: '',
        userid: '',
        sessionId: '',
        examlist: [],//题目集合
        examName: '',//标题
        exampass: 0,//通过分数线
        loading: true,//加载动画
        result: false,//得分页状态
        message: false,
        clo: false,
        version: '',//机型
        tip: undefined,//提示
        state: false,
      }
    },
    created: function () {
      window['closeCurrentPage'] = this.vueClosePage;
      console.log(this.$route.query)
      this.classid = this.$route.query.classid;
      this.clo = (this.$route.query.clo != undefined) ? this.$route.query.clo : true;
      this.userid = this.$route.query.userid ? this.$route.query.userid : '';
      this.studentid = this.$route.query.studentid ? this.$route.query.studentid : '';
      this.state = this.$route.query.state ? this.$route.query.state : false;
      this.android = browser.versions.android;
      this.ios = browser.versions.ios;
      this.version = this.android ? 'android' : 'ios';
      console.log(this.clo)
      console.log('android:' + this.android)
      console.log('ios:' + this.ios)
      console.log('state:' + this.state)

      if (this.classid) {
        var state = this.getSession(this.classid);
        console.log(state)
      }
      console.log(this.classid)
      console.log(this.studentid)

      req.request(
        {
          key: ["getTopicClassInfo"],
          postData: {
            "classid": this.classid,
            "studentid": this.studentid
          }
        },
        '/api/commonhandle',
        true,
        (data) => {
          console.log(data);
          console.log(data[0].name);
          this.examName = data[0].name;
        });
      if (!state) {//没有缓存
        this.getLoginSession();
        // this.getClassExamlist50(this.$route.query.classid);
      }
      else {//有缓存
        this.common(state);
      }
    },
    methods: {
      vueClosePage() {
        // alert('new2')
        this.message = true;

      },
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
            console.log(data);
            this.getClassExamlist50();

          });

      },
      getClassExamlist50() {

        req.request({
            "key": ["getClassExamlist50"],
            "postData": {
              // "classid": "b8d3f418-d024-11e7-8f29-005056bf154b",
              "classid": this.classid,
            }
          },
          '/api/commonhandle',
          true,
          (data) => {
            console.log(data);


            var examlist = data.examlist;
            var examdetaillist = data.examdetaillist;
            var tar;
            examlist.map(val => {
              val.page = this.page;//给缓存添加当前页
              val.answerList = [];//答案集合
              val.sign = false;//标记状态
              tar = val.id;//题目id
              val.isright = 0;
              val.examcategory == 1 && (val.selectid = []);//字符串转数组方便html模板渲染
              examdetaillist.map(vals => {
                vals.examid == tar && val.answerList.push(vals)
              });


            });
            this.common(examlist);


          });


      },
      common(data) {
        this.examlist = data;
        this.totalPage = data.length;
        this.page = data[0].page;
        // this.examName = data[0].answerList[0].category;

        this.loading = false;
        this.setSession(data);
        console.log(data)
      },
      guides(e) {
        console.log(e)
        this.page = e + 1;
        this.layerToggle = !this.layerToggle;
      },
      warning(data, tip) {
        console.log(data);
        console.log(tip)

        this.version = data;
        this.tip = tip;
        this.message = true;
      },
      submit() {
        console.log(this.examlist);
        this.loading = true;

        var answerLen;
        var temArr;
        /*处理数据结构*/
        this.examlist.map(val => {
          if (val.examcategory != 1 && val.selectid) {//是单选或判断  并且有值
            var selectid = val.selectid;
            var temVari = false;//临时变量
            val.answerList.map(vals => {
              if (vals.answerid == selectid) {
                vals.isselect = true;
                if (vals.isright) {
                  val.isright = 1;
                  temVari = true;
                }
              }
              else {
                !temVari && (val.isright = 0);
                vals.isselect = 0;
              }
            })
          }
          else if (val.examcategory == 1) {//是多选
            answerLen = val.answerList.length;//答案len
            if (val.selectid.length) { //有值
              temArr = [];//临时变量
              for (var i = 0; i < answerLen; i++) {
                temArr.push(false)
              }
              console.log(temArr)
              for (var j = 0, answerList = val.answerList; j < answerList.length; j++) {
                for (var o = 0, selArr = val.selectid; o < selArr.length; o++) {
                  if (answerList[j].answerid == selArr[o]) {
                    answerList[j].isselect = true;
                    temArr[j] = true;
                    break;
                  }
                }
                if (o == selArr.length) {
                  answerList[j].isselect = 0;
                  temArr[j] = false;
                }
              }
              console.log(this.examlist)
              console.log(temArr)
              var state = true;
              for (var i = 0; i < answerList.length; i++) {
                if (answerList[i].isselect != answerList[i].isright) {
                  state = false;
                  break;
                }
              }
              val.isright = state ? true : false;
            }
            else {//没值
              val.answerList.map(vals => {
                vals.isselect = 0;

              });
            }
          }
        });
        console.log(this.examlist)


        console.log(this.classid);
        req.request({//获取学习进度里的考试合格线
            key: ["getAppTopicClassProgress"],
            postData: {
              "classid": this.classid,
              "studentid": this.studentid,
              // "classid": "b8d3f418-d024-11e7-8f29-005056bf154b",
              // "studentid": "5cff189e-9690-11e6-a71f-00fffab6298f",
            }
          },
          '/api/commonhandle',
          true,
          (data) => {
            console.log(data);
            console.log(data[0].exampass);
            this.exampass = data[0].exampass;


            req.request({//6.4专题培训结业考试(考试完成提交考试)
                "key": ["SubmitStudenExam"],
                "postData": {
                  "examlist": this.examlist,
                  // "classid": "b8d3f418-d024-11e7-8f29-005056bf154b",
                  // "userid": "5cff189e-9690-11e6-a71f-00fffab6298f",
                  "classid": this.classid,
                  "userid": this.studentid,
                  "exampass": this.exampass
                }
              },
              '/api/commonhandle',
              true,
              (data) => {
                console.log(data);
                localStorage.removeItem([this.classid]);
                this.loading = false;
                this.result = true;
                this.$router.push({
                  path: 'answerResult',
                  query: {'classid': this.classid, 'userid': this.userid, 'studentid': this.studentid}
                })
                // this.$router.push({path: 'answerResult', query: {'message': __BASE64.encoder(this.message)}})

              })
          });

      },

      setSession(val) {
        console.log(val)
        val.map(val => {
          val.page = this.page;
        });
        console.log(val)
        localStorage.setItem([this.classid], JSON.stringify(val));
      },
      getSession(classid) {
        return JSON.parse(localStorage.getItem([classid]));
      },

      answerCardToggle() {
        this.layerToggle = !this.layerToggle;
        this.setSession(this.examlist);
      },
      resultToggle() {
        this.result = !this.result;
        this.$router.push('/')
      },
      signToggle() {
        console.log(this.page)
        this.examlist[this.page - 1].sign = !this.examlist[this.page - 1].sign;
        this.setSession(this.examlist);
      },
      next() {
        if (this.page < this.totalPage) {
          this.page++;
          this.setSession(this.examlist);
        }
      },
      prev() {
        if (this.page > 1) {
          this.page--;
          this.setSession(this.examlist);
        }
      },
      close() {
        // alert('state:' + this.state)
        // alert('tip:' + this.tip)
        // alert('version:')
        // alert(this.version == 'android')
        // alert(this.version == 'android' && (!this.tip || !this.state))
        this.setSession(this.examlist);
        if (this.version == 'android' && (!this.tip || !this.state)) {
          // alert('关闭')
          _ActionJS.exitCurrentPage();
        }
        else if (this.version == 'ios' && (!this.tip || !this.state)) {
          exitCurrentPage();
        }
        else {
          // alert('列表')
          this.$router.go(-1);
        }
      },
      back() {
        this.setSession(this.examlist);
        this.message = false;
      }
    }
  }

</script>

<style scoped lang="less">
  @import '../../variable';

  #jq {
    display: none;
  }

  .container {
    width: @max;
    height: @max;
    /*position: absolute;*/
    /*top: 128px;*/
    padding-top: 88px;
    box-sizing: border-box;
  }

  .answer {
    padding-bottom: 152px;
    .action {
      padding: 0 24px;
      box-sizing: border-box;
      border-bottom: 1px solid @answer-col-c9; /*no*/
      .tip {
        flex-grow: 1;
        .base(@answer-col-62, @answer-col-62);
        line-height: 88px;
        span {
          .base(@theme, @answer-font-32);
        }
        span + span {
          .base(@answer-col-62, @answer-font-24);
        }
      }
      .action-btn {
        flex-grow: 1;
        justify-content: flex-end;
        a {
          width: 138px;
          height: 58px;
          border: 1px solid @answer-col-c9; /*no*/
          border-radius: 3px; /*no*/
          padding-left: 22px;
          margin-left: 10px;
          img {
            width: 26px;
            height: 33px;
            vertical-align: middle;
          }
          span {
            padding-left: 10px;
            vertical-align: middle;
            line-height: 58px;
            .base(@answer-col-62, @answer-font-20);
          }
        }
      }
    }

    .content {
      padding: 0 24px;
      box-sizing: border-box;
      .subject {
        b {
          display: block;
          .base(@answer-col-62, @answer-font-32);
          line-height: 88px;
          width: 720px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
      .result {
        padding-top: 46px;
        box-sizing: border-box;
        .title {
          .base(@answer-col-62, @answer-font-28);
          line-height: 56px;
        }
        .single {
          .box {
            width: 100%;
            min-height: 69px;
            padding: 15px 0;
          }

          input {
            display: none;
          }

          label {
            width: 100%;
            height: 100%;
            display: inline-block;
            position: relative;
            line-height: 69px;
            .base(@answer-col-62, @answer-font-28);
            padding-left: 100px;
            box-sizing: border-box;
          }
          label:active {
            background: #EEEEEE;
          }
          label:after {
            content: ""; /*必须设置*/
            display: inline-block;
            width: 70px;
            height: 70px;
            border: 1px solid @answer-col-c9; /*no*/
            position: absolute;
            top: 0px;
            left: 15px;
            border-radius: 50%;
            box-sizing: border-box;
          }

          input:checked + label:after {
            /*background-color: @theme;*/
            background: url(../../assets/raido.png) no-repeat;
            background-size: 100%;
          }
        }
        .multi {
          .box {
            width: 100%;
            min-height: 75px;
            padding: 15px 0;
          }
          input {
            display: none;
          }
          label {
            width: 100%;
            height: 100%;
            display: inline-block;
            line-height: 75px;
            position: relative;
            .base(@answer-col-62, @answer-font-28);
            padding-left: 100px;
            box-sizing: border-box;
          }
          label:active {
            background: #EEEEEE;
          }
          label:after {
            content: "";
            width: 71px;
            height: 71px;
            /*border: 1px solid @answer-col-c9; !*no*!*/
            display: inline-block;
            position: absolute;
            top: 0;
            left: 15px;
            background: url(../../assets/no-multi.png) no-repeat;
            background-size: 100%;
          }
          input:checked + label:after {
            content: "";
            /* color: @white;
             text-align: center;
             font-size: 60px;*/
            background: url(../../assets/multi.png) no-repeat;
            background-size: 100%;
          }

        }
      }
    }

    .submit {
      position: fixed;
      bottom: 0;
      background-color: @white;
      width: @max;
      height: 152px;
      padding-top: 32px;
      box-sizing: border-box;
      text-align: center;
      z-index: 100;
      div {
        flex-grow: 1;
        button {
          background-color: @theme;
          border-radius: 5px; /*no*/
          border: 0;
          width: 258px;
          line-height: 88px;
          .base(@white, @answer-font-30);
        }
        button.no {
          color: @answer-col-62;
          background-color: @white;
          border: 1px solid @answer-col-c9; /*no*/
        }
      }

    }
  }

  .answerCard {
    padding-bottom: 152px;
    .subject {
      padding: 0 27px;
      box-sizing: border-box;
      border-bottom: 1px solid @answer-col-c9; /*no*/
      b {
        .base(@answer-col-62, @answer-font-32);
        line-height: 88px;
        width: 728px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      a {
        display: inline-block;
        font-size: 50px;
        height: 50px;
        line-height: 88px;
      }
    }

    .guide {
      padding-top: 36px;
      dl {
        width: @max;
        dt {
          .base(@answer-col-62, @answer-font-28);
          padding: 0 24px;
          box-sizing: border-box;

        }
        dd {
          .base(@answer-col-62, @answer-font-28);
          width: 20%;
          height: 108px;
          display: flex;
          justify-content: center;
          align-items: center;
          a {
            display: block;
            border-radius: 50%;
            border: 4px solid @answer-col-c9; /*no*/
            .base(@answer-col-62, @answer-font-28);
            width: 68px;
            height: 68px;
            line-height: 68px;
            text-align: center;
          }
          a.sel {
            background-color: @theme;
            color: @white;
          }
          a.sign {
            border-color: #1F86FF
          }
        }
      }
    }
    .submit {
      position: fixed;
      bottom: 0;
      background-color: @white;
      width: @max;
      height: 152px;
      padding-top: 32px;
      box-sizing: border-box;
      text-align: center;
      button {
        background-color: @theme;
        border-radius: 5px; /*no*/
        border: 0;
        width: 500px;
        line-height: 88px;
        .base(@white, @answer-font-30);
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
    z-index: 1000;
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
