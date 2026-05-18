import { useGetList } from "ra-core";
import { BooleanInput } from "@/components/admin/boolean-input";
import { DateInput } from "@/components/admin/date-input";
import { NumberInput } from "@/components/admin/number-input";
import { SelectInput } from "@/components/admin/select-input";
import { TextInput } from "@/components/admin/text-input";

import type { CustomFieldDefinition, CustomFieldEntityType } from "../types";

type Props = {
  entityType: CustomFieldEntityType;
  heading?: string;
};

/**
 * Renders form inputs for every active custom field definition for the given
 * entity type. Values are bound to record.custom_fields.<field_key>.
 *
 * Defining a new field in Settings → Custom Fields automatically makes it appear
 * here — no code changes needed.
 */
export const DynamicCustomFields = ({
  entityType,
  heading = "Custom fields",
}: Props) => {
  const { data: defs = [], isPending } = useGetList<CustomFieldDefinition>(
    "custom_field_definitions",
    {
      filter: { entity_type: entityType, active: true },
      sort: { field: "display_order", order: "ASC" },
      pagination: { page: 1, perPage: 200 },
    },
  );

  if (isPending) return null;
  if (defs.length === 0) return null;

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-base font-medium">{heading}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {defs.map((d) => (
          <CustomFieldInput key={d.id} def={d} />
        ))}
      </div>
    </div>
  );
};

const CustomFieldInput = ({ def }: { def: CustomFieldDefinition }) => {
  const source = `custom_fields.${def.field_key}`;
  const helperText = def.options?.helperText ?? false;

  switch (def.field_type) {
    case "number":
      return (
        <NumberInput source={source} label={def.label} helperText={helperText} />
      );
    case "boolean":
      return (
        <BooleanInput
          source={source}
          label={def.label}
          helperText={helperText}
        />
      );
    case "date":
      return (
        <DateInput source={source} label={def.label} helperText={helperText} />
      );
    case "select": {
      const choices = (def.options?.choices ?? []).map((c) => ({
        id: c.value,
        name: c.label,
      }));
      return (
        <SelectInput
          source={source}
          label={def.label}
          choices={choices}
          optionText="name"
          optionValue="id"
          helperText={helperText}
        />
      );
    }
    case "textarea":
      return (
        <TextInput
          source={source}
          label={def.label}
          multiline
          rows={3}
          helperText={helperText}
        />
      );
    case "url":
    case "text":
    default:
      return (
        <TextInput source={source} label={def.label} helperText={helperText} />
      );
  }
};
