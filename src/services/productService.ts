import { apiFetch } from "./api";

export interface Product {
  id_producto: number;
  nombre: string;
  categoria: string;
  precio: number;
  stock: number;
  proveedor?: string;
  id_proveedor: number;
}

export async function fetchProducts(): Promise<Product[]> {
  const res = await apiFetch("/products");
  if (!res.ok) throw new Error('Error al obtener productos');
  return res.json();
}

export async function fetchProductById(id: string): Promise<Product> {
  const res = await apiFetch(`/products/${id}`);
  if (!res.ok) throw new Error('Producto no encontrado');
  return res.json();
}