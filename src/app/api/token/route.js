import axios from "axios";
import { NextResponse } from "next/server";
import rollbar from '../../../utils/rollbar';

export async function POST(req, res) {
  const body = await req.json();
  const customer_id = body?.customer_id;

  try {
    const response = await axios.get(
      "https://api.carbon.ai/auth/v1/access_token",
      {
        headers: {
          "Content-Type": "application/json",
          "customer-id": customer_id,
          authorization: `Bearer ${process.env.NEXT_PUBLIC_CARBON_API_KEY}`,
        },
      }
    );
    if (response.status === 200 && response.data) {
      //   res.status(200).json(response.data);
      return NextResponse.json({
        response: response.data,
        success: true,
      });
    }
  } catch (error) {
    rollbar.error(error);
    console.log("error in fetch token api", error);
  }
}
