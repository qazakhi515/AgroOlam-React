export const serverApi: string = `${process.env.REACT_APP_API_URL}`;

export const Messages = {
  error1: "Something went wrong",
  error2: "Please login first!",
  error3: "Please pulfil all inputs!",
  error4: "Message is empty",
  error5: "Only images with jpeg, jpg, png format allowed",
};

/**
 * Resolves user/member avatar image safely.
 * Returns valid data URI, full URL, root-relative path, or falls back to default-user.svg.
 */
export const getMemberImageSrc = (image?: string | null): string => {
  if (!image || typeof image !== "string" || image.trim() === "" || image === "undefined" || image === "null") {
    return "/icons/default-user.svg";
  }
  const clean = image.trim();
  if (
    clean.startsWith("data:") ||
    clean.startsWith("blob:") ||
    clean.startsWith("http://") ||
    clean.startsWith("https://") ||
    clean.startsWith("/")
  ) {
    return clean;
  }
  if (serverApi && serverApi !== "undefined" && serverApi.trim() !== "") {
    return `${serverApi.replace(/\/+$/, "")}/${clean.replace(/^\/+/, "")}`;
  }
  return "/icons/default-user.svg";
};

/**
 * Compresses an uploaded avatar to ~400x400 JPEG DataURL so it persists in localStorage without quota issues.
 */
export const compressAvatarImage = (file: File): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const src = event.target?.result as string;
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const maxDim = 400;
        let width = img.width;
        let height = img.height;
        if (width > height) {
          if (width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          }
        } else {
          if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL("image/jpeg", 0.85));
        } else {
          resolve(src);
        }
      };
      img.onerror = () => resolve(src);
      img.src = src;
    };
    reader.onerror = () => resolve("/icons/default-user.svg");
    reader.readAsDataURL(file);
  });
};
