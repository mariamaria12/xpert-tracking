import { getActiveHomePanelsData } from "@/lib/services/home/home.service";

import ActiveClientsPanel from "./ActiveClientsPanel";

export default async function ActiveClientsSection() {
  const { activeClients } = await getActiveHomePanelsData();
  return <ActiveClientsPanel clients={activeClients} />;
}
