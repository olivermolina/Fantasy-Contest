/**
 * Adds seed data to your db
 *
 * @link https://www.prisma.io/docs/guides/database/seed-database
 */
import {
  AppSettingName,
  BetLegType,
  BetStatus,
  BetType,
  ContestType,
  ContestWagerType,
  League,
  MarketResult,
  MarketType,
  PrismaClient,
  Status,
  BetStakeType,
} from '@prisma/client';
import { appRouter } from '~/server/routers/_app';
import dayjs from 'dayjs';

import { faker } from '@faker-js/faker';
import { MORE_OR_LESS_CONTEST_ID } from '~/constants/MoreOrLessContestId';

const prisma = new PrismaClient();

const caller = appRouter.createCaller({} as any);

async function main() {
  let user = await prisma.user.findFirst();
  if (!user) {
    try {
      await caller.user.signUp({
        email: 'test@gmail.com',
        password: 'Password1!',
        confirmPassword: 'Password1!',
        username: 'testing',
        DOB: new Date(),
        phone: '12392342999',
        state: 'TX',
        referralCode: '',
      });
    } catch (e) {
      // If test user auth already exist, trigger login to populate user's table
      await caller.user.login({
        email: 'test@gmail.com',
        password: 'Password1!',
      });
    }

    user = await prisma.user.findFirst();
  }

  await prisma.$queryRaw`truncate "Contest" cascade;`;
  await prisma.$queryRaw`truncate "ContestEntry" cascade;`;
  await prisma.$queryRaw`truncate "Offer" cascade;`;
  await prisma.$queryRaw`truncate "Team" cascade;`;
  await prisma.$queryRaw`truncate "Player" cascade;`;
  await prisma.$queryRaw`truncate "Market" cascade;`;
  await prisma.$queryRaw`truncate "Bet" cascade;`;
  const contestEntry = {
    id: 'contest-id-entry',
    tokens: 1000,
    User: {
      connect: {
        id: user?.id,
      },
    },
  };
  await prisma.contest.create({
    data: {
      id: MORE_OR_LESS_CONTEST_ID,
      name: 'MORE OR LESS CONTEST',
      description: 'This is a more or less contest',
      isActive: true,
      startDate: dayjs().subtract(1, 'h').toDate(),
      endDate: dayjs().add(50, 'year').toDate(),
      type: ContestType.FANTASY,
      bgImageUrl: 'https://picsum.photos/200',
      entryFee: 200,
      totalPrize: 1000,
      created_at: new Date(),
      updated_at: new Date(),
      wagerType: ContestWagerType.CASH,
      ContestEntries: {
        create: contestEntry,
      },
      priority: 1,
    },
  });
  await prisma.contest.create({
    data: {
      id: faker.datatype.uuid(),
      name: 'Fantasy Contest',
      description: 'This is a fantasy contest',
      isActive: true,
      startDate: dayjs().add(1, 'd').toDate(),
      endDate: dayjs().add(10, 'day').toDate(),
      type: ContestType.FANTASY,
      bgImageUrl: 'https://picsum.photos/200',
      entryFee: 200,
      totalPrize: 1000,
      created_at: new Date(),
      updated_at: new Date(),
    },
  });

  const contestCategories = [
    {
      id: faker.datatype.uuid(),
      numberOfPicks: 2,
      allInPayoutMultiplier: 3,
      primaryInsuredPayoutMultiplier: 2,
      secondaryInsuredPayoutMultiplier: 0.5,
    },
    {
      id: faker.datatype.uuid(),
      numberOfPicks: 3,
      allInPayoutMultiplier: 5,
      primaryInsuredPayoutMultiplier: 2.5,
      secondaryInsuredPayoutMultiplier: 1.25,
    },
    {
      id: faker.datatype.uuid(),
      numberOfPicks: 4,
      allInPayoutMultiplier: 10,
      primaryInsuredPayoutMultiplier: 5,
      secondaryInsuredPayoutMultiplier: 1.25,
    },
  ];
  await prisma.contestCategory.createMany({
    data: contestCategories,
  });

  await prisma.appSettings.createMany({
    data: [
      {
        id: faker.datatype.uuid(),
        name: AppSettingName.MAX_MATCH_DEPOSIT_AMOUNT,
        value: '50',
      },
      {
        id: faker.datatype.uuid(),
        name: AppSettingName.REFERRAL_CREDIT_AMOUNT,
        value: '25',
      },
      {
        id: faker.datatype.uuid(),
        name: AppSettingName.RELOAD_BONUS_AMOUNT,
        value: '0',
      },
      {
        id: faker.datatype.uuid(),
        name: AppSettingName.DEPOSIT_AMOUNT_OPTIONS,
        value: '10,25,50,75,100,200',
      },
      {
        id: faker.datatype.uuid(),
        name: AppSettingName.MIN_BET_AMOUNT,
        value: '1',
      },
      {
        id: faker.datatype.uuid(),
        name: AppSettingName.MAX_BET_AMOUNT,
        value: '50',
      },
    ],
  });

  const gamedate = dayjs().add(1, 'd');
  await prisma.team.createMany({
    data: [
      {
        id: `1544-ncaaf`,
        name: 'West Virginia',
        code: 'WVU',
      },
      {
        id: `1430-ncaaf`,
        name: 'Baylor',
        code: 'BAYLOR',
      },
    ],
  });
  await prisma.player.createMany({
    data: [
      {
        id: `530898-ncaaf`,
        name: 'Sam James',
        position: 'WR',
        teamid: `1544-ncaaf`,
        team: 'West Virginia',
      },
      {
        id: `530909-ncaaf`,
        name: 'Bryce FordWheaton',
        position: 'WR',
        teamid: `1544-ncaaf`,
        team: 'West Virginia',
      },
      {
        id: `533742-ncaaf`,
        name: 'Ben Sims',
        position: 'TE',
        teamid: `1544-ncaaf`,
        team: 'Baylor',
      },
      {
        id: `534184-ncaaf`,
        name: 'JT Daniels',
        position: 'QB',
        teamid: `1544-ncaaf`,
        team: 'West Virginia',
      },
      {
        id: `538718-ncaaf`,
        name: 'Kaden Prather',
        position: 'WR',
        teamid: `1544-ncaaf`,
        team: 'West Virginia',
      },
      {
        id: `539394-ncaaf`,
        name: 'Blake Shapen',
        position: 'QB',
        teamid: `1544-ncaaf`,
        team: 'Baylor',
      },
      {
        id: `554186-ncaaf`,
        name: 'Monaray Baldwin',
        position: 'WR',
        teamid: `1544-ncaaf`,
        team: 'Baylor',
      },
      {
        id: `558570-ncaaf`,
        name: 'Hal Presley',
        position: 'WR',
        teamid: `1544-ncaaf`,
        team: 'Baylor',
      },
      {
        id: `562565-ncaaf`,
        name: 'Richard Reese',
        position: 'RB',
        teamid: `1544-ncaaf`,
        team: 'Baylor',
      },
    ],
  });
  const offer = {
    gid: '57767',
    league: 'NCAAF' as League,
    gamedate: gamedate.format('DD/MM/YYYY'),
    epoch: gamedate.unix(),
    start_utc: gamedate.toISOString(),
    end_utc: gamedate.add(2, 'h').toISOString(),
    inplay: false,
    status: Status.Scheduled,
    matchup: 'BAYLOR @ WVU',
    gametime: gamedate.format('HH:MM:ss'),
    homeTeamId: `1544-ncaaf`,
    awayTeamId: `1430-ncaaf`,
  };
  await prisma.offer.create({
    data: offer,
  });
  const markets = [
    {
      id: '57767-220-554186',
      type: 'PP' as MarketType,
      category: 'Receiving Yards',
      offerId: '57767',
      name: 'Monaray Baldwin',
      teamAbbrev: 'BAYLOR',
      offline: false,
      spread: null,
      spread_odd: null,
      total: 64.5,
      over: -120,
      under: -120,
      moneyline: null,
      spread_bet: null,
      spread_cash: null,
      over_bet: null,
      under_bet: null,
      over_cash: null,
      under_cash: null,
      moneyline_bet: null,
      moneyline_cash: null,
      spread_result: 'Null' as MarketResult,
      spread_stat: null,
      over_result: 'Null' as MarketResult,
      under_result: 'Null' as MarketResult,
      total_stat: null,
      moneyline_result: 'Null' as MarketResult,
      moneyline_stat: null,
      teamId: null,
      playerId: `554186-ncaaf`,
      sel_id: 554186,
    },
    {
      id: '57767-215-539394',
      type: 'PP' as MarketType,
      category: 'Passing Yards',
      offerId: '57767',
      name: 'Blake Shapen',
      teamAbbrev: 'BAYLOR',
      offline: false,
      spread: null,
      spread_odd: null,
      total: 225.5,
      over: -120,
      under: -120,
      moneyline: null,
      spread_bet: null,
      spread_cash: null,
      over_bet: null,
      under_bet: null,
      over_cash: null,
      under_cash: null,
      moneyline_bet: null,
      moneyline_cash: null,
      spread_result: 'Null' as MarketResult,
      spread_stat: null,
      over_result: 'Null' as MarketResult,
      under_result: 'Null' as MarketResult,
      total_stat: null,
      moneyline_result: 'Null' as MarketResult,
      moneyline_stat: null,
      teamId: null,
      playerId: `539394-ncaaf`,
      sel_id: 539394,
    },
    {
      id: '57767-220-558570',
      type: 'PP' as MarketType,
      category: 'Receiving Yards',
      offerId: '57767',
      name: 'Hal Presley',
      teamAbbrev: 'BAYLOR',
      offline: false,
      spread: null,
      spread_odd: null,
      total: 38.5,
      over: -120,
      under: -120,
      moneyline: null,
      spread_bet: null,
      spread_cash: null,
      over_bet: null,
      under_bet: null,
      over_cash: null,
      under_cash: null,
      moneyline_bet: null,
      moneyline_cash: null,
      spread_result: 'Null' as MarketResult,
      spread_stat: null,
      over_result: 'Null' as MarketResult,
      under_result: 'Null' as MarketResult,
      total_stat: null,
      moneyline_result: 'Null' as MarketResult,
      moneyline_stat: null,
      teamId: null,
      playerId: `558570-ncaaf`,
      sel_id: 558570,
    },
    {
      id: '57767-215-534184',
      type: 'PP' as MarketType,
      category: 'Passing Yards',
      offerId: '57767',
      name: 'JT Daniels',
      teamAbbrev: 'WVU',
      offline: false,
      spread: null,
      spread_odd: null,
      total: 239.5,
      over: -120,
      under: -120,
      moneyline: null,
      spread_bet: null,
      spread_cash: null,
      over_bet: null,
      under_bet: null,
      over_cash: null,
      under_cash: null,
      moneyline_bet: null,
      moneyline_cash: null,
      spread_result: 'Null' as MarketResult,
      spread_stat: null,
      over_result: 'Null' as MarketResult,
      under_result: 'Null' as MarketResult,
      total_stat: null,
      moneyline_result: 'Null' as MarketResult,
      moneyline_stat: null,
      teamId: null,
      playerId: `534184-ncaaf`,
      sel_id: 534184,
    },
    {
      id: '57767-220-530909',
      type: 'PP' as MarketType,
      category: 'Receiving Yards',
      offerId: '57767',
      name: 'Bryce Ford-Wheaton',
      teamAbbrev: 'WVU',
      offline: false,
      spread: null,
      spread_odd: null,
      total: 76.5,
      over: -120,
      under: -120,
      moneyline: null,
      spread_bet: null,
      spread_cash: null,
      over_bet: null,
      under_bet: null,
      over_cash: null,
      under_cash: null,
      moneyline_bet: null,
      moneyline_cash: null,
      spread_result: 'Null' as MarketResult,
      spread_stat: null,
      over_result: 'Null' as MarketResult,
      under_result: 'Null' as MarketResult,
      total_stat: null,
      moneyline_result: 'Null' as MarketResult,
      moneyline_stat: null,
      teamId: null,
      playerId: `530909-ncaaf`,
      sel_id: 530909,
    },
    {
      id: '57767-24',
      type: 'GP' as MarketType,
      category: 'Team Total',
      offerId: '57767',
      name: 'West Virginia',
      teamAbbrev: 'WVU',
      offline: true,
      spread: null,
      spread_odd: null,
      total: 24.5,
      over: -115,
      under: -115,
      moneyline: null,
      spread_bet: null,
      spread_cash: null,
      over_bet: null,
      under_bet: null,
      over_cash: null,
      under_cash: null,
      moneyline_bet: null,
      moneyline_cash: null,
      spread_result: 'Null' as MarketResult,
      spread_stat: null,
      over_result: 'One' as MarketResult,
      under_result: 'Zero' as MarketResult,
      total_stat: null,
      moneyline_result: 'Null' as MarketResult,
      moneyline_stat: null,
      teamId: `1544-ncaaf`,
      playerId: null,
      sel_id: 1544,
    },
    {
      id: '57767-24',
      type: 'GP' as MarketType,
      category: 'Team Total',
      offerId: '57767',
      name: 'Baylor',
      teamAbbrev: 'BAYLOR',
      offline: true,
      spread: null,
      spread_odd: null,
      total: 28.5,
      over: -115,
      under: -115,
      moneyline: null,
      spread_bet: null,
      spread_cash: null,
      over_bet: null,
      under_bet: null,
      over_cash: null,
      under_cash: null,
      moneyline_bet: null,
      moneyline_cash: null,
      spread_result: 'Null' as MarketResult,
      spread_stat: null,
      over_result: 'One' as MarketResult,
      under_result: 'Zero' as MarketResult,
      total_stat: null,
      moneyline_result: 'Null' as MarketResult,
      moneyline_stat: null,
      teamId: `1430-ncaaf`,
      playerId: null,
      sel_id: 1430,
    },
    {
      id: '57767-12',
      type: 'GP' as MarketType,
      category: '1Q Game Line',
      offerId: '57767',
      name: 'West Virginia',
      teamAbbrev: 'WVU',
      offline: true,
      spread: 0.5,
      spread_odd: -140,
      total: 10.5,
      over: -115,
      under: -115,
      moneyline: null,
      spread_bet: null,
      spread_cash: null,
      over_bet: null,
      under_bet: null,
      over_cash: null,
      under_cash: null,
      moneyline_bet: null,
      moneyline_cash: null,
      spread_result: 'One' as MarketResult,
      spread_stat: null,
      over_result: 'Zero' as MarketResult,
      under_result: 'One' as MarketResult,
      total_stat: null,
      moneyline_result: 'One' as MarketResult,
      moneyline_stat: null,
      teamId: `1544-ncaaf`,
      playerId: null,
      sel_id: 1544,
    },
    {
      id: '57767-8',
      type: 'GP' as MarketType,
      category: '1H Game Line',
      offerId: '57767',
      name: 'Baylor',
      teamAbbrev: 'BAYLOR',
      offline: true,
      spread: -1.5,
      spread_odd: -115,
      total: 27.5,
      over: -110,
      under: -110,
      moneyline: -145,
      spread_bet: null,
      spread_cash: null,
      over_bet: null,
      under_bet: null,
      over_cash: null,
      under_cash: null,
      moneyline_bet: null,
      moneyline_cash: null,
      spread_result: 'One' as MarketResult,
      spread_stat: null,
      over_result: 'One' as MarketResult,
      under_result: 'Zero' as MarketResult,
      total_stat: null,
      moneyline_result: 'One' as MarketResult,
      moneyline_stat: null,
      teamId: `1430-ncaaf`,
      playerId: null,
      sel_id: 1430,
    },
    {
      id: '57767-6',
      type: 'GM' as MarketType,
      category: 'Game Line',
      offerId: '57767',
      name: 'Baylor',
      teamAbbrev: 'BAYLOR',
      offline: true,
      spread: -3,
      spread_odd: -110,
      total: 55,
      over: -110,
      under: -110,
      moneyline: -160,
      spread_bet: null,
      spread_cash: null,
      over_bet: null,
      under_bet: null,
      over_cash: null,
      under_cash: null,
      moneyline_bet: null,
      moneyline_cash: null,
      spread_result: 'Zero' as MarketResult,
      spread_stat: null,
      over_result: 'One' as MarketResult,
      under_result: 'Zero' as MarketResult,
      total_stat: null,
      moneyline_result: 'Zero' as MarketResult,
      moneyline_stat: null,
      teamId: `1430-ncaaf`,
      playerId: null,
      sel_id: 1430,
    },
    {
      id: '57767-12',
      type: 'GP' as MarketType,
      category: '1Q Game Line',
      offerId: '57767',
      name: 'Baylor',
      teamAbbrev: 'BAYLOR',
      offline: true,
      spread: -0.5,
      spread_odd: 110,
      total: 10.5,
      over: -115,
      under: -115,
      moneyline: null,
      spread_bet: null,
      spread_cash: null,
      over_bet: null,
      under_bet: null,
      over_cash: null,
      under_cash: null,
      moneyline_bet: null,
      moneyline_cash: null,
      spread_result: 'Zero' as MarketResult,
      spread_stat: null,
      over_result: 'Zero' as MarketResult,
      under_result: 'One' as MarketResult,
      total_stat: null,
      moneyline_result: 'Zero' as MarketResult,
      moneyline_stat: null,
      teamId: `1430-ncaaf`,
      playerId: null,
      sel_id: 1430,
    },
    {
      id: '57767-6',
      type: 'GM' as MarketType,
      category: 'Game Line',
      offerId: '57767',
      name: 'West Virginia',
      teamAbbrev: 'WVU',
      offline: true,
      spread: 3,
      spread_odd: -110,
      total: 55,
      over: -110,
      under: -110,
      moneyline: 140,
      spread_bet: null,
      spread_cash: null,
      over_bet: null,
      under_bet: null,
      over_cash: null,
      under_cash: null,
      moneyline_bet: null,
      moneyline_cash: null,
      spread_result: 'One' as MarketResult,
      spread_stat: null,
      over_result: 'One' as MarketResult,
      under_result: 'Zero' as MarketResult,
      total_stat: null,
      moneyline_result: 'One' as MarketResult,
      moneyline_stat: null,
      teamId: `1544-ncaaf`,
      playerId: null,
      sel_id: 1544,
    },
    {
      id: '57767-8',
      type: 'GP' as MarketType,
      category: '1H Game Line',
      offerId: '57767',
      name: 'West Virginia',
      teamAbbrev: 'WVU',
      offline: true,
      spread: 1.5,
      spread_odd: -105,
      total: 27.5,
      over: -110,
      under: -110,
      moneyline: 125,
      spread_bet: null,
      spread_cash: null,
      over_bet: null,
      under_bet: null,
      over_cash: null,
      under_cash: null,
      moneyline_bet: null,
      moneyline_cash: null,
      spread_result: 'Zero' as MarketResult,
      spread_stat: null,
      over_result: 'One' as MarketResult,
      under_result: 'Zero' as MarketResult,
      total_stat: null,
      moneyline_result: 'Zero' as MarketResult,
      moneyline_stat: null,
      teamId: `1544-ncaaf`,
      playerId: null,
      sel_id: 1544,
    },
    {
      id: '57767-225-562565',
      type: 'PP' as MarketType,
      category: 'Rushing Yards',
      offerId: '57767',
      name: 'Richard Reese',
      teamAbbrev: 'BAYLOR',
      offline: false,
      spread: null,
      spread_odd: null,
      total: 74.5,
      over: -120,
      under: -120,
      moneyline: null,
      spread_bet: null,
      spread_cash: null,
      over_bet: null,
      under_bet: null,
      over_cash: null,
      under_cash: null,
      moneyline_bet: null,
      moneyline_cash: null,
      spread_result: 'Null' as MarketResult,
      spread_stat: null,
      over_result: 'Null' as MarketResult,
      under_result: 'Null' as MarketResult,
      total_stat: null,
      moneyline_result: 'Null' as MarketResult,
      moneyline_stat: null,
      teamId: null,
      playerId: `562565-ncaaf`,
      sel_id: 562565,
    },
    {
      id: '57767-229',
      type: 'GP' as MarketType,
      category: 'Score First',
      offerId: '57767',
      name: 'West Virginia',
      teamAbbrev: 'WVU',
      offline: true,
      spread: null,
      spread_odd: null,
      total: 0.5,
      over: -110,
      under: -120,
      moneyline: null,
      spread_bet: null,
      spread_cash: null,
      over_bet: null,
      under_bet: null,
      over_cash: null,
      under_cash: null,
      moneyline_bet: null,
      moneyline_cash: null,
      spread_result: 'Null' as MarketResult,
      spread_stat: null,
      over_result: 'One' as MarketResult,
      under_result: 'Zero' as MarketResult,
      total_stat: null,
      moneyline_result: 'Null' as MarketResult,
      moneyline_stat: null,
      teamId: `1544-ncaaf`,
      playerId: null,
      sel_id: 1544,
    },
    {
      id: '57767-220-538718',
      type: 'PP' as MarketType,
      category: 'Receiving Yards',
      offerId: '57767',
      name: 'Kaden Prather',
      teamAbbrev: 'WVU',
      offline: false,
      spread: null,
      spread_odd: null,
      total: 58.5,
      over: -120,
      under: -120,
      moneyline: null,
      spread_bet: null,
      spread_cash: null,
      over_bet: null,
      under_bet: null,
      over_cash: null,
      under_cash: null,
      moneyline_bet: null,
      moneyline_cash: null,
      spread_result: 'Null' as MarketResult,
      spread_stat: null,
      over_result: 'Null' as MarketResult,
      under_result: 'Null' as MarketResult,
      total_stat: null,
      moneyline_result: 'Null' as MarketResult,
      moneyline_stat: null,
      teamId: null,
      playerId: `538718-ncaaf`,
      sel_id: 538718,
    },
    {
      id: '57767-236-534184',
      type: 'PP' as MarketType,
      category: 'TD Passes',
      offerId: '57767',
      name: 'JT Daniels',
      teamAbbrev: 'WVU',
      offline: false,
      spread: null,
      spread_odd: null,
      total: 1.5,
      over: -125,
      under: -115,
      moneyline: null,
      spread_bet: null,
      spread_cash: null,
      over_bet: null,
      under_bet: null,
      over_cash: null,
      under_cash: null,
      moneyline_bet: null,
      moneyline_cash: null,
      spread_result: 'Null' as MarketResult,
      spread_stat: null,
      over_result: 'Null' as MarketResult,
      under_result: 'Null' as MarketResult,
      total_stat: null,
      moneyline_result: 'Null' as MarketResult,
      moneyline_stat: null,
      teamId: null,
      playerId: `534184-ncaaf`,
      sel_id: 534184,
    },
    {
      id: '57767-229',
      type: 'GP' as MarketType,
      category: 'Score First',
      offerId: '57767',
      name: 'Baylor',
      teamAbbrev: 'BAYLOR',
      offline: true,
      spread: null,
      spread_odd: null,
      total: 0.5,
      over: -120,
      under: -110,
      moneyline: null,
      spread_bet: null,
      spread_cash: null,
      over_bet: null,
      under_bet: null,
      over_cash: null,
      under_cash: null,
      moneyline_bet: null,
      moneyline_cash: null,
      spread_result: 'Null' as MarketResult,
      spread_stat: null,
      over_result: 'Zero' as MarketResult,
      under_result: 'One' as MarketResult,
      total_stat: null,
      moneyline_result: 'Null' as MarketResult,
      moneyline_stat: null,
      teamId: `1430-ncaaf`,
      playerId: null,
      sel_id: 1430,
    },
    {
      id: '57767-220-533742',
      type: 'PP' as MarketType,
      category: 'Receiving Yards',
      offerId: '57767',
      name: 'Ben Sims',
      teamAbbrev: 'BAYLOR',
      offline: false,
      spread: null,
      spread_odd: null,
      total: 37.5,
      over: -115,
      under: -125,
      moneyline: null,
      spread_bet: null,
      spread_cash: null,
      over_bet: null,
      under_bet: null,
      over_cash: null,
      under_cash: null,
      moneyline_bet: null,
      moneyline_cash: null,
      spread_result: 'Null' as MarketResult,
      spread_stat: null,
      over_result: 'Null' as MarketResult,
      under_result: 'Null' as MarketResult,
      total_stat: null,
      moneyline_result: 'Null' as MarketResult,
      moneyline_stat: null,
      teamId: null,
      playerId: `533742-ncaaf`,
      sel_id: 533742,
    },
    {
      id: '57767-236-539394',
      type: 'PP' as MarketType,
      category: 'TD Passes',
      offerId: '57767',
      name: 'Blake Shapen',
      teamAbbrev: 'BAYLOR',
      offline: false,
      spread: null,
      spread_odd: null,
      total: 1.5,
      over: -135,
      under: -105,
      moneyline: null,
      spread_bet: null,
      spread_cash: null,
      over_bet: null,
      under_bet: null,
      over_cash: null,
      under_cash: null,
      moneyline_bet: null,
      moneyline_cash: null,
      spread_result: 'Null' as MarketResult,
      spread_stat: null,
      over_result: 'Null' as MarketResult,
      under_result: 'Null' as MarketResult,
      total_stat: null,
      moneyline_result: 'Null' as MarketResult,
      moneyline_stat: null,
      teamId: null,
      playerId: `539394-ncaaf`,
      sel_id: 539394,
    },
    {
      id: '57767-220-530898',
      type: 'PP' as MarketType,
      category: 'Receiving Yards',
      offerId: '57767',
      name: 'Sam James',
      teamAbbrev: 'WVU',
      offline: false,
      spread: null,
      spread_odd: null,
      total: 51.5,
      over: -120,
      under: -120,
      moneyline: null,
      spread_bet: null,
      spread_cash: null,
      over_bet: null,
      under_bet: null,
      over_cash: null,
      under_cash: null,
      moneyline_bet: null,
      moneyline_cash: null,
      spread_result: 'Null' as MarketResult,
      spread_stat: null,
      over_result: 'Null' as MarketResult,
      under_result: 'Null' as MarketResult,
      total_stat: null,
      moneyline_result: 'Null' as MarketResult,
      moneyline_stat: null,
      teamId: null,
      playerId: `530898-ncaaf`,
      sel_id: 530898,
    },
  ];
  await prisma.market.createMany({
    data: markets,
  });
  await prisma.bet.create({
    data: {
      id: '1',
      stake: 100,
      status: BetStatus.PENDING,
      owner: {
        connect: {
          id: user?.id,
        },
      },
      payout: 200,
      type: BetType.PARLAY,
      legs: {
        create: {
          id: 'leg1',
          market: {
            connect: {
              id_sel_id: {
                id: markets[0]!.id,
                sel_id: markets[0]!.sel_id,
              },
            },
          },
          type: BetLegType.OVER_ODDS,
          odds: 100,
          total: 100,
          status: BetStatus.PENDING,
        },
      },
      odds: 100,
      ContestEntries: {
        connect: {
          id: contestEntry.id,
        },
      },
      ContestCategory: {
        connect: {
          id: contestCategories[0]!.id,
        },
      },
      stakeType: BetStakeType.ALL_IN,
    },
  });
  await prisma.bet.create({
    data: {
      id: '2',
      stake: 100,
      status: BetStatus.WIN,
      owner: {
        connect: {
          id: user?.id,
        },
      },
      payout: 200,
      type: BetType.PARLAY,
      legs: {
        create: {
          id: 'leg2',
          market: {
            connect: {
              id_sel_id: {
                id: markets[0]!.id,
                sel_id: markets[0]!.sel_id,
              },
            },
          },
          type: BetLegType.OVER_ODDS,
          odds: 100,
          total: 100,
          status: BetStatus.WIN,
        },
      },
      odds: 100,
      ContestEntries: {
        connect: {
          id: contestEntry.id,
        },
      },
      ContestCategory: {
        connect: {
          id: contestCategories[0]!.id,
        },
      },
      stakeType: BetStakeType.ALL_IN,
    },
  });
  await prisma.bet.create({
    data: {
      id: '3',
      stake: 100,
      status: BetStatus.LOSS,
      owner: {
        connect: {
          id: user?.id,
        },
      },
      payout: 200,
      type: BetType.PARLAY,
      legs: {
        create: {
          id: 'leg3',
          market: {
            connect: {
              id_sel_id: {
                id: markets[0]!.id,
                sel_id: markets[0]!.sel_id,
              },
            },
          },
          type: BetLegType.OVER_ODDS,
          odds: 100,
          total: 100,
          status: BetStatus.LOSS,
        },
      },
      odds: 100,
      ContestEntries: {
        connect: {
          id: contestEntry.id,
        },
      },
      ContestCategory: {
        connect: {
          id: contestCategories[0]!.id,
        },
      },
      stakeType: BetStakeType.INSURED,
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
