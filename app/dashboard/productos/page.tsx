
"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Pencil, Trash2, Plus } from "lucide-react";

type Product = {
  id: string;
  category: string;
  name: string;
  price_unit: number;
  price_docena?: number;
  price_media_docena?: number;
  stock_min?: number;
  stock_init?: number;
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>(
    [
      {
        id: "1",
        category: "Galleta",
        name: "Galletas de chocolate",
        price_unit: 12,
        price_docena: 140,
        price_media_docena: 70,
        stock_min: 10,
        stock_init: 40,
      },
      {
        id: "2",
        category: "Bebida caliente",
        name: "Cafe americano",
        price_unit: 12,
        stock_init: 40,
      },
      {
        id: "3",
        category: "Refresco",
        name: "Coca cola",
        price_unit: 12,
        stock_init: 40,
      },
      {
        id: "4",
        category: "Bebida fria",
        name: "Limonada",
        price_unit: 12,
        stock_init: 40,
      },
      {
        id: "5",
        category: "Galleta",
        name: "Galletas de vainilla",
        price_unit: 12,
        price_docena: 140,
        price_media_docena: 70,
        stock_init: 40,
      },
      {
        id: "6",
        category: "Galleta",
        name: "Galletas de limon",
        price_unit: 12,
        price_docena: 140,
        price_media_docena: 70,
        stock_init: 40,
      },
    ] as Product[]
  );

  
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    category: "",
    name: "",
    price_unit: "",
    price_docena: "",
    price_media_docena: "",
    stock_min: "",
    stock_init: "",
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  }

  function resetForm() {
    setForm({
      category: "",
      name: "",
      price_unit: "",
      price_docena: "",
      price_media_docena: "",
      stock_min: "",
      stock_init: "",
    });
  }

  function handleCreate(e?: React.FormEvent) {
    e?.preventDefault();
    if (!form.name || !form.price_unit) {
      alert("El nombre y el precio por unidad son obligatorios");
      return;
    }
    const newProduct: Product = {
      id: String(Date.now()),
      category: form.category || "Sin categoria",
      name: form.name,
      price_unit: Number(form.price_unit),
      price_docena: form.price_docena ? Number(form.price_docena) : undefined,
      price_media_docena: form.price_media_docena
        ? Number(form.price_media_docena)
        : undefined,
      stock_min: form.stock_min ? Number(form.stock_min) : undefined,
      stock_init: form.stock_init ? Number(form.stock_init) : undefined,
    };
    setProducts((p) => [newProduct, ...p]);
    setOpen(false);
    resetForm();
  }

  function handleDelete(id: string) {
    if (!confirm("¿Eliminar producto?")) return;
    setProducts((p) => p.filter((x) => x.id !== id));
  }

  return (
    <div className="p-6">
      
      <div className="flex items-start justify-between mb-8">
        <h1 className="text-2xl font-serif">Gestión de Productos</h1>

        <div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#3f51b5] hover:bg-[#3647a8] text-white px-4 py-3 rounded-md flex items-center gap-2">
                <span>Nuevo producto</span>
                <Plus className="w-5 h-5" />
              </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle className="text-center text-xl text-[#3f51b5]">
                  Registro productos
                </DialogTitle>
                <DialogDescription className="text-center mb-4">
                  Completa los datos para registrar un producto
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleCreate} className="space-y-4 py-2">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label htmlFor="category">Categoria</Label>
                    <Select
                      onValueChange={(v) => setForm((s) => ({ ...s, category: v }))}
                      value={form.category}
                    >
                      <SelectTrigger id="category" className="w-full">
                        <SelectValue placeholder="Categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Galleta">Galleta</SelectItem>
                        <SelectItem value="Bebida caliente">
                          Bebida caliente
                        </SelectItem>
                        <SelectItem value="Bebida fria">Bebida fria</SelectItem>
                        <SelectItem value="Refresco">Refresco</SelectItem>
                        <SelectItem value="Otro">Otro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="name">Nombre</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Nombre"
                      value={form.name}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <Label htmlFor="price_unit">Precio unidad</Label>
                    <Input
                      id="price_unit"
                      name="price_unit"
                      placeholder="Precio unidad"
                      value={form.price_unit}
                      onChange={handleChange}
                      type="number"
                      step="0.01"
                    />
                  </div>

                  <div>
                    <Label htmlFor="price_docena">Docena</Label>
                    <Input
                      id="price_docena"
                      name="price_docena"
                      placeholder="Docena"
                      value={form.price_docena}
                      onChange={handleChange}
                      type="number"
                      step="0.01"
                    />
                  </div>

                  <div>
                    <Label htmlFor="price_media_docena">Media docena</Label>
                    <Input
                      id="price_media_docena"
                      name="price_media_docena"
                      placeholder="Media docena"
                      value={form.price_media_docena}
                      onChange={handleChange}
                      type="number"
                      step="0.01"
                    />
                  </div>

                  <div>
                    <Label htmlFor="stock_min">Stock mínimo</Label>
                    <Input
                      id="stock_min"
                      name="stock_min"
                      placeholder="Stock mínimo"
                      value={form.stock_min}
                      onChange={handleChange}
                      type="number"
                    />
                  </div>

                  <div>
                    <Label htmlFor="stock_init">Stock inicial</Label>
                    <Input
                      id="stock_init"
                      name="stock_init"
                      placeholder="Stock inicial"
                      value={form.stock_init}
                      onChange={handleChange}
                      type="number"
                    />
                  </div>
                </div>

                <DialogFooter className="flex items-center justify-between mt-2">
                  <Button
                    variant="destructive"
                    onClick={() => {
                      setOpen(false);
                      resetForm();
                    }}
                    type="button"
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-3"
                  >
                    Cancelar
                  </Button>

                  <Button
                    type="submit"
                    className="bg-[#3f51b5] hover:bg-[#3647a8] text-white px-6 py-3"
                  >
                    Aceptar
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

    
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((p) => (
          <Card key={p.id} className="p-4 bg-gray-100 rounded-lg relative">
            
            <div className="absolute top-3 right-3 flex items-center gap-3">
              <button
                title="Editar"
                onClick={() => alert("Editar (implementar en proceso)")}
                className="text-blue-600"
              >
                <Pencil />
              </button>
              <button
                title="Eliminar"
                onClick={() => handleDelete(p.id)}
                className="text-red-600"
              >
                <Trash2 />
              </button>
            </div>

            <CardHeader className="p-0 mb-2">
              <CardTitle className="text-sm text-gray-600">{p.category}</CardTitle>
            </CardHeader>

            <CardContent className="p-0">
              <h3 className="text-lg font-medium mb-3">{p.name}</h3>

              <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
                <div>Precio unidad:</div>
                <div className="text-right">Bs. {p.price_unit}</div>

                <div>Docena:</div>
                <div className="text-right">
                  {p.price_docena ? `Bs. ${p.price_docena}` : "-"}
                </div>

                <div>Media docena:</div>
                <div className="text-right">
                  {p.price_media_docena ? `Bs. ${p.price_media_docena}` : "-"}
                </div>

                <div>Stock:</div>
                <div className="text-right">{p.stock_init ?? 0} unidades</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
