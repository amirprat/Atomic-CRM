import type { Lifeguard } from "../types";
import { LifeguardCreate } from "./LifeguardCreate";
import { LifeguardEdit } from "./LifeguardEdit";
import { LifeguardList } from "./LifeguardList";
import { LifeguardShow } from "./LifeguardShow";

export default {
  list: LifeguardList,
  show: LifeguardShow,
  edit: LifeguardEdit,
  create: LifeguardCreate,
  recordRepresentation: (record: Lifeguard) =>
    `${record.first_name} ${record.last_name}`,
};
