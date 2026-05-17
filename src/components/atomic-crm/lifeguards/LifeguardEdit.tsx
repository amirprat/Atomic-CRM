import {
  EditBase,
  Form,
  useEditContext,
  type MutationMode,
} from "ra-core";
import { Card, CardContent } from "@/components/ui/card";

import type { Lifeguard } from "../types";
import { FormToolbar } from "../layout/FormToolbar";
import { LifeguardInputs } from "./LifeguardInputs";

export const LifeguardEdit = ({
  mutationMode,
}: {
  mutationMode?: MutationMode;
}) => (
  <EditBase redirect="show" mutationMode={mutationMode}>
    <LifeguardEditContent />
  </EditBase>
);

const normalize = (record: Lifeguard) => ({
  ...record,
  certifications: Array.isArray(record.certifications)
    ? record.certifications
    : [],
  regions: Array.isArray(record.regions) ? record.regions : [],
});

const LifeguardEditContent = () => {
  const { isPending, record } = useEditContext<Lifeguard>();
  if (isPending || !record) return null;
  return (
    <div className="mt-2 flex gap-8">
      <Form
        className="flex flex-1 flex-col gap-4"
        record={normalize(record)}
      >
        <Card>
          <CardContent>
            <LifeguardInputs />
            <FormToolbar />
          </CardContent>
        </Card>
      </Form>
    </div>
  );
};
