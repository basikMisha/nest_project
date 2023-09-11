/* eslint-disable prettier/prettier */
import { ApiProperty } from "@nestjs/swagger"
import { IsNumber, IsString } from "class-validator"

export class CreateAssetResponce {
    @ApiProperty()
    @IsNumber()
    user: number

    @ApiProperty()
    @IsString()
    name: string

    @ApiProperty()
    @IsString()
    assetId: string
}

export class GetUserAssetsResponce {
    @ApiProperty()
    @IsNumber()
    id: number

    @ApiProperty()
    @IsString()
    name: string

    @ApiProperty()
    @IsString()
    assetId: string

    @ApiProperty()
    @IsString()
    createdAt: string

    @ApiProperty()
    @IsString()
    updatedAt: string

    @ApiProperty()
    @IsNumber()
    user: number
}
