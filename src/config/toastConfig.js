export const toastConfig = {
  position: "top-center",
  reverseOrder: false,
  gutter: 8,
  containerClassName: "",
  containerStyle: {},
  toastOptions: {
    // 기본 옵션
    className: "",
    duration: 3000,
    style: {
      background: "#363636",
      color: "#fff",
      borderRadius: "12px",
      padding: "16px",
      fontSize: "14px",
      fontWeight: "500",
    },
    // 성공 토스트 옵션
    success: {
      duration: 3000,
      style: {
        background: "#10b981",
        color: "#fff",
      },
      iconTheme: {
        primary: "#fff",
        secondary: "#10b981",
      },
    },
    // 에러 토스트 옵션
    error: {
      duration: 4000,
      style: {
        background: "#ef4444",
        color: "#fff",
      },
      iconTheme: {
        primary: "#fff",
        secondary: "#ef4444",
      },
    },
  },
};
