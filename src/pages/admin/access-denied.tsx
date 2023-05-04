import React from 'react';
import Button from '@mui/material/Button';
import { UrlPaths } from '~/constants/UrlPaths';
import LockIcon from '@mui/icons-material/Lock';
import AdminLayoutContainer from '~/containers/AdminLayoutContainer/AdminLayoutContainer';
import { useRouter } from 'next/router';

export default function AccessDeniedPage() {
  const router = useRouter();
  return (
    <AdminLayoutContainer>
      <div className={'flex flex-col gap-4 justify-center items-center py-8'}>
        <LockIcon sx={{ fontSize: 100 }} />
        <p className={'text-2xl font-bold'}>We are sorry...</p>
        <p className={'max-w-md text-center'}>
          The page you are trying to access has restricted access. Please refer
          to your master administrator.
        </p>
        <Button
          variant={'contained'}
          onClick={() => router.push(UrlPaths.Admin)}
        >
          Go Back
        </Button>
      </div>
    </AdminLayoutContainer>
  );
}
