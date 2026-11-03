import { Box, Button } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import SaveIcon from "@mui/icons-material/Save";
import AgricultureIcon from "@mui/icons-material/Agriculture";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import YardIcon from "@mui/icons-material/Yard";
import { useGlobals } from "../../components/hooks/useGlobals";
import { useEffect, useState } from "react";
import { MemberUpdateInput } from "../../../lib/types/member";
import { T } from "../../../lib/types/common";
import {
  sweetErrorHandling,
  sweetTopSmallSuccessAlert,
} from "../../../lib/sweetAlert";
import { getSavedLanguage, translations } from "../../../lib/i18n";
import { Messages, getMemberImageSrc, compressAvatarImage } from "../../../lib/config";
import MemberService from "../../services/memberService";

const COMMON_CROPS = [
  "Pomidor (Issiqxona)",
  "Bodring (F1)",
  "Bolgar qalampiri",
  "Achchiq qalampir",
  "Qulupnay",
  "Ko'katlar",
  "Baqlajon",
];

const COMMON_REGIONS = [
  "Toshkent viloyati",
  "Samarqand viloyati",
  "Farg'ona vodiysi",
  "Buxoro viloyati",
  "Surxondaryo viloyati",
  "Qashqadaryo viloyati",
  "Andijon viloyati",
  "Namangan viloyati",
  "Xorazm viloyati",
  "Navoiy viloyati",
  "Jizzax viloyati",
  "Sirdaryo viloyati",
];

