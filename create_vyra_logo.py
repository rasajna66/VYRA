import math
import subprocess

width = 1200
height = 675  # 16:9 ratio matching vyra.jpeg
cx = width / 2
cy = height / 2
radius = 230

# Allocate RGB buffer
# Background is a very gentle gradient from pale ice white to soft blue at corners
img = bytearray(width * height * 3)

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

# Render background: soft radial gradient matching vyra.jpeg
for y in range(height):
    for x in range(width):
        dx = (x - cx) / width
        dy = (y - cy) / height
        d = math.sqrt(dx*dx + dy*dy)
        # Background subtle tint: from #F8FCFE in center to #E7F3FA at edges
        t = min(1.0, d * 1.5)
        r = int(248 * (1 - t) + 231 * t)
        g = int(252 * (1 - t) + 243 * t)
        b = int(254 * (1 - t) + 250 * t)
        set_pixel(x, y, r, g, b)

# Save intermediate background PPM
with open("/tmp/bg.ppm", "wb") as f:
    f.write(f"P6\n{width} {height}\n255\n".encode())
    f.write(img)

print("Background written")
