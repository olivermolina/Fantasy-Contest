import React from 'react';
import {
  Button,
  FormControlLabel,
  InputAdornment,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  LeagueLimitFormValidationSchema,
  LeagueLimitType,
} from '~/schemas/LeagueLimitFormValidationSchema';
import InfoIcon from '@mui/icons-material/Info';
import { League } from '@prisma/client';
import {
  CustomAccordion,
  CustomAccordionDetails,
  CustomAccordionSummary,
} from '~/components/CustomAccordion/CustomAccordion';

export interface LeagueLimitFormProps {
  leagueLimit: LeagueLimitType;
  onSubmit: (data: LeagueLimitType) => void;
}

const LeagueLimitForm = (props: LeagueLimitFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    watch,
  } = useForm<LeagueLimitType>({
    resolver: zodResolver(LeagueLimitFormValidationSchema),
    defaultValues: props.leagueLimit,
  });

  const { fields } = useFieldArray({
    control,
    name: 'contestCategoryLeagueLimits',
  });

  return (
    <form
      onSubmit={handleSubmit(props.onSubmit)}
      id={`league-limit-form-${props.leagueLimit.id}`}
    >
      <div className={'flex flex-col gap-2'}>
        <span className={'font-semibold text-lg'}>Stake Limits</span>
        <div className={'flex flex-col md:flex-row md:items-center gap-4 mt-2'}>
          <Controller
            name={`enabled`}
            control={control}
            defaultValue={false}
            render={({ field: switchField }) => (
              <FormControlLabel
                control={
                  <Switch
                    {...switchField}
                    checked={switchField.value}
                    color="primary"
                  />
                }
                label={watch(`enabled`) ? 'Enabled' : 'Disabled'}
              />
            )}
          />
          <TextField
            {...register(`minStake`)}
            error={!!errors.minStake}
            helperText={errors.minStake?.message}
            type="number"
            label="Min Stake Amount"
            size={'small'}
            disabled={!watch(`enabled`)}
          />
          <TextField
            {...register(`maxStake`)}
            error={!!errors.maxStake}
            helperText={errors.maxStake?.message}
            type="number"
            label="Max Stake Amount"
            size={'small'}
            disabled={!watch(`enabled`)}
          />
          <TextField
            {...register(`teamSelectionLimit`)}
            error={!!errors.teamSelectionLimit}
            helperText={errors.teamSelectionLimit?.message}
            type="number"
            label="Team Selection Limit"
            size={'small'}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Tooltip
                    title={
                      'Limit to the number of selections per team on a single ticket/entry. Set to 0 as no limits.'
                    }
                  >
                    <InfoIcon color={'primary'} />
                  </Tooltip>
                </InputAdornment>
              ),
            }}
          />
        </div>

        <div className={'flex flex-col gap-2 mt-4'}>
          <span className={'font-semibold text-lg'}>
            # of Picks Multipliers
          </span>
          {fields.map((field, index) => (
            <div
              key={field.id}
              className={'flex flex-col md:flex-row md:items-center gap-4 mt-2'}
            >
              <Controller
                name={`contestCategoryLeagueLimits.${index}.enabled`}
                control={control}
                defaultValue={false}
                render={({ field: switchField }) => (
                  <FormControlLabel
                    control={
                      <Switch
                        {...switchField}
                        checked={switchField.value}
                        color="primary"
                      />
                    }
                    label={`${field.numberOfPicks} picks`}
                  />
                )}
              />
              <TextField
                {...register(
                  `contestCategoryLeagueLimits.${index}.allInPayoutMultiplier`,
                )}
                error={
                  !!errors.contestCategoryLeagueLimits?.[index]
                    ?.allInPayoutMultiplier
                }
                helperText={
                  errors.contestCategoryLeagueLimits?.[index]
                    ?.allInPayoutMultiplier?.message
                }
                type="number"
                label="All-In Multiplier"
                size={'small'}
                disabled={
                  !watch(`contestCategoryLeagueLimits.${index}.enabled`)
                }
                inputProps={{
                  step: 0.01,
                }}
              />
              <TextField
                {...register(
                  `contestCategoryLeagueLimits.${index}.primaryInsuredPayoutMultiplier`,
                )}
                error={
                  !!errors.contestCategoryLeagueLimits?.[index]
                    ?.primaryInsuredPayoutMultiplier
                }
                helperText={
                  errors.contestCategoryLeagueLimits?.[index]
                    ?.primaryInsuredPayoutMultiplier?.message
                }
                type="number"
                label="Insurance Primary Multiplier"
                size={'small'}
                disabled={
                  !watch(`contestCategoryLeagueLimits.${index}.enabled`)
                }
                inputProps={{
                  step: 0.01,
                }}
              />
              <TextField
                {...register(
                  `contestCategoryLeagueLimits.${index}.secondaryInsuredPayoutMultiplier`,
                )}
                error={
                  !!errors.contestCategoryLeagueLimits?.[index]
                    ?.secondaryInsuredPayoutMultiplier
                }
                helperText={
                  errors.contestCategoryLeagueLimits?.[index]
                    ?.secondaryInsuredPayoutMultiplier?.message
                }
                type="number"
                label="Insurance Secondary Multiplier"
                size={'small'}
                disabled={
                  !watch(`contestCategoryLeagueLimits.${index}.enabled`)
                }
                inputProps={{
                  step: 0.01,
                }}
              />
            </div>
          ))}
        </div>

        <Button type="submit" variant={'contained'} sx={{ width: 100, mt: 2 }}>
          Save
        </Button>
      </div>
    </form>
  );
};

interface LeagueLimitsProps {
  leagueLimits: LeagueLimitType[];
  onSubmit: (data: LeagueLimitType) => void;
}

const LeagueLimits = (props: LeagueLimitsProps) => {
  const [expanded, setExpanded] = React.useState<League | false>(League.NFL);

  const handleChange =
    (panel: League) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false);
    };

  return (
    <>
      {props.leagueLimits.map((leagueLimit) => (
        <CustomAccordion
          key={leagueLimit.id}
          expanded={expanded === leagueLimit.league}
          onChange={handleChange(leagueLimit.league)}
        >
          <CustomAccordionSummary
            aria-controls="panel1d-content"
            id="panel1d-header"
          >
            <Typography>{leagueLimit.league}</Typography>
          </CustomAccordionSummary>
          <CustomAccordionDetails>
            <LeagueLimitForm
              leagueLimit={leagueLimit}
              onSubmit={props.onSubmit}
            />
          </CustomAccordionDetails>
        </CustomAccordion>
      ))}
    </>
  );
};
export default LeagueLimits;
