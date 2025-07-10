from datetime import datetime
import io

import matplotlib.pyplot as plt
import pandas as pd
import requests
from fastapi import FastAPI, HTTPException, Response
from PIL import Image, ImageDraw, ImageFont
from pydantic import BaseModel
from dotenv import load_dotenv
import os
from matplotlib.table import Table
from typing import List


# Load biến môi trường từ .env
load_dotenv()

# Lấy URL template từ biến môi trường
CONVEX_URL = os.getenv("CONVEX_URL")

app = FastAPI()


# ==== Load font Roboto ====
font_regular_path = "Roboto/static/Roboto-Regular.ttf"
font_bold_path = "Roboto/static/Roboto-Bold.ttf"


class PortfolioReport(BaseModel):
    id: int
    stockCode: str
    volume: int
    price: float
    percent: str
    status: str
    createdAt: datetime
    createdUser: int
    updatedAt: datetime
    updatedUser: int


class SellProfitReportTransactionType(BaseModel):
    stockCode: str
    avgPrice: float
    sellPrice: float
    volume: int
    status: str
    profit: float
    profitPercent: float


class SellProfitReportType(BaseModel):
    totalProfit: float
    totalProfitPercent: float
    transactions: List[SellProfitReportTransactionType]


@app.post("/generate-portfolio-report", response_class=Response, responses={200: {"content": {"application/json": {}}}})
async def generate(data: List[PortfolioReport]):
    # Chọn các cột cần hiển thị
    print(data)

    font_size = 22
    font_regular = ImageFont.truetype(font_regular_path, font_size)
    font_bold = ImageFont.truetype(font_bold_path, font_size)

    headers = ['CP', 'Giá vốn', 'KL', 'Trạng thái', 'Tỷ trọng']
    rows = [[d.stockCode, f"{d.price:g}",
             f"{d.volume:,}", d.status, d.percent] for d in data]

    # ==== Cấu hình bảng ====
    col_widths = [140, 150, 150, 200, 150]
    row_height = 40
    header_height = 40
    margin = 2

    n_rows = len(rows)
    n_cols = len(headers)
    table_width = sum(col_widths)
    table_height = header_height + n_rows * row_height
    image_width = table_width + margin * 2
    image_height = table_height + margin * 2

    # ==== Tạo ảnh ====
    img = Image.new('RGB', (image_width, image_height), 'white')
    draw = ImageDraw.Draw(img)

    colors = {
        'header_bg': '#b7d7a8',
        'header_text': 'black',
        'cell_bg': 'white',
        'cell_text': 'black',
        'border': 'black'
    }

    # ==== Hàm vẽ ô ====
    def draw_cell(x, y, w, h, text, font, fill, border=True):
        draw.rectangle([x, y, x + w, y + h], fill=fill)
        if border:
            draw.rectangle([x, y, x + w, y + h],
                           outline=colors['border'], width=1)
        if text:
            bbox = draw.textbbox((0, 0), text, font=font)
            tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
            draw.text((x + (w - tw) / 2, y + (h - th) / 2), text,
                      fill=colors['header_text'], font=font)

    # ==== Vẽ header ====
    x = margin
    y = margin
    for i, header in enumerate(headers):
        draw_cell(x, y, col_widths[i], header_height,
                  header, font_bold, colors['header_bg'])
        x += col_widths[i]

    # ==== Vẽ dữ liệu ====
    for row_idx, row in enumerate(rows):
        x = margin
        y = margin + header_height + row_idx * row_height
        for col_idx, value in enumerate(row):
            font = font_bold if col_idx == 0 else font_regular
            draw_cell(x, y, col_widths[col_idx], row_height, str(
                value), font, colors['cell_bg'])
            x += col_widths[col_idx]

    # ===== 📦 Export thành buffer =====
    buf = io.BytesIO()
    img.save(buf, format="PNG", dpi=(600, 600))
    buf.seek(0)  # rất quan trọng!

    res = handle_upload_file(buf.getvalue())
    print(res)
    return Response(content=res, media_type="application/json")


