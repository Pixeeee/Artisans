# ArtisanS Video Optimization

The source videos in `assets/backgroundvd` are kept untouched.

The project includes `ffmpeg-static` as a dev dependency so optimization can run without a system ffmpeg install. The latest generated variants are:

- `apps/web/public/assets/optimized/web.mp4`
- `apps/web/public/assets/optimized/web.webm`
- `apps/web/public/assets/optimized/web-poster.jpg`
- `apps/mobile/assets/optimized/mobile.mp4`
- `apps/mobile/assets/optimized/mobile-poster.jpg`

Regenerate optimized variants with:

```powershell
ffmpeg -i assets/backgroundvd/web.mp4 -vf "scale=1920:-2" -c:v libx264 -crf 22 -preset slow -movflags +faststart -an apps/web/public/assets/optimized/web.mp4
ffmpeg -i assets/backgroundvd/web.mp4 -vf "scale=1920:-2" -c:v libvpx-vp9 -crf 32 -b:v 0 -an apps/web/public/assets/optimized/web.webm
ffmpeg -i assets/backgroundvd/mobile.mp4 -vf "scale=1080:-2" -c:v libx264 -crf 23 -preset slow -movflags +faststart -an apps/mobile/assets/optimized/mobile.mp4
ffmpeg -i assets/backgroundvd/web.mp4 -frames:v 1 apps/web/public/assets/optimized/web-poster.jpg
ffmpeg -i assets/backgroundvd/mobile.mp4 -frames:v 1 apps/mobile/assets/optimized/mobile-poster.jpg
```

After generation, update web and mobile video imports to prefer `assets/optimized/*`.
