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

# Clear the console
Clear-Host

# Display Evaclue Setup Configuration
Write-Host "╔══════════════════════════════════════╗" -ForegroundColor red
Write-Host "║     EVACLUE - Setup Wizard v0.1      ║" -ForegroundColor red
Write-Host "╚══════════════════════════════════════╝" -ForegroundColor red
Write-Host

# Prompt for MySQL database setup
Write-Host "MySQL Database Setup" -ForegroundColor Yellow
Write-Host "-------------------" -ForegroundColor Yellow
Write-Host
$mysqlSetup = @{
    "DB_HOST"     = "localhost"
    "DB_USER"     = $rootUser
    "DB_PASSWORD" = "$rootPassword"
    "DB_NAME"     = "evaclue_db"
}
$mysqlSetup.GetEnumerator() | ForEach-Object {
    $key = $_.Key
    $value = $_.Value
    Write-Host "$key = $value"
}
Write-Host

# Go to the Database folder
Set-Location -Path ".\Database"

# Make connection to the MySQL database
mysql -u $rootUser -p"$rootPassword" -e "source evaclue_db.sql"

# Go back to the Root directory
Set-Location -Path ".."

# Prompt for logs folders
Write-Host
Write-Host "Logs Folders Setup" -ForegroundColor Yellow
Write-Host "------------------" -ForegroundColor Yellow
Write-Host
$logsPath = @(
    ".\Services\NotificationService\logs",
    ".\Services\ReviewsService\logs",
    ".\Services\UsersService\logs"
)
foreach ($path in $logsPath) {
    CreateDirectoryIfNotExists $path
    Write-Host "Created logs folder: $path"
}
Write-Host

# Prompt for Reviews Service setup
Write-Host "Reviews Service Setup" -ForegroundColor Yellow
Write-Host "---------------------" -ForegroundColor Yellow
Write-Host
$reviewsServiceDirname = Read-Host -Prompt "Enter Reviews Service resProofFiles DIRNAME"
$reviewsServiceSetup = @{
    "PORT"    = 8000
    "DB_HOST" = "localhost"
    "DB_USER" = $rootUser
    "DB_PASSWORD" = "$rootPassword"
    "DB_NAME" = "evaclue_db"
    "APIKEY" = "AIzaSyBq2YyQh70n_M6glKgr3U4a9vCmY5LU0xQ"
    "SECRET" = "greedisgood"
    "DIRNAME" = $reviewsServiceDirname
}
$reviewsServiceSetup.GetEnumerator() | ForEach-Object {
    $key = $_.Key
    $value = $_.Value
    Write-Host "$key = $value"
}
Write-Host

# Prompt for Users Service setup
Write-Host "Users Service Setup" -ForegroundColor Yellow
Write-Host "--------------------" -ForegroundColor Yellow
Write-Host
$usersServiceDirname = Read-Host -Prompt "Enter Users Service userImages DIRNAME"
$usersServiceSetup = @{
    "SERVER_PORT" = 8001
    "DB_HOST"     = "localhost"
    "DB_USER"     = $rootUser
    "DB_PASSWORD" = "$rootPassword"
    "DB_NAME"     = "evaclue_db"
    "JWT_SECRET"  = "greedisgood"
    "DIRNAME"     = $usersServiceDirname
}
$usersServiceSetup.GetEnumerator() | ForEach-Object {
    $key = $_.Key
    $value = $_.Value
    Write-Host "$key = $value"
}
Write-Host

# Prompt for Notification Service setup
Write-Host "Notification Service Setup" -ForegroundColor Yellow
Write-Host "--------------------------" -ForegroundColor Yellow
Write-Host
$notificationServiceSetup = @{
    "PORT"         = 8002
    "DB_HOST"      = "localhost"
    "DB_USER"      = $rootUser
    "DB_PASSWORD"  = "$rootPassword"
    "DB_NAME"      = "evaclue_db"
    "SECRET"       = "greedisgood"
    "SMTP_EMAIL"   = "rentifyWD@gmail.com"
    "SMTP_HOST"    = "smtp.gmail.com"
    "SMTP_PORT"    = 587
    "SMTP_USER"    = "rentifywd@gmail.com"
    "SMTP_PASS"    = "kxjkqatwgtyefpzy"
}
$notificationServiceSetup.GetEnumerator() | ForEach-Object {
    $key = $_.Key
    $value = $_.Value
    Write-Host "$key = $value"
}
Write-Host

# Prompt for User Client setup
Write-Host "User Client Setup" -ForegroundColor Yellow
Write-Host "-----------------" -ForegroundColor Yellow
Write-Host
$userClientSetup = @{
    "VUE_APP_SERVER_PORT" = 8001
}
$userClientSetup.GetEnumerator() | ForEach-Object {
    $key = $_.Key
    $value = $_.Value
    Write-Host "$key = $value"
}
Write-Host

# Install gulp globally
Write-Host "Installing gulp globally..." -ForegroundColor Cyan
npm install --global gulp-cli

# Install project dependencies
Write-Host "Installing project dependencies..." -ForegroundColor Cyan
npm install

# Build the application
Write-Host "Building the application..." -ForegroundColor Cyan
gulp build

Write-Host
Write-Host "Setup configuration completed successfully!" -ForegroundColor Green
