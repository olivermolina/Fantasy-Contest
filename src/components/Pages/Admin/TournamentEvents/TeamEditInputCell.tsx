import { GridRenderEditCellParams, useGridApiContext } from '@mui/x-data-grid';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect } from 'react';
import * as z from 'zod';
import TeamAutoComplete from '~/components/Admin/Offer/OfferForm/TeamAutoComplete';

export const TeamSchema = z.object({
  id: z.string(),
  name: z.string(),
  code: z.string(),
});

export const TeamWithInputValueSchema = TeamSchema.and(
  z.object({
    inputValue: z.string().optional(),
  }),
);

export const TeamInputSchema = z.object({
  team: TeamWithInputValueSchema,
});

export type TeamInput = z.infer<typeof TeamInputSchema>;

export default function TeamEditInputCell(
  props: GridRenderEditCellParams & {
    teams: any;
    teamIsLoading: boolean;
    handleAddTeam: any;
    handleDeleteTeam: any;
    setTeamFilterName: any;
  },
) {
  const {
    id,
    value,
    field,
    teams,
    teamIsLoading,
    handleAddTeam,
    handleDeleteTeam,
    setTeamFilterName,
  } = props;
  const apiRef = useGridApiContext();

  const {
    formState: { errors },
    setValue,
    control,
    handleSubmit,
    watch,
  } = useForm<TeamInput>({
    resolver: zodResolver(TeamInputSchema),
    defaultValues: {
      team: value,
    },
    mode: 'onSubmit',
    shouldFocusError: true,
    shouldUseNativeValidation: false,
  });

  const onSubmit = async () => {
    // Do nothing
  };

  const watchTeam = watch('team');

  useEffect(() => {
    apiRef.current.setEditCellValue({ id, field, value: watchTeam });
  }, [watchTeam]);
  return (
    <div className={'w-full'}>
      <form id={'marketPlayerForm'} onSubmit={handleSubmit(onSubmit)}>
        <TeamAutoComplete
          teams={teams || []}
          label={''}
          name={'team'}
          control={control}
          error={!!errors?.team}
          helperText={errors?.team?.message}
          setValue={setValue}
          onAddTeam={handleAddTeam}
          onDeleteTeam={handleDeleteTeam}
          isLoading={teamIsLoading}
          setTeamFilterName={setTeamFilterName}
          noBorder={true}
          team={value}
        />
      </form>
    </div>
  );
}
