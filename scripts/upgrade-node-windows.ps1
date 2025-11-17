param()

$desired = "20.19.4"

function Info($msg) { Write-Host $msg -ForegroundColor Cyan }
function Warn($msg) { Write-Host $msg -ForegroundColor Yellow }

# Kiểm tra nvm (nvm-windows cung cấp lệnh 'nvm')
$gotNvm = Get-Command nvm -ErrorAction SilentlyContinue

if ($gotNvm) {
    Info "nvm đã có trên hệ thống. Bắt đầu cài Node $desired..."
    & nvm install $desired
    & nvm use $desired
    Info "Hoàn tất. Phiên bản Node hiện tại: $(node -v)"
    Info "Mở terminal mới và chạy: yarn install"
} else {
    Warn "Không tìm thấy nvm trên hệ thống."
    Warn "Vui lòng cài nvm-windows từ trang releases rồi chạy script này lại."
    Start-Process "https://github.com/coreybutler/nvm-windows/releases"
    exit 1
}
