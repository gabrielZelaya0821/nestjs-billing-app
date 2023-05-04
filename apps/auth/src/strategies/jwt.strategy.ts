import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UsersService } from "../users/users.service";
import { ConfigService } from "@nestjs/config";
import { TokenPayLoad } from "../auth.service";
import { Types } from "mongoose";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly usersService: UsersService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: any) => {
          return request?.Authentication;
        }
      ]),
      secretOrKey: configService.get('JWT_SECRET')
    });
  }

  async validate({ userId }: TokenPayLoad) {
    try {
      return await this.usersService.getUser({
        _id: new Types.ObjectId(userId)
      });
    }catch(err) {
      throw new UnauthorizedException();
    }
  }
}