export const fetchApi = async (
  input: string | URL | Request,
  init?: RequestInit,
): Promise<Response> => {
  const response = await fetch(input, init);
  return response;
};

export const isMock = () => import.meta.env.VITE_MOCK_API_CALLS === "true";
