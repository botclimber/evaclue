# evaclue
Platform for house rent reviews

## SETUP ENVIRONMENT
- Database:
    - go to Database folder -> open console -> make connection to mysql db (``` mysql -u username -p ```) -> run .sql file (``` source evaclue_db.sql ```)
        - some superAdmin type start user is also created
            - email: superAdmin@evaclue.pt
            - pass: diablo4Approach.

- create "ecosystem.config.js" file on root dir with following code:
```
module.exports = {
  apps:[{
    name: "evaclue-landingPage",
    script: "./Views/evaclue-landingPage/index.js",
    watch: true,
    env: {
      "PORT": 80
    }
  },

  {
    name: "NotificationServices",
    script: "./Services/NotificationService/index.js",
    watch: true,
    env: {
      "PORT": 8002,
      "DB_HOST": "localhost",
      "DB_USER": "root",
      "DB_PASSWORD": "",
      "DB_NAME": "evaclue_db",
      "SECRET": "greedisgood",
    
      "SMTP_EMAIL": "rentifyWD@gmail.com",
      "SMTP_HOST": "smtp.gmail.com",
      "SMTP_PORT": 587,
      "SMTP_USER": "rentifywd@gmail.com",
      "SMTP_PASS": "kxjkqatwgtyefpzy"
    }
  },

  {
    name: "ReviewsService",
    script: "./Services/ReviewsService/index.js",
    watch: true,
    env: {
      "PORT": 8000,
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
      "SERVER_PORT": 8001,
      "DB_HOST": "localhost",
      "DB_USER": "root",
      "DB_PASSWORD": "",
      "DB_NAME": "evaclue_db",
      "JWT_SECRET": "greedisgood",
      "DIRNAME": ""
    }
  }
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
        - ``` pm2 start ecosystem.config.json ```

    - for dev purposes (MANDATORY):
        - ``` gulp start ``` (this is needed to deploy front-end pages)

## Some images about the architecture [deprecated]:
![Screenshot](imgs/arq.png)
![Screenshot](imgs/wAPIGAT.png)

## Tasks
**[to be done until 23/05 ]:**
- [x] transport from rentify to here | *dennis/daniel*
- [x] landing page | *dennis*
- [x] complete notification services (can already be use) | *daniel*
- [ ] email template | *dennis/daniel*
- [x] buy domain | *daniel*
- [x] deploy documentation | *daniel*
- [x] add NotificationService to gulp configuration | *daniel*
- [ ] ![#f03c15](https://placehold.co/15x15/f03c15/f03c15.png) add possibility to recieve email and filter multiple regions/rent price/ and then maybe in the future rating average | *daniel* 
