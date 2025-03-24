import { createTheme } from "@mui/material/styles"

const theme = createTheme({
  palette: {
    primary: {
      main: "#3a86ff",
      light: "#6ea8fe",
      dark: "#2563eb",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#10b981",
      light: "#34d399",
      dark: "#059669",
      contrastText: "#ffffff",
    },
    background: {
      default: "#f8fafc",
      paper: "#ffffff",
    },
    text: {
      primary: "#1e293b",
      secondary: "#64748b",
    },
    error: {
      main: "#ef4444",
    },
    warning: {
      main: "#f59e0b",
    },
    info: {
      main: "#3b82f6",
    },
    success: {
      main: "#10b981",
    },
  },
  typography: {
    fontFamily: '"Plus Jakarta Sans", "Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 800,
      fontSize: "2.5rem",
      lineHeight: 1.2,
      letterSpacing: "-0.02em",
    },
    h2: {
      fontWeight: 700,
      fontSize: "2rem",
      lineHeight: 1.2,
      letterSpacing: "-0.01em",
    },
    h3: {
      fontWeight: 700,
      fontSize: "1.5rem",
      lineHeight: 1.3,
      letterSpacing: "-0.01em",
    },
    h4: {
      fontWeight: 600,
      fontSize: "1.25rem",
      lineHeight: 1.4,
    },
    h5: {
      fontWeight: 600,
      fontSize: "1.1rem",
      lineHeight: 1.4,
    },
    h6: {
      fontWeight: 600,
      fontSize: "1rem",
      lineHeight: 1.4,
    },
    body1: {
      fontSize: "1rem",
      lineHeight: 1.5,
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    },
    body2: {
      fontSize: "0.875rem",
      lineHeight: 1.5,
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    },
    button: {
      textTransform: "none",
      fontWeight: 500,
      fontFamily: '"Plus Jakarta Sans", "Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    "none",
    "0px 2px 4px rgba(0, 0, 0, 0.05)",
    "0px 4px 6px rgba(0, 0, 0, 0.05)",
    "0px 6px 8px rgba(0, 0, 0, 0.05)",
    "0px 8px 12px rgba(0, 0, 0, 0.05)",
    "0px 12px 16px rgba(0, 0, 0, 0.05)",
    "0px 16px 24px rgba(0, 0, 0, 0.05)",
    "0px 20px 28px rgba(0, 0, 0, 0.05)",
    "0px 24px 32px rgba(0, 0, 0, 0.05)",
    "0px 28px 36px rgba(0, 0, 0, 0.05)",
    "0px 32px 40px rgba(0, 0, 0, 0.05)",
    "0px 36px 44px rgba(0, 0, 0, 0.05)",
    "0px 40px 48px rgba(0, 0, 0, 0.05)",
    "0px 44px 52px rgba(0, 0, 0, 0.05)",
    "0px 48px 56px rgba(0, 0, 0, 0.05)",
    "0px 52px 60px rgba(0, 0, 0, 0.05)",
    "0px 56px 64px rgba(0, 0, 0, 0.05)",
    "0px 60px 68px rgba(0, 0, 0, 0.05)",
    "0px 64px 72px rgba(0, 0, 0, 0.05)",
    "0px 68px 76px rgba(0, 0, 0, 0.05)",
    "0px 72px 80px rgba(0, 0, 0, 0.05)",
    "0px 76px 84px rgba(0, 0, 0, 0.05)",
    "0px 80px 88px rgba(0, 0, 0, 0.05)",
    "0px 84px 92px rgba(0, 0, 0, 0.05)",
    "0px 88px 96px rgba(0, 0, 0, 0.05)",
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: "10px 20px",
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.05)",
          transition: "all 0.2s ease-in-out",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: "0px 6px 8px rgba(0, 0, 0, 0.1)",
          },
        },
        containedPrimary: {
          background: "linear-gradient(45deg, #3a86ff 30%, #60a5fa 90%)",
        },
        containedSecondary: {
          background: "linear-gradient(45deg, #10b981 30%, #34d399 90%)",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.05)",
          transition: "all 0.3s ease-in-out",
          "&:hover": {
            boxShadow: "0px 12px 20px rgba(0, 0, 0, 0.1)",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.05)",
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          fontSize: "0.9rem",
          textTransform: "none",
          minWidth: 100,
          "&.Mui-selected": {
            color: "#3a86ff",
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          height: 3,
          borderRadius: "3px 3px 0 0",
        },
      },
    },
  },
})

export default theme

