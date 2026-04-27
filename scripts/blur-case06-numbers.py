"""
Case06 이미지 숫자 블러 처리
img1 (종합현황): KPI 수치, PL 테이블 수치, BS 수치, 재무비율 수치
img3 (손익추이): 차트 Y축 수치, 상세 테이블 수치
"""
from PIL import Image, ImageFilter

BASE = 'scripts/case-images/'

def blur(img, box, radius=20):
    region = img.crop(box)
    blurred = region.filter(ImageFilter.GaussianBlur(radius=radius))
    img.paste(blurred, box)
    return img

# ── img1: 종합현황 (1140 x 1021) ──────────────────────────────────────
img1 = Image.open(BASE + 'case06_img1_dashboard.png').convert('RGB')

# KPI 카드 큰 수치 + 증감률 (매출액 5,429.8억 / 영업이익 / 당기순이익 / 영업이익률)
img1 = blur(img1, (8,   115, 1132, 190))

# PL 테이블 수치 컬럼 (2025년 / 2024년 / 증감률)
img1 = blur(img1, (183, 305,  560, 618))

# 분기 차트 Y축 레이블 (1500억, 1000억, 500억, 0억, -500억)
img1 = blur(img1, (575, 285,  625, 490))

# BS 바 차트 레이블 (5,754.9억 / 2,937.9억 / 2,817억 / 2,291.9억 / 1,769.3억)
img1 = blur(img1, (112, 730,  295, 878))

# BS 우측 재무비율 수치 (104.3% / 129.5% / 48.9%)
img1 = blur(img1, (1040, 730, 1135, 815))

# 주요 재무비율 카드 큰 수치 (104.3% / 129.5% / 48.9% / 47.5% / 2.3% / 4.4%)
img1 = blur(img1, (8,   928, 1132,  982))

img1.save(BASE + 'case06_img1_dashboard.png')
print('img1 done')

# ── img3: 손익추이 (1136 x 1021) ──────────────────────────────────────
img3 = Image.open(BASE + 'case06_img3_trend.png').convert('RGB')

# 매출액 비교 차트 Y축 (800억, 600억, 400억, 200억, 0억)
img3 = blur(img3, (20,  192,  78, 362))

# 영업이익 비교 차트 Y축 (170억, 85억, 0억, -85억, -170억)
img3 = blur(img3, (15,  432,  72, 598))

# 상세 데이터 테이블 전체 수치 컬럼
img3 = blur(img3, (280, 673, 1130, 1021))

img3.save(BASE + 'case06_img3_trend.png')
print('img3 done')
print('all done')
