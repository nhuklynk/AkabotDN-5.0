import apiClient from "../apiClient";

export interface Subscription {
  id: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  content?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSubscriptionDto {
  fullName: string;
  phoneNumber: string;
  email: string;
  content?: string;
}

export interface SubscriptionResponse {
  success: boolean;
  data: Subscription;
  message: string;
}

class SubscriptionService {
  private readonly baseUrl = "/subscriptions";

  async createSubscription(data: CreateSubscriptionDto): Promise<SubscriptionResponse> {
    try {
      const response = await apiClient.post<SubscriptionResponse>(this.baseUrl, data);
      return response.data;
    } catch (error) {
      console.error("Error creating subscription:", error);
      throw new Error("Không thể tạo đăng ký nhận tin. Vui lòng thử lại sau.");
    }
  }

}

export const subscriptionService = new SubscriptionService();
