import { Fab, Zoom, Badge } from "@mui/material"
import ChatIcon from "@mui/icons-material/Chat"

export default function ChatButton({ onClick, unreadCount = 0 }) {
  return (
    <Zoom in={true}>
      <Fab
        color="primary"
        aria-label="chat"
        onClick={onClick}
        sx={{
          position: "fixed",
          bottom: 16,
          right: 16,
          zIndex: 1200,
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
        }}
      >
        <Badge badgeContent={unreadCount > 0 ? unreadCount : null} color="error">
          <ChatIcon />
        </Badge>
      </Fab>
    </Zoom>
  )
}

