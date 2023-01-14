import * as React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { Button, Divider } from '@mui/material';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';

interface Props {
  handleClose: () => void;
  errorCode?: string | number;
  errorMessage?: string;
}

export default function CreditCardDepositDecline(props: Props) {
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
      <div>
        <CardHeader
          sx={(theme) => ({
            color: '#fff',
            backgroundColor: theme.palette.error.main,
          })}
          avatar={
            <Avatar sx={{ bgcolor: '#fff', width: 50, height: 50 }}>
              <ReportProblemIcon
                sx={(theme) => ({ color: theme.palette.error.main })}
              />
            </Avatar>
          }
          title={
            <Typography className={'text-white text-3xl'} variant={'h4'}>
              Deposit Failed
            </Typography>
          }
          subheader={
            props.errorMessage ? (
              <Typography className={'text-white text-xl opacity-90'}>
                {props.errorMessage}
              </Typography>
            ) : (
              <Typography className={'text-white text-xl opacity-90'}>
                This deposit has been declined by your card issuer. Error code:{' '}
                {props.errorCode}
              </Typography>
            )
          }
        />
        {!props.errorMessage && (
          <CardContent>
            <h2 className="font-bold text-2xl pb-2">Suggestion</h2>
            <p className="text-lg">
              Contact your card issuer for more details, or use a different
              card/payment method.
            </p>
          </CardContent>
        )}
      </div>
      <div>
        <Divider />
        <CardActions disableSpacing>
          <Button
            variant={'outlined'}
            fullWidth
            sx={() => ({
              textTransform: 'none',
              fontSize: '1.125rem',
              lineHeight: '1.75rem',
            })}
            color={'error'}
            size="large"
            onClick={props.handleClose}
          >
            Try again
          </Button>
        </CardActions>
      </div>
    </Card>
  );
}
