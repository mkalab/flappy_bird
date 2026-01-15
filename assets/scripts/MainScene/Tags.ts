import { Enum } from 'cc';

export enum Tags {
    None = 0,

    Player = 1,
    Ground = 2,
    Pipe = 3,
    Scoring = 4,
    UI = 7,

}
export const TagsEnum = Enum(Tags);