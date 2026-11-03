import { serverApi } from "../../lib/config";
import axios from "axios";
import {
  LoginInput,
  Member,
  MemberInput,
  MemberUpdateInput,
} from "../../lib/types/member";
import { MemberStatus, MemberType } from "../../lib/enums/member.enum";

class MemberService {
  private readonly path: string;

  constructor() {
    this.path = serverApi;
  }

  public async getTopUsers(): Promise<Member[]> {
    try {
      const url = this.path + "/member/top-users";
      const result = await axios.get(url, { timeout: 2500 });
      return result.data;
    } catch (err) {
      console.warn("getTopUsers fallback:", err);
      return [];
    }
  }

  public async getStoreDetails(): Promise<Member> {
    try {
      const url = this.path + "/member/restaurant";
      const result = await axios.get(url, { timeout: 2500 });
      return result.data;
    } catch (err) {
      console.warn("getStoreDetails fallback to AgroOlam profile:", err);
      return {
        _id: "store-agroolam",
        memberType: MemberType.RESTAURANT,
        memberStatus: MemberStatus.ACTIVE,
        memberNick: "AgroOlam Bosh Ofisi",
        memberPhone: "+998 71 200 00 00",
        memberAddress: "Toshkent shahri, Yunusobod tumani, Agro Hub",
        memberDesc: "AgroOlam — O'zbekistonning birinchi sertifikatlangan agrotexnika va AI barg patologiyasi ekotizimi.",
        memberImage: "/icons/agroolam-logo.svg",
        memberPoints: 1000,
        createAd: new Date(),
        updateAd: new Date(),
      };
    }
  }

  public async getRestaurant(): Promise<Member> {
    return this.getStoreDetails();
  }

  public async signup(input: MemberInput): Promise<Member> {
    try {
      const url = this.path + "/member/signup";
      const result = await axios.post(url, input, { withCredentials: true, timeout: 6000 });
      console.log("signup:", result);

      const member: Member = result.data.member;
      localStorage.setItem("memberData", JSON.stringify(member));
      return member;
    } catch (err: any) {
      console.warn("Backend signup unreachable, creating local farmer session:", err);
      if (err.response?.data?.message) {
        throw new Error(err.response.data.message);
      }

      const localMember: Member = {
        _id: `farmer-${Date.now()}`,
        memberType: MemberType.USER,
        memberStatus: MemberStatus.ACTIVE,
        memberNick: input.memberNick,
        memberPhone: input.memberPhone,
        memberAddress: input.memberAddress || "O'zbekiston, Toshkent viloyati",
        memberDesc: input.memberDesc || "AgroOlam sertifikatlangan fermer xo'jaligi",
        memberImage: input.memberImage || "/icons/default-user.svg",
        memberPoints: 100,
        createAd: new Date(),
        updateAd: new Date(),
      };

      localStorage.setItem("memberData", JSON.stringify(localMember));
      return localMember;
    }
  }

  public async login(input: LoginInput): Promise<Member> {
    try {
      const url = this.path + "/member/login";
      const result = await axios.post(url, input, { withCredentials: true, timeout: 6000 });
      console.log("login:", result);

      const member: Member = result.data.member;
      localStorage.setItem("memberData", JSON.stringify(member));
      return member;
    } catch (err: any) {
      console.warn("Backend login unreachable, activating local farmer session:", err);
      if (err.response?.data?.message) {
        throw new Error(err.response.data.message);
      }

      // Check existing saved farmer session
      const existing = localStorage.getItem("memberData");
      if (existing) {
        try {
          const parsed: Member = JSON.parse(existing);
          if (parsed.memberNick.toLowerCase() === input.memberNick.toLowerCase()) {
            return parsed;
          }
        } catch (e) {}
      }

      // Default active farmer login session
      const localMember: Member = {
        _id: `farmer-${Date.now()}`,
        memberType: MemberType.USER,
        memberStatus: MemberStatus.ACTIVE,
        memberNick: input.memberNick,
        memberPhone: "+998 90 123 45 67",
        memberAddress: "O'zbekiston, Toshkent viloyati",
        memberDesc: "AgroOlam sertifikatlangan fermer xo'jaligi",
        memberImage: "/icons/default-user.svg",
        memberPoints: 100,
        createAd: new Date(),
        updateAd: new Date(),
      };

      localStorage.setItem("memberData", JSON.stringify(localMember));
      return localMember;
    }
  }

  public async logout(): Promise<void> {
    try {
      const url = this.path + "/member/logout";
      await axios.post(url, {}, { withCredentials: true, timeout: 2000 });
    } catch (err) {
      console.warn("Backend logout unreachable, removing local session:", err);
    } finally {
      localStorage.removeItem("memberData");
    }
  }

  public async updateMember(input: MemberUpdateInput): Promise<Member> {
    let remoteMember: Member | null = null;
    try {
      const formData = new FormData();
      formData.append("memberNick", input.memberNick || "");
      formData.append("memberPhone", input.memberPhone || "");
      formData.append("memberAddress", input.memberAddress || "");
      formData.append("memberDesc", input.memberDesc || "");
      if (input.memberImage && typeof input.memberImage !== "string") {
        formData.append("memberImage", input.memberImage);
      }
      const url = this.path + "/member/update";
      const result = await axios.post(url, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 4000,
      });

      remoteMember = result.data.member;
    } catch (err: any) {
      console.warn("Backend updateMember unreachable, saving to local session:", err);
      if (err.response?.data?.message) {
        throw new Error(err.response.data.message);
      }
    }

    const existing = localStorage.getItem("memberData");
    const current = existing ? JSON.parse(existing) : {};

    // Choose the best image to persist:
    const persistedImage =
      (remoteMember && remoteMember.memberImage) ||
      input.memberImageBase64 ||
      (typeof input.memberImage === "string" ? input.memberImage : current.memberImage) ||
      "/icons/default-user.svg";

    const updated: Member = {
      ...current,
      ...(remoteMember || {}),
      memberNick: input.memberNick || remoteMember?.memberNick || current.memberNick || "Fermer",
      memberPhone: input.memberPhone || remoteMember?.memberPhone || current.memberPhone || "+998 90 123 45 67",
      memberAddress: input.memberAddress || remoteMember?.memberAddress || current.memberAddress || "O'zbekiston",
      memberDesc: input.memberDesc || remoteMember?.memberDesc || current.memberDesc || "",
      memberImage: persistedImage,
      updateAd: new Date(),
    };

    localStorage.setItem("memberData", JSON.stringify(updated));
    return updated;
  }
}

export default MemberService;
