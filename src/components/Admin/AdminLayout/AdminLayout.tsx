import * as React from 'react';
import { useEffect } from 'react';
import { CSSObject, styled, Theme, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

import { Logo } from '~/components/Layout/Logo';
import { Tooltip } from '@mui/material';
import { UrlPaths } from '~/constants/UrlPaths';
import AdminBreadCrumb from '~/components/Admin/AdminLayout/AdminBreadCrumb';
import { NextRouter } from 'next/router';
import LogoutIcon from '@mui/icons-material/Logout';
import { User } from '@prisma/client';
import Avatar from '@mui/material/Avatar';
import Header from '../../Header/Header';

const drawerWidth = 180;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: 0,
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  backgroundColor: '#2562ea',
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
  minHeight: '90px',
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  ...(open && {
    ...openedMixin(theme),
    '& .MuiDrawer-paper': openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    '& .MuiDrawer-paper': closedMixin(theme),
  }),
}));

const MENU_OPTIONS = [
  {
    id: 'challenge',
    label: 'Challenge',
    path: UrlPaths.Challenge,
    icon: <TrendingUpIcon />,
  },
  {
    id: 'logout',
    label: 'Logout',
    path: UrlPaths.Logout,
    icon: <LogoutIcon />,
  },
];

interface AdminLayoutProps {
  router: NextRouter;
  onMenuItemClick: (path: string) => void;
  children?: JSX.Element | React.ReactNode;
  user?: User;
}

export default function AdminLayout(props: AdminLayoutProps) {
  const { router, onMenuItemClick, user } = props;
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [router.pathname]);

  React.useEffect(() => {
    const resizeOps = () => {
      document.documentElement.style.setProperty(
        '--vh',
        window.innerHeight * 0.01 + 'px',
      );
    };
    resizeOps();
    window.addEventListener('resize', resizeOps);
    document.getElementById('main')?.scrollIntoView();
  }, []);

  return (
    <>
      <Header>
        <meta
          name="viewport"
          content="width=1450, height=1600, initial-scale=1"
        />
      </Header>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar position="fixed" open={open}>
          <Toolbar
            sx={{
              height: '90px',
              backgroundColor: '#2562ea',
            }}
          >
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={{
                marginRight: 2,
                ...(open && { display: 'none' }),
              }}
            >
              <MenuIcon />
            </IconButton>
            {!open && <Logo key="admin-top" isLoggedIn={true} />}
            <span className={'flex-grow'} />

            <Tooltip title={user?.username?.toUpperCase()}>
              <IconButton
                onClick={handleClick}
                size="small"
                sx={{ ml: 2 }}
                aria-controls={menuOpen ? 'account-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={menuOpen ? 'true' : undefined}
              >
                <Avatar sx={{ width: 50, height: 50 }}>
                  {user?.username?.charAt(0).toUpperCase()}
                </Avatar>
              </IconButton>
            </Tooltip>
          </Toolbar>
          <AdminBreadCrumb />
        </AppBar>
        <Drawer variant="permanent" open={open}>
          <DrawerHeader>
            <span />
            <Logo key="top" isLoggedIn={true} />
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === 'rtl' ? (
                <ChevronRightIcon sx={{ color: 'white' }} />
              ) : (
                <ChevronLeftIcon sx={{ color: 'white' }} />
              )}
            </IconButton>
          </DrawerHeader>
          <Divider />
          <List>
            {MENU_OPTIONS.map((option) => (
              <ListItem
                key={option.id}
                disablePadding
                sx={{ display: 'block' }}
              >
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? 'initial' : 'center',
                    px: 2.5,
                  }}
                  onClick={() => onMenuItemClick(option.path)}
                  selected={option.path.toString() === router?.pathname}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : 'auto',
                      justifyContent: 'center',
                    }}
                  >
                    {option.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={option.label}
                    sx={{ opacity: open ? 1 : 0 }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider />
        </Drawer>
        <Box
          component="main"
          sx={{ flexGrow: 1, overflow: 'hidden' }}
          id={'main'}
        >
          <DrawerHeader />
          <div
            className={
              'mt-14 p-5 min-h-screen w-full overflow-y-hidden overflow-x-auto block'
            }
          >
            {props.children}
          </div>
        </Box>
      </Box>
    </>
  );
}
