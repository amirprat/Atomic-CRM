import { CreateBase, Form, type MutationMode } from "ra-core";
import { Card, CardContent } from "@/components/ui/card";

import { FormToolbar } from "../layout/FormToolbar";
import { LifeguardInputs } from "./LifeguardInputs";

export const LifeguardCreate = ({
  mutationMode,
}: {
  mutationMode?: MutationMode;
}) => (
  <CreateBase redirect="show" mutationMode={mutationMode}>
    <div className="mt-2 flex">
      <div className="flex-1">
        <Form
          defaultValues={{
            active: true,
            certifications: [],
            regions: [],
          }}
        >
          <Card>
            <CardContent>
              <LifeguardInputs />
              <FormToolbar />
            </CardContent>
          </Card>
        </Form>
      </div>
    </div>
  </CreateBase>
);