export function Settings() {
  const { authMember, setAuthMember } = useGlobals();
  const lang = getSavedLanguage();
  const t = translations[lang].member;
  const [memberImage, setMemberImage] = useState<string>(
    getMemberImageSrc(authMember?.memberImage),
  );

  useEffect(() => {
    if (authMember?.memberImage) {
      setMemberImage(getMemberImageSrc(authMember.memberImage));
    }
  }, [authMember?.memberImage]);

  const [memberUpdateInput, setMemberUpdateInput] = useState<MemberUpdateInput>({
    memberNick: authMember?.memberNick || "",
    memberPhone: authMember?.memberPhone || "",
    memberAddress: authMember?.memberAddress || "",
    memberDesc: authMember?.memberDesc || "",
    memberImage: authMember?.memberImage,
  });

  const memberNickHandler = (e: T) => {
    memberUpdateInput.memberNick = e.target.value;
    setMemberUpdateInput({ ...memberUpdateInput });
  };

  const memberPhoneHandler = (e: T) => {
    memberUpdateInput.memberPhone = e.target.value;
    setMemberUpdateInput({ ...memberUpdateInput });
  };

  const memberAddressHandler = (e: T) => {
    memberUpdateInput.memberAddress = e.target.value;
    setMemberUpdateInput({ ...memberUpdateInput });
  };

  const memberDescriptionHandler = (e: T) => {
    memberUpdateInput.memberDesc = e.target.value;
    setMemberUpdateInput({ ...memberUpdateInput });
  };

  const handleSelectCrop = (crop: string) => {
    const current = memberUpdateInput.memberDesc || "";
    if (current.includes(crop)) return;
    const updated = current ? `${current}, ${crop}` : `Asosiy ekinlar: ${crop}`;
    memberUpdateInput.memberDesc = updated;
    setMemberUpdateInput({ ...memberUpdateInput });
  };

  const handleSelectRegion = (region: string) => {
    memberUpdateInput.memberAddress = region;
    setMemberUpdateInput({ ...memberUpdateInput });
  };

  const handleSubmitButton = async () => {
    try {
      if (!authMember) throw new Error(Messages.error2);
      if (
        !memberUpdateInput.memberNick ||
        !memberUpdateInput.memberPhone
      ) {
        throw new Error("Iltimos, ism va telefon raqamingizni to'ldiring!");
      }

      const member = new MemberService();
      const result = await member.updateMember(memberUpdateInput);
      setAuthMember(result);

      await sweetTopSmallSuccessAlert("Fermer profili muvaffaqiyatli saqlandi!", 1000);
    } catch (err) {
      console.log(err);
      sweetErrorHandling(err).then();
    }
  };

  const handleImageViewer = async (e: T) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileType = file.type;
    const validateImageTypes = ["image/jpg", "image/jpeg", "image/png", "image/webp"];

    if (!validateImageTypes.includes(fileType)) {
      sweetErrorHandling(Messages.error5).then();
    } else {
      try {
        const compressedBase64 = await compressAvatarImage(file);
        setMemberImage(compressedBase64);
        setMemberUpdateInput({
          ...memberUpdateInput,
          memberImage: file,
          memberImageBase64: compressedBase64,
        });
      } catch (err) {
        console.warn("Avatar compression failed:", err);
        setMemberImage(URL.createObjectURL(file));
        setMemberUpdateInput({
          ...memberUpdateInput,
          memberImage: file,
        });
      }
    }
  };

  return (
    <Box className="settings">
      {/* Avatar Upload */}
      <Box className="member-media-frame">
        <img
          src={memberImage}
          className="mb-image"
          alt="Avatar"
          onError={(e: any) => {
            e.target.src = "/icons/default-user.svg";
          }}
        />
        <div className="media-change-box">
          <span>Profil fotosurati</span>
          <p>{t.photoHint}</p>
          <div className="up-del-box">
            <Button
              component="label"
              className="upload-btn-styled"
              startIcon={<CloudUploadIcon sx={{ fontSize: 16 }} />}
            >
              Suratni yangilash
              <input type="file" hidden accept="image/*" onChange={handleImageViewer} />
            </Button>
          </div>
        </div>
      </Box>

      {/* Row 1: Farmer Name & Phone */}
      <Box className="input-frame">
        <div className="short-input">
          <label className="spec-label">
            <AgricultureIcon sx={{ fontSize: 18, color: "#1B4332" }} />
            {t.nickname} *
          </label>
          <input
            className="spec-input"
            type="text"
            placeholder={t.nickname}
            value={memberUpdateInput.memberNick || ""}
            onChange={memberNickHandler}
          />
        </div>

        <div className="short-input">
          <label className="spec-label">
            <PhoneIphoneIcon sx={{ fontSize: 18, color: "#1B4332" }} />
            {t.phone} *
          </label>
          <input
            className="spec-input"
            type="text"
            placeholder="+998 90 123 45 67"
            value={memberUpdateInput.memberPhone || ""}
            onChange={memberPhoneHandler}
          />
        </div>
      </Box>

      {/* Row 2: Location with preset regions */}
      <Box className="input-frame">
        <div className="long-input">
          <label className="spec-label">
            <LocationOnIcon sx={{ fontSize: 18, color: "#1B4332" }} />
            {t.address}
          </label>
          <input
            className="spec-input"
            type="text"
            placeholder={t.address}
            value={memberUpdateInput.memberAddress || ""}
            onChange={memberAddressHandler}
          />

          {/* Quick Region Selector Chips */}
          <div className="farm-spec-tag-group">
            {COMMON_REGIONS.slice(0, 6).map((region) => (
              <span
                key={region}
                className={`farm-spec-tag ${memberUpdateInput.memberAddress?.includes(region) ? "selected" : ""}`}
                onClick={() => handleSelectRegion(region)}
              >
                📍 {region}
              </span>
            ))}
          </div>
        </div>
      </Box>

      {/* Row 3: Farm specs & Primary crops */}
      <Box className="input-frame">
        <div className="long-input">
          <label className="spec-label">
            <YardIcon sx={{ fontSize: 18, color: "#1B4332" }} />
            Issiqxona maydoni va Asosiy ekinlar
          </label>

          {/* Crop quick-add chips */}
          <div className="farm-spec-tag-group" style={{ marginBottom: 10 }}>
            {COMMON_CROPS.map((crop) => (
              <span
                key={crop}
                className={`farm-spec-tag ${memberUpdateInput.memberDesc?.includes(crop) ? "selected" : ""}`}
                onClick={() => handleSelectCrop(crop)}
              >
                🌱 + {crop}
              </span>
            ))}
          </div>

          <textarea
            className="spec-textarea"
            placeholder="Issiqxona maydoni (masalan: 12 sotix), yetishtiriladigan gibridlar, sug'orish turi (tomchilatib) va ehtiyojlar..."
            value={memberUpdateInput.memberDesc || ""}
            onChange={memberDescriptionHandler}
          />
        </div>
      </Box>

      {/* Save Button */}
      <Box className="save-box">
        <Button
          variant="contained"
          className="save-btn"
          startIcon={<SaveIcon sx={{ fontSize: 18 }} />}
          onClick={handleSubmitButton}
        >
          {t.saveBtn}
        </Button>
      </Box>
    </Box>
  );
}
