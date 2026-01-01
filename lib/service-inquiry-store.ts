export interface ServiceInquiry {
  id: string;
  fullName: string;
  email: string;
  charterDate: string;
  charterType: string;
  amount: number;
  status: string;
  contact: string;
}

let serviceInquiries: ServiceInquiry[] = [
  {
    id: "1",
    fullName: "ammar iqbal",
    email: "ammariqbal366@gmail.com",
    contact: "03152845678",
    charterDate: "2025-12-18",
    charterType: "Private Charter",
    amount: 0,
    status: "Pending",
  },
  {
    id: "2",
    fullName: "ammar iqbal",
    email: "ammariqbal366@gmail.com",
    contact: "03152845678",
    charterDate: "2025-12-18",
    charterType: "Private Charter",
    amount: 0,
    status: "Pending",
  },
];

export function getServiceInquiries(): ServiceInquiry[] {
  return serviceInquiries;
}

export function updateServiceInquiry(
  id: string,
  data: Partial<ServiceInquiry>
): void {
  serviceInquiries = serviceInquiries.map((inquiry) =>
    inquiry.id === id ? { ...inquiry, ...data } : inquiry
  );
}

export function deleteServiceInquiry(id: string): void {
  serviceInquiries = serviceInquiries.filter((inquiry) => inquiry.id !== id);
}
