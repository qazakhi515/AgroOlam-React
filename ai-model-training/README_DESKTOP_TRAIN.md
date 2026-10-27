# 🚀 AgroPlant AI 4.1: Desktop (RTX 4070 Ti Super 16GB) O'qitish Qo'llanmasi

Ushbu qo'llanma sizning ikkinchi kompyuteringiz — **Intel Core i7-14700K + NVIDIA GeForce RTX 4070 Ti Super (16GB VRAM)** quvvatidan maksimal foydalanib, **Pomidor**, **Bodring** va **Balgar** ekinlari kasalliklarini aniqlovchi **YOLOv8m** modelini o'qitish uchun tayyorlandi.

---

## ⚡ Nega RTX 4070 Ti Super 16GB?
- **16GB GDDR6X VRAM**: 640x640 o'lchamdagi barg to'qimalari tasvirlarini `batch=32` hajmda to'liq xotirada ushlab turadi.
- **4-avlod Tensor Cores (FP16/AMP)**: 100 epoch o'qitish jarayoni atigi **10-15 daqiqa** ichida yakunlanadi.
- **i7-14700K (20 yadro, 28 patok)**: `workers=8` parametri bilan tasvirlarni diskdan GPU ga kechikishsiz (0 ms bottleneck) yetkazib beradi.

---

## 📋 1-Qadam: Desktop Kompyuterda Muhitni O'rnatish

Windows desktopingizda PowerShell yoki Terminalni oching:

```bash
# 1. Virtual muhit yaratish
python -m venv venv
.\venv\Scripts\activate

# 2. PyTorch CUDA 12.1 paketini o'rnatish (RTX 4070 Ti Super uchun)
pip install torch torchvision --index-url https://download.pytorch.org/whl/cu121

# 3. Talab qilinadigan kutubxonalarni o'rnatish
pip install -r requirements.txt
```

---

## 📊 2-Qadam: Datasetni Tayyorlash

Dataset quyidagi tuzilishga ega bo'lishi kerak (`crops_dataset.yaml`):

```
ai-model-training/
  ├── dataset/
  │    ├── images/
  │    │    ├── train/      # Mashq tasvirlari
  │    │    └── val/        # Tekshiruv tasvirlari
  │    └── labels/
  │         ├── train/      # YOLO formatidagi .txt koordinatalar
  │         └── val/
  ├── crops_dataset.yaml
  ├── train_yolo_crops.py
  └── requirements.txt
```

### O'qitiladigan Sinflar (9 ta sinf):
- `0`: `tomato_late_blight` — Pomidor Fitoftorasi (Phytophthora infestans)
- `1`: `tomato_early_blight` — Pomidor Alternariozi
- `2`: `tomato_healthy` — Sog'lom pomidor
- `3`: `cucumber_powdery_mildew` — Bodring Un-shudringi (Erysiphe cichoracearum)
- `4`: `cucumber_downy_mildew` — Bodring Peronosporozi (Pseudoperonospora cubensis)
- `5`: `cucumber_healthy` — Sog'lom bodring
- `6`: `pepper_bacterial_spot` — Balgar Bakterial dog'lanishi (Xanthomonas)
- `7`: `pepper_healthy` — Sog'lom qalampir
- `8`: `general_spider_mite` — O'rgimchakkana zararlashi (Tetranychus urticae)

---

## 🏎️ 3-Qadam: O'qitishni Boshlash

Desktopingizda quyidagi buyruqni bering:

```bash
python train_yolo_crops.py
```

Skript avtomatik ravishda:
1. RTX 4070 Ti Super va 16GB VRAM borligini tasdiqlaydi.
2. Tensor Cores (AMP FP16) rejimini yoqadi.
3. 100 epoch davomida o'qitadi.
4. Natijani `agroplant_ai_run/crops_v8m_desktop/weights/best.pt` fayliga saqlaydi.
5. Avtomatik `best.onnx` faylini ham yaratadi.

---

## 💾 4-Qadam: Modelni Mac Kompyuteringizga O'tkazish

O'qitish tugagach:
1. Desktopingizdagi `best.pt` faylini oling.
2. Hozir ishlayotgan Mac kompyuteringizdagi ushbu loyiha papkasiga joylashtiring:
   ```
   AgroPlant-React/
     └── ai-service/
           └── weights/
                 └── best.pt    <-- SHU YERGA TASHLANG
   ```

---

## 🌐 5-Qadam: FastAPI Servisini Ishga Tushirish

Mac kompyuteringizda model ulangach, backend AI servisi ishga tushadi:

```bash
cd ai-service
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

React frontend (`PlantDoctorModal.tsx` va `AiScannerSection.tsx`) avtomatik ravishda `http://localhost:8000/api/v1/diagnose` API endpointiga ulanadi!

