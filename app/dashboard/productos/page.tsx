// app/dashboard/productos/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Pencil, Trash2, Plus } from "lucide-react";
import api from "@/lib/api";
import { toast } from "sonner";

// Importar tabla de Shadcn
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Product = {
  id: string;
  nombre: string;
  descripcion?: string;
  precio: number;
  categoria: string;
  codigo_barra?: string;
  stock_actual: number;
  created_at: string;
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [categoriaFilter, setCategoriaFilter] = useState("");

  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    categoria: "",
    codigo_barra: "",
  });

  const loadProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (categoriaFilter) params.append("categoria", categoriaFilter);

      const data = await api(`/productos?${params.toString()}`);
      setProducts(data);
    } catch (error) {
      // toast ya lo maneja
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [search, categoriaFilter]);

  const resetForm = () => {
    setForm({
      nombre: "",
      descripcion: "",
      precio: "",
      categoria: "",
      codigo_barra: "",
    });
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nombre || !form.precio || !form.categoria) {
      toast.error("Campos obligatorios faltantes");
      return;
    }

    try {
      if (editingId) {
        await api(`/productos/${editingId}`, {
          method: "PUT",
          body: JSON.stringify({
            nombre: form.nombre,
            descripcion: form.descripcion || undefined,
            precio: Number(form.precio),
            categoria: form.categoria,
            codigo_barra: form.codigo_barra || undefined,
          }),
        });
        toast.success("Éxito", { description: "Producto actualizado" });
      } else {
        await api("/productos", {
          method: "POST",
          body: JSON.stringify({
            nombre: form.nombre,
            descripcion: form.descripcion || undefined,
            precio: Number(form.precio),
            categoria: form.categoria,
            codigo_barra: form.codigo_barra || undefined,
          }),
        });
        toast.success("Éxito", { description: "Producto creado" });
      }
      setOpen(false);
      resetForm();
      loadProducts();
    } catch (error) {
      // toast ya lo maneja
    }
  };

  const handleEdit = (product: Product) => {
    setForm({
      nombre: product.nombre,
      descripcion: product.descripcion || "",
      precio: String(product.precio),
      categoria: product.categoria,
      codigo_barra: product.codigo_barra || "",
    });
    setEditingId(product.id);
    setOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar este producto?")) return;
    try {
      await api(`/productos/${id}`, { method: "DELETE" });
      toast.success("Éxito", { description: "Producto eliminado" });
      loadProducts();
    } catch (error) {
      // toast ya lo maneja
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Productos</h1>
        <Button
          onClick={() => {
            resetForm();
            setOpen(true);
          }}
          className="bg-[#3F51B5]"
        >
          <Plus className="mr-2 h-4 w-4" /> Nuevo Producto
        </Button>
      </div>

      <div className="mb-6 flex gap-4">
        <Input
          placeholder="Buscar por nombre o código..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <Input
          placeholder="Filtrar por categoría"
          value={categoriaFilter}
          onChange={(e) => setCategoriaFilter(e.target.value)}
          className="max-w-xs"
        />
      </div>

      {loading ? (
        <div className="text-center py-10">Cargando productos...</div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Precio (Bs.)</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Código</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>{p.nombre}</TableCell>
                  <TableCell>{p.categoria}</TableCell>
                  <TableCell>{p.precio}</TableCell>
                  <TableCell>{p.stock_actual}</TableCell>
                  <TableCell>{p.codigo_barra || "-"}</TableCell>
                  <TableCell className="flex gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEdit(p)}
                    >
                      <Pencil className="h-4 w-4 text-blue-600" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(p.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Dialog para crear/editar */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingId ? "Editar" : "Nuevo"} Producto</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Nombre *</Label>
              <Input
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                required
              />
            </div>
            <div>
              <Label>Categoría *</Label>
              <Input
                value={form.categoria}
                onChange={(e) =>
                  setForm({ ...form, categoria: e.target.value })
                }
                required
              />
            </div>
            <div>
              <Label>Precio *</Label>
              <Input
                type="number"
                step="0.01"
                value={form.precio}
                onChange={(e) =>
                  setForm({ ...form, precio: e.target.value })
                }
                required
              />
            </div>
            <div>
              <Label>Descripción</Label>
              <Input
                value={form.descripcion}
                onChange={(e) =>
                  setForm({ ...form, descripcion: e.target.value })
                }
              />
            </div>
            <div>
              <Label>Código de barras</Label>
              <Input
                value={form.codigo_barra}
                onChange={(e) =>
                  setForm({ ...form, codigo_barra: e.target.value })
                }
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" className="bg-[#3F51B5]">
                {editingId ? "Actualizar" : "Crear"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}