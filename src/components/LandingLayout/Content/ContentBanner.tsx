import React, { useState } from 'react';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import { Banner } from '@prisma/client';
import { Grid, IconButton } from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

interface Props {
  banners: Banner[];
}

const ContentBanner = (props: Props) => {
  const [selectedItem, setSelectedItem] = useState(0);

  return (
    <Grid
      container
      direction={'row'}
      justifyContent={'space-between'}
      alignItems="center"
      className="rounded-xl bg-[#FFFFFF] p-1"
      spacing={1}
    >
      <Grid item xs={2}>
        <img
          className="object-cover w-14 h-7 md:w-auto md:h-auto"
          src={'/assets/images/banknote.svg'}
          alt="BankNote"
        />
      </Grid>
      <Grid item xs={8} md={8}>
        <Carousel
          showArrows={false}
          showIndicators={false}
          showStatus={false}
          showThumbs={false}
          selectedItem={selectedItem}
          autoPlay
          infiniteLoop
        >
          {props.banners.map((banner) => (
            <div
              key={banner.id}
              className={'flex justify-center items-center h-full w-full'}
            >
              <p className="text-[#348BFF] text-[22px] font-bold tracking-normal leading-[28px] text-center">
                {banner.text}
              </p>
            </div>
          ))}
        </Carousel>
      </Grid>

      <Grid item xs={2} container justifyContent={'flex-end'}>
        <IconButton
          aria-label="Next"
          size="large"
          onClick={() => setSelectedItem(selectedItem ? 0 : 1)}
        >
          <ArrowForwardIosIcon fontSize="inherit" color="primary" />
        </IconButton>
      </Grid>
    </Grid>
  );
};

export default ContentBanner;
