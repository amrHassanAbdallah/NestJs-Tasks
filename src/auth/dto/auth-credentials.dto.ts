import { IsString, MinLength, MaxLength, Matches } from "class-validator";
import { ApiModelProperty } from '@nestjs/swagger';

export class AuthCredentialsDto{
    @ApiModelProperty()
    @IsString()
    @MinLength(4)
    @MaxLength(20)
    username:string;

    @ApiModelProperty()
    @IsString()
    @MinLength(8)
    @MaxLength(30)
    @Matches(
        /((?=.*\d)|(?=.*\W+)(?![.\n])(?=.*[A-Z])(?=.*[a-z])).*$/,
        {message: `Password is too weak!`}
    )
    password:string;
}