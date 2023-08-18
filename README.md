# evaclue

Platform for house rent reviews

## SETUP ENVIRONMENT

- Database:

  - go to Database folder -> open console -> make connection to mysql db (`mysql -u username -p`) -> run .sql file (`source evaclue_db.sql`)
    - some superAdmin type start user is also created
      - email: superAdmin@evaclue.pt
      - pass: diablo4Approach.

- create "system.config.js" file on root dir with following code (fill missing parameters with what suits you better):
- For Windows Machine check second example of the file

```
const domain = "http://localhost"

/* 
if VIEWS ports are changed here, you also need 
to change it on the correct location.
*/
const mainPlatformPort = 8010 
const loginPagePort = 8011
const adminPlatformPort = 8012

const revPort   = 8000
const userPort  = 8001
const notPort   = 8002

const apiPORT = 80


module.exports = {
    apps : [
        {
            name   : "ApiGateaway",
            script : "./ApiGateaway/index.js",
            watch: true,
            env: {
                "domain": domain,
                "PORT": apiPORT,
                "not_PORT": notPort,
                "rev_PORT": revPort,
                "user_PORT": userPort,
                "mainPage_PORT": mainPlatformPort,
                "loginPage_PORT": loginPagePort,
                "adminPage_PORT": adminPlatformPort
            }
        },
        {
            name   : "NotService",
            script : "./Services/NotificationService/index.js",
            watch: true,
            env: {
                "domain": domain,
                "mainPage_PORT": mainPlatformPort,
                "PORT": notPort,
                "SMTP_EMAIL": "supp.evaclue@gmail.com",
                "SMTP_HOST": "smtp.gmail.com",
                "SMTP_PORT": 587,
                "SMTP_USER": "supp.evaclue@gmail.com",
                "SMTP_PASS": "drqohvkkewrkrnjt"
            }
        },
        {
            name   : "RevServices",
            script: "./Services/ReviewsService/index.js",
            watch: true,
            env: {
                "PORT": revPort,
                "not_PORT": notPort,
                "DB_HOST": "localhost",
                "DB_USER": "root",
                "DB_PASSWORD": "greedisgood",
                "DB_NAME": "evaclue_db",
                "APIKEY": "AIzaSyBq2YyQh70n_M6glKgr3U4a9vCmY5LU0xQ",
                "SECRET": "greedisgood",
                "DIRNAME": "/Users/danielsilva/Documents/evaclue/Views/Admin/src/assets/images/resProofFiles/"
            }
        },
        {
            name: "UsersService",
            script: "./Services/UsersService/dist/src/server.js",
            watch: true,
            env: {
                "SERVER_PORT": userPort,
                "DB_HOST": "localhost",
                "DB_USER": "root",
                "DB_PASSWORD": "greedisgood",
                "DB_NAME": "evaclue_db",
                "JWT_SECRET": "greedisgood",
                "DIRNAME": "/Users/danielsilva/Documents/evaclue/Views/MainPlatform/src/images/userImages/"
            }
        },

        {
            name   : "MainPlatform",
            cwd    : "./Views/MainPlatform/app",
            script : "npm",
            args   : "start",
            watch  : true,
        },

        {
            name   : "authPage",
            cwd    : "./Views/userclient",
            script : "npm",
            args   : "run serve",
            watch  : true,
        },

        {
            name   : "AdminPlatform",
            cwd    : "./Views/Admin",
            script : "npm",
            args   : "run dev",
            watch  : true
        },

    ]
}
```

-For Windows Machines:

```

const domain = "http://localhost";

/* 
if VIEWS ports are changed here, you also need 
to change it on the correct location.
*/
const mainPlatformPort = 8010;
const loginPagePort = 8011;
const adminPlatformPort = 8012;

const revPort = 8000;
const userPort = 8001;
const notPort = 8002;
const landPort = 80;

module.exports = {
  apps: [
    {
      name: "NotService",
      script: "./Services/NotificationService/index.js",
      watch: true,
      env: {
        PORT: notPort,
        SMTP_EMAIL: "supp.evaclue@gmail.com",
        SMTP_HOST: "smtp.gmail.com",
        SMTP_PORT: 587,
        SMTP_USER: "supp.evaclue@gmail.com",
        SMTP_PASS: "drqohvkkewrkrnjt",
      },
    },
    {
      name: "RevServices",
      script: "./Services/ReviewsService/index.js",
      watch: true,
      env: {
        PORT: revPort,
        not_PORT: notPort,
        DB_HOST: "localhost",
        DB_USER: "root",
        DB_PASSWORD: "admin",
        DB_NAME: "evaclue_db",
        APIKEY: "AIzaSyBq2YyQh70n_M6glKgr3U4a9vCmY5LU0xQ",
        SECRET: "greedisgood",
        DIRNAME: "",
      },
    },
    {
      name: "UsersService",
      script: "./Services/UsersService/dist/src/server.js",
      watch: true,
      env: {
        SERVER_PORT: userPort,
        DB_HOST: "localhost",
        DB_USER: "root",
        DB_PASSWORD: "admin",
        DB_NAME: "evaclue_db",
        JWT_SECRET: "greedisgood",
        DIRNAME: "",
      },
    },

    {
      name: "landPage",
      cwd: "./Views/evaclue-landingPage/",
      script: "startscript.js",
      watch: true,
      env: {
        "domain": domain,
        "PORT": landPort,
        "not_PORT": notPort,
        "rev_PORT": revPort,
        "user_PORT": userPort,
        "mainPage_PORT": mainPlatformPort,
        "loginPage_PORT": loginPagePort,
        "adminPage_PORT": adminPlatformPort
    }
    },

    {
      name: "MainPlatform",
      cwd: "./Views/MainPlatform/app/",
      script: "startscript.js",
      watch: true,
    },

    {
      name: "authPage",
      cwd: "./Views/userclient/",
      script: "startscript.js",
      watch: true,
    },

    {
      name: "AdminPlatform",
      cwd: "./Views/Admin/",
      script: "startscript.js",
      watch: true,
    },
  ],
};

```

- Install all dependencies (run commands in the root folder):

  - install packages
    - `npm install`

  - install gulp cli
    - `npm install --global gulp-cli`

  - install webpack globaly
    - `npm install -g webpack-dev-server`

  - install packages for all services/views:
    - `gulp build`

  - install pm2 globaly
    - `npm install pm2 -g`

  - To start Project (will run services and views):
    - `pm2 start system.config.js`

  - To open monitor page of pm2:
    - `pm2 monitor`

## Architecture:
![Screenshot](imgs/ev_v2.png)

## Versioning
![Screenshot](imgs/versionFlow.png)

## Tasks

-
