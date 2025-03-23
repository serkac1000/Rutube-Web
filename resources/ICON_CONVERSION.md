# Icon Conversion Guide

Before building the desktop application, you need to convert the SVG icon to platform-specific formats:

## Windows (.ico)

1. Convert the SVG to ICO using tools like:
   - Online converters: https://convertio.co/svg-ico/
   - Inkscape: Export as PNG, then use a tool like ImageMagick to create ICO
   - ImageMagick command: `magick convert icon.svg -background transparent icon.ico`

## macOS (.icns)

1. First convert to PNG at multiple sizes:
   ```
   for size in 16 32 64 128 256 512 1024; do
     inkscape -w $size -h $size icon.svg -o icon_${size}x${size}.png
   done
   ```

2. Create ICNS file using iconutil:
   ```
   mkdir MyIcon.iconset
   cp icon_16x16.png MyIcon.iconset/icon_16x16.png
   cp icon_32x32.png MyIcon.iconset/icon_32x32.png
   cp icon_64x64.png MyIcon.iconset/icon_32x32@2x.png
   cp icon_128x128.png MyIcon.iconset/icon_128x128.png
   cp icon_256x256.png MyIcon.iconset/icon_128x128@2x.png
   cp icon_256x256.png MyIcon.iconset/icon_256x256.png
   cp icon_512x512.png MyIcon.iconset/icon_256x256@2x.png
   cp icon_512x512.png MyIcon.iconset/icon_512x512.png
   cp icon_1024x1024.png MyIcon.iconset/icon_512x512@2x.png
   iconutil -c icns MyIcon.iconset -o icon.icns
   ```

## Linux

For Linux, PNG files are typically used. Create multiple sizes:

```
for size in 16 24 32 48 64 128 256 512; do
  inkscape -w $size -h $size icon.svg -o icon_${size}x${size}.png
done
```

The main application icon should be at least 256x256 pixels.

## Using the Icons

Once you have converted the SVG to the appropriate formats, place them in the resources directory:

- Windows: `resources/icon.ico`
- macOS: `resources/icon.icns`
- Linux: `resources/icon.png` (use the 256x256 version)

These icons will be used by electron-builder during the packaging process.