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
  IconButton,
  Slide,
  Link,
  Tooltip,
} from "@mui/material"
import SendIcon from "@mui/icons-material/Send"
import SmartToyIcon from "@mui/icons-material/SmartToy"
import PersonIcon from "@mui/icons-material/Person"
import CloseIcon from "@mui/icons-material/Close"
import MinimizeIcon from "@mui/icons-material/Minimize"
import FullscreenIcon from "@mui/icons-material/Fullscreen"
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit"
import ReactMarkdown from "react-markdown"

export default function ChatBox({ pdfData, messages, setMessages, open, onClose }) {
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [streamingMessageId, setStreamingMessageId] = useState(null)
  const [expanded, setExpanded] = useState(false)
  const messagesEndRef = useRef(null)

  // Auto scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, open])

  const handleInputChange = (e) => {
    setInput(e.target.value)
  }

  const toggleExpand = () => {
    setExpanded(!expanded)
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
      // Obtener el texto completo de todas las páginas del PDF
      let fullPdfText = ""
      for (let pageNum = 1; pageNum <= pdfData.total_pages; pageNum++) {
          if (pdfData.pages[pageNum]) {
              fullPdfText += pdfData.pages[pageNum] + "\n\n"  // Agregar un salto de línea entre páginas
          }
      }

      // Crear un ID para el mensaje de respuesta
      const responseMessageId = messages.length + 2

      // Agregar un mensaje vacío que se irá actualizando con el streaming
      setMessages((prev) => [
        ...prev,
        {
          id: responseMessageId,
          role: "assistant",
          content: "",
        },
      ])

      // Establecer el ID del mensaje que está en streaming
      setStreamingMessageId(responseMessageId)

      // Usar fetch con POST para enviar la solicitud
      const response = await fetch("https://pdf-ai-teal.vercel.app/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: input,
          context: fullPdfText,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get response")
      }

      // Configurar un lector para procesar la respuesta en streaming
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

            // Actualizar el mensaje con el contenido acumulado
            setMessages((prev) =>
              prev.map((msg) => (msg.id === responseMessageId ? { ...msg, content: accumulatedContent } : msg)),
            )
          }
        }
      }
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
      setStreamingMessageId(null)
    }
  }

  // Tamaños del chatbox según el estado expandido
  const chatboxWidth = expanded
    ? { xs: "calc(100% - 32px)", sm: "600px", md: "800px", lg: "1000px" }
    : { xs: "calc(100% - 32px)", sm: "400px", md: "400px", lg: "400px" }

  const chatboxHeight = expanded ? { xs: "500px", md: "600px" } : { xs: "500px", md: "500px" }

  return (
    <Slide direction="up" in={open} mountOnEnter unmountOnExit>
      <Paper
        elevation={8}
        sx={{
          position: "fixed",
          bottom: 16,
          right: 16,
          width: chatboxWidth,
          height: chatboxHeight,
          borderRadius: 3,
          overflow: "hidden",
          zIndex: 1300,
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.15)",
          transition: "width 0.3s ease, height 0.3s ease",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            p: 2,
            bgcolor: "primary.main",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <SmartToyIcon sx={{ mr: 1 }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Asistente PDF
            </Typography>
          </Box>
          <Box>
            <Tooltip title={expanded ? "Reducir tamaño" : "Expandir tamaño"}>
              <IconButton size="small" onClick={toggleExpand} sx={{ color: "white", mr: 1 }}>
                {expanded ? <FullscreenExitIcon /> : <FullscreenIcon />}
              </IconButton>
            </Tooltip>
            <IconButton size="small" onClick={onClose} sx={{ color: "white" }}>
              <MinimizeIcon />
            </IconButton>
            <IconButton size="small" onClick={onClose} sx={{ color: "white", ml: 1 }}>
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>

        {/* Messages */}
        <Box
          sx={{
            flexGrow: 1,
            overflowY: "auto",
            p: 3,
            display: "flex",
            flexDirection: "column",
            gap: 2,
            bgcolor: "#f8f9fa",
          }}
        >
          {messages.map((message) => (
            <Box
              key={message.id}
              sx={{
                display: "flex",
                flexDirection: "row",
                alignSelf: message.role === "user" ? "flex-end" : "flex-start",
                maxWidth: expanded ? { xs: "85%", sm: "75%", md: "70%" } : { xs: "85%", sm: "85%", md: "85%" },
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
                  bgcolor: message.role === "user" ? "primary.main" : "white",
                  color: message.role === "user" ? "white" : "text.primary",
                  border: message.role === "assistant" ? "1px solid" : "none",
                  borderColor: "divider",
                }}
              >
                {message.role === "user" ? (
                  <Typography variant="body1">{message.content}</Typography>
                ) : (
                  <>
                    <ReactMarkdown
                      components={{
                        p: (props) => (
                          <Typography
                            variant="body1"
                            sx={{
                              lineHeight: 1.6,
                              mb: 1.5,
                            }}
                            {...props}
                          />
                        ),
                        strong: (props) => <span style={{ fontWeight: 700 }} {...props} />,
                        ul: (props) => <Box component="ul" sx={{ pl: 2, mb: 2 }} {...props} />,
                        li: (props) => <Typography component="li" variant="body1" sx={{ mb: 0.5 }} {...props} />,
                        a: (props) => (
                          <Link href={props.href} color="primary" underline="hover" target="_blank" rel="noopener">
                            {props.children}
                          </Link>
                        ),
                      }}
                    >
                      {message.content}
                    </ReactMarkdown>
                    {streamingMessageId === message.id && (
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
                  </>
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

          {isLoading && !streamingMessageId && (
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

        {/* Input */}
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
    </Slide>
  )
}

