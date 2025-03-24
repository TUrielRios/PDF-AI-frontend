import { Box, Container, Typography, Link, IconButton, Divider } from "@mui/material"
import GitHubIcon from "@mui/icons-material/GitHub"
import LinkedInIcon from "@mui/icons-material/LinkedIn"
import TwitterIcon from "@mui/icons-material/Twitter"
import styles from "./footer.module.css"

export default function Footer() {
  return (
    <Box component="footer" className={styles.footer}>
      <Divider />
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box sx={{ mb: { xs: 2, md: 0 } }}>
            <Typography variant="body2" color="text.secondary">
              © {new Date().getFullYear()} Asistente PDF IA. Todos los derechos reservados.
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Desarrollado con Flask y React
            </Typography>
          </Box>

          <Box sx={{ display: "flex", gap: 1 }}>
            <IconButton color="primary" aria-label="GitHub" className={styles.socialIcon}>
              <GitHubIcon />
            </IconButton>
            <IconButton color="primary" aria-label="LinkedIn" className={styles.socialIcon}>
              <LinkedInIcon />
            </IconButton>
            <IconButton color="primary" aria-label="Twitter" className={styles.socialIcon}>
              <TwitterIcon />
            </IconButton>
          </Box>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "center", mt: 2, gap: 3 }}>
          <Link href="#" color="text.secondary" underline="hover">
            Política de Privacidad
          </Link>
          <Link href="#" color="text.secondary" underline="hover">
            Términos de Servicio
          </Link>
          <Link href="#" color="text.secondary" underline="hover">
            Contáctanos
          </Link>
        </Box>
      </Container>
    </Box>
  )
}

