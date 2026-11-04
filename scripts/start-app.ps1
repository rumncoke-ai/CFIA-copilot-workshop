#Requires -Version 5.1
[CmdletBinding()]
param()

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
$python = Join-Path $root ".venv\Scripts\python.exe"
$client = Join-Path $root "client"
$backend = $null
$frontend = $null

function Stop-OwnedProcessTree {
    param([int]$ProcessId)
    $children = @(Get-CimInstance Win32_Process -Filter "ParentProcessId = $ProcessId" -ErrorAction Stop)
    foreach ($child in $children) {
        Stop-OwnedProcessTree -ProcessId $child.ProcessId
    }
    $process = Get-Process -Id $ProcessId -ErrorAction SilentlyContinue
    if ($null -ne $process) {
        Stop-Process -Id $ProcessId -ErrorAction Stop
    }
}

Push-Location $root
try {
    Write-Host "[START] Repository: $root"
    Write-Host "[START] Uses fixed localhost ports 8000/5173. This terminal supervises both processes."
    foreach ($path in @($python, (Join-Path $client "node_modules\vite\bin\vite.js"))) {
        if (-not (Test-Path -LiteralPath $path -PathType Leaf)) {
            throw "Dependency missing: $path. Run scripts\setup-env.ps1 first."
        }
    }
    $node = (Get-Command node.exe -CommandType Application -ErrorAction Stop | Select-Object -First 1).Source
    & $python -c "import fastapi, uvicorn; import server.app" 2>&1 |
        ForEach-Object { Write-Host $_ }
    if ($LASTEXITCODE -ne 0) {
        throw "Backend import check failed. Run setup-env.ps1 and inspect the error above."
    }
    foreach ($port in @(8000, 5173)) {
        $listener = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Loopback, $port)
        try {
            $listener.Start()
        } catch [System.Net.Sockets.SocketException] {
            throw "Port $port is unavailable. Identify its owner; this script will not stop unrelated processes."
        } finally {
            $listener.Stop()
        }
    }
    $backend = Start-Process -FilePath $python -WorkingDirectory $root -NoNewWindow -PassThru `
        -ArgumentList @("-m", "uvicorn", "server.app:app", "--host", "127.0.0.1", "--port", "8000", "--reload")
    $frontend = Start-Process -FilePath $node -WorkingDirectory $client -NoNewWindow -PassThru `
        -ArgumentList @(".\node_modules\vite\bin\vite.js")
    Write-Host "[START] Backend launcher PID: $($backend.Id); frontend PID: $($frontend.Id)"

    $deadline = (Get-Date).AddSeconds(30)
    $ready = $false
    while ((Get-Date) -lt $deadline) {
        if ($backend.HasExited -or $frontend.HasExited) {
            throw "An app process exited during startup. Inspect its output above."
        }
        try {
            $api = Invoke-WebRequest -Uri "http://127.0.0.1:8000/findings" -UseBasicParsing -TimeoutSec 2
            $ui = Invoke-WebRequest -Uri "http://127.0.0.1:5173/" -UseBasicParsing -TimeoutSec 2
            $proxy = Invoke-WebRequest -Uri "http://127.0.0.1:5173/findings" -UseBasicParsing -TimeoutSec 2
            if ($api.StatusCode -eq 200 -and $ui.StatusCode -eq 200 -and $proxy.StatusCode -eq 200) {
                $ready = $true
                break
            }
        } catch [System.Net.WebException] {
            Write-Host "[WAIT] Endpoints not ready: $($_.Exception.Message)"
        } catch [System.Net.Http.HttpRequestException] {
            Write-Host "[WAIT] Endpoints not ready: $($_.Exception.Message)"
        } catch [System.Threading.Tasks.TaskCanceledException] {
            Write-Host "[WAIT] Health request timed out: $($_.Exception.Message)"
        }
        Start-Sleep -Milliseconds 500
    }
    if (-not $ready) { throw "Startup health checks did not pass within 30 seconds." }

    Write-Host "[READY] Frontend: http://127.0.0.1:5173"
    Write-Host "[READY] API docs: http://127.0.0.1:8000/docs"
    Write-Host "[CHECK] GET http://127.0.0.1:8000/findings and http://127.0.0.1:5173/findings both passed."
    Write-Host "[CHECK] Save a synthetic high finding: expect 80 / Prioritize immediate review."
    Write-Host "[STOP] Press Ctrl+C here to stop both app process trees. Do not close the terminal window."
    while ($true) {
        Start-Sleep -Seconds 1
        if ($backend.HasExited -or $frontend.HasExited) {
            throw "An app process exited unexpectedly. Both app process trees will be stopped."
        }
    }
} catch {
    Write-Host "[FAIL] App startup/supervision failed: $($_.Exception.Message)" -ForegroundColor Red
    throw
} finally {
    foreach ($process in @($frontend, $backend)) {
        if ($null -ne $process) {
            Write-Host "[STOP] Stopping owned process tree $($process.Id)"
            Stop-OwnedProcessTree -ProcessId $process.Id
        }
    }
    Write-Host "[STOP] App processes stopped."
    Pop-Location
}
