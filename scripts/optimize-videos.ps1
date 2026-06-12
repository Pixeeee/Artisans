param(
  [string]$Ffmpeg = ""
)

if ([string]::IsNullOrWhiteSpace($Ffmpeg)) {
  $Ffmpeg = node -e "console.log(require('ffmpeg-static'))"
}

New-Item -ItemType Directory -Force "apps/web/public/assets/optimized" | Out-Null
New-Item -ItemType Directory -Force "apps/mobile/assets/optimized" | Out-Null

& $Ffmpeg -y -i "assets/backgroundvd/web.mp4" -vf "scale='min(1920,iw)':-2" -c:v libx264 -crf 20 -preset slow -movflags +faststart -an "apps/web/public/assets/optimized/web.mp4"
& $Ffmpeg -y -i "assets/backgroundvd/web.mp4" -vf "scale='min(1920,iw)':-2" -c:v libvpx-vp9 -crf 30 -b:v 0 -an "apps/web/public/assets/optimized/web.webm"
& $Ffmpeg -y -i "assets/backgroundvd/mobile.mp4" -vf "scale='min(1080,iw)':-2" -c:v libx264 -crf 20 -preset slow -movflags +faststart -an "apps/mobile/assets/optimized/mobile.mp4"
& $Ffmpeg -y -i "assets/backgroundvd/web.mp4" -frames:v 1 "apps/web/public/assets/optimized/web-poster.jpg"
& $Ffmpeg -y -i "assets/backgroundvd/mobile.mp4" -frames:v 1 "apps/mobile/assets/optimized/mobile-poster.jpg"
