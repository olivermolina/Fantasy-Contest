import classNames from 'classnames';

export const PaymentMethodFormsStyles = {
  billingInputs: (errorTextMessage: string | undefined) =>
    classNames(
      'rounded-md peer pl-1 pr-2 py-2 bg-[#1A487F] text-white focus:outline-white',
      {
        'border-red-500 outline-red-500 outline-1': errorTextMessage,
        'border-[#1A487F] outline-inherit': !!errorTextMessage,
      },
    ),
  cardInputs: (errorTextMessage: string | undefined) =>
    classNames('rounded-md peer pl-12 pr-2 py-2 border-2 bg-[#1A487F]', {
      'border-red-500 outline-red-500': errorTextMessage,
      'border-gray-200 outline-blue-500': !!errorTextMessage,
    }),
  achInputs: (errorTextMessage: string | undefined) =>
    classNames(
      'rounded-md peer pl-2 pr-2 py-2 border-2 bg-[#1A487F] focus:outline-white',
      {
        'border-red-500 outline-red-500': errorTextMessage,
        'border-gray-200 outline-blue-500': !!errorTextMessage,
      },
    ),
  icons:
    'object-fit absolute bottom-0 left-0 -mb-0.5 transform translate-x-1/2 text-white peer-placeholder-shown:text-gray-300 h-6 w-6',
  nonFullWidthElements: 'relative flex-1 flex flex-col',
  flexElements: 'relative w-full flex flex-col',
};
