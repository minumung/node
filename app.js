var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var models = require("./models/index.js");
const common = require('./common/common')
var session = require('express-session');



/**
 * 프로파일 지정   
 * 윈도우 : set NODE_ENV=local&&npm start로 실행
 * 리눅스 : export NODE_ENV=local&&npm start로 실행
 */
var dotenv = require('dotenv');
dotenv.config({           
  path: path.resolve(
    process.cwd(),
    process.env.NODE_ENV = ".env."+process.env.NODE_ENV
  )
});



var app = express();

/**
 * 세션을 사용하겠다는 의미
 */
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}));

/**
 * 미들웨어 request가 오면 무조건 거친다
 */
app.use(function (req, res, next) { 
  
  /**
   * response meta 데이터 초기화
   */
  common.reset(); 

  /**
   * 관리자 로그인 후 세션에 값을 담았다면 request 요청시마다 response데이터에 세션값 넣기
   */
  if(req.session.ADMIN && req.session.ADMIN.admin_seq){
    res.locals.ADMIN = req.session.ADMIN;
  }else{
    res.locals.ADMIN = {}
  }
  next();
});



/**
 * 뷰 엔진 셋팅 ejs로 셋팅함
 */
app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', require('ejs').renderFile);
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


/**
 * 라우터 설정
 */
var boardRoutes = require('./routes/admin.route');
app.use('/api/v1/admin', boardRoutes);

/**
 * 관리자
 */

app.use('/supervise/login', require('./routes/admin/login.route'));
app.use('/supervise/admin', require('./routes/admin/admin.route'));
app.use('/supervise/faq', require('./routes/admin/faq.route'));
app.use('/supervise/contact', require('./routes/admin/contact.route'));
app.use('/supervise/notice', require('./routes/admin/notice.route'));
app.use('/supervise/common', require('./routes/admin/common.route'));
app.use('/se2', require('./routes/admin/smartedit.route'));
app.use('/supervise', require('./routes/admin/index.route'));

/**
 * 404에러시 실행될 함수
 */
app.use(function(req, res, next) {
  next(createError(404));
});

/**
 * 에러시 실행될 함수
 */
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.get('/images/:sub_folder/:file_name', function(req,res){
  console.log('/images/'+req.params.sub_folder+'/'+req.params.file_name)
  fs.readFile('/images/'+req.params.sub_folder+'/'+req.params.file_name, function(err, data){
    res.writeHead(200, {'Content-Type':'text/html'});
    res.end(data);
  })
})


/**
 * DB 연결 체크
 */
models.sequelize.sync().then( () => {
  console.log(" DB 연결 성공");
}).catch(err => {
  console.log("연결 실패");
  console.log(err);
});

module.exports = app;
