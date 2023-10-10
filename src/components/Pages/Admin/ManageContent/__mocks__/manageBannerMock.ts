export const manageBannerMock = {
  banners: [],
  openBannersForm: jest.fn(),
  contentSettings: {
    initial: false,
    CHALLENGE_PROMO_MESSAGE:
      'Pick 2-4 players. Predict if they will get MORE or LESS than their projection.',
    REFERRAL_CUSTOM_TEXT:
      'Refer a friend from the link or code in your profile and get $25 in bonus credit!!',
    HOMEPAGE_HEADING_1: 'Heading 1',
    HOMEPAGE_HEADING_2: 'Heading 2',
  },
  onSubmit: () => console.log('onSubmit'),
};
