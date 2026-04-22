export const apiCall = async (url, options = {}) => {
  const isFormData = options.body instanceof FormData;

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
    ...options,
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(options.headers || {}),
      Authorization: localStorage.getItem("token")
        ? `Bearer ${localStorage.getItem("token")}`
        : "",
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
};
