import { ArgumentMetadata, Injectable, PipeTransform, BadRequestException } from '@nestjs/common';
import { isValidObjectId } from 'mongoose';

@Injectable()
export class ParseMongoIdPipe implements PipeTransform {

  transform(value: string, metadata: ArgumentMetadata) {

    if (!isValidObjectId(value)) {
      throw new BadRequestException(` ${value} is not a valid MongoId`);
    }
    return value;
  }
}



// console.log({ value, metadata })
// {
//   value: 'torti',
//     metadata: { metatype: [Function: String], type: 'param', data: 'id' }
// }
