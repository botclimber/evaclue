#!/bin/bash

# Prompt for root DB user and password
read -p "Enter the root DB user: " rootUser
read -s -p "Enter the root DB password: " rootPassword
echo

# Function to create a directory if it doesn't exist
function create_directory_if_not_exists() {
    if [ ! -d "$1" ]; then
        mkdir -p "$1"
    fi
}

# Go to the Database folder
cd "./Database"

# Make connection to the MySQL database
mysql -u "$rootUser" -p"$rootPassword" -e "source evaclue_db.sql"

# Go back to the Root directory
cd ..

# Create logs folders in different directories
logsPath=(
    "./Services/NotificationService/logs"
    "./Services/ReviewsService/logs"
    "./Services/UsersService/logs"
)

for path in "${logsPath[@]}"; do
    create_directory_if_not_exists "$path"
done

# Prompt for dirnames
read -p "Enter Reviews Service resProofFiles DIRNAME: " reviewsServiceDirname
read -p "Enter Users Service userImages DIRNAME: " usersServiceDirname

# Create environment files for ReviewsService
cat << EOF > "./Services/ReviewsService/.env"
PORT=8000
DB_HOST=localhost
DB_USER="$rootUser"
DB_PASSWORD="$rootPassword"
DB_NAME=evaclue_db
APIKEY="AIzaSyBq2YyQh70n_M6glKgr3U4a9vCmY5LU0xQ"
SECRET=greedisgood
DIRNAME="$reviewsServiceDirname"
EOF

# Create environment files for UsersService
cat << EOF > "./Services/UsersService/.env"
SERVER_PORT=8001
DB_HOST=localhost
DB_USER="$rootUser"
DB_PASSWORD="$rootPassword"
DB_NAME=evaclue_db
JWT_SECRET=greedisgood
DIRNAME="$usersServiceDirname"
EOF

# Create environment files for UsersService/database
cat << EOF > "./Services/UsersService/database/.env"
SERVER_PORT=8001
DB_HOST=localhost
DB_USER="$rootUser"
DB_PASSWORD="$rootPassword"
DB_NAME=evaclue_db
JWT_SECRET=greedisgood
EOF

# Create environment files for NotificationService
cat << EOF > "./Services/NotificationService/.env"
PORT=8002
DB_HOST=localhost
DB_USER="$rootUser"
DB_PASSWORD="$rootPassword"
DB_NAME=evaclue_db
SECRET=greedisgood
SMTP_EMAIL="rentifyWD@gmail.com"
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="rentifywd@gmail.com"
SMTP_PASS="kxjkqatwgtyefpzy"
EOF

# Create environment files for userclient
cat << EOF > "./Views/userclient/.env"
VUE_APP_SERVER_PORT=8001
EOF

# Install gulp globally
npm install --global gulp-cli

# Install project dependencies
npm install

# Build the application
gulp build
