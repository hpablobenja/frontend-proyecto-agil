 
"use client";

import React, { useMemo, useState } from "react";
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
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, DollarSign } from "lucide-react";


type Product = {
  id: string;
  name: string;
  price_unit: number;
  price_media_docena?: number; 
  price_docena?: number; 
};

type Sale = {
  id: string;
  productId: string;
  unitType: "unidad" | "media_docena" | "docena";
  qty: number;
  unitPrice: number;
  total: number;
  actor?: string;
  date: string;
};

export default function SalesPage() {
  
  const [products] = useState<Product[]>(() => [
    { id: "1", name: "Galleta chocolate", price_unit: 17, price_media_docena: 102, price_docena: 204 },
    { id: "2", name: "Galleta vainilla", price_unit: 15, price_media_docena: 90, price_docena: 180 },
  ]);

  
  const [sales, setSales] = useState<Sale[]>(() => {
    const now = new Date();
    return [
      {
        id: "s1",
        productId: "1",
        unitType: "unidad",
        qty: 2,
        unitPrice: 17,
        total: 34,
        actor: "vendedor",
        date: now.toISOString(),
      },
    ];
  });

  
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    productId: "",
    unitType: "unidad",
    qty: "1",
    actor: "",
    note: "",
  });

  
  const totalIncome = useMemo(() => sales.reduce((s, v) => s + v.total, 0), [sales]);

  function resetForm() {
    setForm({ productId: "", unitType: "unidad", qty: "1", actor: "", note: "" });
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  }

  function computeUnitPrice(product: Product, unitType: Sale["unitType"]) {
    
    if (unitType === "unidad") return product.price_unit;
    if (unitType === "media_docena") {
      if (product.price_media_docena) return product.price_media_docena / 6;
      if (product.price_unit) return product.price_unit; 
    }
    if (unitType === "docena") {
      if (product.price_docena) return product.price_docena / 12;
      if (product.price_unit) return product.price_unit;
    }
    return product.price_unit;
  }

  function handleCreateSale(e?: React.FormEvent) {
    e?.preventDefault();
    if (!form.productId) {
      alert("Selecciona un producto");
      return;
    }
    const qty = Number(form.qty);
    if (!qty || qty <= 0) {
      alert("Cantidad inválida");
      return;
    }
    const product = products.find((p) => p.id === form.productId)!;
    if (!product) return;
    const unitPrice = computeUnitPrice(product, form.unitType as Sale["unitType"]);
    const total = parseFloat((unitPrice * qty).toFixed(2));
    const newSale: Sale = {
      id: String(Date.now()),
      productId: product.id,
      unitType: form.unitType as Sale["unitType"],
      qty,
      unitPrice,
      total,
      actor: form.actor || "vendedor",
      date: new Date().toISOString(),
    };
    setSales((s) => [newSale, ...s]);
    setOpen(false);
    resetForm();
  }

  
  function getProductById(id: string) {
    return products.find((p) => p.id === id);
  }

  function formatDateTime(iso: string) {
    const d = new Date(iso);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");
    return { date: `${day}/${month}/${year}`, time: `${hours}:${minutes}` };
  }

  return (
    <div className="p-6">
      <div className="flex items-start justify-between mb-6">
        <h1 className="text-2xl font-serif">Registro de ventas</h1>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#3f51b5] hover:bg-[#3647a8] text-white px-4 py-3 rounded-md flex items-center gap-2">
              <span>Nueva venta</span>
              <Plus className="w-5 h-5" />
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-center text-xl text-[#3f51b5]">Registrar venta</DialogTitle>
              <DialogDescription className="text-center mb-4">Registro rápido de ventas</DialogDescription>
            </DialogHeader>

            <form onSubmit={handleCreateSale} className="space-y-4 py-2">
              <div>
                <Label htmlFor="product">Seleccione producto</Label>
                <Select
                  onValueChange={(v) => setForm((s) => ({ ...s, productId: v }))}
                  value={form.productId}
                >
                  <SelectTrigger id="product" className="w-full">
                    <SelectValue placeholder="Seleccione producto" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="unitType">Unidad de venta</Label>
                <Select
                  onValueChange={(v) => setForm((s) => ({ ...s, unitType: v }))}
                  value={form.unitType}
                >
                  <SelectTrigger id="unitType" className="w-full">
                    <SelectValue placeholder="Unidad de venta" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unidad">Unidad</SelectItem>
                    <SelectItem value="media_docena">Media docena</SelectItem>
                    <SelectItem value="docena">Docena</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="qty">Cantidad</Label>
                <Input id="qty" name="qty" type="number" min={1} value={form.qty} onChange={handleChange} />
              </div>

              <div>
                <Label htmlFor="actor">Vendido por</Label>
                <Input id="actor" name="actor" value={form.actor} onChange={handleChange} placeholder="vendedor" />
              </div>

              <div>
                <Label htmlFor="note">Nota (opcional)</Label>
                <Textarea id="note" name="note" value={form.note} onChange={handleChange} rows={3} />
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

                <Button type="submit" className="bg-[#3f51b5] hover:bg-[#3647a8] text-white px-6 py-3">
                  Aceptar
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mb-4 text-sm">
        <span className="mr-2">Ingresos totales:</span>
        <strong>Bs. {totalIncome.toFixed(2)}</strong>
      </div>

      <div className="space-y-6">
        {sales.length === 0 && <div className="text-sm text-gray-500">No hay ventas</div>}

        {sales.map((s) => {
          const prod = getProductById(s.productId);
          const dt = formatDateTime(s.date);
          return (
            <div key={s.id} className="bg-[#e6e6e6] p-6 flex items-start gap-6">
              <div className="shrink-0 text-green-500">
                <DollarSign className="w-7 h-7" />
              </div>

              <div className="flex-1">
                <h3 className="font-medium text-lg">{prod?.name ?? "—"}</h3>

                <div className="mt-2 text-sm text-gray-700 space-y-1">
                  <div>Cantidad: {s.qty} unidades</div>
                  <div>Precio unitario: Bs. {s.unitPrice}</div>
                  <div>Total: Bs. {s.total}</div>
                  {s.actor && <div>Vendido por: {s.actor}</div>}
                  {s && (
                    <div className="text-xs text-gray-500 mt-1">
                      {dt.date} — {dt.time}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
