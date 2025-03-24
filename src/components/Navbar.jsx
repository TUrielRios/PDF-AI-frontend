"use client"

import { useState } from "react"
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  useMediaQuery,
  Avatar,
} from "@mui/material"
import { useTheme } from "@mui/material/styles"
import MenuIcon from "@mui/icons-material/Menu"
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf"
import styles from "./navbar.module.css"

export default function Navbar({ currentView, onViewChange }) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))
  const [drawerOpen, setDrawerOpen] = useState(false)

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen)
  }

  // Traducir los elementos de navegación al español y eliminar la pestaña de Chat
  const navItems = [
    { name: "Inicio", view: "inicio" },
    { name: "Resultados", view: "resultados" },
  ]

  const handleNavClick = (view) => {
    onViewChange(view)
    if (isMobile) {
      setDrawerOpen(false)
    }
  }

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", p: 2 }}>
        <Avatar sx={{ bgcolor: "primary.main", mr: 1 }}>
          <PictureAsPdfIcon />
        </Avatar>
        {/* Traducir el título de la aplicación */}
        <Typography variant="h6" component="div" sx={{ fontWeight: 700 }}>
          Asistente PDF IA
        </Typography>
      </Box>
      <List>
        {navItems.map((item) => (
          <ListItem key={item.name} disablePadding>
            <ListItemButton
              sx={{
                textAlign: "center",
                bgcolor: currentView === item.view ? "primary.light" : "transparent",
                color: currentView === item.view ? "white" : "inherit",
                "&:hover": {
                  bgcolor: currentView === item.view ? "primary.main" : "rgba(0, 0, 0, 0.04)",
                },
              }}
              onClick={() => handleNavClick(item.view)}
            >
              <ListItemText primary={item.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  )

  return (
    <>
      <AppBar position="sticky" color="default" elevation={1} className={styles.navbar}>
        <Toolbar>
          <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
            <Avatar sx={{ bgcolor: "primary.main", mr: 1 }}>
              <PictureAsPdfIcon />
            </Avatar>
            {/* Traducir el título de la aplicación */}
            <Typography
              variant="h6"
              component="div"
              sx={{ fontWeight: 700, fontFamily: '"Plus Jakarta Sans", sans-serif' }}
            >
              Asistente PDF IA
            </Typography>
          </Box>

          {isMobile ? (
            <IconButton color="inherit" aria-label="open drawer" edge="end" onClick={handleDrawerToggle}>
              <MenuIcon />
            </IconButton>
          ) : (
            <Box sx={{ display: "flex", gap: 2 }}>
              {navItems.map((item) => (
                <Button
                  key={item.name}
                  color={currentView === item.view ? "primary" : "inherit"}
                  variant={currentView === item.view ? "contained" : "text"}
                  onClick={() => handleNavClick(item.view)}
                  className={styles.navButton}
                  sx={{ fontWeight: 600 }}
                >
                  {item.name}
                </Button>
              ))}
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile
        }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: 240 },
        }}
      >
        {drawer}
      </Drawer>
    </>
  )
}

