import { JwtPayload } from 'jsonwebtoken';
import {
  ExtractJwt,
  Strategy
} from 'passport-jwt';
import { UserJwtPayload } from 'src/interfaces/jwt-payload.interface';

import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import { jwtConstants } from '../constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret
    });
  }

  async validate(payload: JwtPayload): Promise<UserJwtPayload> {
    return { sub: payload.sub, email: payload.email };
  }
}
