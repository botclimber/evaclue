#!/bin/bash

# Go to the Database folder
cd /Database

# Make connection to the MySQL database
# Replace 'username' with your MySQL username
mysql -u username -p

# Prompt for the MySQL password
read -s -p "Enter MySQL password: " mysql_password
echo

# Run .sql file
source evaclue_db.sql

# Exit the MySQL console
exit

# Go to the Root directory
cd ..

# Create logs folder in different directories
mkdir -p /Services/NotificationService/logs
mkdir -p /Services/ReviewsService/logs
mkdir -p /Services/UsersService/logs

# Create environment files for ReviewsServices
echo "PORT=8000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=evaclue_db
APIKEY=AIzaSyBq2YyQh70n_M6glKgr3U4a9vCmY5LU0xQ
SECRET=greedisgood
DIRNAME="/Services/ReviewsService"" > /Services/ReviewsService/.env

# Create environment files for UserServices
echo "SERVER_PORT=8001
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=evaclue_db
JWT_SECRET=greedisgood
DIRNAME="/Services/UsersService"" > /Services/UsersService/.env

# Create environment files for UserServices/database
echo "SERVER_PORT=8001
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=evaclue_db
JWT_SECRET=greedisgood
DIRNAME="/Services/UsersService/database"" > /Services/UsersService/database/.env

# Create environment files for NotificationServices
echo "PORT=8002
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=evaclue_db
SECRET=greedisgood
SMTP_EMAIL=rentifyWD@gmail.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=rentifywd@gmail.com
SMTP_PASS=kxjkqatwgtyefpzy" > /Services/NotificationService/.env

# Create environment files for userclient
echo "VUE_APP_SERVER_PORT=8001" > /Views/userclient/.env

# Install gulp globally
npm install --global gulp-cli

# Install project dependencies
npm install

# Build the application
gulp build

# Start the application
gulp start
