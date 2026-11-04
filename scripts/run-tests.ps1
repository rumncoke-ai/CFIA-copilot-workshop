#Requires -Version 5.1
[CmdletBinding()]
param()

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
$client = Join-Path $root "client"

try {
    $npm = (Get-Command npm.cmd -CommandType Application -ErrorAction Stop | Select-Object -First 1).Source
    Write-Host "[TEST] Running frontend baseline and participant tests."
    & $npm --prefix $client test
    if ($LASTEXITCODE -ne 0) { throw "Tests failed (exit $LASTEXITCODE)." }
    Write-Host "[PASS] Frontend tests passed. Build separately with npm.cmd --prefix .\client run build."
} catch {
    Write-Host "[FAIL] Tests incomplete: $($_.Exception.Message)" -ForegroundColor Red
    throw
}
