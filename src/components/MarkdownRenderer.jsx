import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeRaw from "rehype-raw"
import { Typography, Box, Divider, useTheme } from "@mui/material"

const MarkdownRenderer = ({ content, variant = "primary" }) => {
  const theme = useTheme()

  // Determinar colores basados en la variante
  const colors =
    variant === "primary"
      ? {
          main: theme.palette.primary.main,
          dark: theme.palette.primary.dark,
          light: theme.palette.primary.light,
          bgHighlight: "rgba(58, 134, 255, 0.1)",
          decorationColor: "rgba(58, 134, 255, 0.3)",
        }
      : {
          main: theme.palette.secondary.main,
          dark: theme.palette.secondary.dark,
          light: theme.palette.secondary.light,
          bgHighlight: "rgba(16, 185, 129, 0.1)",
          decorationColor: "rgba(16, 185, 129, 0.3)",
        }

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw]}
      components={{
        p: ({ node, ...props }) => (
          <Typography
            component="div"
            variant="body1"
            sx={{
              lineHeight: 1.8,
              fontSize: "1.05rem",
              mb: 2.5,
              color: "text.primary",
              textAlign: "justify",
              whiteSpace: "pre-wrap",
              "& > p": {
                marginBottom: 2,
                display: "block",
              },
            }}
            {...props}
          />
        ),
        strong: ({ node, ...props }) => (
          <Box
            component="span"
            sx={{
              fontWeight: 700,
              color: colors.dark,
              bgcolor: colors.bgHighlight,
              px: 0.5,
              borderRadius: 1,
              display: "inline-block",
            }}
            {...props}
          />
        ),
        em: ({ node, ...props }) => (
          <Box
            component="span"
            sx={{
              fontStyle: "italic",
              color: colors.main,
              textDecoration: "underline",
              textDecorationColor: colors.decorationColor,
              textDecorationThickness: "1px",
              textUnderlineOffset: "3px",
            }}
            {...props}
          />
        ),
        h1: ({ node, ...props }) => (
          <Typography
            variant="h5"
            component="div"
            sx={{
              fontWeight: 700,
              mb: 2,
              mt: 3,
              color: colors.dark,
              borderBottom: "2px solid",
              borderColor: colors.light,
              pb: 1,
            }}
            {...props}
          />
        ),
        h2: ({ node, ...props }) => (
          <Typography
            variant="h6"
            component="div"
            sx={{
              fontWeight: 700,
              mb: 1.5,
              mt: 2.5,
              color: colors.main,
            }}
            {...props}
          />
        ),
        h3: ({ node, ...props }) => (
          <Typography
            variant="subtitle1"
            component="div"
            sx={{
              fontWeight: 700,
              mb: 1.5,
              mt: 2,
              color: colors.dark,
              borderLeft: "3px solid",
              borderColor: colors.light,
              pl: 1.5,
            }}
            {...props}
          />
        ),
        ul: ({ node, ...props }) => (
          <Box
            component="ul"
            sx={{
              pl: 2,
              mb: 2.5,
              "& li": {
                mb: 1,
              },
              "& li::marker": {
                color: colors.main,
              },
            }}
            {...props}
          />
        ),
        ol: ({ node, ...props }) => (
          <Box
            component="ol"
            sx={{
              pl: 2,
              mb: 2.5,
              "& li": {
                mb: 1,
              },
              "& li::marker": {
                color: colors.main,
                fontWeight: 600,
              },
            }}
            {...props}
          />
        ),
        li: ({ node, ...props }) => (
          <Typography
            component="li"
            variant="body1"
            sx={{
              mb: 1,
              pl: 0.5,
            }}
            {...props}
          />
        ),
        blockquote: ({ node, ...props }) => (
          <Box
            component="blockquote"
            sx={{
              borderLeft: "4px solid",
              borderColor: colors.light,
              pl: 2,
              py: 0.5,
              my: 2,
              bgcolor: `rgba(${variant === "primary" ? "58, 134, 255" : "16, 185, 129"}, 0.05)`,
              borderRadius: "0 4px 4px 0",
              "& p": {
                fontStyle: "italic",
                color: theme.palette.text.secondary,
                m: 0,
              },
            }}
            {...props}
          />
        ),
        code: ({ node, inline, ...props }) =>
          inline ? (
            <Box
              component="code"
              sx={{
                fontFamily: "monospace",
                bgcolor: "rgba(0, 0, 0, 0.04)",
                p: 0.5,
                borderRadius: 1,
                fontSize: "0.9em",
              }}
              {...props}
            />
          ) : (
            <Box
              component="pre"
              sx={{
                fontFamily: "monospace",
                bgcolor: "rgba(0, 0, 0, 0.04)",
                p: 1.5,
                borderRadius: 2,
                fontSize: "0.9em",
                overflowX: "auto",
              }}
            >
              <Box component="code" {...props} />
            </Box>
          ),
        hr: ({ node, ...props }) => (
          <Divider
            sx={{
              my: 2.5,
              borderColor: `rgba(${variant === "primary" ? "58, 134, 255" : "16, 185, 129"}, 0.2)`,
            }}
            {...props}
          />
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  )
}

export default MarkdownRenderer

