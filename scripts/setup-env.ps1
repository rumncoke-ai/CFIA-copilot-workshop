#Requires -Version 5.1
[CmdletBinding()]
param()

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
$client = Join-Path $root "client"

try {
    $node = (Get-Command node.exe -CommandType Application -ErrorAction Stop | Select-Object -First 1).Source
    $npm = (Get-Command npm.cmd -CommandType Application -ErrorAction Stop | Select-Object -First 1).Source
    $nodeVersion = & $node --version
    if ($LASTEXITCODE -ne 0) { throw "Node.js version check failed." }
    if ([version]$nodeVersion.TrimStart("v") -lt [version]"22.12.0") {
        throw "Node.js 22.12+ required; found $nodeVersion."
    }
    Write-Host "[SETUP] Node.js $nodeVersion; installing app and test dependencies."
    & $npm --prefix $client ci
    if ($LASTEXITCODE -ne 0) { throw "Dependency install failed (exit $LASTEXITCODE)." }
    Write-Host "[COMPLETE] Run scripts\run-tests.ps1, then scripts\start-app.ps1."
} catch {
    Write-Host "[FAIL] Setup incomplete: $($_.Exception.Message)" -ForegroundColor Red
    throw
}
