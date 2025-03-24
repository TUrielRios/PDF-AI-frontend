"use client"

import { useEffect, useRef } from "react"
import { Worker } from "@react-pdf-viewer/core"
import { Viewer } from "@react-pdf-viewer/core"
import { pageNavigationPlugin } from "@react-pdf-viewer/page-navigation"
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout"

// Importar estilos
import "@react-pdf-viewer/core/lib/styles/index.css"
import "@react-pdf-viewer/default-layout/lib/styles/index.css"
import "@react-pdf-viewer/page-navigation/lib/styles/index.css"

const PDFViewer = ({ pdfData, currentPage = 1 }) => {
  // Referencia para almacenar la instancia del plugin de navegación
  const pageNavigationPluginInstance = pageNavigationPlugin()
  const { jumpToPage } = pageNavigationPluginInstance

  // Plugin para controles de zoom y diseño
  const defaultLayoutPluginInstance = defaultLayoutPlugin({
    sidebarTabs: (defaultTabs) => [], // Ocultar sidebar por defecto
  })

  // Referencia al contenedor del visor
  const containerRef = useRef(null)

  // Efecto para cambiar la página cuando cambia currentPage
  useEffect(() => {
    // Asegurarse de que jumpToPage esté disponible
    if (jumpToPage) {
      try {
        // La API usa base 0, por lo que restamos 1
        jumpToPage(currentPage - 1)
        console.log(`Saltando a la página ${currentPage}`)
      } catch (error) {
        console.error("Error al cambiar de página:", error)
      }
    }
  }, [currentPage, jumpToPage])

  return (
    <div style={{ height: "100%", width: "100%" }} ref={containerRef}>
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
        {pdfData ? (
          <Viewer
            fileUrl={pdfData}
            plugins={[pageNavigationPluginInstance, defaultLayoutPluginInstance]}
            initialPage={currentPage - 1}
          />
        ) : (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              color: "#f44336",
              backgroundColor: "rgba(244, 67, 54, 0.05)",
              border: "1px solid rgba(244, 67, 54, 0.2)",
              borderRadius: "8px",
              padding: "16px",
            }}
          >
            No se pudo cargar el PDF. URL no disponible.
          </div>
        )}
      </Worker>
    </div>
  )
}

export default PDFViewer

