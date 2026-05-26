import { apiFetch } from "./api";
import { products as localProducts } from "../data/products";

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  notes: {
    salida: string;
    corazon: string;
    fondo: string;
  };
  // We keep the db fields if needed by backend calls elsewhere
  id_producto?: number;
  nombre?: string;
  categoria?: string;
  stock?: number;
  proveedor?: string;
  id_proveedor?: number;
}

function attachLocalData(dbProduct: any): Product {
  // Try to find matching image from local products by comparing names
  const match = localProducts.find(lp => 
    dbProduct.nombre.toLowerCase().includes(lp.name.toLowerCase()) || 
    lp.name.toLowerCase().includes(dbProduct.nombre.toLowerCase())
  );
  
  return {
    id: dbProduct.id_producto.toString(),
    name: dbProduct.nombre,
    price: parseFloat(dbProduct.precio),
    image: match ? match.image : localProducts[0].image,
    description: match ? match.description : dbProduct.categoria,
    notes: match ? match.notes : { salida: "Cítricos", corazon: dbProduct.categoria, fondo: "Amaderado" },
    id_producto: dbProduct.id_producto,
    nombre: dbProduct.nombre,
    categoria: dbProduct.categoria,
    stock: dbProduct.stock,
    proveedor: dbProduct.proveedor,
    id_proveedor: dbProduct.id_proveedor,
  };
}

export async function fetchProducts(): Promise<Product[]> {
  const res = await apiFetch("/products");
  if (!res.ok) throw new Error('Error al obtener productos');
  const data = await res.json();
  
  // Filter out dummy data that has no matching image
  const matchedData = data.filter((dbProduct: any) => {
    return localProducts.some(lp => 
      dbProduct.nombre.toLowerCase().includes(lp.name.toLowerCase()) || 
      lp.name.toLowerCase().includes(dbProduct.nombre.toLowerCase())
    );
  });
  
  return matchedData.map(attachLocalData);
}

export async function fetchProductById(id: string): Promise<Product> {
  const res = await apiFetch(`/products/${id}`);
  if (!res.ok) throw new Error('Producto no encontrado');
  const data = await res.json();
  return attachLocalData(data);
}