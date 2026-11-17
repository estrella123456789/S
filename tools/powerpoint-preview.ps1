param(
  [string]$InputFile = 'exports/solar-system.pptx',
  [string]$OutputDirectory = '.verification/nasa-powerpoint-final'
)
$ErrorActionPreference = 'Stop'
$inputPath = (Resolve-Path -LiteralPath $InputFile).Path
$outputPath = [IO.Path]::GetFullPath((Join-Path (Get-Location).Path $OutputDirectory))
New-Item -ItemType Directory -Path $outputPath -Force | Out-Null
$application = $null
$presentation = $null
try {
  $application = New-Object -ComObject PowerPoint.Application
  $presentation = $application.Presentations.Open($inputPath, -1, 0, 0)
  $presentation.Export($outputPath, 'PNG', 1280, 720)
  [PSCustomObject]@{
    PowerPointVersion = $application.Version
    Slides = $presentation.Slides.Count
    Width = $presentation.PageSetup.SlideWidth
    Height = $presentation.PageSetup.SlideHeight
    Output = $outputPath
  } | ConvertTo-Json
} finally {
  if ($null -ne $presentation) {
    $presentation.Close()
    [void][Runtime.InteropServices.Marshal]::ReleaseComObject($presentation)
  }
  if ($null -ne $application) {
    $application.Quit()
    [void][Runtime.InteropServices.Marshal]::ReleaseComObject($application)
  }
}
