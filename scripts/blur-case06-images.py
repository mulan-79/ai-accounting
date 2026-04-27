"""
Case06 이미지 블러 처리 스크립트
- img1 (1140x1021): 헤더 "대원제약 경영대시보드" 텍스트 블러
- img2 (754x969):  컬럼 A "대원제약" 전체 블러
- img3 (1136x1021): 헤더 "대원제약 경영대시보드" 텍스트 블러
- img4 (829x765):   블러 불필요 → 그대로 복사
"""

from PIL import Image, ImageFilter
import shutil

BASE = 'scripts/case-images/'

def blur_region(img, box, radius=18):
    """box = (left, upper, right, lower) 영역을 가우시안 블러 처리"""
    region = img.crop(box)
    blurred = region.filter(ImageFilter.GaussianBlur(radius=radius))
    img.paste(blurred, box)
    return img

# ── img1: 종합현황 (1140 x 1021) ──────────────────────────────────────
# 헤더 높이 약 32px, "대원제약 경영대시보드" 텍스트: DW 박스(~38px) 이후부터
img1 = Image.open(BASE + 'image-1777268635567.png').convert('RGB')
img1 = blur_region(img1, box=(40, 3, 190, 31))   # "대원제약 경영대시보드" (네비탭 제외)
img1.save(BASE + 'case06_img1_dashboard.png')
print('img1 done')

# ── img2: Google Sheets (754 x 969) ───────────────────────────────────
img2 = Image.open(BASE + 'image-1777268662047.png').convert('RGB')
img2 = blur_region(img2, box=(0, 90, 115, 969), radius=30)  # 컬럼 A 강하게
img2.save(BASE + 'case06_img2_sheets.png')
print('img2 done')

# ── img3: 손익추이 (1136 x 1021) ──────────────────────────────────────
img3 = Image.open(BASE + 'image-1777268675552.png').convert('RGB')
img3 = blur_region(img3, box=(40, 3, 190, 31))
img3.save(BASE + 'case06_img3_trend.png')
print('img3 done')

# ── img4: Claude 채팅 (829 x 765) ─────────────────────────────────────
shutil.copy(BASE + 'image-1777268711523.png', BASE + 'case06_img4_debug.png')
print('img4 done')

print('all done')
