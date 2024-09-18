import { SetMetadata } from '@nestjs/common';
import { RESPONSE_TYPE, STANDARD_RESPONSE_TYPE_KEY } from '../constants';

const SetApiResponseType = (type: RESPONSE_TYPE) =>
  SetMetadata(STANDARD_RESPONSE_TYPE_KEY, type);

export const RawResponse = () => SetApiResponseType(RESPONSE_TYPE.RAW);
