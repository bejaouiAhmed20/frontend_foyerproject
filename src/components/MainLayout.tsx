import { useState } from 'react'
import type { ReactNode } from 'react'
import {
  AppBar,
  Box,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import DashboardIcon from '@mui/icons-material/Dashboard'
import SchoolIcon from '@mui/icons-material/School'
import ApartmentIcon from '@mui/icons-material/Apartment'
import DomainIcon from '@mui/icons-material/Domain'
import KingBedIcon from '@mui/icons-material/KingBed'
import PersonIcon from '@mui/icons-material/Person'
import EventIcon from '@mui/icons-material/Event'
import LogoutIcon from '@mui/icons-material/Logout'

const drawerWidth = 280

interface NavItem {
  key: string
  label: string
}

interface MainLayoutProps {
  children: ReactNode
  tabs: readonly NavItem[]
  activeTab: string
  onSelect: (key: string) => void
  userEmail: string | null
  onLogout: () => void
}

const getIcon = (key: string) => {
  switch (key) {
    case 'dashboard':
      return <DashboardIcon />
    case 'universite':
      return <SchoolIcon />
    case 'foyer':
      return <DomainIcon />
    case 'bloc':
      return <ApartmentIcon />
    case 'chambre':
      return <KingBedIcon />
    case 'etudiant':
      return <PersonIcon />
    case 'reservation':
      return <EventIcon />
    default:
      return <DashboardIcon />
  }
}

export default function MainLayout({ children, tabs, activeTab, onSelect, userEmail, onLogout }: MainLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const drawer = (
    <div className="h-full flex flex-col bg-white">
      <Toolbar className="flex items-center justify-center border-b border-slate-100">
        <Typography variant="h6" className="font-heading font-bold text-slate-800 tracking-tight">
          Foyer Manager
        </Typography>
      </Toolbar>
      <Box sx={{ overflow: 'auto', flexGrow: 1, py: 2 }}>
        <List>
          {tabs.map((tab) => (
            <ListItem key={tab.key} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                selected={activeTab === tab.key}
                onClick={() => {
                  onSelect(tab.key)
                  setMobileOpen(false)
                }}
                sx={{
                  mx: 2,
                  borderRadius: 2,
                  '&.Mui-selected': {
                    bgcolor: 'primary.50',
                    color: 'primary.700',
                    '& .MuiListItemIcon-root': {
                      color: 'primary.700',
                    },
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40, color: activeTab === tab.key ? 'primary.700' : 'slate.500' }}>
                  {getIcon(tab.key)}
                </ListItemIcon>
                <ListItemText
                  primary={tab.label}
                  primaryTypographyProps={{ fontSize: 14, fontWeight: activeTab === tab.key ? 600 : 500 }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
      <Divider />
      <Box sx={{ p: 2 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, px: 2, fontSize: 13 }}>
          {userEmail}
        </Typography>
        <List disablePadding>
          <ListItem disablePadding>
            <ListItemButton onClick={onLogout} sx={{ mx: 2, borderRadius: 2, color: 'error.main' }}>
              <ListItemIcon sx={{ minWidth: 40, color: 'error.main' }}>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Déconnexion" primaryTypographyProps={{ fontSize: 14, fontWeight: 500 }} />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </div>
  )

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          bgcolor: 'white',
          borderBottom: '1px solid',
          borderColor: 'slate.200',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' }, color: 'slate.700' }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ color: 'slate.800', flexGrow: 1, fontWeight: 600 }}>
            {tabs.find((t) => t.key === activeTab)?.label ?? 'Dashboard'}
          </Typography>
        </Toolbar>
      </AppBar>
      <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, borderRight: '1px solid', borderColor: 'slate.100' },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: 8, // toolbar space
        }}
      >
        {children}
      </Box>
    </Box>
  )
}
