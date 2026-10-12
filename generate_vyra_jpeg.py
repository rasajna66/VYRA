import math
import subprocess

width = 1200
height = 675
cx = width / 2.0
cy = height / 2.0
r_outer = 215.0
stroke_outer = 6.0

# 1. Start from /tmp/bg.ppm or generate
with open("/tmp/bg.ppm", "rb") as f:
    header = b""
    while len(header.split(b"\n")) < 4:
        header += f.read(1)
    img = bytearray(f.read())

def set_pixel(x, y, r, g, b, a=1.0):
    if 0 <= x < width and 0 <= y < height:
        idx = (int(y) * width + int(x)) * 3
        if a >= 1.0:
            img[idx] = int(r)
            img[idx+1] = int(g)
            img[idx+2] = int(b)
        else:
            bg_r = img[idx]
            bg_g = img[idx+1]
            bg_b = img[idx+2]
            img[idx] = int(r * a + bg_r * (1.0 - a))
            img[idx+1] = int(g * a + bg_g * (1.0 - a))
            img[idx+2] = int(b * a + bg_b * (1.0 - a))

# Draw white circle interior and dark navy outer ring
navy_r, navy_g, navy_b = 15, 58, 87 # #0F3A57
for y in range(int(cy - r_outer - 5), int(cy + r_outer + 5)):
    for x in range(int(cx - r_outer - 5), int(cx + r_outer + 5)):
        dx = x - cx
        dy = y - cy
        dist = math.sqrt(dx*dx + dy*dy)
        if dist <= r_outer - stroke_outer / 2.0:
            # Inside circle: pure white
            set_pixel(x, y, 255, 255, 255)
        elif dist <= r_outer + stroke_outer / 2.0:
            # Circle border
            # anti-alias edge
            edge_dist = abs(dist - r_outer)
            alpha = max(0.0, min(1.0, 1.0 - (edge_dist - (stroke_outer/2.0 - 0.7))))
            set_pixel(x, y, navy_r, navy_g, navy_b, alpha)

# Draw central droplet glow
drop_cy = cy - 55
for y in range(int(drop_cy - 70), int(drop_cy + 70)):
    for x in range(int(cx - 50), int(cx + 50)):
        dx = (x - cx) / 38.0
        dy = (y - drop_cy) / 55.0
        d = dx*dx + dy*dy
        if d < 1.0:
            alpha = (1.0 - math.sqrt(d)) * 0.4
            set_pixel(x, y, 178, 203, 216, alpha) # #B2CBD8 soft glow

# Save intermediate before ImageMagick vector stroke & text
with open("/tmp/base_badge.ppm", "wb") as f:
    f.write(f"P6\n{width} {height}\n255\n".encode())
    f.write(img)

print("Base badge written to /tmp/base_badge.ppm")
