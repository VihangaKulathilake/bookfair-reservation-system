import { createTheme } from "@mui/material/styles";

const theme = createTheme({
    palette: {
        primary: {
            main: "#0D47A1",   // Deep Blue
        },
        secondary: {
            main: "#F57C00",   // Warm Orange
        },
        background: {
            default: "#F4F6F8",
            paper: "#FFFFFF",
        },
        success: {
            main: "#2E7D32",
        },
        error: {
            main: "#D32F2F",
        },
        warning: {
            main: "#ED6C02",
        },
        info: {
            main: "#0288D1",
        },
    },
    typography: {
        fontFamily: "Roboto, sans-serif",
        h4: {
            fontWeight: 600,
        },
        button: {
            textTransform: "none",
            fontWeight: 500,
        },
    },
    shape: {
        borderRadius: 10,
    },
});

export default theme;
