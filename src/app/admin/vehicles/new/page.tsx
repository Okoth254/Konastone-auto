import { redirect } from "next/navigation";

export default function NewVehicleCompatibilityRoute() {
  redirect("/admin/vehicles/edit/new");
}
