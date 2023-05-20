# evaclue
Platform for house rent reviews

## SETUP ENVIRONMENT
- Database:
    - go to Database folder -> open console -> make connection to mysql db (``` mysql -u username -p ```) -> run .sql file (``` source evaclue_db.sql ```)
        - some superAdmin type start user is also created
            - email: superAdmin@evaclue.pt
            - pass: diablo4Approach.

- create environemnt files in the root dir of each service (.env) and add the following lines:
    - ReviewsServices
        - 
        ``` 
        PORT = 8000
        DB_HOST = "localhost"
        DB_USER = "root"
        DB_PASSWORD = ""
        DB_NAME = "evaclue_db"
        APIKEY = "AIzaSyBq2YyQh70n_M6glKgr3U4a9vCmY5LU0xQ"
        SECRET = "greedisgood"
        DIRNAME = "" 
        ```
    - UserServices:
        - 
        ```
        SERVER_PORT = 8001
        DB_HOST = "localhost"
        DB_USER = "root"
        DB_PASSWORD = ""
        DB_NAME = "evaclue_db"
        JWT_SECRET = "greedisgood"
        DIRNAME = ""
        ```
    - UserServices\database:
        - 
        ```
        SERVER_PORT = 8001
        DB_HOST = "localhost"
        DB_USER = "root"
        DB_PASSWORD = ""
        DB_NAME = "evaclue_db"
        JWT_SECRET = "greedisgood"
        ```
    - NotificationServices:
        - 
        ```
        PORT = 8002
        DB_HOST = "localhost"
        DB_USER = "root"
        DB_PASSWORD = ""
        DB_NAME = "evaclue_db"
        SECRET = "greedisgood"

        SMTP_EMAIL = "rentifyWD@gmail.com"
        SMTP_HOST = "smtp.gmail.com"
        SMTP_PORT = 587
        SMTP_USER = "rentifywd@gmail.com"
        SMTP_PASS = "kxjkqatwgtyefpzy"
        ```
    - userclient (View):
        - 
        ```
        VUE_APP_SERVER_PORT = 8001
        ```

- Install all dependencies:
    - install gulp
        - ``` npm install --global gulp-cli ```
    - go to the root dir of project (evaclue/) and run command: 
        - ``` gulp build ```

- Start Application:
    - run:
        - ``` gulp start ``` (a web page should open automatically)

## Some images about the architecture [deprecated]:
![Screenshot](imgs/arq.png)
![Screenshot](imgs/wAPIGAT.png)

## Tasks
**[to be done until 23/05 ]:**
- [x] transport from rentify to here | *dennis/daniel*
- [ ] landing page | *dennis*
- [x] complete notification services (can already be use) | *daniel*
- [ ] email template | *dennis/daniel*
- [ ] buy domain | *daniel*
- [x] deploy documentation | *daniel*
- [x] add NotificationService to gulp configuration | *daniel*
