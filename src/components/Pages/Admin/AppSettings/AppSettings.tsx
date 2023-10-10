import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { AppSettingsState } from '~/state/appSettings';
import {
  FormControlLabel,
  MenuItem,
  Switch,
  TextField,
  Tooltip,
} from '@mui/material';
import { ReloadBonusType } from '~/constants/ReloadBonusType';
import Link from 'next/link';
import { UrlPaths } from '~/constants/UrlPaths';
import Button from '@mui/material/Button';
import InfoIcon from '@mui/icons-material/Info';

const formSchema = z.object({
  maxMatchDepositAmount: z.coerce
    .number()
    .min(0, 'Maximum match deposit amount is required'),
  depositAmountOptions: z.string().min(0, 'Deposit amount options is required'),
  reloadBonusType: z.string().min(1, 'Reload bonus type is required'),
  reloadBonusAmount: z.coerce
    .number()
    .min(0, 'Reload bonus amount is required'),
  maxRetentionBonus: z.coerce
    .number()
    .min(0, 'Maximum retention bonus is required'),
  retentionBonusWeeklyChance: z.coerce
    .number()
    .min(0, 'Withdrawal offer bonus weekly chance is required'),
  retentionBonusMatchMultiplier: z.coerce
    .number()
    .min(1, 'Withdrawal offer bonus multiplier is required'),
  referralCreditAmount: z.coerce
    .number()
    .min(1, 'Referral credit amount is required'),
  referralCustomText: z.coerce
    .string()
    .min(1, 'Referral custom text is required'),
  minBetAmount: z.coerce.number().min(1, 'Minimum bet amount is required'),
  maxBetAmount: z.coerce.number().min(1, 'Maximum bet amount is required'),
  repeatEntries: z.coerce.number().min(0, 'Repeat entries limit is required'),
  minMarketOdds: z.coerce.number().min(-200, 'Minimum market odds is required'),
  maxMarketOdds: z.coerce.number().min(1, 'Maximum market odds is required'),
  challengePromoMessage: z.string().min(1, 'Promo message is required'),
  signupFreeEntry: z.boolean(),
  maxDailyTotalBetAmount: z.coerce
    .number()
    .min(0, 'Maximum daily total bet amount must be greater than or equal 0.'),
  weeklyReferralMaxAmountEarned: z.coerce
    .number()
    .min(
      0,
      'Weekly referral max amount earned must be greater than or equal 0.',
    ),
  minDepositAmount: z.coerce
    .number()
    .min(0, 'Deposit amount must be greater than or equal 0.'),
});

export type AppSettingFormSchemaType = z.infer<typeof formSchema>;

interface Props {
  onSubmit: (data: AppSettingFormSchemaType) => void;
  appSettings: AppSettingsState;
}

