"use client"

import { useState, useRef, useEffect } from "react"
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  CircularProgress,
  Avatar,
  Divider,
  useTheme,
  Card,
  CardContent,
} from "@mui/material"
import SendIcon from "@mui/icons-material/Send"
import SmartToyIcon from "@mui/icons-material/SmartToy"
import PersonIcon from "@mui/icons-material/Person"
import ReactMarkdown from "react-markdown"

export default function ChatView({ pdfData, messages, setMessages }) {
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)
  const theme = useTheme()

  // Auto scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleInputChange = (e) => {
    setInput(e.target.value)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!input.trim()) return

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      role: "user",
      content: input,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      // Get the current page text to use as context
      const currentPageText = Object.values(pdfData.pages).join("\n\n")

      const response = await fetch("https://pdf-ai-teal.vercel.app/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: input,
          context: currentPageText,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get response")
      }

      const data = await response.json()

      // Add assistant message
      const assistantMessage = {
        id: messages.length + 2,
        role: "assistant",
        content: data.response,
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("Error in chat:", error)

      // Add error message
      const errorMessage = {
        id: messages.length + 2,
        role: "assistant",
        content: "Lo siento, encontré un error al procesar tu solicitud. Por favor, inténtalo de nuevo.",
      }

      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <Typography
          variant="h3"
          component="h1"
          sx={{
            fontWeight: 700,
            fontSize: { xs: "1.75rem", md: "2.25rem" },
          }}
        >
          Chatea con tu PDF
        </Typography>
      </Box>

      <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 3 }}>
        <Box sx={{ flex: 1, width: "100%" }}>
          <Paper
            elevation={3}
            sx={{
              height: "70vh",
              display: "flex",
              flexDirection: "column",
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
            <Box
              sx={{
                p: 2,
                bgcolor: "background.paper",
                borderBottom: "1px solid",
                borderColor: "divider",
                display: "flex",
                alignItems: "center",
              }}
            >
              <SmartToyIcon sx={{ color: "primary.main", mr: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Asistente PDF
              </Typography>
            </Box>

            <Box
              sx={{
                flexGrow: 1,
                overflowY: "auto",
                p: 2,
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              {messages.map((message) => (
                <Box
                  key={message.id}
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignSelf: message.role === "user" ? "flex-end" : "flex-start",
                    maxWidth: "80%",
                  }}
                >
                  {message.role === "assistant" && (
                    <Avatar
                      sx={{
                        bgcolor: "primary.main",
                        width: 36,
                        height: 36,
                        mr: 1,
                      }}
                    >
                      <SmartToyIcon fontSize="small" />
                    </Avatar>
                  )}

                  <Paper
                    elevation={1}
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      bgcolor: message.role === "user" ? "primary.main" : "background.paper",
                      color: message.role === "user" ? "white" : "text.primary",
                      border: message.role === "assistant" ? "1px solid" : "none",
                      borderColor: "divider",
                    }}
                  >
                    {message.role === "user" ? (
                      <Typography variant="body1">{message.content}</Typography>
                    ) : (
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
                        {message.content}
                      </ReactMarkdown>
                    )}
                  </Paper>

                  {message.role === "user" && (
                    <Avatar
                      sx={{
                        bgcolor: "grey.300",
                        width: 36,
                        height: 36,
                        ml: 1,
                      }}
                    >
                      <PersonIcon fontSize="small" />
                    </Avatar>
                  )}
                </Box>
              ))}

              {isLoading && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, alignSelf: "flex-start" }}>
                  <Avatar
                    sx={{
                      bgcolor: "primary.main",
                      width: 36,
                      height: 36,
                    }}
                  >
                    <SmartToyIcon fontSize="small" />
                  </Avatar>
                  <CircularProgress size={24} />
                </Box>
              )}

              <div ref={messagesEndRef} />
            </Box>

            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{
                p: 2,
                borderTop: "1px solid",
                borderColor: "divider",
                bgcolor: "background.paper",
              }}
            >
              <Box sx={{ display: "flex", gap: 1 }}>
                <TextField
                  fullWidth
                  placeholder="Haz una pregunta sobre tu PDF..."
                  value={input}
                  onChange={handleInputChange}
                  variant="outlined"
                  size="medium"
                  disabled={isLoading}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                    },
                  }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={isLoading || !input.trim()}
                  sx={{ borderRadius: 2, px: 3 }}
                >
                  <SendIcon />
                </Button>
              </Box>
            </Box>
          </Paper>
        </Box>

        <Box
          sx={{
            width: { xs: "100%", md: "300px" },
            display: { xs: "none", md: "block" },
          }}
        >
          <Card
            elevation={2}
            sx={{
              borderRadius: 3,
              position: "sticky",
              top: "80px",
              maxHeight: "500px",
              overflow: "auto",
            }}
          >
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Información del Documento
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Box sx={{ maxHeight: "400px", overflowY: "auto" }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Total de Páginas:
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {pdfData.total_pages}
                </Typography>

                <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mt: 2 }}>
                  Resumen del Documento:
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {pdfData.explanation}
                </Typography>

                <Typography variant="body2" color="text.secondary" sx={{ mt: 2, mb: 1 }}>
                  Consejos:
                </Typography>
                <Typography variant="body2" component="ul" sx={{ pl: 2 }}>
                  <li>Haz preguntas específicas sobre el contenido</li>
                  <li>Solicita resúmenes de secciones específicas</li>
                  <li>Pide explicaciones de términos complejos</li>
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  )
}

