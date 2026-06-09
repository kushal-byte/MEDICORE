Param(
    [string]$action = "run"
)

function Test-GppAvailable {
    $gpp = Get-Command g++ -ErrorAction SilentlyContinue
    return $gpp -ne $null
}

if (-not (Test-GppAvailable)) {
    Write-Host "g++ not found in PATH. Install a C++ toolchain (WSL/MSYS2/MinGW/Chocolatey) and ensure g++ is available." -ForegroundColor Yellow
    exit 1
}

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
$srcFiles = Get-ChildItem -Path $scriptDir -Filter '*.cpp' | ForEach-Object { $_.FullName }
$outputPath = Join-Path $scriptDir "hms_demo.exe"

switch ($action.ToLower()) {
    'build' {
        if ($srcFiles.Count -eq 0) {
            Write-Host "No .cpp files found in $scriptDir" -ForegroundColor Red
            exit 1
        }
        $args = @('-std=c++17','-O2') + $srcFiles + @('-I',$scriptDir,'-o',$outputPath)
        Write-Host "Compiling with g++..."
        & g++ @args
        if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
        Write-Host "Built: $outputPath"
        break
    }
    'run' {
        # build first
        & powershell -NoProfile -ExecutionPolicy Bypass -File $MyInvocation.MyCommand.Definition build
        if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
        if (-not (Test-Path $outputPath)) {
            Write-Host "Built executable not found: $outputPath" -ForegroundColor Red
            exit 1
        }
        Write-Host "Running: $outputPath`n"
        & $outputPath
        exit $LASTEXITCODE
    }
    'clean' {
        if (Test-Path $outputPath) {
            Remove-Item $outputPath -Force
            Write-Host "Removed: $outputPath"
        } else {
            Write-Host "Nothing to clean." -ForegroundColor Gray
        }
        break
    }
    default {
        Write-Host "Usage: windows-build-run.ps1 [build|run|clean]" -ForegroundColor Cyan
        exit 1
    }
}
