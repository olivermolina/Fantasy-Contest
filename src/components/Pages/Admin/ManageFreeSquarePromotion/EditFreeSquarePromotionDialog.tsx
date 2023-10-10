import React, { useEffect } from 'react';
import {
  AppBar,
  Button,
  Dialog,
  FormControl,
  FormGroup,
  FormHelperText,
  FormLabel,
  IconButton,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { ManageFreeSquarePromotionRowModel } from './ManageFreeSquarePromotion';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import * as Yup from 'yup';
import { ContestCategory, League } from '@prisma/client';

export interface AddFreeSquarePromotionInput {
  /**
   * Free Square ID
   */
  id: string | null;
  /**
   * Market ID of the line
   */
  marketId: string;
  /**
   * Sel ID of the line
   */
  selId: number;
  /**
   * The discount to be applied to the line
   * @example 95
   */
  discount: number;
  /**
   * The list of contest pick category ID's
   * @example [pickId1, pickId2, pickId3]
   */
  pickCategories: [string, ...string[]];
  /**
   * Boolean to check if it can be used in a free entry
   */
  freeEntryEnabled: boolean;
  /**
   * Max stake/bet amount
   */
  maxStake: number;
  /**
   * League
   */
  league: League;
}

const InputValidationSchema = Yup.object().shape({
  discount: Yup.number()
    .typeError('Please provide a discount')
    .min(0, 'Minimum discount is 0')
    .max(100, 'Maximum discount is 100'),
  maxStake: Yup.number()
    .typeError('Please provide a max stake/bet.')
    .min(1, 'Minimum discount is 1'),
  pickCategories: Yup.array().min(1, 'Must have at least one category'),
});

interface EditFreeSquarePromotionDialogProps {
  /**
   * Close dialog callback function
   */
  handleClose: () => void;
  /**
   * Boolean to show dialog
   * @example true
   */
  open: boolean;
  /**
   * ManageFreeSquarePromotion row model
   */
  row?: ManageFreeSquarePromotionRowModel;
  /**
   * Available contest pick categories
   */
  contestCategories: ContestCategory[];
  /**
   * Callback function to save the free square promotion discount
   */
  handleSave: (formData: AddFreeSquarePromotionInput) => void;
}

/**
 * A dialog form for saving a free square details
 */
export default function EditFreeSquarePromotionDialog(
  props: EditFreeSquarePromotionDialogProps,
) {
  const { handleClose, open, row, contestCategories, handleSave } = props;
  const {
    formState: { errors },
    handleSubmit,
    control,
    register,
    reset,
  } = useForm<AddFreeSquarePromotionInput>({
    resolver: yupResolver(InputValidationSchema),
    defaultValues: {
      id: row?.freeSquare?.id,
      marketId: row?.id,
      selId: row?.selId,
      discount: row?.freeSquare?.discount,
      pickCategories:
        row?.freeSquare?.pickCategories.map(
          (pickCategory) => pickCategory.id,
        ) || [],
      freeEntryEnabled: row?.freeSquare?.freeEntryEnabled,
      maxStake: row?.freeSquare?.maxStake,
      league: row?.league as League,
    },
    mode: 'all',
    shouldFocusError: true,
    shouldUseNativeValidation: false,
  });

  const onSubmit = (formData: AddFreeSquarePromotionInput) => {
    handleSave(formData);
    handleClose();
  };

  useEffect(() => {
    reset({
      id: row?.freeSquare?.id,
      marketId: row?.id,
      selId: row?.selId,
      discount: row?.freeSquare?.discount,
      pickCategories:
        row?.freeSquare?.pickCategories.map(
          (pickCategory) => pickCategory.id,
        ) || [],
      freeEntryEnabled: row?.freeSquare?.freeEntryEnabled,
      maxStake: row?.freeSquare?.maxStake,
      league: row?.league as League,
    });
  }, [row]);

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth={'xs'}>
      <AppBar sx={{ position: 'relative' }}>
        <Toolbar>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            Free Square Promotion
          </Typography>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={'flex flex-col justify-center gap-2 p-4'}>
          <p>
            Name: <span className={'font-bold'}>{row?.playerName} </span>
          </p>
          <p>
            Stat: <span className={'font-bold'}>{row?.statName} </span>
          </p>
          <p>
            Total: <span className={'font-bold'}>{row?.total}</span>
          </p>
          <div className={'flex flex-col items-baseline text-lg gap-1'}>
            <p>Discount:</p>
            <TextField
              hiddenLabel
              type={'number'}
              variant="standard"
              fullWidth
              {...register('discount')}
              error={!!errors?.discount}
              helperText={errors?.discount?.message}
              size={'small'}
              inputProps={{
                step: 0.01,
              }}
              margin={'none'}
            />
          </div>

          <div className={'flex flex-col items-baseline text-lg gap-1'}>
            <p>Max Stake/Bet:</p>
            <TextField
              hiddenLabel
              type={'number'}
              variant="standard"
              fullWidth
              {...register('maxStake')}
              error={!!errors?.maxStake}
              helperText={errors?.maxStake?.message}
              size={'small'}
              inputProps={{
                step: 0.01,
              }}
              margin={'none'}
            />
          </div>

          <FormControl component="fieldset" error={!!errors?.pickCategories}>
            <FormLabel component="legend">Select # of players:</FormLabel>
            <FormGroup row>
              <Controller
                name="pickCategories"
                control={control}
                render={({ field }) => (
                  <>
                    {contestCategories.map((category) => (
                      <FormControlLabel
                        {...field}
                        key={category.id}
                        label={`${category.numberOfPicks} Picks`}
                        control={
                          <Checkbox
                            defaultChecked={
                              !!row?.freeSquare?.pickCategories.find(
                                (item) => item.id === category.id,
                              )
                            }
                            onChange={() => {
                              const contestCategoryId = category.id;
                              const values: string[] = field.value;

                              if (!values) {
                                field.onChange([contestCategoryId]);
                                return;
                              }

                              if (!values?.includes(contestCategoryId)) {
                                field.onChange([
                                  ...field.value,
                                  contestCategoryId,
                                ]);
                                return;
                              }

                              const newCategories = field.value.filter(
                                (category) => category !== contestCategoryId,
                              );
                              field.onChange(newCategories);
                            }}
                          />
                        }
                      />
                    ))}
                  </>
                )}
              />
            </FormGroup>
            <FormHelperText>{errors?.pickCategories?.message}</FormHelperText>
          </FormControl>

          <Controller
            name="freeEntryEnabled"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                {...field}
                label={'Can use bonus credit'}
                control={
                  <Checkbox
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                  />
                }
              />
            )}
          />
          <Button variant={'contained'} type="submit">
            Save
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
