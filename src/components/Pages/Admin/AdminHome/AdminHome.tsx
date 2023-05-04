import React from 'react';
import { NextRouter } from 'next/router';
import Grid from '@mui/material/Unstable_Grid2';
import List from '@mui/material/List';
import ListSubheader from '@mui/material/ListSubheader';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import type { AdminMenuType } from '~/server/routers/admin/getMenus';

interface Props {
  router: NextRouter;
  menus: AdminMenuType[];
}

export default function AdminHome(props: Props) {
  const { router, menus } = props;
  return (
    <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
      {menus.map((menu) => (
        <Grid xs={12} md={6} lg={4} key={menu.category}>
          <List
            sx={{ width: '100%', bgcolor: 'background.paper' }}
            component="nav"
            aria-labelledby={menu.category}
            subheader={
              <ListSubheader
                id={menu.category}
                sx={{
                  fontSize: 25,
                  fontWeight: 'bold',
                }}
                className={'border-b-8 border-blue-200 '}
              >
                {menu.category}
              </ListSubheader>
            }
          >
            {menu.subMenus.map((submenu) => (
              <React.Fragment key={submenu.urlPath}>
                <ListItemButton onClick={() => router.push(submenu.urlPath)}>
                  <ListItemText primary={submenu.label} />
                </ListItemButton>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        </Grid>
      ))}
    </Grid>
  );
}
