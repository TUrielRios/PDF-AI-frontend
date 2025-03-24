"use client"
import { Box, Typography, Paper, Button, CircularProgress, IconButton, Drawer, Divider, Chip } from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"
import SummarizeIcon from "@mui/icons-material/Summarize"
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome"
import ReactMarkdown from "react-markdown"

export default function SummarySidebar({
  open,
  onClose,
  pdfData,
  currentPage,
  summaries,
  setSummaries,
  loadingSummary,
  setLoadingSummary,
  streamingSummary,
  setStreamingSummary,
}) {
  // Verificar si ya hay un resumen para la página actual
  const hasSummary = Boolean(summaries[currentPage])

  const handleGenerateSummary = async () => {
    // Skip if we already have a summary for this page
    if (summaries[currentPage]) return

    setLoadingSummary(true)
    setStreamingSummary(true)

    try {
      // Inicializar el resumen vacío para empezar a mostrar el streaming
      setSummaries((prev) => ({
        ...prev,
        [currentPage]: "",
      }))

      const response = await fetch("https://pdf-ai-teal.vercel.app/summarize", {
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

      // Si el backend no soporta streaming, usar la respuesta normal
      if (!response.headers.get("Content-Type")?.includes("text/event-stream")) {
        const data = await response.json()
        setSummaries((prev) => ({
          ...prev,
          [currentPage]: data.summary,
        }))
        return
      }

      // Leer la respuesta en streaming
      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let accumulatedContent = ""

      while (true) {
        const { done, value } = await reader.read()

        if (done) {
          break
        }

        // Decodificar el chunk recibido
        const chunk = decoder.decode(value, { stream: true })

        // Procesar los eventos SSE
        const lines = chunk.split("\n\n")
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const content = line.substring(6) // Quitar "data: "

            // Acumular el contenido
            accumulatedContent += content

            // Actualizar el resumen con el contenido acumulado
            setSummaries((prev) => ({
              ...prev,
              [currentPage]: accumulatedContent,
            }))
          }
        }
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
      setStreamingSummary(false)
    }
  }

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      variant="temporary"
      PaperProps={{
        sx: {
          width: { xs: "100%", sm: 400 },
          boxShadow: "-4px 0 20px rgba(0, 0, 0, 0.1)",
          p: 0,
        },
      }}
    >
      <Box
        sx={{
          p: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          bgcolor: "secondary.main",
          color: "white",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <SummarizeIcon sx={{ mr: 1 }} />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Resumen de la Página {currentPage}
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small" sx={{ color: "white" }}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Divider />

      <Box sx={{ p: 3, height: "calc(100% - 60px)", overflow: "auto" }}>
        {loadingSummary && !summaries[currentPage] ? (
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
          <Box>
            <Chip
              icon={<AutoAwesomeIcon />}
              label="Generado por IA"
              color="secondary"
              size="small"
              variant="outlined"
              sx={{ mb: 3 }}
            />

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
              <ReactMarkdown
                components={{
                  p: (props) => (
                    <Typography
                      variant="body1"
                      sx={{
                        lineHeight: 1.6,
                        fontSize: "1rem",
                        mb: 2,
                      }}
                      {...props}
                    />
                  ),
                  strong: (props) => <span style={{ fontWeight: 700 }} {...props} />,
                }}
              >
                {summaries[currentPage]}
              </ReactMarkdown>
              {streamingSummary && (
                <Box component="span" sx={{ display: "inline-block", ml: 0.5 }}>
                  <Typography
                    component="span"
                    variant="body1"
                    sx={{
                      animation: "blink 1s infinite",
                      "@keyframes blink": {
                        "0%": { opacity: 0 },
                        "50%": { opacity: 1 },
                        "100%": { opacity: 0 },
                      },
                    }}
                  >
                    ▋
                  </Typography>
                </Box>
              )}
            </Paper>
          </Box>
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
            <Typography variant="body1" color="text.secondary" gutterBottom>
              No hay resumen disponible para esta página
            </Typography>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleGenerateSummary}
              sx={{ mt: 2 }}
              startIcon={<SummarizeIcon />}
            >
              Generar Resumen
            </Button>
          </Box>
        )}
      </Box>
    </Drawer>
  )
}

