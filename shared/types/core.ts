import * as v from 'valibot'
// type UUID = string

export const UuidStringSchema = v.pipe(v.string(), v.uuid())

export const SingleUuidRouteSchema = v.object({ id: UuidStringSchema })

