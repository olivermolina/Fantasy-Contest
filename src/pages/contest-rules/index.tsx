import React from 'react';
import LandingLayout from '~/components/LandingLayout';
import { Header } from '~/components';

const IndexPage = () => {
  return (
    <LandingLayout
      customHeader={
        <Header>
          <meta
            name="description"
            content={`More or Less is exactly how it sounds. You select from 2 to 5 players and determine if they’re going to end up scoring more or less than the stat value selected. This is considered a Pick and can be found on the Pick tab after your selection is made. (e.g if you believe Patrick Mahomes will throw for more than 300 yards, you would choose More).`}
          />
        </Header>
      }
    >
      <div className="flex justify-center items-center p-2 h-full w-full text-justify">
        <div className={'flex flex-col gap-8 max-w-screen-xl p-4'}>
          <div className={'flex flex-col gap-4'}>
            <h1
              className={'text-2xl lg:text-3xl font-bold underline text-center'}
            >
              Contest Rules
            </h1>
            <p>
              <span className={'font-semibold text-lg lg:text-xl'}>
                More or Less:
              </span>
              <ul className="list-disc pl-10 space-y-4 pt-4">
                <li>
                  More or Less is exactly how it sounds. You select from 2 to 5
                  players and determine if they’re going to end up scoring more
                  or less than the stat value selected. This is considered a
                  Pick and can be found on the Pick tab after your selection is
                  made. (e.g if you believe Patrick Mahomes will throw for more
                  than 300 yards, you would choose More)
                </li>
                <li>
                  The payout structure for winning entries is below. You need to
                  win all your selections for your entry to be graded a win
                  <ul
                    className={
                      'list-disc list-outside pl-10 mt-4 marker:text-gray-400 space-y-4'
                    }
                  >
                    <li>2 players- 3x payout</li>
                    <li>3 players- 5x payout</li>
                    <li>4 players- 10x payout</li>
                    <li>5 players- 20x payout</li>
                  </ul>
                </li>
              </ul>
            </p>
            <div>
              <p>
                Insurance payouts are made to minimize your risk. Those payouts
                are below.
              </p>
              <div className={'pl-2'}>
                <ul className="list-disc pl-10 space-y-4 pt-4">
                  <li>
                    Entries with a tie/void revert down to the next closest
                    entry:
                    <ul
                      className={
                        'list-disc list-outside pl-10 mt-4 marker:text-gray-400 space-y-4'
                      }
                    >
                      <li>
                        5-pick Insurance Entry (10x) → 4-pick Insurance Entry
                        (6x)
                      </li>
                      <li>
                        4-pick Insurance Entry (6x) → 3-pick Insurance Entry
                        (3x)
                      </li>
                      <li>
                        3-pick Insurance Entry (3x) → 2-pick Standard Entry (3x)
                      </li>
                    </ul>
                  </li>
                  <li>
                    The following are the payouts associated with Insured
                    entries with 1 losing selection:
                    <ul
                      className={
                        'list-disc list-outside pl-10 mt-4 marker:text-gray-400 space-y-4'
                      }
                    >
                      <li>5-pick Insurance Entry with 1 loss: 2.5x</li>
                      <li>4-pick Insurance Entry with 1 loss: 1.5x</li>
                      <li>3-pick Insurance Entry with 1 loss: 1x</li>
                    </ul>
                  </li>
                </ul>
              </div>
            </div>

            <div className={'space-y-4 mt-4'}>
              <p className={'font-semibold text-lg lg:text-xl'}>
                Weekly/Daily Token Contests:
              </p>
              <p>
                Every user pays an entry fee or enters for free depending on the
                contest selected. Each user is assigned 1000 tokens after they
                enter. The goal of the contest is taking those tokens and
                winning the most picks to rank up on the leaderboards and win
                cash prizes.
                <ul className="list-disc pl-10 space-y-4 pt-4">
                  <li>
                    You place your tokens on any player stats you want exactly
                    like “More or Less”. You select more or less of a player’s
                    stat then place any amount of tokens you wish.
                  </li>
                  <li>
                    You need to win all your selections for the pick to be
                    graded a win
                  </li>
                  <li>The payout for tokens is below.</li>
                </ul>
              </p>
              <p>1 player- 1x payout ( Place 10 tokens you get 10 tokens)</p>
              <p>2 players- 3x payout</p>
              <p>3 players- 5x payout</p>
              <p>4 players- 10x payout</p>
              <p>
                5 players- 20x payout
                <ul className="list-disc pl-10 space-y-4 pt-4">
                  <li>
                    The player with the most tokens wins the contest. Example:
                    Aaron wins all his picks and ends up with 2500 tokens, Alden
                    wins some picks and ends up with 1250 tokens, and Sam wins
                    some picks and ends up with 1150 tokens. Aaron came in 1st
                    place and will receive the 1st place payout, Alden 2nd and
                    Sam 3rd.
                  </li>
                </ul>
              </p>
            </div>
            <div className={'space-y-4 mt-4'}>
              <p className={'font-semibold text-lg lg:text-xl'}>
                General Questions:
              </p>
              <ul className="list-disc pl-10 space-y-4 pt-2">
                <li>
                  What happens if a game is cancelled, postponed, or
                  rescheduled?
                  <p>
                    If a game is cancelled, postponed, or rescheduled, players
                    that are on involved in those games will be voided/pushed
                    from your entry. If all player’s selected were scheduled to
                    play in a game that is cancelled, your entry will be
                    refunded. • What happens if there are stat corrections after
                    my contest is complete? We rely on our 3rd party data
                    provider to grade all picks. Whatever is graded is final.
                  </p>
                </li>
                <li>
                  What happens if there are stat corrections after my contest is
                  complete?
                  <p>
                    We rely on our 3rd party data provider to grade all picks.
                    Whatever is graded is final.
                  </p>
                </li>
                <li>
                  What happens for a tie/pushed pick?
                  <p>
                    In a More or Less contest, if an athlete ties their
                    projected point/stat value, that pick will be cancelled and
                    removed from the contest. It will be settled as if the
                    player was not active in the game.
                    <br />
                    Example: In the event a pick is pushed and the entry is
                    still valid, if another pick lost, the entry will be graded
                    as a loss. In the event a pick is pushed and the entry is
                    still valid where all other picks won, the entry will be
                    graded as a win but will pay out for the amount of active
                    players. For example, for an entry of Lamar Jackson (win),
                    Jonathan Taylor (win), and Christian McCaffrey (push), the
                    entry would win, but the payout would be calculated as if
                    the entry was a pick 2 instead of 3.
                  </p>
                </li>
                <li>
                  What happens if my selected player’s game goes into overtime?
                  <p>
                    Overtime statistics are included in all full event contests.
                    In partial game contests (H1 or H2) overtime statistics are
                    excluded and will not be counted.
                  </p>
                </li>
                <li>
                  How do I delete my contest entry?
                  <p>
                    We’re working on creating a delete entry button on the picks
                    page. This will be available as long as it’s within 1 hour
                    of your entry and 15 minutes before game time.
                  </p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </LandingLayout>
  );
};

export default IndexPage;
