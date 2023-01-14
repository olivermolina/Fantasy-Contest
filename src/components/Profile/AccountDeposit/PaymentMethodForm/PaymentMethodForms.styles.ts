import classNames from 'classnames';

export const PaymentMethodFormsStyles = {
  billingInputs: (errorTextMessage: string | undefined) =>
    classNames(
      'rounded-md peer pl-1 pr-2 py-2 border-2 border-gray-200 placeholder-gray-300',
      {
        'border-red-500 outline-red-500': errorTextMessage,
        'border-gray-200 focus:outline-blue-500': !!errorTextMessage,
      },
    ),
  cardInputs: (errorTextMessage: string | undefined) =>
    classNames(
      'rounded-md peer pl-12 pr-2 py-2 border-2 placeholder-gray-300',
      {
        'border-red-500 outline-red-500': errorTextMessage,
        'border-gray-200 outline-blue-500': !!errorTextMessage,
      },
    ),
  achInputs: (errorTextMessage: string | undefined) =>
    classNames('rounded-md peer pl-2 pr-2 py-2 border-2 placeholder-gray-300', {
      'border-red-500 outline-red-500': errorTextMessage,
      'border-gray-200 outline-blue-500': !!errorTextMessage,
    }),
  icons:
    'object-fit absolute bottom-0 left-0 -mb-0.5 transform translate-x-1/2 text-black peer-placeholder-shown:text-gray-300 h-6 w-6',
  nonFullWidthElements: 'relative flex-1 flex flex-col',
  flexElements: 'relative w-full flex flex-col',
};
