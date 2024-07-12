export const getTokenFromEvisortAPI = async () => {
  const endpointUrl = "https://api.evisort.com/v1/auth/token";

  try {
    const API_KEY = process.env.EVISORT_API_KEY;

    const resp = await fetch(endpointUrl, {
      method: "POST",
      //@ts-ignore
      headers: {
        "EVISORT-API-KEY": API_KEY,
      },
    });

    const { token } = await resp.json();

    return {
      success: true,
      token,
    };
  } catch (err: unknown) {
    return {
      success: false,
      message: err instanceof Error ? err.message : "Failed to generate Token",
    };
  }
};
