import os
import shutil
from PIL import Image, ImageDraw

def generate_icons():
    repo_root = r"c:\Users\Mahir Rahman\Desktop\robobee website"
    app_dir = os.path.join(repo_root, "src", "app")
    public_dir = os.path.join(repo_root, "public")
    images_dir = os.path.join(public_dir, "images")
    os.makedirs(images_dir, exist_ok=True)

    # 1. Copy original master logo to public assets
    src_master = r"C:\Users\Mahir Rahman\robobee\robobee logo.jpg"
    dest_master_jpg = os.path.join(images_dir, "robobee-logo.jpg")
    shutil.copyfile(src_master, dest_master_jpg)
    print("Copied original master logo to:", dest_master_jpg)

    # Also save master PNG
    master_img = Image.open(src_master)
    dest_master_png = os.path.join(images_dir, "robobee-logo.png")
    master_img.save(dest_master_png, "PNG")
    print("Saved master PNG to:", dest_master_png)

    # 2. Render 512x512 high-resolution emblem icon
    size = 512
    img512 = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img512)

    # Colors: authentic deep burgundy and golden yellow
    bg = (46, 0, 28, 255)       # #2E001C
    gold = (245, 184, 0, 255)   # #F5B800

    # Background rounded rectangle (corner radius 96, ~18.75%)
    corner_radius = 96
    draw.rounded_rectangle([(0, 0), (size - 1, size - 1)], radius=corner_radius, fill=bg)

    # Geometry scaled to match official RoboBEE emblem proportions
    large_w = 280
    large_h = 280
    stroke = 28
    small_size = 50
    gap = 4
    inset_right = 26

    left_large = (size - large_w) // 2                # 116
    total_h = large_h + gap + small_size             # 334
    top_small = (size - total_h) // 2                # 89
    top_large = top_small + small_size + gap         # 143

    small_x2 = left_large + large_w - inset_right    # 370
    small_x1 = small_x2 - small_size                 # 320
    small_y1 = top_small                             # 89
    small_y2 = small_y1 + small_size                 # 139

    # Draw small top-right filled square
    draw.rectangle([(small_x1, small_y1), (small_x2, small_y2)], fill=gold)

    # Draw large square frame
    draw.rectangle([(left_large, top_large), (left_large + large_w, top_large + large_h)], fill=gold)
    draw.rectangle([(left_large + stroke, top_large + stroke), (left_large + large_w - stroke, top_large + large_h - stroke)], fill=bg)

    # Save 512x512 icon.png
    img512.save(os.path.join(app_dir, "icon.png"), "PNG")
    img512.save(os.path.join(public_dir, "icon.png"), "PNG")
    print("Saved icon.png (512x512) to src/app/ and public/")

    # Save 180x180 apple-icon.png
    img180 = img512.resize((180, 180), Image.Resampling.LANCZOS)
    img180.save(os.path.join(app_dir, "apple-icon.png"), "PNG")
    img180.save(os.path.join(public_dir, "apple-icon.png"), "PNG")
    print("Saved apple-icon.png (180x180) to src/app/ and public/")

    # Save multi-size favicon.ico
    img512.save(os.path.join(app_dir, "favicon.ico"), format="ICO", sizes=[(16, 16), (32, 32), (48, 48), (64, 64)])
    img512.save(os.path.join(public_dir, "favicon.ico"), format="ICO", sizes=[(16, 16), (32, 32), (48, 48), (64, 64)])
    print("Saved favicon.ico (multi-size ICO) to src/app/ and public/")

    # 3. Create SVG vector icons
    svg_content = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <!-- RoboBEE Innovators Official Emblem -->
  <rect width="512" height="512" rx="96" fill="#2E001C"/>
  <!-- Top Right Offset Solid Square -->
  <rect x="320" y="89" width="50" height="50" fill="#F5B800"/>
  <!-- Main Outer Frame Square -->
  <rect x="116" y="143" width="280" height="280" fill="none" stroke="#F5B800" stroke-width="28"/>
</svg>
"""

    with open(os.path.join(app_dir, "icon.svg"), "w", encoding="utf-8") as f:
        f.write(svg_content)
    with open(os.path.join(public_dir, "icon.svg"), "w", encoding="utf-8") as f:
        f.write(svg_content)
    with open(os.path.join(public_dir, "favicon.svg"), "w", encoding="utf-8") as f:
        f.write(svg_content)
    print("Saved icon.svg and favicon.svg to src/app/ and public/")

if __name__ == "__main__":
    generate_icons()
