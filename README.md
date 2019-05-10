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
