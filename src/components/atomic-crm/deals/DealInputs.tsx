import { required, useRecordContext, useTranslate } from "ra-core";
import { AutocompleteArrayInput } from "@/components/admin/autocomplete-array-input";
import { ReferenceArrayInput } from "@/components/admin/reference-array-input";
import { ReferenceInput } from "@/components/admin/reference-input";
import { TextInput } from "@/components/admin/text-input";
import { NumberInput } from "@/components/admin/number-input";
import { DateInput } from "@/components/admin/date-input";
import { SelectInput } from "@/components/admin/select-input";
import { Separator } from "@/components/ui/separator";
import { useIsMobile } from "@/hooks/use-mobile";

import { contactOptionText } from "../misc/ContactOption";
import { useConfigurationContext } from "../root/ConfigurationContext";
import { AutocompleteCompanyInput } from "../companies/AutocompleteCompanyInput.tsx";
import type { Deal, Lifeguard, Sale } from "../types";
import { DealLifeguardsSection } from "./DealLifeguardsSection";
import { DynamicCustomFields } from "../customFields/DynamicCustomFields";

export const DealInputs = () => {
  const isMobile = useIsMobile();
  const record = useRecordContext<Deal>();
  return (
    <div className="flex flex-col gap-8">
      <DealInfoInputs />

      <div className={`flex gap-6 ${isMobile ? "flex-col" : "flex-row"}`}>
        <DealLinkedToInputs />
        <Separator orientation={isMobile ? "horizontal" : "vertical"} />
        <DealMiscInputs />
      </div>

      <DealStaffingInputs />

      <DynamicCustomFields entityType="deal" />

      {record?.id ? (
        <div className="flex flex-col gap-3">
          <h3 className="text-base font-medium">Lifeguards on this deal</h3>
          <DealLifeguardsSection dealId={record.id} />
        </div>
      ) : (
        <p className="text-xs text-muted-foreground">
          Lifeguards can be assigned after the deal is saved.
        </p>
      )}
    </div>
  );
};

const DealInfoInputs = () => {
  return (
    <div className="flex flex-col gap-4 flex-1">
      <TextInput source="name" validate={required()} helperText={false} />
      <TextInput source="description" multiline rows={3} helperText={false} />
    </div>
  );
};

const DealLinkedToInputs = () => {
  const translate = useTranslate();
  return (
    <div className="flex flex-col gap-4 flex-1">
      <h3 className="text-base font-medium">
        {translate("resources.deals.inputs.linked_to")}
      </h3>
      <ReferenceInput source="company_id" reference="companies">
        <AutocompleteCompanyInput
          label="resources.deals.fields.company_id"
          validate={required()}
          modal
        />
      </ReferenceInput>

      <ReferenceArrayInput source="contact_ids" reference="contacts_summary">
        <AutocompleteArrayInput
          label="resources.deals.fields.contact_ids"
          optionText={contactOptionText}
          helperText={false}
        />
      </ReferenceArrayInput>
    </div>
  );
};

const DealMiscInputs = () => {
  const { dealStages, dealCategories } = useConfigurationContext();
  const translate = useTranslate();
  return (
    <div className="flex flex-col gap-4 flex-1">
      <h3 className="text-base font-medium">
        {translate("resources.deals.field_categories.misc")}
      </h3>

      <SelectInput
        source="category"
        choices={dealCategories}
        optionText="label"
        optionValue="value"
        helperText={false}
      />
      <NumberInput
        source="amount"
        defaultValue={0}
        helperText={false}
        validate={required()}
      />
      <DateInput
        validate={required()}
        source="expected_closing_date"
        helperText={false}
        defaultValue={new Date().toISOString().split("T")[0]}
      />
      <SelectInput
        source="stage"
        choices={dealStages}
        optionText="label"
        optionValue="value"
        defaultValue="opportunity"
        helperText={false}
        validate={required()}
      />
    </div>
  );
};

const saleOptionText = (choice: Sale) =>
  `${choice.first_name} ${choice.last_name}`;

const lifeguardOptionText = (choice: Lifeguard) =>
  `${choice.first_name} ${choice.last_name}`;

const DealStaffingInputs = () => (
  <div className="flex flex-col gap-4">
    <h3 className="text-base font-medium">Staffing</h3>
    <p className="text-xs text-muted-foreground -mt-2">
      A deal can have a supervisor from either staff or the lifeguard roster,
      but not both.
    </p>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <ReferenceInput
        source="supervisor_sales_id"
        reference="sales"
        sort={{ field: "last_name", order: "ASC" }}
        filter={{ "disabled@neq": true }}
      >
        <SelectInput
          label="Supervisor (staff)"
          optionText={saleOptionText}
          helperText={false}
        />
      </ReferenceInput>
      <ReferenceInput
        source="supervisor_lifeguard_id"
        reference="lifeguards"
        sort={{ field: "last_name", order: "ASC" }}
        filter={{ active: true }}
      >
        <SelectInput
          label="Supervisor (lifeguard)"
          optionText={lifeguardOptionText}
          helperText={false}
        />
      </ReferenceInput>
    </div>
  </div>
);
