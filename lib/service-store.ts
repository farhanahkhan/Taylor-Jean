export interface Service {
  id: string;
  serviceName: string;
  description: string;
  price: number;
  isActive: boolean;
  createdDate: string;
}

let services: Service[] = [];

export function getServices(): Service[] {
  return [...services]; // currently empty
}

export function addService(
  service: Omit<Service, "id" | "createdDate">
): Service {
  const newService: Service = {
    ...service,
    id: Date.now().toString(),
    createdDate: new Date().toISOString(),
    isActive: true,
  };
  services = [newService, ...services];
  return newService;
}

export function updateService(id: string, updates: Partial<Service>): void {
  services = services.map((s) => (s.id === id ? { ...s, ...updates } : s));
}

export function deleteService(id: string): void {
  services = services.filter((s) => s.id !== id);
}
