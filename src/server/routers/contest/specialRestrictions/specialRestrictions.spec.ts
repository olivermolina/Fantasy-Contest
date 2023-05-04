import { prismaMock } from '~/server/singleton';
import { TRPCError } from '@trpc/server';
import { League } from '@prisma/client';
import { CustomErrorMessages } from '~/constants/CustomErrorMessages';
import specialRestrictions from './specialRestrictions';

describe('Test SpecialRestrictions', () => {
  beforeEach(() => {
    prismaMock.specialRestriction.findMany.mockResolvedValue([
      {
        id: '35e7e89d-5043-4615-a7f7-130374c4a732',
        code: 'LL-GEO-US-NE',
        description: 'Restrict under 19 of age',
        blockedReasonCodes: ['ID-UA19'],
        blockedLeagues: [],
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: '35e7e89d-5043-4615-a7f7-1303324c4a321',
        code: 'LL-GEO-US-MA',
        description: 'Restrict college leagues and under 21 of age',
        blockedReasonCodes: ['ID-UA21'],
        blockedLeagues: [League.NCAAB, League.NCAAF],
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  });

  it('should not throw any error', async () => {
    const reasonCodes = ['LL-GEO-US-TX'];
    const leagues = [League.NCAAB];
    await expect(
      async () => await specialRestrictions(reasonCodes, leagues),
    ).not.toThrow(TRPCError);
  });

  it('should throw under 21 age restriction error if location is Massachusetts', async () => {
    const reasonCodes = ['LL-GEO-US-MA', 'ID-UA21'];
    const leagues = [League.NCAAB];
    await expect(
      async () => await specialRestrictions(reasonCodes, leagues),
    ).rejects.toThrow(TRPCError);
    await expect(
      async () => await specialRestrictions(reasonCodes, leagues),
    ).rejects.toThrow(CustomErrorMessages['ID-UA19']);
  });

  it('should not throw league restriction error if location is Massachusetts', async () => {
    const reasonCodes = ['LL-GEO-US-MA'];
    const leagues = [League.NBA, League.NHL];
    await expect(
      async () => await specialRestrictions(reasonCodes, leagues),
    ).not.toThrow(TRPCError);
  });

  it('should throw league restriction error if location is Massachusetts', async () => {
    const reasonCodes = ['LL-GEO-US-MA'];
    const leagues = [League.NCAAB, League.NCAAF];
    await expect(
      async () => await specialRestrictions(reasonCodes, leagues),
    ).rejects.toThrow(TRPCError);
    await expect(
      async () => await specialRestrictions(reasonCodes, leagues),
    ).rejects.toThrow(CustomErrorMessages.BLOCKED_COLLEGE_SPORTS_ERROR);
  });

  it('should throw under 19 age restriction error if location is Nebraska', async () => {
    const reasonCodes = ['LL-GEO-US-NE', 'ID-UA19'];
    const leagues = [League.NCAAB];
    await expect(
      async () => await specialRestrictions(reasonCodes, leagues),
    ).rejects.toThrow(TRPCError);
    await expect(
      async () => await specialRestrictions(reasonCodes, leagues),
    ).rejects.toThrow(CustomErrorMessages['ID-UA19']);
  });

  it('should throw under age error when adding a fund if location is Nebraska/Massachusetts', async () => {
    const reasonCodesNE = ['LL-GEO-US-NE', 'ID-UA19'];

    await expect(
      async () => await specialRestrictions(reasonCodesNE, undefined, true),
    ).rejects.toThrow(TRPCError);
    await expect(
      async () => await specialRestrictions(reasonCodesNE, undefined, true),
    ).rejects.toThrow(CustomErrorMessages.NOT_OF_AGE_STATE_ERROR);

    const reasonCodesMA = ['LL-GEO-US-MA', 'ID-UA21'];
    await expect(
      async () => await specialRestrictions(reasonCodesMA, undefined, true),
    ).rejects.toThrow(TRPCError);
    await expect(
      async () => await specialRestrictions(reasonCodesMA, undefined, true),
    ).rejects.toThrow(CustomErrorMessages.NOT_OF_AGE_STATE_ERROR);
  });
});
