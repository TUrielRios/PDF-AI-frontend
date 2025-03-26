"use client"

import { useState } from "react"
import {
  Box,
  Typography,
  Paper,
  Button,
  Divider,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
  Grid,
  Chip,
  IconButton,
  Pagination,
  Stack,
  CircularProgress,
  Fade,
} from "@mui/material"
import ChatIcon from "@mui/icons-material/Chat"
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome"
import SummarizeIcon from "@mui/icons-material/Summarize"
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore"
import NavigateNextIcon from "@mui/icons-material/NavigateNext"
import PDFtest from "./PDFtest"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeRaw from "rehype-raw"

export default function ResultsView({ pdfData, onChatOpen, summaries, setSummaries }) {
  const [currentPage, setCurrentPage] = useState(1)
  const [loadingSummary, setLoadingSummary] = useState(false)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))
  const totalPages = Object.keys(pdfData.pages).length

  const handlePageChange = (event, newValue) => {
    setCurrentPage(newValue)
  }

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const handleGenerateSummary = async () => {
    // Skip if we already have a summary for this page
    if (summaries[currentPage]) return

    setLoadingSummary(true)

    try {
      // Hacer la solicitud al backend para generar el resumen
      //const response = await fetch("http://localhost:5000/summarize", {
      const response = await fetch("https://pdf-ai-teal.vercel.app/summarize",{
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: pdfData.pages[currentPage],
          page: currentPage,
          file_hash: "unknown", // In a real app, you'd get this from the backend
        }),
      })

      if (!response.ok) {
        throw new Error("Error al generar el resumen")
      }

      // Obtener la respuesta JSON
      const data = await response.json()
      console.log("Respuesta completa:", data)

      // Actualizar el resumen con la respuesta completa
      if (data.summary) {
        setSummaries((prev) => ({
          ...prev,
          [currentPage]: data.summary,
        }))
      } else if (data.error) {
        throw new Error(data.error)
      }
    } catch (error) {
      console.error("Error al generar el resumen:", error)
      // En caso de error, mostrar un mensaje de error como resumen
      setSummaries((prev) => ({
        ...prev,
        [currentPage]: "Error al generar el resumen. Por favor, inténtalo de nuevo.",
      }))
    } finally {
      setLoadingSummary(false)
    }
  }

  // Función para renderizar el contenido markdown
  const renderMarkdown = (content, variant = "secondary") => {
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

  return (
    <Box sx={{ mb: 4, position: "relative" }}>
      {/* Paginación y controles */}
      <Box
        sx={{
          mb: 3,
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mr: 2, color: "text.primary" }}>
            Página {currentPage} de {totalPages}
          </Typography>
          <Chip label={`PDF: ${pdfData.file_name || "Documento"}`} size="small" color="primary" variant="outlined" />
        </Box>

        <Stack spacing={1} direction="row" alignItems="center">
          <IconButton
            onClick={handlePrevPage}
            disabled={currentPage <= 1}
            size="small"
            sx={{
              bgcolor: currentPage > 1 ? "secondary.light" : "grey.200",
              color: "white",
              "&:hover": {
                bgcolor: "secondary.main",
              },
              width: 32,
              height: 32,
            }}
          >
            <NavigateBeforeIcon fontSize="small" />
          </IconButton>

          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="secondary"
            size="small"
            siblingCount={isMobile ? 0 : 1}
            sx={{
              "& .MuiPaginationItem-root": {
                fontWeight: 600,
                fontSize: "0.8rem",
              },
              "& .Mui-selected": {
                bgcolor: "secondary.main",
                color: "white",
                "&:hover": {
                  bgcolor: "secondary.dark",
                },
              },
            }}
          />

          <IconButton
            onClick={handleNextPage}
            disabled={currentPage >= totalPages}
            size="small"
            sx={{
              bgcolor: currentPage < totalPages ? "secondary.light" : "grey.200",
              color: "white",
              "&:hover": {
                bgcolor: "secondary.main",
              },
              width: 32,
              height: 32,
            }}
          >
            <NavigateNextIcon fontSize="small" />
          </IconButton>
        </Stack>
      </Box>

      {/* Contenedor principal con PDF y Resumen */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* PDF Viewer - Lado izquierdo */}
        <Grid item xs={12} md={6}>
          <Paper
            elevation={3}
            sx={{
              borderRadius: 3,
              overflow: "hidden",
              height: "600px",
              border: "1px solid",
              borderColor: "divider",
              position: "relative",
              transition: "all 0.3s ease",
              "&:hover": {
                boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
              },
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                width: "5px",
                height: "100%",
                background: "linear-gradient(to bottom, #3a86ff, #60a5fa)",
                borderRadius: "3px 0 0 3px",
              },
            }}
          >
            <Box sx={{ p: 2, borderBottom: "1px solid", borderColor: "divider", bgcolor: "background.paper" }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: "primary.main" }}>
                Visualizador PDF
              </Typography>
            </Box>
            <Box sx={{ height: "calc(100% - 56px)" }}>
              <PDFtest pdfData={pdfData.file_url} currentPage={currentPage} />
            </Box>
          </Paper>
        </Grid>

        {/* Resumen - Lado derecho */}
        <Grid item xs={12} md={6}>
          <Paper
            elevation={3}
            sx={{
              borderRadius: 3,
              overflow: "hidden",
              height: "600px",
              border: "1px solid",
              borderColor: "divider",
              display: "flex",
              flexDirection: "column",
              position: "relative",
              transition: "all 0.3s ease",
              "&:hover": {
                boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
              },
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                width: "5px",
                height: "100%",
                background: "linear-gradient(to bottom, #10b981, #34d399)",
                borderRadius: "3px 0 0 3px",
              },
            }}
          >
            <Box
              sx={{
                p: 2,
                borderBottom: "1px solid",
                borderColor: "divider",
                bgcolor: "background.paper",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <SummarizeIcon sx={{ color: "secondary.main", mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 700, color: "secondary.main" }}>
                  Resumen Inteligente
                </Typography>
              </Box>
              <Chip label={`Página ${currentPage}`} size="small" color="secondary" variant="outlined" />
            </Box>

            <Box sx={{ p: 3, flexGrow: 1, overflow: "auto" }}>
              {loadingSummary ? (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                  }}
                >
                  <CircularProgress size={40} color="secondary" />
                  <Typography variant="body1" sx={{ mt: 2, color: "text.secondary" }}>
                    Generando resumen...
                  </Typography>
                </Box>
              ) : summaries[currentPage] ? (
                <Fade in={true} timeout={500}>
                  <Box>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                      <Chip
                        icon={<AutoAwesomeIcon />}
                        label="Generado por IA"
                        color="secondary"
                        size="small"
                        variant="outlined"
                      />
                      <Typography variant="caption" sx={{ ml: 2, color: "text.secondary" }}>
                        Resumen generado automáticamente
                      </Typography>
                    </Box>

                    <Paper
                      elevation={0}
                      sx={{
                        p: 3,
                        borderRadius: 2,
                        bgcolor: "rgba(16, 185, 129, 0.05)",
                        border: "1px solid",
                        borderColor: "rgba(16, 185, 129, 0.2)",
                      }}
                    >
                      {renderMarkdown(summaries[currentPage], "secondary")}
                    </Paper>
                  </Box>
                </Fade>
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                  }}
                >
                  <Box sx={{ mb: 3, textAlign: "center" }}>
                    <SummarizeIcon sx={{ fontSize: 60, color: "secondary.light", mb: 2, opacity: 0.7 }} />
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      No hay resumen disponible
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 300, mx: "auto", mb: 3 }}>
                      Genera un resumen inteligente de esta página para entender mejor su contenido
                    </Typography>
                  </Box>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleGenerateSummary}
                    startIcon={<AutoAwesomeIcon />}
                    size="large"
                    sx={{
                      px: 4,
                      py: 1.5,
                      borderRadius: 3,
                      boxShadow: "0 4px 14px rgba(16, 185, 129, 0.4)",
                    }}
                  >
                    Generar Resumen
                  </Button>
                </Box>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* AI Explanation - Bottom */}
      <Card
        elevation={3}
        sx={{
          borderRadius: 3,
          overflow: "hidden",
          position: "relative",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "5px",
            background: "linear-gradient(90deg, #3a86ff, #10b981)",
          },
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <AutoAwesomeIcon sx={{ color: "primary.main", mr: 1 }} />
            <Typography variant="h5" component="h2" sx={{ fontWeight: 700 }}>
              Explicación de IA
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<ChatIcon />}
              onClick={onChatOpen}
              sx={{ ml: "auto", borderRadius: 3 }}
            >
              Hacer Preguntas
            </Button>
          </Box>
          <Divider sx={{ mb: 2 }} />
          {renderMarkdown(pdfData.explanation, "primary")}
        </CardContent>
      </Card>
    </Box>
  )
}