export const AppSettings = (props: Props) => {
  const { appSettings } = props;

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isValid },
    reset,
    control,
  } = useForm<AppSettingFormSchemaType>({
    resolver: zodResolver(formSchema),
    mode: 'all',
    reValidateMode: 'onChange',
  });

  useEffect(() => {
    if (appSettings) {
      reset({
        maxMatchDepositAmount: Number(appSettings.MAX_MATCH_DEPOSIT_AMOUNT),
        depositAmountOptions: appSettings.DEPOSIT_AMOUNT_OPTIONS,
        reloadBonusType: appSettings.RELOAD_BONUS_TYPE,
        reloadBonusAmount: Number(appSettings.RELOAD_BONUS_AMOUNT),
        maxRetentionBonus: Number(appSettings.MAX_RETENTION_BONUS),
        retentionBonusWeeklyChance: Number(
          appSettings.RETENTION_BONUS_WEEKLY_CHANCE,
        ),
        retentionBonusMatchMultiplier: Number(
          appSettings.RETENTION_BONUS_MATCH_MULTIPLIER,
        ),
        referralCreditAmount: Number(appSettings.REFERRAL_CREDIT_AMOUNT),
        referralCustomText: appSettings.REFERRAL_CUSTOM_TEXT,
        minBetAmount: Number(appSettings.MIN_BET_AMOUNT),
        maxBetAmount: Number(appSettings.MAX_BET_AMOUNT),
        repeatEntries: Number(appSettings.REPEAT_ENTRIES_LIMIT),
        minMarketOdds: Number(appSettings.MIN_MARKET_ODDS),
        maxMarketOdds: Number(appSettings.MAX_MARKET_ODDS),
        challengePromoMessage: appSettings.CHALLENGE_PROMO_MESSAGE,
        signupFreeEntry: Number(appSettings.SIGNUP_FREE_ENTRY) == 1,
        maxDailyTotalBetAmount: Number(appSettings.MAX_DAILY_TOTAL_BET_AMOUNT),
        weeklyReferralMaxAmountEarned: Number(
          appSettings.WEEKLY_REFERRAL_MAX_AMOUNT_EARNED,
        ),
        minDepositAmount: Number(appSettings.MIN_DEPOSIT_AMOUNT),
      });
    }
  }, [appSettings]);

  return (
    <form onSubmit={handleSubmit(props.onSubmit)}>
      <div className={'flex flex-col gap-6 p-2'}>
        {/*Account Deposit*/}
        <div className={'flex flex-col gap-4'}>
          <p className={'font-semibold text-md'}>Account Deposit</p>
          <TextField
            type={'number'}
            label="Minimum Deposit Amount"
            variant="outlined"
            fullWidth
            {...register('minDepositAmount')}
            error={!!errors?.minDepositAmount}
            helperText={errors?.minDepositAmount?.message}
            size={'small'}
            inputProps={{
              step: 0.01,
            }}
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            type={'number'}
            label="Maximum Match Deposit Amount"
            variant="outlined"
            fullWidth
            {...register('maxMatchDepositAmount')}
            error={!!errors?.maxMatchDepositAmount}
            helperText={errors?.maxMatchDepositAmount?.message}
            size={'small'}
            inputProps={{
              step: 0.01,
            }}
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            type={'text'}
            label="Deposit Amount Options"
            variant="outlined"
            fullWidth
            {...register('depositAmountOptions')}
            error={!!errors?.depositAmountOptions}
            helperText={errors?.depositAmountOptions?.message}
            size={'small'}
            placeholder={'e.g. 10, 20, 50, 100'}
            InputLabelProps={{ shrink: true }}
          />

          <Controller
            control={control}
            name={'reloadBonusType'}
            rules={{ required: true }}
            render={({ field, fieldState: { error } }) => (
              <TextField
                id="reloadBonusType"
                select
                label="Reload Bonus Type"
                fullWidth
                error={!!error}
                helperText={error?.message}
                size={'small'}
                onChange={(event) => field.onChange(event.target.value)}
                value={field.value}
                InputLabelProps={{ shrink: true }}
              >
                {Object.values(ReloadBonusType).map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </TextField>
            )}
            defaultValue={''}
          />

          <TextField
            type={'number'}
            label="Reload Bonus Amount"
            variant="outlined"
            fullWidth
            {...register('reloadBonusAmount')}
            error={!!errors?.reloadBonusAmount}
            helperText={errors?.reloadBonusAmount?.message}
            size={'small'}
            inputProps={{
              step: 0.01,
            }}
            InputLabelProps={{ shrink: true }}
          />
        </div>

        {/*Account Withdraw Funds*/}
        <div className={'flex flex-col gap-4'}>
          <p className={'font-semibold text-md'}>Withdraw Funds Offers</p>

          <TextField
            type={'number'}
            label="Maximum Withdrawal Offer Bonus"
            placeholder={'eg. 100'}
            variant="outlined"
            fullWidth
            {...register('maxRetentionBonus')}
            error={!!errors?.maxRetentionBonus}
            helperText={errors?.maxRetentionBonus?.message}
            size={'small'}
            inputProps={{
              step: 0.01,
            }}
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            type={'number'}
            label="Withdrawal Offer Bonus Weekly Chance"
            variant="outlined"
            fullWidth
            {...register('retentionBonusWeeklyChance')}
            error={!!errors?.retentionBonusWeeklyChance}
            helperText={errors?.retentionBonusWeeklyChance?.message}
            size={'small'}
            inputProps={{
              step: 0.01,
            }}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            type={'number'}
            label="Withdrawal Offer Bonus Match Multiplier"
            variant="outlined"
            fullWidth
            {...register('retentionBonusMatchMultiplier')}
            error={!!errors?.retentionBonusMatchMultiplier}
            helperText={errors?.retentionBonusMatchMultiplier?.message}
            size={'small'}
            inputProps={{
              step: 0.01,
            }}
            InputLabelProps={{ shrink: true }}
          />
        </div>

        {/*Referrals*/}
        <div className={'flex flex-col gap-4'}>
          <p className={'font-semibold text-md'}>Referrals</p>
          <TextField
            type={'text'}
            label="Referral Custom text"
            variant="outlined"
            fullWidth
            {...register('referralCustomText')}
            error={!!errors?.referralCustomText}
            helperText={errors?.referralCustomText?.message}
            size={'small'}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            type={'number'}
            label="Referral Credit Amount"
            variant="outlined"
            fullWidth
            {...register('referralCreditAmount')}
            error={!!errors?.referralCreditAmount}
            helperText={errors?.referralCreditAmount?.message}
            size={'small'}
            inputProps={{
              step: 0.01,
            }}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            type={'number'}
            label="Weekly Referral Max Amount Earned"
            variant="outlined"
            fullWidth
            {...register('weeklyReferralMaxAmountEarned')}
            error={!!errors?.weeklyReferralMaxAmountEarned}
            helperText={errors?.weeklyReferralMaxAmountEarned?.message}
            size={'small'}
            inputProps={{
              step: 0.01,
            }}
            InputLabelProps={{ shrink: true }}
          />
        </div>

        {/*Stake*/}
        <div className={'flex flex-col gap-4'}>
          <p className={'font-semibold text-md'}>Stake</p>
          <TextField
            type={'number'}
            label="Minimum Stake Amount"
            placeholder={'1'}
            variant="outlined"
            fullWidth
            {...register('minBetAmount')}
            error={!!errors?.minBetAmount}
            helperText={errors?.minBetAmount?.message}
            size={'small'}
            inputProps={{
              step: 0.01,
            }}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            type={'number'}
            label="Maximum Stake Amount"
            placeholder={'50'}
            variant="outlined"
            fullWidth
            {...register('maxBetAmount')}
            error={!!errors?.maxBetAmount}
            helperText={errors?.maxBetAmount?.message}
            size={'small'}
            inputProps={{
              step: 0.01,
            }}
            InputLabelProps={{ shrink: true }}
          />
          <div className={'flex flex-auto'}>
            <TextField
              type={'number'}
              label="Maximum Daily Total Stake Amount"
              placeholder={'50'}
              variant="outlined"
              fullWidth
              {...register('maxDailyTotalBetAmount')}
              error={!!errors?.maxDailyTotalBetAmount}
              helperText={errors?.maxDailyTotalBetAmount?.message}
              size={'small'}
              inputProps={{
                step: 0.01,
              }}
              InputLabelProps={{ shrink: true }}
            />
            <Tooltip title={'Set 0 as no limits.'}>
              <InfoIcon color={'primary'} />
            </Tooltip>
          </div>
          <TextField
            type={'number'}
            label="Repeat Entry Limit"
            placeholder={'0'}
            variant="outlined"
            fullWidth
            {...register('repeatEntries')}
            error={!!errors?.repeatEntries}
            helperText={errors?.repeatEntries?.message}
            size={'small'}
            InputLabelProps={{ shrink: true }}
          />
        </div>

        {/*Market/Offer*/}
        <div className={'flex flex-col gap-4'}>
          <p className={'font-semibold text-md'}>Market/Offer</p>
          <TextField
            type={'number'}
            label="Minimum Market Odds"
            placeholder={'-150'}
            variant="outlined"
            fullWidth
            {...register('minMarketOdds')}
            error={!!errors?.minMarketOdds}
            helperText={errors?.minMarketOdds?.message}
            size={'small'}
            inputProps={{
              step: 0.01,
            }}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            type={'number'}
            label="Maximum Market Odds"
            placeholder={'150'}
            variant="outlined"
            fullWidth
            {...register('maxMarketOdds')}
            error={!!errors?.maxMarketOdds}
            helperText={errors?.maxMarketOdds?.message}
            size={'small'}
            inputProps={{
              step: 0.01,
            }}
            InputLabelProps={{ shrink: true }}
          />
        </div>

        {/*Challenge Page*/}
        <div className={'flex flex-col gap-4'}>
          <p className={'font-semibold text-md'}>Challenge Page</p>
          <TextField
            label="Promo Message"
            placeholder={'-150'}
            variant="outlined"
            fullWidth
            {...register('challengePromoMessage')}
            error={!!errors?.challengePromoMessage}
            helperText={errors?.challengePromoMessage?.message}
            size={'small'}
            InputLabelProps={{ shrink: true }}
          />
        </div>

        {/*Sign up*/}
        <div className={'flex flex-col gap-4'}>
          <p className={'font-semibold text-md'}>Sign up Free Entry</p>
          <Controller
            name="signupFreeEntry"
            control={control}
            defaultValue={false}
            render={({ field }) => (
              <FormControlLabel
                control={
                  <Switch {...field} checked={field.value} color="primary" />
                }
                label={`Automatic "Free Entry" bonus balance at first sign up`}
              />
            )}
          />
        </div>

        <p className={'font-semibold text-md'}>
          <Link href={UrlPaths.BonusCreditLimits} legacyBehavior>
            <a
              className={'underline text-blue-500'}
              target="_blank"
              rel="noopener noreferrer"
            >
              Free Entry / Bonus Credit Limits
            </a>
          </Link>
        </p>

        <div className={'flex flex-row items-center justify-center gap-4'}>
          <Button
            variant={'outlined'}
            fullWidth
            onClick={() => reset()}
            disabled={!isDirty}
          >
            Cancel
          </Button>
          <Button
            variant={'contained'}
            fullWidth
            type={'submit'}
            disabled={!isDirty && !isValid}
          >
            Save
          </Button>
        </div>
      </div>
    </form>
  );
};

export default AppSettings;
