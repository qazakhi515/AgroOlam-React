"""
AgroPlant AI — Dataset Tayyorlash va Yuklash Skripti
Ushbu skript Roboflow yoki ochiq PlantVillage datasetlaridan
Pomidor, Bodring va Balgar kasalliklarini yuklab oladi va YOLOv8 formatida tayyorlaydi.
"""

import os
import sys

def download_roboflow_dataset(api_key=None):
    print("=" * 60)
    print("📥 AgroPlant Dataset Yuklovchi (Roboflow / Open PlantVillage)")
    print("=" * 60)

    try:
        from roboflow import Roboflow
    except ImportError:
        print("[*] roboflow kutubxonasi o'rnatilmoqda...")
        os.system("pip install roboflow")
        from roboflow import Roboflow

    if not api_key:
        api_key = os.getenv("ROBOFLOW_API_KEY")

    if not api_key:
        print("\nℹ️ Roboflow API kaliti kiritilmagan.")
        print("Siz roboflow.com saytidan bepul API kalit olishingiz mumkin.")
        print("Yoki mavjud dataset papkangizni './dataset' manziliga joylashtirishingiz mumkin:")
        print("  dataset/")
        print("    ├── images/")
        print("    │    ├── train/")
        print("    │    └── val/")
        print("    └── labels/")
        print("         ├── train/")
        print("         └── val/")
        return

    rf = Roboflow(api_key=api_key)
    # Masalan: Mashhur ochiq Plant Village Crop Disease loyihasi
    try:
        project = rf.workspace("plant-pathology").project("crop-diseases-detection")
        version = project.version(1)
        dataset = version.download("yolov8")
        print(f"✅ Dataset muvaffaqiyatli yuklandi: {dataset.location}")
    except Exception as e:
        print(f"⚠️ Xatolik: {e}")

if __name__ == "__main__":
    api_key_arg = sys.argv[1] if len(sys.argv) > 1 else None
    download_roboflow_dataset(api_key_arg)

