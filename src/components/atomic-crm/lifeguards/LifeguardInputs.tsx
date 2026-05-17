import { email, required } from "ra-core";
import { ArrayInput } from "@/components/admin/array-input";
import { BooleanInput } from "@/components/admin/boolean-input";
import { DateInput } from "@/components/admin/date-input";
import { NumberInput } from "@/components/admin/number-input";
import { SimpleFormIterator } from "@/components/admin/simple-form-iterator";
import { TextInput } from "@/components/admin/text-input";
import { Separator } from "@/components/ui/separator";
import { useIsMobile } from "@/hooks/use-mobile";

export const LifeguardInputs = () => {
  const isMobile = useIsMobile();
  return (
    <div className="flex flex-col gap-2 p-1">
      <div className="flex gap-10 md:gap-6 flex-col md:flex-row">
        <div className="flex flex-col gap-10 flex-1">
          <LifeguardIdentityInputs />
          <LifeguardContactInputs />
        </div>
        {isMobile ? null : (
          <Separator orientation="vertical" className="flex-shrink-0" />
        )}
        <div className="flex flex-col gap-10 flex-1">
          <LifeguardWorkInputs />
          <LifeguardCertificationsInputs />
        </div>
      </div>
    </div>
  );
};

const LifeguardIdentityInputs = () => (
  <div className="flex flex-col gap-4">
    <h6 className="text-lg font-semibold">Identity</h6>
    <TextInput source="first_name" validate={required()} helperText={false} />
    <TextInput source="last_name" validate={required()} helperText={false} />
    <BooleanInput
      source="active"
      label="Active (available for allocation)"
      defaultValue={true}
      helperText={false}
    />
  </div>
);

const LifeguardContactInputs = () => (
  <div className="flex flex-col gap-4">
    <h6 className="text-lg font-semibold">Contact</h6>
    <TextInput source="email" validate={email()} helperText={false} />
    <TextInput source="phone" helperText={false} />
  </div>
);

const LifeguardWorkInputs = () => (
  <div className="flex flex-col gap-4">
    <h6 className="text-lg font-semibold">Work</h6>
    <NumberInput
      source="hourly_rate_cents"
      label="Hourly rate (cents)"
      helperText="e.g. 4500 = $45/hr"
      min={0}
      step={100}
    />
    <ArrayInput
      source="regions"
      helperText="Geographic regions this lifeguard can work in"
    >
      <SimpleFormIterator inline disableReordering>
        <TextInput source="" label="Region" helperText={false} />
      </SimpleFormIterator>
    </ArrayInput>
    <TextInput source="notes" multiline rows={3} helperText={false} />
  </div>
);

const LifeguardCertificationsInputs = () => (
  <div className="flex flex-col gap-4">
    <h6 className="text-lg font-semibold">Certifications</h6>
    <ArrayInput source="certifications" helperText={false}>
      <SimpleFormIterator
        inline
        disableReordering
        className="[&>ul>li]:border-b-0 [&>ul>li]:pb-0"
      >
        <TextInput
          source="type"
          label="Type"
          placeholder="Lifeguard / CPR / WSI"
          helperText={false}
        />
        <DateInput source="expires" label="Expires" helperText={false} />
      </SimpleFormIterator>
    </ArrayInput>
  </div>
);
