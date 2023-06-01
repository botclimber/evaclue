# Function to display a loading animation with EVACLUE branding
function Show-LoadingAnimation {
    $spinner = @("/","-","\","|")
    $i = 0

    while ($true) {
        $loadingText = "Processing... $($spinner[$i]) [EVACLUE]"
        Write-Host -ForegroundColor Green "`r$loadingText"
        $i = ($i + 1) % $spinner.Length
        Start-Sleep -Milliseconds 200
    }
}

# Function to clear the loading animation
function Clear-LoadingAnimation {
    Write-Host "`r" -NoNewline
    Clear-Host
}

# Prompt for root DB user and password
Write-Host -ForegroundColor Cyan "EVACLUE Project Deployment"
Write-Host "Please enter the root DB user and password:"
$rootUser = Read-Host -Prompt "User"
$rootPassword = Read-Host -Prompt "Password" -AsSecureString
$rootPassword = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto([System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($rootPassword))

# Show loading animation while making connection to the MySQL database
Write-Host "Connecting to the MySQL database..."
Show-LoadingAnimation
mysql -u $rootUser -p"$rootPassword" -e "source evaclue_db.sql"
Clear-LoadingAnimation

# Create logs folder in different directories
Write-Host "Creating logs folders..."
$logsPath = @(
    ".\Services\NotificationService\logs",
    ".\Services\ReviewsService\logs",
    ".\Services\UsersService\logs"
)

foreach ($path in $logsPath) {
    Show-LoadingAnimation
    New-Item -Path $path -ItemType Directory -Force | Out-Null
    Clear-LoadingAnimation
}

# Prompt for dirnames
$reviewsServiceDirname = Read-Host -Prompt "Enter Reviews Service resProofFiles DIRNAME"
$usersServiceDirname = Read-Host -Prompt "Enter Users Service userImages DIRNAME"

# Create environment files for ReviewsService
Write-Host "Creating environment file for ReviewsService..."
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
Write-Host "Creating environment file for UsersService..."
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
Write-Host "Creating environment file for UsersService/database..."
@"
SERVER_PORT = 8001
DB_HOST = "localhost"
DB_USER = "$rootUser"
DB_PASSWORD = "$rootPassword"
DB_NAME = "evaclue_db"
JWT_SECRET = "greedisgood"
"@ | Set-Content -Path ".\Services\UsersService\database\.env" -Encoding utf8

# Create environment files for NotificationService
Write-Host "Creating environment file for NotificationService..."
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
Write-Host "Creating environment file for userclient..."
@"
VUE_APP_SERVER_PORT=8001
"@ | Set-Content -Path ".\Views\userclient\.env" -Encoding utf8

# Install gulp globally
Write-Host "Installing gulp globally..."
Show-LoadingAnimation
npm install --global gulp-cli
Clear-LoadingAnimation

# Install project dependencies
Write-Host "Installing project dependencies..."
Show-LoadingAnimation
npm install
Clear-LoadingAnimation

# Build the application
Write-Host "Building the application..."
Show-LoadingAnimation
gulp build
Clear-LoadingAnimation

# Finished
Write-Host -ForegroundColor Green "Deployment complete! [EVACLUE]"
