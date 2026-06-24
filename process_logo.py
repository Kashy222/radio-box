import sys
from PIL import Image
import colorsys

def darken_knobs(img_path):
    try:
        img = Image.open(img_path).convert('RGBA')
        pixels = img.load()
        
        for y in range(img.height):
            for x in range(img.width):
                r, g, b, a = pixels[x, y]
                if a > 10:  
                    h, s, v = colorsys.rgb_to_hsv(r/255.0, g/255.0, b/255.0)
                    
                    # Target the silver pixels we created previously (very low saturation)
                    if s < 0.15:
                        # Reduce absolute brightness by 15%
                        new_v = max(0.0, v - 0.15)
                        
                        new_r, new_g, new_b = colorsys.hsv_to_rgb(h, s, new_v)
                        pixels[x, y] = (int(new_r * 255), int(new_g * 255), int(new_b * 255), a)
                        
        img.save(img_path)
        print("Successfully darkened silver knobs by 15%.")
    except Exception as e:
        print(f"Error processing image: {e}")
        sys.exit(1)

if __name__ == '__main__':
    darken_knobs('public/nostalgia_logo.png')
