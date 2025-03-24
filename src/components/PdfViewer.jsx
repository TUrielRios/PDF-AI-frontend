import { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Box, Typography, CircularProgress, Button, Paper } from "@mui/material";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";

// Configurar el worker de PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

export default function PdfViewer({ pdfData, currentPage, onPageChange }) {
  const [numPages, setNumPages] = useState(null);
  const [loading, setLoading] = useState(true);
  const [scale, setScale] = useState(1.2);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (pdfData && pdfData.file_url) {
      setLoading(true);
      setError(null);
    }
  }, [pdfData]);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setLoading(false);
  };

  const onDocumentLoadError = (error) => {
    console.error("Error cargando el documento:", error);
    setError("Error al cargar el documento PDF.");
    setLoading(false);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      onPageChange(null, currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < numPages) {
      onPageChange(null, currentPage + 1);
    }
  };

  const handleZoomIn = () => {
    setScale((prevScale) => Math.min(prevScale + 0.2, 2.5));
  };

  const handleZoomOut = () => {
    setScale((prevScale) => Math.max(prevScale - 0.2, 0.8));
  };

  if (error) {
    return (
      <Paper
        elevation={1}
        sx={{
          p: 3,
          borderRadius: 2,
          height: "400px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          bgcolor: "rgba(244, 67, 54, 0.05)",
          border: "1px solid",
          borderColor: "rgba(244, 67, 54, 0.2)",
        }}
      >
        <Typography variant="body1" color="error" gutterBottom>
          {error}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Mostrando el texto extraído como alternativa:
        </Typography>
        <Box
          sx={{
            mt: 2,
            p: 2,
            bgcolor: "background.paper",
            borderRadius: 1,
            width: "100%",
            height: "300px",
            overflow: "auto",
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <pre
            style={{
              margin: 0,
              fontFamily: '"Roboto Mono", monospace',
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              textAlign: "left",
              fontSize: "0.9rem",
              lineHeight: 1.6,
            }}
          >
            {pdfData.pages[currentPage]}
          </pre>
        </Box>
      </Paper>
    );
  }

  return (
    <Paper
      elevation={1}
      sx={{
        p: 2,
        borderRadius: 2,
        height: "500px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 1,
          pb: 1,
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="outlined"
            size="small"
            onClick={handlePrevPage}
            disabled={currentPage <= 1 || loading}
            startIcon={<NavigateBeforeIcon />}
          >
            Anterior
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={handleNextPage}
            disabled={currentPage >= numPages || loading}
            endIcon={<NavigateNextIcon />}
          >
            Siguiente
          </Button>
        </Box>
        <Typography variant="body2">
          Página {currentPage} de {numPages || "?"}
        </Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="outlined"
            size="small"
            onClick={handleZoomOut}
            disabled={loading}
            startIcon={<ZoomOutIcon />}
          >
            -
          </Button>
          <Button variant="outlined" size="small" onClick={handleZoomIn} disabled={loading} startIcon={<ZoomInIcon />}>
            +
          </Button>
        </Box>
      </Box>

      <Box
        sx={{
          flexGrow: 1,
          overflow: "auto",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          bgcolor: "#f5f5f5",
          borderRadius: 1,
        }}
      >
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
            <CircularProgress />
          </Box>
        ) : pdfData.file_url ? (
          <Document
            file={pdfData.file_url}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            loading={<CircularProgress />}
          >
            <Page pageNumber={currentPage} scale={scale} renderTextLayer={false} renderAnnotationLayer={false} />
          </Document>
        ) : (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
            <Typography variant="body1" color="text.secondary">
              No se pudo cargar el PDF. Mostrando texto extraído:
            </Typography>
          </Box>
        )}
      </Box>
    </Paper>
  );
}