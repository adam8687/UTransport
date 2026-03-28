import {RideRequest, RideType, RideStatus} from '../src/types/RideRequest';

describe('RideRequest', () => {
  it('should create a valid RideRequest object', () => {
    const request: RideRequest = {
      requestId: 'req-123',
      studentEID: 'abc1234',
      pickupLocation: 'UT Tower',
      dropoffLocation: 'Jester West',
      type: RideType.SureWalk,
      status: RideStatus.Waiting,
      timestamp: new Date('2026-03-28T12:00:00Z'),
    };

    expect(request.requestId).toBe('req-123');
    expect(request.studentEID).toBe('abc1234');
    expect(request.pickupLocation).toBe('UT Tower');
    expect(request.dropoffLocation).toBe('Jester West');
    expect(request.type).toBe('SureWalk');
    expect(request.status).toBe('waiting');
    expect(request.timestamp).toEqual(new Date('2026-03-28T12:00:00Z'));
  });

  it('should support all RideType values', () => {
    expect(RideType.SureWalk).toBe('SureWalk');
    expect(RideType.Medical).toBe('Medical');
    expect(RideType.PTS).toBe('PTS');
  });

  it('should support all RideStatus values', () => {
    expect(RideStatus.Waiting).toBe('waiting');
    expect(RideStatus.Accepted).toBe('accepted');
    expect(RideStatus.Arrived).toBe('arrived');
  });
});
