import React, { ReactNode } from 'react';
import { AvatarCircle } from '../AvatarCircle';
import { TabPanel } from '../TabPanel';
import Entries from './Entries';
import { EntriesProps } from './Entries/Entries';
import Overview from './Overview';
import { OverviewProps } from './Overview/Overview';
import Prizes from './Prizes';
import { PrizesProps } from './Prizes/Prizes';
import Rules from './Rules';
import { RulesProps } from './Rules/Rules';
import {
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import classNames from 'classnames';
import BackdropLoading from '~/components/BackdropLoading';

export type ContestDetailModalProps = {
  imgUrl: string;
  name: ReactNode | string;
  onClickJoinCompetition: ((...args: any[]) => any) | undefined;
  isModalOpen: boolean;
  overview: OverviewProps;
  entries: EntriesProps['entries'];
  prizes: PrizesProps['prizes'];
  rules: RulesProps;
  handleClose: () => void;
  isLoading: boolean;
};

const ContestDetailModal = (props: ContestDetailModalProps) => {
  return (
    <Dialog open={props.isModalOpen} fullWidth maxWidth={'md'}>
      <BackdropLoading open={props.isLoading} />
      <div className="flex items-start gap-2 p-5 border-b border-solid border-gray-300 rounded-t bg-blue-800 ">
        <div>
          <AvatarCircle imgSrc={props.imgUrl} height={50} width={50} />
        </div>
        <div className="text-white">
          <h2>{props.name}</h2>
          <span>Official Tournaments</span>
        </div>

        <IconButton
          aria-label="close"
          onClick={props.handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: 'white',
          }}
        >
          <CloseIcon />
        </IconButton>
      </div>
      <DialogContent>
        <div>
          <TabPanel
            tabs={[
              {
                tabId: 1,
                title: 'Overview',
              },
              {
                tabId: 2,
                title: 'Entries',
              },
              {
                tabId: 3,
                title: 'Prizes',
              },
              {
                tabId: 4,
                title: 'Rules',
              },
            ]}
            tabsContent={[
              {
                tabId: 1,
                content: <Overview {...props.overview} />,
              },
              {
                tabId: 2,
                content: <Entries entries={props.entries} />,
              },
              {
                tabId: 3,
                content: <Prizes prizes={props.prizes} />,
              },
              {
                tabId: 4,
                content: <Rules {...props.rules} />,
              },
            ]}
          />
        </div>
      </DialogContent>
      <Divider />
      <DialogActions sx={{ justifyContent: 'center', p: 4 }}>
        <button
          className={classNames(
            'p-4 capitalize text-white rounded-lg font-bold text-2xl bg-blue-600 w-fit',
            {
              'opacity-10': props.isLoading,
            },
          )}
          type="submit"
          onClick={props.onClickJoinCompetition}
          disabled={props.isLoading}
        >
          Join Competition
          {props.isLoading && <CircularProgress sx={{ ml: 1 }} size={20} />}
        </button>
      </DialogActions>
    </Dialog>
  );
};

export default ContestDetailModal;
