import API from "./api";

export const previewStatement = (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  return API.post("/statements/preview", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
};

export const confirmStatement = (transactions: any[]) => {
  return API.post("/statements/confirm", { transactions });
};
