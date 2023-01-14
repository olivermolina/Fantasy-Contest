import * as React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import WhereToVoteOutlinedIcon from '@mui/icons-material/WhereToVoteOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { Button, Divider } from '@mui/material';

interface Props {
  handleClose: () => void;
  handleEnableLocation: () => void;
}

export default function EnableLocation(props: Props) {
  return (
    <Card
      className={'flex h-full w-full'}
      sx={{
        '&.MuiCard-root': {
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        },
      }}
    >
      <div className={'overflow-y-auto'}>
        <CardHeader
          sx={(theme) => ({
            color: '#fff',
            backgroundColor: theme.palette.primary.main,
          })}
          avatar={
            <Avatar sx={{ bgcolor: '#fff', width: 50, height: 50 }}>
              <WhereToVoteOutlinedIcon sx={{ color: 'black' }} />
            </Avatar>
          }
          action={
            <IconButton aria-label="settings" onClick={props.handleClose}>
              <CloseOutlinedIcon sx={{ color: '#fff', fontSize: 40 }} />
            </IconButton>
          }
          title={
            <Typography className={'text-white'} variant={'h5'}>
              Ooops...
            </Typography>
          }
          subheader={
            <Typography
              className={'text-white opacity-60'}
              variant={'subtitle2'}
            >
              We need your location
            </Typography>
          }
        />
        <CardContent>
          <h2 className="font-bold text-xl md:text-4xl pb-1 md:pb-2">
            Location required
          </h2>
          <p className="text-md md:text-lg">
            We are legally required to confirm in which state you are located
            before you can enter any paid contests or make a deposit &
            withdrawal
          </p>

          <h5 className="font-bold text-lg md:text-2xl pt-2">Safari</h5>
          <p className="text-sm md:text-md">
            &bull; Click <b>aA</b> in the top/bottom left of your safari browser
            <br />
            &bull; Click <b>Website Settings </b>
            <br />
            &bull; Click <b>Location</b> and select <b>Allow</b>.
            <br />
            &bull; If the above doesn&lsquo;t work, go to your phones{' '}
            <b>Settings </b>
            &gt; <b>Privacy</b>.
            <br />
            &bull; Make sure <b> Location Services</b> is on.
            <br />
            &bull; Scroll down to <b>Safari</b> &gt; &#8220;
            <b>Ask Next Time or When I Share</b>&#8221; or &#8220;
            <b>While using App</b>&#8221;.
          </p>

          <Divider sx={{ my: 1 }} />
          <h5 className="font-bold text-lg md:text-2xl">Chrome</h5>
          <p className="text-sm md:text-md">
            &bull; <b>Enable Location</b> below <br />
            &bull; Click <b>Allow</b> on the top left pop up.
          </p>
        </CardContent>
      </div>
      <div>
        <CardActions disableSpacing>
          <Button
            variant={'contained'}
            fullWidth
            sx={(theme) => ({
              textTransform: 'none',
              fontSize: '1.125rem',
              lineHeight: '1.75rem',
              backgroundColor: theme.palette.primary.main,
            })}
            size="large"
            onClick={props.handleEnableLocation}
          >
            Enable Location
          </Button>
        </CardActions>
      </div>
    </Card>
  );
}
