"use client";

import { useParams } from "next/navigation";
import AddProductPage from "../page";

export default function EditProductPage() {
  const params = useParams();
  const editId = params?.id as string;

  return <AddProductPage editId={editId} />;
}
