"""
AgroPlant AI 4.1 — RTX 4070 Ti Super (16GB) Optimized YOLOv8 Training Script
Designed for Desktop (Intel i7-14700K + NVIDIA GeForce RTX 4070 Ti Super 16GB)

Target Crops:
1. Pomidor (Tomato) - Fitoftora (Late Blight), Qo'ng'ir dog'lanish, Sog'lom
2. Bodring (Cucumber) - Un-shudring (Powdery Mildew), Peronosporoz, Sog'lom
3. Balgar (Bell Pepper) - Bakterial dog'lanish (Bacterial Spot), Sog'lom
"""

import os
import sys
import torch
from ultralytics import YOLO

def check_hardware_capabilities():
    print("=" * 60)
    print("🚀 AgroPlant AI Vision — Hardware tekshiruvi")
    print("=" * 60)
    
    cuda_available = torch.cuda.is_available()
    print(f"[*] CUDA mavjudmi: {cuda_available}")
    
    if cuda_available:
        device_count = torch.cuda.device_count()
        gpu_name = torch.cuda.get_device_name(0)
        vram_gb = torch.cuda.get_device_properties(0).total_memory / (1024 ** 3)
        print(f"[*] Aniqlangan GPU: {gpu_name}")
        print(f"[*] VRAM Hajmi: {vram_gb:.2f} GB")
        print(f"[*] PyTorch Versiyasi: {torch.__version__}")
        print(f"[*] CUDA Versiyasi: {torch.version.cuda}")
        
        if "4070" in gpu_name or vram_gb >= 12:
            print("✅ GPU tavsiya etilgan parametrlariga mos (RTX 4070 Ti Super 16GB)!")
            print("⚡ Batch size = 32, Image size = 640, Mixed Precision (FP16) yoqiladi.")
    else:
        print("⚠️ DIQQAT: CUDA topilmadi! CPU orqali o'qitish juda sekin kechadi.")
        print("Iltimos, NVIDIA drayverlari va PyTorch CUDA paketini o'rnating:")
        print("pip install torch torchvision --index-url https://download.pytorch.org/whl/cu121")
    print("=" * 60 + "\n")

def train():
    check_hardware_capabilities()
    
    # 1. Dataset konfiguratsiya fayli
    yaml_path = os.path.abspath("crops_dataset.yaml")
    if not os.path.exists(yaml_path):
        print(f"[*] '{yaml_path}' topilmadi. Namunaviy dataset fayli yaratilmoqda...")
        sample_yaml_content = """# AgroPlant Vision 4.1 Dataset Config
path: ./dataset # dataset asosiy papkasi
train: images/train
val: images/val
test: images/test

# 9 asosiy sinf (Pomidor, Bodring, Balgar)
names:
  0: tomato_late_blight         # Pomidor Fitoftorasi
  1: tomato_early_blight        # Pomidor Alternariozi
  2: tomato_healthy             # Pomidor Sog'lom
  3: cucumber_powdery_mildew    # Bodring Un-shudringi
  4: cucumber_downy_mildew      # Bodring Peronosporozi
  5: cucumber_healthy           # Bodring Sog'lom
  6: pepper_bacterial_spot      # Balgar Bakterial dog'lanishi
  7: pepper_healthy             # Balgar Sog'lom
  8: general_spider_mite        # O'rgimchakkana zarari
"""
        with open(yaml_path, "w", encoding="utf-8") as f:
            f.write(sample_yaml_content)
        print(f"✅ '{yaml_path}' yaratildi.")

    # 2. Modelni yuklash (YOLOv8m - optimal muvozanat)
    print("\n📦 YOLOv8m (Medium) pre-trained og'irligi yuklanmoqda...")
    model = YOLO("yolov8m.pt")

    # 3. RTX 4070 Ti Super (16GB) uchun sozlangan o'qitish parametrlari
    # 16GB VRAM bemalol batch=32 va imgsz=640 ni ko'tara oladi (~10-15 daqiqa ichida 100 epoch)
    print("🚀 O'qitish jarayoni boshlanmoqda (100 Epochs, Batch: 32, AMP: True)...")
    results = model.train(
        data=yaml_path,
        epochs=100,
        imgsz=640,
        batch=32,            # 16GB VRAM uchun optimal
        device=0 if torch.cuda.is_available() else "cpu",
        workers=8,           # 14700K 20 ta yadro/28 patokga mos
        patience=20,         # Agar 20 epoch davomida yaxshilanish bo'lmasa erta to'xtatish (Early Stopping)
        save=True,
        save_period=10,
        project="agroplant_ai_run",
        name="crops_v8m_desktop",
        exist_ok=True,
        pretrained=True,
        optimizer="auto",
        verbose=True,
        seed=42,
        val=True,
        amp=True             # RTX 40-seriya Tensor yadrolaridan foydalanish (FP16)
    )

    print("\n" + "=" * 60)
    print("🎉 O'qitish muvaffaqiyatli yakunlandi!")
    best_model_path = os.path.join("agroplant_ai_run", "crops_v8m_desktop", "weights", "best.pt")
    print(f"🏆 Eng yaxshi model saqlandi: {os.path.abspath(best_model_path)}")
    print("=" * 60)

    # 4. ONNX formatiga eksport qilish (Web/FastAPI servislarda 3x tezroq ishlashi uchun)
    try:
        print("\n⚡ Model ONNX formatiga eksport qilinmoqda...")
        best_model = YOLO(best_model_path)
        onnx_file = best_model.export(format="onnx", imgsz=640, dynamic=True)
        print(f"✅ ONNX modeli tayyor: {onnx_file}")
    except Exception as e:
        print(f"⚠️ ONNX eksportida ogohlantirish: {e}")

    print("\n👉 Keyingi qadam:")
    print("Hosildor 'best.pt' faylini Mac kompyuteringizga 'ai-service/weights/best.pt' manziliga nusxalang!")

if __name__ == "__main__":
    train()

