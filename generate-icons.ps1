Add-Type -AssemblyName System.Drawing

function Resize-Image($srcPath, $destPath, $width, $height) {
    $src = [System.Drawing.Image]::FromFile($srcPath)
    $dest = New-Object System.Drawing.Bitmap($width, $height)
    $g = [System.Drawing.Graphics]::FromImage($dest)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.Clear([System.Drawing.Color]::Transparent)
    $g.DrawImage($src, 0, 0, $width, $height)
    $g.Dispose()
    $src.Dispose()
    
    $destDir = Split-Path $destPath -Parent
    if (!(Test-Path $destDir)) { New-Item -ItemType Directory -Path $destDir -Force | Out-Null }
    $dest.Save($destPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $dest.Dispose()
    Write-Output "Saved: $destPath ($width x $height)"
}

$baseDir = "c:\Users\Farhat Abbas\Downloads\New folder (3)\New folder\pleniora-project"
$icon512 = Join-Path $baseDir "icons\rida-512.png"

# iOS 1024x1024
Resize-Image $icon512 (Join-Path $baseDir "ios\App\App\Assets.xcassets\AppIcon.appiconset\AppIcon-512@2x.png") 1024 1024

# Android Mipmaps
$androidRes = Join-Path $baseDir "android\app\src\main\res"
$sizes = @{
    "mipmap-mdpi" = 48
    "mipmap-hdpi" = 72
    "mipmap-xhdpi" = 96
    "mipmap-xxhdpi" = 144
    "mipmap-xxxhdpi" = 192
}

foreach ($folder in $sizes.Keys) {
    $sz = $sizes[$folder]
    $dir = Join-Path $androidRes $folder
    Resize-Image $icon512 (Join-Path $dir "ic_launcher.png") $sz $sz
    Resize-Image $icon512 (Join-Path $dir "ic_launcher_round.png") $sz $sz
}
