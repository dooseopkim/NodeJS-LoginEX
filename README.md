# NodeJS-LoginEX
NodeJS, Express, Passport 를 활용한 로그인 실습  
로컬 로그인, 구글로그인, 깃헙로그인, 카카오로그인 구현,  
template 엔진 pug를 적용함  

## Environment
Node : v10.15.0  
npm : v6.4.1  
DB : MySQL 5.6.39 for windows    
Dependencies :
```js
  "dependencies": {
    "bcrypt": "^3.0.6",
    "compression": "^1.7.4",
    "connect-flash": "^0.1.1",
    "cookie-parser": "^1.4.4",
    "debug": "^4.1.1",
    "express": "^4.16.4",
    "express-session": "^1.16.1",
    "morgan": "~1.9.0",
    "mysql": "^2.17.1",
    "passport": "^0.4.0",
    "passport-facebook": "^3.0.0",
    "passport-github2": "^0.1.11",
    "passport-google-oauth": "^2.0.0",
    "passport-kakao": "0.0.5",
    "passport-local": "^1.0.0",
    "passport-naver": "^1.0.6",
    "pug": "^2.0.3",
    "sanitize-html": "^1.20.0",
    "session-file-store": "^1.2.0",
    "shortid": "^2.2.14",
    "tmp": "^0.1.0"
  }
```
&nbsp;  
## Clone & Install
### Step 1.
```sh
git clone https://github.com/dooseopkim/NodeJS-LoginEX.git

cd NodeJS-LoginEX

npm install
```
### Step 2.  
If you installed a pm2 run `npm start` script, if not run with `node ./bin/www.`  
I recommend installing pm2.
Installing pm2 
```sh
npm install pm2 -g
```
If you want to know more about pm2. [Clik here!](https://www.npmjs.com/package/pm2)
```sh
# Installed pm2
npm start
# Not installed pm2
node ./bin/www
```
### Step 3.  
Open the Chrome Web browser.  
URL : `http://localhost:3000`
![image](https://user-images.githubusercontent.com/34496143/58231634-712c8e80-7d72-11e9-9f5d-2f07208559a3.png)
If you see this screen, it's a success.
### Step 4.

# Working History
### Step 1. Local User login
Passport Strategy 추가
### Directory Tree  
```sh
│  app.js
│  package-lock.json
│  package.json
│  README.md
├─bin
│  www // npm start is (pm2 start ./bin/www --watch --ignore-watch='session')
│  
├─config
│      _key.json        // .gitignore
│      keyTemplate.json // same structure as _key.json
│      table.sql        // ddl
│
├─lib
│      db.js
│      query.js
│      strategies.js
│      util.js
│      
├─node_modules //.gitignore
│  ├─...
│
├─public
│  ├─images
│  ├─javascripts
│  │      boardAdd.js
│  │      common.js
│  │      validation.js
│  │      
│  └─stylesheets
│          style.css
│          
├─routes
│      boards.js
│      images.js
│      index.js
│      signin.js
│      user.js
│      
├─sessions //.gitignore
│  ├─...
│      
└─views
    │  common.pug
    │  error.pug
    │  layout.pug
    │  mixins.pug
    │  
    └─includes
        │  footer.pug
        │  head.pug
        │  nav.pug
        │  
        └─contents
                _basic.pug
                _boardAdd.pug
                _login.pug
                _mypage.pug
                _signin.pug
```  

2 Add Dependencies & npm install
```javascript
// package.json
  "dependencies": {
    "bcrypt": "^3.0.6",
    "body-parser": "^1.19.0",
    "compression": "^1.7.4",
    "connect-flash": "^0.1.1",
    "cookie-parser": "^1.4.4",
    "express": "^4.16.4",
    "express-session": "^1.16.1",
    "mysql": "^2.17.1",
    "passport": "^0.4.0",
    "passport-local": "^1.0.0",
    "sanitize-html": "^1.20.0",
    "session-file-store": "^1.2.0",
    "shortid": "^2.2.14"
  }
```
`npm install`  
&nbsp;  

3 Directory Tree  
```sh
│  app.js
│  package-lock.json
│  package.json
│  README.md
├─bin
│  www // npm start is (pm2 start ./bin/www --watch --ignore-watch='session')
│  
├─config
│      _key.json        // .gitignore
│      keyTemplate.json // same structure as _key.json
│      table.sql        // ddl
│
├─lib
│      db.js
│      query.js
│      strategies.js
│      util.js
│      
├─node_modules //.gitignore
│  ├─...
│
├─public
│  ├─images
│  ├─javascripts
│  │      boardAdd.js
│  │      common.js
│  │      validation.js
│  │      
│  └─stylesheets
│          style.css
│          
├─routes
│      boards.js
│      images.js
│      index.js
│      signin.js
│      user.js
│      
├─sessions //.gitignore
│  ├─...
│      
└─views
    │  common.pug
    │  error.pug
    │  layout.pug
    │  mixins.pug
    │  
    └─includes
        │  footer.pug
        │  head.pug
        │  nav.pug
        │  
        └─contents
                _basic.pug
                _boardAdd.pug
                _login.pug
                _mypage.pug
                _signin.pug
```  
&nbsp;  
4 Passport Strategy 추가
***
4.1 LocalStrategy  
&nbsp;  
loginForm
```javascript
/* 
  ./views/includes/contents/_login.pug
  - LocalStrategy
*/
.container.d-flex.flex-column.justify-content-around.align-items-center.c-content-area
  form.border.border-dark.rounded.p-5(action='/user/login',method='POST')
    h2 LogIn
    label(for='userEmail') Email
    input#userEmail.form-control(type='text' name='userEmail' placeholder='Email..' required='')
    label.mt-2(for='userPassword') Password
    input#userPassword.form-control(type='text' name='userPassword' placeholder='Password..' required='')
    button.btn.btn-outline-success.w-100.mt-2(type='submit') LogIn
    a.mt-1(href='/user/signin') New Account
    .row
      a.btn.btn-outline-info.w-100(href='/user/auth/google') Login with Google

```
로그인 Form안에 input태그의 name속성을 보면 'userEmail', 'userPassword'로 되어있다.  
passport가 제공하는 form에서의 Default name속성이 'username', 'password' 이므로  
이 값들을 일치시켜줘야한다.  
하단에 보이는 `new LocalStrategy()` 에 첫번째 인자로 
```
{
  usernameField: "userEmail",
  passwordField: "userPassword"
}
```
객체를 추가해주자  
&nbsp;  

```javascript
/* 
  ./lib/strategies.js 
  - LocalStrategy
*/
passport.use(
    new LocalStrategy(
      {
        usernameField: "userEmail",
        passwordField: "userPassword"
      },
      function(username, password, done) {
        db.query(queries.USER_SELECT_ONE_FOR_LOGIN, [username], function(err, result) {
          if (err) throw err;
          var user = result[0];
          if (user) {
            if (bcrypt.compareSync(password, user.password)) {
              return done(null, user, { message: "Login Success" });
            } else {
              return done(null, false, { message: "Incorrect password." });
            }
          } else {
            return done(null, false, { message: "Incorrect username." });
          }
        });
      }
    )
  );
```
4.2 GoogleStrategy  
&nbsp;  dev사이트 : https://console.developers.google.com  
&nbsp;  Passport Docs : http://www.passportjs.org/docs/google/
&nbsp;  

4.3 GithubStrategy  
&nbsp;  dev사이트 : https://github.com/settings/developers  
&nbsp;  Passport Docs : http://www.passportjs.org/packages/passport-github2/  
깃헙 계정의 가입된 email이 아니라 profile상에 email이 등록되어있어야  
email값이 읽혀진다. (그렇지 않다면 email은 null값)  
&nbsp;  

4.3 KakaoStrategy  
&nbsp;  dev사이트 : https://developers.kakao.com/  
&nbsp;  Passport Docs : http://www.passportjs.org/packages/passport-kakao/  
&nbsp;  
***
## TodoList
### LocalStrategy
- [x] 회원가입 (Create)
- [x] 회원정보조회 (Read)
- [ ] 회원정보수정 (Update)
- [ ] 회원정보삭제 (Delete)
&nbsp;  
### Validation of signup page
- [x] 이메일중복
- [x] 비밀번호유효성1 (비밀번호 두 번 입력확인)
- [x] 비밀번호유효성2 (8자 이상 문자+숫자)
- [x] 닉네임중복

## Reference & Useful Site
- [정규표현식을 테스트해볼 수 있는 사이트](https://www.regexpal.com/)