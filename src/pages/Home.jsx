import { useState } from "react";
import { Container, Box } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "../theme/theme";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import HomeView from "../components/HomeView";
import ResultsView from "../components/ResultsView";
import ChatView from "../components/ChatView";
import ChatBox from "../components/ChatBox";
import ChatButton from "../components/ChatButton";

export default function Home() {
  // Cambiar los nombres de las vistas a español
  const [currentView, setCurrentView] = useState("inicio")
  const [pdfData, setPdfData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [chatOpen, setChatOpen] = useState(false)

  // Estado para mantener los resúmenes entre navegaciones
  const [summaries, setSummaries] = useState({})

  // Estado para mantener los mensajes de chat entre navegaciones
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "assistant",
      content: "¡Hola! Soy tu asistente de PDF. Hazme cualquier pregunta sobre el documento que has subido.",
    },
  ])

  const handleViewChange = (view) => {
    setCurrentView(view)
  }

  const handlePdfUpload = async (file) => {
    setIsLoading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("https://pdf-ai-teal.vercel.app/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Error al procesar el PDF")
      }

      const data = await response.json()
      console.log("PDF data received:", data) // Para depuración
      if (data.file_url) {
        data.file_url = data.file_url.replace(
          "https://pdf-ai-teal.vercel.app/files/",
          "https://pdf-ai-teal.vercel.app/api/temp-pdf/"
        );
      }
      setPdfData(data)

      // Reiniciar los estados cuando se sube un nuevo PDF
      setSummaries({})
      setMessages([
        {
          id: 1,
          role: "assistant",
          content: "¡Hola! Soy tu asistente. Hazme cualquier pregunta sobre el documento que has subido.",
        },
      ])

      setCurrentView("resultados")
    } catch (err) {
      console.error("Error al subir el PDF:", err)
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const toggleChat = () => {
    setChatOpen(!chatOpen)
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          bgcolor: "background.default",
        }}
      >
        <Navbar currentView={currentView} onViewChange={handleViewChange} />

        <Container component="main" sx={{ flexGrow: 1, py: 4 }}>
          {currentView === "inicio" && <HomeView onPdfUpload={handlePdfUpload} isLoading={isLoading} error={error} />}

          {currentView === "resultados" && pdfData && (
            <ResultsView pdfData={pdfData} onChatOpen={toggleChat} summaries={summaries} setSummaries={setSummaries} />
          )}
        </Container>

        <Footer />

        {/* Chat Button y Chat Box solo se muestran cuando hay un PDF cargado */}
        {pdfData && (
          <>
            <ChatButton onClick={toggleChat} />
            <ChatBox
              pdfData={pdfData}
              messages={messages}
              setMessages={setMessages}
              open={chatOpen}
              onClose={toggleChat}
            />
          </>
        )}
      </Box>
    </ThemeProvider>
  )
}

