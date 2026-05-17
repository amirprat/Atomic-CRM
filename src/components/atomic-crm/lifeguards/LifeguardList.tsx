import { useRecordContext } from "ra-core";
import { CreateButton } from "@/components/admin/create-button";
import { DataTable } from "@/components/admin/data-table";
import { ExportButton } from "@/components/admin/export-button";
import { List } from "@/components/admin/list";
import { SearchInput } from "@/components/admin/search-input";
import { Badge } from "@/components/ui/badge";

import { TopToolbar } from "../layout/TopToolbar";
import type { Lifeguard } from "../types";

const LifeguardListActions = () => (
  <TopToolbar>
    <ExportButton />
    <CreateButton label="New lifeguard" />
  </TopToolbar>
);

const filters = [<SearchInput key="q" source="q" alwaysOn />];

const RateField = (_props: { label?: string | boolean }) => {
  const record = useRecordContext<Lifeguard>();
  if (!record?.hourly_rate_cents) return null;
  return <span>${(record.hourly_rate_cents / 100).toFixed(2)}/hr</span>;
};

const RegionsField = (_props: { label?: string | boolean }) => {
  const record = useRecordContext<Lifeguard>();
  if (!record?.regions?.length) return null;
  return (
    <div className="flex flex-row gap-1 flex-wrap">
      {record.regions.map((r) => (
        <Badge key={r} variant="outline">
          {r}
        </Badge>
      ))}
    </div>
  );
};

const ActiveField = (_props: { label?: string | boolean }) => {
  const record = useRecordContext<Lifeguard>();
  if (!record) return null;
  return record.active ? (
    <Badge variant="outline" className="border-green-300 dark:border-green-700">
      Active
    </Badge>
  ) : (
    <Badge variant="outline" className="border-zinc-300 dark:border-zinc-700">
      Inactive
    </Badge>
  );
};

export function LifeguardList() {
  return (
    <List
      filters={filters}
      actions={<LifeguardListActions />}
      sort={{ field: "last_name", order: "ASC" }}
    >
      <DataTable>
        <DataTable.Col source="first_name" />
        <DataTable.Col source="last_name" />
        <DataTable.Col source="email" />
        <DataTable.Col source="phone" />
        <DataTable.Col label="Rate">
          <RateField />
        </DataTable.Col>
        <DataTable.Col label="Regions">
          <RegionsField />
        </DataTable.Col>
        <DataTable.Col label={false}>
          <ActiveField />
        </DataTable.Col>
      </DataTable>
    </List>
  );
}
