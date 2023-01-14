import React from 'react';
import { Avatar, Backdrop, Box, CircularProgress } from '@mui/material';

interface Props {
  open: boolean;
}

const BackdropLoading = (props: Props) => {
  return (
    <Backdrop sx={{ color: '#fff', zIndex: 12000 }} open={props.open}>
      <Box position="relative" display="inline-flex">
        <CircularProgress color="inherit" size={55} disableShrink />
        <Box
          top={0}
          left={0}
          bottom={0}
          right={0}
          position="absolute"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Avatar sx={{ backgroundColor: '#fff', p: 1 }}>
            <svg
              version="1.0"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 176.000000 192.000000"
              preserveAspectRatio="xMidYMid meet"
              width={28}
              height={36}
            >
              <circle id="top" fill="#fff" />
              <g
                transform="translate(0.000000,192.000000) scale(0.100000,-0.100000)"
                fill="#2463eb"
                stroke="#2463eb"
              >
                <path d="M385 1891 c-40 -10 -66 -27 -90 -59 -18 -25 -20 -45 -23 -229 l-3 -203 60 0 61 0 0 173 c0 94 4 178 8 185 7 10 111 12 488 10 l479 -3 3 -187 2 -188 66 0 65 0 -3 204 c-3 224 -5 230 -72 280 -27 20 -39 21 -519 23 -271 1 -505 -2 -522 -6z" />
                <path d="M153 1309 c-24 -12 -52 -37 -65 -57 l-23 -37 0 -536 0 -535 25 -37 c46 -68 81 -77 289 -77 l182 0 23 53 24 52 -102 5 c-74 4 -109 10 -132 24 -73 44 -86 129 -39 245 l28 71 143 0 143 0 -15 -35 c-22 -52 -19 -56 33 -53 l47 3 28 69 c15 38 28 75 28 83 0 10 -22 13 -97 13 -79 0 -104 4 -130 20 -87 52 -89 127 -12 315 62 150 121 235 193 280 47 29 56 30 185 35 l136 5 16 35 c9 19 20 45 23 58 l7 22 -448 0 c-434 0 -449 -1 -490 -21z" />
                <path d="M1255 1275 c-14 -30 -25 -57 -25 -59 0 -3 49 -6 109 -8 105 -3 111 -4 140 -32 59 -57 63 -120 15 -241 l-26 -65 -140 0 -140 0 5 23 c3 12 9 32 12 45 7 21 4 22 -37 22 l-45 0 -29 -72 c-16 -40 -30 -76 -32 -80 -2 -5 36 -8 85 -8 119 -1 166 -21 195 -86 26 -60 22 -92 -31 -223 -60 -148 -87 -197 -139 -253 -75 -81 -105 -92 -258 -96 l-131 -4 -16 -46 c-10 -26 -17 -50 -17 -54 0 -5 184 -8 408 -8 403 0 408 0 452 23 24 12 53 35 64 50 21 28 21 41 24 563 3 597 5 578 -66 632 -34 26 -39 27 -194 30 l-158 3 -25 -56z" />
                <path d="M843 948 c-8 -13 -63 -140 -63 -146 0 -2 23 -2 51 0 l51 3 29 75 c16 41 29 76 29 78 0 9 -90 -1 -97 -10z" />
                <path d="M933 493 c-48 -110 -48 -103 1 -103 51 0 55 4 89 93 l25 67 -44 0 -45 0 -26 -57z" />
              </g>
            </svg>
          </Avatar>
        </Box>
      </Box>
    </Backdrop>
  );
};

export default BackdropLoading;
