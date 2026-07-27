param(
  [switch]$Uninstall
)

# Elevation automatique (necessaire pour ecrire dans ProgramData/HKLM et les
# emplacements "Tous les utilisateurs" du Bureau et du menu Demarrer).
$currentPrincipal = New-Object Security.Principal.WindowsPrincipal([Security.Principal.WindowsIdentity]::GetCurrent())
if (-not $currentPrincipal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
  $scriptPath = $MyInvocation.MyCommand.Path
  $argList = @("-NoProfile", "-ExecutionPolicy", "Bypass", "-File", "`"$scriptPath`"")
  if ($Uninstall) { $argList += "-Uninstall" }
  Start-Process -FilePath "powershell.exe" -ArgumentList $argList -Verb RunAs -Wait
  exit
}

$AppName    = "Situation de Caisse"
$AppUrl     = "https://mohamedkabinetsoumah-ops.github.io/situation-caisse-bpmg/"
$InstallDir = Join-Path $env:ProgramData "SituationCaisseBPMG"
$IconPath   = Join-Path $InstallDir "app.ico"
$UninstallKey = "HKLM:\Software\Microsoft\Windows\CurrentVersion\Uninstall\SituationCaisseBPMG"

function Get-BrowserExe {
  $candidates = @(
    "$env:ProgramFiles\Microsoft\Edge\Application\msedge.exe",
    "${env:ProgramFiles(x86)}\Microsoft\Edge\Application\msedge.exe",
    "$env:ProgramFiles\Google\Chrome\Application\chrome.exe",
    "${env:ProgramFiles(x86)}\Google\Chrome\Application\chrome.exe"
  )
  foreach ($c in $candidates) { if (Test-Path $c) { return $c } }
  return $null
}

function New-AppShortcut($path, $targetExe) {
  $shell = New-Object -ComObject WScript.Shell
  $sc = $shell.CreateShortcut($path)
  if ($targetExe) {
    $sc.TargetPath = $targetExe
    $sc.Arguments  = "--app=$AppUrl"
  } else {
    $sc.TargetPath = $AppUrl
  }
  $sc.IconLocation = $IconPath
  $sc.Description  = "$AppName (application web BPMG)"
  $sc.WorkingDirectory = $InstallDir
  $sc.Save()
}

if ($Uninstall) {
  Remove-Item "$env:PUBLIC\Desktop\$AppName.lnk" -ErrorAction SilentlyContinue
  Remove-Item "$env:ProgramData\Microsoft\Windows\Start Menu\Programs\$AppName.lnk" -ErrorAction SilentlyContinue
  Remove-Item "$env:ProgramData\Microsoft\Windows\Start Menu\Programs\Desinstaller $AppName.lnk" -ErrorAction SilentlyContinue
  Remove-Item $InstallDir -Recurse -Force -ErrorAction SilentlyContinue
  Remove-Item $UninstallKey -Recurse -Force -ErrorAction SilentlyContinue
  Add-Type -AssemblyName System.Windows.Forms
  [System.Windows.Forms.MessageBox]::Show("$AppName a ete desinstalle (les raccourcis ont ete retires). L'application reste disponible en ligne sur $AppUrl.", "$AppName", "OK", "Information") | Out-Null
  return
}

New-Item -ItemType Directory -Path $InstallDir -Force | Out-Null
Copy-Item -Path (Join-Path $PSScriptRoot "app.ico") -Destination $IconPath -Force
Copy-Item -Path $MyInvocation.MyCommand.Path -Destination (Join-Path $InstallDir "install.ps1") -Force

$browser = Get-BrowserExe

New-AppShortcut "$env:PUBLIC\Desktop\$AppName.lnk" $browser
New-AppShortcut "$env:ProgramData\Microsoft\Windows\Start Menu\Programs\$AppName.lnk" $browser

# Raccourci de desinstallation dans le menu Demarrer
$shell = New-Object -ComObject WScript.Shell
$uninstallShortcut = $shell.CreateShortcut("$env:ProgramData\Microsoft\Windows\Start Menu\Programs\Desinstaller $AppName.lnk")
$uninstallShortcut.TargetPath = "powershell.exe"
$uninstallShortcut.Arguments  = "-NoProfile -ExecutionPolicy Bypass -File `"$InstallDir\install.ps1`" -Uninstall"
$uninstallShortcut.IconLocation = $IconPath
$uninstallShortcut.Save()

# Entree "Applications et fonctionnalites" pour une desinstallation propre
New-Item -Path $UninstallKey -Force | Out-Null
Set-ItemProperty -Path $UninstallKey -Name "DisplayName" -Value $AppName
Set-ItemProperty -Path $UninstallKey -Name "Publisher" -Value "BPMG - Banque Populaire Maroco Guineenne"
Set-ItemProperty -Path $UninstallKey -Name "DisplayIcon" -Value $IconPath
Set-ItemProperty -Path $UninstallKey -Name "UninstallString" -Value "powershell.exe -NoProfile -ExecutionPolicy Bypass -File `"$InstallDir\install.ps1`" -Uninstall"
Set-ItemProperty -Path $UninstallKey -Name "NoModify" -Value 1 -Type DWord
Set-ItemProperty -Path $UninstallKey -Name "NoRepair" -Value 1 -Type DWord
Set-ItemProperty -Path $UninstallKey -Name "DisplayVersion" -Value "1.0"

Add-Type -AssemblyName System.Windows.Forms
[System.Windows.Forms.MessageBox]::Show("$AppName a ete installe.`n`nUne icone est disponible sur le Bureau et dans le menu Demarrer. L'application reste a jour automatiquement (elle fonctionne comme un site web, avec un mode hors ligne).", "$AppName", "OK", "Information") | Out-Null
