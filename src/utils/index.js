import { auth } from "@/config/FirebaseConfig";
import axios from "axios";
import { signOut } from "firebase/auth";
import * as fernet from "fernet";

export const handleLogout = () => {
  signOut(auth)
    .then(() => {})
    .catch((error) => {
      console.log(error);
    });
  localStorage.clear();
};

export const removeQueryParam = (param, router, params, pathname) => {
  const searchParams = new URLSearchParams(params);
  searchParams.delete(param);
  router.replace(`${pathname}?${searchParams.toString()}`, undefined, {
    shallow: true,
  });
};

export const callSearchAPI = async (query, k, customerId) => {
  const options = {
    headers: {
      "Content-Type": "application/json",
      "customer-id": customerId,
      authorization: `Bearer ${process.env.NEXT_PUBLIC_CARBON_API_KEY}`,
    },
  };

  const body = {
    query: query,
    k: k,
    embedding_model: "OPENAI_ADA_LARGE_3072",
  };

  try {
    const response = await axios.post(
      "https://api.carbon.ai/embeddings",
      body,
      options
    );

    return response.data;
  } catch (error) {
    console.error("Error calling search API:", error);
  }
};

export const createUserCustomBot = async (
  userId,
  type,
  name,
  desc,
  prompt,
  email
) => {
  try {
    let formData = new FormData();
    formData.append("userId", userId);
    formData.append("type", type ? type : "custom");
    name && formData.append("name", name);
    desc && formData.append("description", desc);
    prompt && formData.append("prompt", prompt);
    email && formData.append("email", email);

    const response = await axios.post(
      process.env.NEXT_PUBLIC_NEW_BACKEND_URL + "/bot/create",
      formData
    );
    if (response?.data?.status == "success") {
      return response?.data;
    } else {
      return false;
    }
  } catch (error) {
    console.log("Error creating users bot:", error);
  }
};

export const updateUserCustomBot = async (botId, type, name, desc, prompt) => {
  try {
    let formData = new FormData();
    formData.append("botId", botId);
    formData.append("btype", type ? type : "custom");
    name && formData.append("name", name);
    desc && formData.append("desc", desc);
    prompt && formData.append("prompt", prompt);

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_NEW_BACKEND_URL}/bot/customize`,
      formData
    );

    if (response?.data?.status == "success") {
      return response?.data;
    } else {
      return false;
    }
  } catch (error) {
    console.log("Error updating users bot:", error);
    throw error;
  }
};

export const loginUser = async (userId, code) => {
  try {
    let formData = new FormData();
    formData.append("userId", userId);
    code && formData.append("code", code);
    const response = await axios.post(
      process.env.NEXT_PUBLIC_NEW_BACKEND_URL + "/loginId",
      formData
    );
    return response.data;
  } catch (error) {
    console.log("error in login", error);
  }
};

export const encryptApiKey = (apiKey) => {
  const secret = new fernet.Secret(process.env.NEXT_PUBLIC_FERNET_SECRET_KEY);
  const token = new fernet.Token({
    secret: secret,
    token: null,
    ttl: 0,
  });
  return token.encode(apiKey);
};

export const decryptApiKey = (encryptedApiKey) => {
  try {
    const secret = new fernet.Secret(process.env.NEXT_PUBLIC_FERNET_SECRET_KEY);
    const token = new fernet.Token({
      secret: secret,
      token: encryptedApiKey,
      ttl: 0,
    });
    return token.decode();
  } catch (error) {
    console.error("Decryption failed:", error?.message);
    return "";
  }
};

export const verifyAppSumoCode = async (code) => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_NEW_BACKEND_URL}/appsumo_code?code=${code}`
    );

    if (response?.data?.status == "success") {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
};

export const getBannerProps = (plan) => {
  const loginCount = parseInt(localStorage.getItem("login_count") || "1");

  if (plan == process.env.NEXT_PUBLIC_ANNUAL_PREMIUM_PLAN) {
    return loginCount % 2 === 1
      ? { v: "v2", deal: undefined }
      : { v: undefined, deal: undefined };
  } else {
    switch (loginCount % 4) {
      case 1:
        return { v: "v2", deal: undefined };
      case 2:
        return { v: undefined, deal: "second" };
      case 3:
        return { v: undefined, deal: undefined };
      case 0:
        return { v: "v2", deal: "second" };
      default:
        return { v: undefined, deal: undefined };
    }
  }
};

export const getDealsNavButtonProps = (plan, deal) => {
  const loginCount = parseInt(localStorage.getItem("login_count") || "1");

  if (deal == "cyberMonday") {
    if (plan == process.env.NEXT_PUBLIC_ANNUAL_PREMIUM_PLAN) {
      return {
        buttonText: "Cyber Monday -36% discount",
        deal: undefined,
      };
    } else {
      if (loginCount % 2 === 1) {
        return {
          buttonText: "Cyber Monday -36% discount",
          deal: undefined,
        };
      } else {
        return {
          buttonText: "Cyber Monday -18% discount",
          deal: "second",
        };
      }
    }
  } else {
    // Black friday deal
    if (plan === process.env.NEXT_PUBLIC_ANNUAL_PREMIUM_PLAN) {
      return {
        buttonText: "Black Friday -47% discount",
        deal: undefined,
      };
    } else {
      if (loginCount % 2 === 1) {
        return {
          buttonText: "Black Friday -47% discount",
          deal: undefined,
        };
      } else {
        return {
          buttonText: "Black Friday -10% discount",
          deal: "second",
        };
      }
    }
  }
};
