export const userPermissionsFormMockProps = {
  userId: 'userId1',
  userPermissions: [
    {
      category: 'Management',
      modulePermissions: [
        {
          moduleId: '1',
          label: 'Insert bonus credit',
          checked: true,
        },
        {
          moduleId: '2',
          label: 'Manually enter offer and lines',
          checked: true,
        },
        {
          moduleId: '3',
          label: 'Balance by User ID',
          checked: false,
        },
        {
          moduleId: '4',
          label: 'Update User Limits',
          checked: false,
        },
        {
          moduleId: '5',
          label: 'Withdrawal Offer',
          checked: true,
        },
      ],
    },
    {
      category: 'Figures',
      modulePermissions: [
        {
          moduleId: 'fig1',
          label: 'Weekly Balance',
          checked: true,
        },
        {
          moduleId: 'fig2',
          label: 'Line Exposure',
          checked: true,
        },
        {
          moduleId: 'fig3',
          label: 'Player Totals By Range',
          checked: false,
        },
      ],
    },
    {
      category: 'Action',
      modulePermissions: [
        {
          moduleId: 'act1',
          label: 'Delete picks',
          checked: true,
        },
      ],
    },
  ],
  onSubmit: (data: any) => console.log(data),
  handleClose: () => console.log('handleClose'),
};
