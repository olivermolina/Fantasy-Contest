import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import CustomDataTable from '~/components/CustomDataTable';
import { UserBalance } from '~/server/routers/admin/usersBalance';
import { showDollarPrefix } from '~/utils/showDollarPrefix';
import Link from 'next/link';

interface PropsOfferDataTable {
  isLoading: boolean;
  flatData: UserBalance[];
  totalDBRowCount: number;
  totalFetched: number;
  isFetching: boolean;
  fetchNextPage: any;
}

function UsersBalanceDataTable(props: PropsOfferDataTable) {
  const columns = React.useMemo<ColumnDef<UserBalance>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'ID',
        size: 60,
      },
      {
        accessorKey: 'username',
        cell: (info) => info.getValue(),
        header: () => <span>Username</span>,
      },
      {
        accessorKey: 'email',
        cell: (info) => info.getValue(),
        header: () => <span>Email</span>,
      },
      {
        accessorKey: 'firstname',
        cell: (info) => info.getValue(),
        header: () => <span>First Name</span>,
      },
      {
        accessorKey: 'lastname',
        cell: (info) => info.getValue(),
        header: () => <span>Last Name</span>,
      },
      {
        accessorKey: 'referral',
        cell: (info) => info.getValue(),
        header: () => <span>Referred By</span>,
      },
      {
        accessorKey: 'totalAmount',
        cell: (info) => showDollarPrefix(Number(info.getValue())),
        header: () => <span>Total Balance</span>,
      },
      {
        accessorKey: 'totalCashAmount',
        cell: (info) => showDollarPrefix(Number(info.getValue())),
        header: () => <span>Cash Balance</span>,
      },
      {
        accessorKey: 'creditAmount',
        cell: (info) => showDollarPrefix(Number(info.getValue())),
        header: () => <span>Bonus Balance</span>,
      },
      {
        accessorKey: 'withdrawableAmount',
        cell: (info) => showDollarPrefix(Number(info.getValue())),
        header: () => <span>Available To Withdraw</span>,
      },
      {
        accessorKey: 'id',
        cell: (info) => (
          <Link href={`/picks?userId=${info.getValue()}`} legacyBehavior>
            <a
              className={'underline text-blue-500'}
              target="_blank"
              rel="noopener noreferrer"
            >
              View
            </a>
          </Link>
        ),
        header: () => <span>Picks</span>,
      },
    ],
    [],
  );

  return (
    <CustomDataTable
      {...props}
      tableTitle={'Users Balance'}
      searchPlaceholder={'Search...'}
      columns={columns}
    />
  );
}

export default UsersBalanceDataTable;
