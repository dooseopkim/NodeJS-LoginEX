# NodeJS-LoginEX
Login service using NodeJS, Express, Pug, Passport
## Init & Environment
1 `npm init`  
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
│  main.js
│  package-lock.json
│  package.json
│  README.md
│  
├─config
│      db.json       //.gitignore
│      facebook.json //.gitignore
│      google.json   //.gitignore
│      
├─lib
│      db.js
│      query.js
│      strategies.js
│      
├─node_modules //.gitignore
│  ├─...
│
├─public
│  ├─images
│  ├─javascripts
│  │      common.js
│  │      
│  └─stylesheets
│          style.css
│          
├─routes
│      index.js
│      user.js
│      
└─views
    │  common.pug
    │  error.pug
    │  layout.pug
    │  mixins.pug
    │  
    └─includes
        │  footer.pug
        │  nav.pug
        │  
        └─contents
                _login.pug
                _mypage.pug
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
<div class="panel panel-warning">
**Warning**
{: .panel-heading}
<div class="panel-body">

WARNING DESCRIPTION

</div>
</div>

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

<style>
.alert-danger {
  color: rgb(169,68,66) !important;
}
</style>
