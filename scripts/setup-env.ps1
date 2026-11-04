#Requires -Version 5.1
[CmdletBinding()]
param(
    [string]$PythonCommand = "python"
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
$venv = Join-Path $root ".venv"
$venvPython = Join-Path $venv "Scripts\python.exe"
$requirements = Join-Path $root "server\requirements.txt"
$client = Join-Path $root "client"

try {
    Write-Host "[SETUP] Repository: $root"
    Write-Host "[SETUP] Requires Python 3.11+, Node.js 22.12+, npm, and package-feed access."
    foreach ($path in @($requirements, (Join-Path $client "package.json"), (Join-Path $client "package-lock.json"))) {
        if (-not (Test-Path -LiteralPath $path -PathType Leaf)) {
            throw "Required file missing: $path"
        }
    }
    $python = (Get-Command $PythonCommand -CommandType Application -ErrorAction Stop | Select-Object -First 1).Source
    $node = (Get-Command node.exe -CommandType Application -ErrorAction Stop | Select-Object -First 1).Source
    $npm = (Get-Command npm.cmd -CommandType Application -ErrorAction Stop | Select-Object -First 1).Source
    $pythonVersion = & $python -c "import sys; print(sys.version.split()[0])"
    if ($LASTEXITCODE -ne 0) { throw "Python version check failed." }
    if ([version]$pythonVersion -lt [version]"3.11") { throw "Python 3.11+ required; found $pythonVersion." }
    $nodeVersion = & $node --version
    if ($LASTEXITCODE -ne 0) { throw "Node.js version check failed." }
    if ([version]$nodeVersion.TrimStart("v") -lt [version]"22.12.0") {
        throw "Node.js 22.12+ required; found $nodeVersion."
    }
    Write-Host "[SETUP] Python $pythonVersion; Node.js $nodeVersion"

    if (Test-Path -LiteralPath $venv) {
        if (-not (Test-Path -LiteralPath $venvPython -PathType Leaf) -or
            -not (Test-Path -LiteralPath (Join-Path $venv "pyvenv.cfg") -PathType Leaf)) {
            throw "Existing .venv is not a usable virtual environment. Inspect it before replacing it."
        }
        Write-Host "[SETUP] Reusing existing .venv; PythonCommand does not replace its interpreter."
    } else {
        Write-Host "[SETUP] Creating .venv"
        & $python -m venv $venv
        if ($LASTEXITCODE -ne 0) { throw "Virtual environment creation failed (exit $LASTEXITCODE)." }
    }
    $venvVersion = & $venvPython -c "import sys; print(sys.version.split()[0])"
    if ($LASTEXITCODE -ne 0) { throw "Virtual environment Python check failed." }
    if ([version]$venvVersion -lt [version]"3.11") { throw ".venv requires Python 3.11+; found $venvVersion." }
    Write-Host "[SETUP] Installing backend dependencies with .venv Python $venvVersion"
    & $venvPython -m pip install -r $requirements
    if ($LASTEXITCODE -ne 0) { throw "Backend install failed (exit $LASTEXITCODE)." }
    Write-Host "[PASS] Backend dependencies installed."

    Write-Host "[SETUP] Installing frontend dependencies from package-lock.json"
    & $npm --prefix $client ci
    if ($LASTEXITCODE -ne 0) { throw "Frontend install failed (exit $LASTEXITCODE)." }
    Write-Host "[PASS] Frontend dependencies installed."
    Write-Host "[COMPLETE] Setup succeeded. Run scripts\run-tests.ps1, then scripts\start-app.ps1."
} catch {
    Write-Host "[FAIL] Setup incomplete: $($_.Exception.Message)" -ForegroundColor Red
    throw
}
