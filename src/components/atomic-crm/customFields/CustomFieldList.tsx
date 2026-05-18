import { useRecordContext } from "ra-core";
import { CreateButton } from "@/components/admin/create-button";
import { DataTable } from "@/components/admin/data-table";
import { List } from "@/components/admin/list";
import { SearchInput } from "@/components/admin/search-input";
import { Badge } from "@/components/ui/badge";

import { TopToolbar } from "../layout/TopToolbar";
import type { CustomFieldDefinition } from "../types";

const FIELD_TYPE_LABEL: Record<string, string> = {
  text: "Text",
  textarea: "Long text",
  number: "Number",
  boolean: "Yes / No",
  date: "Date",
  url: "URL",
  select: "Select",
};

const ListActions = () => (
  <TopToolbar>
    <CreateButton label="New custom field" />
  </TopToolbar>
);

const filters = [<SearchInput key="q" source="q" alwaysOn />];

const EntityTypeField = (_props: { label?: string | boolean }) => {
  const record = useRecordContext<CustomFieldDefinition>();
  if (!record) return null;
  return (
    <Badge variant="outline" className="capitalize">
      {record.entity_type}
    </Badge>
  );
};

const FieldTypeField = (_props: { label?: string | boolean }) => {
  const record = useRecordContext<CustomFieldDefinition>();
  if (!record) return null;
  return (
    <span className="text-sm">{FIELD_TYPE_LABEL[record.field_type]}</span>
  );
};

const ActiveField = (_props: { label?: string | boolean }) => {
  const record = useRecordContext<CustomFieldDefinition>();
  if (!record) return null;
  return record.active ? (
    <Badge
      variant="outline"
      className="border-green-300 dark:border-green-700"
    >
      Active
    </Badge>
  ) : (
    <Badge
      variant="outline"
      className="border-zinc-300 dark:border-zinc-700"
    >
      Inactive
    </Badge>
  );
};

export const CustomFieldList = () => (
  <List
    filters={filters}
    actions={<ListActions />}
    sort={{ field: "display_order", order: "ASC" }}
    perPage={50}
  >
    <DataTable rowClick="edit">
      <DataTable.Col label="Entity">
        <EntityTypeField />
      </DataTable.Col>
      <DataTable.Col source="label" />
      <DataTable.Col source="field_key" label="Internal key" />
      <DataTable.Col label="Type">
        <FieldTypeField />
      </DataTable.Col>
      <DataTable.Col source="display_order" label="Order" />
      <DataTable.Col label={false}>
        <ActiveField />
      </DataTable.Col>
    </DataTable>
  </List>
);
