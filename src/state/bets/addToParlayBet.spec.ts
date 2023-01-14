import { handleBetLegModification } from './addToParlayBet';
import { removeOldBetMock } from './addToParlayBet/__mocks__/addParlayBetModel';

describe('addToParlayBet', () => {
  it('should remove a bet leg when the user has double clicked on a previously selected option', () => {
    const removeBetLegFromParlayMock = jest.fn();
    const overwritePreviousBetLegMock = jest.fn();

    handleBetLegModification(
      removeOldBetMock.bet,
      removeOldBetMock.parlayBet,
      removeBetLegFromParlayMock,
      overwritePreviousBetLegMock,
      jest.fn(),
    );

    expect(removeBetLegFromParlayMock).toHaveBeenCalledWith({
      betId: '960',
      betLegName: 'Isiah Pacheco',
    });
  });

  it('should overwrite the old leg with the new input that the user has updated', () => {
    const removeBetLegFromParlayMock = jest.fn();
    const overwritePreviousBetLegMock = jest.fn();
    const updateBetLegsMock = jest.fn();

    // mimics user changing the bet type
    const betInput = { ...removeOldBetMock.bet };
    betInput.team = 'under';

    handleBetLegModification(
      betInput,
      removeOldBetMock.parlayBet,
      removeBetLegFromParlayMock,
      overwritePreviousBetLegMock,
      updateBetLegsMock,
    );

    expect(overwritePreviousBetLegMock).toHaveBeenCalledWith(betInput);
    expect(updateBetLegsMock.mock.calls[0].length).toBe(1);
  });
});
