# evaclue
Platform for house rent reviews

## SETUP ENVIRONMENT
- Database:
    - go to Database folder -> open console -> make connection to mysql db (``` mysql -u username -p ```) -> run .sql file (``` source evaclue_db.sql ```)
        - some superAdmin type start user is also created
            - email: superAdmin@evaclue.pt
            - pass: diablo4

- create environemnt files in the root dir of each service (.env):
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
    - NotificationServices:
        - 
        ```
        PORT = 8002
        DB_HOST = "localhost"
        DB_USER = "root"
        DB_PASSWORD = "greedisgood"
        DB_NAME = "evaclue_db"
        SECRET = "greedisgood"
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

![Screenshot](imgs/arq.png)
![Screenshot](imgs/wAPIGAT.png)

## Tasks
**[to be done until 23/05 ]:**
- [x] transport from rentify to here | *dennis/daniel*
- [ ] landing page | *dennis*
- [ ] complete notification services (can already be use) | *daniel*
- [ ] email template | *dennis/daniel*
- [ ] buy domain | *daniel*
- [ ] deploy documentation | *daniel*
- [ ] add NotificationService to gulp configuration | *daniel*
