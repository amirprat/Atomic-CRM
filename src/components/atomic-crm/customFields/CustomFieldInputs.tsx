import { required, useRecordContext } from "ra-core";
import { useFormContext, useWatch } from "react-hook-form";
import { ArrayInput } from "@/components/admin/array-input";
import { BooleanInput } from "@/components/admin/boolean-input";
import { NumberInput } from "@/components/admin/number-input";
import { SelectInput } from "@/components/admin/select-input";
import { SimpleFormIterator } from "@/components/admin/simple-form-iterator";
import { TextInput } from "@/components/admin/text-input";

import { toSlug } from "@/lib/toSlug";
import type { CustomFieldDefinition } from "../types";

const ENTITY_CHOICES = [
  { id: "contact", name: "Contact" },
  { id: "deal", name: "Deal" },
];

const FIELD_TYPE_CHOICES = [
  { id: "text", name: "Text" },
  { id: "textarea", name: "Long text" },
  { id: "number", name: "Number" },
  { id: "boolean", name: "Yes / No" },
  { id: "date", name: "Date" },
  { id: "url", name: "URL" },
  { id: "select", name: "Select (pick from list)" },
];

export const CustomFieldInputs = () => {
  const record = useRecordContext<CustomFieldDefinition>();
  const { setValue } = useFormContext();
  const label = useWatch({ name: "label" });
  const fieldKey = useWatch({ name: "field_key" });
  const fieldType = useWatch({ name: "field_type" });

  // Auto-fill field_key from label when creating a new field
  const handleLabelBlur = () => {
    if (!record && label && !fieldKey) {
      setValue("field_key", toSlug(label).replace(/-/g, "_"));
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SelectInput
          source="entity_type"
          label="Attach to"
          choices={ENTITY_CHOICES}
          optionText="name"
          validate={required()}
          helperText={false}
          defaultValue="contact"
          readOnly={!!record}
        />
        <SelectInput
          source="field_type"
          label="Field type"
          choices={FIELD_TYPE_CHOICES}
          optionText="name"
          validate={required()}
          helperText={false}
          defaultValue="text"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextInput
          source="label"
          validate={required()}
          helperText="What users see, e.g. 'Pool depth (feet)'"
          onBlur={handleLabelBlur}
        />
        <TextInput
          source="field_key"
          validate={required()}
          helperText="Stable internal key, e.g. 'pool_depth_feet' (lowercase, underscores)"
          readOnly={!!record}
        />
      </div>

      <NumberInput
        source="display_order"
        defaultValue={0}
        helperText="Lower numbers appear first"
        min={0}
        step={1}
      />

      <TextInput
        source="options.helperText"
        label="Helper text (optional)"
        helperText="Shown under the field in the form"
      />

      {fieldType === "select" && (
        <div>
          <h3 className="text-base font-medium mb-2">Choices</h3>
          <ArrayInput source="options.choices" helperText={false}>
            <SimpleFormIterator inline disableReordering>
              <TextInput
                source="label"
                label="Label"
                helperText={false}
              />
              <TextInput
                source="value"
                label="Stored value"
                helperText={false}
              />
            </SimpleFormIterator>
          </ArrayInput>
        </div>
      )}

      <BooleanInput
        source="active"
        defaultValue={true}
        label="Active (visible on the form)"
        helperText={false}
      />
    </div>
  );
};
