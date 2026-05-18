import { useGetList, useRecordContext } from "ra-core";
import { Badge } from "@/components/ui/badge";

import type {
  CustomFieldDefinition,
  CustomFieldEntityType,
} from "../types";

type Props = {
  entityType: CustomFieldEntityType;
  heading?: string;
};

/**
 * Read-only display of custom field values for a record. Skips fields that
 * have no value on this record.
 */
export const DynamicCustomFieldsDisplay = ({
  entityType,
  heading = "Custom fields",
}: Props) => {
  const record = useRecordContext<{
    custom_fields?: Record<string, unknown>;
  }>();
  const { data: defs = [] } = useGetList<CustomFieldDefinition>(
    "custom_field_definitions",
    {
      filter: { entity_type: entityType, active: true },
      sort: { field: "display_order", order: "ASC" },
      pagination: { page: 1, perPage: 200 },
    },
  );

  if (!record) return null;
  const values = record.custom_fields ?? {};

  // Only show fields that have a meaningful value on this record
  const populated = defs.filter((d) => {
    const v = values[d.field_key];
    return v !== undefined && v !== null && v !== "" && v !== false;
  });

  if (populated.length === 0) return null;

  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-xs uppercase tracking-wide text-muted-foreground">
        {heading}
      </h3>
      <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
        {populated.map((d) => (
          <div key={d.id}>
            <dt className="text-xs text-muted-foreground">{d.label}</dt>
            <dd className="text-sm">
              <FieldValue def={d} value={values[d.field_key]} />
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
};

const FieldValue = ({
  def,
  value,
}: {
  def: CustomFieldDefinition;
  value: unknown;
}) => {
  if (def.field_type === "boolean") {
    return value ? (
      <Badge variant="outline" className="border-green-300 dark:border-green-700">
        Yes
      </Badge>
    ) : (
      <Badge variant="outline" className="border-zinc-300 dark:border-zinc-700">
        No
      </Badge>
    );
  }
  if (def.field_type === "url" && typeof value === "string" && value) {
    return (
      <a
        href={value}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:underline"
      >
        {value}
      </a>
    );
  }
  if (def.field_type === "select") {
    const choice = def.options?.choices?.find(
      (c) => c.value === String(value),
    );
    return <span>{choice?.label ?? String(value)}</span>;
  }
  if (def.field_type === "date" && typeof value === "string" && value) {
    return <span>{value}</span>;
  }
  return <span className="whitespace-pre-line">{String(value)}</span>;
};
