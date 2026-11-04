#Requires -Version 5.1
[CmdletBinding()]
param()

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
$python = Join-Path $root ".venv\Scripts\python.exe"
$client = Join-Path $root "client"
$backendResult = "NOT RUN"
$frontendResult = "NOT RUN"
$overall = "FAIL"

Push-Location $root
try {
    Write-Host "[TEST] Repository: $root"
    if (-not (Test-Path -LiteralPath $python -PathType Leaf)) {
        throw "Virtual environment missing. Run scripts\setup-env.ps1 first."
    }
    $package = Get-Content -LiteralPath (Join-Path $client "package.json") -Raw | ConvertFrom-Json
    $scriptsProperty = $package.PSObject.Properties["scripts"]
    $testProperty = $null
    if ($null -ne $scriptsProperty -and $null -ne $scriptsProperty.Value) {
        $testProperty = $scriptsProperty.Value.PSObject.Properties["test"]
    }
    $frontendConfigured = $null -ne $testProperty
    if ($frontendConfigured) {
        if ($testProperty.Value -isnot [string] -or [string]::IsNullOrWhiteSpace($testProperty.Value)) {
            throw "Frontend scripts.test must be a nonempty command, or absent."
        }
        $npm = (Get-Command npm.cmd -CommandType Application -ErrorAction Stop | Select-Object -First 1).Source
        Write-Host "[TEST] Frontend command: $($testProperty.Value) (must run once, not watch)."
    } else {
        $frontendResult = "SKIPPED (no scripts.test; add the UI runner in Module 4)"
    }

    Write-Host "[TEST] Running backend tests"
    $backendResult = "FAIL"
    & $python -m pytest .\server\test_app.py -q
    if ($LASTEXITCODE -ne 0) { throw "Backend tests failed (exit $LASTEXITCODE). Frontend tests will not run." }
    $backendResult = "PASS"

    if ($frontendConfigured) {
        Write-Host "[TEST] Running frontend tests"
        $frontendResult = "FAIL"
        & $npm --prefix $client test
        if ($LASTEXITCODE -ne 0) { throw "Frontend tests failed (exit $LASTEXITCODE)." }
        $frontendResult = "PASS"
    } else {
        Write-Host "[SKIP] Frontend tests are not configured; this is not frontend verification."
    }
    $overall = "PASS (all configured suites)"
} catch {
    Write-Host "[FAIL] $($_.Exception.Message)" -ForegroundColor Red
    throw
} finally {
    Write-Host ""
    Write-Host "[SUMMARY] Backend: $backendResult"
    Write-Host "[SUMMARY] Frontend: $frontendResult"
    Write-Host "[SUMMARY] Overall: $overall"
    Write-Host "[NOTE] Build/typecheck is separate: npm --prefix `"$client`" run build"
    Pop-Location
}
