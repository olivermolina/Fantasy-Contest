import { ReactElement, SVGProps } from 'react';
import Camera from '~/assets/icons/camera.svg';
import User from '~/assets/icons/user.svg';
import CurrencyDollar from '~/assets/icons/currency-dollar.svg';
import Pencil from '~/assets/icons/pencil.svg';
import PencilSquare from '~/assets/icons/pencil-square.svg';
import Settings from '~/assets/icons/settings.svg';
import UserCheck from '~/assets/icons/user-check.svg';
import UserAdd from '~/assets/icons/user-add.svg';
import ChevronLeft from '~/assets/icons/chevron-left.svg';
import ChevronRight from '~/assets/icons/chevron-right.svg';
import ClipboardDocument from '~/assets/icons/clipboard-document.svg';
import WithdrawFunds from '~/assets/icons/withdraw-funds.svg';
import Paypal from '~/assets/icons/paypal.svg';
import Bank from '~/assets/icons/bank.svg';
import Logout from '~/assets/icons/logout.svg';
import WrenchScrewdriver from '~/assets/icons/wrench-screwdriver.svg';
import MoneyFromBracket from '~/assets/icons/ico_money-from-bracket.svg';
import MoneyBillTransfer from '~/assets/icons/ico_money-bill-transfer.svg';
import RectangleHistory from '~/assets/icons/ico_rectangle-history-circle-plus.svg';
import FileContract from '~/assets/icons/ico_file-contract.svg';
import Portal from '~/assets/icons/settings-svgrepo-com.svg';

const importedIcons = {
  Camera,
  User,
  CurrencyDollar,
  Pencil,
  PencilSquare,
  Settings,
  UserCheck,
  UserAdd,
  ChevronLeft,
  ChevronRight,
  ClipboardDocument,
  WithdrawFunds,
  Paypal,
  Bank,
  Logout,
  WrenchScrewdriver,
  MoneyFromBracket,
  MoneyBillTransfer,
  RectangleHistory,
  FileContract,
  Portal,
};

type IconName = keyof typeof importedIcons;
export type ReactComponent = (props: SVGProps<SVGElement>) => ReactElement;
export default importedIcons as Record<IconName, ReactComponent>;
