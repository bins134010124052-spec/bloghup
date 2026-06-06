# Script to start MongoDB service with Admin rights
# Requires: Run as Administrator

Write-Host "Attempting to start MongoDB service..." -ForegroundColor Cyan

# Check if MongoDB service exists
$mongoService = Get-Service -Name "MongoDB" -ErrorAction SilentlyContinue

if ($mongoService) {
    Write-Host "MongoDB service found. Status: $($mongoService.Status)" -ForegroundColor Yellow
    
    if ($mongoService.Status -eq "Stopped") {
        Write-Host "Starting MongoDB service..." -ForegroundColor Cyan
        Start-Service -Name "MongoDB"
        Start-Sleep -Seconds 2
        $mongoService = Get-Service -Name "MongoDB"
        Write-Host "MongoDB service status: $($mongoService.Status)" -ForegroundColor Green
    } else {
        Write-Host "MongoDB service is already running." -ForegroundColor Green
    }
} else {
    Write-Host "MongoDB service not found. Please ensure MongoDB is installed." -ForegroundColor Red
    exit 1
}

Write-Host "`nNow you can run the backend server:" -ForegroundColor Cyan
Write-Host "cd d:\code\Assigment\backend" -ForegroundColor White
Write-Host "npm run dev" -ForegroundColor White
