import { S2Manager } from "./S2Manager";
import {uid} from "quasar";
import {Point} from "@turf/turf";
export function getLocationEntity(point: Point, title: string) {
  const geohash = S2Manager.generateGeohash(point);
  const hashKey = S2Manager.generateHashKey(geohash, 6);
  const geoJson = JSON.stringify({
    type: "Point",
    coordinates: [point.coordinates[1], point.coordinates[0]],
  });
  const rangeKey = uid();
  return {
      hashKey: hashKey.toNumber(),
      rangeKey,
      geohash: geohash.toNumber(),
      title,
      geoJson
  }
}
