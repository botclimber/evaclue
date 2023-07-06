# Prompt for root DB user and password
$rootUser = Read-Host -Prompt "Enter the root DB user"
$rootPassword = Read-Host -Prompt "Enter the root DB password" -AsSecureString
$rootPassword = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto([System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($rootPassword))

# Function to create a directory if it doesn't exist
function CreateDirectoryIfNotExists($path) {
    if (-not (Test-Path $path -PathType Container)) {
        New-Item -Path $path -ItemType Directory -Force | Out-Null
    }
}

# Go to the Database folder
Set-Location -Path ".\Database"

# Make connection to the MySQL database
mysql -u $rootUser -p"$rootPassword" -e "source evaclue_db.sql"

# Go back to the Root directory
Set-Location -Path ".."

# Create logs folders in different directories
$logsPath = @(
    ".\Services\NotificationService\logs",
    ".\Services\ReviewsService\logs",
    ".\Services\UsersService\logs"
)

foreach ($path in $logsPath) {
    CreateDirectoryIfNotExists $path
}

# Prompt for dirnames
$reviewsServiceDirname = Read-Host -Prompt "Enter Reviews Service resProofFiles DIRNAME"
$usersServiceDirname = Read-Host -Prompt "Enter Users Service userImages DIRNAME"

# Create environment files for ReviewsService
@"
PORT = 8000
DB_HOST = "localhost"
DB_USER = "$rootUser"
DB_PASSWORD = "$rootPassword"
DB_NAME = "evaclue_db"
APIKEY = "AIzaSyBq2YyQh70n_M6glKgr3U4a9vCmY5LU0xQ"
SECRET = "greedisgood"
DIRNAME = "$reviewsServiceDirname"
"@ | Set-Content -Path ".\Services\ReviewsService\.env" -Encoding utf8

# Create environment files for UsersService
@"
SERVER_PORT = 8001
DB_HOST = "localhost"
DB_USER = "$rootUser"
DB_PASSWORD = "$rootPassword"
DB_NAME = "evaclue_db"
JWT_SECRET = "greedisgood"
DIRNAME = "$usersServiceDirname"
"@ | Set-Content -Path ".\Services\UsersService\.env" -Encoding utf8

# Create environment files for UsersService/database
@"
SERVER_PORT = 8001
DB_HOST = "localhost"
DB_USER = "$rootUser"
DB_PASSWORD = "$rootPassword"
DB_NAME = "evaclue_db"
JWT_SECRET = "greedisgood"
"@ | Set-Content -Path ".\Services\UsersService\database\.env" -Encoding utf8

# Create environment files for NotificationService
@"
PORT = 8002
DB_HOST = "localhost"
DB_USER = "$rootUser"
DB_PASSWORD = "$rootPassword"
DB_NAME = "evaclue_db"
SECRET = "greedisgood"
SMTP_EMAIL = "rentifyWD@gmail.com"
SMTP_HOST = "smtp.gmail.com"
SMTP_PORT = 587
SMTP_USER = "rentifywd@gmail.com"
SMTP_PASS = "kxjkqatwgtyefpzy"
"@ | Set-Content -Path ".\Services\NotificationService\.env" -Encoding utf8

# Create environment files for userclient
@"
VUE_APP_SERVER_PORT=8001
"@ | Set-Content -Path ".\Views\userclient\.env" -Encoding utf8

# Install gulp globally
npm install --global gulp-cli

# Install project dependencies
npm install

# Build the application
gulp build