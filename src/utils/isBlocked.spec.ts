import { ReasonCodes } from '~/lib/tsevo-gidx/ReasonCodes';
import { isBlocked } from './isBlocked';

describe('isBlocked', () => {
  it('should return true when responseReasonCodes contain blocked reason codes', () => {
    const responseReasonCodes: string[] = [
      ReasonCodes.ID_UA18,
      ReasonCodes.ID_BLOCK,
      ReasonCodes.DFP_VPRP,
    ];
    const exemptedReasonCodes: string[] = [];

    const result = isBlocked(responseReasonCodes, exemptedReasonCodes);

    expect(result).toBe(true);
  });

  it('should return false when responseReasonCodes do not contain any blocked reason codes', () => {
    const responseReasonCodes: string[] = [ReasonCodes.ID_VERIFIED];
    const exemptedReasonCodes: string[] = [];

    const result = isBlocked(responseReasonCodes, exemptedReasonCodes);

    expect(result).toBe(false);
  });

  it('should return false when responseReasonCodes are empty', () => {
    const responseReasonCodes: string[] = [];
    const exemptedReasonCodes: string[] = [];

    const result = isBlocked(responseReasonCodes, exemptedReasonCodes);

    expect(result).toBe(false);
  });

  it('should return false when exemptedReasonCodes contain a blocked reason code', () => {
    const responseReasonCodes: string[] = [ReasonCodes.ID_WL];
    const exemptedReasonCodes: string[] = [ReasonCodes.ID_WL];

    const result = isBlocked(responseReasonCodes, exemptedReasonCodes);

    expect(result).toBe(false);
  });

  it('should return true when exemptedReasonCodes contain a blocked reason code but not same as responseReasonCodes', () => {
    const responseReasonCodes: string[] = [
      ReasonCodes.ID_WL,
      ReasonCodes.ID_AGE_UNKN,
    ];
    const exemptedReasonCodes: string[] = [ReasonCodes.ID_AGE_UNKN];

    const result = isBlocked(responseReasonCodes, exemptedReasonCodes);

    expect(result).toBe(true);
  });

  it('should return false when exemptedReasonCodes contain a blocked reason code and no responseReasonCodes', () => {
    const responseReasonCodes: string[] = [];
    const exemptedReasonCodes: string[] = [ReasonCodes.ID_AGE_UNKN];

    const result = isBlocked(responseReasonCodes, exemptedReasonCodes);

    expect(result).toBe(false);
  });

  it('should return true when responseReasonCodes contain a blocked reason code and is verified user', () => {
    const responseReasonCodes: string[] = [
      ReasonCodes.ID_WL,
      ReasonCodes.ID_VERIFIED,
    ];
    const exemptedReasonCodes: string[] = [];

    const result = isBlocked(responseReasonCodes, exemptedReasonCodes);

    expect(result).toBe(true);
  });
});
