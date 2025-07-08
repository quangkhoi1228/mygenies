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


class PortfolioReport(BaseModel):
    id:int
    stockCode: str
    volume: int
    price: float
    percent: str
    createdAt: datetime
    createdUser: int
    updatedAt: datetime
    updatedUser: int


@app.post("/generate-portfolio-report", response_class=Response, responses={200: {"content": {"application/json": {}}}})
async def generate(data: List[PortfolioReport]):
    # Chọn các cột cần hiển thị
    print(data)
    headers = ['Mã CP', 'Giá', 'KL', '%NAV']
    rows = [[d.stockCode, d.price, d.volume, d.percent] for d in data]

    # Tạo hình
    fig, ax = plt.subplots(figsize=(6, 2 + 0.5 * len(rows)))
    ax.set_axis_off()

    # Tạo table
    table = Table(ax, bbox=[0, 0, 1, 1])

    n_rows = len(rows)
    n_cols = len(headers)
    width, height = 1.0 / n_cols, 1.0 / (n_rows + 1)

    # Header
    for i, header in enumerate(headers):
        table.add_cell(0, i, width, height, text=header, loc='center', facecolor='#dbe5f1')

    # Rows
    for row_idx, row in enumerate(rows, start=1):
        for col_idx, cell in enumerate(row):
            table.add_cell(row_idx, col_idx, width, height, text=str(cell), loc='center', facecolor='#fdd3d3')

    # Viền
    for i in range(n_rows + 1):
        for j in range(n_cols):
            cell = table[(i, j)]
            cell.set_linewidth(1)
            cell.set_edgecolor("black")

    ax.add_table(table)


    # ===== 📦 Export thành buffer =====
    buf = io.BytesIO()
    plt.savefig(buf, format='png', dpi=500, bbox_inches='tight')
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
