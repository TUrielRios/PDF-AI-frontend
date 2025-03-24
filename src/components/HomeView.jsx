"use client"

import { useState, useRef } from "react"
import { Box, Typography, Button, Paper, CircularProgress, Alert, useTheme, useMediaQuery } from "@mui/material"
import CloudUploadIcon from "@mui/icons-material/CloudUpload"
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf"
import styles from "./HomeView.module.css"

export default function HomeView({ onPdfUpload, isLoading, error }) {
  const [dragActive, setDragActive] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const fileInputRef = useRef(null)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      if (file.type === "application/pdf") {
        setSelectedFile(file)
      }
    }
  }

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      if (file.type === "application/pdf") {
        setSelectedFile(file)
      }
    }
  }

  const handleUploadClick = () => {
    if (selectedFile) {
      onPdfUpload(selectedFile)
    }
  }

  const handleButtonClick = () => {
    fileInputRef.current.click()
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: isMobile ? "auto" : "70vh",
        py: 4,
      }}
    >
      <Typography
        variant="h1"
        component="h1"
        align="center"
        gutterBottom
        sx={{
          fontWeight: 800,
          mb: 3,
          background: "linear-gradient(45deg, #3a86ff 30%, #10b981 90%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          fontSize: { xs: "2rem", md: "3rem" },
          letterSpacing: "-0.02em",
        }}
      >
        Asistente PDF IA
      </Typography>

      <Typography
        variant="h5"
        component="h2"
        align="center"
        color="text.secondary"
        sx={{
          maxWidth: 600,
          mb: 6,
          px: 2,
          fontWeight: 500,
          lineHeight: 1.5,
        }}
      >
        Sube tu PDF para extraer contenido, obtener explicaciones con IA y chatear con tus documentos
      </Typography>

      <Paper
        elevation={3}
        className={`${styles.dropzone} ${dragActive ? styles.active : ""}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        sx={{
          width: { xs: "90%", sm: "80%", md: "60%" },
          maxWidth: 600,
          p: { xs: 3, md: 5 },
          mb: 4,
          borderRadius: 3,
          border: "2px dashed",
          borderColor: dragActive ? "primary.main" : "divider",
          bgcolor: dragActive ? "rgba(58, 134, 255, 0.05)" : "background.paper",
          transition: "all 0.3s ease",
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          style={{ display: "none" }}
        />

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: 200,
          }}
        >
          {isLoading ? (
            <CircularProgress size={60} />
          ) : (
            <>
              {selectedFile ? (
                <Box sx={{ textAlign: "center" }}>
                  <PictureAsPdfIcon sx={{ fontSize: 60, color: "primary.main", mb: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    {selectedFile.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </Typography>
                  <Button variant="contained" color="primary" onClick={handleUploadClick} sx={{ mt: 2 }}>
                    Procesar PDF
                  </Button>
                </Box>
              ) : (
                <>
                  <CloudUploadIcon sx={{ fontSize: 60, color: "primary.main", mb: 2 }} />
                  <Typography variant="h6" align="center" gutterBottom>
                    Arrastra y suelta tu PDF aquí
                  </Typography>
                  <Typography variant="body2" align="center" color="text.secondary" gutterBottom>
                    o
                  </Typography>
                  <Button variant="contained" color="primary" onClick={handleButtonClick} sx={{ mt: 2 }}>
                    Explorar Archivos
                  </Button>
                </>
              )}
            </>
          )}
        </Box>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ width: { xs: "90%", sm: "80%", md: "60%" }, maxWidth: 600 }}>
          {error}
        </Alert>
      )}

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 3,
          mt: 4,
          px: 2,
          maxWidth: 900,
        }}
      >
        <Feature
          icon="📄"
          title="Extraer Contenido"
          description="Extrae y visualiza el contenido de texto de tus documentos PDF"
        />
        <Feature
          icon="🤖"
          title="Explicaciones IA"
          description="Obtén explicaciones y resúmenes de tus documentos generados por IA"
        />
        <Feature
          icon="💬"
          title="Chat Interactivo"
          description="Haz preguntas sobre tu PDF y obtén respuestas instantáneas"
        />
      </Box>
    </Box>
  )
}

function Feature({ icon, title, description }) {
  return (
    <Paper
      elevation={2}
      sx={{
        p: 3,
        borderRadius: 2,
        width: { xs: "100%", sm: "45%", md: "30%" },
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: 4,
        },
      }}
    >
      <Typography variant="h2" component="div" sx={{ mb: 1, fontSize: "2rem" }}>
        {icon}
      </Typography>
      <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 600 }}>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {description}
      </Typography>
    </Paper>
  )
}