@app.post("/generate-sell-profit-report", response_class=Response, responses={200: {"content": {"application/json": {}}}})
async def generate(data: SellProfitReportType):

    # ==== Cấu hình scale ====
    SCALE = 2
    col_widths = [80, 100, 100, 80, 120, 120, 100]
    col_widths = [w * SCALE for w in col_widths]
    row_height = 25 * SCALE
    header_height = 25 * SCALE
    margin = 2 * SCALE

    # ==== Load font DejaVu Sans (hỗ trợ tiếng Việt) ====
    def load_fonts():
        try:
            regular_font = ImageFont.truetype(font_regular_path, 12 * SCALE)
            bold_font = ImageFont.truetype(font_bold_path, 12 * SCALE)
        except Exception as e:
            print("Không tìm thấy font DejaVu Sans, dùng mặc định.")
            regular_font = bold_font = ImageFont.load_default()
        return regular_font, bold_font

    font_body, font_bold = load_fonts()
    font_header = font_bold

    # ==== Chuẩn bị dữ liệu ====
    headers = ['CP', 'Giá vốn', 'Giá Bán', 'KL',
               'Trạng thái', 'Lãi/Lỗ', '% Lãi/Lỗ']

    rows = []
    for d in data.transactions:
        rows.append([
            d.stockCode,
            f"{d.avgPrice:g}",
            f"{d.sellPrice:g}",
            f"{d.volume:g}",
            d.status,
            f"{int(d.profit):,}",
            f"{round(d.profitPercent, 2):g}%"
        ])

    rows.append([
        "", "", "", "", "",
        f"{int(data.totalProfit):g}",
        f"{round(data.totalProfitPercent * 100, 2)}%"
    ])

    # ==== Kích thước ảnh ====
    table_width = sum(col_widths)
    table_height = header_height + len(rows) * row_height
    image_width = table_width + 2 * margin
    image_height = table_height + 2 * margin

    # ==== Màu sắc ====
    colors = {
        'header_bg': '#d9ead3',
        'header_text': 'black',
        'cell_bg': 'white',
        'cell_text': 'black',
        'total_bg': '#00ff00',
        'total_text': 'black',
        'profit_bg': '#ff00ff',
        'profit_positive': 'green',
        'profit_negative': 'red',
        'border': 'black'
    }

    # ==== Tạo ảnh ====
    img = Image.new('RGB', (image_width, image_height), 'white')
    draw = ImageDraw.Draw(img)

    # ==== Hàm vẽ ô ====
    def draw_cell(x, y, width, height, text, bg_color, text_color, font, border=True):
        draw.rectangle([x, y, x + width, y + height], fill=bg_color)
        if border:
            draw.rectangle([x, y, x + width, y + height],
                           outline=colors['border'], width=1)
        if text:
            try:
                bbox = draw.textbbox((0, 0), text, font=font)
                tw = bbox[2] - bbox[0]
                th = bbox[3] - bbox[1]
            except:
                tw, th = draw.textsize(text, font=font)
            draw.text((x + (width - tw) // 2, y + (height - th) // 2),
                      text, fill=text_color, font=font)

    # ==== Vẽ header ====
    x_offset = margin
    y_offset = margin
    for i, header in enumerate(headers):
        draw_cell(x_offset, y_offset, col_widths[i], header_height, header,
                  colors['header_bg'], colors['header_text'], font_header)
        x_offset += col_widths[i]

    # ==== Vẽ dữ liệu ====
    for row_idx, row in enumerate(rows):
        y_offset = margin + header_height + row_idx * row_height
        x_offset = margin
        is_total = (row_idx == len(rows) - 1)

        for col_idx, cell_value in enumerate(row):
            width = col_widths[col_idx]

            if is_total:
                if col_idx in [1, 2, 3, 4]:
                    x_offset += width
                    continue

                if col_idx == 0:
                    merged_width = sum(col_widths[0:5])

                    draw.rectangle([x_offset, y_offset, x_offset + merged_width,
                                   y_offset + row_height], fill=colors['total_bg'])

                    draw.line([x_offset, y_offset, x_offset + merged_width,
                              y_offset], fill=colors['border'], width=1)
                    draw.line([x_offset, y_offset + row_height, x_offset + merged_width,
                              y_offset + row_height], fill=colors['border'], width=1)
                    draw.line([x_offset, y_offset, x_offset, y_offset +
                              row_height], fill=colors['border'], width=1)
                    draw.line([x_offset + merged_width, y_offset, x_offset + merged_width,
                              y_offset + row_height], fill=colors['border'], width=1)

                    try:
                        bbox = draw.textbbox((0, 0), "Tổng", font=font_bold)
                        text_width = bbox[2] - bbox[0]
                        text_height = bbox[3] - bbox[1]
                    except:
                        text_width, text_height = draw.textsize(
                            "Tổng", font=font_bold)

                    text_x = x_offset + (merged_width - text_width) // 2
                    text_y = y_offset + (row_height - text_height) // 2
                    draw.text((text_x, text_y), "Tổng",
                              font=font_bold, fill=colors['total_text'])

                elif col_idx in [5, 6]:
                    # color = colors['profit_negative'] if '-' in cell_value else colors['profit_positive']
                    color = 'black'
                    draw_cell(x_offset, y_offset, width, row_height,
                              cell_value, colors['profit_bg'], color, font_bold)

            else:
                if col_idx == 0:
                    # Cột "CP" in đậm
                    color = colors['cell_text']
                    font = font_bold
                elif col_idx in [5, 6]:
                    # Cột lãi/lỗ
                    color = colors['profit_negative'] if '-' in cell_value else colors['profit_positive']
                    font = font_bold  # In đậm
                else:
                    color = colors['cell_text']
                    font = font_body
                draw_cell(x_offset, y_offset, width, row_height,
                          cell_value, colors['cell_bg'], color, font)
            x_offset += width

    # ===== 📦 Export thành buffer =====
    buf = io.BytesIO()
    img.save(buf, format="PNG", dpi=(600, 600))
    buf.seek(0)  # rất quan trọng!

    res = handle_upload_file(buf.getvalue())
    print(res)
    return Response(content=res, media_type="application/json")


def handle_upload_file(buffer: bytes) -> dict:
    # 1. Phát hiện MIME type
    mime = "image/png"

    # 2. Tạo URL và thêm param author
    url = f"https://little-toucan-674.convex.site/sendFile"
    params = {"author": "Stock-signal"}

    # 3. Gửi POST với raw buffer
    headers = {"Content-Type": mime}
    resp = requests.post(url, params=params, data=buffer, headers=headers)
    resp.raise_for_status()
    return resp.content
