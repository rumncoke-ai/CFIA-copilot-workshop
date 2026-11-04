#Requires -Version 5.1
[CmdletBinding()]
param()

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
$client = Join-Path $root "client"

try {
    $npm = (Get-Command npm.cmd -CommandType Application -ErrorAction Stop | Select-Object -First 1).Source
    if (-not (Test-Path -LiteralPath (Join-Path $client "node_modules\vite\bin\vite.js") -PathType Leaf)) {
        throw "Vite is missing. Run scripts\setup-env.ps1 first."
    }
    Write-Host "[START] One React app at http://127.0.0.1:5173. Stop with Ctrl+C."
    & $npm --prefix $client run dev
    if ($LASTEXITCODE -ne 0) { throw "App exited with code $LASTEXITCODE. Inspect the startup output." }
} catch {
    Write-Host "[FAIL] App failed: $($_.Exception.Message)" -ForegroundColor Red
    throw
}
