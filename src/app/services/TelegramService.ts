import axios from "axios";
import { serverApi } from "../../lib/config";

export interface TelegramStatusResponse {
  isConnected: boolean;
  telegramChatId: string;
  telegramUsername: string;
  botUsername: string;
}

class TelegramService {
  private readonly path: string;

  constructor() {
    this.path = serverApi;
  }

  public async getStatus(): Promise<TelegramStatusResponse> {
    try {
      const url = `${this.path}/member/telegram-status`;
      const result = await axios.get(url, { withCredentials: true });
      return result.data;
    } catch (err) {
      console.log("Error in getStatus:", err);
      throw err;
    }
  }

  public async linkTelegram(
    telegramChatId: string,
    telegramUsername?: string
  ): Promise<{ message: string; telegramChatId: string; telegramUsername: string }> {
    try {
      const url = `${this.path}/member/telegram-link`;
      const result = await axios.post(
        url,
        { telegramChatId, telegramUsername },
        { withCredentials: true }
      );
      return result.data;
    } catch (err) {
      console.log("Error in linkTelegram:", err);
      throw err;
    }
  }

  public async sendTestAlert(): Promise<{ message: string }> {
    try {
      const url = `${this.path}/member/telegram-test`;
      const result = await axios.post(url, {}, { withCredentials: true });
      return result.data;
    } catch (err) {
      console.log("Error in sendTestAlert:", err);
      throw err;
    }
  }
}

export default TelegramService;
