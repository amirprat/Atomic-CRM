import type { CustomFieldDefinition } from "../types";
import { CustomFieldCreate } from "./CustomFieldCreate";
import { CustomFieldEdit } from "./CustomFieldEdit";
import { CustomFieldList } from "./CustomFieldList";

export default {
  list: CustomFieldList,
  create: CustomFieldCreate,
  edit: CustomFieldEdit,
  recordRepresentation: (record: CustomFieldDefinition) => record.label,
};
