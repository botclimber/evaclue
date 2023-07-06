# evaclue
Platform for house rent reviews

## SETUP ENVIRONMENT
- Database:
    - go to Database folder -> open console -> make connection to mysql db (``` mysql -u username -p ```) -> run .sql file (``` source evaclue_db.sql ```)
        - some superAdmin type start user is also created
            - email: superAdmin@evaclue.pt
            - pass: diablo4Approach.

- create "system.config.js" file on root dir with following code (fill missing parameters with what suits you better):
```
const notPort = 8002
const landPort = 80
const revPort = 8000
const userPort = 8001

module.exports = {
    apps : [
        {
            name   : "NotService",
            script : "./Services/NotificationService/index.js",
            env: {
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
                "DB_HOST": "localhost",
                "DB_USER": "root",
                "DB_PASSWORD": "",
                "DB_NAME": "evaclue_db",
                "APIKEY": "AIzaSyBq2YyQh70n_M6glKgr3U4a9vCmY5LU0xQ",
                "SECRET": "greedisgood",
                "DIRNAME": ""
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
                "DB_PASSWORD": "",
                "DB_NAME": "evaclue_db",
                "JWT_SECRET": "greedisgood",
                "DIRNAME": ""
            }
        },

        {
            name   : "landPage",
            script : "./Views/evaclue-landingPage/index.js",
            env: {
                "PORT": landPort,
                "not_PORT": notPort,
                "rev_PORT": revPort,
                "user_PORT": userPort
            }
        },

        {
            name   : "MainPlatform",
            cwd    : "./Views/MapsView/app",
            script : "npm",
            args   : "start"
        },

        {
            name   : "authPage",
            cwd    : "./Views/userclient",
            script : "npm",
            args   : "run serve"
        },

        {
            name   : "AdminPlatform",
            cwd    : "./Views/Admin",
            script : "npm",
            args   : "run dev"
        },

    ]
}
```

- Install all dependencies:
    - install gulp
        - ``` npm install --global gulp-cli ```
    - go to the root dir of project (evaclue/) and run command: 
        - ``` gulp build ```

    - install pm2
        - ``` npm install pm2 -g ```

- Start Project:
    - run:
        - ``` pm2 start system.config.json ```

## Some images about the architecture:
![Screenshot](imgs/ev.png)

## Tasks
-
